import type { Driver } from "../../types.mjs";
type DriverFactory<
	OptionsT,
	InstanceT
> = (opts: OptionsT) => Driver<OptionsT, InstanceT>;
interface ErrorOptions {}
export declare function defineDriver<
	OptionsT = any,
	InstanceT = never
>(factory: DriverFactory<OptionsT, InstanceT>): DriverFactory<OptionsT, InstanceT>;
export declare function normalizeKey(key: string | undefined, sep?: ":" | "/"): string;
export declare function joinKeys(...keys: string[]);
export declare function createError(driver: string, message: string, opts?: ErrorOptions);
export declare function createRequiredError(driver: string, name: string | string[]);
export {};
