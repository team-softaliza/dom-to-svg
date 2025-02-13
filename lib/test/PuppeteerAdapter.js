import PollyAdapter from '@pollyjs/adapter';
import * as chardet from 'chardet';
import contentType from 'content-type';
import { mapValues } from 'lodash-es';
import mime from 'mime-types';
import { Subscription, fromEvent } from 'rxjs';
const GOOGLE_LOGO_URL = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
const GOOGLE_LOGO_BODY = Buffer.from('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', 'base64');
function getBodyData(response, buffer) {
    const type = response.headers()['content-type'];
    let encoding = type ? contentType.parse(type).parameters.charset || mime.charset(type) : chardet.detect(buffer);
    if (encoding) {
        encoding = encoding.toLowerCase();
    }
    if (encoding) {
        const decoder = new TextDecoder(encoding);
        const body = decoder.decode(buffer);
        return { body, isBinary: false };
    }
    return { body: buffer.toString('hex'), isBinary: true };
}
/**
 * A Puppeteer adapter for Polly that supports all request resource types.
 *
 * TODO: upstream this?
 *
 * Polly's own Puppeteer adapter hangs when attempting to capture the page's initial document
 * (requestResourceType==='document'). See https://github.com/Netflix/pollyjs/issues/121
 *
 * Its very complex internal flow makes it hard to modify/fix. The internal flow of this adapter is much simpler,
 * and handles all request resource types.
 *
 */
export class PuppeteerAdapter extends PollyAdapter {
    constructor(polly) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        super(polly);
        this.subscriptions = new Subscription();
        /**
         * A map of all intercepted requests to their respond function, which will be called by the
         * 'response' event listener, causing Polly to record the response content.
         */
        this.pendingRequests = new Map();
        /**
         * Maps passthrough requests to an object containing:
         * - The response promise, which will be awaited in this.onPassthrough
         * - A respond function, called by 'response' event listener, which resolves the response promise.
         */
        this.passThroughRequests = new Map();
        this.page = this.options.page;
        this.requestResourceTypes = this.options.requestResourceTypes;
    }
    /**
     * The adapter's ID, used to reference it in the Polly constructor.
     */
    static get id() {
        return 'puppeteer';
    }
    /**
     * Called when connecting to a Puppeteer page. Sets up request and response interceptors.
     */
    onConnect() {
        this.subscriptions.add(fromEvent(this.page, 'request').subscribe(request => {
            var _a;
            const url = request.url();
            const method = request.method();
            const headers = request.headers();
            const isPreflight = method === 'OPTIONS' && !!headers.origin && !!headers['access-control-request-method'];
            if (isPreflight || !this.requestResourceTypes.includes(request.resourceType())) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                request.continue();
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.handleRequest({
                    headers,
                    url,
                    method,
                    body: (_a = request.postData()) !== null && _a !== void 0 ? _a : '',
                    requestArguments: {
                        request,
                    },
                });
            }
        }));
        this.subscriptions.add(fromEvent(this.page, 'response').subscribe(response => {
            var _a, _b;
            const request = response.request();
            if (this.pendingRequests.has(request)) {
                (_a = this.pendingRequests
                    .get(request)) === null || _a === void 0 ? void 0 : _a.respond(response).catch(error => {
                    if (error.message.includes('No resource with given identifier found')) {
                        return;
                    }
                    console.error('Failed to respond:', error);
                });
                this.pendingRequests.delete(request);
            }
            if (this.passThroughRequests.has(request)) {
                (_b = this.passThroughRequests.get(request)) === null || _b === void 0 ? void 0 : _b.respond(response);
            }
        }));
    }
    /**
     * Called when disconnecting from a Puppeteer.page.
     */
    onDisconnect() {
        this.subscriptions.unsubscribe();
    }
    /**
     * Given a request that should be allowed to pass through (not be intercepted),
     * return a Promise of the Response for that request, which will be passed to
     * request.respond().
     */
    async passthroughRequest(pollyRequest) {
        const { requestArguments: { request }, } = pollyRequest;
        let respond;
        const responsePromise = new Promise(resolve => (respond = resolve));
        this.passThroughRequests.set(request, { respond: response => respond(response), responsePromise });
        await request.continue();
        const response = await responsePromise;
        let bodyData = { isBinary: false, body: '' };
        if (response.status() < 300 || response.status() >= 400) {
            let buffer = await response.buffer();
            // No idea why, but CDP/Puppeteer report the body as empty for this request.
            if (response.url() === GOOGLE_LOGO_URL && response.status() === 200 && buffer.length === 0) {
                buffer = GOOGLE_LOGO_BODY;
            }
            bodyData = getBodyData(response, buffer);
        }
        // Important: CDP rejects headers values separated by \n, but returns them this way for multiple header values (e.g. Vary).
        const headers = mapValues(response.headers(), value => value.split('\n').join(', '));
        return {
            statusCode: response.status(),
            headers,
            ...bodyData,
        };
    }
    /**
     * Responds to an intercepted request with the given response.
     *
     * If an error happened when retreiving the response, abort the request.
     */
    async respondToRequest(pollyRequest, error) {
        const { requestArguments: { request }, response: { statusCode: status, headers, body, isBinary }, } = pollyRequest;
        // Do nothing for passthrough requests: Polly calls request.respond() internally.
        if (this.passThroughRequests.has(request)) {
            this.passThroughRequests.delete(request);
            return;
        }
        if (error) {
            await request.abort();
        }
        else {
            await request.respond({
                status,
                headers,
                body: isBinary ? Buffer.from(body, 'hex') : body,
            });
        }
    }
    /**
     * Called when a request is intercepted, for all requests (passthrough or stubbed).
     *
     * Adds an entry to pendingRequests, that will call the provided promise.resolve function
     * when a response for this request is received.
     */
    onRequest({ requestArguments: { request }, promise, }) {
        if (this.passThroughRequests.has(request)) {
            return;
        }
        const respond = async (response) => {
            let bodyData = { isBinary: false, body: '' };
            if (response.status() < 300 || response.status() >= 400) {
                let buffer = await response.buffer();
                // No idea why, but CDP/Puppeteer report the body as empty for this request.
                if (response.url() === GOOGLE_LOGO_URL && response.status() === 200 && buffer.length === 0) {
                    buffer = GOOGLE_LOGO_BODY;
                }
                bodyData = getBodyData(response, buffer);
            }
            const headers = mapValues(response.headers(), value => value.split('\n').join(', '));
            promise.resolve({
                statusCode: response.status(),
                headers,
                ...bodyData,
            });
        };
        this.pendingRequests.set(request, {
            respond,
        });
    }
}
//# sourceMappingURL=PuppeteerAdapter.js.map