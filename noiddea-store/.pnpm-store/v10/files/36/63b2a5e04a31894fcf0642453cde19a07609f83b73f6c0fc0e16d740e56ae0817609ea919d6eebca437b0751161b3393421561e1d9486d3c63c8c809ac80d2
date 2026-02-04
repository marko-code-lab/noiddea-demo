import "../_common.mjs";
import { _ as writeTypes, at as join, d as libChunkName, f as baseBuildConfig, h as writeBuildInfo, l as NODE_MODULES_RE, n as baseBuildPlugins, st as relative, u as getChunkName } from "./common.mjs";
import { i as debounce } from "../_libs/rc9+c12+dotenv.mjs";
import { t as formatCompatibilityDate } from "../_libs/compatx.mjs";
import { n as scanHandlers } from "../_chunks/nitro2.mjs";
import { n as watch$1 } from "../_libs/readdirp+chokidar.mjs";
import { t as generateFSTree } from "../_chunks/utils.mjs";
import { builtinModules } from "node:module";
import { watch } from "node:fs";
import { defu } from "defu";

//#region src/build/rolldown/config.ts
const getRolldownConfig = async (nitro) => {
	const base = baseBuildConfig(nitro);
	const tsc = nitro.options.typescript.tsConfig?.compilerOptions;
	let config = {
		platform: nitro.options.node ? "node" : "neutral",
		cwd: nitro.options.rootDir,
		input: nitro.options.entry,
		external: [
			...base.env.external,
			...builtinModules,
			...builtinModules.map((m) => `node:${m}`)
		],
		plugins: [...await baseBuildPlugins(nitro, base)],
		resolve: {
			alias: base.aliases,
			extensions: base.extensions,
			conditionNames: nitro.options.exportConditions
		},
		transform: {
			inject: base.env.inject,
			jsx: {
				runtime: tsc?.jsx === "react" ? "classic" : "automatic",
				pragma: tsc?.jsxFactory,
				pragmaFrag: tsc?.jsxFragmentFactory,
				importSource: tsc?.jsxImportSource,
				development: nitro.options.dev
			}
		},
		onwarn(warning, warn) {
			if (!base.ignoreWarningCodes.has(warning.code || "")) {
				console.log(warning.code);
				warn(warning);
			}
		},
		treeshake: { moduleSideEffects(id) {
			return nitro.options.moduleSideEffects.some((p) => id.startsWith(p));
		} },
		optimization: { inlineConst: true },
		output: {
			format: "esm",
			entryFileNames: "index.mjs",
			chunkFileNames: (chunk) => getChunkName(chunk, nitro),
			codeSplitting: { groups: [{
				test: NODE_MODULES_RE,
				name: (id) => libChunkName(id)
			}] },
			dir: nitro.options.output.serverDir,
			inlineDynamicImports: nitro.options.inlineDynamicImports,
			minify: nitro.options.minify ? true : "dce-only",
			sourcemap: nitro.options.sourcemap,
			sourcemapIgnoreList(relativePath) {
				return relativePath.includes("node_modules");
			}
		}
	};
	config = defu(nitro.options.rolldownConfig, nitro.options.rollupConfig, config);
	const outputConfig = config.output;
	if (outputConfig.inlineDynamicImports || outputConfig.format === "iife") delete outputConfig.codeSplitting;
	return config;
};

//#endregion
//#region src/build/rolldown/dev.ts
async function watchDev(nitro, config) {
	const rolldown = await import("rolldown");
	let watcher;
	async function load() {
		if (watcher) await watcher.close();
		await scanHandlers(nitro);
		nitro.routing.sync();
		watcher = startWatcher(nitro, config);
		await writeTypes(nitro);
	}
	const reload = debounce(load);
	const scanDirs = nitro.options.scanDirs.flatMap((dir) => [
		join(dir, nitro.options.apiDir || "api"),
		join(dir, nitro.options.routesDir || "routes"),
		join(dir, "middleware"),
		join(dir, "plugins"),
		join(dir, "modules")
	]);
	const watchReloadEvents = new Set([
		"add",
		"addDir",
		"unlink",
		"unlinkDir"
	]);
	const scanDirsWatcher = watch$1(scanDirs, { ignoreInitial: true }).on("all", (event) => {
		if (watchReloadEvents.has(event)) reload();
	});
	const rootDirWatcher = watch(nitro.options.rootDir, { persistent: false }, (_event, filename) => {
		if (filename && /^server\.[mc]?[jt]sx?$/.test(filename)) reload();
	});
	nitro.hooks.hook("close", () => {
		watcher.close();
		scanDirsWatcher.close();
		rootDirWatcher.close();
	});
	nitro.hooks.hook("rollup:reload", () => reload());
	await load();
	function startWatcher(nitro$1, config$1) {
		const watcher$1 = rolldown.watch(config$1);
		let start;
		watcher$1.on("event", (event) => {
			switch (event.code) {
				case "START":
					start = Date.now();
					nitro$1.logger.info(`Starting dev watcher (builder: \`rolldown\`, preset: \`${nitro$1.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro$1.options.compatibilityDate)}\`)`);
					nitro$1.hooks.callHook("dev:start");
					break;
				case "BUNDLE_END":
					nitro$1.hooks.callHook("compiled", nitro$1);
					if (nitro$1.options.logging.buildSuccess) nitro$1.logger.success(`Server built`, start ? `in ${Date.now() - start}ms` : "");
					nitro$1.hooks.callHook("dev:reload");
					break;
				case "ERROR":
					nitro$1.logger.error(event.error);
					nitro$1.hooks.callHook("dev:error", event.error);
			}
		});
		return watcher$1;
	}
}

//#endregion
//#region src/build/rolldown/prod.ts
async function buildProduction(nitro, config) {
	const rolldown = await import("rolldown");
	const buildStartTime = Date.now();
	await scanHandlers(nitro);
	await writeTypes(nitro);
	if (!nitro.options.static) {
		nitro.logger.info(`Building server (builder: \`rolldown\`, preset: \`${nitro.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro.options.compatibilityDate)}\`)`);
		await (await rolldown.rolldown(config)).write(config.output);
	}
	const buildInfo = await writeBuildInfo(nitro);
	if (!nitro.options.static) {
		if (nitro.options.logging.buildSuccess) nitro.logger.success(`Server built in ${Date.now() - buildStartTime}ms`);
		if (nitro.options.logLevel > 1) process.stdout.write(await generateFSTree(nitro.options.output.serverDir, { compressedSizes: nitro.options.logging.compressedSizes }) || "");
	}
	await nitro.hooks.callHook("compiled", nitro);
	const rOutput = relative(process.cwd(), nitro.options.output.dir);
	const rewriteRelativePaths = (input) => {
		return input.replace(/([\s:])\.\/(\S*)/g, `$1${rOutput}/$2`);
	};
	if (buildInfo.commands.preview) nitro.logger.success(`You can preview this build using \`${rewriteRelativePaths(buildInfo.commands.preview)}\``);
	if (buildInfo.commands.deploy) nitro.logger.success(`You can deploy this build using \`${rewriteRelativePaths(buildInfo.commands.deploy)}\``);
}

//#endregion
//#region src/build/rolldown/build.ts
async function rolldownBuild(nitro) {
	await nitro.hooks.callHook("build:before", nitro);
	const config = await getRolldownConfig(nitro);
	await nitro.hooks.callHook("rollup:before", nitro, config);
	return nitro.options.dev ? watchDev(nitro, config) : buildProduction(nitro, config);
}

//#endregion
export { rolldownBuild };