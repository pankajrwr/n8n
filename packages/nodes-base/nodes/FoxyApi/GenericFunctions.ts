import {
	OptionsWithUri,
} from 'request';

import { AxiosRequestConfig } from 'axios';

import mysql2 from 'mysql2/promise';
import { Coupons } from './couponFunctions';
import axios from 'axios';
import {
	BINARY_ENCODING,
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject, INodeExecutionData, NodeApiError, NodeOperationError,
} from 'n8n-workflow';
import snowflake from "snowflake-sdk";
import redis from "redis";
import FoxySDK from "@foxy.io/sdk";

export async function freshdeskApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const credentials = await this.getCredentials('freshdeskApi');

	const apiKey = `${credentials.apiKey}:X`;

	const endpoint = 'freshdesk.com/api/v2';

	let options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${Buffer.from(apiKey).toString(BINARY_ENCODING)}`,
		},
		method,
		body,
		qs: query,
		uri: uri || `https://${credentials.domain}.${endpoint}${resource}`,
		json: true,
	};
	if (!Object.keys(body).length) {
		delete options.body;
	}
	if (!Object.keys(query).length) {
		delete options.qs;
	}
	options = Object.assign({}, options, option);
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function freshdeskApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;
	let uri: string | undefined;
	query.per_page = 100;
	do {
		responseData = await freshdeskApiRequest.call(this, method, endpoint, body, query, uri, { resolveWithFullResponse: true });
		if (responseData.headers.link) {
			uri = responseData.headers['link'].split(';')[0].replace('<', '').replace('>','');
		}
		returnData.push.apply(returnData, responseData.body);
	} while (
		responseData.headers['link'] !== undefined &&
		responseData.headers['link'].includes('rel="next"')
		);
	return returnData;
}

export async function handleExecute(fns: IExecuteFunctions){

	const foxySDK = require('@foxy.io/sdk');

	const foxyApi = new foxySDK.Backend.API({
		refreshToken: 'UIBRufC4TmSSQYbaVCqasAQgdGhEaBzAfGJS4dIg',
		clientSecret: 'wuwy5XRD86luAzmKvl7X65sSGL8Q9V6sxF4yF22l',
		clientId: 'client_j5Mbyv82R2BrZu67ibvw',
	});

	type Options = {
		method?: string,
		body?: string,
		headers?: object,
	};

	type Method = 'get' | 'post' | 'delete' | 'patch' | 'put' ;

	const options: Options = {};

	let url = fns.getNodeParameter('url', 0) as string;
	const method =  fns.getNodeParameter('method', 0) as Method;
	const query = fns.getNodeParameter('query', 0, null) as string;
	const body = fns.getNodeParameter('body', 0, null) as string;

	options.method = method;

	if(query){
			url += query;
	}

	if(body){
		options.body = fns.getNodeParameter('body', 0) as string;
	}

	const foxyResponse = await foxyApi.fetch(url, options)
	.then((response: { json: () => any; }) => {
		return response.json();
	})
	.then((data: any) => {
		return data;
	});

	return foxyResponse;
}

async function createRedisConnection(){
	// const mysql = require('mysql2/promise');
	// const client = redis.createClient(redisOptions);
	const mysqlCredentials = {
		host: 'localhost',
		database: 'n8n',
		user: 'root',
		password: '',
		port: 3306,
	};
console.log('settingup');
	try {
		const mysql3 = require('mysql2/promise');
		// create the connection
		const connection = await mysql3.createConnection(mysqlCredentials);
		// query database
		console.log('herer', connection)
		const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

		// const connection = await mysql.createConnection(mysqlCredentials);
		//
		// console.log('connection:', connection)
		// const insertSQL = `INSERT INTO test (id, name ) VALUES (?, ?);`;
		// console.log('q:', insertSQL);
		// const queryResult = await connection.execute(insertSQL, [2, 'name']).then(function(result:any) {
		// 	console.log(result) // "Some User token"
		// })

		console.log('queryrsult:', rows);
		return rows
	}
	catch (e){
	console.log('error:', e)
	}

}
