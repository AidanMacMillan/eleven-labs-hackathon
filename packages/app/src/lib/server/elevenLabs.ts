import { ElevenLabsClient } from 'elevenlabs';
import { ELEVEN_LABS_API_KEY } from '$env/static/private';

export const elevenLabs = new ElevenLabsClient({
	apiKey: ELEVEN_LABS_API_KEY
});
