import { Api } from 'telegram';
import { NewMessageEvent } from 'telegram/events';
import { currenciesLookup } from '../currencies';

type TCreateNewMessageParams = {
  currencyPair: string,
  time: string,
  hours: string,
  signal: RegExpExecArray | null,
  channelName: string
}

export type TReport = {
	direction: 'PUT' | 'CALL';
	result: '🛑' | '✅' | '✅¹' | '✅²';
	gales: 0 | 1 | 2;
	currencyPair: string;
	hours: string;
	time: '1 M' | '5 M' | '15 M';
}

type TReportStatus =  {
	wins: number;
	loses: number;
	noGale: number;
	oneGale: number;
	twoGales: number;
	total: number;
}

type TReportPercentage = {
	noGalePercentage: string;
	oneGalePercentage: string;
	twoGalesPercentage: string;
}

export type TTimeFrame = 'M1' | 'M5' | 'M15'

export function checkIfStickIsCallOrPut(media: Api.MessageMediaDocument) {
	const document = media.document as Api.Document;
	const attributes = document.attributes;
	const isSticker = attributes.find((a) => a.className === 'DocumentAttributeSticker') as Api.DocumentAttributeSticker;

	if (isSticker) {
		if (
			isSticker.alt.includes('👎') ||
      isSticker.alt.includes('🔽') ||
      isSticker.alt.includes('👇')
		) {
			return 'PUT';
		}

		if (
			isSticker.alt.includes('👍') ||
      isSticker.alt.includes('🔼') ||
      isSticker.alt.includes('👆')
		) {
			return 'CALL';
		}
	}

	return null;
}

export function createNewSignalMessage(params: TCreateNewMessageParams) {
	const { currencyPair, time, hours, signal } = params;	
	const broker = 'IQ OPTION';
	if (signal && signal.length) {
		const CALL_PUT_SIGNAL = checkIfSignalMessageIsCallOrPut(signal[0]);
		const CALL_PUT_MESSAGE = createTradeSignalMessage(CALL_PUT_SIGNAL);
		const formattedMessage = `⚠ **ATENÇÃO TRADERS!** \n\n 🏛️ **${broker}** \n\n 👉 ${currencyPair} \n\n ⏱ ${time} \n\n ${ hours.length ? '⏰ ' + hours+ ' \n\n' : ''} ${CALL_PUT_MESSAGE}`;
		return formattedMessage;
	} else {		
		const formattedMessage = `⚠ **ATENÇÃO TRADERS!** \n 🏛️ **${broker}** \n 👉 ${currencyPair} \n ⏱ ${time} \n 🏁 Aguarde o momento de entrada`;
		return formattedMessage;
	}
}

export function createTradeSignalMessage(signal: 'CALL' | 'PUT') {
	const message = signal === 'CALL' ? '🟢👆 **COMPRA** 👆🟢' : '🔴👇 **VENDA** 👇🔴';
	return message;
}

export function extractDataFromMessage(msg: string) {
	const time = /\d\s?m/igm.exec(msg); // select digit followed by the m char
	const currencyPair = /\b[A-Z]{3}(?:\s|\/)[A-Z]{3}\b/g.exec(msg); // select 3 uppercase char followed by space or backslash followed 3 uppercase char  
	const hours = /\d{2}:\d{2}/gm.exec(msg);
	const otc = /otc/gi.exec(msg);

	const timeCurrencyPair = {
		currencyPair: '',
		time: '',
		hours: '',
	};

	if (time?.length) {
		const formattedTime = time[0].replace(/\s/, '').split('').join(' ').toUpperCase();
		timeCurrencyPair.time = formattedTime;
	} else {
		const time = /m\s?\d/gi.exec(msg); // M5 M 5
		if (time?.length) {
			const formattedTime = time[0].split('').reverse().join(' ');
			timeCurrencyPair.time = formattedTime;
		}
	}

	if (currencyPair?.length) {
		const pair = currencyPair[0].replace(/\s?\/?/g, '');
		const isValidCurrencyPair = currenciesLookup.has(pair);
    
		if(isValidCurrencyPair) {
			const formattedPair = currencyPair[0].replace(/\s/, '/');
			timeCurrencyPair.currencyPair = formattedPair;      
		}
	} else {
		const currencyPair = /\b[A-Z]{6}\b/g.exec(msg);
		if (currencyPair?.length) {
			const isValidCurrencyPair = currenciesLookup.has(currencyPair[0]);
			if (isValidCurrencyPair) {
				timeCurrencyPair.currencyPair = currencyPair[0].replace(/(\w{3})/, '$1/');
			}
		}
	}

	if (hours?.length) {
		if (timeCurrencyPair.time !== '1 M') {
			timeCurrencyPair.hours = hours[0];
		}
	}

	if (otc?.length) {
		if(timeCurrencyPair.currencyPair.length) {
			const otcPair = timeCurrencyPair.currencyPair + ` (${otc[0]})`;
			timeCurrencyPair.currencyPair = otcPair.toUpperCase();
		}
	}

	if (timeCurrencyPair.currencyPair.length === 0 || timeCurrencyPair.time.length === 0) {
		return {
			currencyPair: '',
			time: '',
			hours: '',
		};
	}
	
	return timeCurrencyPair;
}

export function extractDataFromEspecialChannelMessage(msg: string) {
	const time = /m\s?\d{1,2}/gi.exec(msg); // M5 M 5
	const currencyPair = /\b[A-Z]{6}\b/g.exec(msg); // select 3 uppercase char followed by space or backslash followed 3 uppercase char  
	const hours = /(?<!-)\d{2}:\d{2}/gm.exec(msg);
	const otc = /otc/gi.exec(msg);
	
	const timeCurrencyPair = {
		currencyPair: '',
		time: '',
		hours: '',
		broker: '',
	};

	if (time?.length) {
		const [ , t] = time[0].split('M');
		const formattedTime = `${t} M`;
		timeCurrencyPair.time = formattedTime;
	}

	if (currencyPair?.length) {
		let formattedPair = currencyPair[0].replace(/(\w{3})/, '$1/');
		if(otc?.length) formattedPair += ' (OTC)';
		timeCurrencyPair.currencyPair = formattedPair;
	}

	if (hours?.length) {
		timeCurrencyPair.hours = hours[0];
	}

	return timeCurrencyPair;
}

export function checkIfMessageHasSignal(msg: string) {
	let signal = /👎|👍|👇|👆|CALL|PUT|UP|DOWN|COMPRA|VENDA/g.exec(msg); // signals only uppercase
	if(!signal) {
		signal = /👎|👍|👇|👆|CALL|PUT|UP|DOWN|COMPRA|VENDA/gi.exec(msg); // signals uppercase and lowercase
	}	
	return signal;
}

export function checkIfSignalMessageIsCallOrPut(msg: string) {
	const callRegex = /👆|👍|CALL|UP|COMPRA/gi.exec(msg);
	if (callRegex?.length) return 'CALL';
	return 'PUT';
}

export function isSticker(media: Api.TypeMessageMedia | undefined) {
	return media && media.className === 'MessageMediaDocument';
}

export function isValidMessage(msg: string) {
	const isBalanceMessage = /relatório|relatorio|report|resultado|result/gim.test(msg);
	const isMessageBetweenRange = (msg.length > 0 && msg.length < 280);
	return isMessageBetweenRange && !isBalanceMessage;
}

export function extractDataFromMessageEvent(event: NewMessageEvent) {
	const messageData = {
		chatId: parseInt(String(event.chatId)),
		isChannel: event.isChannel,
		isGroup: event.isGroup,
		isPrivate: event.isPrivate,
		message: event.message.message,
		media: event?.message?.media,
	};
	return messageData;  
}

export function isResultMessage(msg: string) {
	const hasResult = /resultado|result/gi.exec(msg);
	if(hasResult?.length) return true;
	return false;	
}

export function extractResultFromMessage(msg: string): TReport {
	const { currencyPair, hours, time } = extractDataFromEspecialChannelMessage(msg);
	const result = /(resultado|result).*/gi.exec(msg);
	const callOrPut = /CALL|PUT/gi.exec(msg);

	const isLostResult = (result: string) => /🛑/gi.exec(result);
	const isWinResult = (result: string) => /✅.*/gi.exec(result);
	const isGale = (result: string) => /✅¹|✅²/gi.exec(result);

	const resultStatus = { direction: '', result: '', gales: 0 };
	
	if(callOrPut?.length) {
		resultStatus.direction = callOrPut[0];
	}

	if(result?.length) {
		const resultValue = result[0];
		const lost = isLostResult(resultValue);
		const win = isWinResult(resultValue);
		if(win?.length) {
			const gale = isGale(resultValue);
			let galeCount = 0;

			if(gale?.length) {
				if(gale[0].includes('¹')) {
					galeCount = 1;
				} else if(gale[0].includes('²')) {
					galeCount = 2;
				}
			}

			resultStatus.gales = galeCount;
			resultStatus.result = win[0];
		} else if(lost?.length) {
			resultStatus.result = lost[0];
		}
	}

	return ({
		currencyPair,
		hours,
		gales: resultStatus.gales as TReport['gales'],
		direction: resultStatus.direction as TReport['direction'],
		time: time as TReport['time'],
		result: resultStatus.result as TReport['result'],
	});

}

export function formatReportMessage(reports: TReport[], timeFrame: TTimeFrame) {
	const stats = createReportStatus(reports);
	const percentages = createReportStatistics(stats);
	const startTime = reports.at(0)?.hours || '';
	const endTime = reports.at(-1)?.hours || '';

	const header = createReportHeaderMsg(timeFrame, startTime, endTime);
	const signal = createHistoricMessages(reports);
	const legend = createReportLegendMessage();
	const statistics = createStatisticsReportMessage(percentages, stats);
	const score = generateScore(stats);
	const finalMessage = 
		header +
		legend + '\n' +
		signal + '\n' +
		statistics + '\n' +
		score;

	return finalMessage;
		
	
	function createReportStatus(reports: TReport[]): TReportStatus {
		const stats = reports.reduce((acc, report) => {
			const isWin = report.result.includes('✅');
			const isLost = report.result.includes('🛑');
			if(isWin) acc['wins']++;
			if(isLost) acc['loses']++;
			if(report.gales === 1) acc['oneGale']++;
			if(report.gales === 2) acc['twoGales']++;
			if(report.gales === 0 && isWin) acc['noGale']++;
			acc['total']++;
			return acc;
		}, { wins: 0, loses: 0, noGale: 0, oneGale: 0, twoGales: 0, total: 0 });

		return { 
			wins: stats.wins,
			loses: stats.loses,
			noGale: stats.noGale,
			oneGale: stats.oneGale,
			twoGales: stats.twoGales,
			total: stats.total,
		};

	}

	function createReportStatistics(reportStatus: TReportStatus): TReportPercentage {
		return {
			noGalePercentage: formatAsPercentage(reportStatus.noGale / reportStatus.total),
			oneGalePercentage: formatAsPercentage(reportStatus.oneGale / reportStatus.total),
			twoGalesPercentage: formatAsPercentage(reportStatus.twoGales / reportStatus.total),
		};

		function formatAsPercentage(value: number) {
			const option = { style: 'percent', maximumFractionDigits: 2 };
			const formatter = new Intl.NumberFormat('pt-BR', option);
			return formatter.format(value);
		}
	}

	function createHistoricMessages(reports: TReport[]) {
		return reports.reduce((acc, val) => {
			return acc += `${val.hours} ${val.currencyPair} - ${val.direction} ${ val.result } \n`; 
		}, '');
	}
	
	function createReportHeaderMsg(timeFrame: TTimeFrame, startTime: string, endTime: string) {		
		const date = new Date().toLocaleDateString();		
		const title = `📊 RELATÓRIO DAS OPERAÇÕES **${timeFrame}**:\n \n`;
		const subTitle = `Período: **${startTime}** às **${endTime}**.\n \n Dia: **${date}**\n \n`;

		return `${title} ${subTitle}`;		
		
	}

	function createReportLegendMessage() {
		return '🛑 = **PERDA / LOSS**\n' + '✅ = **GANHO / WIN**\n';
	}

	function createStatisticsReportMessage(reportPercent: TReportPercentage, stats: TReportStatus) {
		const header = '**Médias percentuais dos resultados**:\n\n';
		const noGale = `✅ Sem gale: ${stats.noGale}x${stats.total} **(${reportPercent.noGalePercentage})**\n`;
		const oneGale = `✅¹ Com 1 gale : ${stats.oneGale}x${stats.total} **(${reportPercent.oneGalePercentage})**\n`;
		const twoGale = `✅² Com 2 gale : ${stats.twoGales}x${stats.total} **(${reportPercent.twoGalesPercentage})**\n`;
		return header + noGale + oneGale + twoGale;
	}

	function generateScore(stats: TReportStatus) {
		return `PLACAR: ${stats.wins} ✅ x ${stats.loses} 🛑`;
	}
}
