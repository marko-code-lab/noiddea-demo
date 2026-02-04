import { t as defineCommand } from "../../_libs/citty.mjs";

//#region src/cli/commands/task/index.ts
var task_default = defineCommand({
	meta: {
		name: "task",
		description: "Operate in nitro tasks (experimental)"
	},
	subCommands: {
		list: () => import("./list.mjs").then((r) => r.default),
		run: () => import("./run.mjs").then((r) => r.default)
	}
});

//#endregion
export { task_default as default };