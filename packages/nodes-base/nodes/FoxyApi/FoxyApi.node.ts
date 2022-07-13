import {
	IExecuteFunctions,
} from 'n8n-core';

import {uiProperties} from './properties';

import {
	IDataObject,
	INodeExecutionData, INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	handleExecute
} from './GenericFunctions';

import {
	OptionsWithUri,
} from 'request';

export class FoxyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FoxyApi',
		name: 'foxyApi',
		icon: 'file:foxyLogo.png',
		group: ['transform'],
		version: 1,
		description: 'Consume Foxy API',
		defaults: {
			name: 'FoxyApi',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
		],
		properties: uiProperties ,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

// console.log('allCouponCodes::', allCouponCodes );
		// const transactionsResponse = await transactionsNode.post({
		// 	'name': 'n8n second Coupon',
		// 	'coupon_discount_type': 'quantity_amount',
		// 	'coupon_discount_details': '2-5',
		// 	'number_of_uses_allowed': 100,
		// 	'combinable': true
		// });
		// console.log('transactionsResponse::', transactionsResponse)
		// const transactions = await transactionsResponse.json();
		// const mysqlCredentials = {
		// 	host: 'localhost',
		// 	database: 'n8n',
		// 	user: 'root',
		// 	password: '',
		// 	port: 3306,
		// };
		//
		// const mysql = require('mysql2/promise');
		// const connection = await mysql.createConnection(mysqlCredentials);
		// const insertSQL = `INSERT INTO test (name ) VALUES (?);`;
		// const queryResult = await connection.execute(insertSQL, ['name1']);
		const that = this;
		const response = await handleExecute(that);
		return [this.helpers.returnJsonArray(response)];
	}
}
