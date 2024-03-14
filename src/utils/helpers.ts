import input from 'input';
import { Api, TelegramClient } from 'telegram';
import { TAdvertiseMessage } from '../advertise-messages';
import { MAX_MESSAGES_BEFORE_FREE_CHANNEL, MAX_TIME_TO_WAITING_FOR_SIGNAL } from '../constants';
import { TDestinationListData } from '../destination-list';
import { howToTradeMessages } from '../how-to-trade-messages';
import { TReportsController } from '../report';
import { findChannelBySignal, setChannelWaitingForSignal } from './handle-channels';
import { TReport, TTimeFrame, formatReportMessage } from './handle-message';
import { msgsByTimeFrameCount } from './messagesCountController';

type TMessage = {
  message: string,
}

export type TMakeCounter = ReturnType<typeof makeCounter>;

const { 
	increment: incrementHowToTradeMessageIndex,
	reset: resetHowToTradeMessageIndex,
	value: getHowToTradeMessageIndexValue,
} = makeCounter();

export async function listContacts(client: TelegramClient) {
	try {

		const apiContacts = await client.invoke(
			new Api.contacts.GetContacts({})
		) as unknown as { users: Api.User[]};


		const contacts = apiContacts?.users?.map((user) => ({
			firstName: user.firstName,
			phone: user.phone,
			id: parseInt(String(user.id))
		}));

		return contacts;

	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function initialSetup(client: TelegramClient) {
	await client.start({
		phoneNumber: async () => await input.text('Please enter your number: '),
		password: async () => await input.text('Please enter your password: '),
		phoneCode: async () =>
			await input.text('Please enter the code you received: '),
		onError: (err) => console.log(err),
	});
	console.log('You should now be connected.');
	console.log(client.session.save());

}

export async function listDialogs(client: TelegramClient) {
	const apiDialogs = await client.getDialogs();

	const dialogs = apiDialogs.map((d) => ({
		type: d?.entity?.className,
		id: d?.entity?.id,
		name: (
			(d.entity?.className === 'Chat' || d?.entity?.className === 'Channel')
				? d.entity.title
				: (d.entity?.className === 'User') ? d?.entity?.firstName : 'N/A'
		)
	}));

	return dialogs;
}

export async function sendMessagesToDestinationList(client: TelegramClient, messageObj: TMessage, destinationListArray: TDestinationListData[]) {

	const replaceBroker = (mixedChannel: boolean, msg: string) => {
		if(mixedChannel === true) return ({ message: msg });
		return ({
			message: msg.replace(/🏛️.*?\n{1,3}/g, ''),
		});		 
	};

	const promises = destinationListArray.map((dest) => client.sendMessage(dest.id, replaceBroker(dest.mixedChannel, messageObj.message)));
	try {
		await Promise.all(promises);		
	} catch (error) {
		console.log(error);				
	}
}

export async function sendAdvertiseMessageToDestinationList(client: TelegramClient, destItem: TDestinationListData, advertiseMessages: TAdvertiseMessage) {  
	const { increment: incrementIndex, reset: resetIndex, value: indexValue } = destItem.advertiseMsgIndexController;
	const { messages } = advertiseMessages;
	
	if(indexValue() >= messages.length) {
		resetIndex();
		console.log('reset value');		
	}

	const currentMessage = messages[indexValue()];
	incrementIndex();
	
	try {
		await client.sendMessage(destItem.id, currentMessage);
	} catch (error) {
		console.log(error);
	}
}

export async function sendHowToTradeMessageToDestinationList(client: TelegramClient, destinationListArray: TDestinationListData[]) {
	if(getHowToTradeMessageIndexValue() >= howToTradeMessages.length) {
		resetHowToTradeMessageIndex();
	}

	const currentMessage = howToTradeMessages[getHowToTradeMessageIndexValue()];   
	const promises = destinationListArray.map((dest) => client.sendMessage(dest.id, currentMessage));
	await Promise.all(promises);
	incrementHowToTradeMessageIndex();
}

export async function sendReportMessageToDestinationList(client: TelegramClient, destList: TDestinationListData[], msgObj: TMessage) {
	const promises = destList.map((dest) => client.sendMessage(dest.id, msgObj));
	try {
		await Promise.all(promises);
	} catch (error) {
		console.log(error);		
	}
}

export async function sendMandatoryMessage(client: TelegramClient, destinationListArray: TDestinationListData[]) {
	const msgOb = {
		message: '🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n' +'\n' +
    '⚠️ ATENÇÃO, TEREMOS UM SINAL EM INSTANTES 🕐\n' +'\n' +
    '💥 Fiquem Atentos 📊',
	};

	const promises = destinationListArray.map((dest) => client.sendMessage(dest.id, msgOb));
	await Promise.all(promises);
}

export function makeCounter() {	
	let count = 0;
	return Object.freeze({
		value: () => count,
		increment: () => count++,
		reset: () => count = 0,
	});	
}

export function makeSignalTimeout() {
	let signalTimeout: NodeJS.Timeout | null = null;
	function clearSignalTimeout() {
		if (signalTimeout) clearTimeout(signalTimeout);
		return signalTimeout = null;
	}

	function createSignalTimeout() {
		return signalTimeout = setTimeout(() => {
			console.log('reset signal');
			const channelBySignal = findChannelBySignal(true);
			if (channelBySignal) setChannelWaitingForSignal(channelBySignal.id, false);
			clearSignalTimeout();
		}, MAX_TIME_TO_WAITING_FOR_SIGNAL);
	}

	return Object.freeze({
		createSignalTimeout,
		clearSignalTimeout,
		get: () => signalTimeout,
	});
}

export function makeIsSendingMessage() {
	let isSendingMessage = false;
	return Object.freeze({
		set: (isSending: boolean) => isSendingMessage = isSending,
		get: () => isSendingMessage,
	});
}

export function isBreakTime(date?: Date) {
	const currentDate = date || new Date(changeTimeZone(new Date(), 'America/Sao_Paulo'));
	const hours = currentDate.getHours();		
	return (hours >= 19 && hours < 22);
}

export function isFreeChannelWorkingTime(date?: Date) {
	const currentDate = date || changeTimeZone(new Date(), 'America/Sao_Paulo');	
	const hours = currentDate.getHours();
	const minutes = currentDate.getMinutes();
	const allowedHours = (hours >= 15 && hours < 19);
	const allowedHoursMinutes = hours === 15 ? minutes >= 30 : true;
	return (allowedHours && allowedHoursMinutes);
}

export function applyFunctionAsync<T, R>(
	array: T[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	func: (...args: any[]) => R,
	...params: Parameters<typeof func>
): Promise<R[]> {
	return new Promise((resolve, reject) => {
		try {
			const resultArray: R[] = array.map((item) => func(...params, item));
			resolve(resultArray);
		} catch (error) {
			reject(error);
		}
	});
}

export function filterFreeChannels(destinationListArray: TDestinationListData[], filter?: boolean) {
	if(filter) return destinationListArray.filter((list) => list.classification !== 'Free');
	const isCountEqualToMaxMsgs = (msgsByTimeFrameCount['M1'].value() >= MAX_MESSAGES_BEFORE_FREE_CHANNEL);	
	
	const filteredArray = destinationListArray.filter((list: TDestinationListData) => {
		if (list.classification === 'Vip') return true;
		if (isCountEqualToMaxMsgs && !list.hasWorkingTime) return true;
		if (list.hasWorkingTime && isFreeChannelWorkingTime() && isCountEqualToMaxMsgs) return true;
		return false;
	}, []);

	return filteredArray;
}

export function handleMsgCount(destinationListArray: TDestinationListData[][]) {
	for (const destinationItem of destinationListArray) {
		for (const { msgCounter, advertiseMsgCount } of destinationItem) {			
			if(msgCounter.value() < advertiseMsgCount) {
				msgCounter.increment();
			}		
		}		
	}
}

export async function handleSendAdvertiseMessage(client: TelegramClient, advtMsgs: TAdvertiseMessage, destList: TDestinationListData[]) {	
	for await (const destItem of destList) {		
		if(destItem.msgCounter.value() >= destItem.advertiseMsgCount) {
			await sendAdvertiseMessageToDestinationList(client, destItem, advtMsgs);
			destItem.msgCounter.reset();
		}
	}
}

export function makeReportController() {
	const controller = {
		M1: {
			controller: makeController(),
			minResults: 10,
		},
		M5:{
			controller: makeController(),
			minResults: 5,
		},
		M15: {
			controller: makeController(),
			minResults: 5,
		}
	} as const;

	return Object.freeze({
		addReport,
		cleanReports,
		getReports,
		shouldSendReport
	});

	function addReport(key: keyof typeof controller, data: TReport) {
		return controller[key].controller.reports.push(data);
	}

	function cleanReports(key: keyof typeof controller) {
		const reports = controller[key].controller.reports;
		return reports.splice(0, reports.length);
	}

	function getReports(key: keyof typeof controller) {
		return controller[key].controller.reports;
	}

	function getMinResult(key: keyof typeof controller) {
		return controller[key].minResults;
	}

	function shouldSendReport(key: keyof typeof controller) {
		const reportsByKeyLength = getReports(key).length;
		const minReportsResults = getMinResult(key);
		return reportsByKeyLength >= minReportsResults;
	}

	function makeController() {
		return {
			add: addReport,
			clean: cleanReports,
			get: getReports, 
			reports: [] as TReport[],
		};
	}
}

type TSendReportMsg = {
	client: TelegramClient,
	timeFrame: TTimeFrame,
	reportsController: TReportsController, 
	destChannels: TDestinationListData[][]
}

function addDataToReportMessage(reportMsg: string) {
	const msgHeader = '**VEM GANHAR DINHEIRO COM A GENTE NA SALA VIP IQ OPTION...👇👇👇**\n\n';
	const msgFooter =
	'\n\n'+
	'🤑🤑🤑\n' +
	'👇👇👇\n\n'+
	'Chama no Suporte:\n\n'+
	'https://wa.me/message/RMWFMXEKWKD3B1';	

	const finalReportMsg = msgHeader + reportMsg + msgFooter;
	return finalReportMsg;
}

export async function sendReportMessage(params: TSendReportMsg) {
	const { client, reportsController, timeFrame, destChannels } = params;
	const reportMsgObj = createReportMessage(timeFrame);
	if(!client.connected || !reportMsgObj) return;

	const mixedChannelReportMessage = addDataToReportMessage(reportMsgObj.message);
	const mxdChannelMsgObj = { message: mixedChannelReportMessage };
	const mixedChannel = destChannels.flat().filter((d) => d.mixedChannel === true);

	const receptors = destChannels.map((channel) => filterFreeChannels(channel, true));
	const reportsPromises = receptors.map((receptor) => sendReportMessageToDestinationList(client, receptor, reportMsgObj));

	reportsPromises.push(sendReportMessageToDestinationList(client, mixedChannel, mxdChannelMsgObj));
	
	await Promise.allSettled(reportsPromises)
		.catch((err) => console.log(err));

	reportsController.cleanReports(timeFrame);

	function createReportMessage(timeFrame: TTimeFrame) {
		const reports = reportsController.getReports(timeFrame);
		const reportMsg = formatReportMessage(reports, timeFrame);  
		const reportMsgObj = { message: reportMsg };
		if(reports.length === 0) return null;
		return reportMsgObj;
	}
}

export function getTimeFrameByTime(time: string): TTimeFrame {
	const m1Regex = (/\b1\sM/gi);
	const m5Regex = (/\b5\sM/gi);
	const m15Regex = (/\b15\sM/gi);

	if(m1Regex.test(time)) return 'M1';
	if(m5Regex.test(time)) return 'M5';
	if(m15Regex.test(time)) return 'M15';

	return 'M1';
}

export function isM1Channel(id: number) {
	const M1_BOT_ID = -1001625871874;
	return id === M1_BOT_ID;
}

export function getTimeFrameByRoomId(id: number) {
	const M1_BOT_ID = -1001625871874;
	const M5_BOT_ID = -1001630460062;
	const M15_BOT_ID = -1002071113577;
	const MY_ID = -1002137003427;

	if(M1_BOT_ID === id || MY_ID === id) return 'M1';
	if(M5_BOT_ID === id) return 'M5';
	if(M15_BOT_ID === id) return 'M15';
}

export function changeTimeZone(date: Date | string, timeZone: string) {
	if (typeof date === 'string') {
		return new Date(
			new Date(date).toLocaleString('en', {
				timeZone,
			}),
		);
	}

	return new Date(
		date.toLocaleString('en', {
			timeZone,
		}),
	);
}