import "#nitro/virtual/polyfills";
import wsAdapter from "crossws/adapters/deno";
import { useNitroApp } from "nitro/app";
import { resolveWebsocketHooks } from "#nitro/runtime/app";
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter({ resolve: resolveWebsocketHooks }) : undefined;
// TODO: Migrate to srvx to provide request IP
Deno.serve((denoReq, info) => {
	// srvx compatibility
	const req = denoReq;
	req.runtime ??= { name: "deno" };
	req.runtime.deno ??= { info };
	// TODO: Support remoteAddr
	// https://crossws.unjs.io/adapters/deno
	if (import.meta._websocket && req.headers.get("upgrade") === "websocket") {
		return ws.handleUpgrade(req, info);
	}
	return nitroApp.fetch(req);
});
