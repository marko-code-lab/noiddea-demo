import { proxyRequest, redirect as sendRedirect } from "h3";
import { joinURL, withQuery, withoutBase } from "ufo";
import { defineCachedHandler } from "./cache.mjs";
// Headers route rule
export const headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) {
		event.res.headers.set(key, value);
	}
});
// Redirect route rule
export const redirect = ((m) => function redirectRouteRule(event) {
	let target = m.options?.to;
	if (!target) {
		return;
	}
	if (target.endsWith("/**")) {
		let targetPath = event.url.pathname + event.url.search;
		const strpBase = m.options._redirectStripBase;
		if (strpBase) {
			targetPath = withoutBase(targetPath, strpBase);
		}
		target = joinURL(target.slice(0, -3), targetPath);
	} else if (event.url.search) {
		target = withQuery(target, Object.fromEntries(event.url.searchParams));
	}
	return sendRedirect(target, m.options?.status);
});
// Proxy route rule
export const proxy = ((m) => function proxyRouteRule(event) {
	let target = m.options?.to;
	if (!target) {
		return;
	}
	if (target.endsWith("/**")) {
		let targetPath = event.url.pathname + event.url.search;
		const strpBase = m.options._proxyStripBase;
		if (strpBase) {
			targetPath = withoutBase(targetPath, strpBase);
		}
		target = joinURL(target.slice(0, -3), targetPath);
	} else if (event.url.search) {
		target = withQuery(target, Object.fromEntries(event.url.searchParams));
	}
	return proxyRequest(event, target, { ...m.options });
});
// Cache route rule
export const cache = ((m) => function cacheRouteRule(event, next) {
	if (!event.context.matchedRoute) {
		return next();
	}
	const cachedHandlers = globalThis.__nitroCachedHandlers ??= new Map();
	const { handler, route } = event.context.matchedRoute;
	const key = `${m.route}:${route}`;
	let cachedHandler = cachedHandlers.get(key);
	if (!cachedHandler) {
		cachedHandler = defineCachedHandler(handler, {
			group: "nitro/route-rules",
			name: key,
			...m.options
		});
		cachedHandlers.set(key, cachedHandler);
	}
	return cachedHandler(event);
});
