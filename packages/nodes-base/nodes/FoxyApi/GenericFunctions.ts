import {
	OptionsWithUri,
} from 'request';

import mysql2 from 'mysql2/promise';
import { Coupons } from './couponFunctions';

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

	const resource = fns.getNodeParameter('resource', 0) as string;
	const operationName = operationMap[resource as keyof OperationMap];
	const operation = fns.getNodeParameter(operationName, 0) as string;

	console.log('resource:', resource);
	console.log('operation:', operation);

	const foxySDK = require('@foxy.io/sdk');
	const api = new foxySDK.Backend.API({
		refreshToken: 'UIBRufC4TmSSQYbaVCqasAQgdGhEaBzAfGJS4dIg',
		clientSecret: 'wuwy5XRD86luAzmKvl7X65sSGL8Q9V6sxF4yF22l',
		clientId: 'client_j5Mbyv82R2BrZu67ibvw',
	});

	if(resource === 'coupons'){



		const couponsNode = api.follow('fx:store').follow('fx:coupons');
		if(operation === 'allCoupons'){
			const couponClass = new Coupons(fns);
			console.log('calling from class')
			const allCouponCodes = await couponClass[operation]();

			return allCouponCodes;
			// Coupons.execute()
			// const allCouponCodesResponse = await couponsNode.get();
			// const allCouponCodes = await allCouponCodesResponse.json();
			// return allCouponCodes;
		}
		if(operation === 'addNewCoupons'){
			const name = fns.getNodeParameter('name', 0) as string;
			const couponDiscountType = fns.getNodeParameter('coupon_discount_type', 0) as string;
			const numberOfUsesAllowed = fns.getNodeParameter('number_of_uses_allowed', 0) as string;
			const addCouponResponse = await couponsNode.post({
				name,
				coupon_discount_type: couponDiscountType,
				number_of_uses_allowed: numberOfUsesAllowed,
				'coupon_discount_details': '5-6',
				'combinable': false
			});
			const addNewCouponCode = await addCouponResponse.json();
			return addNewCouponCode;
		}
	}
	if(resource === 'transactions'){
		const transactionsNode = api.follow('fx:store').follow('fx:transactions');
			if(operation === 'allTransactions'){
				const allTransactionsResponse = await transactionsNode.get();
				const allTransactions = await allTransactionsResponse.json();
				return allTransactions;
			}
			if(operation === 'transactionsFilteredByOrderTotal'){

				const orderTotal = fns.getNodeParameter('orderTotal', 0) as string;
				const zoom = fns.getNodeParameter('zoom', 0) as string;

				const filteredTransactionsResponse = await transactionsNode.get({ order_total: orderTotal, zoom: [zoom] });
				const filteredTransactions = await filteredTransactionsResponse.json();
				return filteredTransactions;
			}
	}
	if(resource === 'subscriptions'){
		const subscriptionNode = api.follow('fx:store').follow('fx:subscriptions');
		if(operation === 'allSubscriptions'){
			const subscriptionResponse = await subscriptionNode.get();
			const appSubscription = await subscriptionResponse.json();
			return appSubscription;
		}
	}
	if(resource === 'cart'){
		const cartNode = api.follow('fx:store').follow('fx:carts');
		if(operation === 'createCart'){
			const cartResponse = await cartNode.post();
			const cart = await cartResponse.json();
			return cart;
		}
	}
	if(resource === 'customers'){
		const customersNode = api.follow('fx:store').follow('fx:customers');
		if(operation === 'allCustomers'){
			const customersResponse = await customersNode.get();
			const customers = await customersResponse.json();
			return customers;
		}
		if(operation === 'allNonGuestCustomers'){
			const nonGuestcustomersResponse = await customersNode.get({is_anonymous: 0});
			const nonGuestCustomers = await nonGuestcustomersResponse.json();
			return nonGuestCustomers;
		}
	}
	if(resource === 'downloadables'){
		const downloadablesNode = api.follow('fx:store').follow('fx:downloadables');
		if(operation === 'allDownloadables'){
			const downloadablesResponse = await downloadablesNode.get();
			const downloadables = await downloadablesResponse.json();
			return downloadables;
		}
		if(operation === 'addNewDownloadable'){
			const downloadableName = fns.getNodeParameter('downloadableName', 0) as string;
			const downloadableCode = fns.getNodeParameter('downloadableCode', 0) as string;
			const downloadablePrice = fns.getNodeParameter('downloadablePrice', 0) as string;
			const itemCategoryURI = fns.getNodeParameter('itemCategoryURI', 0) as string;

			const addDownloadablesResponse = await downloadablesNode.post({
				name: downloadableName,
				code: downloadableCode,
				price: downloadablePrice,
				item_category_uri: itemCategoryURI,
			});
			const addDownloadables = await addDownloadablesResponse.json();
			return addDownloadables;
		}
	}
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

class testClass{
	changeColor(color: any) {
		console.log(color)
	}
}
