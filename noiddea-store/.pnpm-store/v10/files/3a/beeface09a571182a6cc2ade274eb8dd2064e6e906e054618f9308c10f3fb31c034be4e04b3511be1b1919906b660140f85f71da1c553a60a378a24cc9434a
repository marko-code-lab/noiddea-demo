import "#nitro/virtual/polyfills";
import type * as CF from "@cloudflare/workers-types";
import type { ServerRuntimeContext } from "srvx";
type MaybePromise<T> = T | Promise<T>;
export declare function createHandler<Env>(hooks: {
	fetch: (...params: [...Parameters<NonNullable<ExportedHandler<Env>["fetch"]>>, url: URL, cfContextExtras: any]) => MaybePromise<Response | CF.Response | undefined>;
}): {
	fetch(request, env, context);
	scheduled(controller, env, context);
	email(message, env, context);
	queue(batch, env, context);
	tail(traces, env, context);
	trace(traces, env, context);
};
export declare function augmentReq(cfReq: Request | CF.Request, ctx: NonNullable<ServerRuntimeContext["cloudflare"]>);
export {};
