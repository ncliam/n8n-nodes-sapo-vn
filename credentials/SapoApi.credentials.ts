import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
	ICredentialTestRequest
} from 'n8n-workflow';

export class SapoApi implements ICredentialType {
	name = 'sapoApi';
	displayName = 'Sapo API';
	icon = 'file:../shared/sapo.png' as const;
	documentationUrl = 'https://developers.sapo.vn';
	properties: INodeProperties[] = [
			{
					displayName: 'API Key',
					name: 'apiKey',
					type: 'string',
					typeOptions: {
					password: true,
			},
					default: '',
			},
			{
					displayName: 'API Secret',
					name: 'apiSecret',
					type: 'string',
					typeOptions: {
							password: true,
					},
					default: '',
			},
			{
					displayName: 'Domain',
					name: 'domain',
					type: 'string',
					placeholder: 'https://{your-shop}.mysapo.net',
					default: '',
			},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
    	headers: {
        Authorization: '={{"Basic " + Buffer.from($credentials.apiKey + ":" + $credentials.apiSecret).toString("base64")}}',
      },
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/bearer',
		},
	};
}
