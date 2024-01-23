import 'dotenv/config';
import { StringSession } from 'telegram/sessions';

const SESSION_TOKEN = process.env.SESSION_TOKEN;
const API_HASH = process.env.API_HASH;
const APP_ID = process.env.APP_ID;

export const TELEGRAM_API_ID = Number(APP_ID);
export const TELEGRAM_API_HASH = API_HASH!;
export const STRING_SESSION = new StringSession(SESSION_TOKEN);

const TEN_MINUTES = 1000 * 60 * 10;
export const MAX_TIME_TO_WAITING_FOR_SIGNAL = TEN_MINUTES;
export const MAX_MESSAGES_BEFORE_FREE_CHANNEL = 3;
export const MAX_MESSAGES_BEFORE_ADVERTISE = 10;
export const MAX_MESSAGES_BEFORE_HOW_TO_TRADE_MESSAGE = 7;