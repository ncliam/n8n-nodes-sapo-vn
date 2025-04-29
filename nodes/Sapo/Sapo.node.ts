import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export class Sapo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SAPO',
		name: 'sapo',
		icon: 'file:../../shared/sapo.png' as const,
		group: ['transform'],
		version: 1,
		description: 'Interact with SAPO API',
		defaults: {
			name: 'SAPO',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sapoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Customer',
						value: 'customer',
					 },
					{
						name: 'Order',
						value: 'order',
					},
				],
				default: 'product',
				description: 'Resource to interact with',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Get Products',
						value: 'getProducts',
						description: 'Retrieve a list of products',
						action: 'Retrieve a list of products',
					},
					{
						name: 'Get Customers',
						value: 'getCustomers',
						description: 'Retrieve a list of customers',
						action: 'Retrieve a list of customers',
					 },
					{
						name: 'Create Order',
						value: 'createOrder',
						description: 'Create a new order',
						action: 'Create a new order',
					},
				],
				default: 'getProducts',
				noDataExpression: true,
			},
			{
				displayName: 'Order Data',
				name: 'orderData',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['createOrder'],
					},
				},
				default: '',
				description: 'The data for the order to create in JSON format',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const credentials = await this.getCredentials('sapoApi');
		const apiKey = credentials.apiKey;
		// const apiSecret = credentials.apiSecret;
		const domain = credentials.domain;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let response;
		const apiEndpoint = `https://${domain}/api/v1`;

		if (resource === 'product' && operation === 'getProducts') {
			// Get Products logic
			response = await this.helpers.request({
				method: 'GET',
				url: `${apiEndpoint}/products`,
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			});
		} else if (resource === 'customer' && operation === 'getCustomers') {
			// Get Customers logic
			response = await this.helpers.request({
				method: 'GET',
				url: `${apiEndpoint}/customers`,
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			});
		} else if (resource === 'order' && operation === 'createOrder') {
			// Create Order logic
			const orderData = this.getNodeParameter('orderData', 0) as string;
			response = await this.helpers.request({
				method: 'POST',
				url: `${apiEndpoint}/orders`,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.parse(orderData),
				json: true,
			});
		} else {
			throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for resource "${resource}".`);
		}

		return [this.helpers.returnJsonArray(response)];
	}
}
