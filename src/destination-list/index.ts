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
		type: 'Group', 
		id: 4072662222,
		name: 'Canal IqOption teste Vip',
		classification: 'Vip',
		mixedChannel: false,
		hasWorkingTime: false,
	},
	{
		type: 'Group',
		id: 4166700266,
		name: 'Canal IqOption teste Free',
		classification: 'Free',
		mixedChannel: false,
		hasWorkingTime: false,
	},
	// ***** channel to send ************ //

	// {
	// 	type: 'User',
	// 	id: 6018633227,
	// 	name: 'izaias',
	// 	classification: 'Vip',
	//  hasWorkingTime: false,
	// },
];

const communityOfTradersIqOptionDestList: TDestinationList[] = [
	// ***** channel to send ************ //
	{
		type: 'Group',
		id: 4037329961,
		name: 'Canal teste Free',
		classification: 'Free',
		mixedChannel: true,
		hasWorkingTime: true,
	},
	// ***** channel to send ************ //
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
