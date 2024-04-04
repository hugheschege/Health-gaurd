// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/db/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Partial<User>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface FrontEndTypes {
			options: {
				[index: string]: {
					option: string;
					selected: boolean;
				};
			};
		}
	}
}

export {};
