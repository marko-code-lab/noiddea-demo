import "#nitro/virtual/polyfills";
import { DurableObject } from "cloudflare:workers";
declare const _default;
export default _default;
export declare class $DurableObject extends DurableObject {
	constructor(state: DurableObjectState, env: Record<string, any>);
	fetch(request: Request);
	alarm(): void | Promise<void>;
	webSocketMessage(client: WebSocket, message: ArrayBuffer | string);
	webSocketClose(client: WebSocket, code: number, reason: string, wasClean: boolean);
}
