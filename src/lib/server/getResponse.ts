import { intents } from './intents.json';

export function getResponse(input: string) {
	for (const intent of intents) {
		const tags = intent.tags.toLowerCase().split(' ');
		if (tags.some((tag) => input.toLowerCase().includes(tag))) {
			for (const pattern of intent.patterns) {
				const regex = new RegExp('\\b' + pattern.toLowerCase() + '\\b');
				if (regex.test(input.toLowerCase())) {
					return intent.responses[Math.floor(Math.random() * intent.responses.length)];
				}
			}
		}
	}

	return "I'm sorry, I didn't understand that. Can you please rephrase?";
}
