<script lang="ts">
	import Chat from '$lib/components/chat/Chat.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
	const chatAndMessages = data.messages;
</script>

<Chat messages={chatAndMessages} healthg={true} />
