import { B as T, V as a, at as join$1, ct as resolve$1, g as writeDevBuildInfo, j as src_default, rt as extname$1 } from "../_build/common.mjs";
import { i as debounce } from "../_libs/rc9+c12+dotenv.mjs";
import { t as createProxyServer } from "../_libs/httpxy.mjs";
import { n as watch$1 } from "../_libs/readdirp+chokidar.mjs";
import consola$1 from "consola";
import { createReadStream, existsSync } from "node:fs";
import { readFile, rm, stat as stat$1 } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { joinURL } from "ufo";
import { createBrotliCompress, createGzip } from "node:zlib";
import { Worker } from "node:worker_threads";
import { H3, HTTPError, defineHandler, fromNodeHandler, getRequestIP, getRequestURL, serveStatic, toEventHandler } from "h3";
import { Agent } from "undici";
import { serve } from "srvx/node";
import { ErrorParser } from "youch-core";
import { Youch } from "youch";
import { SourceMapConsumer } from "source-map";
import { FastResponse } from "srvx";

//#region src/runner/proxy.ts
function createHTTPProxy(defaults = {}) {
	const proxy = createProxyServer(defaults);
	proxy.on("proxyReq", (proxyReq, req) => {
		if (!proxyReq.hasHeader("x-forwarded-for")) {
			const address = req.socket.remoteAddress;
			if (address) proxyReq.appendHeader("x-forwarded-for", address);
		}
		if (!proxyReq.hasHeader("x-forwarded-port")) {
			if (req?.socket?.localPort) proxyReq.setHeader("x-forwarded-port", req.socket.localPort);
		}
		if (!proxyReq.hasHeader("x-forwarded-Proto")) {
			const encrypted = (req?.connection)?.encrypted;
			proxyReq.setHeader("x-forwarded-proto", encrypted ? "https" : "http");
		}
	});
	return {
		proxy,
		async handleEvent(event, opts) {
			try {
				return await fromNodeHandler((req, res) => proxy.web(req, res, opts))(event);
			} catch (error) {
				event.res.headers.set("refresh", "3");
				throw new HTTPError({
					status: 503,
					message: "Dev server is unavailable.",
					cause: error
				});
			}
		}
	};
}
async function fetchAddress(addr, input, inputInit) {
	let url;
	let init;
	if (input instanceof Request) {
		url = new URL(input.url);
		init = {
			method: input.method,
			headers: input.headers,
			body: input.body,
			...inputInit
		};
	} else {
		url = new URL(input);
		init = inputInit;
	}
	init = {
		duplex: "half",
		redirect: "manual",
		...init
	};
	let res;
	if (addr.socketPath) {
		url.protocol = "http:";
		res = await fetch(url, {
			...init,
			...fetchSocketOptions(addr.socketPath)
		});
	} else {
		const origin = `http://${addr.host}${addr.port ? `:${addr.port}` : ""}`;
		const outURL = new URL(url.pathname + url.search, origin);
		res = await fetch(outURL, init);
	}
	const headers = new Headers(res.headers);
	headers.delete("transfer-encoding");
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers
	});
}
function fetchSocketOptions(socketPath) {
	if ("Bun" in globalThis) return { unix: socketPath };
	if ("Deno" in globalThis) return { client: Deno.createHttpClient({
		transport: "unix",
		path: socketPath
	}) };
	return { dispatcher: new Agent({ connect: { socketPath } }) };
}

//#endregion
//#region src/runner/node.ts
var NodeEnvRunner = class {
	closed = false;
	#name;
	#entry;
	#data;
	#hooks;
	#worker;
	#address;
	#proxy;
	#messageListeners;
	constructor(opts) {
		this.#name = opts.name;
		this.#entry = opts.entry;
		this.#data = opts.data;
		this.#hooks = opts.hooks || {};
		this.#proxy = createHTTPProxy();
		this.#messageListeners = /* @__PURE__ */ new Set();
		this.#initWorker();
	}
	get ready() {
		return Boolean(!this.closed && this.#address && this.#proxy && this.#worker);
	}
	async fetch(input, init) {
		for (let i = 0; i < 5 && !(this.#address && this.#proxy); i++) await new Promise((r) => setTimeout(r, 100 * Math.pow(2, i)));
		if (!(this.#address && this.#proxy)) return new Response("Node env runner worker is unavailable", { status: 503 });
		return fetchAddress(this.#address, input, init);
	}
	upgrade(req, socket, head) {
		if (!this.ready) return;
		return this.#proxy.proxy.ws(req, socket, {
			target: this.#address,
			xfwd: true
		}, head).catch((error) => {
			consola$1.error("WebSocket proxy error:", error);
		});
	}
	sendMessage(message) {
		if (!this.#worker) throw new Error("Node env worker should be initialized before sending messages.");
		this.#worker.postMessage(message);
	}
	onMessage(listener) {
		this.#messageListeners.add(listener);
	}
	offMessage(listener) {
		this.#messageListeners.delete(listener);
	}
	async close(cause) {
		if (this.closed) return;
		this.closed = true;
		this.#hooks.onClose?.(this, cause);
		this.#hooks = {};
		const onError = (error) => consola$1.error(error);
		await this.#closeWorker().catch(onError);
		await this.#closeProxy().catch(onError);
		await this.#closeSocket().catch(onError);
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		const status = this.closed ? "closed" : this.ready ? "ready" : "pending";
		return `NodeEnvRunner#${this.#name}(${status})`;
	}
	#initWorker() {
		if (!existsSync(this.#entry)) {
			this.close(`worker entry not found in "${this.#entry}".`);
			return;
		}
		const worker = new Worker(this.#entry, {
			env: { ...process.env },
			workerData: {
				name: this.#name,
				...this.#data
			}
		});
		worker.once("exit", (code) => {
			worker._exitCode = code;
			this.close(`worker exited with code ${code}`);
		});
		worker.once("error", (error) => {
			consola$1.error(`Worker error:`, error);
			this.close(error);
		});
		worker.on("message", (message) => {
			if (message?.address) {
				this.#address = message.address;
				this.#hooks.onReady?.(this, this.#address);
			}
			for (const listener of this.#messageListeners) listener(message);
		});
		this.#worker = worker;
	}
	async #closeProxy() {
		this.#proxy?.proxy?.close(() => {});
		this.#proxy = void 0;
	}
	async #closeSocket() {
		const socketPath = this.#address?.socketPath;
		if (socketPath && socketPath[0] !== "\0" && !socketPath.startsWith(String.raw`\\.\pipe`)) await rm(socketPath).catch(() => {});
		this.#address = void 0;
	}
	async #closeWorker() {
		if (!this.#worker) return;
		this.#worker.postMessage({ event: "shutdown" });
		if (!this.#worker._exitCode && !a && !T) await new Promise((resolve$2) => {
			const gracefulShutdownTimeoutMs = Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 5e3;
			const timeout = setTimeout(() => {
				consola$1.warn(`force closing node env runner worker...`);
				resolve$2();
			}, gracefulShutdownTimeoutMs);
			this.#worker?.on("message", (message) => {
				if (message.event === "exit") {
					clearTimeout(timeout);
					resolve$2();
				}
			});
		});
		this.#worker.removeAllListeners();
		await this.#worker.terminate().catch((error) => {
			consola$1.error(error);
		});
		this.#worker = void 0;
	}
};

//#endregion
//#region src/dev/vfs.ts
function createVFSHandler(nitro) {
	return defineHandler(async (event) => {
		const { socket } = event.runtime?.node?.req || {};
		const ip = getRequestIP(event, { xForwardedFor: !socket?.remoteAddress && !socket?.localAddress && Object.keys(socket?.address?.() || {}).length === 0 && socket?.readable && socket?.writable && !socket?.remotePort });
		if (!(ip && /^::1$|^127\.\d+\.\d+\.\d+$/.test(ip))) throw new HTTPError({
			statusText: `Forbidden IP: "${ip || "?"}"`,
			status: 403
		});
		const url = event.context.params?._ || "";
		const isJson = url.endsWith(".json") || event.req.headers.get("accept")?.includes("application/json");
		const id = decodeURIComponent(url.replace(/^(\.json)?\/?/, "") || "");
		if (id && !nitro.vfs.has(id)) throw new HTTPError({
			message: "File not found",
			status: 404
		});
		const content = id ? await nitro.vfs.get(id)?.render() : void 0;
		if (isJson) return {
			rootDir: nitro.options.rootDir,
			entries: [...nitro.vfs.keys()].map((id$1) => ({
				id: id$1,
				path: "/_vfs.json/" + encodeURIComponent(id$1)
			})),
			current: id ? {
				id,
				content
			} : null
		};
		const directories = { [nitro.options.rootDir]: {} };
		const fpaths = [...nitro.vfs.keys()];
		for (const item of fpaths) {
			const segments = item.replace(nitro.options.rootDir, "").split("/").filter(Boolean);
			let currentDir = item.startsWith(nitro.options.rootDir) ? directories[nitro.options.rootDir] : directories;
			for (const segment of segments) {
				if (!currentDir[segment]) currentDir[segment] = {};
				currentDir = currentDir[segment];
			}
		}
		const generateHTML = (directory, path$1 = []) => Object.entries(directory).map(([fname, value = {}]) => {
			const subpath = [...path$1, fname];
			const key = subpath.join("/");
			const encodedUrl = encodeURIComponent(key);
			const linkClass = url === `/${encodedUrl}` ? "bg-gray-700 text-white" : "hover:bg-gray-800 text-gray-200";
			return Object.keys(value).length === 0 ? `
            <li class="flex flex-nowrap">
              <a href="/_vfs/${encodedUrl}" class="w-full text-sm px-2 py-1 border-b border-gray-10 ${linkClass}">
                ${fname}
              </a>
            </li>
            ` : `
            <li>
              <details ${url.startsWith(`/${encodedUrl}`) ? "open" : ""}>
                <summary class="w-full text-sm px-2 py-1 border-b border-gray-10 hover:bg-gray-800 text-gray-200">
                  ${fname}
                </summary>
                <ul class="ml-4">
                  ${generateHTML(value, subpath)}
                </ul>
              </details>
            </li>
            `;
		}).join("");
		const rootDirectory = directories[nitro.options.rootDir];
		delete directories[nitro.options.rootDir];
		const files = `
      <div class="h-full overflow-auto border-r border-gray:10">
        <p class="text-white text-bold text-center py-1 opacity-50">Virtual Files</p>
        <ul class="flex flex-col">${generateHTML(rootDirectory, [nitro.options.rootDir]) + generateHTML(directories)}</ul>
      </div>
      `;
		const file = id ? editorTemplate({
			readOnly: true,
			language: id.endsWith("html") ? "html" : "javascript",
			theme: "vs-dark",
			value: content,
			wordWrap: "wordWrapColumn",
			wordWrapColumn: 80
		}) : `
        <div class="w-full h-full flex opacity-50">
          <h1 class="text-white m-auto">Select a virtual file to inspect</h1>
        </div>
      `;
		event.res.headers.set("Content-Type", "text/html; charset=utf-8");
		return `
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
  <link rel="stylesheet" data-name="vs/editor/editor.main" href="${vsUrl}/editor/editor.main.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>
  <style>
    html {
      background: #1E1E1E;
      color: white;
    }
    [un-cloak] {
      display: none;
    }
  </style>
</head>
<body class="bg-[#1E1E1E]">
  <div un-cloak class="h-screen grid grid-cols-[300px_1fr]">
    ${files}
    ${file}
  </div>
</body>
</html>`;
	});
}
const monacoUrl = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.0/min`;
const vsUrl = `${monacoUrl}/vs`;
const editorTemplate = (options) => `
<div id="editor" class="min-h-screen w-full h-full"></div>
<script src="${vsUrl}/loader.min.js"><\/script>
<script>
  require.config({ paths: { vs: '${vsUrl}' } })

  const proxy = URL.createObjectURL(new Blob([\`
    self.MonacoEnvironment = { baseUrl: '${monacoUrl}' }
    importScripts('${vsUrl}/base/worker/workerMain.min.js')
  \`], { type: 'text/javascript' }))
  window.MonacoEnvironment = { getWorkerUrl: () => proxy }

  setTimeout(() => {
    require(['vs/editor/editor.main'], function () {
      monaco.editor.create(document.getElementById('editor'), ${JSON.stringify(options)})
    })
  }, 0);
<\/script>
`;

//#endregion
//#region src/runtime/internal/error/utils.ts
function defineNitroErrorHandler(handler) {
	return handler;
}

//#endregion
//#region src/runtime/internal/error/dev.ts
var dev_default = defineNitroErrorHandler(async function defaultNitroErrorHandler(error, event) {
	const res = await defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
});
async function defaultHandler(error, event, opts) {
	const isSensitive = error.unhandled;
	const status = error.status || 500;
	const url = getRequestURL(event, {
		xForwardedHost: true,
		xForwardedProto: true
	});
	if (status === 404) {
		const baseURL = import.meta.baseURL || "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			statusText: "Found",
			headers: { location: `${baseURL}${url.pathname.slice(1)}${url.search}` },
			body: `Redirecting...`
		};
	}
	await loadStackTrace(error).catch(consola$1.error);
	const youch = new Youch();
	if (isSensitive && !opts?.silent) {
		const tags = [error.unhandled && "[unhandled]"].filter(Boolean).join(" ");
		const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
		consola$1.error(`[request error] ${tags} [${event.req.method}] ${url}\n\n`, ansiError);
	}
	const useJSON = opts?.json ?? !event.req.headers.get("accept")?.includes("text/html");
	const headers = {
		"content-type": useJSON ? "application/json" : "text/html",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY",
		"referrer-policy": "no-referrer",
		"content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
	};
	if (status === 404 || !event.res.headers.has("cache-control")) headers["cache-control"] = "no-cache";
	const body = useJSON ? {
		error: true,
		url,
		status,
		statusText: error.statusText,
		message: error.message,
		data: error.data,
		stack: error.stack?.split("\n").map((line) => line.trim())
	} : await youch.toHTML(error, { request: {
		url: url.href,
		method: event.req.method,
		headers: Object.fromEntries(event.req.headers.entries())
	} });
	return {
		status,
		statusText: error.statusText,
		headers,
		body
	};
}
async function loadStackTrace(error) {
	if (!(error instanceof Error)) return;
	const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
	const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
	Object.defineProperty(error, "stack", { value: stack });
	if (error.cause) await loadStackTrace(error.cause).catch(consola$1.error);
}
async function sourceLoader(frame) {
	if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") return;
	if (frame.type === "app") {
		const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {});
		if (rawSourceMap) {
			const originalPosition = (await new SourceMapConsumer(rawSourceMap)).originalPositionFor({
				line: frame.lineNumber,
				column: frame.columnNumber
			});
			if (originalPosition.source && originalPosition.line) {
				frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
				frame.lineNumber = originalPosition.line;
				frame.columnNumber = originalPosition.column || 0;
			}
		}
	}
	const contents = await readFile(frame.fileName, "utf8").catch(() => {});
	return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
	if (frame.type === "native") return frame.raw;
	const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
	return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

//#endregion
//#region src/dev/app.ts
var NitroDevApp = class {
	nitro;
	fetch;
	constructor(nitro, catchAllHandler) {
		this.nitro = nitro;
		const app = this.#createApp(catchAllHandler);
		this.fetch = app.fetch.bind(app);
	}
	#createApp(catchAllHandler) {
		const app = new H3({
			debug: true,
			onError: async (error, event) => {
				const errorHandler = this.nitro.options.devErrorHandler || dev_default;
				await loadStackTrace(error).catch(() => {});
				return errorHandler(error, event, { defaultHandler });
			}
		});
		for (const h of this.nitro.options.devHandlers) {
			const handler = toEventHandler(h.handler);
			if (!handler) {
				this.nitro.logger.warn("Invalid dev handler:", h);
				continue;
			}
			if (h.middleware || !h.route) if (h.route) app.use(h.route, handler, { method: h.method });
			else app.use(handler, { method: h.method });
			else app.on(h.method || "", h.route, handler, { meta: h.meta });
		}
		app.get("/_vfs/**", createVFSHandler(this.nitro));
		for (const asset of this.nitro.options.publicAssets) {
			const assetBase = joinURL(this.nitro.options.baseURL, asset.baseURL || "/");
			app.use(joinURL(assetBase, "**"), (event) => serveStaticDir(event, {
				dir: asset.dir,
				base: assetBase,
				fallthrough: asset.fallthrough
			}));
		}
		const routes = Object.keys(this.nitro.options.devProxy).sort().reverse();
		for (const route of routes) {
			let opts = this.nitro.options.devProxy[route];
			if (typeof opts === "string") opts = { target: opts };
			const proxy = createHTTPProxy(opts);
			app.all(route, proxy.handleEvent);
		}
		if (catchAllHandler) app.all("/**", catchAllHandler);
		return app;
	}
};
function serveStaticDir(event, opts) {
	const dir = resolve$1(opts.dir) + "/";
	const r = (id) => {
		if (!id.startsWith(opts.base) || !extname$1(id)) return;
		const resolved = join$1(dir, id.slice(opts.base.length));
		if (resolved.startsWith(dir)) return resolved;
	};
	return serveStatic(event, {
		fallthrough: opts.fallthrough,
		getMeta: async (id) => {
			const path$1 = r(id);
			if (!path$1) return;
			const s = await stat$1(path$1).catch(() => null);
			if (!s?.isFile()) return;
			const ext = extname$1(path$1);
			return {
				size: s.size,
				mtime: s.mtime,
				type: src_default.getType(ext) || "application/octet-stream"
			};
		},
		getContents(id) {
			const path$1 = r(id);
			if (!path$1) return;
			const stream = createReadStream(path$1);
			const acceptEncoding = event.req.headers.get("accept-encoding") || "";
			if (acceptEncoding.includes("br")) {
				event.res.headers.set("Content-Encoding", "br");
				event.res.headers.delete("Content-Length");
				event.res.headers.set("Vary", "Accept-Encoding");
				return stream.pipe(createBrotliCompress());
			} else if (acceptEncoding.includes("gzip")) {
				event.res.headers.set("Content-Encoding", "gzip");
				event.res.headers.delete("Content-Length");
				event.res.headers.set("Vary", "Accept-Encoding");
				return stream.pipe(createGzip());
			}
			return stream;
		}
	});
}

//#endregion
//#region src/dev/server.ts
function createDevServer(nitro) {
	return new NitroDevServer(nitro);
}
var NitroDevServer = class NitroDevServer extends NitroDevApp {
	#entry;
	#workerData = {};
	#listeners = [];
	#watcher;
	#workers = [];
	#workerIdCtr = 0;
	#workerError;
	#building = true;
	#buildError;
	#messageListeners = /* @__PURE__ */ new Set();
	constructor(nitro) {
		super(nitro, async (event) => {
			const worker = await this.#getWorker();
			if (!worker) return this.#generateError();
			return worker.fetch(event.req);
		});
		for (const key of Object.getOwnPropertyNames(NitroDevServer.prototype)) {
			const value = this[key];
			if (typeof value === "function" && key !== "constructor") this[key] = value.bind(this);
		}
		nitro.fetch = this.fetch.bind(this);
		this.#entry = resolve$1(nitro.options.output.dir, nitro.options.output.serverDir, "index.mjs");
		nitro.hooks.hook("close", () => this.close());
		nitro.hooks.hook("dev:start", () => {
			this.#building = true;
			this.#buildError = void 0;
		});
		nitro.hooks.hook("dev:reload", (payload) => {
			this.#buildError = void 0;
			this.#building = false;
			if (payload?.entry) this.#entry = payload.entry;
			if (payload?.workerData) this.#workerData = payload.workerData;
			this.reload();
		});
		nitro.hooks.hook("dev:error", (cause) => {
			this.#buildError = cause;
			this.#building = false;
			for (const worker of this.#workers) worker.close();
		});
		const devWatch = nitro.options.devServer.watch;
		if (devWatch && devWatch.length > 0) {
			const debouncedReload = debounce(() => this.reload());
			this.#watcher = watch$1(devWatch, nitro.options.watchOptions);
			this.#watcher.on("add", debouncedReload).on("change", debouncedReload);
		}
	}
	async upgrade(req, socket, head) {
		const worker = await this.#getWorker();
		if (!worker) throw new HTTPError({
			status: 503,
			statusText: "No worker available."
		});
		if (!worker.upgrade) throw new HTTPError({
			status: 501,
			statusText: "Worker does not support upgrades."
		});
		return worker.upgrade(req, socket, head);
	}
	listen(opts) {
		const server = serve({
			...opts,
			fetch: this.fetch,
			gracefulShutdown: false
		});
		this.#listeners.push(server);
		if (server.node?.server) server.node.server.on("upgrade", (req, sock, head) => this.upgrade(req, sock, head));
		return server;
	}
	async close() {
		await Promise.all([
			Promise.all(this.#listeners.map((l) => l.close())).then(() => {
				this.#listeners = [];
			}),
			Promise.all(this.#workers.map((w) => w.close())).then(() => {
				this.#workers = [];
			}),
			Promise.resolve(this.#watcher?.close()).then(() => {
				this.#watcher = void 0;
			})
		].map((p) => p.catch((error) => {
			consola$1.error(error);
		})));
	}
	reload() {
		for (const worker$1 of this.#workers) worker$1.close();
		const worker = new NodeEnvRunner({
			name: `Nitro_${this.#workerIdCtr++}`,
			entry: this.#entry,
			data: this.#workerData,
			hooks: {
				onClose: (worker$1, cause) => {
					this.#workerError = cause;
					const index = this.#workers.indexOf(worker$1);
					if (index !== -1) this.#workers.splice(index, 1);
				},
				onReady: async (_worker, addr) => {
					writeDevBuildInfo(this.nitro, addr).catch(() => {});
				}
			}
		});
		if (!worker.closed) {
			for (const listener of this.#messageListeners) worker.onMessage(listener);
			this.#workers.unshift(worker);
		}
	}
	sendMessage(message) {
		for (const worker of this.#workers) if (!worker.closed) worker.sendMessage(message);
	}
	onMessage(listener) {
		this.#messageListeners.add(listener);
		for (const worker of this.#workers) worker.onMessage(listener);
	}
	offMessage(listener) {
		this.#messageListeners.delete(listener);
		for (const worker of this.#workers) worker.offMessage(listener);
	}
	async #getWorker() {
		let retry = 0;
		const maxRetries = a || T ? 100 : 10;
		while (this.#building || ++retry < maxRetries) {
			if ((this.#workers.length === 0 || this.#buildError) && !this.#building) return;
			const activeWorker = this.#workers.find((w) => w.ready);
			if (activeWorker) return activeWorker;
			await new Promise((resolve$2) => setTimeout(resolve$2, 600));
		}
	}
	#generateError() {
		const error = this.#buildError || this.#workerError;
		if (error) {
			try {
				error.unhandled = false;
				let id = error.id || error.path;
				if (id) {
					const cause = error.errors?.[0];
					const loc = error.location || error.loc || cause?.location || cause?.loc;
					if (loc) id += `:${loc.line}:${loc.column}`;
					error.stack = (error.stack || "").replace(/(^\s*at\s+.+)/m, `    at ${id}\n$1`);
				}
			} catch {}
			return new HTTPError(error);
		}
		return new Response(JSON.stringify({
			error: "Dev server is unavailable.",
			hint: "Please reload the page and check the console for errors if the issue persists."
		}, null, 2), {
			status: 503,
			statusText: "Dev server is unavailable",
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store",
				Refresh: "3"
			}
		});
	}
};

//#endregion
export { NodeEnvRunner as i, createDevServer as n, NitroDevApp as r, NitroDevServer as t };