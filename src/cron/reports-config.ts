import { TTimeFrame } from '../utils/handle-message';

export type TCronConfig = {
  hours: number;
  minutes: number;
  seconds: number;
}

type TReportCronConfig = Record<TTimeFrame, TCronConfig>

export const reportsCronConfig: TReportCronConfig = {
	M1: {
		hours: 2,
		minutes: 15,
		seconds: 27,
	},
	M5: {
		hours: 3,
		minutes: 33,
		seconds: 43,
	},
	M15: {
		hours: 4,
		minutes: 7,
		seconds: 55,
	}
};