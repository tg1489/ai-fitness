import { httpRouter } from 'convex/server';
import {WebhookEvent} from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import {api} from './_generated/api'
import {httpAction} from './_generated/server'


const http = httpRouter()

http.route({
    path: '/clerk/webhook',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
        }

        const svix_id = request.headers.get('svix-id');
        const svix_signature = request.headers.get('svix-signature');
        const svix_timestamp = request.headers.get('svix-timestamp');

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response('No svix headers found', {status: 400,})
        }

    })

})