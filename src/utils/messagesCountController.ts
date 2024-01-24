function makeCounter() {
	let count = 0;
	return Object.freeze({
		value: () => count,
		increment: () => count++,
		reset: () => count = 0,
	});	
}

export const msgsByTimeFrameCount = {
	M1: makeCounter(),
	M5: makeCounter(),
	M15: makeCounter(),
};