import { TelegramClient } from 'telegram';
import { describe, expect, it, vi } from 'vitest';
import { TAdvertiseMessage } from '../advertise-messages';
import { TDestinationListData } from '../destination-list';
import { TReport } from './handle-message';
import {
	applyFunctionAsync,
	changeTimeZone,
	filterFreeChannels,
	handleMsgCount,
	isBreakTime,
	isFreeChannelWorkingTime,
	makeCounter,
	makeReportController,
	sendAdvertiseMessageToDestinationList,
	sendMessagesToDestinationList
} from './helpers';

const makeMockDestChannels = (): TDestinationListData[] => ([
	{
		classification: 'Vip',
		msgCounter: makeCounter(),
		id: 1,
		advertiseMsgCount: 1,
		advertiseMsgIndexController: makeCounter(),
		mixedChannel: false,
		hasWorkingTime: false,
	},
	{
		classification: 'Free',
		msgCounter: makeCounter(),
		id: 3,
		advertiseMsgCount: 1,
		advertiseMsgIndexController: makeCounter(),
		mixedChannel: false,
		hasWorkingTime: false,
	},
	{
		classification: 'Free',
		msgCounter: makeCounter(),
		id: 2,
		advertiseMsgCount: 1,
		advertiseMsgIndexController: makeCounter(),
		mixedChannel: false,
		hasWorkingTime: false,
	},
]);

const makeFakeTelegramClient = () => ({
	sendMessage: vi.fn(),
}) as unknown as TelegramClient;

const makeMockDestMessages = (): TAdvertiseMessage => ({
	messages: [
		{ message: 'advertise message 1' },
		{ message: 'advertise message 2' },
	],
	messagesIndexController: makeCounter(),
});

const mockMessage = {
	message: 'test message',
};

const brLocaleDate = changeTimeZone(new Date(), 'America/Sao_Paulo');

describe('helpers functions', () => {

	describe('break time function', () => {
		it('return false when current time less them 19 and grater then 22', () => {
			const currentDateTime = new Date(brLocaleDate);
			const breakTime = isBreakTime(new Date(currentDateTime.setHours(15, 0)));
			expect(breakTime).toBeFalsy();
		});
	
		it('return true when hours is between 19 and 21', () => {
			const currentDateTime = new Date(brLocaleDate);
			const breakTime1 = isBreakTime(new Date(currentDateTime.setHours(19, 0)));
			const breakTime2 = isBreakTime(new Date(currentDateTime.setHours(21, 59)));
			
			expect(breakTime1).toBeTruthy();
			expect(breakTime2).toBeTruthy();
		});
	
		it('return false when hours is equal to 22', () => {
			const currentDateTime = new Date(brLocaleDate);
			const breakTime1 = isBreakTime(new Date(currentDateTime.setHours(22, 0)));
			const breakTime2 = isBreakTime(new Date(currentDateTime.setHours(22, 59)));
			expect(breakTime1).toBeFalsy();
			expect(breakTime2).toBeFalsy();
		});
	
		it('return true when hours is equal to 19', () => {
			const currentDateTime = new Date(brLocaleDate);
			const breakTime1 = isBreakTime(new Date(currentDateTime.setHours(19)));
			const breakTime2 = isBreakTime(new Date(currentDateTime.setHours(19, 59)));
			expect(breakTime1).toBeTruthy();
			expect(breakTime2).toBeTruthy();
		});
	});

	describe('free channel working time function', () => {
		it('return false if current time is NOT between 15:30 and 19:00', () => {
			const date = new Date(brLocaleDate);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(10))) ).toBe(false);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(15, 29))) ).toBe(false);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(19, 0))) ).toBe(false);
		});

		it('return true when current time is between 15:30 and 19:00', () => {
			const date = new Date(brLocaleDate);			
			expect( isFreeChannelWorkingTime(new Date(date.setHours(15, 30))) ).toBe(true);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(18, 59))) ).toBe(true);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(16, 0))) ).toBe(true);
			expect( isFreeChannelWorkingTime(new Date(date.setHours(17, 30))) ).toBe(true);
		});
	});

	describe('send telegram message function', () => {
		it('send a message to a destination user id', async () => {
			const mockTelegramClient = makeFakeTelegramClient();
			const mockDestChannels = makeMockDestChannels();
			await sendMessagesToDestinationList(mockTelegramClient, mockMessage, mockDestChannels);
			expect(mockTelegramClient.sendMessage).toBeCalledTimes(mockDestChannels.length);
			mockDestChannels.forEach((dest) => expect(mockTelegramClient.sendMessage).toBeCalledWith(dest.id, mockMessage));			
		});
	});

	describe('send advertise message function', () => {
		it('send a message to a destination user id', async () => {
			const mockTelegramClient = makeFakeTelegramClient();
			const mockDestMessages = makeMockDestMessages();
			const mockDestChannels = makeMockDestChannels();
			mockDestChannels.forEach((c) => sendAdvertiseMessageToDestinationList(mockTelegramClient, c, mockDestMessages));
			expect(mockTelegramClient.sendMessage).toBeCalled();
			expect(mockTelegramClient.sendMessage).toBeCalledTimes(mockDestChannels.length);
			mockDestChannels.forEach((mock) => 
				expect(mockTelegramClient.sendMessage)
					.toBeCalledWith(
						mock.id,
						mockDestMessages.messages[mock.msgCounter.value()]
					)
			);			
		});

		it('increment message index every time a message is sent', async () => {
			const mockDestChannels: TDestinationListData[] = [
				{
					classification: 'Vip',
					msgCounter: makeCounter(),
					id: 1,
					advertiseMsgCount: 1,
					advertiseMsgIndexController: makeCounter(),
					mixedChannel: false,
					hasWorkingTime: false,					
				},
				{
					classification: 'Free',
					msgCounter: makeCounter(),
					id: 3,
					advertiseMsgCount: 1,
					advertiseMsgIndexController: makeCounter(),
					mixedChannel: false,
					hasWorkingTime: false,
				},
				{
					classification: 'Free',
					msgCounter: makeCounter(),
					id: 2,
					advertiseMsgCount: 1,
					advertiseMsgIndexController: makeCounter(),
					mixedChannel: false,
					hasWorkingTime: false,
				},
			];
			const mockTelegramClient = makeFakeTelegramClient();
			const mockDestMessages = makeMockDestMessages();
			sendAdvertiseMessageToDestinationList(mockTelegramClient, mockDestChannels[0], mockDestMessages);
			expect(mockDestChannels[0].advertiseMsgIndexController.value()).toBe(1);
			sendAdvertiseMessageToDestinationList(mockTelegramClient, mockDestChannels[1], mockDestMessages);
			expect(mockDestChannels[1].advertiseMsgIndexController.value()).toBe(1);
			sendAdvertiseMessageToDestinationList(mockTelegramClient, mockDestChannels[1], mockDestMessages);			
			expect(mockDestChannels[1].advertiseMsgIndexController.value()).toBe(2);
		});
	});

	describe('filter free channels function', () => {
		it('return only vip channels', () => {			
			const mockDestChannels = makeMockDestChannels();
			const vipChannels = filterFreeChannels(mockDestChannels, true);
			expect(vipChannels).toHaveLength(1);
			mockDestChannels.push({ classification: 'Vip', id: 4, msgCounter: makeCounter(), advertiseMsgCount: 1, advertiseMsgIndexController: makeCounter(), mixedChannel: false, hasWorkingTime: false });
			const vipChannels2 = filterFreeChannels(mockDestChannels, true);
			expect(vipChannels2).toHaveLength(2);
		});
	});

	describe('handle message count function', () => {
		it('increment message count by 1', () => {
			const mockDestChannels = makeMockDestChannels();
			handleMsgCount([mockDestChannels]);			
			const counters = mockDestChannels.map((dest) => dest.msgCounter.value());
			counters.forEach((c) => expect(c).toEqual(1));
		});
	});

	describe('apply function async',  () => {
		const fn = vi.fn();
		const items = [1, 2, 3, 4];
		it('call a specific function for each array item with the item as first param', () => {
			applyFunctionAsync(items, fn, 'params');
			expect(fn).toHaveBeenCalledTimes(items.length);
		});

		it('call a specific function with additional params for each array item and add item as last param of the function', () => {
			applyFunctionAsync(items, fn, 'params');
			items.forEach((item) => expect(fn).toHaveBeenCalledWith('params', item));
			applyFunctionAsync(items, fn, 'params', 123);
			items.forEach((item) => expect(fn).toHaveBeenCalledWith('params', 123, item));
		});
	});

	describe('make controller function', () => {
		const reportController = makeReportController();

		const report: TReport = {
			direction: 'PUT',
			result: '✅²',
			gales: 2,
			currencyPair: 'NZD/USD (OTC)',
			hours: '16:42',
			time: '1 M'
		};

		it('create a report controller object with add, remove and get functions', () => {
			expect(reportController).toBeInstanceOf(Object);
			expect(reportController).toHaveProperty('addReport');
			expect(reportController).toHaveProperty('cleanReports');
			expect(reportController).toHaveProperty('getReports');
		});

		it('adds a report to reports array at a specific time frame key', () => {
			reportController.addReport('M1', report);
			reportController.addReport('M15', report);
			reportController.addReport('M15', report);
			expect(reportController.getReports('M1')).toHaveLength(1);
			expect(reportController.getReports('M5')).toHaveLength(0);
			expect(reportController.getReports('M15')).toHaveLength(2);
		});

		it('clean all reports at a specific time frame key', () => {
			reportController.cleanReports('M1');
			reportController.cleanReports('M5');
			reportController.cleanReports('M15');		
			
			expect(reportController.getReports('M1')).toHaveLength(0);
			expect(reportController.getReports('M5')).toHaveLength(0);
			expect(reportController.getReports('M15')).toHaveLength(0);
		});
	});

});