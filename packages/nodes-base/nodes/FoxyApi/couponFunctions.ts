// interface Coupons {
// 	couponNode: any;
// 	allCoupons(): void;
// }

import {IExecuteFunctions} from "n8n-core";
const foxySDK = require('@foxy.io/sdk');

export class Coupons{
	private couponNode: any;
	private IEFunctions: IExecuteFunctions;

	constructor(public fns: IExecuteFunctions) {
		this.IEFunctions = fns;

		const api = new foxySDK.Backend.API({
			refreshToken: 'UIBRufC4TmSSQYbaVCqasAQgdGhEaBzAfGJS4dIg',
			clientSecret: 'wuwy5XRD86luAzmKvl7X65sSGL8Q9V6sxF4yF22l',
			clientId: 'client_j5Mbyv82R2BrZu67ibvw',
		});
		this.couponNode = api.follow('fx:store').follow('fx:coupons');
	}

	async allCoupons(): Promise<any>{
		const allCouponCodesResponse = await this.couponNode.get();
		const allCouponCodes = await allCouponCodesResponse.json();
		console.log('inside allCoupons seriously');
		return allCouponCodes;

	}

	execute(): void{
		console.log('inside execute');
	}
}
