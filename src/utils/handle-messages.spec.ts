import { describe, expect, it } from 'vitest';
import { checkIfMessageHasSignal, createNewSignalMessage, createTradeSignalMessage, extractDataFromMessage, isValidMessage } from './handle-message';

describe('handle messages functions', () => {
	describe('format message new signal message details', () => {
		it('format message with currency pair, time frame and waiting message', () => {
			const expected = '⚠ **ATENÇÃO TRADERS!** \n 👉 USD/GBP \n ⏱ 5 M \n 🏁 Aguarde o momento de entrada';
			const params = { currencyPair: 'USD/GBP', hours: '', time: '5 M', signal: null, channelName: 'my channel', };
			const msg = createNewSignalMessage(params);
			expect(msg).toEqual(expected);
		});

		it('format message with currency pair, time frame, hours and buy signal / sell signal', () => {
			const expectedCall = '⚠ **ATENÇÃO TRADERS!** \n\n  👉 USD/GBP \n\n  ⏱ 5 M \n\n ⏰ 10:10 \n\n 🟢👆 **COMPRA** 👆🟢';
			const expectedPut = '⚠ **ATENÇÃO TRADERS!** \n\n  👉 USD/GBP \n\n  ⏱ 5 M \n\n ⏰ 10:10 \n\n 🔴👇 **VENDA** 👇🔴';
			const signalCall = ['CALL'] as unknown as RegExpExecArray;
			const signalPut = ['PUT'] as unknown as RegExpExecArray;
			const params = { currencyPair: 'USD/GBP', hours: '10:10', time: '5 M', signal: signalCall, channelName: 'my channel', };
			const msgCall = createNewSignalMessage(params);
			const msgPut = createNewSignalMessage({ ...params, signal: signalPut });
			expect(msgCall).toEqual(expectedCall);
			expect(msgPut).toEqual(expectedPut);
		});
	});

	describe('trade message function', () => {
		it('create call signal message', () => {
			const expected = '🟢👆 **COMPRA** 👆🟢';
			const callMsg = createTradeSignalMessage('CALL');
			expect(callMsg).toEqual(expected);
		});

		it('create sell signal message', () => {
			const expected = '🔴👇 **VENDA** 👇🔴';
			const sellMsg = createTradeSignalMessage('PUT');
			expect(sellMsg).toEqual(expected);
		});
	});

	describe('extract data from incoming message', () => {
		const msgCall = '⏳5 Minutos de OPERAÇÃO\n' + 'GBP/JPY - 21:00h; CALL 🟢 \n';
		const msgCallOTC = '⏳5 Minutos de OPERAÇÃO\n' + 'GBP/JPY (otc) - 21:00h; CALL 🟢 \n';
		const msgSell = '⏳5 Minutos de OPERAÇÃO\n' + 'GBP/JPY - 21:00h; PUT 🔴 \n';
		const msg = '⏳5 Minutos de OPERAÇÃO\n' + 'GBP/JPY - 21:00h; \n';
		const msgNoHours = '⏳5 Minutos de OPERAÇÃO\n' + 'GBP/JPY \n';
		const msgWithMinutes = 'test message with no signal 5 minutes';
		const msgWithCurrency = 'test message with no signal GBP/JPY';
		const msgWithHours = 'test message with no signal 22:53';
		const msgWithHoursAndCurrency = 'test message with no signal GBP/JPY 22:53';
		const resultMsg = 'result of the day';
		const reportMsg = 'report of the day';

		it('extract currency pair, hours and time frame from message', () => {
			const res = extractDataFromMessage(msgCall);
			const expected = { currencyPair: 'GBP/JPY', hours: '21:00', time: '5 M' };
			expect(res).toEqual(expected);
		});

		it('return currency pair with otc', () => {
			const res = extractDataFromMessage(msgCallOTC);
			const expected = { currencyPair: 'GBP/JPY (OTC)', hours: '21:00', time: '5 M' };
			expect(res).toEqual(expected);
		});

		it('return hours with empty string', () => {
			const res = extractDataFromMessage(msgNoHours);
			const expected = { currencyPair: 'GBP/JPY', hours: '', time: '5 M' };
			expect(res).toEqual(expected);
		});

		it('return time, currency and hours with empty string', () => {
			const msgs = [msgWithMinutes, msgWithCurrency, msgWithHours, msgWithHoursAndCurrency];
			const responses = msgs.map((msg) => extractDataFromMessage(msg));
			const expected = { currencyPair: '', hours: '', time: '' };
			responses.forEach((res) => expect(res).toEqual(expected));
		});

		it('check if message contain call or put signal', () => {
			const callRes = checkIfMessageHasSignal(msgCall);
			expect(callRes).toHaveProperty('length');
			expect(callRes).toContain('CALL');

			const putRes = checkIfMessageHasSignal(msgSell);
			expect(putRes).toHaveProperty('length');
			expect(putRes).toContain('PUT');
		});

		it('return null if message does not contain call or put signal', () => {
			const putRes = checkIfMessageHasSignal(msg);
			expect(putRes).toEqual(null);
		});

		it('check if message is a valid message', () => {
			const msg1 = isValidMessage(msgCallOTC);
			const msg2 = isValidMessage(resultMsg);
			const msg3 = isValidMessage(reportMsg);
			expect(msg1).toBe(true);
			expect(msg2).toBe(false);
			expect(msg3).toBe(false);
		});
	});

});