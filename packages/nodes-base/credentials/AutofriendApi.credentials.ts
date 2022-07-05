import {
    ICredentialType,
    NodePropertyTypes,
} from 'n8n-workflow';

export class AutofriendApi implements ICredentialType {
    name = 'autofriendApi';
    displayName = 'Autofriend API';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string' as NodePropertyTypes,
            default: '',
        },
    ];
}
