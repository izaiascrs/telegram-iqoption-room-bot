import { makeReportController } from '../utils/helpers';

export type TReportsController = typeof reportsController;

export const reportsController = makeReportController();
