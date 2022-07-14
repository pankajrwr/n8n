import {
	OptionsWithUri,
} from 'request';

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

	// console.log(fns);
	// const credentials = await fns.getCredentials('redis');
	// const a = await createRedisConnection();
	// console.log('a:', a);
	// console.log('cred:', credentials);
	interface OperationMap {
		coupons: string;
		transactions: string;
		subscriptions: string;
		cart: string;
		customers: string;
		downloadables: string;
	}
	const operationMap: OperationMap = {
		coupons: 'operation',
		transactions: 'transactionOperation',
		subscriptions: 'subscriptionsOperation',
		cart: 'cartOperation',
		customers: 'customersOperation',
		downloadables: 'downloadablesOperation',
	};

	type Headers = {
		'FOXY-API-VERSION'?: number;
		Authorization?: string;
		'Content-Type'?: string;
	};

	type Config = {
		headers?: Headers,
		params?: object;
		data?: object;
	};

	const config: Config = {};
	config.headers = {
		'FOXY-API-VERSION': 1,
		'Authorization': 'Bearer 93eb7450494a40dfe966d243c6a9721c9c2bdf74',
		'Content-Type': 'application/json',
	};

	const url = fns.getNodeParameter('url', 0) as string;
	// const operationName = operationMap[resource as keyof OperationMap];
	const method = fns.getNodeParameter('method', 0) as string;

	let query;


	if(method === 'get'){
		query = fns.getNodeParameter('query', 0, null) as string;
		// console.log('query:', query);
		if(query){ console.log('in with ', query);
			try {
				config.params = JSON.parse('{"' + decodeURI(query.replace(/&/g, '\",\"').replace(/=/g,'\":\"')) + '"}');
			}
			catch (err){
				console.log('Error: ', err);
			}
		}
	}
	let body: object;
	if(method === 'post'){
		body = JSON.parse(fns.getNodeParameter('body', 0) as string);
	}
	console.log('resource:', url);
	console.log('method:', method);
	console.log('config', config);
	// console.log('body:', body)

	const aresponse = await axios['get'](url,  config).then((response) => response.data );

	console.log('aresponse:', aresponse);
	return aresponse;
	// const response = url.get();
	// const foxySDK = require('@foxy.io/sdk');
	// const api = new foxySDK.Backend.API
	// 	.API({
	// 	refreshToken: 'UIBRufC4TmSSQYbaVCqasAQgdGhEaBzAfGJS4dIg',
	// 	clientSecret: 'wuwy5XRD86luAzmKvl7X65sSGL8Q9V6sxF4yF22l',
	// 	clientId: 'client_j5Mbyv82R2BrZu67ibvw',
	// });

	// api.get()


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
//
// class testClass{
// 	changeColor(color: any) {
// 		console.log(color)
// 	}
// }
