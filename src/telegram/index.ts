import { TelegramClient } from 'telegram';
import { STRING_SESSION, TELEGRAM_API_HASH, TELEGRAM_API_ID } from '../constants';

export const client = new TelegramClient(
	STRING_SESSION,
	TELEGRAM_API_ID,
	TELEGRAM_API_HASH,
	{ connectionRetries: 5 },
);
