import { ScheduleOptions, schedule } from 'node-cron';
import { TelegramClient } from 'telegram';
import { communityOfTradersIqOptionDestListIds, topSignalsIqOptionDestListIds } from '../destination-list';
import { reportsController } from '../report';
import { client } from '../telegram';
import { TTimeFrame, formatReportMessage } from '../utils/handle-message';
import { filterFreeChannels, sendReportMessageToDestinationList } from '../utils/helpers';
import { TCronConfig, reportsCronConfig } from './reports-config';

const receptorOne = filterFreeChannels(topSignalsIqOptionDestListIds, true);
const receptorTwo = filterFreeChannels(communityOfTradersIqOptionDestListIds, true);

const cronDefaultOptions: ScheduleOptions = {
	timezone: 'America/Sao_Paulo',
};

function createReportMessage(timeFrame: TTimeFrame) {
	const reports = reportsController.getReports(timeFrame);
	const reportMsg = formatReportMessage(reports, timeFrame);  
	const reportMsgObj = { message: reportMsg };
	if(reports.length === 0) return null;
	return reportMsgObj;
}

async function sendReportMessage(client: TelegramClient, timeFrame: TTimeFrame) {	
	const reportMsgObj = createReportMessage(timeFrame);
	if(!client.connected || !reportMsgObj) return;
	await sendReportMessageToDestinationList(client, receptorOne, reportMsgObj);
	await sendReportMessageToDestinationList(client, receptorTwo, reportMsgObj);
	reportsController.cleanReports(timeFrame);	
	console.log('cron job running at time frame', new Date().toLocaleString(), timeFrame);
}

function createCronInterval(options: TCronConfig) {
	const { hours, minutes, seconds} = options;
	if(hours > 0) return `${seconds} ${minutes} */${hours} * * *`;
	return `${seconds} */${minutes} * * * *`;	
}


export function initiateReportCron() {
	Object.entries(reportsCronConfig).forEach(([key, options]) => {
		const timeFrame = key as keyof typeof reportsCronConfig;
		const cronInterval = createCronInterval(options);		
		schedule(cronInterval, async () => await sendReportMessage(client, timeFrame), cronDefaultOptions);
	});	
}
