import { makeCounter, type TMakeCounter } from '../utils/helpers';

type TDestinationList = {
  id: number;
  type: 'Channel' | 'User' | 'Group';
  name: string;
  classification: 'Vip' | 'Free';
	mixedChannel: boolean;
	hasWorkingTime: boolean;
}

export type TDestinationListData = {
	id: number;
	classification: 'Vip' | 'Free';
	msgCounter: TMakeCounter;
	advertiseMsgCount: number;
	advertiseMsgIndexController: TMakeCounter;
	mixedChannel: boolean;
	hasWorkingTime: boolean;
};

const topSignalsIqOptionDestList: TDestinationList[] = [
	// ***** channel to send ************ //
	{
		type: 'Channel',
		id: 2092057546,
		name: 'TOP SINAIS IQ OPTION - VIP',
		classification: 'Vip',
		hasWorkingTime: false,
		mixedChannel: false,
	},
	{
		type: 'Channel',
		id: 1438461236,
		name: 'TOP SINAIS Grupo GB - Sinais Free 📊',
		classification: 'Free',
		hasWorkingTime: false,
		mixedChannel: false,
	}
	// ***** channel to send ************ //

	// ***** TEST CHANNELS  ************ //
	// {
	// 	type: 'Group', 
	// 	id: 4072662222,
	// 	name: 'Canal IqOption teste Vip',
	// 	classification: 'Vip',
	// 	mixedChannel: false,
	// 	hasWorkingTime: false,
	// },

	// {
	// 	type: 'Group',
	// 	id: 4166700266,
	// 	name: 'Canal IqOption teste Free',
	// 	classification: 'Free',
	// 	mixedChannel: false,
	// 	hasWorkingTime: false,
	// },

	// {
	// 	type: 'User',
	// 	id: 6018633227,
	// 	name: 'izaias',
	// 	classification: 'Vip',
	//  hasWorkingTime: false,
	// },
	// ***** TEST CHANNELS  ************ //
];

const communityOfTradersIqOptionDestList: TDestinationList[] = [
	// ***** channel to send ************ //
	{
		type: 'Channel',
		id:  1330013476,
		name: 'IQ OPTION - COMUNIDADE DOS TRADERS',
		classification: 'Vip',
		hasWorkingTime: false,
		mixedChannel: false,
	},
	// ***** channel to send ************ //

	// ***** TEST CHANNELS  ************ //
	// {
	// 	type: 'Group',
	// 	id: 4037329961,
	// 	name: 'Canal teste Free',
	// 	classification: 'Free',
	// 	mixedChannel: true,
	// 	hasWorkingTime: true,
	// },
	// ***** TEST CHANNELS  ************ //
];

function makeDestinationItem (item: TDestinationList) {
	const { id, classification, mixedChannel, hasWorkingTime } = item;
	return {
		id,
		mixedChannel,
		hasWorkingTime,
		classification,
		msgCounter: makeCounter(),
		advertiseMsgCount: classification === 'Vip' ? 10 : 5,
		advertiseMsgIndexController: makeCounter(),
	};
}

export const topSignalsIqOptionDestListIds: TDestinationListData[] = topSignalsIqOptionDestList.map(makeDestinationItem);

export const communityOfTradersIqOptionDestListIds: TDestinationListData[] = communityOfTradersIqOptionDestList.map(makeDestinationItem);
