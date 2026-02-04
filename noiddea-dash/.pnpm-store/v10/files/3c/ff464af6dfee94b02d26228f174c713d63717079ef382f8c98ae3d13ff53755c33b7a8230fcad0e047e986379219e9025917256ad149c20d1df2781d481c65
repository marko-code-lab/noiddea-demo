import "./_common.mjs";
import { $ as resolveModulePath, B as T, D as prepare, I as prettyPath, O as copyPublicAssets, V as a, at as join$1, ct as resolve$1, d as libChunkName, f as baseBuildConfig, h as writeBuildInfo, it as isAbsolute$1, l as NODE_MODULES_RE, m as getBuildInfo, n as baseBuildPlugins, nt as dirname$1, st as relative$1, tt as basename$1, u as getChunkName } from "./_build/common.mjs";
import { i as debounce } from "./_libs/rc9+c12+dotenv.mjs";
import { t as formatCompatibilityDate } from "./_libs/compatx.mjs";
import { i as createNitro } from "./_chunks/nitro.mjs";
import "./_libs/tsconfck.mjs";
import { n as scanHandlers } from "./_chunks/nitro2.mjs";
import { i as NodeEnvRunner, r as NitroDevApp } from "./_chunks/dev.mjs";
import { n as watch$1 } from "./_libs/readdirp+chokidar.mjs";
import { n as assetsPlugin } from "./_libs/pluginutils.mjs";
import consola$1 from "consola";
import { existsSync, watch } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { defu } from "defu";
import { runtimeDependencies, runtimeDir } from "nitro/meta";
import { colors } from "consola/utils";
import { IncomingMessage } from "node:http";
import { NodeRequest, sendNodeResponse } from "srvx/node";
import { DevEnvironment } from "vite";
import { spawn } from "node:child_process";

//#region src/build/vite/bundler.ts
const getBundlerConfig = async (ctx) => {
	const nitro$1 = ctx.nitro;
	const base = baseBuildConfig(nitro$1);
	const commonConfig = {
		input: nitro$1.options.entry,
		external: [...base.env.external],
		plugins: [...await baseBuildPlugins(nitro$1, base)].filter(Boolean),
		treeshake: { moduleSideEffects(id) {
			return nitro$1.options.moduleSideEffects.some((p) => id.startsWith(p));
		} },
		onwarn(warning, warn) {
			if (!base.ignoreWarningCodes.has(warning.code || "")) warn(warning);
		},
		output: {
			dir: nitro$1.options.output.serverDir,
			format: "esm",
			entryFileNames: "index.mjs",
			chunkFileNames: (chunk) => getChunkName(chunk, nitro$1),
			inlineDynamicImports: nitro$1.options.inlineDynamicImports,
			sourcemapIgnoreList: (id) => id.includes("node_modules")
		}
	};
	if (ctx._isRolldown) return {
		base,
		rollupConfig: void 0,
		rolldownConfig: defu({
			transform: { inject: base.env.inject },
			output: { codeSplitting: { groups: [{
				test: NODE_MODULES_RE,
				name: (id) => libChunkName(id)
			}] } }
		}, nitro$1.options.rolldownConfig, nitro$1.options.rollupConfig, commonConfig)
	};
	else {
		const inject = (await import("./_libs/plugin-inject.mjs").then((n) => n.t)).default;
		const alias = (await import("./_libs/plugin-alias.mjs").then((n) => n.n)).default;
		return {
			base,
			rolldownConfig: void 0,
			rollupConfig: defu({
				plugins: [inject(base.env.inject), alias({ entries: base.aliases })],
				output: {
					sourcemapExcludeSources: true,
					generatedCode: { constBindings: true },
					manualChunks(id) {
						if (NODE_MODULES_RE.test(id)) return libChunkName(id);
					}
				}
			}, nitro$1.options.rolldownConfig, nitro$1.options.rollupConfig, commonConfig)
		};
	}
};

//#endregion
//#region src/build/vite/prod.ts
const BuilderNames = {
	nitro: colors.magenta("Nitro"),
	client: colors.green("Client"),
	ssr: colors.blue("SSR")
};
async function buildEnvironments(ctx, builder) {
	const nitro$1 = ctx.nitro;
	for (const [envName, env] of Object.entries(builder.environments)) {
		const fmtName = BuilderNames[envName] || (envName.length <= 3 ? envName.toUpperCase() : envName[0].toUpperCase() + envName.slice(1));
		if (envName === "nitro" || !env.config.build.rollupOptions.input || env.isBuilt) {
			if (![
				"nitro",
				"ssr",
				"client"
			].includes(envName)) nitro$1.logger.info(env.isBuilt ? `Skipping ${fmtName} (already built)` : `Skipping ${fmtName} (no input defined)`);
			continue;
		}
		if (!a && !T) console.log();
		nitro$1.logger.start(`Building [${fmtName}]`);
		await builder.build(env);
	}
	const nitroOptions = ctx.nitro.options;
	const clientInput = builder.environments.client?.config?.build?.rollupOptions?.input;
	if (nitroOptions.renderer?.template && nitroOptions.renderer?.template === clientInput) {
		const outputPath = resolve$1(nitroOptions.output.publicDir, basename$1(clientInput));
		if (existsSync(outputPath)) {
			const html = await readFile(outputPath, "utf8").then((r) => r.replace("<!--ssr-outlet-->", `{{{ globalThis.__nitro_vite_envs__?.["ssr"]?.fetch($REQUEST) || "" }}}`));
			await rm(outputPath);
			const tmp = resolve$1(nitroOptions.buildDir, "vite/index.html");
			await mkdir(dirname$1(tmp), { recursive: true });
			await writeFile(tmp, html, "utf8");
			nitroOptions.renderer.template = tmp;
		}
	}
	await builder.writeAssetsManifest?.();
	if (!a && !T) console.log();
	const buildInfo = [["preset", nitro$1.options.preset], ["compatibility", formatCompatibilityDate(nitro$1.options.compatibilityDate)]].filter((e) => e[1]);
	nitro$1.logger.start(`Building [${BuilderNames.nitro}] ${colors.dim(`(${buildInfo.map(([k, v]) => `${k}: \`${v}\``).join(", ")})`)}`);
	await copyPublicAssets(nitro$1);
	const assetDirs = new Set(Object.values(builder.environments).filter((env) => env.config.consumer === "client").map((env) => env.config.build.assetsDir).filter(Boolean));
	for (const assetsDir of assetDirs) {
		if (!existsSync(resolve$1(nitro$1.options.output.publicDir, assetsDir))) continue;
		const rule = ctx.nitro.options.routeRules[`/${assetsDir}/**`] ??= {};
		if (!rule.headers?.["cache-control"]) rule.headers = {
			...rule.headers,
			"cache-control": `public, max-age=31536000, immutable`
		};
	}
	ctx.nitro.routing.sync();
	await builder.build(builder.environments.nitro);
	await nitro$1.close();
	await nitro$1.hooks.callHook("compiled", nitro$1);
	await writeBuildInfo(nitro$1);
	const rOutput = relative$1(process.cwd(), nitro$1.options.output.dir);
	const rewriteRelativePaths = (input) => {
		return input.replace(/([\s:])\.\/(\S*)/g, `$1${rOutput}/$2`);
	};
	if (!a && !T) console.log();
	if (nitro$1.options.commands.preview) nitro$1.logger.success(`You can preview this build using \`${rewriteRelativePaths(nitro$1.options.commands.preview)}\``);
	if (nitro$1.options.commands.deploy) nitro$1.logger.success(`You can deploy this build using \`${rewriteRelativePaths(nitro$1.options.commands.deploy)}\``);
}
function prodSetup(ctx) {
	return `
function lazyService(loader) {
  let promise, mod
  return {
    fetch(req) {
      if (mod) { return mod.fetch(req) }
      if (!promise) {
        promise = loader().then(_mod => (mod = _mod.default || _mod))
      }
      return promise.then(mod => mod.fetch(req))
    }
  }
}

const services = {
${Object.keys(ctx.services).map((name) => {
		return [name, resolve$1(ctx.nitro.options.buildDir, "vite/services", name, ctx._entryPoints[name])];
	}).map(([name, entry]) => `[${JSON.stringify(name)}]: lazyService(() => import(${JSON.stringify(entry)}))`).join(",\n")}
};

globalThis.__nitro_vite_envs__ = services;
  `;
}

//#endregion
//#region src/build/vite/dev.ts
function createFetchableDevEnvironment(name, config, devServer, entry) {
	return new FetchableDevEnvironment(name, config, {
		hot: true,
		transport: createTransport(name, devServer)
	}, devServer, entry);
}
var FetchableDevEnvironment = class extends DevEnvironment {
	devServer;
	constructor(name, config, context, devServer, entry) {
		super(name, config, context);
		this.devServer = devServer;
		this.devServer.sendMessage({
			type: "custom",
			event: "nitro:vite-env",
			data: {
				name,
				entry
			}
		});
	}
	async dispatchFetch(request) {
		return this.devServer.fetch(request);
	}
	async init(...args) {
		await this.devServer.init?.();
		return super.init(...args);
	}
};
function createTransport(name, hooks) {
	const listeners = /* @__PURE__ */ new WeakMap();
	return {
		send: (data) => hooks.sendMessage({
			...data,
			viteEnv: name
		}),
		on: (event, handler) => {
			if (event === "connection") return;
			const listener = (value) => {
				if (value?.type === "custom" && value.event === event && value.viteEnv === name) handler(value.data, { send: (payload) => hooks.sendMessage({
					...payload,
					viteEnv: name
				}) });
			};
			listeners.set(handler, listener);
			hooks.onMessage(listener);
		},
		off: (event, handler) => {
			if (event === "connection") return;
			const listener = listeners.get(handler);
			if (listener) {
				hooks.offMessage(listener);
				listeners.delete(handler);
			}
		}
	};
}
async function configureViteDevServer(ctx, server) {
	const nitro$1 = ctx.nitro;
	const nitroEnv$1 = server.environments.nitro;
	const nitroConfigFile = nitro$1.options._c12.configFile;
	if (nitroConfigFile) server.config.configFileDependencies.push(nitroConfigFile);
	if (nitro$1.options.features.websocket ?? nitro$1.options.experimental.websocket) server.httpServer.on("upgrade", (req, socket, head) => {
		if (req.url?.startsWith("/?token")) return;
		getEnvRunner(ctx).upgrade?.(req, socket, head);
	});
	const reload = debounce(async () => {
		await scanHandlers(nitro$1);
		nitro$1.routing.sync();
		nitroEnv$1.moduleGraph.invalidateAll();
		nitroEnv$1.hot.send({ type: "full-reload" });
	});
	const scanDirs = nitro$1.options.scanDirs.flatMap((dir) => [
		join$1(dir, nitro$1.options.apiDir || "api"),
		join$1(dir, nitro$1.options.routesDir || "routes"),
		join$1(dir, "middleware"),
		join$1(dir, "plugins"),
		join$1(dir, "modules")
	]);
	const watchReloadEvents = new Set([
		"add",
		"addDir",
		"unlink",
		"unlinkDir"
	]);
	const scanDirsWatcher = watch$1(scanDirs, { ignoreInitial: true }).on("all", (event, path$1, stat$2) => {
		if (watchReloadEvents.has(event)) reload();
	});
	const rootDirWatcher = watch(nitro$1.options.rootDir, { persistent: false }, (_event, filename) => {
		if (filename && /^server\.[mc]?[jt]sx?$/.test(filename)) reload();
	});
	nitro$1.hooks.hook("close", () => {
		scanDirsWatcher.close();
		rootDirWatcher.close();
	});
	const hostIPC = { async transformHTML(html) {
		return server.transformIndexHtml("/", html).then((r) => r.replace("<!--ssr-outlet-->", `{{{ globalThis.__nitro_vite_envs__?.["ssr"]?.fetch($REQUEST) || "" }}}`));
	} };
	nitroEnv$1.devServer.onMessage(async (payload) => {
		if (payload.type === "custom" && payload.event === "nitro:vite-invoke") {
			const res = await hostIPC[payload.data.name](payload.data.data).then((data) => ({ data })).catch((error) => ({ error }));
			nitroEnv$1.devServer.sendMessage({
				type: "custom",
				event: "nitro:vite-invoke-response",
				data: {
					id: payload.data.id,
					data: res
				}
			});
		}
	});
	const nitroDevMiddleware = async (nodeReq, nodeRes, next) => {
		if (!nodeReq.url || /^\/@(?:vite|fs|id)\//.test(nodeReq.url) || nodeReq._nitroHandled || server.middlewares.stack.map((mw) => mw.route).some((base) => base && nodeReq.url.startsWith(base))) return next();
		nodeReq._nitroHandled = true;
		try {
			const req = new NodeRequest({
				req: nodeReq,
				res: nodeRes
			});
			const devAppRes = await ctx.devApp.fetch(req);
			if (nodeRes.writableEnded || nodeRes.headersSent) return;
			if (devAppRes.status !== 404) return await sendNodeResponse(nodeRes, devAppRes);
			const envRes = await nitroEnv$1.dispatchFetch(req);
			if (nodeRes.writableEnded || nodeRes.headersSent) return;
			return await sendNodeResponse(nodeRes, envRes);
		} catch (error) {
			return next(error);
		}
	};
	server.middlewares.use(function nitroDevMiddlewarePre(req, res, next) {
		const fetchDest = req.headers["sec-fetch-dest"];
		res.setHeader("vary", "sec-fetch-dest");
		if ((!fetchDest || /^(document|iframe|frame|empty)$/.test(fetchDest)) && !req.url.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1] && !/^\/(?:__|@)/.test(req.url)) nitroDevMiddleware(req, res, next);
		else next();
	});
	return () => {
		server.middlewares.use(nitroDevMiddleware);
	};
}

//#endregion
//#region src/build/vite/env.ts
function getEnvRunner(ctx) {
	return ctx._envRunner ??= new NodeEnvRunner({
		name: "nitro-vite",
		entry: resolve(runtimeDir, "internal/vite/node-runner.mjs"),
		data: { server: true }
	});
}
function createNitroEnvironment(ctx) {
	return {
		consumer: "server",
		build: {
			rollupOptions: ctx.bundlerConfig.rollupConfig,
			rolldownOptions: ctx.bundlerConfig.rolldownConfig,
			minify: ctx.nitro.options.minify,
			emptyOutDir: false,
			sourcemap: ctx.nitro.options.sourcemap,
			commonjsOptions: ctx.nitro.options.commonJS
		},
		resolve: {
			noExternal: ctx.nitro.options.dev ? [
				/^nitro$/,
				/* @__PURE__ */ new RegExp(`^(${runtimeDependencies.join("|")})$`),
				...ctx.bundlerConfig.base.noExternal
			] : true,
			conditions: ctx.nitro.options.exportConditions,
			externalConditions: ctx.nitro.options.exportConditions?.filter((c) => !/browser|wasm|module/.test(c))
		},
		define: { "process.env.NODE_ENV": JSON.stringify(ctx.nitro.options.dev ? "development" : "production") },
		dev: { createEnvironment: (envName, envConfig) => createFetchableDevEnvironment(envName, envConfig, getEnvRunner(ctx), resolve(runtimeDir, "internal/vite/dev-entry.mjs")) }
	};
}
function createServiceEnvironment(ctx, name, serviceConfig) {
	return {
		consumer: "server",
		build: {
			rollupOptions: { input: { index: serviceConfig.entry } },
			minify: ctx.nitro.options.minify,
			sourcemap: ctx.nitro.options.sourcemap,
			outDir: join(ctx.nitro.options.buildDir, "vite/services", name),
			emptyOutDir: true
		},
		resolve: {
			conditions: ctx.nitro.options.exportConditions,
			externalConditions: ctx.nitro.options.exportConditions?.filter((c) => !/browser|wasm|module/.test(c))
		},
		dev: { createEnvironment: (envName, envConfig) => createFetchableDevEnvironment(envName, envConfig, getEnvRunner(ctx), tryResolve(serviceConfig.entry)) }
	};
}
function createServiceEnvironments(ctx) {
	return Object.fromEntries(Object.entries(ctx.services).map(([name, config]) => [name, createServiceEnvironment(ctx, name, config)]));
}
function tryResolve(id) {
	if (/^[~#/\0]/.test(id) || isAbsolute$1(id)) return id;
	return resolveModulePath(id, {
		suffixes: ["", "/index"],
		extensions: [
			"",
			".ts",
			".mjs",
			".cjs",
			".js",
			".mts",
			".cts"
		],
		try: true
	}) || id;
}

//#endregion
//#region src/build/vite/preview.ts
function nitroPreviewPlugin(ctx) {
	return {
		name: "nitro:preview",
		apply: (_config, configEnv) => !!configEnv.isPreview,
		config(config) {
			return { preview: { port: config.preview?.port || 3e3 } };
		},
		async configurePreviewServer(server) {
			const { outputDir, buildInfo } = await getBuildInfo(server.config.root);
			if (!buildInfo) throw this.error("Cannot load nitro build info. Make sure to build first.");
			const info = [
				["Build Directory:", prettyPath(outputDir)],
				["Date:", buildInfo.date && new Date(buildInfo.date).toLocaleString()],
				["Nitro Version:", buildInfo.versions.nitro],
				["Nitro Preset:", buildInfo.preset],
				buildInfo.framework?.name !== "nitro" && ["Framework:", buildInfo.framework?.name + (buildInfo.framework?.version ? ` (v${buildInfo.framework.version})` : "")]
			].filter((i) => i && i[1]);
			consola$1.box({
				title: " [Build Info] ",
				message: info.map((i) => `- ${i[0]} ${i[1]}`).join("\n")
			});
			if (!buildInfo.commands?.preview) {
				consola$1.warn("No nitro build preview command found for this preset.");
				return;
			}
			const dotEnvEntries = await loadPreviewDotEnv(server.config.root);
			if (dotEnvEntries.length > 0) consola$1.box({
				title: " [Environment Variables] ",
				message: [
					"Loaded variables from .env files (preview mode only).",
					"Set platform environment variables for production:",
					...dotEnvEntries.map(([key, val]) => ` - ${key}`)
				].join("\n")
			});
			const [command, ...args] = buildInfo.commands.preview.split(" ");
			consola$1.info(`Spawning preview server...`);
			consola$1.info(buildInfo.commands?.preview);
			console.log("");
			const { getRandomPort, waitForPort } = await import("get-port-please");
			const randomPort = await getRandomPort();
			const child = spawn(command, args, {
				stdio: "inherit",
				cwd: outputDir,
				env: {
					...process.env,
					...Object.fromEntries(dotEnvEntries),
					PORT: String(randomPort)
				}
			});
			const killChild = (signal) => {
				if (child && !child.killed) child.kill(signal);
			};
			for (const sig of ["SIGINT", "SIGHUP"]) process.once(sig, () => {
				consola$1.info(`Stopping preview server...`);
				killChild(sig);
				process.exit();
			});
			server.httpServer.once("close", () => {
				killChild("SIGTERM");
			});
			child.once("exit", (code) => {
				if (code && code !== 0) consola$1.error(`[nitro] Preview server exited with code ${code}`);
			});
			const { createProxyServer } = await import("./_libs/httpxy.mjs").then((n) => n.n);
			const proxy = createProxyServer({ target: `http://localhost:${randomPort}` });
			server.middlewares.use((req, res, next) => {
				if (child && !child.killed) proxy.web(req, res).catch(next);
				else res.end(`Nitro preview server is not running.`);
			});
			await waitForPort(randomPort, {
				retries: 20,
				delay: 500
			});
		}
	};
}
async function loadPreviewDotEnv(root) {
	const { loadDotenv } = await import("./_libs/rc9+c12+dotenv.mjs").then((n) => n.t);
	const env = await loadDotenv({
		cwd: root,
		fileName: [
			".env.preview",
			".env.production",
			".env"
		]
	});
	return Object.entries(env).filter(([_key, val]) => val);
}

//#endregion
//#region src/build/vite/plugin.ts
const DEFAULT_EXTENSIONS = [
	".ts",
	".js",
	".mts",
	".mjs",
	".tsx",
	".jsx"
];
const debug = process.env.NITRO_DEBUG ? (...args) => console.log("[nitro]", ...args) : () => {};
function nitro(pluginConfig = {}) {
	const ctx = createContext(pluginConfig);
	return [
		nitroInit(ctx),
		nitroEnv(ctx),
		nitroMain(ctx),
		nitroPrepare(ctx),
		nitroService(ctx),
		nitroPreviewPlugin(ctx),
		pluginConfig.experimental?.vite?.assetsImport !== false && assetsPlugin({ experimental: { clientBuildFallback: false } })
	].filter(Boolean);
}
function nitroInit(ctx) {
	return {
		name: "nitro:init",
		sharedDuringBuild: true,
		apply: (_config, configEnv) => !configEnv.isPreview,
		async config(config, configEnv) {
			ctx._isRolldown = !!this.meta.rolldownVersion;
			if (!ctx._initialized) {
				debug("[init] Initializing nitro");
				ctx._initialized = true;
				await setupNitroContext(ctx, configEnv, config);
			}
		},
		applyToEnvironment(env) {
			if (env.name === "nitro" && ctx.nitro?.options.dev) {
				debug("[init] Adding rollup plugins for dev");
				return [...ctx.bundlerConfig?.rolldownConfig?.plugins || ctx.bundlerConfig?.rollupConfig?.plugins || []];
			}
		}
	};
}
function nitroEnv(ctx) {
	return {
		name: "nitro:env",
		sharedDuringBuild: true,
		apply: (_config, configEnv) => !configEnv.isPreview,
		async config(userConfig, _configEnv) {
			debug("[env]  Extending config (environments)");
			const environments = {
				...createServiceEnvironments(ctx),
				nitro: createNitroEnvironment(ctx)
			};
			environments.client = {
				consumer: userConfig.environments?.client?.consumer ?? "client",
				build: { rollupOptions: { input: userConfig.environments?.client?.build?.rollupOptions?.input ?? useNitro(ctx).options.renderer?.template } }
			};
			debug("[env]  Environments:", Object.keys(environments).join(", "));
			return { environments };
		},
		configEnvironment(name, config) {
			if (config.consumer === "client") {
				debug("[env]  Configuring client environment", name === "client" ? "" : ` (${name})`);
				config.build.emptyOutDir = false;
				config.build.outDir = useNitro(ctx).options.output.publicDir;
				return;
			}
			if (name === "nitro" || ctx.services[name]) return;
			const entry = getEntry(config.build?.rolldownOptions?.input || config.build?.rollupOptions?.input);
			if (typeof entry !== "string") return;
			const resolvedEntry = resolveModulePath(entry, {
				from: [ctx.nitro.options.rootDir, ...ctx.nitro.options.scanDirs],
				extensions: DEFAULT_EXTENSIONS,
				suffixes: ["", "/index"],
				try: true
			}) || entry;
			ctx.services[name] = { entry: resolvedEntry };
			debug(`[env]  Auto-detected service "${name}" with entry: ${resolvedEntry}`);
			return createServiceEnvironment(ctx, name, { entry: resolvedEntry });
		},
		configResolved() {
			if (!ctx.nitro.options.renderer?.handler && !ctx.nitro.options.renderer?.template && ctx.services.ssr?.entry) {
				ctx.nitro.options.renderer ??= {};
				ctx.nitro.options.renderer.handler = resolve$1(runtimeDir, "internal/vite/ssr-renderer");
				ctx.nitro.routing.sync();
			}
		}
	};
}
function nitroMain(ctx) {
	return {
		name: "nitro:main",
		sharedDuringBuild: true,
		apply: (_config, configEnv) => !configEnv.isPreview,
		async config(userConfig, _configEnv) {
			debug("[main] Extending config (appType, resolve, server)");
			if (!ctx.bundlerConfig) throw new Error("Bundler config is not initialized yet!");
			return {
				appType: userConfig.appType || "custom",
				resolve: { alias: ctx.bundlerConfig.base.aliases },
				builder: { sharedConfigBuild: true },
				server: {
					port: Number.parseInt(process.env.PORT || "") || userConfig.server?.port || useNitro(ctx).options.devServer?.port || 3e3,
					cors: false
				}
			};
		},
		buildApp: {
			order: "post",
			handler(builder) {
				debug("[main] Building environments");
				return buildEnvironments(ctx, builder);
			}
		},
		generateBundle: { handler(_options, bundle) {
			const environment = this.environment;
			debug("[main] Generating manifest and entry points for environment:", environment.name);
			const isRegisteredService = Object.keys(ctx.services).includes(environment.name);
			let entryFile;
			for (const [_name, file] of Object.entries(bundle)) if (file.type === "chunk" && isRegisteredService && file.isEntry) if (entryFile === void 0) entryFile = file.fileName;
			else this.warn(`Multiple entry points found for service "${environment.name}"`);
			if (isRegisteredService) {
				if (entryFile === void 0) this.error(`No entry point found for service "${this.environment.name}".`);
				ctx._entryPoints[this.environment.name] = entryFile;
			}
		} },
		configureServer: (server) => {
			debug("[main] Configuring dev server");
			return configureViteDevServer(ctx, server);
		},
		async hotUpdate({ server, modules, timestamp }) {
			const env = this.environment;
			if (ctx.pluginConfig.experimental?.vite.serverReload === false || env.config.consumer === "client") return;
			const clientEnvs = Object.values(server.environments).filter((env$1) => env$1.config.consumer === "client");
			let hasServerOnlyModule = false;
			const invalidated = /* @__PURE__ */ new Set();
			for (const mod of modules) if (mod.id && !clientEnvs.some((env$1) => env$1.moduleGraph.getModuleById(mod.id))) {
				hasServerOnlyModule = true;
				env.moduleGraph.invalidateModule(mod, invalidated, timestamp, false);
			}
			if (hasServerOnlyModule) {
				env.hot.send({ type: "full-reload" });
				server.ws.send({ type: "full-reload" });
				return [];
			}
		}
	};
}
function nitroPrepare(ctx) {
	return {
		name: "nitro:prepare",
		sharedDuringBuild: true,
		applyToEnvironment: (env) => env.name === "nitro",
		buildApp: {
			order: "pre",
			async handler() {
				debug("[prepare] Preparing output directory");
				const nitro = ctx.nitro;
				await prepare(nitro);
			}
		}
	};
}
function nitroService(ctx) {
	return {
		name: "nitro:service",
		enforce: "pre",
		sharedDuringBuild: true,
		applyToEnvironment: (env) => env.name === "nitro",
		resolveId: {
			filter: { id: /^#nitro-vite-setup$/ },
			async handler(id) {
				if (id === "#nitro-vite-setup") return {
					id,
					moduleSideEffects: true
				};
			}
		},
		load: {
			filter: { id: /^#nitro-vite-setup$/ },
			async handler(id) {
				if (id === "#nitro-vite-setup") return prodSetup(ctx);
			}
		}
	};
}
function createContext(pluginConfig) {
	return {
		pluginConfig,
		services: { ...pluginConfig.experimental?.vite?.services },
		_entryPoints: {}
	};
}
function useNitro(ctx) {
	if (!ctx.nitro) throw new Error("Nitro instance is not initialized yet.");
	return ctx.nitro;
}
async function setupNitroContext(ctx, configEnv, userConfig) {
	const nitroConfig = {
		dev: configEnv.command === "serve",
		builder: "vite",
		rootDir: userConfig.root,
		...defu(ctx.pluginConfig, ctx.pluginConfig.config, userConfig.nitro)
	};
	nitroConfig.modules ??= [];
	for (const plugin of flattenPlugins(userConfig.plugins || [])) if (plugin.nitro) nitroConfig.modules.push(plugin.nitro);
	ctx.nitro = ctx.pluginConfig._nitro || await createNitro(nitroConfig);
	if (!ctx.services?.ssr) if (userConfig.environments?.ssr === void 0) {
		const ssrEntry = resolveModulePath("./entry-server", {
			from: [
				"app",
				"src",
				""
			].flatMap((d) => [ctx.nitro.options.rootDir, ...ctx.nitro.options.scanDirs].map((s) => join$1(s, d) + "/")),
			extensions: DEFAULT_EXTENSIONS,
			try: true
		});
		if (ssrEntry) {
			ctx.services.ssr = { entry: ssrEntry };
			ctx.nitro.logger.info(`Using \`${prettyPath(ssrEntry)}\` as vite ssr entry.`);
		}
	} else {
		let ssrEntry = getEntry(userConfig.environments.ssr.build?.rollupOptions?.input);
		if (typeof ssrEntry === "string") {
			ssrEntry = resolveModulePath(ssrEntry, {
				from: [ctx.nitro.options.rootDir, ...ctx.nitro.options.scanDirs],
				extensions: DEFAULT_EXTENSIONS,
				suffixes: ["", "/index"],
				try: true
			}) || ssrEntry;
			ctx.services.ssr = { entry: ssrEntry };
		}
	}
	if (ctx.nitro.options.serverEntry && ctx.nitro.options.serverEntry.handler === ctx.services.ssr?.entry) {
		ctx.nitro.logger.warn(`Nitro server entry and Vite SSR both set to ${prettyPath(ctx.services.ssr.entry)}. Use a separate SSR entry (e.g. \`src/server.ts\`).`);
		ctx.nitro.options.serverEntry = false;
	}
	const publicDistDir = ctx._publicDistDir = userConfig.build?.outDir || resolve$1(ctx.nitro.options.buildDir, "vite/public");
	ctx.nitro.options.publicAssets.push({
		dir: publicDistDir,
		maxAge: 0,
		baseURL: "/",
		fallthrough: true
	});
	if (!ctx.nitro.options.dev) ctx.nitro.options.unenv.push({
		meta: { name: "nitro-vite" },
		polyfill: ["#nitro-vite-setup"]
	});
	await ctx.nitro.hooks.callHook("build:before", ctx.nitro);
	ctx.bundlerConfig = await getBundlerConfig(ctx);
	await ctx.nitro.hooks.callHook("rollup:before", ctx.nitro, ctx.bundlerConfig.rollupConfig || ctx.bundlerConfig.rolldownConfig);
	if (ctx.nitro.options.dev) getEnvRunner(ctx);
	ctx.nitro.fetch = (req) => getEnvRunner(ctx).fetch(req);
	if (ctx.nitro.options.dev && !ctx.devApp) ctx.devApp = new NitroDevApp(ctx.nitro);
	ctx.nitro.hooks.hook("close", async () => {
		if (ctx._envRunner) await ctx._envRunner.close();
	});
}
function getEntry(input) {
	if (typeof input === "string") return input;
	else if (Array.isArray(input) && input.length > 0) return input[0];
	else if (input && "index" in input) return input.index;
}
function flattenPlugins(plugins) {
	return plugins.flatMap((plugin) => Array.isArray(plugin) ? flattenPlugins(plugin) : [plugin]).filter((p) => p && !(p instanceof Promise));
}

//#endregion
export { nitro };