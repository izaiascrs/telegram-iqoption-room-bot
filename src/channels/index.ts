export type TChannelInfo = {
  id: number;
  name: string;
  waitingForSignal: boolean;
  type: string;
};

// ************ channels watch list ************ //
export const channelsWatchList: TChannelInfo[] = [
	// {
	// 	id: -1002137003427,
	// 	name: 'Canal teste',
	// 	waitingForSignal: false,
	// 	type: 'Channel'
	// },

	{
		id: -1001625871874,
		name: 'Sinais OB M1',
		waitingForSignal: false,
		type: 'Channel',
	},

	{
		id: -1001630460062,
		name: 'Sinais OB M5',
		waitingForSignal: false,
		type: 'Channel',
	},

	{
		id: -1002071113577,
		name: 'Sinais OB M15',
		waitingForSignal: false,
		type: 'Channel',
	},
  
];