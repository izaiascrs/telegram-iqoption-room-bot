import { TMakeCounter, makeCounter } from '../utils/helpers';

type TDestinationList = {
  type: 'Channel' | 'User' | 'Group';
  id: number;
  name: string;
  classification: 'Vip' | 'Free';
	mixedRoom: boolean;
}

export type TDestinationListData = {
	id: number;
	classification: 'Vip' | 'Free';
	msgCounter: TMakeCounter;
	advertiseMsgCount: number;
	advertiseMsgIndexController: TMakeCounter;
	mixedRoom: boolean;
}

const topSignalsIqOptionDestList: TDestinationList[] = [
	// ***** channel to send ************ //
	{
		type: 'Group',
		id: 4072662222,
		name: 'Canal IqOption teste Vip',
		classification: 'Vip',
		mixedRoom: false,
	},
	{
		type: 'Group',
		id: 4166700266,
		name: 'Canal IqOption teste Free',
		classification: 'Free',
		mixedRoom: false,
	},
	// ***** channel to send ************ //

	// {
	// 	type: 'User',
	// 	id: 6018633227,
	// 	name: 'izaias',
	// 	classification: 'Vip',
	// },
];

const communityOfTradersIqOptionDestList: TDestinationList[] = [
	// ***** channel to send ************ //
	{
		type: 'Group',
		id: 4037329961,
		name: 'Canal teste Free',
		classification: 'Free',
		mixedRoom: true,
	},
	// ***** channel to send ************ //
];

function makeDestinationItem (item: TDestinationList) {
	const { id, classification, mixedRoom } = item;
	return {
		id,
		classification,
		mixedRoom,
		msgCounter: makeCounter(),
		advertiseMsgCount: classification === 'Vip' ? 10 : 5,
		advertiseMsgIndexController: makeCounter(),
	};
}

export const topSignalsIqOptionDestListIds: TDestinationListData[] = topSignalsIqOptionDestList.map(makeDestinationItem);

export const communityOfTradersIqOptionDestListIds: TDestinationListData[] = communityOfTradersIqOptionDestList.map(makeDestinationItem);
