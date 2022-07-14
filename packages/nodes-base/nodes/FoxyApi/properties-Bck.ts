import {INodeProperties} from "n8n-workflow";

export const uiProperties = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: [
			{
				name: 'Coupons',
				value: 'coupons',
			},
			{
				name: 'Transactions',
				value: 'transactions',
			},
			{
				name: 'Subscriptions',
				value: 'subscriptions',
			},
			{
				name: 'Cart',
				value: 'cart',
			},
			{
				name: 'Customers',
				value: 'customers',
			},
			{
				name: 'Downloadables',
				value: 'downloadables',
			},
		],
		default: 'coupons',
		required: true,
		description: 'Resource to consume',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'coupons',
				],
			},
		},
		options: [
			{
				name: 'All Coupons',
				value: 'allCoupons',
				description: 'Get all coupons',
			},
			{
				name: 'Add New Coupon',
				value: 'addNewCoupons',
				description: 'Add New Coupons',
			},
		],
		default: 'addNewCoupons',
		description: 'The operation to perform.',
	},
	{
		displayName: 'Operation',
		name: 'transactionOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'transactions',
				],
			},
		},
		options: [
			{
				name: 'All Transactions',
				value: 'allTransactions',
				description: 'Get all Transactions',
			},
			{
				name: 'Transactions Filtered by Order Total',
				value: 'transactionsFilteredByOrderTotal',
				description: 'Transactions Filtered by Order Total',
			},
			{
				name: 'Add Attribute To Transaction',
				value: 'addAttributeToTransaction',
				description: 'Add Attribute To Transaction',
			},
			{
				name: 'View New Attribute',
				value: 'viewNewAttribute',
				description: 'View New Attribute',
			},
			{
				name: 'Replace Transaction Attribute',
				value: 'replaceTransactionAttribute',
				description: 'Replace Transaction Attribute',
			},
			{
				name: 'Update Transaction Attribute',
				value: 'updateTransactionAttribute',
				description: 'Replace Transaction Attribute',
			},
			{
				name: 'Delete Transaction Attribute',
				value: 'deleteTransactionAttribute',
				description: 'Delete Transaction Attribute',
			},
		],
		default: 'allTransactions',
		description: 'The operation to perform.',
	},
	{
		displayName: 'Operation',
		name: 'subscriptionOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'subscriptions',
				],
			},
		},
		options: [
			{
				name: 'All Subscriptions',
				value: 'allSubscriptions',
				description: 'Get all Subscriptions',
			},
			{
				name: 'View Subscription',
				value: 'viewSubscription',
			},
			{
				name: 'View Subscription Item',
				value: 'viewSubscriptionItem',
			},
			{
				name: 'Update Subscription Item',
				value: 'updateSubscriptionItem',
			},
		],
		default: 'allSubscriptions',
	},
	{
		displayName: 'Operation',
		name: 'cartOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'cart',
				],
			},
		},
		options: [
			{
				name: 'Create Cart',
				value: 'createCart',
			},
			{
				name: 'Populate Cart',
				value: 'populateCart',
			},
			{
				name: 'View Cart',
				value: 'viewCart',
			},
			{
				name: 'Create Cart Session',
				value: 'createCartSession',
			},
			{
				name: 'Charge Cart',
				value: 'chargeCart',
			},
		],
		default: 'createCart',
	},
	{
		displayName: 'Operation',
		name: 'customersOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'customers',
				],
			},
		},
		options: [
			{
				name: 'All Customers',
				value: 'allCustomers',
			},
			{
				name: 'All Non-Guest Customers',
				value: 'allNonGuestCustomers',
			},
		],
		default: 'allCustomers',
	},
	{
		displayName: 'Operation',
		name: 'downloadablesOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'downloadables',
				],
			},
		},
		options: [
			{
				name: 'All Downloadables',
				value: 'allDownloadables',
			},
			{
				name: 'Add New Downloadable',
				value: 'addNewDownloadable',
			},
			{
				name: 'View Downloadable',
				value: 'viewDownloadable',
			},
			{
				name: 'Update Downloadable',
				value: 'updateDownloadable',
			},
			{
				name: 'Delete Downloadable',
				value: 'deleteDownloadable',
			},
		],
		default: 'allDownloadables',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'addNewCoupons',
				],
				resource: [
					'coupons',
				],
			},
		},
		default:'',
		description:'Name of the coupon',
	},
	{
		displayName: 'Type',
		name: 'coupon_discount_type',
		type: 'options',
		options: [
			{
				name: 'Quantity Amount',
				value: 'quantity_amount',
			},
		],
		required: true,
		displayOptions: {
			show: {
				operation: [
					'addNewCoupons',
				],
				resource: [
					'coupons',
				],
			},
		},
		default:'',
		description:'Name of the coupon',
	},
	{
		displayName: 'Number of Uses',
		name: 'number_of_uses_allowed',
		type: 'options',
		options: [
			{
				name: '100',
				value: '100',
			},
			{
				name: '50',
				value: '50',
			},
		],
		required: true,
		displayOptions: {
			show: {
				operation: [
					'addNewCoupons',
				],
				resource: [
					'coupons',
				],
			},
		},
		default:'',
		description:'Name of the coupon',
	},
	{
		displayName: 'Order Total',
		name: 'orderTotal',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				transactionOperation: [
					'transactionsFilteredByOrderTotal',
				],
				resource: [
					'transactions',
				],
			},
		},
		default:'',
		description:'Order Total',
	},
	{
		displayName: 'Zoom',
		name: 'zoom',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				transactionOperation: [
					'transactionsFilteredByOrderTotal',
				],
				resource: [
					'transactions',
				],
			},
		},
		default:'',
		description:'Zoom',
	},
	{
		displayName: 'Name',
		name: 'downloadableName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				downloadablesOperation: [
					'addNewDownloadable',
				],
				resource: [
					'downloadables',
				],
			},
		},
		default:'',
		description:'Downloadable Name',
	},
	{
		displayName: 'Code',
		name: 'downloadableCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				downloadablesOperation: [
					'addNewDownloadable',
				],
				resource: [
					'downloadables',
				],
			},
		},
		default:'',
		description:'Downloadable Code',
	},
	{
		displayName: 'Price',
		name: 'downloadablePrice',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				downloadablesOperation: [
					'addNewDownloadable',
				],
				resource: [
					'downloadables',
				],
			},
		},
		default:'',
		description:'Downloadable Price',
	},
	{
		displayName: 'Item Category URI',
		name: 'itemCategoryURI',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				downloadablesOperation: [
					'addNewDownloadable',
				],
				resource: [
					'downloadables',
				],
			},
		},
		default:'',
		description:'Downloadable Item Category URI',
	},
	// {
	// 	displayName: 'File',
	// 	name: 'downloadableFile',
	// 	type: 'file',
	// 	required: true,
	// 	displayOptions: {
	// 		show: {
	// 			downloadablesOperation: [
	// 				'addNewDownloadable',
	// 			],
	// 			resource: [
	// 				'downloadable',
	// 			],
	// 		},
	// 	},
	// 	default:'',
	// 	description:'Downloadable Name',
	// },
] as INodeProperties[];
