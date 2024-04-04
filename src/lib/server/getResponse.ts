import { intents } from './intents.json';

export function getResponse(input: string) {
	for (const intent of intents) {
		if (intent.tags.toLowerCase().includes(input.toLowerCase())) {
			for (const pattern of intent.patterns) {
				if (pattern.toLowerCase().includes(input.toLowerCase())) {
					return intent.responses[Math.floor(Math.random() * intent.responses.length)];
				}
			}
		}
	}

	return "I'm sorry, I didn't understand that. Can you please rephrase?";
}
