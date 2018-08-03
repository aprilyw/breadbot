const API_AI_TOKEN = 'f48f1bfd5892401ba7878b2f662e1040';
const apiAiClient = require('apiai')(API_AI_TOKEN);

const FACEBOOK_ACCESS_TOKEN = 'EAAbfwDjZCwt4BAJNZBrM9xFJZAxK3ZBmZBoeidWDSeIBa1QSuIm09ICmmGvS2o84KSPbhh0fPErTsazZBAl3tg3tNvnFSZBnR5p7FOdp8cK6vNj4yXiLnuRnVVCGlLoZA7uk9ed0GEIyrVuuRiVPngGE58UFM1o2Nv7K78jANCfAnz2WEyuzPogw';
const request = require('request');

const sendTextMessage = (senderId, text) => {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: FACEBOOK_ACCESS_TOKEN },
		method: 'POST',
		json: {
			recipient: { id: senderId },
			message: { text },
		}
	});
};

module.exports = (event) => {
	const senderId = event.sender.id;
	const message = event.message.text;

	const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'breadbot'});

	apiaiSession.on('response', (response) => {
		const result = response.result.fulfillment.speech;

		sendTextMessage(senderId, result);
	});

	apiaiSession.on('error', error => console.log(error));
	apiaiSession.end();
};