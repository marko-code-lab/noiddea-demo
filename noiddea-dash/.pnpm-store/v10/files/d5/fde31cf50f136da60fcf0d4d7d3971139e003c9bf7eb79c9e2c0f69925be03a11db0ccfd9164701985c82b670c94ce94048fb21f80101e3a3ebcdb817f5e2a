import { type RedisConfigNodejs } from "@upstash/redis";
export interface UpstashOptions extends Partial<RedisConfigNodejs> {
	/**
	* Optional prefix to use for all keys. Can be used for namespacing.
	*/
	base?: string;
	/**
	* Default TTL for all items in seconds.
	*/
	ttl?: number;
	/**
	* How many keys to scan at once.
	*
	* [redis documentation](https://redis.io/docs/latest/commands/scan/#the-count-option)
	*/
	scanCount?: number;
}
declare const _default;
export default _default;
