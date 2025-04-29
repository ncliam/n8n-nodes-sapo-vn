import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export class Sapo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sapo',
    name: 'sapo',
    group: ['transform'],
		icon: 'file:../../shared/sapo.png' as const,
    version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    description: 'Interact with Sapo API',
    defaults: {
      name: 'Sapo',
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
				noDataExpression: true,
				options: [
					{ name: 'Customer', value: 'customer' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'customer',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{ name: 'Get All Customer', value: 'getAllCustomers', action: 'Get all customers'},

				],
				default: 'getAllCustomers',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{ name: 'Get All Webhooks', value: 'getAllWebhooks', action: 'Get all webhooks'},

				],
				default: 'getAllWebhooks',
			},

		]

  };

  async execute(this: IExecuteFunctions): Promise<any> {
    const credentials = await this.getCredentials('sapoApi');
    const apiKey = credentials.apiKey;
    const apiSecret = credentials.apiSecret;
    const domain = credentials.domain;
		const sapoToken = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
		try {
			if (resource === 'customer') {
				if (operation === 'getAllCustomers') {
					const responseData = await this.helpers.request({
						method: 'GET',
						url: `${domain}/admin/customers.json`,
						headers: {
							Authorization: `Basic ${sapoToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					});
					return [this.helpers.returnJsonArray(responseData.customers)];
				}
			} else if (resource === 'webhook') {
				if (operation === 'getAllWebhooks') {
					const responseData = await this.helpers.request({
						method: 'GET',
						url: `${domain}/admin/webhooks.json`,
						headers: {
							Authorization: `Basic ${sapoToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					});
					return [this.helpers.returnJsonArray(responseData.webhooks)];

				}
			}
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to fetch webhooks: ${(error as Error).message}`);
		}
    throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported.`);
  }
}
