import type { GetStoreOptions, GetDeployStoreOptions } from "@netlify/blobs";
export type NetlifyStoreOptions = NetlifyDeployStoreLegacyOptions | NetlifyDeployStoreOptions | NetlifyNamedStoreOptions;
export interface ExtraOptions {
	/** If set to `true`, the store is scoped to the deploy. This means that it is only available from that deploy, and will be deleted or rolled-back alongside it. */
	deployScoped?: boolean;
}
export interface NetlifyDeployStoreOptions extends GetDeployStoreOptions, ExtraOptions {
	name?: never;
	deployScoped: true;
}
export interface NetlifyDeployStoreLegacyOptions extends NetlifyDeployStoreOptions {
	// Added in v8.0.0. This ensures TS compatibility for older versions.
	region?: never;
}
export interface NetlifyNamedStoreOptions extends GetStoreOptions, ExtraOptions {
	name: string;
	deployScoped?: false;
}
declare const _default;
export default _default;
