import "#nitro/virtual/polyfills";
import type { Request as CFRequest, EventContext, ExecutionContext } from "@cloudflare/workers-types";
/**
* Reference: https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#parameters
*/
interface CFPagesEnv {
	ASSETS: {
		fetch: (request: CFRequest) => Promise<Response>;
	};
	CF_PAGES: "1";
	CF_PAGES_BRANCH: string;
	CF_PAGES_COMMIT_SHA: string;
	CF_PAGES_URL: string;
	[key: string]: any;
}
declare const _default: {
	fetch(cfReq: CFRequest, env: CFPagesEnv, context: EventContext<CFPagesEnv, string, any>);
	scheduled(event: any, env: CFPagesEnv, context: ExecutionContext);
};
export default _default;
