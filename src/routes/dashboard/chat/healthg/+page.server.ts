import { checkUserAuth } from '$lib/server/check-auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { uid } from 'uid';
import { db } from '$lib/db/db';
import { chat, messages } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { getResponse } from '$lib/server/getResponse';

export const load: PageServerLoad = async ({ locals }) => {
	const { error, userId } = checkUserAuth(locals);

	if (!userId || error) {
		return fail(403, { error });
	}

	if (!locals.user.id) {
		throw new Error('failed to attach id on login');
	}
	const healthguuid = `healthg-869e0a51-cc1f-4939-b0a9-18b319234ced`;

	const chats = await db.query.chat.findMany({
		where: eq(chat.userId, userId)
	});

	const findChatAndMessages = await db.query.chat.findFirst({
		where: eq(chat.displayId, healthguuid),
		with: {
			messages: true
		}
	});

	if (!findChatAndMessages) {
		return {
			chats,
			messages: []
		};
	}

	return {
		chats,
		messages: findChatAndMessages.messages
	};
};

export const actions: Actions = {
	createChat: async ({ locals }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const uniqueId = uid(25);
		await db.insert(chat).values({
			userId,
			displayId: uniqueId
		});

		const allChats = await db.query.chat.findMany({
			where: eq(chat.userId, userId)
		});

		return {
			allChats
		};
	},
	getResponseFromPrompt: async ({ locals, request }) => {
		const { error, userId } = checkUserAuth(locals);

		if (!userId || error) {
			return fail(403, { error });
		}

		if (!locals.user.id) {
			throw new Error('failed to attach id on login');
		}

		const healthguuid = `healthg-869e0a51-cc1f-4939-b0a9-18b319234ced`;

		const findChat = await db.query.chat.findFirst({
			where: eq(chat.displayId, healthguuid)
		});

		const formData = await request.formData();
		const prompt = String(formData.get('userPrompt'));

		if (!findChat) {
			const savedChat = await db
				.insert(chat)
				.values({ displayId: healthguuid, userId })
				.returning();
			const response = getResponse(prompt);

			const savedMessage = await db
				.insert(messages)
				.values({
					prompt,
					response: String(response),
					chatId: savedChat[0].id
				})
				.returning();

			return {
				newMessage: savedMessage[0]
			};
		} else {
			const response = getResponse(prompt);
			const savedMessage = await db
				.insert(messages)
				.values({
					prompt,
					response: String(response),
					chatId: findChat.id
				})
				.returning();
			return {
				newMessage: savedMessage[0]
			};
		}
	}
};
