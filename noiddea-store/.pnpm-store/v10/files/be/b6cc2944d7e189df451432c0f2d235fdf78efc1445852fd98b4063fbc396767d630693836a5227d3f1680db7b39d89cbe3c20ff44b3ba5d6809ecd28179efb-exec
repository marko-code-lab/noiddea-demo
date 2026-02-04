#!/usr/bin/env node
import { n as runMain, t as defineCommand } from "../_libs/citty.mjs";
import { version } from "nitro/meta";

//#region src/cli/index.ts
runMain(defineCommand({
	meta: {
		name: "nitro",
		description: "Nitro CLI",
		version
	},
	subCommands: {
		dev: () => import("./_chunks/dev.mjs").then((r) => r.default),
		build: () => import("./_chunks/build.mjs").then((r) => r.default),
		prepare: () => import("./_chunks/prepare.mjs").then((r) => r.default),
		task: () => import("./_chunks/task.mjs").then((r) => r.default)
	}
}));

//#endregion
export {  };