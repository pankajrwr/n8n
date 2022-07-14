import { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import { IDataObject, INodeType, INodeTypeDescription, IWebhookResponseData } from 'n8n-workflow';

// import { foxyApiRequest } from './GenericFunctions';

import { snakeCase } from 'change-case';

export class FoxyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Foxy Trigger',
		name: 'foxyTrigger',
		icon: 'file:autofriend.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Foxy events via webhooks',
		defaults: {
			name: 'Foxy Trigger',
			color: '#6ad7b9',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
						{
								displayName: 'Event',
								name: 'event',
								type: 'options',
								required: true,
								default: '',
								options: [
										{
												name: 'Transaction Refeed',
												value: 'transaction/refeed',
										},
								],
						},
				],
	};

	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				console.log('test');
				const webhookData = this.getWorkflowStaticData('node');
				console.log('webhookData:', webhookData);
				const webhookUrl = this.getNodeWebhookUrl('default');
				console.log('webhookUrl:', webhookUrl);
				const event = this.getNodeParameter('event') as string;
				console.log('event:', event);
				return true;
				// const { hooks: webhooks } = await foxyApiRequest.call(this, 'GET', '/hooks');
				// console.log('webhools',webhooks)
				// for (const webhook of webhooks) {
				// 	if (webhook.target_url === webhookUrl && webhook.event === snakeCase(event)) {
				// 		webhookData.webhookId = webhook.hook_id;
				// 		return true;
				// 	}
				// }
				// return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// const webhookUrl = this.getNodeWebhookUrl('default');
				// const webhookData = this.getWorkflowStaticData('node');
				// const event = this.getNodeParameter('event') as string;
				// const body: IDataObject = {
				// 	event: snakeCase(event),
				// 	target_url: webhookUrl,
				// };
				// const webhook = await foxyApiRequest.call(this, 'POST', '/hook', body);
				// webhookData.webhookId = webhook.hook_id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// const webhookData = this.getWorkflowStaticData('node');
				// try {
				// 	await foxyApiRequest.call(this, 'DELETE', `/hook/${webhookData.webhookId}`);
				// } catch (error) {
				// 	return false;
				// }
				// delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [this.helpers.returnJsonArray(req.body)],
		};
	}
}
