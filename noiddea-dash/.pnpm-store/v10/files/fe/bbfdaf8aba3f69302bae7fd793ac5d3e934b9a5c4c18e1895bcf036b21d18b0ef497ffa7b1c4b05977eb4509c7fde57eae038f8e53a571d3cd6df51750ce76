import { V as a } from "./common.mjs";
import { nitro } from "nitro/vite";

//#region src/build/vite/build.ts
async function viteBuild(nitro$1) {
	if (nitro$1.options.dev) throw new Error("Nitro dev CLI does not supports vite. Please use `vite dev` instead.");
	const { createBuilder } = await import(nitro$1.options.__vitePkg__ || "vite");
	await (await createBuilder({
		base: nitro$1.options.rootDir,
		plugins: [await nitro({ _nitro: nitro$1 })],
		logLevel: a ? "warn" : void 0
	})).buildApp();
}

//#endregion
export { viteBuild };