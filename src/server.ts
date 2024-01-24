import { Api } from 'telegram';
import { NewMessage, NewMessageEvent } from 'telegram/events';

import {
	communityOfTradersIqOptionDestListIds,
	topSignalsIqOptionDestListIds
} from './destination-list';

import {
	applyFunctionAsync,
	filterFreeChannels,
	getTimeFrameByTime,
	handleMsgCount,
	handleSendAdvertiseMessage,
	isBreakTime,
	makeCounter,
	makeIsSendingMessage,
	makeSignalTimeout,
	sendMandatoryMessage,
	sendMessagesToDestinationList
} from './utils/helpers';

import {
	checkIfMessageHasSignal,
	checkIfSignalMessageIsCallOrPut,
	checkIfStickIsCallOrPut,
	createNewSignalMessage,
	createTradeSignalMessage,
	extractDataFromEspecialChannelMessage,
	extractDataFromMessage,
	extractDataFromMessageEvent,
	extractResultFromMessage,
	isResultMessage,
	isSticker,
	isValidMessage
} from './utils/handle-message';

import {
	checkIfMessageIsFromDifferentChannel,
	findChannelById,
	findChannelBySignal,
	isIqOptionChannel,
	setChannelWaitingForSignal
} from './utils/handle-channels';

import {
	communityOfTradersIqOptionAdvertiseMessages,
	topSignalsIqOptionAdvertiseMessages,
} from './advertise-messages';

import {
	MAX_MESSAGES_BEFORE_FREE_CHANNEL
} from './constants';
import { initiateReportCron } from './cron/reports-cron';
import { reportsController } from './report';
import { client } from './telegram';
import { msgsByTimeFrameCount } from './utils/messagesCountController';

const {
	set: setIsSendingMessage,
	get: getIsSendingMessage,
} = makeIsSendingMessage();

const {
	clearSignalTimeout,
	createSignalTimeout,
	get: getSignalTimeout,
} = makeSignalTimeout();

// const {
// 	// increment: incrementHowToTradeMsgCount,
// 	reset: resetHowToTradeMsgCount,
// 	value: msgCountToHowToTradeValue,
// } = makeCounter();

const {
	increment: incrementAllMsgCount, 
	reset: resetAllMsgCount,
	value: getAllMsgCount,
} = makeCounter();

initiateReportCron();

(async () => {
	await client.connect();
	await client.getDialogs();
	
	client.addEventHandler(messageHandler, new NewMessage({}));

	async function messageHandler(event: NewMessageEvent) {
		
		if(isBreakTime()) return;

		const messageData = extractDataFromMessageEvent(event);	

		if(messageData.isChannel === false) return;

		if(isIqOptionChannel(messageData.chatId) === false) return;

		if(isResultMessage(messageData.message)) {
			const data = extractResultFromMessage(messageData.message);			
			const timeFrame = getTimeFrameByTime(data.time);
			reportsController.addReport(timeFrame, data);	
			return;	
		}

		const channelById = findChannelById(messageData.chatId);
		const channelBySignal = findChannelBySignal(true);
		
		if(!channelById) return;

		const receptorOne = filterFreeChannels(topSignalsIqOptionDestListIds);
		const receptorTwo = filterFreeChannels(communityOfTradersIqOptionDestListIds);

		const allDestinationList = [receptorOne, receptorTwo];

		if(checkIfMessageIsFromDifferentChannel(channelById, channelBySignal)) return;
		
		if(isValidMessage(messageData.message)) {
			if(channelBySignal?.waitingForSignal && getIsSendingMessage() === false) {
				const signal = checkIfMessageHasSignal(messageData.message);

				if(signal?.length) {
					setIsSendingMessage(true);
					const CALL_PUT_SIGNAL = checkIfSignalMessageIsCallOrPut(signal[0]);
					const CALL_PUT_MESSAGE = createTradeSignalMessage(CALL_PUT_SIGNAL);
					const messageObj = { message: CALL_PUT_MESSAGE };

					await applyFunctionAsync(
						allDestinationList,
						sendMessagesToDestinationList,
						client, messageObj
					);

					await applyFunctionAsync(
						allDestinationList,
						sendMandatoryMessage,
						client
					);

					setChannelWaitingForSignal(channelById.id, false);
					clearSignalTimeout();

					handleMsgCount(allDestinationList);
					incrementAllMsgCount();

					if(getAllMsgCount() > MAX_MESSAGES_BEFORE_FREE_CHANNEL) resetAllMsgCount();

					await handleSendAdvertiseMessage(client, topSignalsIqOptionAdvertiseMessages, topSignalsIqOptionDestListIds);
					await handleSendAdvertiseMessage(client, communityOfTradersIqOptionAdvertiseMessages, communityOfTradersIqOptionDestListIds);

					setIsSendingMessage(false);
				}
				
			} else if(getIsSendingMessage() === false) {
				const { currencyPair, time, hours } = isIqOptionChannel(messageData.chatId)
					? extractDataFromEspecialChannelMessage(messageData.message)
					: extractDataFromMessage(messageData.message);

				if(currencyPair.length && time.length) {
					let signal: RegExpExecArray | null = null;

					if(hours.length > 0) {
						signal = checkIfMessageHasSignal(messageData.message);
					}

					const channelName = channelById.name;
					const signalMessage = createNewSignalMessage({
						currencyPair, time, hours, signal, channelName,
					});
					
					const messageObj = { message: signalMessage };

					if(signal === null || hours.length === 0) {
						setChannelWaitingForSignal(channelById.id, true);
						createSignalTimeout();
						
						await applyFunctionAsync(
							allDestinationList,
							sendMessagesToDestinationList,
							client, messageObj 
						);
					}

					const hasPairTimeAndSignal = ((currencyPair.length) && (time.length) && (hours.length) && (signal?.length));
					const isMessageWithSignal = (hasPairTimeAndSignal && (getIsSendingMessage() === false));

					if(isMessageWithSignal) {
						const timeFrame = getTimeFrameByTime(time);
						const filteredChannels = allDestinationList.map((c) => filterFreeChannels(c, timeFrame !== 'M1'));

						if(timeFrame in msgsByTimeFrameCount) {
							const currentCount = msgsByTimeFrameCount[timeFrame];							
							if(currentCount.value() >= MAX_MESSAGES_BEFORE_FREE_CHANNEL) {
								currentCount.reset();
							} else {
								currentCount.increment();
							}
						}

						incrementAllMsgCount();
						
						setIsSendingMessage(true);
						
						handleMsgCount(filteredChannels);

						await Promise.all(await applyFunctionAsync(
							filteredChannels,
							sendMessagesToDestinationList,
							client, messageObj
						)).catch((err) => console.log(err));

						await Promise.all(await applyFunctionAsync(
							filteredChannels,
							sendMandatoryMessage,
							client
						)).catch((err) => console.log(err));

						if(getAllMsgCount() > MAX_MESSAGES_BEFORE_FREE_CHANNEL) resetAllMsgCount();
						
						await handleSendAdvertiseMessage(client, topSignalsIqOptionAdvertiseMessages, topSignalsIqOptionDestListIds);
						await handleSendAdvertiseMessage(client, communityOfTradersIqOptionAdvertiseMessages, communityOfTradersIqOptionDestListIds);

						setIsSendingMessage(false);
					}
				}

				const signal = checkIfMessageHasSignal(messageData.message);

				if(signal === null || hours.length === 0) {
					if(signal?.length && channelById.waitingForSignal && getIsSendingMessage() === false) {
						setIsSendingMessage(true);

						const CALL_PUT_SIGNAL = checkIfSignalMessageIsCallOrPut(signal[0]);
						const CALL_PUT_MESSAGE = createTradeSignalMessage(CALL_PUT_SIGNAL);
						const messageObj = { message: CALL_PUT_MESSAGE };
						const timeFrame = getTimeFrameByTime(time);

						await applyFunctionAsync(
							allDestinationList,
							sendMessagesToDestinationList,
							client, messageObj, timeFrame
						);

						await applyFunctionAsync(
							allDestinationList,
							sendMandatoryMessage,
							client
						);

						setChannelWaitingForSignal(channelById.id, false);
						clearSignalTimeout();
						setIsSendingMessage(false);
						
						handleMsgCount(allDestinationList);
						// incrementHowToTradeMsgCount();
						incrementAllMsgCount();

						if(getAllMsgCount() > MAX_MESSAGES_BEFORE_FREE_CHANNEL) resetAllMsgCount();

						await handleSendAdvertiseMessage(client, topSignalsIqOptionAdvertiseMessages, topSignalsIqOptionDestListIds);
						await handleSendAdvertiseMessage(client, communityOfTradersIqOptionAdvertiseMessages, communityOfTradersIqOptionDestListIds);

						// if(msgCountToHowToTradeValue() >= MAX_MESSAGES_BEFORE_HOW_TO_TRADE_MESSAGE) {
						// 	await sendHowToTradeMessageToDestinationList(client, communityOfTradersDestinationListIds);
						// 	resetHowToTradeMsgCount();
						// }
					}
				}
			}
		}

		if(isSticker(messageData.media)) {
			const channelBySignal = findChannelBySignal(true);
			const isNotWaitingForSignalOrIsSendingMessage = !channelBySignal || !channelBySignal.waitingForSignal || (getIsSendingMessage() === true);

			if(isNotWaitingForSignalOrIsSendingMessage) return;

			const isCallOrPut = checkIfStickIsCallOrPut(messageData.media as Api.MessageMediaDocument);
			if(isCallOrPut) {
				setIsSendingMessage(true);

				const CALL_PUT = createTradeSignalMessage(isCallOrPut);
				const messageObj = { message: CALL_PUT };				

				await applyFunctionAsync(
					allDestinationList,
					sendMessagesToDestinationList,
					client, messageObj 
				);
				
				setChannelWaitingForSignal(channelById.id, false);

				await applyFunctionAsync(
					allDestinationList,
					sendMandatoryMessage,
					client
				);

				clearSignalTimeout();
				setIsSendingMessage(false);
				
				handleMsgCount(allDestinationList);
				// incrementHowToTradeMsgCount();
				incrementAllMsgCount();

				if(getAllMsgCount() > MAX_MESSAGES_BEFORE_FREE_CHANNEL) resetAllMsgCount();

				await handleSendAdvertiseMessage(client, topSignalsIqOptionAdvertiseMessages, topSignalsIqOptionDestListIds);
				await handleSendAdvertiseMessage(client, communityOfTradersIqOptionAdvertiseMessages, communityOfTradersIqOptionDestListIds);

				// if(msgCountToHowToTradeValue() >= MAX_MESSAGES_BEFORE_HOW_TO_TRADE_MESSAGE) {
				// 	await sendHowToTradeMessageToDestinationList(client, communityOfTradersDestinationListIds);
				// 	resetHowToTradeMsgCount();
				// }
			}
		}

		console.log('waiting for signal: ', channelById?.waitingForSignal);
		console.log('message timeout: ', getSignalTimeout() !== null);
	}
})();
