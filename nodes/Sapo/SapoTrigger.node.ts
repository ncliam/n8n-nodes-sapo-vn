import {
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

export class SapoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sapo Trigger',
    name: 'sapoTrigger',
    group: ['trigger'],
    version: 1,
    icon: 'file:../../shared/sapo.png' as const,
    description: 'Trigger when a Sapo event occurs',
    defaults: {
      name: 'Sapo Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'sapoApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'sapo-order-event',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          { name: 'Order Updated', value: 'orderUpdated' },
          { name: 'Order Created', value: 'orderCreated' },
        ],
        default: 'orderUpdated',
        description: 'The event to trigger on',
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData();
    const event = this.getNodeParameter('event') as string;

    return {
      workflowData: [
        this.helpers.returnJsonArray([
          {
            source: 'sapo',
            event,
            payload: body,
          },
        ]),
      ],
    };
  }
}
