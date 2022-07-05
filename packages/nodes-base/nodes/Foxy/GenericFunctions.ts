import {
    OptionsWithUri,
} from 'request';

import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
} from 'n8n-core';

import {
    IDataObject,
    IHookFunctions,
    IWebhookFunctions,
} from 'n8n-workflow';

export async function foxyApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

    const endpoint = 'https://wilson.foxycart.com';
    const options: OptionsWithUri = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs: query,
        uri: endpoint,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }

    try {
        console.log('non error response:', await this.helpers.request!(options))
        return await this.helpers.request!(options);
    } catch (error) {
			console.log(error)
        if (error.response) {
            console.log('here is response:', error)
            // const errorMessage = error.response.body.message || error.response.body.description || error.message;
            throw new Error(`Foxy error response [${error.statusCode}]: ${error}`);
        }
        throw 'error';
    }
}
