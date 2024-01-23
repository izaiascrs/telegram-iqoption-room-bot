import input from 'input';
import { Api, TelegramClient } from 'telegram';
import { TAdvertiseMessage } from '../advertise-messages';
import { MAX_TIME_TO_WAITING_FOR_SIGNAL } from '../constants';
import { TDestinationListData } from '../destination-list';
import { howToTradeMessages } from '../how-to-trade-messages';
import { findChannelBySignal, setChannelWaitingForSignal } from './handle-channels';
import { TReport, TTimeFrame } from './handle-message';

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

	const replaceBroker = (mixedRoom: boolean, msg: string) => {
		if(mixedRoom === true) return ({ message: msg });
		return ({
			message: msg.replace(/🏛️.*?\n{1,3}/g, ''),
		});		 
	};

	const promises = destinationListArray.map((dest) => client.sendMessage(dest.id, replaceBroker(dest.mixedRoom, messageObj.message)));
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
		message: '🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n' +
    '\n' +
    '\n' +
    '⚠️ ATENÇÃO ‼️\n' +
    '\n' +
    '\n' +
    'Teremos um novo sinal a qualquer momento📉📈\n' +
    '\n' +
    '👀 👀👉 ESTEJAM ATENTOS! 👀 👀',
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

export function filterFreeChannels(destinationListArray: TDestinationListData[], filter: boolean) {
	if(filter) return destinationListArray.filter((list) => list.classification !== 'Free');
	return destinationListArray;
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
	const shouldNotSendMsg = (classification: 'Vip' | 'Free') => classification === 'Free' && !isFreeChannelWorkingTime();
	for await (const destItem of destList) {
		// skip free channels between 15:30 to 19:00
		if(shouldNotSendMsg(destItem.classification)) continue;
		if(destItem.msgCounter.value() >= destItem.advertiseMsgCount) {
			await sendAdvertiseMessageToDestinationList(client, destItem, advtMsgs);
			destItem.msgCounter.reset();
		}
	}
}

export function makeReportController() {
	const controller = {
		M1: makeController(),
		M5: makeController(),
		M15: makeController(),
	} as const;

	return Object.freeze({
		addReport,
		cleanReports,
		getReports,		
	});

	function addReport(key: keyof typeof controller, data: TReport) {
		return controller[key].reports.push(data);
	}

	function cleanReports(key: keyof typeof controller) {
		const reports = controller[key].reports;
		return reports.splice(0, reports.length);
	}

	function getReports(key: keyof typeof controller) {
		return controller[key].reports;
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