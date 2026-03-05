import type { QueryFunction } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

interface FetcherOptions<TPayload = unknown, TSearchParams = Record<string, string>> {
	readonly method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
	readonly payload?: TPayload;
	readonly searchParams?: TSearchParams;
	readonly signal?: AbortSignal;
	readonly withFile?: boolean;
}

// * Tuple: [<Request Path>, <Request query params>]
const queryKeySchema = z.tuple([z.string().startsWith('/'), z.record(z.string(), z.string()).default({})]);
const pageParamSchema = z.string().optional();

const httpClient = axios.create({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_BACKEND_VERSION}`,
});

const fetcher = async <TResponse = unknown, TPayload = unknown, TSearchParams = Record<string, string>>(
	path: `/${string}`,
	options?: FetcherOptions<TPayload, TSearchParams>,
) => {
	const response = await httpClient<TResponse>(path, {
		method: options?.method,
		headers: {
			'Content-Type': options?.withFile ? 'multipart/form-data' : 'application/json',
		},
		data: options?.payload,
		params: options?.searchParams,
		signal: options?.signal,
	});

	return response.data;
};

export const defaultQueryFunction: QueryFunction = async ({ queryKey, pageParam, meta }) => {
	const [parsedPath, parsedQueryParams] = await queryKeySchema.parseAsync(queryKey);
	const parsedPageParam = await pageParamSchema.parseAsync(pageParam);

	if (parsedPageParam) {
		parsedQueryParams['cursor'] = parsedPageParam;
	}

	const urlSearchParamsObject = new URLSearchParams(parsedQueryParams);

	const fullRequestPath = `${parsedPath}?${urlSearchParamsObject.toString()}`;

	const response = await httpClient.get(fullRequestPath, {
		responseType: meta?.['fileDownload'] ? 'blob' : 'json',
	});

	return response.data;
};

export const getRequest = <TResponse = unknown, TSearchParams = Record<string, string>>(
	path: `/${string}`,
	options?: Pick<FetcherOptions<never, TSearchParams>, 'searchParams' | 'signal'>,
) =>
	fetcher<TResponse, undefined, TSearchParams>(path, {
		method: 'GET',
		searchParams: options?.searchParams,
		signal: options?.signal,
	});

export const deleteRequest = <TResponse = unknown, TSearchParams = Record<string, string>>(
	path: `/${string}`,
	options?: Pick<FetcherOptions<never, TSearchParams>, 'searchParams' | 'signal'>,
) =>
	fetcher<TResponse, undefined, TSearchParams>(path, {
		method: 'DELETE',
		searchParams: options?.searchParams,
		signal: options?.signal,
	});

export const patchRequest = <TResponse = unknown, TPayload = unknown, TSearchParams = Record<string, string>>(
	path: `/${string}`,
	options?: Pick<FetcherOptions<TPayload, TSearchParams>, 'payload' | 'searchParams' | 'signal'>,
) =>
	fetcher<TResponse, TPayload, TSearchParams>(path, {
		method: 'PATCH',
		payload: options?.payload,
		signal: options?.signal,
	});

export const postRequest = <TResponse = unknown, TPayload = unknown, TSearchParams = Record<string, string>>(
	path: `/${string}`,
	options?: Pick<FetcherOptions<TPayload, TSearchParams>, 'payload' | 'searchParams' | 'signal'>,
) =>
	fetcher<TResponse, TPayload, TSearchParams>(path, {
		method: 'POST',
		payload: options?.payload,
		signal: options?.signal,
	});
