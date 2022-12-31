export interface Options extends RequestInit {
	timeout?: number;
}

export type Headers = Record<string, string>;

async function throwBadRsp(response: Response) {
	if (response.status >= 300) {
		response.body?.getReader().read().then((buf) => {
			const rsp = new TextDecoder().decode(buf.value);
			throw new Error('Request failed: ' + response.status + '\n' + rsp);
		});
	}
	const json = await response.json();
	if (response.status >= 200 && response.status < 300) {
		return { json, headers: response.headers };
	}
	if (json && json.error) {
		throw new Error(response.status + ': ' + json.error);
	}
	throw new Error('Request failed: ' + response.status);
}

function fetchWithTimeout(
	url: string,
	fetchOptions: RequestInit,
	timeout: number
): Promise<Response> {
	return new Promise((resolve, reject) => {
		fetch(url, fetchOptions).then(resolve, reject);
		setTimeout(() => reject(new Error(`Timed out after ${timeout / 1000} seconds`)), timeout);
	});
}

async function _fetch(url: string, options: Options) {
	let response: Response;
	if (options && options.timeout) {
		response = await fetchWithTimeout(url, options, options.timeout);
	} else {
		response = await fetch(url, options);
	}
	return throwBadRsp(response);
}

async function _fetchWithBody(
	method: string,
	url: string,
	body: BodyInit,
	headers?: Headers,
	options?: Options
) {
	options || (options = { method });
	options.method = method;
	options.headers = headers || ({} as Headers);

	if (body) {
		if (body instanceof FormData) {
			options.body = body;
		} else {
			options.body = JSON.stringify(body);
			options.headers['Content-Type'] = 'application/json';
		}
	}
	return _fetch(url, options);
}

export async function put(url: string, body: any, headers?: Headers, options?: Options): Promise<any>  {
	return (await _fetchWithBody('PUT', url, body, headers, options)).json;
}

export async function post(url: string, body: any, headers?: Headers, options?: Options): Promise<any> {
	return (await _fetchWithBody('POST', url, body, headers, options)).json;
}

export async function patch(url: string, body: any, headers?: Headers, options?: Options): Promise<any>  {
	return (await _fetchWithBody('PATCH', url, body, headers, options)).json;
}

export async function reqGet(url: string, headers?: Headers, options?: Options): Promise<any>  {
	options = options || {};
	options.headers = headers;
	options.method = 'GET';
	return (await _fetch(url, options)).json;
}
