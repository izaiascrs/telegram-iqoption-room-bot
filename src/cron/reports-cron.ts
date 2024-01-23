import { schedule, ScheduleOptions } from 'node-cron';
import { communityOfTradersIqOptionDestListIds, topSignalsIqOptionDestListIds } from '../destination-list';
import { reportsController } from '../report';
import { client } from '../telegram';
import { formatReportMessage, TTimeFrame } from '../utils/handle-message';
import { filterFreeChannels, sendReportMessageToDestinationList } from '../utils/helpers';

const receptorOne = filterFreeChannels(topSignalsIqOptionDestListIds, true);
const receptorTwo = filterFreeChannels(communityOfTradersIqOptionDestListIds, true);

const M1_REPORT_CRON = '05 15 */1 * * *';
const M5_REPORT_CRON = '27 45 */1 * * *';
const M15_REPORT_CRON = '59 37 */2 * * *';

const options: ScheduleOptions = {
	timezone: 'America/Sao_Paulo',
};

function createReportMessage(timeFrame: TTimeFrame) {
	const reports = reportsController.getReports(timeFrame);
	const reportMsg = formatReportMessage(reports, timeFrame);  
	const reportMsgObj = { message: reportMsg };
	if(reports.length === 0) return null;
	return reportMsgObj;
}

export function initiateReportCron() {
	schedule(M1_REPORT_CRON, async () => {		
		const reportMsgObj = createReportMessage('M1');
		if(!client.connected || !reportMsgObj) return;
		await sendReportMessageToDestinationList(client, receptorOne, reportMsgObj);
		await sendReportMessageToDestinationList(client, receptorTwo, reportMsgObj);
		reportsController.cleanReports('M1');	
	}, options);
  
	schedule(M5_REPORT_CRON, async () => {
		const reportMsgObj = createReportMessage('M5');
		if(!client.connected || !reportMsgObj) return;
		await sendReportMessageToDestinationList(client, receptorOne, reportMsgObj);
		await sendReportMessageToDestinationList(client, receptorTwo, reportMsgObj);
		reportsController.cleanReports('M5');	
	}, options);
  
	schedule(M15_REPORT_CRON, async () => {
		const reportMsgObj = createReportMessage('M15');
		if(!client.connected || !reportMsgObj) return;
		await sendReportMessageToDestinationList(client, receptorOne, reportMsgObj);
		await sendReportMessageToDestinationList(client, receptorTwo, reportMsgObj);
		reportsController.cleanReports('M15');	
	}, options);
}
