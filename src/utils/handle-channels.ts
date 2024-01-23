import { channelsWatchList, type TChannelInfo } from '../channels';

export function findChannelById(id: number) {
	return channelsWatchList.find(c => c.id === id);
}

export function findChannelBySignal(waiting: boolean) {
	return channelsWatchList.find(c => c.waitingForSignal === waiting);
}

export function checkIfMessageIsFromDifferentChannel(
	channelA: TChannelInfo | undefined,
	channelB: TChannelInfo | undefined
) {
	if(channelA && channelB && channelA.id !== channelB.id) return true; 
	return false;
}

export function setChannelWaitingForSignal(id: number, waiting: boolean) {
	const channel = channelsWatchList.find((c) => c.id === id);
	if(channel) channel.waitingForSignal = waiting;
}

export function isIqOptionChannel(id: number) {
	const M1_BOT_ID = -1001625871874;
	const M5_BOT_ID = -1001630460062;
	const M15_BOT_ID = -1002071113577;
	const MY_ID = -1002137003427;
	const especialChannelsIds = [ M1_BOT_ID, M5_BOT_ID, M15_BOT_ID, MY_ID ];
	return especialChannelsIds.includes(id);
}
