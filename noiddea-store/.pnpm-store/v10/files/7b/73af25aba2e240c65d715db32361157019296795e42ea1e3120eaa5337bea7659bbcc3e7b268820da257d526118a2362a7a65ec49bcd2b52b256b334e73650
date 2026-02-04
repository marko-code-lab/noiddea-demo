import { i as __toESM$1, n as __exportAll, r as __require$1, t as __commonJSMin } from "../_common.mjs";
import { builtinModules, createRequire } from "node:module";
import consola$1 from "consola";
import fs, { accessSync, constants, existsSync, lstatSync, promises, readFileSync, realpathSync, statSync } from "node:fs";
import * as nativeFs$1 from "fs";
import nativeFs from "fs";
import path, { basename, dirname, extname, isAbsolute, normalize, posix, relative, resolve, sep, win32 } from "path";
import fsp, { mkdir, readFile, stat as stat$1, writeFile } from "node:fs/promises";
import { URL as URL$1, fileURLToPath, pathToFileURL } from "node:url";
import os from "node:os";
import path$1, { basename as basename$1, dirname as dirname$1, isAbsolute as isAbsolute$1, join as join$1, win32 as win32$1 } from "node:path";
import assert from "node:assert";
import process$1 from "node:process";
import v8 from "node:v8";
import { format, inspect } from "node:util";
import { defu } from "defu";
import { joinURL, withTrailingSlash } from "ufo";
import { pkgDir, presetsDir, runtimeDependencies, runtimeDir, version } from "nitro/meta";
import { createRequire as createRequire$1 } from "module";
import { colors } from "consola/utils";
import { fileURLToPath as fileURLToPath$1 } from "url";
import { hash } from "ohash";
import zlib from "node:zlib";
import { camelCase, kebabCase } from "scule";
import { defineEnv } from "unenv";
import { connectors } from "db0";
import { RENDER_CONTEXT_KEYS, compileTemplateToString, hasTemplateSyntax } from "rendu";
import { builtinDrivers, normalizeKey } from "unstorage";
import { createHash } from "node:crypto";
import { transformSync } from "oxc-transform";
import { NodeNativePackages } from "nf3";
import { minifySync } from "oxc-minify";

//#region node_modules/.pnpm/pathe@2.0.3/node_modules/pathe/dist/shared/pathe.M-eThtNZ.mjs
const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
	if (!input) return input;
	return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r$3) => r$3.toUpperCase());
}
const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
const _EXTNAME_RE = /.(\.[^./]+|\.)$/;
const _PATH_ROOT_RE = /^[/\\]|^[a-zA-Z]:[/\\]/;
const normalize$2 = function(path$2) {
	if (path$2.length === 0) return ".";
	path$2 = normalizeWindowsPath(path$2);
	const isUNCPath = path$2.match(_UNC_REGEX);
	const isPathAbsolute = isAbsolute$2(path$2);
	const trailingSeparator = path$2[path$2.length - 1] === "/";
	path$2 = normalizeString(path$2, !isPathAbsolute);
	if (path$2.length === 0) {
		if (isPathAbsolute) return "/";
		return trailingSeparator ? "./" : ".";
	}
	if (trailingSeparator) path$2 += "/";
	if (_DRIVE_LETTER_RE.test(path$2)) path$2 += "/";
	if (isUNCPath) {
		if (!isPathAbsolute) return `//./${path$2}`;
		return `//${path$2}`;
	}
	return isPathAbsolute && !isAbsolute$2(path$2) ? `/${path$2}` : path$2;
};
const join$2 = function(...segments) {
	let path$2 = "";
	for (const seg of segments) {
		if (!seg) continue;
		if (path$2.length > 0) {
			const pathTrailing = path$2[path$2.length - 1] === "/";
			const segLeading = seg[0] === "/";
			if (pathTrailing && segLeading) path$2 += seg.slice(1);
			else path$2 += pathTrailing || segLeading ? seg : `/${seg}`;
		} else path$2 += seg;
	}
	return normalize$2(path$2);
};
function cwd$1() {
	if (typeof process !== "undefined" && typeof process.cwd === "function") return process.cwd().replace(/\\/g, "/");
	return "/";
}
const resolve$3 = function(...arguments_) {
	arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
	let resolvedPath = "";
	let resolvedAbsolute = false;
	for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
		const path$2 = index >= 0 ? arguments_[index] : cwd$1();
		if (!path$2 || path$2.length === 0) continue;
		resolvedPath = `${path$2}/${resolvedPath}`;
		resolvedAbsolute = isAbsolute$2(path$2);
	}
	resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
	if (resolvedAbsolute && !isAbsolute$2(resolvedPath)) return `/${resolvedPath}`;
	return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path$2, allowAboveRoot) {
	let res = "";
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let char = null;
	for (let index = 0; index <= path$2.length; ++index) {
		if (index < path$2.length) char = path$2[index];
		else if (char === "/") break;
		else char = "/";
		if (char === "/") {
			if (lastSlash === index - 1 || dots === 1);
			else if (dots === 2) {
				if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
					if (res.length > 2) {
						const lastSlashIndex = res.lastIndexOf("/");
						if (lastSlashIndex === -1) {
							res = "";
							lastSegmentLength = 0;
						} else {
							res = res.slice(0, lastSlashIndex);
							lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
						}
						lastSlash = index;
						dots = 0;
						continue;
					} else if (res.length > 0) {
						res = "";
						lastSegmentLength = 0;
						lastSlash = index;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					res += res.length > 0 ? "/.." : "..";
					lastSegmentLength = 2;
				}
			} else {
				if (res.length > 0) res += `/${path$2.slice(lastSlash + 1, index)}`;
				else res = path$2.slice(lastSlash + 1, index);
				lastSegmentLength = index - lastSlash - 1;
			}
			lastSlash = index;
			dots = 0;
		} else if (char === "." && dots !== -1) ++dots;
		else dots = -1;
	}
	return res;
}
const isAbsolute$2 = function(p$1) {
	return _IS_ABSOLUTE_RE.test(p$1);
};
const extname$4 = function(p$1) {
	if (p$1 === "..") return "";
	const match = _EXTNAME_RE.exec(normalizeWindowsPath(p$1));
	return match && match[1] || "";
};
const relative$2 = function(from, to) {
	const _from = resolve$3(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
	const _to = resolve$3(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
	if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) return _to.join("/");
	const _fromCopy = [..._from];
	for (const segment of _fromCopy) {
		if (_to[0] !== segment) break;
		_from.shift();
		_to.shift();
	}
	return [..._from.map(() => ".."), ..._to].join("/");
};
const dirname$2 = function(p$1) {
	const segments = normalizeWindowsPath(p$1).replace(/\/$/, "").split("/").slice(0, -1);
	if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) segments[0] += "/";
	return segments.join("/") || (isAbsolute$2(p$1) ? "/" : ".");
};
const basename$2 = function(p$1, extension) {
	const segments = normalizeWindowsPath(p$1).split("/");
	let lastSegment = "";
	for (let i$2 = segments.length - 1; i$2 >= 0; i$2--) {
		const val = segments[i$2];
		if (val) {
			lastSegment = val;
			break;
		}
	}
	return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};
const parse$1 = function(p$1) {
	const root = _PATH_ROOT_RE.exec(p$1)?.[0]?.replace(/\\/g, "/") || "";
	const base = basename$2(p$1);
	const extension = extname$4(base);
	return {
		root,
		dir: dirname$2(p$1),
		base,
		ext: extension,
		name: base.slice(0, base.length - extension.length)
	};
};

//#endregion
//#region node_modules/.pnpm/exsolve@1.0.8/node_modules/exsolve/dist/index.mjs
const nodeBuiltins = [
	"_http_agent",
	"_http_client",
	"_http_common",
	"_http_incoming",
	"_http_outgoing",
	"_http_server",
	"_stream_duplex",
	"_stream_passthrough",
	"_stream_readable",
	"_stream_transform",
	"_stream_wrap",
	"_stream_writable",
	"_tls_common",
	"_tls_wrap",
	"assert",
	"assert/strict",
	"async_hooks",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"diagnostics_channel",
	"dns",
	"dns/promises",
	"domain",
	"events",
	"fs",
	"fs/promises",
	"http",
	"http2",
	"https",
	"inspector",
	"inspector/promises",
	"module",
	"net",
	"os",
	"path",
	"path/posix",
	"path/win32",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"readline/promises",
	"repl",
	"stream",
	"stream/consumers",
	"stream/promises",
	"stream/web",
	"string_decoder",
	"sys",
	"timers",
	"timers/promises",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"util/types",
	"v8",
	"vm",
	"wasi",
	"worker_threads",
	"zlib"
];
const own$1$1 = {}.hasOwnProperty;
const classRegExp$1 = /^([A-Z][a-z\d]*)+$/;
const kTypes$1 = new Set([
	"string",
	"function",
	"number",
	"object",
	"Function",
	"Object",
	"boolean",
	"bigint",
	"symbol"
]);
const messages$1 = /* @__PURE__ */ new Map();
const nodeInternalPrefix$1 = "__node_internal_";
let userStackTraceLimit$1;
/**
* Create a list string in the form like 'A and B' or 'A, B, ..., and Z'.
* We cannot use Intl.ListFormat because it's not available in
* --without-intl builds.
*
* @param {Array<string>} array
*   An array of strings.
* @param {string} [type]
*   The list type to be inserted before the last element.
* @returns {string}
*/
function formatList$1(array, type$1 = "and") {
	return array.length < 3 ? array.join(` ${type$1} `) : `${array.slice(0, -1).join(", ")}, ${type$1} ${array.at(-1)}`;
}
/**
* Utility function for registering the error codes.
*/
function createError$1(sym, value, constructor) {
	messages$1.set(sym, value);
	return makeNodeErrorWithCode$1(constructor, sym);
}
function makeNodeErrorWithCode$1(Base, key) {
	return function NodeError(...parameters) {
		const limit = Error.stackTraceLimit;
		if (isErrorStackTraceLimitWritable$1()) Error.stackTraceLimit = 0;
		const error = new Base();
		if (isErrorStackTraceLimitWritable$1()) Error.stackTraceLimit = limit;
		const message = getMessage$1(key, parameters, error);
		Object.defineProperties(error, {
			message: {
				value: message,
				enumerable: false,
				writable: true,
				configurable: true
			},
			toString: {
				value() {
					return `${this.name} [${key}]: ${this.message}`;
				},
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		captureLargerStackTrace$1(error);
		error.code = key;
		return error;
	};
}
function isErrorStackTraceLimitWritable$1() {
	try {
		if (v8.startupSnapshot.isBuildingSnapshot()) return false;
	} catch {}
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return own$1$1.call(desc, "writable") && desc.writable !== void 0 ? desc.writable : desc.set !== void 0;
}
/**
* This function removes unnecessary frames from Node.js core errors.
*/
function hideStackFrames$1(wrappedFunction) {
	const hidden = nodeInternalPrefix$1 + wrappedFunction.name;
	Object.defineProperty(wrappedFunction, "name", { value: hidden });
	return wrappedFunction;
}
const captureLargerStackTrace$1 = hideStackFrames$1(function(error) {
	const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable$1();
	if (stackTraceLimitIsWritable) {
		userStackTraceLimit$1 = Error.stackTraceLimit;
		Error.stackTraceLimit = Number.POSITIVE_INFINITY;
	}
	Error.captureStackTrace(error);
	if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit$1;
	return error;
});
function getMessage$1(key, parameters, self) {
	const message = messages$1.get(key);
	assert.ok(message !== void 0, "expected `message` to be found");
	if (typeof message === "function") {
		assert.ok(message.length <= parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`);
		return Reflect.apply(message, self, parameters);
	}
	const regex = /%[dfijoOs]/g;
	let expectedLength = 0;
	while (regex.exec(message) !== null) expectedLength++;
	assert.ok(expectedLength === parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`);
	if (parameters.length === 0) return message;
	parameters.unshift(message);
	return Reflect.apply(format, null, parameters);
}
/**
* Determine the specific type of a value for type-mismatch errors.
*/
function determineSpecificType$1(value) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "function" && value.name) return `function ${value.name}`;
	if (typeof value === "object") {
		if (value.constructor && value.constructor.name) return `an instance of ${value.constructor.name}`;
		return `${inspect(value, { depth: -1 })}`;
	}
	let inspected = inspect(value, { colors: false });
	if (inspected.length > 28) inspected = `${inspected.slice(0, 25)}...`;
	return `type ${typeof value} (${inspected})`;
}
createError$1("ERR_INVALID_ARG_TYPE", (name, expected, actual) => {
	assert.ok(typeof name === "string", "'name' must be a string");
	if (!Array.isArray(expected)) expected = [expected];
	let message = "The ";
	if (name.endsWith(" argument")) message += `${name} `;
	else {
		const type$1 = name.includes(".") ? "property" : "argument";
		message += `"${name}" ${type$1} `;
	}
	message += "must be ";
	const types$4 = [];
	const instances = [];
	const other = [];
	for (const value of expected) {
		assert.ok(typeof value === "string", "All expected entries have to be of type string");
		if (kTypes$1.has(value)) types$4.push(value.toLowerCase());
		else if (classRegExp$1.exec(value) === null) {
			assert.ok(value !== "object", "The value \"object\" should be written as \"Object\"");
			other.push(value);
		} else instances.push(value);
	}
	if (instances.length > 0) {
		const pos = types$4.indexOf("object");
		if (pos !== -1) {
			types$4.slice(pos, 1);
			instances.push("Object");
		}
	}
	if (types$4.length > 0) {
		message += `${types$4.length > 1 ? "one of type" : "of type"} ${formatList$1(types$4, "or")}`;
		if (instances.length > 0 || other.length > 0) message += " or ";
	}
	if (instances.length > 0) {
		message += `an instance of ${formatList$1(instances, "or")}`;
		if (other.length > 0) message += " or ";
	}
	if (other.length > 0) if (other.length > 1) message += `one of ${formatList$1(other, "or")}`;
	else {
		if (other[0]?.toLowerCase() !== other[0]) message += "an ";
		message += `${other[0]}`;
	}
	message += `. Received ${determineSpecificType$1(actual)}`;
	return message;
}, TypeError);
const ERR_INVALID_MODULE_SPECIFIER$1 = createError$1(
	"ERR_INVALID_MODULE_SPECIFIER",
	/**
	* @param {string} request
	* @param {string} reason
	* @param {string} [base]
	*/
	(request, reason, base) => {
		return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
	},
	TypeError
);
const ERR_INVALID_PACKAGE_CONFIG$2 = createError$1("ERR_INVALID_PACKAGE_CONFIG", (path$1$1, base, message) => {
	return `Invalid package config ${path$1$1}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
}, Error);
const ERR_INVALID_PACKAGE_TARGET$1 = createError$1("ERR_INVALID_PACKAGE_TARGET", (packagePath, key, target, isImport = false, base) => {
	const relatedError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
	if (key === ".") {
		assert.ok(isImport === false);
		return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? "; targets must start with \"./\"" : ""}`;
	}
	return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(target)} defined for '${key}' in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? "; targets must start with \"./\"" : ""}`;
}, Error);
const ERR_MODULE_NOT_FOUND$1 = createError$1("ERR_MODULE_NOT_FOUND", (path$1$1, base, exactUrl = false) => {
	return `Cannot find ${exactUrl ? "module" : "package"} '${path$1$1}' imported from ${base}`;
}, Error);
createError$1("ERR_NETWORK_IMPORT_DISALLOWED", "import of '%s' by %s is not supported: %s", Error);
const ERR_PACKAGE_IMPORT_NOT_DEFINED$1 = createError$1("ERR_PACKAGE_IMPORT_NOT_DEFINED", (specifier, packagePath, base) => {
	return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath || ""}package.json` : ""} imported from ${base}`;
}, TypeError);
const ERR_PACKAGE_PATH_NOT_EXPORTED$1 = createError$1(
	"ERR_PACKAGE_PATH_NOT_EXPORTED",
	/**
	* @param {string} packagePath
	* @param {string} subpath
	* @param {string} [base]
	*/
	(packagePath, subpath, base) => {
		if (subpath === ".") return `No "exports" main defined in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
		return `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
	},
	Error
);
const ERR_UNSUPPORTED_DIR_IMPORT$1 = createError$1("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error);
const ERR_UNSUPPORTED_RESOLVE_REQUEST$1 = createError$1("ERR_UNSUPPORTED_RESOLVE_REQUEST", "Failed to resolve module specifier \"%s\" from \"%s\": Invalid relative URL or base scheme is not hierarchical.", TypeError);
const ERR_UNKNOWN_FILE_EXTENSION$1 = createError$1("ERR_UNKNOWN_FILE_EXTENSION", (extension, path$1$1) => {
	return `Unknown file extension "${extension}" for ${path$1$1}`;
}, TypeError);
createError$1("ERR_INVALID_ARG_VALUE", (name, value, reason = "is invalid") => {
	let inspected = inspect(value);
	if (inspected.length > 128) inspected = `${inspected.slice(0, 128)}...`;
	return `The ${name.includes(".") ? "property" : "argument"} '${name}' ${reason}. Received ${inspected}`;
}, TypeError);
const hasOwnProperty$1$3 = {}.hasOwnProperty;
const cache$1 = /* @__PURE__ */ new Map();
function read$1(jsonPath, { base, specifier }) {
	const existing = cache$1.get(jsonPath);
	if (existing) return existing;
	let string;
	try {
		string = fs.readFileSync(path$1.toNamespacedPath(jsonPath), "utf8");
	} catch (error) {
		const exception = error;
		if (exception.code !== "ENOENT") throw exception;
	}
	const result = {
		exists: false,
		pjsonPath: jsonPath,
		main: void 0,
		name: void 0,
		type: "none",
		exports: void 0,
		imports: void 0
	};
	if (string !== void 0) {
		let parsed;
		try {
			parsed = JSON.parse(string);
		} catch (error_) {
			const error = new ERR_INVALID_PACKAGE_CONFIG$2(jsonPath, (base ? `"${specifier}" from ` : "") + fileURLToPath(base || specifier), error_.message);
			error.cause = error_;
			throw error;
		}
		result.exists = true;
		if (hasOwnProperty$1$3.call(parsed, "name") && typeof parsed.name === "string") result.name = parsed.name;
		if (hasOwnProperty$1$3.call(parsed, "main") && typeof parsed.main === "string") result.main = parsed.main;
		if (hasOwnProperty$1$3.call(parsed, "exports")) result.exports = parsed.exports;
		if (hasOwnProperty$1$3.call(parsed, "imports")) result.imports = parsed.imports;
		if (hasOwnProperty$1$3.call(parsed, "type") && (parsed.type === "commonjs" || parsed.type === "module")) result.type = parsed.type;
	}
	cache$1.set(jsonPath, result);
	return result;
}
function getPackageScopeConfig$1(resolved) {
	let packageJSONUrl = new URL("package.json", resolved);
	while (true) {
		if (packageJSONUrl.pathname.endsWith("node_modules/package.json")) break;
		const packageConfig = read$1(fileURLToPath(packageJSONUrl), { specifier: resolved });
		if (packageConfig.exists) return packageConfig;
		const lastPackageJSONUrl = packageJSONUrl;
		packageJSONUrl = new URL("../package.json", packageJSONUrl);
		if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
	}
	return {
		pjsonPath: fileURLToPath(packageJSONUrl),
		exists: false,
		type: "none"
	};
}
const hasOwnProperty$4 = {}.hasOwnProperty;
const extensionFormatMap$1 = {
	__proto__: null,
	".json": "json",
	".cjs": "commonjs",
	".cts": "commonjs",
	".js": "module",
	".ts": "module",
	".mts": "module",
	".mjs": "module"
};
const protocolHandlers$1 = {
	__proto__: null,
	"data:": getDataProtocolModuleFormat$1,
	"file:": getFileProtocolModuleFormat$1,
	"node:": () => "builtin"
};
function mimeToFormat$1(mime) {
	if (mime && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime)) return "module";
	if (mime === "application/json") return "json";
	return null;
}
function getDataProtocolModuleFormat$1(parsed) {
	const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(parsed.pathname) || [
		null,
		null,
		null
	];
	return mimeToFormat$1(mime);
}
/**
* Returns the file extension from a URL.
*
* Should give similar result to
* `require('node:path').extname(require('node:url').fileURLToPath(url))`
* when used with a `file:` URL.
*
*/
function extname$3(url) {
	const pathname = url.pathname;
	let index = pathname.length;
	while (index--) {
		const code = pathname.codePointAt(index);
		if (code === 47) return "";
		if (code === 46) return pathname.codePointAt(index - 1) === 47 ? "" : pathname.slice(index);
	}
	return "";
}
function getFileProtocolModuleFormat$1(url, _context, ignoreErrors) {
	const ext = extname$3(url);
	if (ext === ".js") {
		const { type: packageType } = getPackageScopeConfig$1(url);
		if (packageType !== "none") return packageType;
		return "commonjs";
	}
	if (ext === "") {
		const { type: packageType } = getPackageScopeConfig$1(url);
		if (packageType === "none" || packageType === "commonjs") return "commonjs";
		return "module";
	}
	const format$1 = extensionFormatMap$1[ext];
	if (format$1) return format$1;
	if (ignoreErrors) return;
	throw new ERR_UNKNOWN_FILE_EXTENSION$1(ext, fileURLToPath(url));
}
function defaultGetFormatWithoutErrors$1(url, context) {
	const protocol = url.protocol;
	if (!hasOwnProperty$4.call(protocolHandlers$1, protocol)) return null;
	return protocolHandlers$1[protocol](url, context, true) || null;
}
const RegExpPrototypeSymbolReplace$1 = RegExp.prototype[Symbol.replace];
const own$2 = {}.hasOwnProperty;
const invalidSegmentRegEx$1 = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
const deprecatedInvalidSegmentRegEx$1 = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidPackageNameRegEx$1 = /^\.|%|\\/;
const patternRegEx$1 = /\*/g;
const encodedSeparatorRegEx$1 = /%2f|%5c/i;
const emittedPackageWarnings$1 = /* @__PURE__ */ new Set();
const doubleSlashRegEx$1 = /[/\\]{2}/;
function emitInvalidSegmentDeprecation$1(target, request, match, packageJsonUrl, internal, base, isTarget) {
	if (process$1.noDeprecation) return;
	const pjsonPath = fileURLToPath(packageJsonUrl);
	const double = doubleSlashRegEx$1.exec(isTarget ? target : request) !== null;
	process$1.emitWarning(`Use of deprecated ${double ? "double slash" : "leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request === match ? "" : `matched to "${match}" `}in the "${internal ? "imports" : "exports"}" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}.`, "DeprecationWarning", "DEP0166");
}
function emitLegacyIndexDeprecation$1(url, packageJsonUrl, base, main) {
	if (process$1.noDeprecation) return;
	if (defaultGetFormatWithoutErrors$1(url, { parentURL: base.href }) !== "module") return;
	const urlPath = fileURLToPath(url.href);
	const packagePath = fileURLToPath(new URL$1(".", packageJsonUrl));
	const basePath = fileURLToPath(base);
	if (!main) process$1.emitWarning(`No "main" or "exports" field defined in the package.json for ${packagePath} resolving the main entry point "${urlPath.slice(packagePath.length)}", imported from ${basePath}.\nDefault "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
	else if (path$1.resolve(packagePath, main) !== urlPath) process$1.emitWarning(`Package ${packagePath} has a "main" field set to "${main}", excluding the full filename and extension to the resolved file at "${urlPath.slice(packagePath.length)}", imported from ${basePath}.\n Automatic extension resolution of the "main" field is deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
}
function tryStatSync$1(path$1$1) {
	try {
		return statSync(path$1$1);
	} catch {}
}
/**
* Legacy CommonJS main resolution:
* 1. let M = pkg_url + (json main field)
* 2. TRY(M, M.js, M.json, M.node)
* 3. TRY(M/index.js, M/index.json, M/index.node)
* 4. TRY(pkg_url/index.js, pkg_url/index.json, pkg_url/index.node)
* 5. NOT_FOUND
*/
function fileExists$1(url) {
	const stats = statSync(url, { throwIfNoEntry: false });
	const isFile = stats ? stats.isFile() : void 0;
	return isFile === null || isFile === void 0 ? false : isFile;
}
function legacyMainResolve$1(packageJsonUrl, packageConfig, base) {
	let guess;
	if (packageConfig.main !== void 0) {
		guess = new URL$1(packageConfig.main, packageJsonUrl);
		if (fileExists$1(guess)) return guess;
		const tries$1 = [
			`./${packageConfig.main}.js`,
			`./${packageConfig.main}.json`,
			`./${packageConfig.main}.node`,
			`./${packageConfig.main}/index.js`,
			`./${packageConfig.main}/index.json`,
			`./${packageConfig.main}/index.node`
		];
		let i$1$1 = -1;
		while (++i$1$1 < tries$1.length) {
			guess = new URL$1(tries$1[i$1$1], packageJsonUrl);
			if (fileExists$1(guess)) break;
			guess = void 0;
		}
		if (guess) {
			emitLegacyIndexDeprecation$1(guess, packageJsonUrl, base, packageConfig.main);
			return guess;
		}
	}
	const tries = [
		"./index.js",
		"./index.json",
		"./index.node"
	];
	let i$2 = -1;
	while (++i$2 < tries.length) {
		guess = new URL$1(tries[i$2], packageJsonUrl);
		if (fileExists$1(guess)) break;
		guess = void 0;
	}
	if (guess) {
		emitLegacyIndexDeprecation$1(guess, packageJsonUrl, base, packageConfig.main);
		return guess;
	}
	throw new ERR_MODULE_NOT_FOUND$1(fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
function finalizeResolution$1(resolved, base, preserveSymlinks) {
	if (encodedSeparatorRegEx$1.exec(resolved.pathname) !== null) throw new ERR_INVALID_MODULE_SPECIFIER$1(resolved.pathname, String.raw`must not include encoded "/" or "\" characters`, fileURLToPath(base));
	let filePath;
	try {
		filePath = fileURLToPath(resolved);
	} catch (error) {
		Object.defineProperty(error, "input", { value: String(resolved) });
		Object.defineProperty(error, "module", { value: String(base) });
		throw error;
	}
	const stats = tryStatSync$1(filePath.endsWith("/") ? filePath.slice(-1) : filePath);
	if (stats && stats.isDirectory()) {
		const error = new ERR_UNSUPPORTED_DIR_IMPORT$1(filePath, fileURLToPath(base));
		error.url = String(resolved);
		throw error;
	}
	if (!stats || !stats.isFile()) {
		const error = new ERR_MODULE_NOT_FOUND$1(filePath || resolved.pathname, base && fileURLToPath(base), true);
		error.url = String(resolved);
		throw error;
	}
	if (!preserveSymlinks) {
		const real = realpathSync(filePath);
		const { search, hash: hash$1 } = resolved;
		resolved = pathToFileURL(real + (filePath.endsWith(path$1.sep) ? "/" : ""));
		resolved.search = search;
		resolved.hash = hash$1;
	}
	return resolved;
}
function importNotDefined$1(specifier, packageJsonUrl, base) {
	return new ERR_PACKAGE_IMPORT_NOT_DEFINED$1(specifier, packageJsonUrl && fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
function exportsNotFound$1(subpath, packageJsonUrl, base) {
	return new ERR_PACKAGE_PATH_NOT_EXPORTED$1(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, base && fileURLToPath(base));
}
function throwInvalidSubpath$1(request, match, packageJsonUrl, internal, base) {
	throw new ERR_INVALID_MODULE_SPECIFIER$1(request, `request is not a valid match in pattern "${match}" for the "${internal ? "imports" : "exports"}" resolution of ${fileURLToPath(packageJsonUrl)}`, base && fileURLToPath(base));
}
function invalidPackageTarget$1(subpath, target, packageJsonUrl, internal, base) {
	target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
	return new ERR_INVALID_PACKAGE_TARGET$1(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, target, internal, base && fileURLToPath(base));
}
function resolvePackageTargetString$1(target, subpath, match, packageJsonUrl, base, pattern, internal, isPathMap, conditions) {
	if (subpath !== "" && !pattern && target.at(-1) !== "/") throw invalidPackageTarget$1(match, target, packageJsonUrl, internal, base);
	if (!target.startsWith("./")) {
		if (internal && !target.startsWith("../") && !target.startsWith("/")) {
			let isURL = false;
			try {
				new URL$1(target);
				isURL = true;
			} catch {}
			if (!isURL) return packageResolve$1(pattern ? RegExpPrototypeSymbolReplace$1.call(patternRegEx$1, target, () => subpath) : target + subpath, packageJsonUrl, conditions);
		}
		throw invalidPackageTarget$1(match, target, packageJsonUrl, internal, base);
	}
	if (invalidSegmentRegEx$1.exec(target.slice(2)) !== null) if (deprecatedInvalidSegmentRegEx$1.exec(target.slice(2)) === null) {
		if (!isPathMap) {
			const request = pattern ? match.replace("*", () => subpath) : match + subpath;
			emitInvalidSegmentDeprecation$1(pattern ? RegExpPrototypeSymbolReplace$1.call(patternRegEx$1, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, true);
		}
	} else throw invalidPackageTarget$1(match, target, packageJsonUrl, internal, base);
	const resolved = new URL$1(target, packageJsonUrl);
	const resolvedPath = resolved.pathname;
	const packagePath = new URL$1(".", packageJsonUrl).pathname;
	if (!resolvedPath.startsWith(packagePath)) throw invalidPackageTarget$1(match, target, packageJsonUrl, internal, base);
	if (subpath === "") return resolved;
	if (invalidSegmentRegEx$1.exec(subpath) !== null) {
		const request = pattern ? match.replace("*", () => subpath) : match + subpath;
		if (deprecatedInvalidSegmentRegEx$1.exec(subpath) === null) {
			if (!isPathMap) emitInvalidSegmentDeprecation$1(pattern ? RegExpPrototypeSymbolReplace$1.call(patternRegEx$1, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, false);
		} else throwInvalidSubpath$1(request, match, packageJsonUrl, internal, base);
	}
	if (pattern) return new URL$1(RegExpPrototypeSymbolReplace$1.call(patternRegEx$1, resolved.href, () => subpath));
	return new URL$1(subpath, resolved);
}
function isArrayIndex$1(key) {
	const keyNumber = Number(key);
	if (`${keyNumber}` !== key) return false;
	return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget$1(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions) {
	if (typeof target === "string") return resolvePackageTargetString$1(target, subpath, packageSubpath, packageJsonUrl, base, pattern, internal, isPathMap, conditions);
	if (Array.isArray(target)) {
		const targetList = target;
		if (targetList.length === 0) return null;
		let lastException;
		let i$2 = -1;
		while (++i$2 < targetList.length) {
			const targetItem = targetList[i$2];
			let resolveResult;
			try {
				resolveResult = resolvePackageTarget$1(packageJsonUrl, targetItem, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
			} catch (error) {
				const exception = error;
				lastException = exception;
				if (exception.code === "ERR_INVALID_PACKAGE_TARGET") continue;
				throw error;
			}
			if (resolveResult === void 0) continue;
			if (resolveResult === null) {
				lastException = null;
				continue;
			}
			return resolveResult;
		}
		if (lastException === void 0 || lastException === null) return null;
		throw lastException;
	}
	if (typeof target === "object" && target !== null) {
		const keys = Object.getOwnPropertyNames(target);
		let i$2 = -1;
		while (++i$2 < keys.length) {
			const key = keys[i$2];
			if (isArrayIndex$1(key)) throw new ERR_INVALID_PACKAGE_CONFIG$2(fileURLToPath(packageJsonUrl), fileURLToPath(base), "\"exports\" cannot contain numeric property keys.");
		}
		i$2 = -1;
		while (++i$2 < keys.length) {
			const key = keys[i$2];
			if (key === "default" || conditions && conditions.has(key)) {
				const conditionalTarget = target[key];
				const resolveResult = resolvePackageTarget$1(packageJsonUrl, conditionalTarget, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
				if (resolveResult === void 0) continue;
				return resolveResult;
			}
		}
		return null;
	}
	if (target === null) return null;
	throw invalidPackageTarget$1(packageSubpath, target, packageJsonUrl, internal, base);
}
function isConditionalExportsMainSugar$1(exports, packageJsonUrl, base) {
	if (typeof exports === "string" || Array.isArray(exports)) return true;
	if (typeof exports !== "object" || exports === null) return false;
	const keys = Object.getOwnPropertyNames(exports);
	let isConditionalSugar = false;
	let i$2 = 0;
	let keyIndex = -1;
	while (++keyIndex < keys.length) {
		const key = keys[keyIndex];
		const currentIsConditionalSugar = key === "" || key[0] !== ".";
		if (i$2++ === 0) isConditionalSugar = currentIsConditionalSugar;
		else if (isConditionalSugar !== currentIsConditionalSugar) throw new ERR_INVALID_PACKAGE_CONFIG$2(fileURLToPath(packageJsonUrl), fileURLToPath(base), "\"exports\" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.");
	}
	return isConditionalSugar;
}
function emitTrailingSlashPatternDeprecation$1(match, pjsonUrl, base) {
	if (process$1.noDeprecation) return;
	const pjsonPath = fileURLToPath(pjsonUrl);
	if (emittedPackageWarnings$1.has(pjsonPath + "|" + match)) return;
	emittedPackageWarnings$1.add(pjsonPath + "|" + match);
	process$1.emitWarning(`Use of deprecated trailing slash pattern mapping "${match}" in the "exports" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`, "DeprecationWarning", "DEP0155");
}
function packageExportsResolve$1(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
	let exports = packageConfig.exports;
	if (isConditionalExportsMainSugar$1(exports, packageJsonUrl, base)) exports = { ".": exports };
	if (own$2.call(exports, packageSubpath) && !packageSubpath.includes("*") && !packageSubpath.endsWith("/")) {
		const target = exports[packageSubpath];
		const resolveResult = resolvePackageTarget$1(packageJsonUrl, target, "", packageSubpath, base, false, false, false, conditions);
		if (resolveResult === null || resolveResult === void 0) throw exportsNotFound$1(packageSubpath, packageJsonUrl, base);
		return resolveResult;
	}
	let bestMatch = "";
	let bestMatchSubpath = "";
	const keys = Object.getOwnPropertyNames(exports);
	let i$2 = -1;
	while (++i$2 < keys.length) {
		const key = keys[i$2];
		const patternIndex = key.indexOf("*");
		if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
			if (packageSubpath.endsWith("/")) emitTrailingSlashPatternDeprecation$1(packageSubpath, packageJsonUrl, base);
			const patternTrailer = key.slice(patternIndex + 1);
			if (packageSubpath.length >= key.length && packageSubpath.endsWith(patternTrailer) && patternKeyCompare$1(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
				bestMatch = key;
				bestMatchSubpath = packageSubpath.slice(patternIndex, packageSubpath.length - patternTrailer.length);
			}
		}
	}
	if (bestMatch) {
		const target = exports[bestMatch];
		const resolveResult = resolvePackageTarget$1(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, false, packageSubpath.endsWith("/"), conditions);
		if (resolveResult === null || resolveResult === void 0) throw exportsNotFound$1(packageSubpath, packageJsonUrl, base);
		return resolveResult;
	}
	throw exportsNotFound$1(packageSubpath, packageJsonUrl, base);
}
function patternKeyCompare$1(a$1, b$2) {
	const aPatternIndex = a$1.indexOf("*");
	const bPatternIndex = b$2.indexOf("*");
	const baseLengthA = aPatternIndex === -1 ? a$1.length : aPatternIndex + 1;
	const baseLengthB = bPatternIndex === -1 ? b$2.length : bPatternIndex + 1;
	if (baseLengthA > baseLengthB) return -1;
	if (baseLengthB > baseLengthA) return 1;
	if (aPatternIndex === -1) return 1;
	if (bPatternIndex === -1) return -1;
	if (a$1.length > b$2.length) return -1;
	if (b$2.length > a$1.length) return 1;
	return 0;
}
function packageImportsResolve$1(name, base, conditions) {
	if (name === "#" || name.startsWith("#/") || name.endsWith("/")) throw new ERR_INVALID_MODULE_SPECIFIER$1(name, "is not a valid internal imports specifier name", fileURLToPath(base));
	let packageJsonUrl;
	const packageConfig = getPackageScopeConfig$1(base);
	if (packageConfig.exists) {
		packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
		const imports = packageConfig.imports;
		if (imports) if (own$2.call(imports, name) && !name.includes("*")) {
			const resolveResult = resolvePackageTarget$1(packageJsonUrl, imports[name], "", name, base, false, true, false, conditions);
			if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
		} else {
			let bestMatch = "";
			let bestMatchSubpath = "";
			const keys = Object.getOwnPropertyNames(imports);
			let i$2 = -1;
			while (++i$2 < keys.length) {
				const key = keys[i$2];
				const patternIndex = key.indexOf("*");
				if (patternIndex !== -1 && name.startsWith(key.slice(0, -1))) {
					const patternTrailer = key.slice(patternIndex + 1);
					if (name.length >= key.length && name.endsWith(patternTrailer) && patternKeyCompare$1(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
						bestMatch = key;
						bestMatchSubpath = name.slice(patternIndex, name.length - patternTrailer.length);
					}
				}
			}
			if (bestMatch) {
				const target = imports[bestMatch];
				const resolveResult = resolvePackageTarget$1(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, true, false, conditions);
				if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
			}
		}
	}
	throw importNotDefined$1(name, packageJsonUrl, base);
}
/**
* @param {string} specifier
* @param {URL} base
*/
function parsePackageName$1(specifier, base) {
	let separatorIndex = specifier.indexOf("/");
	let validPackageName = true;
	let isScoped = false;
	if (specifier[0] === "@") {
		isScoped = true;
		if (separatorIndex === -1 || specifier.length === 0) validPackageName = false;
		else separatorIndex = specifier.indexOf("/", separatorIndex + 1);
	}
	const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
	if (invalidPackageNameRegEx$1.exec(packageName) !== null) validPackageName = false;
	if (!validPackageName) throw new ERR_INVALID_MODULE_SPECIFIER$1(specifier, "is not a valid package name", fileURLToPath(base));
	return {
		packageName,
		packageSubpath: "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex)),
		isScoped
	};
}
function packageResolve$1(specifier, base, conditions) {
	if (nodeBuiltins.includes(specifier)) return new URL$1("node:" + specifier);
	const { packageName, packageSubpath, isScoped } = parsePackageName$1(specifier, base);
	const packageConfig = getPackageScopeConfig$1(base);
	if (packageConfig.exists && packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) return packageExportsResolve$1(pathToFileURL(packageConfig.pjsonPath), packageSubpath, packageConfig, base, conditions);
	let packageJsonUrl = new URL$1("./node_modules/" + packageName + "/package.json", base);
	let packageJsonPath = fileURLToPath(packageJsonUrl);
	let lastPath;
	do {
		const stat$2 = tryStatSync$1(packageJsonPath.slice(0, -13));
		if (!stat$2 || !stat$2.isDirectory()) {
			lastPath = packageJsonPath;
			packageJsonUrl = new URL$1((isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json", packageJsonUrl);
			packageJsonPath = fileURLToPath(packageJsonUrl);
			continue;
		}
		const packageConfig$1 = read$1(packageJsonPath, {
			base,
			specifier
		});
		if (packageConfig$1.exports !== void 0 && packageConfig$1.exports !== null) return packageExportsResolve$1(packageJsonUrl, packageSubpath, packageConfig$1, base, conditions);
		if (packageSubpath === ".") return legacyMainResolve$1(packageJsonUrl, packageConfig$1, base);
		return new URL$1(packageSubpath, packageJsonUrl);
	} while (packageJsonPath.length !== lastPath.length);
	throw new ERR_MODULE_NOT_FOUND$1(packageName, fileURLToPath(base), false);
}
function isRelativeSpecifier$1(specifier) {
	if (specifier[0] === ".") {
		if (specifier.length === 1 || specifier[1] === "/") return true;
		if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) return true;
	}
	return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath$1(specifier) {
	if (specifier === "") return false;
	if (specifier[0] === "/") return true;
	return isRelativeSpecifier$1(specifier);
}
/**
* The “Resolver Algorithm Specification” as detailed in the Node docs (which is
* sync and slightly lower-level than `resolve`).
*
* @param {string} specifier
*   `/example.js`, `./example.js`, `../example.js`, `some-package`, `fs`, etc.
* @param {URL} base
*   Full URL (to a file) that `specifier` is resolved relative from.
* @param {Set<string>} [conditions]
*   Conditions.
* @param {boolean} [preserveSymlinks]
*   Keep symlinks instead of resolving them.
* @returns {URL}
*   A URL object to the found thing.
*/
function moduleResolve$1(specifier, base, conditions, preserveSymlinks) {
	const protocol = base.protocol;
	const isData = protocol === "data:";
	let resolved;
	if (shouldBeTreatedAsRelativeOrAbsolutePath$1(specifier)) try {
		resolved = new URL$1(specifier, base);
	} catch (error_) {
		const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST$1(specifier, base);
		error.cause = error_;
		throw error;
	}
	else if (protocol === "file:" && specifier[0] === "#") resolved = packageImportsResolve$1(specifier, base, conditions);
	else try {
		resolved = new URL$1(specifier);
	} catch (error_) {
		if (isData && !nodeBuiltins.includes(specifier)) {
			const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST$1(specifier, base);
			error.cause = error_;
			throw error;
		}
		resolved = packageResolve$1(specifier, base, conditions);
	}
	assert.ok(resolved !== void 0, "expected to be defined");
	if (resolved.protocol !== "file:") return resolved;
	return finalizeResolution$1(resolved, base, preserveSymlinks);
}
const DEFAULT_CONDITIONS_SET$1 = /* @__PURE__ */ new Set(["node", "import"]);
const isWindows = process.platform === "win32";
const globalCache = globalThis["__EXSOLVE_CACHE__"] ||= /* @__PURE__ */ new Map();
/**
* Synchronously resolves a module url based on the options provided.
*
* @param {string} input - The identifier or path of the module to resolve.
* @param {ResolveOptions} [options] - Options to resolve the module. See {@link ResolveOptions}.
* @returns {string} The resolved URL as a string.
*/
function resolveModuleURL(input, options) {
	const parsedInput = _parseInput(input);
	if ("external" in parsedInput) return parsedInput.external;
	const specifier = parsedInput.specifier;
	let url = parsedInput.url;
	let absolutePath = parsedInput.absolutePath;
	let cacheKey;
	let cacheObj;
	if (options?.cache !== false) {
		cacheKey = _cacheKey(absolutePath || specifier, options);
		cacheObj = options?.cache && typeof options?.cache === "object" ? options.cache : globalCache;
	}
	if (cacheObj) {
		const cached = cacheObj.get(cacheKey);
		if (typeof cached === "string") return cached;
		if (cached instanceof Error) {
			if (options?.try) return;
			throw cached;
		}
	}
	if (absolutePath) try {
		const stat$2 = lstatSync(absolutePath);
		if (stat$2.isSymbolicLink()) {
			absolutePath = realpathSync(absolutePath);
			url = pathToFileURL(absolutePath);
		}
		if (stat$2.isFile()) {
			if (cacheObj) cacheObj.set(cacheKey, url.href);
			return url.href;
		}
	} catch (error) {
		if (error?.code !== "ENOENT") {
			if (cacheObj) cacheObj.set(cacheKey, error);
			throw error;
		}
	}
	const conditionsSet = options?.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET$1;
	const target = specifier || url.href;
	const bases = _normalizeBases(options?.from);
	const suffixes = options?.suffixes || [""];
	const extensions = options?.extensions ? ["", ...options.extensions] : [""];
	let resolved;
	for (const base of bases) {
		for (const suffix of suffixes) {
			let name = _join(target, suffix);
			if (name === ".") name += "/.";
			for (const extension of extensions) {
				resolved = _tryModuleResolve$1(name + extension, base, conditionsSet);
				if (resolved) break;
			}
			if (resolved) break;
		}
		if (resolved) break;
	}
	if (!resolved) {
		const error = /* @__PURE__ */ new Error(`Cannot resolve module "${input}" (from: ${bases.map((u$1) => _fmtPath(u$1)).join(", ")})`);
		error.code = "ERR_MODULE_NOT_FOUND";
		if (cacheObj) cacheObj.set(cacheKey, error);
		if (options?.try) return;
		throw error;
	}
	if (cacheObj) cacheObj.set(cacheKey, resolved.href);
	return resolved.href;
}
/**
* Synchronously resolves a module then converts it to a file path
*
* (throws error if reolved path is not file:// scheme)
*
* @param {string} id - The identifier or path of the module to resolve.
* @param {ResolveOptions} [options] - Options to resolve the module. See {@link ResolveOptions}.
* @returns {string} The resolved URL as a string.
*/
function resolveModulePath(id, options) {
	const resolved = resolveModuleURL(id, options);
	if (!resolved) return;
	if (!resolved.startsWith("file://") && options?.try) return;
	const absolutePath = fileURLToPath(resolved);
	return isWindows ? _normalizeWinPath(absolutePath) : absolutePath;
}
function _tryModuleResolve$1(specifier, base, conditions) {
	try {
		return moduleResolve$1(specifier, base, conditions);
	} catch {}
}
function _normalizeBases(inputs) {
	const urls = (Array.isArray(inputs) ? inputs : [inputs]).flatMap((input) => _normalizeBase(input));
	if (urls.length === 0) return [pathToFileURL("./")];
	return urls;
}
function _normalizeBase(input) {
	if (!input) return [];
	if (_isURL(input)) return [input];
	if (typeof input !== "string") return [];
	if (/^(?:node|data|http|https|file):/.test(input)) return new URL(input);
	try {
		if (input.endsWith("/") || statSync(input).isDirectory()) return pathToFileURL(input + "/");
		return pathToFileURL(input);
	} catch {
		return [pathToFileURL(input + "/"), pathToFileURL(input)];
	}
}
function _fmtPath(input) {
	try {
		return fileURLToPath(input);
	} catch {
		return input;
	}
}
function _cacheKey(id, opts) {
	return JSON.stringify([
		id,
		(opts?.conditions || ["node", "import"]).sort(),
		opts?.extensions,
		opts?.from,
		opts?.suffixes
	]);
}
function _join(a$1, b$2) {
	if (!a$1 || !b$2 || b$2 === "/") return a$1;
	return (a$1.endsWith("/") ? a$1 : a$1 + "/") + (b$2.startsWith("/") ? b$2.slice(1) : b$2);
}
function _normalizeWinPath(path$1$1) {
	return path$1$1.replace(/\\/g, "/").replace(/^[a-z]:\//, (r$3) => r$3.toUpperCase());
}
function _isURL(input) {
	return input instanceof URL || input?.constructor?.name === "URL";
}
function _parseInput(input) {
	if (typeof input === "string") {
		if (input.startsWith("file:")) {
			const url = new URL(input);
			return {
				url,
				absolutePath: fileURLToPath(url)
			};
		}
		if (isAbsolute$1(input)) return {
			url: pathToFileURL(input),
			absolutePath: input
		};
		if (/^(?:node|data|http|https):/.test(input)) return { external: input };
		if (nodeBuiltins.includes(input) && !input.includes(":")) return { external: `node:${input}` };
		return { specifier: input };
	}
	if (_isURL(input)) {
		if (input.protocol === "file:") return {
			url: input,
			absolutePath: fileURLToPath(input)
		};
		return { external: input.href };
	}
	throw new TypeError("id must be a `string` or `URL`");
}

//#endregion
//#region node_modules/.pnpm/confbox@0.2.2/node_modules/confbox/dist/shared/confbox.DA7CpUDY.mjs
const b$1 = /^(?:( )+|\t+)/, d$1 = "space", h$3 = "tab";
function g$1(e, t$1) {
	const n$2 = /* @__PURE__ */ new Map();
	let s = 0, o$1, i$2;
	for (const c$1 of e.split(/\n/g)) {
		if (!c$1) continue;
		let f$1, a$1, l$1, p$1, r$3;
		const y$1 = c$1.match(b$1);
		if (y$1 === null) s = 0, o$1 = "";
		else {
			if (f$1 = y$1[0].length, a$1 = y$1[1] ? d$1 : h$3, t$1 && a$1 === d$1 && f$1 === 1) continue;
			a$1 !== o$1 && (s = 0), o$1 = a$1, l$1 = 1, p$1 = 0;
			const u$1 = f$1 - s;
			if (s = f$1, u$1 === 0) l$1 = 0, p$1 = 1;
			else {
				const I$2 = u$1 > 0 ? u$1 : -u$1;
				i$2 = T$1(a$1, I$2);
			}
			r$3 = n$2.get(i$2), r$3 = r$3 === void 0 ? [1, 0] : [r$3[0] + l$1, r$3[1] + p$1], n$2.set(i$2, r$3);
		}
	}
	return n$2;
}
function T$1(e, t$1) {
	return (e === d$1 ? "s" : "t") + String(t$1);
}
function w(e) {
	return {
		type: e[0] === "s" ? d$1 : h$3,
		amount: Number(e.slice(1))
	};
}
function E(e) {
	let t$1, n$2 = 0, s = 0;
	for (const [o$1, [i$2, c$1]] of e) (i$2 > n$2 || i$2 === n$2 && c$1 > s) && (n$2 = i$2, s = c$1, t$1 = o$1);
	return t$1;
}
function S$4(e, t$1) {
	return (e === d$1 ? " " : "	").repeat(t$1);
}
function _$1(e) {
	if (typeof e != "string") throw new TypeError("Expected a string");
	let t$1 = g$1(e, !0);
	t$1.size === 0 && (t$1 = g$1(e, !1));
	const n$2 = E(t$1);
	let s, o$1 = 0, i$2 = "";
	return n$2 !== void 0 && ({type: s, amount: o$1} = w(n$2), i$2 = S$4(s, o$1)), {
		amount: o$1,
		type: s,
		indent: i$2
	};
}
const m$2 = Symbol.for("__confbox_fmt__"), k$1 = /^(\s+)/, v$2 = /(\s+)$/;
function x$4(e, t$1 = {}) {
	return {
		sample: t$1.indent === void 0 && t$1.preserveIndentation !== !1 && e.slice(0, t$1?.sampleSize || 1024),
		whiteSpace: t$1.preserveWhitespace === !1 ? void 0 : {
			start: k$1.exec(e)?.[0] || "",
			end: v$2.exec(e)?.[0] || ""
		}
	};
}
function N$4(e, t$1, n$2) {
	!t$1 || typeof t$1 != "object" || Object.defineProperty(t$1, m$2, {
		enumerable: !1,
		configurable: !0,
		writable: !0,
		value: x$4(e, n$2)
	});
}
function C$1(e, t$1) {
	if (!e || typeof e != "object" || !(m$2 in e)) return {
		indent: t$1?.indent ?? 2,
		whitespace: {
			start: "",
			end: ""
		}
	};
	const n$2 = e[m$2];
	return {
		indent: t$1?.indent || _$1(n$2.sample || "").indent,
		whitespace: n$2.whiteSpace || {
			start: "",
			end: ""
		}
	};
}

//#endregion
//#region node_modules/.pnpm/confbox@0.2.2/node_modules/confbox/dist/shared/confbox.DnMsyigM.mjs
function $$1(n$2, l$1 = !1) {
	const g$2 = n$2.length;
	let e = 0, u$1 = "", p$1 = 0, k$2 = 16, A$1 = 0, o$1 = 0, O$2 = 0, B = 0, b$2 = 0;
	function I$2(i$2, T$2) {
		let s = 0, c$1 = 0;
		for (; s < i$2;) {
			let t$1 = n$2.charCodeAt(e);
			if (t$1 >= 48 && t$1 <= 57) c$1 = c$1 * 16 + t$1 - 48;
			else if (t$1 >= 65 && t$1 <= 70) c$1 = c$1 * 16 + t$1 - 65 + 10;
			else if (t$1 >= 97 && t$1 <= 102) c$1 = c$1 * 16 + t$1 - 97 + 10;
			else break;
			e++, s++;
		}
		return s < i$2 && (c$1 = -1), c$1;
	}
	function V$1(i$2) {
		e = i$2, u$1 = "", p$1 = 0, k$2 = 16, b$2 = 0;
	}
	function F$1() {
		let i$2 = e;
		if (n$2.charCodeAt(e) === 48) e++;
		else for (e++; e < n$2.length && L$2(n$2.charCodeAt(e));) e++;
		if (e < n$2.length && n$2.charCodeAt(e) === 46) if (e++, e < n$2.length && L$2(n$2.charCodeAt(e))) for (e++; e < n$2.length && L$2(n$2.charCodeAt(e));) e++;
		else return b$2 = 3, n$2.substring(i$2, e);
		let T$2 = e;
		if (e < n$2.length && (n$2.charCodeAt(e) === 69 || n$2.charCodeAt(e) === 101)) if (e++, (e < n$2.length && n$2.charCodeAt(e) === 43 || n$2.charCodeAt(e) === 45) && e++, e < n$2.length && L$2(n$2.charCodeAt(e))) {
			for (e++; e < n$2.length && L$2(n$2.charCodeAt(e));) e++;
			T$2 = e;
		} else b$2 = 3;
		return n$2.substring(i$2, T$2);
	}
	function a$1() {
		let i$2 = "", T$2 = e;
		for (;;) {
			if (e >= g$2) {
				i$2 += n$2.substring(T$2, e), b$2 = 2;
				break;
			}
			const s = n$2.charCodeAt(e);
			if (s === 34) {
				i$2 += n$2.substring(T$2, e), e++;
				break;
			}
			if (s === 92) {
				if (i$2 += n$2.substring(T$2, e), e++, e >= g$2) {
					b$2 = 2;
					break;
				}
				switch (n$2.charCodeAt(e++)) {
					case 34:
						i$2 += "\"";
						break;
					case 92:
						i$2 += "\\";
						break;
					case 47:
						i$2 += "/";
						break;
					case 98:
						i$2 += "\b";
						break;
					case 102:
						i$2 += "\f";
						break;
					case 110:
						i$2 += `
`;
						break;
					case 114:
						i$2 += "\r";
						break;
					case 116:
						i$2 += "	";
						break;
					case 117:
						const t$1 = I$2(4);
						t$1 >= 0 ? i$2 += String.fromCharCode(t$1) : b$2 = 4;
						break;
					default: b$2 = 5;
				}
				T$2 = e;
				continue;
			}
			if (s >= 0 && s <= 31) if (r$2(s)) {
				i$2 += n$2.substring(T$2, e), b$2 = 2;
				break;
			} else b$2 = 6;
			e++;
		}
		return i$2;
	}
	function w$1() {
		if (u$1 = "", b$2 = 0, p$1 = e, o$1 = A$1, B = O$2, e >= g$2) return p$1 = g$2, k$2 = 17;
		let i$2 = n$2.charCodeAt(e);
		if (J$1(i$2)) {
			do
				e++, u$1 += String.fromCharCode(i$2), i$2 = n$2.charCodeAt(e);
			while (J$1(i$2));
			return k$2 = 15;
		}
		if (r$2(i$2)) return e++, u$1 += String.fromCharCode(i$2), i$2 === 13 && n$2.charCodeAt(e) === 10 && (e++, u$1 += `
`), A$1++, O$2 = e, k$2 = 14;
		switch (i$2) {
			case 123: return e++, k$2 = 1;
			case 125: return e++, k$2 = 2;
			case 91: return e++, k$2 = 3;
			case 93: return e++, k$2 = 4;
			case 58: return e++, k$2 = 6;
			case 44: return e++, k$2 = 5;
			case 34: return e++, u$1 = a$1(), k$2 = 10;
			case 47:
				const T$2 = e - 1;
				if (n$2.charCodeAt(e + 1) === 47) {
					for (e += 2; e < g$2 && !r$2(n$2.charCodeAt(e));) e++;
					return u$1 = n$2.substring(T$2, e), k$2 = 12;
				}
				if (n$2.charCodeAt(e + 1) === 42) {
					e += 2;
					const s = g$2 - 1;
					let c$1 = !1;
					for (; e < s;) {
						const t$1 = n$2.charCodeAt(e);
						if (t$1 === 42 && n$2.charCodeAt(e + 1) === 47) {
							e += 2, c$1 = !0;
							break;
						}
						e++, r$2(t$1) && (t$1 === 13 && n$2.charCodeAt(e) === 10 && e++, A$1++, O$2 = e);
					}
					return c$1 || (e++, b$2 = 1), u$1 = n$2.substring(T$2, e), k$2 = 13;
				}
				return u$1 += String.fromCharCode(i$2), e++, k$2 = 16;
			case 45: if (u$1 += String.fromCharCode(i$2), e++, e === g$2 || !L$2(n$2.charCodeAt(e))) return k$2 = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return u$1 += F$1(), k$2 = 11;
			default:
				for (; e < g$2 && v$3(i$2);) e++, i$2 = n$2.charCodeAt(e);
				if (p$1 !== e) {
					switch (u$1 = n$2.substring(p$1, e), u$1) {
						case "true": return k$2 = 8;
						case "false": return k$2 = 9;
						case "null": return k$2 = 7;
					}
					return k$2 = 16;
				}
				return u$1 += String.fromCharCode(i$2), e++, k$2 = 16;
		}
	}
	function v$3(i$2) {
		if (J$1(i$2) || r$2(i$2)) return !1;
		switch (i$2) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return !1;
		}
		return !0;
	}
	function j$1() {
		let i$2;
		do
			i$2 = w$1();
		while (i$2 >= 12 && i$2 <= 15);
		return i$2;
	}
	return {
		setPosition: V$1,
		getPosition: () => e,
		scan: l$1 ? j$1 : w$1,
		getToken: () => k$2,
		getTokenValue: () => u$1,
		getTokenOffset: () => p$1,
		getTokenLength: () => e - p$1,
		getTokenStartLine: () => o$1,
		getTokenStartCharacter: () => p$1 - B,
		getTokenError: () => b$2
	};
}
function J$1(n$2) {
	return n$2 === 32 || n$2 === 9;
}
function r$2(n$2) {
	return n$2 === 10 || n$2 === 13;
}
function L$2(n$2) {
	return n$2 >= 48 && n$2 <= 57;
}
var Q$1;
(function(n$2) {
	n$2[n$2.lineFeed = 10] = "lineFeed", n$2[n$2.carriageReturn = 13] = "carriageReturn", n$2[n$2.space = 32] = "space", n$2[n$2._0 = 48] = "_0", n$2[n$2._1 = 49] = "_1", n$2[n$2._2 = 50] = "_2", n$2[n$2._3 = 51] = "_3", n$2[n$2._4 = 52] = "_4", n$2[n$2._5 = 53] = "_5", n$2[n$2._6 = 54] = "_6", n$2[n$2._7 = 55] = "_7", n$2[n$2._8 = 56] = "_8", n$2[n$2._9 = 57] = "_9", n$2[n$2.a = 97] = "a", n$2[n$2.b = 98] = "b", n$2[n$2.c = 99] = "c", n$2[n$2.d = 100] = "d", n$2[n$2.e = 101] = "e", n$2[n$2.f = 102] = "f", n$2[n$2.g = 103] = "g", n$2[n$2.h = 104] = "h", n$2[n$2.i = 105] = "i", n$2[n$2.j = 106] = "j", n$2[n$2.k = 107] = "k", n$2[n$2.l = 108] = "l", n$2[n$2.m = 109] = "m", n$2[n$2.n = 110] = "n", n$2[n$2.o = 111] = "o", n$2[n$2.p = 112] = "p", n$2[n$2.q = 113] = "q", n$2[n$2.r = 114] = "r", n$2[n$2.s = 115] = "s", n$2[n$2.t = 116] = "t", n$2[n$2.u = 117] = "u", n$2[n$2.v = 118] = "v", n$2[n$2.w = 119] = "w", n$2[n$2.x = 120] = "x", n$2[n$2.y = 121] = "y", n$2[n$2.z = 122] = "z", n$2[n$2.A = 65] = "A", n$2[n$2.B = 66] = "B", n$2[n$2.C = 67] = "C", n$2[n$2.D = 68] = "D", n$2[n$2.E = 69] = "E", n$2[n$2.F = 70] = "F", n$2[n$2.G = 71] = "G", n$2[n$2.H = 72] = "H", n$2[n$2.I = 73] = "I", n$2[n$2.J = 74] = "J", n$2[n$2.K = 75] = "K", n$2[n$2.L = 76] = "L", n$2[n$2.M = 77] = "M", n$2[n$2.N = 78] = "N", n$2[n$2.O = 79] = "O", n$2[n$2.P = 80] = "P", n$2[n$2.Q = 81] = "Q", n$2[n$2.R = 82] = "R", n$2[n$2.S = 83] = "S", n$2[n$2.T = 84] = "T", n$2[n$2.U = 85] = "U", n$2[n$2.V = 86] = "V", n$2[n$2.W = 87] = "W", n$2[n$2.X = 88] = "X", n$2[n$2.Y = 89] = "Y", n$2[n$2.Z = 90] = "Z", n$2[n$2.asterisk = 42] = "asterisk", n$2[n$2.backslash = 92] = "backslash", n$2[n$2.closeBrace = 125] = "closeBrace", n$2[n$2.closeBracket = 93] = "closeBracket", n$2[n$2.colon = 58] = "colon", n$2[n$2.comma = 44] = "comma", n$2[n$2.dot = 46] = "dot", n$2[n$2.doubleQuote = 34] = "doubleQuote", n$2[n$2.minus = 45] = "minus", n$2[n$2.openBrace = 123] = "openBrace", n$2[n$2.openBracket = 91] = "openBracket", n$2[n$2.plus = 43] = "plus", n$2[n$2.slash = 47] = "slash", n$2[n$2.formFeed = 12] = "formFeed", n$2[n$2.tab = 9] = "tab";
})(Q$1 || (Q$1 = {})), new Array(20).fill(0).map((n$2, l$1) => " ".repeat(l$1));
const N$3 = 200;
new Array(N$3).fill(0).map((n$2, l$1) => `
` + " ".repeat(l$1)), new Array(N$3).fill(0).map((n$2, l$1) => "\r" + " ".repeat(l$1)), new Array(N$3).fill(0).map((n$2, l$1) => `\r
` + " ".repeat(l$1)), new Array(N$3).fill(0).map((n$2, l$1) => `
` + "	".repeat(l$1)), new Array(N$3).fill(0).map((n$2, l$1) => "\r" + "	".repeat(l$1)), new Array(N$3).fill(0).map((n$2, l$1) => `\r
` + "	".repeat(l$1));
var U$2;
(function(n$2) {
	n$2.DEFAULT = { allowTrailingComma: !1 };
})(U$2 || (U$2 = {}));
function S$3(n$2, l$1 = [], g$2 = U$2.DEFAULT) {
	let e = null, u$1 = [];
	const p$1 = [];
	function k$2(o$1) {
		Array.isArray(u$1) ? u$1.push(o$1) : e !== null && (u$1[e] = o$1);
	}
	return P$2(n$2, {
		onObjectBegin: () => {
			const o$1 = {};
			k$2(o$1), p$1.push(u$1), u$1 = o$1, e = null;
		},
		onObjectProperty: (o$1) => {
			e = o$1;
		},
		onObjectEnd: () => {
			u$1 = p$1.pop();
		},
		onArrayBegin: () => {
			const o$1 = [];
			k$2(o$1), p$1.push(u$1), u$1 = o$1, e = null;
		},
		onArrayEnd: () => {
			u$1 = p$1.pop();
		},
		onLiteralValue: k$2,
		onError: (o$1, O$2, B) => {
			l$1.push({
				error: o$1,
				offset: O$2,
				length: B
			});
		}
	}, g$2), u$1[0];
}
function P$2(n$2, l$1, g$2 = U$2.DEFAULT) {
	const e = $$1(n$2, !1), u$1 = [];
	let p$1 = 0;
	function k$2(f$1) {
		return f$1 ? () => p$1 === 0 && f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter()) : () => !0;
	}
	function A$1(f$1) {
		return f$1 ? (m$3) => p$1 === 0 && f$1(m$3, e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter()) : () => !0;
	}
	function o$1(f$1) {
		return f$1 ? (m$3) => p$1 === 0 && f$1(m$3, e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter(), () => u$1.slice()) : () => !0;
	}
	function O$2(f$1) {
		return f$1 ? () => {
			p$1 > 0 ? p$1++ : f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter(), () => u$1.slice()) === !1 && (p$1 = 1);
		} : () => !0;
	}
	function B(f$1) {
		return f$1 ? () => {
			p$1 > 0 && p$1--, p$1 === 0 && f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter());
		} : () => !0;
	}
	const b$2 = O$2(l$1.onObjectBegin), I$2 = o$1(l$1.onObjectProperty), V$1 = B(l$1.onObjectEnd), F$1 = O$2(l$1.onArrayBegin), a$1 = B(l$1.onArrayEnd), w$1 = o$1(l$1.onLiteralValue), v$3 = A$1(l$1.onSeparator), j$1 = k$2(l$1.onComment), i$2 = A$1(l$1.onError), T$2 = g$2 && g$2.disallowComments, s = g$2 && g$2.allowTrailingComma;
	function c$1() {
		for (;;) {
			const f$1 = e.scan();
			switch (e.getTokenError()) {
				case 4:
					t$1(14);
					break;
				case 5:
					t$1(15);
					break;
				case 3:
					t$1(13);
					break;
				case 1:
					T$2 || t$1(11);
					break;
				case 2:
					t$1(12);
					break;
				case 6:
					t$1(16);
					break;
			}
			switch (f$1) {
				case 12:
				case 13:
					T$2 ? t$1(10) : j$1();
					break;
				case 16:
					t$1(1);
					break;
				case 15:
				case 14: break;
				default: return f$1;
			}
		}
	}
	function t$1(f$1, m$3 = [], y$1 = []) {
		if (i$2(f$1), m$3.length + y$1.length > 0) {
			let _$2 = e.getToken();
			for (; _$2 !== 17;) {
				if (m$3.indexOf(_$2) !== -1) {
					c$1();
					break;
				} else if (y$1.indexOf(_$2) !== -1) break;
				_$2 = c$1();
			}
		}
	}
	function D$1(f$1) {
		const m$3 = e.getTokenValue();
		return f$1 ? w$1(m$3) : (I$2(m$3), u$1.push(m$3)), c$1(), !0;
	}
	function G$1() {
		switch (e.getToken()) {
			case 11:
				const f$1 = e.getTokenValue();
				let m$3 = Number(f$1);
				isNaN(m$3) && (t$1(2), m$3 = 0), w$1(m$3);
				break;
			case 7:
				w$1(null);
				break;
			case 8:
				w$1(!0);
				break;
			case 9:
				w$1(!1);
				break;
			default: return !1;
		}
		return c$1(), !0;
	}
	function M$1() {
		return e.getToken() !== 10 ? (t$1(3, [], [2, 5]), !1) : (D$1(!1), e.getToken() === 6 ? (v$3(":"), c$1(), E$1() || t$1(4, [], [2, 5])) : t$1(5, [], [2, 5]), u$1.pop(), !0);
	}
	function X() {
		b$2(), c$1();
		let f$1 = !1;
		for (; e.getToken() !== 2 && e.getToken() !== 17;) {
			if (e.getToken() === 5) {
				if (f$1 || t$1(4, [], []), v$3(","), c$1(), e.getToken() === 2 && s) break;
			} else f$1 && t$1(6, [], []);
			M$1() || t$1(4, [], [2, 5]), f$1 = !0;
		}
		return V$1(), e.getToken() !== 2 ? t$1(7, [2], []) : c$1(), !0;
	}
	function Y$1() {
		F$1(), c$1();
		let f$1 = !0, m$3 = !1;
		for (; e.getToken() !== 4 && e.getToken() !== 17;) {
			if (e.getToken() === 5) {
				if (m$3 || t$1(4, [], []), v$3(","), c$1(), e.getToken() === 4 && s) break;
			} else m$3 && t$1(6, [], []);
			f$1 ? (u$1.push(0), f$1 = !1) : u$1[u$1.length - 1]++, E$1() || t$1(4, [], [4, 5]), m$3 = !0;
		}
		return a$1(), f$1 || u$1.pop(), e.getToken() !== 4 ? t$1(8, [4], []) : c$1(), !0;
	}
	function E$1() {
		switch (e.getToken()) {
			case 3: return Y$1();
			case 1: return X();
			case 10: return D$1(!0);
			default: return G$1();
		}
	}
	return c$1(), e.getToken() === 17 ? g$2.allowEmptyContent ? !0 : (t$1(4, [], []), !1) : E$1() ? (e.getToken() !== 17 && t$1(9, [], []), !0) : (t$1(4, [], []), !1);
}
var W$2;
(function(n$2) {
	n$2[n$2.None = 0] = "None", n$2[n$2.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", n$2[n$2.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", n$2[n$2.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", n$2[n$2.InvalidUnicode = 4] = "InvalidUnicode", n$2[n$2.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", n$2[n$2.InvalidCharacter = 6] = "InvalidCharacter";
})(W$2 || (W$2 = {}));
var H$1;
(function(n$2) {
	n$2[n$2.OpenBraceToken = 1] = "OpenBraceToken", n$2[n$2.CloseBraceToken = 2] = "CloseBraceToken", n$2[n$2.OpenBracketToken = 3] = "OpenBracketToken", n$2[n$2.CloseBracketToken = 4] = "CloseBracketToken", n$2[n$2.CommaToken = 5] = "CommaToken", n$2[n$2.ColonToken = 6] = "ColonToken", n$2[n$2.NullKeyword = 7] = "NullKeyword", n$2[n$2.TrueKeyword = 8] = "TrueKeyword", n$2[n$2.FalseKeyword = 9] = "FalseKeyword", n$2[n$2.StringLiteral = 10] = "StringLiteral", n$2[n$2.NumericLiteral = 11] = "NumericLiteral", n$2[n$2.LineCommentTrivia = 12] = "LineCommentTrivia", n$2[n$2.BlockCommentTrivia = 13] = "BlockCommentTrivia", n$2[n$2.LineBreakTrivia = 14] = "LineBreakTrivia", n$2[n$2.Trivia = 15] = "Trivia", n$2[n$2.Unknown = 16] = "Unknown", n$2[n$2.EOF = 17] = "EOF";
})(H$1 || (H$1 = {}));
const K$2 = S$3;
var q$1;
(function(n$2) {
	n$2[n$2.InvalidSymbol = 1] = "InvalidSymbol", n$2[n$2.InvalidNumberFormat = 2] = "InvalidNumberFormat", n$2[n$2.PropertyNameExpected = 3] = "PropertyNameExpected", n$2[n$2.ValueExpected = 4] = "ValueExpected", n$2[n$2.ColonExpected = 5] = "ColonExpected", n$2[n$2.CommaExpected = 6] = "CommaExpected", n$2[n$2.CloseBraceExpected = 7] = "CloseBraceExpected", n$2[n$2.CloseBracketExpected = 8] = "CloseBracketExpected", n$2[n$2.EndOfFileExpected = 9] = "EndOfFileExpected", n$2[n$2.InvalidCommentToken = 10] = "InvalidCommentToken", n$2[n$2.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", n$2[n$2.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", n$2[n$2.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", n$2[n$2.InvalidUnicode = 14] = "InvalidUnicode", n$2[n$2.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", n$2[n$2.InvalidCharacter = 16] = "InvalidCharacter";
})(q$1 || (q$1 = {}));
function x$3(n$2, l$1) {
	const g$2 = JSON.parse(n$2, l$1?.reviver);
	return N$4(n$2, g$2, l$1), g$2;
}
function h$2(n$2, l$1) {
	const g$2 = K$2(n$2, l$1?.errors, l$1);
	return N$4(n$2, g$2, l$1), g$2;
}

//#endregion
//#region node_modules/.pnpm/confbox@0.2.2/node_modules/confbox/dist/ini.mjs
var O$1, x$2;
function j() {
	if (x$2) return O$1;
	x$2 = 1;
	const { hasOwnProperty: y$1 } = Object.prototype, d$2 = (e, t$1 = {}) => {
		typeof t$1 == "string" && (t$1 = { section: t$1 }), t$1.align = t$1.align === !0, t$1.newline = t$1.newline === !0, t$1.sort = t$1.sort === !0, t$1.whitespace = t$1.whitespace === !0 || t$1.align === !0, t$1.platform = t$1.platform || typeof process < "u" && process.platform, t$1.bracketedArray = t$1.bracketedArray !== !1;
		const s = t$1.platform === "win32" ? `\r
` : `
`, r$3 = t$1.whitespace ? " = " : "=", c$1 = [], o$1 = t$1.sort ? Object.keys(e).sort() : Object.keys(e);
		let g$2 = 0;
		t$1.align && (g$2 = h$4(o$1.filter((n$2) => e[n$2] === null || Array.isArray(e[n$2]) || typeof e[n$2] != "object").map((n$2) => Array.isArray(e[n$2]) ? `${n$2}[]` : n$2).concat([""]).reduce((n$2, i$2) => h$4(n$2).length >= h$4(i$2).length ? n$2 : i$2)).length);
		let l$1 = "";
		const m$3 = t$1.bracketedArray ? "[]" : "";
		for (const n$2 of o$1) {
			const i$2 = e[n$2];
			if (i$2 && Array.isArray(i$2)) for (const f$1 of i$2) l$1 += h$4(`${n$2}${m$3}`).padEnd(g$2, " ") + r$3 + h$4(f$1) + s;
			else i$2 && typeof i$2 == "object" ? c$1.push(n$2) : l$1 += h$4(n$2).padEnd(g$2, " ") + r$3 + h$4(i$2) + s;
		}
		t$1.section && l$1.length && (l$1 = "[" + h$4(t$1.section) + "]" + (t$1.newline ? s + s : s) + l$1);
		for (const n$2 of c$1) {
			const i$2 = k$2(n$2, ".").join("\\."), f$1 = (t$1.section ? t$1.section + "." : "") + i$2, u$1 = d$2(e[n$2], {
				...t$1,
				section: f$1
			});
			l$1.length && u$1.length && (l$1 += s), l$1 += u$1;
		}
		return l$1;
	};
	function k$2(e, t$1) {
		var s = 0, r$3 = 0, c$1 = 0, o$1 = [];
		do
			if (c$1 = e.indexOf(t$1, s), c$1 !== -1) {
				if (s = c$1 + t$1.length, c$1 > 0 && e[c$1 - 1] === "\\") continue;
				o$1.push(e.slice(r$3, c$1)), r$3 = c$1 + t$1.length;
			}
		while (c$1 !== -1);
		return o$1.push(e.slice(r$3)), o$1;
	}
	const w$1 = (e, t$1 = {}) => {
		t$1.bracketedArray = t$1.bracketedArray !== !1;
		const s = Object.create(null);
		let r$3 = s, c$1 = null;
		const o$1 = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, g$2 = e.split(/[\r\n]+/g), l$1 = {};
		for (const n$2 of g$2) {
			if (!n$2 || n$2.match(/^\s*[;#]/) || n$2.match(/^\s*$/)) continue;
			const i$2 = n$2.match(o$1);
			if (!i$2) continue;
			if (i$2[1] !== void 0) {
				if (c$1 = A$1(i$2[1]), c$1 === "__proto__") {
					r$3 = Object.create(null);
					continue;
				}
				r$3 = s[c$1] = s[c$1] || Object.create(null);
				continue;
			}
			const f$1 = A$1(i$2[2]);
			let u$1;
			t$1.bracketedArray ? u$1 = f$1.length > 2 && f$1.slice(-2) === "[]" : (l$1[f$1] = (l$1?.[f$1] || 0) + 1, u$1 = l$1[f$1] > 1);
			const a$1 = u$1 && f$1.endsWith("[]") ? f$1.slice(0, -2) : f$1;
			if (a$1 === "__proto__") continue;
			const p$1 = i$2[3] ? A$1(i$2[4]) : !0, b$2 = p$1 === "true" || p$1 === "false" || p$1 === "null" ? JSON.parse(p$1) : p$1;
			u$1 && (y$1.call(r$3, a$1) ? Array.isArray(r$3[a$1]) || (r$3[a$1] = [r$3[a$1]]) : r$3[a$1] = []), Array.isArray(r$3[a$1]) ? r$3[a$1].push(b$2) : r$3[a$1] = b$2;
		}
		const m$3 = [];
		for (const n$2 of Object.keys(s)) {
			if (!y$1.call(s, n$2) || typeof s[n$2] != "object" || Array.isArray(s[n$2])) continue;
			const i$2 = k$2(n$2, ".");
			r$3 = s;
			const f$1 = i$2.pop(), u$1 = f$1.replace(/\\\./g, ".");
			for (const a$1 of i$2) a$1 !== "__proto__" && ((!y$1.call(r$3, a$1) || typeof r$3[a$1] != "object") && (r$3[a$1] = Object.create(null)), r$3 = r$3[a$1]);
			r$3 === s && u$1 === f$1 || (r$3[u$1] = s[n$2], m$3.push(n$2));
		}
		for (const n$2 of m$3) delete s[n$2];
		return s;
	}, _$2 = (e) => e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'"), h$4 = (e) => typeof e != "string" || e.match(/[=\r\n]/) || e.match(/^\[/) || e.length > 1 && _$2(e) || e !== e.trim() ? JSON.stringify(e) : e.split(";").join("\\;").split("#").join("\\#"), A$1 = (e) => {
		if (e = (e || "").trim(), _$2(e)) {
			e.charAt(0) === "'" && (e = e.slice(1, -1));
			try {
				e = JSON.parse(e);
			} catch {}
		} else {
			let t$1 = !1, s = "";
			for (let r$3 = 0, c$1 = e.length; r$3 < c$1; r$3++) {
				const o$1 = e.charAt(r$3);
				if (t$1) "\\;#".indexOf(o$1) !== -1 ? s += o$1 : s += "\\" + o$1, t$1 = !1;
				else {
					if (";#".indexOf(o$1) !== -1) break;
					o$1 === "\\" ? t$1 = !0 : s += o$1;
				}
			}
			return t$1 && (s += "\\"), s.trim();
		}
		return e;
	};
	return O$1 = {
		parse: w$1,
		decode: w$1,
		stringify: d$2,
		encode: d$2,
		safe: h$4,
		unsafe: A$1
	}, O$1;
}
var I$1 = j();
function S$2(y$1, d$2) {
	return I$1.parse(y$1, d$2);
}

//#endregion
//#region node_modules/.pnpm/pkg-types@2.3.0/node_modules/pkg-types/dist/index.mjs
var dist_exports$1 = /* @__PURE__ */ __exportAll({
	findFile: () => findFile$1,
	findNearestFile: () => findNearestFile$1,
	findWorkspaceDir: () => findWorkspaceDir,
	parseGitConfig: () => parseGitConfig,
	readGitConfig: () => readGitConfig,
	readPackageJSON: () => readPackageJSON$1,
	resolveGitConfig: () => resolveGitConfig,
	resolvePackageJSON: () => resolvePackageJSON$1
});
const defaultFindOptions$1 = {
	startingFrom: ".",
	rootPattern: /^node_modules$/,
	reverse: false,
	test: (filePath) => {
		try {
			if (statSync(filePath).isFile()) return true;
		} catch {}
	}
};
async function findFile$1(filename, _options = {}) {
	const filenames = Array.isArray(filename) ? filename : [filename];
	const options = {
		...defaultFindOptions$1,
		..._options
	};
	const basePath = resolve$3(options.startingFrom);
	const leadingSlash = basePath[0] === "/";
	const segments = basePath.split("/").filter(Boolean);
	if (filenames.includes(segments.at(-1)) && await options.test(basePath)) return basePath;
	if (leadingSlash) segments[0] = "/" + segments[0];
	let root = segments.findIndex((r$3) => r$3.match(options.rootPattern));
	if (root === -1) root = 0;
	if (options.reverse) for (let index = root + 1; index <= segments.length; index++) for (const filename2 of filenames) {
		const filePath = join$2(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	else for (let index = segments.length; index > root; index--) for (const filename2 of filenames) {
		const filePath = join$2(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	throw new Error(`Cannot find matching ${filename} in ${options.startingFrom} or parent directories`);
}
function findNearestFile$1(filename, options = {}) {
	return findFile$1(filename, options);
}
function _resolvePath(id, opts = {}) {
	if (id instanceof URL || id.startsWith("file://")) return normalize$2(fileURLToPath(id));
	if (isAbsolute$2(id)) return normalize$2(id);
	return resolveModulePath(id, {
		...opts,
		from: opts.from || opts.parent || opts.url
	});
}
const lockFiles = [
	"yarn.lock",
	"package-lock.json",
	"pnpm-lock.yaml",
	"npm-shrinkwrap.json",
	"bun.lockb",
	"bun.lock",
	"deno.lock"
];
const packageFiles = [
	"package.json",
	"package.json5",
	"package.yaml"
];
const workspaceFiles = [
	"pnpm-workspace.yaml",
	"lerna.json",
	"turbo.json",
	"rush.json",
	"deno.json",
	"deno.jsonc"
];
const FileCache$1 = /* @__PURE__ */ new Map();
async function readPackageJSON$1(id, options = {}) {
	const resolvedPath = await resolvePackageJSON$1(id, options);
	const cache$2 = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache$1;
	if (options.cache && cache$2.has(resolvedPath)) return cache$2.get(resolvedPath);
	const blob = await promises.readFile(resolvedPath, "utf8");
	let parsed;
	try {
		parsed = x$3(blob);
	} catch {
		parsed = h$2(blob);
	}
	cache$2.set(resolvedPath, parsed);
	return parsed;
}
async function resolvePackageJSON$1(id = process.cwd(), options = {}) {
	return findNearestFile$1("package.json", {
		...options,
		startingFrom: _resolvePath(id, options)
	});
}
const workspaceTests = {
	workspaceFile: (opts) => findFile$1(workspaceFiles, opts).then((r$3) => dirname$2(r$3)),
	gitConfig: (opts) => findFile$1(".git/config", opts).then((r$3) => resolve$3(r$3, "../..")),
	lockFile: (opts) => findFile$1(lockFiles, opts).then((r$3) => dirname$2(r$3)),
	packageJson: (opts) => findFile$1(packageFiles, opts).then((r$3) => dirname$2(r$3))
};
async function findWorkspaceDir(id = process.cwd(), options = {}) {
	const startingFrom = _resolvePath(id, options);
	const tests = options.tests || [
		"workspaceFile",
		"gitConfig",
		"lockFile",
		"packageJson"
	];
	for (const testName of tests) {
		const test = workspaceTests[testName];
		if (options[testName] === false || !test) continue;
		const direction = options[testName] || (testName === "gitConfig" ? "closest" : "furthest");
		const detected = await test({
			...options,
			startingFrom,
			reverse: direction === "furthest"
		}).catch(() => {});
		if (detected) return detected;
	}
	throw new Error(`Cannot detect workspace root from ${id}`);
}
async function resolveGitConfig(dir, opts) {
	return findNearestFile$1(".git/config", {
		...opts,
		startingFrom: dir
	});
}
async function readGitConfig(dir, opts) {
	return parseGitConfig(await readFile(await resolveGitConfig(dir, opts), "utf8"));
}
function parseGitConfig(ini) {
	return S$2(ini.replaceAll(/^\[(\w+) "(.+)"\]$/gm, "[$1.$2]"));
}

//#endregion
//#region node_modules/.pnpm/std-env@3.10.0/node_modules/std-env/dist/index.mjs
const r$1 = Object.create(null), i$1 = (e) => globalThis.process?.env || import.meta.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e ? r$1 : globalThis), o = new Proxy(r$1, {
	get(e, s) {
		return i$1()[s] ?? r$1[s];
	},
	has(e, s) {
		return s in i$1() || s in r$1;
	},
	set(e, s, E$1) {
		const B = i$1(!0);
		return B[s] = E$1, !0;
	},
	deleteProperty(e, s) {
		if (!s) return !1;
		const E$1 = i$1(!0);
		return delete E$1[s], !0;
	},
	ownKeys() {
		const e = i$1(!0);
		return Object.keys(e);
	}
}), t = typeof process < "u" && process.env && process.env.NODE_ENV || "", f = [
	["APPVEYOR"],
	[
		"AWS_AMPLIFY",
		"AWS_APP_ID",
		{ ci: !0 }
	],
	["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],
	["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],
	["APPCIRCLE", "AC_APPCIRCLE"],
	["BAMBOO", "bamboo_planKey"],
	["BITBUCKET", "BITBUCKET_COMMIT"],
	["BITRISE", "BITRISE_IO"],
	["BUDDY", "BUDDY_WORKSPACE_ID"],
	["BUILDKITE"],
	["CIRCLE", "CIRCLECI"],
	["CIRRUS", "CIRRUS_CI"],
	[
		"CLOUDFLARE_PAGES",
		"CF_PAGES",
		{ ci: !0 }
	],
	[
		"CLOUDFLARE_WORKERS",
		"WORKERS_CI",
		{ ci: !0 }
	],
	["CODEBUILD", "CODEBUILD_BUILD_ARN"],
	["CODEFRESH", "CF_BUILD_ID"],
	["DRONE"],
	["DRONE", "DRONE_BUILD_EVENT"],
	["DSARI"],
	["GITHUB_ACTIONS"],
	["GITLAB", "GITLAB_CI"],
	["GITLAB", "CI_MERGE_REQUEST_ID"],
	["GOCD", "GO_PIPELINE_LABEL"],
	["LAYERCI"],
	["HUDSON", "HUDSON_URL"],
	["JENKINS", "JENKINS_URL"],
	["MAGNUM"],
	["NETLIFY"],
	[
		"NETLIFY",
		"NETLIFY_LOCAL",
		{ ci: !1 }
	],
	["NEVERCODE"],
	["RENDER"],
	["SAIL", "SAILCI"],
	["SEMAPHORE"],
	["SCREWDRIVER"],
	["SHIPPABLE"],
	["SOLANO", "TDDIUM"],
	["STRIDER"],
	["TEAMCITY", "TEAMCITY_VERSION"],
	["TRAVIS"],
	["VERCEL", "NOW_BUILDER"],
	[
		"VERCEL",
		"VERCEL",
		{ ci: !1 }
	],
	[
		"VERCEL",
		"VERCEL_ENV",
		{ ci: !1 }
	],
	["APPCENTER", "APPCENTER_BUILD_ID"],
	[
		"CODESANDBOX",
		"CODESANDBOX_SSE",
		{ ci: !1 }
	],
	[
		"CODESANDBOX",
		"CODESANDBOX_HOST",
		{ ci: !1 }
	],
	["STACKBLITZ"],
	["STORMKIT"],
	["CLEAVR"],
	["ZEABUR"],
	[
		"CODESPHERE",
		"CODESPHERE_APP_ID",
		{ ci: !0 }
	],
	["RAILWAY", "RAILWAY_PROJECT_ID"],
	["RAILWAY", "RAILWAY_SERVICE_ID"],
	["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"],
	[
		"FIREBASE_APP_HOSTING",
		"FIREBASE_APP_HOSTING",
		{ ci: !0 }
	]
];
function b() {
	if (globalThis.process?.env) for (const e of f) {
		const s = e[1] || e[0];
		if (globalThis.process?.env[s]) return {
			name: e[0].toLowerCase(),
			...e[2]
		};
	}
	return globalThis.process?.env?.SHELL === "/bin/jsh" && globalThis.process?.versions?.webcontainer ? {
		name: "stackblitz",
		ci: !1
	} : {
		name: "",
		ci: !1
	};
}
const l = b(), p = l.name;
function n$1(e) {
	return e ? e !== "false" : !1;
}
const I = globalThis.process?.platform || "", T = n$1(o.CI) || l.ci !== !1, R = n$1(globalThis.process?.stdout && globalThis.process?.stdout.isTTY), U$1 = typeof window < "u", d = n$1(o.DEBUG), a = t === "test" || n$1(o.TEST), g = t === "production", h$1 = t === "dev" || t === "development", v$1 = n$1(o.MINIMAL) || T || a || !R, A = /^win/i.test(I), M = /^linux/i.test(I), m$1 = /^darwin/i.test(I), Y = !n$1(o.NO_COLOR) && (n$1(o.FORCE_COLOR) || (R || A) && o.TERM !== "dumb" || T), C = (globalThis.process?.versions?.node || "").replace(/^v/, "") || null, V = Number(C?.split(".")[0]) || null, W$1 = globalThis.process || Object.create(null), _ = { versions: {} }, y = new Proxy(W$1, { get(e, s) {
	if (s === "env") return o;
	if (s in e) return e[s];
	if (s in _) return _[s];
} }), O = globalThis.process?.release?.name === "node", c = !!globalThis.Bun || !!globalThis.process?.versions?.bun, D = !!globalThis.Deno, L$1 = !!globalThis.fastly, S$1 = !!globalThis.Netlify, u = !!globalThis.EdgeRuntime, N$2 = globalThis.navigator?.userAgent === "Cloudflare-Workers", F = [
	[S$1, "netlify"],
	[u, "edge-light"],
	[N$2, "workerd"],
	[L$1, "fastly"],
	[D, "deno"],
	[c, "bun"],
	[O, "node"]
];
function G() {
	const e = F.find((s) => s[0]);
	if (e) return { name: e[1] };
}
const P$1 = G(), K$1 = P$1?.name || "";

//#endregion
//#region node_modules/.pnpm/dot-prop@10.1.0/node_modules/dot-prop/index.js
const isObject$2 = (value) => {
	const type$1 = typeof value;
	return value !== null && (type$1 === "object" || type$1 === "function");
};
const disallowedKeys = new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const MAX_ARRAY_INDEX = 1e6;
const isDigit = (character) => character >= "0" && character <= "9";
function shouldCoerceToNumber(segment) {
	if (segment === "0") return true;
	if (/^[1-9]\d*$/.test(segment)) {
		const parsedNumber = Number.parseInt(segment, 10);
		return parsedNumber <= Number.MAX_SAFE_INTEGER && parsedNumber <= MAX_ARRAY_INDEX;
	}
	return false;
}
function processSegment(segment, parts) {
	if (disallowedKeys.has(segment)) return false;
	if (segment && shouldCoerceToNumber(segment)) parts.push(Number.parseInt(segment, 10));
	else parts.push(segment);
	return true;
}
function parsePath(path$2) {
	if (typeof path$2 !== "string") throw new TypeError(`Expected a string, got ${typeof path$2}`);
	const parts = [];
	let currentSegment = "";
	let currentPart = "start";
	let isEscaping = false;
	let position = 0;
	for (const character of path$2) {
		position++;
		if (isEscaping) {
			currentSegment += character;
			isEscaping = false;
			continue;
		}
		if (character === "\\") {
			if (currentPart === "index") throw new Error(`Invalid character '${character}' in an index at position ${position}`);
			if (currentPart === "indexEnd") throw new Error(`Invalid character '${character}' after an index at position ${position}`);
			isEscaping = true;
			currentPart = currentPart === "start" ? "property" : currentPart;
			continue;
		}
		switch (character) {
			case ".":
				if (currentPart === "index") throw new Error(`Invalid character '${character}' in an index at position ${position}`);
				if (currentPart === "indexEnd") {
					currentPart = "property";
					break;
				}
				if (!processSegment(currentSegment, parts)) return [];
				currentSegment = "";
				currentPart = "property";
				break;
			case "[":
				if (currentPart === "index") throw new Error(`Invalid character '${character}' in an index at position ${position}`);
				if (currentPart === "indexEnd") {
					currentPart = "index";
					break;
				}
				if (currentPart === "property" || currentPart === "start") {
					if ((currentSegment || currentPart === "property") && !processSegment(currentSegment, parts)) return [];
					currentSegment = "";
				}
				currentPart = "index";
				break;
			case "]":
				if (currentPart === "index") {
					if (currentSegment === "") {
						currentSegment = (parts.pop() || "") + "[]";
						currentPart = "property";
					} else {
						const parsedNumber = Number.parseInt(currentSegment, 10);
						if (!Number.isNaN(parsedNumber) && Number.isFinite(parsedNumber) && parsedNumber >= 0 && parsedNumber <= Number.MAX_SAFE_INTEGER && parsedNumber <= MAX_ARRAY_INDEX && currentSegment === String(parsedNumber)) parts.push(parsedNumber);
						else parts.push(currentSegment);
						currentSegment = "";
						currentPart = "indexEnd";
					}
					break;
				}
				if (currentPart === "indexEnd") throw new Error(`Invalid character '${character}' after an index at position ${position}`);
				currentSegment += character;
				break;
			default:
				if (currentPart === "index" && !isDigit(character)) throw new Error(`Invalid character '${character}' in an index at position ${position}`);
				if (currentPart === "indexEnd") throw new Error(`Invalid character '${character}' after an index at position ${position}`);
				if (currentPart === "start") currentPart = "property";
				currentSegment += character;
		}
	}
	if (isEscaping) currentSegment += "\\";
	switch (currentPart) {
		case "property":
			if (!processSegment(currentSegment, parts)) return [];
			break;
		case "index": throw new Error("Index was not closed");
		case "start":
			parts.push("");
			break;
	}
	return parts;
}
function normalizePath$3(path$2) {
	if (typeof path$2 === "string") return parsePath(path$2);
	if (Array.isArray(path$2)) {
		const normalized = [];
		for (const [index, segment] of path$2.entries()) {
			if (typeof segment !== "string" && typeof segment !== "number") throw new TypeError(`Expected a string or number for path segment at index ${index}, got ${typeof segment}`);
			if (typeof segment === "number" && !Number.isFinite(segment)) throw new TypeError(`Path segment at index ${index} must be a finite number, got ${segment}`);
			if (disallowedKeys.has(segment)) return [];
			if (typeof segment === "string" && shouldCoerceToNumber(segment)) normalized.push(Number.parseInt(segment, 10));
			else normalized.push(segment);
		}
		return normalized;
	}
	return [];
}
function getProperty(object, path$2, value) {
	if (!isObject$2(object) || typeof path$2 !== "string" && !Array.isArray(path$2)) return value === void 0 ? object : value;
	const pathArray = normalizePath$3(path$2);
	if (pathArray.length === 0) return value;
	for (let index = 0; index < pathArray.length; index++) {
		const key = pathArray[index];
		object = object[key];
		if (object === void 0 || object === null) {
			if (index !== pathArray.length - 1) return value;
			break;
		}
	}
	return object === void 0 ? value : object;
}

//#endregion
//#region src/utils/fs.ts
function prettyPath(p$1, highlight = true) {
	p$1 = relative$2(process.cwd(), p$1);
	return highlight ? colors.cyan(p$1) : p$1;
}
function resolveNitroPath(path$2, nitroOptions, base) {
	if (typeof path$2 !== "string") throw new TypeError("Invalid path: " + path$2);
	path$2 = _compilePathTemplate(path$2)(nitroOptions);
	for (const base$1 in nitroOptions.alias) if (path$2.startsWith(base$1)) path$2 = nitroOptions.alias[base$1] + path$2.slice(base$1.length);
	if (/^[#\u0000]/.test(path$2)) return path$2;
	return resolve$3(base || nitroOptions.rootDir, path$2);
}
function _compilePathTemplate(contents) {
	return (params) => contents.replace(/{{ ?([\w.]+) ?}}/g, (_$2, match) => {
		const val = getProperty(params, match);
		if (!val) consola$1.warn(`cannot resolve template param '${match}' in ${contents.slice(0, 20)}`);
		return val || `${match}`;
	});
}
async function writeFile$1(file, contents, log$1 = false) {
	await mkdir(dirname$2(file), { recursive: true });
	await writeFile(file, contents, typeof contents === "string" ? "utf8" : void 0);
	if (log$1) consola$1.info("Generated", prettyPath(file));
}
async function isDirectory(path$2) {
	try {
		return (await stat$1(path$2)).isDirectory();
	} catch {
		return false;
	}
}

//#endregion
//#region node_modules/.pnpm/fdir@6.5.0_picomatch@4.0.3/node_modules/fdir/dist/index.mjs
var __require = /* @__PURE__ */ createRequire$1(import.meta.url);
function cleanPath(path$2) {
	let normalized = normalize(path$2);
	if (normalized.length > 1 && normalized[normalized.length - 1] === sep) normalized = normalized.substring(0, normalized.length - 1);
	return normalized;
}
const SLASHES_REGEX = /[\\/]/g;
function convertSlashes(path$2, separator) {
	return path$2.replace(SLASHES_REGEX, separator);
}
const WINDOWS_ROOT_DIR_REGEX = /^[a-z]:[\\/]$/i;
function isRootDirectory(path$2) {
	return path$2 === "/" || WINDOWS_ROOT_DIR_REGEX.test(path$2);
}
function normalizePath$2(path$2, options) {
	const { resolvePaths, normalizePath: normalizePath$1$1, pathSeparator } = options;
	const pathNeedsCleaning = process.platform === "win32" && path$2.includes("/") || path$2.startsWith(".");
	if (resolvePaths) path$2 = resolve(path$2);
	if (normalizePath$1$1 || pathNeedsCleaning) path$2 = cleanPath(path$2);
	if (path$2 === ".") return "";
	return convertSlashes(path$2[path$2.length - 1] !== pathSeparator ? path$2 + pathSeparator : path$2, pathSeparator);
}
function joinPathWithBasePath(filename, directoryPath) {
	return directoryPath + filename;
}
function joinPathWithRelativePath(root, options) {
	return function(filename, directoryPath) {
		if (directoryPath.startsWith(root)) return directoryPath.slice(root.length) + filename;
		else return convertSlashes(relative(root, directoryPath), options.pathSeparator) + options.pathSeparator + filename;
	};
}
function joinPath$1(filename) {
	return filename;
}
function joinDirectoryPath(filename, directoryPath, separator) {
	return directoryPath + filename + separator;
}
function build$7(root, options) {
	const { relativePaths, includeBasePath } = options;
	return relativePaths && root ? joinPathWithRelativePath(root, options) : includeBasePath ? joinPathWithBasePath : joinPath$1;
}
function pushDirectoryWithRelativePath(root) {
	return function(directoryPath, paths) {
		paths.push(directoryPath.substring(root.length) || ".");
	};
}
function pushDirectoryFilterWithRelativePath(root) {
	return function(directoryPath, paths, filters) {
		const relativePath = directoryPath.substring(root.length) || ".";
		if (filters.every((filter) => filter(relativePath, true))) paths.push(relativePath);
	};
}
const pushDirectory = (directoryPath, paths) => {
	paths.push(directoryPath || ".");
};
const pushDirectoryFilter = (directoryPath, paths, filters) => {
	const path$2 = directoryPath || ".";
	if (filters.every((filter) => filter(path$2, true))) paths.push(path$2);
};
const empty$2 = () => {};
function build$6(root, options) {
	const { includeDirs, filters, relativePaths } = options;
	if (!includeDirs) return empty$2;
	if (relativePaths) return filters && filters.length ? pushDirectoryFilterWithRelativePath(root) : pushDirectoryWithRelativePath(root);
	return filters && filters.length ? pushDirectoryFilter : pushDirectory;
}
const pushFileFilterAndCount = (filename, _paths, counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) counts.files++;
};
const pushFileFilter = (filename, paths, _counts, filters) => {
	if (filters.every((filter) => filter(filename, false))) paths.push(filename);
};
const pushFileCount = (_filename, _paths, counts, _filters) => {
	counts.files++;
};
const pushFile = (filename, paths) => {
	paths.push(filename);
};
const empty$1$1 = () => {};
function build$5(options) {
	const { excludeFiles, filters, onlyCounts } = options;
	if (excludeFiles) return empty$1$1;
	if (filters && filters.length) return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
	else if (onlyCounts) return pushFileCount;
	else return pushFile;
}
const getArray = (paths) => {
	return paths;
};
const getArrayGroup = () => {
	return [""].slice(0, 0);
};
function build$4(options) {
	return options.group ? getArrayGroup : getArray;
}
const groupFiles = (groups, directory, files) => {
	groups.push({
		directory,
		files,
		dir: directory
	});
};
const empty$3 = () => {};
function build$3(options) {
	return options.group ? groupFiles : empty$3;
}
const resolveSymlinksAsync = function(path$2, state, callback$1) {
	const { queue, fs: fs$1, options: { suppressErrors } } = state;
	queue.enqueue();
	fs$1.realpath(path$2, (error, resolvedPath) => {
		if (error) return queue.dequeue(suppressErrors ? null : error, state);
		fs$1.stat(resolvedPath, (error$1, stat$2) => {
			if (error$1) return queue.dequeue(suppressErrors ? null : error$1, state);
			if (stat$2.isDirectory() && isRecursive(path$2, resolvedPath, state)) return queue.dequeue(null, state);
			callback$1(stat$2, resolvedPath);
			queue.dequeue(null, state);
		});
	});
};
const resolveSymlinks = function(path$2, state, callback$1) {
	const { queue, fs: fs$1, options: { suppressErrors } } = state;
	queue.enqueue();
	try {
		const resolvedPath = fs$1.realpathSync(path$2);
		const stat$2 = fs$1.statSync(resolvedPath);
		if (stat$2.isDirectory() && isRecursive(path$2, resolvedPath, state)) return;
		callback$1(stat$2, resolvedPath);
	} catch (e) {
		if (!suppressErrors) throw e;
	}
};
function build$2(options, isSynchronous) {
	if (!options.resolveSymlinks || options.excludeSymlinks) return null;
	return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}
function isRecursive(path$2, resolved, state) {
	if (state.options.useRealPaths) return isRecursiveUsingRealPaths(resolved, state);
	let parent = dirname(path$2);
	let depth = 1;
	while (parent !== state.root && depth < 2) {
		const resolvedPath = state.symlinks.get(parent);
		if (!!resolvedPath && (resolvedPath === resolved || resolvedPath.startsWith(resolved) || resolved.startsWith(resolvedPath))) depth++;
		else parent = dirname(parent);
	}
	state.symlinks.set(path$2, resolved);
	return depth > 1;
}
function isRecursiveUsingRealPaths(resolved, state) {
	return state.visited.includes(resolved + state.options.pathSeparator);
}
const onlyCountsSync = (state) => {
	return state.counts;
};
const groupsSync = (state) => {
	return state.groups;
};
const defaultSync = (state) => {
	return state.paths;
};
const limitFilesSync = (state) => {
	return state.paths.slice(0, state.options.maxFiles);
};
const onlyCountsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.counts, state.options.suppressErrors);
	return null;
};
const defaultAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths, state.options.suppressErrors);
	return null;
};
const limitFilesAsync = (state, error, callback$1) => {
	report(error, callback$1, state.paths.slice(0, state.options.maxFiles), state.options.suppressErrors);
	return null;
};
const groupsAsync = (state, error, callback$1) => {
	report(error, callback$1, state.groups, state.options.suppressErrors);
	return null;
};
function report(error, callback$1, output, suppressErrors) {
	if (error && !suppressErrors) callback$1(error, output);
	else callback$1(null, output);
}
function build$1(options, isSynchronous) {
	const { onlyCounts, group, maxFiles } = options;
	if (onlyCounts) return isSynchronous ? onlyCountsSync : onlyCountsAsync;
	else if (group) return isSynchronous ? groupsSync : groupsAsync;
	else if (maxFiles) return isSynchronous ? limitFilesSync : limitFilesAsync;
	else return isSynchronous ? defaultSync : defaultAsync;
}
const readdirOpts = { withFileTypes: true };
const walkAsync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	state.queue.enqueue();
	if (currentDepth < 0) return state.queue.dequeue(null, state);
	const { fs: fs$1 } = state;
	state.visited.push(crawlPath);
	state.counts.directories++;
	fs$1.readdir(crawlPath || ".", readdirOpts, (error, entries = []) => {
		callback$1(entries, directoryPath, currentDepth);
		state.queue.dequeue(state.options.suppressErrors ? null : error, state);
	});
};
const walkSync = (state, crawlPath, directoryPath, currentDepth, callback$1) => {
	const { fs: fs$1 } = state;
	if (currentDepth < 0) return;
	state.visited.push(crawlPath);
	state.counts.directories++;
	let entries = [];
	try {
		entries = fs$1.readdirSync(crawlPath || ".", readdirOpts);
	} catch (e) {
		if (!state.options.suppressErrors) throw e;
	}
	callback$1(entries, directoryPath, currentDepth);
};
function build$8(isSynchronous) {
	return isSynchronous ? walkSync : walkAsync;
}
/**
* This is a custom stateless queue to track concurrent async fs calls.
* It increments a counter whenever a call is queued and decrements it
* as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
*/
var Queue = class {
	count = 0;
	constructor(onQueueEmpty) {
		this.onQueueEmpty = onQueueEmpty;
	}
	enqueue() {
		this.count++;
		return this.count;
	}
	dequeue(error, output) {
		if (this.onQueueEmpty && (--this.count <= 0 || error)) {
			this.onQueueEmpty(error, output);
			if (error) {
				output.controller.abort();
				this.onQueueEmpty = void 0;
			}
		}
	}
};
var Counter = class {
	_files = 0;
	_directories = 0;
	set files(num) {
		this._files = num;
	}
	get files() {
		return this._files;
	}
	set directories(num) {
		this._directories = num;
	}
	get directories() {
		return this._directories;
	}
	/**
	* @deprecated use `directories` instead
	*/
	/* c8 ignore next 3 */
	get dirs() {
		return this._directories;
	}
};
/**
* AbortController is not supported on Node 14 so we use this until we can drop
* support for Node 14.
*/
var Aborter = class {
	aborted = false;
	abort() {
		this.aborted = true;
	}
};
var Walker = class {
	root;
	isSynchronous;
	state;
	joinPath;
	pushDirectory;
	pushFile;
	getArray;
	groupFiles;
	resolveSymlink;
	walkDirectory;
	callbackInvoker;
	constructor(root, options, callback$1) {
		this.isSynchronous = !callback$1;
		this.callbackInvoker = build$1(options, this.isSynchronous);
		this.root = normalizePath$2(root, options);
		this.state = {
			root: isRootDirectory(this.root) ? this.root : this.root.slice(0, -1),
			paths: [""].slice(0, 0),
			groups: [],
			counts: new Counter(),
			options,
			queue: new Queue((error, state) => this.callbackInvoker(state, error, callback$1)),
			symlinks: /* @__PURE__ */ new Map(),
			visited: [""].slice(0, 0),
			controller: new Aborter(),
			fs: options.fs || nativeFs$1
		};
		this.joinPath = build$7(this.root, options);
		this.pushDirectory = build$6(this.root, options);
		this.pushFile = build$5(options);
		this.getArray = build$4(options);
		this.groupFiles = build$3(options);
		this.resolveSymlink = build$2(options, this.isSynchronous);
		this.walkDirectory = build$8(this.isSynchronous);
	}
	start() {
		this.pushDirectory(this.root, this.state.paths, this.state.options.filters);
		this.walkDirectory(this.state, this.root, this.root, this.state.options.maxDepth, this.walk);
		return this.isSynchronous ? this.callbackInvoker(this.state, null) : null;
	}
	walk = (entries, directoryPath, depth) => {
		const { paths, options: { filters, resolveSymlinks: resolveSymlinks$1, excludeSymlinks, exclude, maxFiles, signal, useRealPaths, pathSeparator }, controller } = this.state;
		if (controller.aborted || signal && signal.aborted || maxFiles && paths.length > maxFiles) return;
		const files = this.getArray(this.state.paths);
		for (let i$2 = 0; i$2 < entries.length; ++i$2) {
			const entry = entries[i$2];
			if (entry.isFile() || entry.isSymbolicLink() && !resolveSymlinks$1 && !excludeSymlinks) {
				const filename = this.joinPath(entry.name, directoryPath);
				this.pushFile(filename, files, this.state.counts, filters);
			} else if (entry.isDirectory()) {
				let path$2 = joinDirectoryPath(entry.name, directoryPath, this.state.options.pathSeparator);
				if (exclude && exclude(entry.name, path$2)) continue;
				this.pushDirectory(path$2, paths, filters);
				this.walkDirectory(this.state, path$2, path$2, depth - 1, this.walk);
			} else if (this.resolveSymlink && entry.isSymbolicLink()) {
				let path$2 = joinPathWithBasePath(entry.name, directoryPath);
				this.resolveSymlink(path$2, this.state, (stat$2, resolvedPath) => {
					if (stat$2.isDirectory()) {
						resolvedPath = normalizePath$2(resolvedPath, this.state.options);
						if (exclude && exclude(entry.name, useRealPaths ? resolvedPath : path$2 + pathSeparator)) return;
						this.walkDirectory(this.state, resolvedPath, useRealPaths ? resolvedPath : path$2 + pathSeparator, depth - 1, this.walk);
					} else {
						resolvedPath = useRealPaths ? resolvedPath : path$2;
						const filename = basename(resolvedPath);
						const directoryPath$1 = normalizePath$2(dirname(resolvedPath), this.state.options);
						resolvedPath = this.joinPath(filename, directoryPath$1);
						this.pushFile(resolvedPath, files, this.state.counts, filters);
					}
				});
			}
		}
		this.groupFiles(this.state.groups, directoryPath, files);
	};
};
function promise(root, options) {
	return new Promise((resolve$1$1, reject) => {
		callback(root, options, (err, output) => {
			if (err) return reject(err);
			resolve$1$1(output);
		});
	});
}
function callback(root, options, callback$1) {
	new Walker(root, options, callback$1).start();
}
function sync(root, options) {
	return new Walker(root, options).start();
}
var APIBuilder = class {
	constructor(root, options) {
		this.root = root;
		this.options = options;
	}
	withPromise() {
		return promise(this.root, this.options);
	}
	withCallback(cb) {
		callback(this.root, this.options, cb);
	}
	sync() {
		return sync(this.root, this.options);
	}
};
let pm$2 = null;
/* c8 ignore next 6 */
try {
	__require.resolve("picomatch");
	pm$2 = __require("picomatch");
} catch {}
var Builder = class {
	globCache = {};
	options = {
		maxDepth: Infinity,
		suppressErrors: true,
		pathSeparator: sep,
		filters: []
	};
	globFunction;
	constructor(options) {
		this.options = {
			...this.options,
			...options
		};
		this.globFunction = this.options.globFunction;
	}
	group() {
		this.options.group = true;
		return this;
	}
	withPathSeparator(separator) {
		this.options.pathSeparator = separator;
		return this;
	}
	withBasePath() {
		this.options.includeBasePath = true;
		return this;
	}
	withRelativePaths() {
		this.options.relativePaths = true;
		return this;
	}
	withDirs() {
		this.options.includeDirs = true;
		return this;
	}
	withMaxDepth(depth) {
		this.options.maxDepth = depth;
		return this;
	}
	withMaxFiles(limit) {
		this.options.maxFiles = limit;
		return this;
	}
	withFullPaths() {
		this.options.resolvePaths = true;
		this.options.includeBasePath = true;
		return this;
	}
	withErrors() {
		this.options.suppressErrors = false;
		return this;
	}
	withSymlinks({ resolvePaths = true } = {}) {
		this.options.resolveSymlinks = true;
		this.options.useRealPaths = resolvePaths;
		return this.withFullPaths();
	}
	withAbortSignal(signal) {
		this.options.signal = signal;
		return this;
	}
	normalize() {
		this.options.normalizePath = true;
		return this;
	}
	filter(predicate) {
		this.options.filters.push(predicate);
		return this;
	}
	onlyDirs() {
		this.options.excludeFiles = true;
		this.options.includeDirs = true;
		return this;
	}
	exclude(predicate) {
		this.options.exclude = predicate;
		return this;
	}
	onlyCounts() {
		this.options.onlyCounts = true;
		return this;
	}
	crawl(root) {
		return new APIBuilder(root || ".", this.options);
	}
	withGlobFunction(fn) {
		this.globFunction = fn;
		return this;
	}
	/**
	* @deprecated Pass options using the constructor instead:
	* ```ts
	* new fdir(options).crawl("/path/to/root");
	* ```
	* This method will be removed in v7.0
	*/
	/* c8 ignore next 4 */
	crawlWithOptions(root, options) {
		this.options = {
			...this.options,
			...options
		};
		return new APIBuilder(root || ".", this.options);
	}
	glob(...patterns) {
		if (this.globFunction) return this.globWithOptions(patterns);
		return this.globWithOptions(patterns, ...[{ dot: true }]);
	}
	globWithOptions(patterns, ...options) {
		const globFn = this.globFunction || pm$2;
		/* c8 ignore next 5 */
		if (!globFn) throw new Error("Please specify a glob function to use glob matching.");
		var isMatch = this.globCache[patterns.join("\0")];
		if (!isMatch) {
			isMatch = globFn(patterns, ...options);
			this.globCache[patterns.join("\0")] = isMatch;
		}
		this.options.filters.push((path$2) => isMatch(path$2));
		return this;
	}
};

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const WIN_SLASH = "\\\\/";
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	/**
	* Posix glob regex
	*/
	const DOT_LITERAL = "\\.";
	const PLUS_LITERAL = "\\+";
	const QMARK_LITERAL = "\\?";
	const SLASH_LITERAL = "\\/";
	const ONE_CHAR = "(?=.)";
	const QMARK = "[^/]";
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR,
		SEP: "/"
	};
	/**
	* Windows glob regex
	*/
	const WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
		SEP: "\\"
	};
	/**
	* POSIX Bracket Regex
	*/
	const POSIX_REGEX_SOURCE = {
		alnum: "a-zA-Z0-9",
		alpha: "a-zA-Z",
		ascii: "\\x00-\\x7F",
		blank: " \\t",
		cntrl: "\\x00-\\x1F\\x7F",
		digit: "0-9",
		graph: "\\x21-\\x7E",
		lower: "a-z",
		print: "\\x20-\\x7E ",
		punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
		space: " \\t\\r\\n\\v\\f",
		upper: "A-Z",
		word: "A-Za-z0-9_",
		xdigit: "A-Fa-f0-9"
	};
	module.exports = {
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE,
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		extglobChars(chars$1) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars$1.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		globChars(win32$2) {
			return win32$2 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.isWindows = () => {
		if (typeof navigator !== "undefined" && navigator.platform) {
			const platform = navigator.platform.toLowerCase();
			return platform === "win32" || platform === "windows";
		}
		if (typeof process !== "undefined" && process.platform) return process.platform === "win32";
		return false;
	};
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
	exports.basename = (path$2, { windows } = {}) => {
		const segs = path$2.split(windows ? /[\\/]/ : "/");
		const last = segs[segs.length - 1];
		if (last === "") return segs[segs.length - 2];
		return last;
	};
}));

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const utils = require_utils$1();
	const { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
	const isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	const depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	const scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob$1 = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob$1 = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob$1 = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob$1) glob$1 = utils.removeBackslashes(glob$1);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob: glob$1,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n$2 = prevIndex ? prevIndex + 1 : start;
				const i$2 = slashes[idx];
				const value = input.slice(n$2, i$2);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i$2;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const constants = require_constants();
	const utils = require_utils$1();
	/**
	* Constants
	*/
	const { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	const expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v$3) => utils.escapeRegex(v$3)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	const syntaxError = (type$1, char) => {
		return `Missing ${type$1}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	const parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const PLATFORM_CHARS = constants.globChars(opts.windows);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts$1) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts$1.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n$2 = 1) => input[state.index + n$2];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value$1 = "", num = 0) => {
			state.consumed += value$1;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type$1) => {
			state[type$1]++;
			stack.push(type$1);
		};
		const decrement = (type$1) => {
			state[type$1]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.output = (prev.output || prev.value) + tok.value;
				prev.value += tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type$1, value$1) => {
			const token = {
				...EXTGLOB_CHARS[value$1],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type: type$1,
				value: value$1,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m$3, esc, chars$1, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m$3;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars$1.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars$1.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m$3 : `\\${m$3}`;
			});
			if (backslashes === true) if (opts.unescape === true) output = output.replace(/\\/g, "");
			else output = output.replace(/\\+/g, (m$3) => {
				return m$3.length % 2 === 0 ? "\\\\" : m$3 ? "\\" : "";
			});
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix$1 = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix$1) {
								prev.value = pre + posix$1;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open$1 = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open$1);
				push(open$1);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i$2 = arr.length - 1; i$2 >= 0; i$2--) {
						tokens.pop();
						if (arr[i$2].type === "brace") break;
						if (arr[i$2].type !== "dots") range.unshift(arr[i$2].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t$1 of toks) state.output += t$1.output || t$1.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(opts.windows);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts$1) => {
			if (opts$1.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts$1.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source$1 = create(match[1]);
					if (!source$1) return;
					return source$1 + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const scan = require_scan();
	const parse = require_parse();
	const utils = require_utils$1();
	const constants = require_constants();
	const isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	const picomatch = (glob$1, options, returnState = false) => {
		if (Array.isArray(glob$1)) {
			const fns = glob$1.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state$1 = isMatch(str);
					if (state$1) return state$1;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob$1) && glob$1.tokens && glob$1.input;
		if (glob$1 === "" || typeof glob$1 !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix$1 = opts.windows;
		const regex = isState ? picomatch.compileRe(glob$1, options) : picomatch.makeRe(glob$1, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob: glob$1,
				posix: posix$1
			});
			const result = {
				glob: glob$1,
				state,
				regex,
				posix: posix$1,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob: glob$1, posix: posix$1 } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format$1 = opts.format || (posix$1 ? utils.toPosixSlashes : null);
		let match = input === glob$1;
		let output = match && format$1 ? format$1(input) : input;
		if (match === false) {
			output = format$1 ? format$1(input) : input;
			match = output === glob$1;
		}
		if (match === false || opts.capture === true) if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix$1);
		else match = regex.exec(output);
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob$1, options) => {
		return (glob$1 instanceof RegExp ? glob$1 : picomatch.makeRe(glob$1, options)).test(utils.basename(input));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p$1) => picomatch.parse(p$1, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));

//#endregion
//#region node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/index.js
var require_picomatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const pico = require_picomatch$1();
	const utils = require_utils$1();
	function picomatch(glob$1, options, returnState = false) {
		if (options && (options.windows === null || options.windows === void 0)) options = {
			...options,
			windows: utils.isWindows()
		};
		return pico(glob$1, options, returnState);
	}
	Object.assign(picomatch, pico);
	module.exports = picomatch;
}));

//#endregion
//#region node_modules/.pnpm/tinyglobby@0.2.15/node_modules/tinyglobby/dist/index.mjs
var import_picomatch = /* @__PURE__ */ __toESM$1(require_picomatch(), 1);
const isReadonlyArray = Array.isArray;
const isWin = process.platform === "win32";
const ONLY_PARENT_DIRECTORIES = /^(\/?\.\.)+$/;
function getPartialMatcher(patterns, options = {}) {
	const patternsCount = patterns.length;
	const patternsParts = Array(patternsCount);
	const matchers = Array(patternsCount);
	const globstarEnabled = !options.noglobstar;
	for (let i$2 = 0; i$2 < patternsCount; i$2++) {
		const parts = splitPattern(patterns[i$2]);
		patternsParts[i$2] = parts;
		const partsCount = parts.length;
		const partMatchers = Array(partsCount);
		for (let j$1 = 0; j$1 < partsCount; j$1++) partMatchers[j$1] = (0, import_picomatch.default)(parts[j$1], options);
		matchers[i$2] = partMatchers;
	}
	return (input) => {
		const inputParts = input.split("/");
		if (inputParts[0] === ".." && ONLY_PARENT_DIRECTORIES.test(input)) return true;
		for (let i$2 = 0; i$2 < patterns.length; i$2++) {
			const patternParts = patternsParts[i$2];
			const matcher = matchers[i$2];
			const inputPatternCount = inputParts.length;
			const minParts = Math.min(inputPatternCount, patternParts.length);
			let j$1 = 0;
			while (j$1 < minParts) {
				const part = patternParts[j$1];
				if (part.includes("/")) return true;
				if (!matcher[j$1](inputParts[j$1])) break;
				if (globstarEnabled && part === "**") return true;
				j$1++;
			}
			if (j$1 === inputPatternCount) return true;
		}
		return false;
	};
}
/* node:coverage ignore next 2 */
const WIN32_ROOT_DIR = /^[A-Z]:\/$/i;
const isRoot = isWin ? (p$1) => WIN32_ROOT_DIR.test(p$1) : (p$1) => p$1 === "/";
function buildFormat(cwd$2, root, absolute) {
	if (cwd$2 === root || root.startsWith(`${cwd$2}/`)) {
		if (absolute) {
			const start = isRoot(cwd$2) ? cwd$2.length : cwd$2.length + 1;
			return (p$1, isDir) => p$1.slice(start, isDir ? -1 : void 0) || ".";
		}
		const prefix = root.slice(cwd$2.length + 1);
		if (prefix) return (p$1, isDir) => {
			if (p$1 === ".") return prefix;
			const result = `${prefix}/${p$1}`;
			return isDir ? result.slice(0, -1) : result;
		};
		return (p$1, isDir) => isDir && p$1 !== "." ? p$1.slice(0, -1) : p$1;
	}
	if (absolute) return (p$1) => posix.relative(cwd$2, p$1) || ".";
	return (p$1) => posix.relative(cwd$2, `${root}/${p$1}`) || ".";
}
function buildRelative(cwd$2, root) {
	if (root.startsWith(`${cwd$2}/`)) {
		const prefix = root.slice(cwd$2.length + 1);
		return (p$1) => `${prefix}/${p$1}`;
	}
	return (p$1) => {
		const result = posix.relative(cwd$2, `${root}/${p$1}`);
		if (p$1.endsWith("/") && result !== "") return `${result}/`;
		return result || ".";
	};
}
const splitPatternOptions = { parts: true };
function splitPattern(path$1$1) {
	var _result$parts;
	const result = import_picomatch.default.scan(path$1$1, splitPatternOptions);
	return ((_result$parts = result.parts) === null || _result$parts === void 0 ? void 0 : _result$parts.length) ? result.parts : [path$1$1];
}
const POSIX_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}*?|]|^!|[!+@](?=\()|\\(?![()[\]{}!*+?@|]))/g;
const WIN32_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}]|^!|[!+@](?=\())/g;
const escapePosixPath = (path$1$1) => path$1$1.replace(POSIX_UNESCAPED_GLOB_SYMBOLS, "\\$&");
const escapeWin32Path = (path$1$1) => path$1$1.replace(WIN32_UNESCAPED_GLOB_SYMBOLS, "\\$&");
/**
* Escapes a path's special characters depending on the platform.
* @see {@link https://superchupu.dev/tinyglobby/documentation#escapePath}
*/
/* node:coverage ignore next */
const escapePath = isWin ? escapeWin32Path : escapePosixPath;
/**
* Checks if a pattern has dynamic parts.
*
* Has a few minor differences with [`fast-glob`](https://github.com/mrmlnc/fast-glob) for better accuracy:
*
* - Doesn't necessarily return `false` on patterns that include `\`.
* - Returns `true` if the pattern includes parentheses, regardless of them representing one single pattern or not.
* - Returns `true` for unfinished glob extensions i.e. `(h`, `+(h`.
* - Returns `true` for unfinished brace expansions as long as they include `,` or `..`.
*
* @see {@link https://superchupu.dev/tinyglobby/documentation#isDynamicPattern}
*/
function isDynamicPattern(pattern, options) {
	if ((options === null || options === void 0 ? void 0 : options.caseSensitiveMatch) === false) return true;
	const scan = import_picomatch.default.scan(pattern);
	return scan.isGlob || scan.negated;
}
function log(...tasks$1) {
	console.log(`[tinyglobby ${(/* @__PURE__ */ new Date()).toLocaleTimeString("es")}]`, ...tasks$1);
}
const PARENT_DIRECTORY = /^(\/?\.\.)+/;
const ESCAPING_BACKSLASHES = /\\(?=[()[\]{}!*+?@|])/g;
const BACKSLASHES = /\\/g;
function normalizePattern(pattern, expandDirectories, cwd$2, props, isIgnore) {
	let result = pattern;
	if (pattern.endsWith("/")) result = pattern.slice(0, -1);
	if (!result.endsWith("*") && expandDirectories) result += "/**";
	const escapedCwd = escapePath(cwd$2);
	if (path.isAbsolute(result.replace(ESCAPING_BACKSLASHES, ""))) result = posix.relative(escapedCwd, result);
	else result = posix.normalize(result);
	const parentDirectoryMatch = PARENT_DIRECTORY.exec(result);
	const parts = splitPattern(result);
	if (parentDirectoryMatch === null || parentDirectoryMatch === void 0 ? void 0 : parentDirectoryMatch[0]) {
		const n$2 = (parentDirectoryMatch[0].length + 1) / 3;
		let i$2 = 0;
		const cwdParts = escapedCwd.split("/");
		while (i$2 < n$2 && parts[i$2 + n$2] === cwdParts[cwdParts.length + i$2 - n$2]) {
			result = result.slice(0, (n$2 - i$2 - 1) * 3) + result.slice((n$2 - i$2) * 3 + parts[i$2 + n$2].length + 1) || ".";
			i$2++;
		}
		const potentialRoot = posix.join(cwd$2, parentDirectoryMatch[0].slice(i$2 * 3));
		if (!potentialRoot.startsWith(".") && props.root.length > potentialRoot.length) {
			props.root = potentialRoot;
			props.depthOffset = -n$2 + i$2;
		}
	}
	if (!isIgnore && props.depthOffset >= 0) {
		var _props$commonPath;
		(_props$commonPath = props.commonPath) !== null && _props$commonPath !== void 0 || (props.commonPath = parts);
		const newCommonPath = [];
		const length = Math.min(props.commonPath.length, parts.length);
		for (let i$2 = 0; i$2 < length; i$2++) {
			const part = parts[i$2];
			if (part === "**" && !parts[i$2 + 1]) {
				newCommonPath.pop();
				break;
			}
			if (part !== props.commonPath[i$2] || isDynamicPattern(part) || i$2 === parts.length - 1) break;
			newCommonPath.push(part);
		}
		props.depthOffset = newCommonPath.length;
		props.commonPath = newCommonPath;
		props.root = newCommonPath.length > 0 ? posix.join(cwd$2, ...newCommonPath) : cwd$2;
	}
	return result;
}
function processPatterns({ patterns = ["**/*"], ignore = [], expandDirectories = true }, cwd$2, props) {
	if (typeof patterns === "string") patterns = [patterns];
	if (typeof ignore === "string") ignore = [ignore];
	const matchPatterns = [];
	const ignorePatterns = [];
	for (const pattern of ignore) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") ignorePatterns.push(normalizePattern(pattern, expandDirectories, cwd$2, props, true));
	}
	for (const pattern of patterns) {
		if (!pattern) continue;
		if (pattern[0] !== "!" || pattern[1] === "(") matchPatterns.push(normalizePattern(pattern, expandDirectories, cwd$2, props, false));
		else if (pattern[1] !== "!" || pattern[2] === "(") ignorePatterns.push(normalizePattern(pattern.slice(1), expandDirectories, cwd$2, props, true));
	}
	return {
		match: matchPatterns,
		ignore: ignorePatterns
	};
}
function formatPaths(paths, relative$3) {
	for (let i$2 = paths.length - 1; i$2 >= 0; i$2--) {
		const path$1$1 = paths[i$2];
		paths[i$2] = relative$3(path$1$1);
	}
	return paths;
}
function normalizeCwd(cwd$2) {
	if (!cwd$2) return process.cwd().replace(BACKSLASHES, "/");
	if (cwd$2 instanceof URL) return fileURLToPath$1(cwd$2).replace(BACKSLASHES, "/");
	return path.resolve(cwd$2).replace(BACKSLASHES, "/");
}
function getCrawler(patterns, inputOptions = {}) {
	const options = process.env.TINYGLOBBY_DEBUG ? {
		...inputOptions,
		debug: true
	} : inputOptions;
	const cwd$2 = normalizeCwd(options.cwd);
	if (options.debug) log("globbing with:", {
		patterns,
		options,
		cwd: cwd$2
	});
	if (Array.isArray(patterns) && patterns.length === 0) return [{
		sync: () => [],
		withPromise: async () => []
	}, false];
	const props = {
		root: cwd$2,
		commonPath: null,
		depthOffset: 0
	};
	const processed = processPatterns({
		...options,
		patterns
	}, cwd$2, props);
	if (options.debug) log("internal processing patterns:", processed);
	const matchOptions = {
		dot: options.dot,
		nobrace: options.braceExpansion === false,
		nocase: options.caseSensitiveMatch === false,
		noextglob: options.extglob === false,
		noglobstar: options.globstar === false,
		posix: true
	};
	const matcher = (0, import_picomatch.default)(processed.match, {
		...matchOptions,
		ignore: processed.ignore
	});
	const ignore = (0, import_picomatch.default)(processed.ignore, matchOptions);
	const partialMatcher = getPartialMatcher(processed.match, matchOptions);
	const format$1 = buildFormat(cwd$2, props.root, options.absolute);
	const formatExclude = options.absolute ? format$1 : buildFormat(cwd$2, props.root, true);
	const fdirOptions = {
		filters: [options.debug ? (p$1, isDirectory$1) => {
			const path$1$1 = format$1(p$1, isDirectory$1);
			const matches = matcher(path$1$1);
			if (matches) log(`matched ${path$1$1}`);
			return matches;
		} : (p$1, isDirectory$1) => matcher(format$1(p$1, isDirectory$1))],
		exclude: options.debug ? (_$2, p$1) => {
			const relativePath = formatExclude(p$1, true);
			const skipped = relativePath !== "." && !partialMatcher(relativePath) || ignore(relativePath);
			if (skipped) log(`skipped ${p$1}`);
			else log(`crawling ${p$1}`);
			return skipped;
		} : (_$2, p$1) => {
			const relativePath = formatExclude(p$1, true);
			return relativePath !== "." && !partialMatcher(relativePath) || ignore(relativePath);
		},
		fs: options.fs ? {
			readdir: options.fs.readdir || nativeFs.readdir,
			readdirSync: options.fs.readdirSync || nativeFs.readdirSync,
			realpath: options.fs.realpath || nativeFs.realpath,
			realpathSync: options.fs.realpathSync || nativeFs.realpathSync,
			stat: options.fs.stat || nativeFs.stat,
			statSync: options.fs.statSync || nativeFs.statSync
		} : void 0,
		pathSeparator: "/",
		relativePaths: true,
		resolveSymlinks: true,
		signal: options.signal
	};
	if (options.deep !== void 0) fdirOptions.maxDepth = Math.round(options.deep - props.depthOffset);
	if (options.absolute) {
		fdirOptions.relativePaths = false;
		fdirOptions.resolvePaths = true;
		fdirOptions.includeBasePath = true;
	}
	if (options.followSymbolicLinks === false) {
		fdirOptions.resolveSymlinks = false;
		fdirOptions.excludeSymlinks = true;
	}
	if (options.onlyDirectories) {
		fdirOptions.excludeFiles = true;
		fdirOptions.includeDirs = true;
	} else if (options.onlyFiles === false) fdirOptions.includeDirs = true;
	props.root = props.root.replace(BACKSLASHES, "");
	const root = props.root;
	if (options.debug) log("internal properties:", props);
	const relative$3 = cwd$2 !== root && !options.absolute && buildRelative(cwd$2, props.root);
	return [new Builder(fdirOptions).crawl(root), relative$3];
}
async function glob(patternsOrOptions, options) {
	if (patternsOrOptions && (options === null || options === void 0 ? void 0 : options.patterns)) throw new Error("Cannot pass patterns as both an argument and an option");
	const isModern = isReadonlyArray(patternsOrOptions) || typeof patternsOrOptions === "string";
	const opts = isModern ? options : patternsOrOptions;
	const [crawler, relative$3] = getCrawler(isModern ? patternsOrOptions : patternsOrOptions.patterns, opts);
	if (!relative$3) return crawler.withPromise();
	return formatPaths(await crawler.withPromise(), relative$3);
}

//#endregion
//#region src/build/build.ts
async function build(nitro) {
	switch (nitro.options.builder) {
		case "rollup": {
			const { rollupBuild } = await import("./rollup.mjs");
			return rollupBuild(nitro);
		}
		case "rolldown": {
			const { rolldownBuild } = await import("./rolldown.mjs");
			return rolldownBuild(nitro);
		}
		case "vite": {
			const { viteBuild } = await import("./vite.build.mjs");
			return viteBuild(nitro);
		}
		default: throw new Error(`Unknown builder: ${nitro.options.builder}`);
	}
}

//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/other.js
const types$3 = {
	"application/prs.cww": ["cww"],
	"application/prs.xsf+xml": ["xsf"],
	"application/vnd.1000minds.decision-model+xml": ["1km"],
	"application/vnd.3gpp.pic-bw-large": ["plb"],
	"application/vnd.3gpp.pic-bw-small": ["psb"],
	"application/vnd.3gpp.pic-bw-var": ["pvb"],
	"application/vnd.3gpp2.tcap": ["tcap"],
	"application/vnd.3m.post-it-notes": ["pwn"],
	"application/vnd.accpac.simply.aso": ["aso"],
	"application/vnd.accpac.simply.imp": ["imp"],
	"application/vnd.acucobol": ["acu"],
	"application/vnd.acucorp": ["atc", "acutc"],
	"application/vnd.adobe.air-application-installer-package+zip": ["air"],
	"application/vnd.adobe.formscentral.fcdt": ["fcdt"],
	"application/vnd.adobe.fxp": ["fxp", "fxpl"],
	"application/vnd.adobe.xdp+xml": ["xdp"],
	"application/vnd.adobe.xfdf": ["*xfdf"],
	"application/vnd.age": ["age"],
	"application/vnd.ahead.space": ["ahead"],
	"application/vnd.airzip.filesecure.azf": ["azf"],
	"application/vnd.airzip.filesecure.azs": ["azs"],
	"application/vnd.amazon.ebook": ["azw"],
	"application/vnd.americandynamics.acc": ["acc"],
	"application/vnd.amiga.ami": ["ami"],
	"application/vnd.android.package-archive": ["apk"],
	"application/vnd.anser-web-certificate-issue-initiation": ["cii"],
	"application/vnd.anser-web-funds-transfer-initiation": ["fti"],
	"application/vnd.antix.game-component": ["atx"],
	"application/vnd.apple.installer+xml": ["mpkg"],
	"application/vnd.apple.keynote": ["key"],
	"application/vnd.apple.mpegurl": ["m3u8"],
	"application/vnd.apple.numbers": ["numbers"],
	"application/vnd.apple.pages": ["pages"],
	"application/vnd.apple.pkpass": ["pkpass"],
	"application/vnd.aristanetworks.swi": ["swi"],
	"application/vnd.astraea-software.iota": ["iota"],
	"application/vnd.audiograph": ["aep"],
	"application/vnd.autodesk.fbx": ["fbx"],
	"application/vnd.balsamiq.bmml+xml": ["bmml"],
	"application/vnd.blueice.multipass": ["mpm"],
	"application/vnd.bmi": ["bmi"],
	"application/vnd.businessobjects": ["rep"],
	"application/vnd.chemdraw+xml": ["cdxml"],
	"application/vnd.chipnuts.karaoke-mmd": ["mmd"],
	"application/vnd.cinderella": ["cdy"],
	"application/vnd.citationstyles.style+xml": ["csl"],
	"application/vnd.claymore": ["cla"],
	"application/vnd.cloanto.rp9": ["rp9"],
	"application/vnd.clonk.c4group": [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	],
	"application/vnd.cluetrust.cartomobile-config": ["c11amc"],
	"application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"],
	"application/vnd.commonspace": ["csp"],
	"application/vnd.contact.cmsg": ["cdbcmsg"],
	"application/vnd.cosmocaller": ["cmc"],
	"application/vnd.crick.clicker": ["clkx"],
	"application/vnd.crick.clicker.keyboard": ["clkk"],
	"application/vnd.crick.clicker.palette": ["clkp"],
	"application/vnd.crick.clicker.template": ["clkt"],
	"application/vnd.crick.clicker.wordbank": ["clkw"],
	"application/vnd.criticaltools.wbs+xml": ["wbs"],
	"application/vnd.ctc-posml": ["pml"],
	"application/vnd.cups-ppd": ["ppd"],
	"application/vnd.curl.car": ["car"],
	"application/vnd.curl.pcurl": ["pcurl"],
	"application/vnd.dart": ["dart"],
	"application/vnd.data-vision.rdz": ["rdz"],
	"application/vnd.dbf": ["dbf"],
	"application/vnd.dcmp+xml": ["dcmp"],
	"application/vnd.dece.data": [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	],
	"application/vnd.dece.ttml+xml": ["uvt", "uvvt"],
	"application/vnd.dece.unspecified": ["uvx", "uvvx"],
	"application/vnd.dece.zip": ["uvz", "uvvz"],
	"application/vnd.denovo.fcselayout-link": ["fe_launch"],
	"application/vnd.dna": ["dna"],
	"application/vnd.dolby.mlp": ["mlp"],
	"application/vnd.dpgraph": ["dpg"],
	"application/vnd.dreamfactory": ["dfac"],
	"application/vnd.ds-keypoint": ["kpxx"],
	"application/vnd.dvb.ait": ["ait"],
	"application/vnd.dvb.service": ["svc"],
	"application/vnd.dynageo": ["geo"],
	"application/vnd.ecowin.chart": ["mag"],
	"application/vnd.enliven": ["nml"],
	"application/vnd.epson.esf": ["esf"],
	"application/vnd.epson.msf": ["msf"],
	"application/vnd.epson.quickanime": ["qam"],
	"application/vnd.epson.salt": ["slt"],
	"application/vnd.epson.ssf": ["ssf"],
	"application/vnd.eszigno3+xml": ["es3", "et3"],
	"application/vnd.ezpix-album": ["ez2"],
	"application/vnd.ezpix-package": ["ez3"],
	"application/vnd.fdf": ["*fdf"],
	"application/vnd.fdsn.mseed": ["mseed"],
	"application/vnd.fdsn.seed": ["seed", "dataless"],
	"application/vnd.flographit": ["gph"],
	"application/vnd.fluxtime.clip": ["ftc"],
	"application/vnd.framemaker": [
		"fm",
		"frame",
		"maker",
		"book"
	],
	"application/vnd.frogans.fnc": ["fnc"],
	"application/vnd.frogans.ltf": ["ltf"],
	"application/vnd.fsc.weblaunch": ["fsc"],
	"application/vnd.fujitsu.oasys": ["oas"],
	"application/vnd.fujitsu.oasys2": ["oa2"],
	"application/vnd.fujitsu.oasys3": ["oa3"],
	"application/vnd.fujitsu.oasysgp": ["fg5"],
	"application/vnd.fujitsu.oasysprs": ["bh2"],
	"application/vnd.fujixerox.ddd": ["ddd"],
	"application/vnd.fujixerox.docuworks": ["xdw"],
	"application/vnd.fujixerox.docuworks.binder": ["xbd"],
	"application/vnd.fuzzysheet": ["fzs"],
	"application/vnd.genomatix.tuxedo": ["txd"],
	"application/vnd.geogebra.file": ["ggb"],
	"application/vnd.geogebra.slides": ["ggs"],
	"application/vnd.geogebra.tool": ["ggt"],
	"application/vnd.geometry-explorer": ["gex", "gre"],
	"application/vnd.geonext": ["gxt"],
	"application/vnd.geoplan": ["g2w"],
	"application/vnd.geospace": ["g3w"],
	"application/vnd.gmx": ["gmx"],
	"application/vnd.google-apps.document": ["gdoc"],
	"application/vnd.google-apps.drawing": ["gdraw"],
	"application/vnd.google-apps.form": ["gform"],
	"application/vnd.google-apps.jam": ["gjam"],
	"application/vnd.google-apps.map": ["gmap"],
	"application/vnd.google-apps.presentation": ["gslides"],
	"application/vnd.google-apps.script": ["gscript"],
	"application/vnd.google-apps.site": ["gsite"],
	"application/vnd.google-apps.spreadsheet": ["gsheet"],
	"application/vnd.google-earth.kml+xml": ["kml"],
	"application/vnd.google-earth.kmz": ["kmz"],
	"application/vnd.gov.sk.xmldatacontainer+xml": ["xdcf"],
	"application/vnd.grafeq": ["gqf", "gqs"],
	"application/vnd.groove-account": ["gac"],
	"application/vnd.groove-help": ["ghf"],
	"application/vnd.groove-identity-message": ["gim"],
	"application/vnd.groove-injector": ["grv"],
	"application/vnd.groove-tool-message": ["gtm"],
	"application/vnd.groove-tool-template": ["tpl"],
	"application/vnd.groove-vcard": ["vcg"],
	"application/vnd.hal+xml": ["hal"],
	"application/vnd.handheld-entertainment+xml": ["zmm"],
	"application/vnd.hbci": ["hbci"],
	"application/vnd.hhe.lesson-player": ["les"],
	"application/vnd.hp-hpgl": ["hpgl"],
	"application/vnd.hp-hpid": ["hpid"],
	"application/vnd.hp-hps": ["hps"],
	"application/vnd.hp-jlyt": ["jlt"],
	"application/vnd.hp-pcl": ["pcl"],
	"application/vnd.hp-pclxl": ["pclxl"],
	"application/vnd.hydrostatix.sof-data": ["sfd-hdstx"],
	"application/vnd.ibm.minipay": ["mpy"],
	"application/vnd.ibm.modcap": [
		"afp",
		"listafp",
		"list3820"
	],
	"application/vnd.ibm.rights-management": ["irm"],
	"application/vnd.ibm.secure-container": ["sc"],
	"application/vnd.iccprofile": ["icc", "icm"],
	"application/vnd.igloader": ["igl"],
	"application/vnd.immervision-ivp": ["ivp"],
	"application/vnd.immervision-ivu": ["ivu"],
	"application/vnd.insors.igm": ["igm"],
	"application/vnd.intercon.formnet": ["xpw", "xpx"],
	"application/vnd.intergeo": ["i2g"],
	"application/vnd.intu.qbo": ["qbo"],
	"application/vnd.intu.qfx": ["qfx"],
	"application/vnd.ipunplugged.rcprofile": ["rcprofile"],
	"application/vnd.irepository.package+xml": ["irp"],
	"application/vnd.is-xpr": ["xpr"],
	"application/vnd.isac.fcs": ["fcs"],
	"application/vnd.jam": ["jam"],
	"application/vnd.jcp.javame.midlet-rms": ["rms"],
	"application/vnd.jisp": ["jisp"],
	"application/vnd.joost.joda-archive": ["joda"],
	"application/vnd.kahootz": ["ktz", "ktr"],
	"application/vnd.kde.karbon": ["karbon"],
	"application/vnd.kde.kchart": ["chrt"],
	"application/vnd.kde.kformula": ["kfo"],
	"application/vnd.kde.kivio": ["flw"],
	"application/vnd.kde.kontour": ["kon"],
	"application/vnd.kde.kpresenter": ["kpr", "kpt"],
	"application/vnd.kde.kspread": ["ksp"],
	"application/vnd.kde.kword": ["kwd", "kwt"],
	"application/vnd.kenameaapp": ["htke"],
	"application/vnd.kidspiration": ["kia"],
	"application/vnd.kinar": ["kne", "knp"],
	"application/vnd.koan": [
		"skp",
		"skd",
		"skt",
		"skm"
	],
	"application/vnd.kodak-descriptor": ["sse"],
	"application/vnd.las.las+xml": ["lasxml"],
	"application/vnd.llamagraphics.life-balance.desktop": ["lbd"],
	"application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"],
	"application/vnd.lotus-1-2-3": ["123"],
	"application/vnd.lotus-approach": ["apr"],
	"application/vnd.lotus-freelance": ["pre"],
	"application/vnd.lotus-notes": ["nsf"],
	"application/vnd.lotus-organizer": ["org"],
	"application/vnd.lotus-screencam": ["scm"],
	"application/vnd.lotus-wordpro": ["lwp"],
	"application/vnd.macports.portpkg": ["portpkg"],
	"application/vnd.mapbox-vector-tile": ["mvt"],
	"application/vnd.mcd": ["mcd"],
	"application/vnd.medcalcdata": ["mc1"],
	"application/vnd.mediastation.cdkey": ["cdkey"],
	"application/vnd.mfer": ["mwf"],
	"application/vnd.mfmp": ["mfm"],
	"application/vnd.micrografx.flo": ["flo"],
	"application/vnd.micrografx.igx": ["igx"],
	"application/vnd.mif": ["mif"],
	"application/vnd.mobius.daf": ["daf"],
	"application/vnd.mobius.dis": ["dis"],
	"application/vnd.mobius.mbk": ["mbk"],
	"application/vnd.mobius.mqy": ["mqy"],
	"application/vnd.mobius.msl": ["msl"],
	"application/vnd.mobius.plc": ["plc"],
	"application/vnd.mobius.txf": ["txf"],
	"application/vnd.mophun.application": ["mpn"],
	"application/vnd.mophun.certificate": ["mpc"],
	"application/vnd.mozilla.xul+xml": ["xul"],
	"application/vnd.ms-artgalry": ["cil"],
	"application/vnd.ms-cab-compressed": ["cab"],
	"application/vnd.ms-excel": [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	],
	"application/vnd.ms-excel.addin.macroenabled.12": ["xlam"],
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"],
	"application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"],
	"application/vnd.ms-excel.template.macroenabled.12": ["xltm"],
	"application/vnd.ms-fontobject": ["eot"],
	"application/vnd.ms-htmlhelp": ["chm"],
	"application/vnd.ms-ims": ["ims"],
	"application/vnd.ms-lrm": ["lrm"],
	"application/vnd.ms-officetheme": ["thmx"],
	"application/vnd.ms-outlook": ["msg"],
	"application/vnd.ms-pki.seccat": ["cat"],
	"application/vnd.ms-pki.stl": ["*stl"],
	"application/vnd.ms-powerpoint": [
		"ppt",
		"pps",
		"pot"
	],
	"application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"],
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"],
	"application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"],
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"],
	"application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"],
	"application/vnd.ms-project": ["*mpp", "mpt"],
	"application/vnd.ms-visio.viewer": ["vdx"],
	"application/vnd.ms-word.document.macroenabled.12": ["docm"],
	"application/vnd.ms-word.template.macroenabled.12": ["dotm"],
	"application/vnd.ms-works": [
		"wps",
		"wks",
		"wcm",
		"wdb"
	],
	"application/vnd.ms-wpl": ["wpl"],
	"application/vnd.ms-xpsdocument": ["xps"],
	"application/vnd.mseq": ["mseq"],
	"application/vnd.musician": ["mus"],
	"application/vnd.muvee.style": ["msty"],
	"application/vnd.mynfc": ["taglet"],
	"application/vnd.nato.bindingdataobject+xml": ["bdo"],
	"application/vnd.neurolanguage.nlu": ["nlu"],
	"application/vnd.nitf": ["ntf", "nitf"],
	"application/vnd.noblenet-directory": ["nnd"],
	"application/vnd.noblenet-sealer": ["nns"],
	"application/vnd.noblenet-web": ["nnw"],
	"application/vnd.nokia.n-gage.ac+xml": ["*ac"],
	"application/vnd.nokia.n-gage.data": ["ngdat"],
	"application/vnd.nokia.n-gage.symbian.install": ["n-gage"],
	"application/vnd.nokia.radio-preset": ["rpst"],
	"application/vnd.nokia.radio-presets": ["rpss"],
	"application/vnd.novadigm.edm": ["edm"],
	"application/vnd.novadigm.edx": ["edx"],
	"application/vnd.novadigm.ext": ["ext"],
	"application/vnd.oasis.opendocument.chart": ["odc"],
	"application/vnd.oasis.opendocument.chart-template": ["otc"],
	"application/vnd.oasis.opendocument.database": ["odb"],
	"application/vnd.oasis.opendocument.formula": ["odf"],
	"application/vnd.oasis.opendocument.formula-template": ["odft"],
	"application/vnd.oasis.opendocument.graphics": ["odg"],
	"application/vnd.oasis.opendocument.graphics-template": ["otg"],
	"application/vnd.oasis.opendocument.image": ["odi"],
	"application/vnd.oasis.opendocument.image-template": ["oti"],
	"application/vnd.oasis.opendocument.presentation": ["odp"],
	"application/vnd.oasis.opendocument.presentation-template": ["otp"],
	"application/vnd.oasis.opendocument.spreadsheet": ["ods"],
	"application/vnd.oasis.opendocument.spreadsheet-template": ["ots"],
	"application/vnd.oasis.opendocument.text": ["odt"],
	"application/vnd.oasis.opendocument.text-master": ["odm"],
	"application/vnd.oasis.opendocument.text-template": ["ott"],
	"application/vnd.oasis.opendocument.text-web": ["oth"],
	"application/vnd.olpc-sugar": ["xo"],
	"application/vnd.oma.dd2+xml": ["dd2"],
	"application/vnd.openblox.game+xml": ["obgx"],
	"application/vnd.openofficeorg.extension": ["oxt"],
	"application/vnd.openstreetmap.data+xml": ["osm"],
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
	"application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"],
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"],
	"application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"],
	"application/vnd.osgeo.mapguide.package": ["mgp"],
	"application/vnd.osgi.dp": ["dp"],
	"application/vnd.osgi.subsystem": ["esa"],
	"application/vnd.palm": [
		"pdb",
		"pqa",
		"oprc"
	],
	"application/vnd.pawaafile": ["paw"],
	"application/vnd.pg.format": ["str"],
	"application/vnd.pg.osasli": ["ei6"],
	"application/vnd.picsel": ["efif"],
	"application/vnd.pmi.widget": ["wg"],
	"application/vnd.pocketlearn": ["plf"],
	"application/vnd.powerbuilder6": ["pbd"],
	"application/vnd.previewsystems.box": ["box"],
	"application/vnd.procrate.brushset": ["brushset"],
	"application/vnd.procreate.brush": ["brush"],
	"application/vnd.procreate.dream": ["drm"],
	"application/vnd.proteus.magazine": ["mgz"],
	"application/vnd.publishare-delta-tree": ["qps"],
	"application/vnd.pvi.ptid1": ["ptid"],
	"application/vnd.pwg-xhtml-print+xml": ["xhtm"],
	"application/vnd.quark.quarkxpress": [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	],
	"application/vnd.rar": ["rar"],
	"application/vnd.realvnc.bed": ["bed"],
	"application/vnd.recordare.musicxml": ["mxl"],
	"application/vnd.recordare.musicxml+xml": ["musicxml"],
	"application/vnd.rig.cryptonote": ["cryptonote"],
	"application/vnd.rim.cod": ["cod"],
	"application/vnd.rn-realmedia": ["rm"],
	"application/vnd.rn-realmedia-vbr": ["rmvb"],
	"application/vnd.route66.link66+xml": ["link66"],
	"application/vnd.sailingtracker.track": ["st"],
	"application/vnd.seemail": ["see"],
	"application/vnd.sema": ["sema"],
	"application/vnd.semd": ["semd"],
	"application/vnd.semf": ["semf"],
	"application/vnd.shana.informed.formdata": ["ifm"],
	"application/vnd.shana.informed.formtemplate": ["itp"],
	"application/vnd.shana.informed.interchange": ["iif"],
	"application/vnd.shana.informed.package": ["ipk"],
	"application/vnd.simtech-mindmapper": ["twd", "twds"],
	"application/vnd.smaf": ["mmf"],
	"application/vnd.smart.teacher": ["teacher"],
	"application/vnd.software602.filler.form+xml": ["fo"],
	"application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
	"application/vnd.spotfire.dxp": ["dxp"],
	"application/vnd.spotfire.sfs": ["sfs"],
	"application/vnd.stardivision.calc": ["sdc"],
	"application/vnd.stardivision.draw": ["sda"],
	"application/vnd.stardivision.impress": ["sdd"],
	"application/vnd.stardivision.math": ["smf"],
	"application/vnd.stardivision.writer": ["sdw", "vor"],
	"application/vnd.stardivision.writer-global": ["sgl"],
	"application/vnd.stepmania.package": ["smzip"],
	"application/vnd.stepmania.stepchart": ["sm"],
	"application/vnd.sun.wadl+xml": ["wadl"],
	"application/vnd.sun.xml.calc": ["sxc"],
	"application/vnd.sun.xml.calc.template": ["stc"],
	"application/vnd.sun.xml.draw": ["sxd"],
	"application/vnd.sun.xml.draw.template": ["std"],
	"application/vnd.sun.xml.impress": ["sxi"],
	"application/vnd.sun.xml.impress.template": ["sti"],
	"application/vnd.sun.xml.math": ["sxm"],
	"application/vnd.sun.xml.writer": ["sxw"],
	"application/vnd.sun.xml.writer.global": ["sxg"],
	"application/vnd.sun.xml.writer.template": ["stw"],
	"application/vnd.sus-calendar": ["sus", "susp"],
	"application/vnd.svd": ["svd"],
	"application/vnd.symbian.install": ["sis", "sisx"],
	"application/vnd.syncml+xml": ["xsm"],
	"application/vnd.syncml.dm+wbxml": ["bdm"],
	"application/vnd.syncml.dm+xml": ["xdm"],
	"application/vnd.syncml.dmddf+xml": ["ddf"],
	"application/vnd.tao.intent-module-archive": ["tao"],
	"application/vnd.tcpdump.pcap": [
		"pcap",
		"cap",
		"dmp"
	],
	"application/vnd.tmobile-livetv": ["tmo"],
	"application/vnd.trid.tpt": ["tpt"],
	"application/vnd.triscape.mxs": ["mxs"],
	"application/vnd.trueapp": ["tra"],
	"application/vnd.ufdl": ["ufd", "ufdl"],
	"application/vnd.uiq.theme": ["utz"],
	"application/vnd.umajin": ["umj"],
	"application/vnd.unity": ["unityweb"],
	"application/vnd.uoml+xml": ["uoml", "uo"],
	"application/vnd.vcx": ["vcx"],
	"application/vnd.visio": [
		"vsd",
		"vst",
		"vss",
		"vsw",
		"vsdx",
		"vtx"
	],
	"application/vnd.visionary": ["vis"],
	"application/vnd.vsf": ["vsf"],
	"application/vnd.wap.wbxml": ["wbxml"],
	"application/vnd.wap.wmlc": ["wmlc"],
	"application/vnd.wap.wmlscriptc": ["wmlsc"],
	"application/vnd.webturbo": ["wtb"],
	"application/vnd.wolfram.player": ["nbp"],
	"application/vnd.wordperfect": ["wpd"],
	"application/vnd.wqd": ["wqd"],
	"application/vnd.wt.stf": ["stf"],
	"application/vnd.xara": ["xar"],
	"application/vnd.xfdl": ["xfdl"],
	"application/vnd.yamaha.hv-dic": ["hvd"],
	"application/vnd.yamaha.hv-script": ["hvs"],
	"application/vnd.yamaha.hv-voice": ["hvp"],
	"application/vnd.yamaha.openscoreformat": ["osf"],
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"],
	"application/vnd.yamaha.smaf-audio": ["saf"],
	"application/vnd.yamaha.smaf-phrase": ["spf"],
	"application/vnd.yellowriver-custom-menu": ["cmp"],
	"application/vnd.zul": ["zir", "zirz"],
	"application/vnd.zzazz.deck+xml": ["zaz"],
	"application/x-7z-compressed": ["7z"],
	"application/x-abiword": ["abw"],
	"application/x-ace-compressed": ["ace"],
	"application/x-apple-diskimage": ["*dmg"],
	"application/x-arj": ["arj"],
	"application/x-authorware-bin": [
		"aab",
		"x32",
		"u32",
		"vox"
	],
	"application/x-authorware-map": ["aam"],
	"application/x-authorware-seg": ["aas"],
	"application/x-bcpio": ["bcpio"],
	"application/x-bdoc": ["*bdoc"],
	"application/x-bittorrent": ["torrent"],
	"application/x-blender": ["blend"],
	"application/x-blorb": ["blb", "blorb"],
	"application/x-bzip": ["bz"],
	"application/x-bzip2": ["bz2", "boz"],
	"application/x-cbr": [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	],
	"application/x-cdlink": ["vcd"],
	"application/x-cfs-compressed": ["cfs"],
	"application/x-chat": ["chat"],
	"application/x-chess-pgn": ["pgn"],
	"application/x-chrome-extension": ["crx"],
	"application/x-cocoa": ["cco"],
	"application/x-compressed": ["*rar"],
	"application/x-conference": ["nsc"],
	"application/x-cpio": ["cpio"],
	"application/x-csh": ["csh"],
	"application/x-debian-package": ["*deb", "udeb"],
	"application/x-dgc-compressed": ["dgc"],
	"application/x-director": [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	],
	"application/x-doom": ["wad"],
	"application/x-dtbncx+xml": ["ncx"],
	"application/x-dtbook+xml": ["dtb"],
	"application/x-dtbresource+xml": ["res"],
	"application/x-dvi": ["dvi"],
	"application/x-envoy": ["evy"],
	"application/x-eva": ["eva"],
	"application/x-font-bdf": ["bdf"],
	"application/x-font-ghostscript": ["gsf"],
	"application/x-font-linux-psf": ["psf"],
	"application/x-font-pcf": ["pcf"],
	"application/x-font-snf": ["snf"],
	"application/x-font-type1": [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	],
	"application/x-freearc": ["arc"],
	"application/x-futuresplash": ["spl"],
	"application/x-gca-compressed": ["gca"],
	"application/x-glulx": ["ulx"],
	"application/x-gnumeric": ["gnumeric"],
	"application/x-gramps-xml": ["gramps"],
	"application/x-gtar": ["gtar"],
	"application/x-hdf": ["hdf"],
	"application/x-httpd-php": ["php"],
	"application/x-install-instructions": ["install"],
	"application/x-ipynb+json": ["ipynb"],
	"application/x-iso9660-image": ["*iso"],
	"application/x-iwork-keynote-sffkey": ["*key"],
	"application/x-iwork-numbers-sffnumbers": ["*numbers"],
	"application/x-iwork-pages-sffpages": ["*pages"],
	"application/x-java-archive-diff": ["jardiff"],
	"application/x-java-jnlp-file": ["jnlp"],
	"application/x-keepass2": ["kdbx"],
	"application/x-latex": ["latex"],
	"application/x-lua-bytecode": ["luac"],
	"application/x-lzh-compressed": ["lzh", "lha"],
	"application/x-makeself": ["run"],
	"application/x-mie": ["mie"],
	"application/x-mobipocket-ebook": ["*prc", "mobi"],
	"application/x-ms-application": ["application"],
	"application/x-ms-shortcut": ["lnk"],
	"application/x-ms-wmd": ["wmd"],
	"application/x-ms-wmz": ["wmz"],
	"application/x-ms-xbap": ["xbap"],
	"application/x-msaccess": ["mdb"],
	"application/x-msbinder": ["obd"],
	"application/x-mscardfile": ["crd"],
	"application/x-msclip": ["clp"],
	"application/x-msdos-program": ["*exe"],
	"application/x-msdownload": [
		"*exe",
		"*dll",
		"com",
		"bat",
		"*msi"
	],
	"application/x-msmediaview": [
		"mvb",
		"m13",
		"m14"
	],
	"application/x-msmetafile": [
		"*wmf",
		"*wmz",
		"*emf",
		"emz"
	],
	"application/x-msmoney": ["mny"],
	"application/x-mspublisher": ["pub"],
	"application/x-msschedule": ["scd"],
	"application/x-msterminal": ["trm"],
	"application/x-mswrite": ["wri"],
	"application/x-netcdf": ["nc", "cdf"],
	"application/x-ns-proxy-autoconfig": ["pac"],
	"application/x-nzb": ["nzb"],
	"application/x-perl": ["pl", "pm"],
	"application/x-pilot": ["*prc", "*pdb"],
	"application/x-pkcs12": ["p12", "pfx"],
	"application/x-pkcs7-certificates": ["p7b", "spc"],
	"application/x-pkcs7-certreqresp": ["p7r"],
	"application/x-rar-compressed": ["*rar"],
	"application/x-redhat-package-manager": ["rpm"],
	"application/x-research-info-systems": ["ris"],
	"application/x-sea": ["sea"],
	"application/x-sh": ["sh"],
	"application/x-shar": ["shar"],
	"application/x-shockwave-flash": ["swf"],
	"application/x-silverlight-app": ["xap"],
	"application/x-sql": ["*sql"],
	"application/x-stuffit": ["sit"],
	"application/x-stuffitx": ["sitx"],
	"application/x-subrip": ["srt"],
	"application/x-sv4cpio": ["sv4cpio"],
	"application/x-sv4crc": ["sv4crc"],
	"application/x-t3vm-image": ["t3"],
	"application/x-tads": ["gam"],
	"application/x-tar": ["tar"],
	"application/x-tcl": ["tcl", "tk"],
	"application/x-tex": ["tex"],
	"application/x-tex-tfm": ["tfm"],
	"application/x-texinfo": ["texinfo", "texi"],
	"application/x-tgif": ["*obj"],
	"application/x-ustar": ["ustar"],
	"application/x-virtualbox-hdd": ["hdd"],
	"application/x-virtualbox-ova": ["ova"],
	"application/x-virtualbox-ovf": ["ovf"],
	"application/x-virtualbox-vbox": ["vbox"],
	"application/x-virtualbox-vbox-extpack": ["vbox-extpack"],
	"application/x-virtualbox-vdi": ["vdi"],
	"application/x-virtualbox-vhd": ["vhd"],
	"application/x-virtualbox-vmdk": ["vmdk"],
	"application/x-wais-source": ["src"],
	"application/x-web-app-manifest+json": ["webapp"],
	"application/x-x509-ca-cert": [
		"der",
		"crt",
		"pem"
	],
	"application/x-xfig": ["fig"],
	"application/x-xliff+xml": ["*xlf"],
	"application/x-xpinstall": ["xpi"],
	"application/x-xz": ["xz"],
	"application/x-zip-compressed": ["*zip"],
	"application/x-zmachine": [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	],
	"audio/vnd.dece.audio": ["uva", "uvva"],
	"audio/vnd.digital-winds": ["eol"],
	"audio/vnd.dra": ["dra"],
	"audio/vnd.dts": ["dts"],
	"audio/vnd.dts.hd": ["dtshd"],
	"audio/vnd.lucent.voice": ["lvp"],
	"audio/vnd.ms-playready.media.pya": ["pya"],
	"audio/vnd.nuera.ecelp4800": ["ecelp4800"],
	"audio/vnd.nuera.ecelp7470": ["ecelp7470"],
	"audio/vnd.nuera.ecelp9600": ["ecelp9600"],
	"audio/vnd.rip": ["rip"],
	"audio/x-aac": ["*aac"],
	"audio/x-aiff": [
		"aif",
		"aiff",
		"aifc"
	],
	"audio/x-caf": ["caf"],
	"audio/x-flac": ["flac"],
	"audio/x-m4a": ["*m4a"],
	"audio/x-matroska": ["mka"],
	"audio/x-mpegurl": ["m3u"],
	"audio/x-ms-wax": ["wax"],
	"audio/x-ms-wma": ["wma"],
	"audio/x-pn-realaudio": ["ram", "ra"],
	"audio/x-pn-realaudio-plugin": ["rmp"],
	"audio/x-realaudio": ["*ra"],
	"audio/x-wav": ["*wav"],
	"chemical/x-cdx": ["cdx"],
	"chemical/x-cif": ["cif"],
	"chemical/x-cmdf": ["cmdf"],
	"chemical/x-cml": ["cml"],
	"chemical/x-csml": ["csml"],
	"chemical/x-xyz": ["xyz"],
	"image/prs.btif": ["btif", "btf"],
	"image/prs.pti": ["pti"],
	"image/vnd.adobe.photoshop": ["psd"],
	"image/vnd.airzip.accelerator.azv": ["azv"],
	"image/vnd.blockfact.facti": ["facti"],
	"image/vnd.dece.graphic": [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	],
	"image/vnd.djvu": ["djvu", "djv"],
	"image/vnd.dvb.subtitle": ["*sub"],
	"image/vnd.dwg": ["dwg"],
	"image/vnd.dxf": ["dxf"],
	"image/vnd.fastbidsheet": ["fbs"],
	"image/vnd.fpx": ["fpx"],
	"image/vnd.fst": ["fst"],
	"image/vnd.fujixerox.edmics-mmr": ["mmr"],
	"image/vnd.fujixerox.edmics-rlc": ["rlc"],
	"image/vnd.microsoft.icon": ["ico"],
	"image/vnd.ms-dds": ["dds"],
	"image/vnd.ms-modi": ["mdi"],
	"image/vnd.ms-photo": ["wdp"],
	"image/vnd.net-fpx": ["npx"],
	"image/vnd.pco.b16": ["b16"],
	"image/vnd.tencent.tap": ["tap"],
	"image/vnd.valve.source.texture": ["vtf"],
	"image/vnd.wap.wbmp": ["wbmp"],
	"image/vnd.xiff": ["xif"],
	"image/vnd.zbrush.pcx": ["pcx"],
	"image/x-3ds": ["3ds"],
	"image/x-adobe-dng": ["dng"],
	"image/x-cmu-raster": ["ras"],
	"image/x-cmx": ["cmx"],
	"image/x-freehand": [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	],
	"image/x-icon": ["*ico"],
	"image/x-jng": ["jng"],
	"image/x-mrsid-image": ["sid"],
	"image/x-ms-bmp": ["*bmp"],
	"image/x-pcx": ["*pcx"],
	"image/x-pict": ["pic", "pct"],
	"image/x-portable-anymap": ["pnm"],
	"image/x-portable-bitmap": ["pbm"],
	"image/x-portable-graymap": ["pgm"],
	"image/x-portable-pixmap": ["ppm"],
	"image/x-rgb": ["rgb"],
	"image/x-tga": ["tga"],
	"image/x-xbitmap": ["xbm"],
	"image/x-xpixmap": ["xpm"],
	"image/x-xwindowdump": ["xwd"],
	"message/vnd.wfa.wsc": ["wsc"],
	"model/vnd.bary": ["bary"],
	"model/vnd.cld": ["cld"],
	"model/vnd.collada+xml": ["dae"],
	"model/vnd.dwf": ["dwf"],
	"model/vnd.gdl": ["gdl"],
	"model/vnd.gtw": ["gtw"],
	"model/vnd.mts": ["*mts"],
	"model/vnd.opengex": ["ogex"],
	"model/vnd.parasolid.transmit.binary": ["x_b"],
	"model/vnd.parasolid.transmit.text": ["x_t"],
	"model/vnd.pytha.pyox": ["pyo", "pyox"],
	"model/vnd.sap.vds": ["vds"],
	"model/vnd.usda": ["usda"],
	"model/vnd.usdz+zip": ["usdz"],
	"model/vnd.valve.source.compiled-map": ["bsp"],
	"model/vnd.vtu": ["vtu"],
	"text/prs.lines.tag": ["dsc"],
	"text/vnd.curl": ["curl"],
	"text/vnd.curl.dcurl": ["dcurl"],
	"text/vnd.curl.mcurl": ["mcurl"],
	"text/vnd.curl.scurl": ["scurl"],
	"text/vnd.dvb.subtitle": ["sub"],
	"text/vnd.familysearch.gedcom": ["ged"],
	"text/vnd.fly": ["fly"],
	"text/vnd.fmi.flexstor": ["flx"],
	"text/vnd.graphviz": ["gv"],
	"text/vnd.in3d.3dml": ["3dml"],
	"text/vnd.in3d.spot": ["spot"],
	"text/vnd.sun.j2me.app-descriptor": ["jad"],
	"text/vnd.wap.wml": ["wml"],
	"text/vnd.wap.wmlscript": ["wmls"],
	"text/x-asm": ["s", "asm"],
	"text/x-c": [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	],
	"text/x-component": ["htc"],
	"text/x-fortran": [
		"f",
		"for",
		"f77",
		"f90"
	],
	"text/x-handlebars-template": ["hbs"],
	"text/x-java-source": ["java"],
	"text/x-lua": ["lua"],
	"text/x-markdown": ["mkd"],
	"text/x-nfo": ["nfo"],
	"text/x-opml": ["opml"],
	"text/x-org": ["*org"],
	"text/x-pascal": ["p", "pas"],
	"text/x-processing": ["pde"],
	"text/x-sass": ["sass"],
	"text/x-scss": ["scss"],
	"text/x-setext": ["etx"],
	"text/x-sfv": ["sfv"],
	"text/x-suse-ymp": ["ymp"],
	"text/x-uuencode": ["uu"],
	"text/x-vcalendar": ["vcs"],
	"text/x-vcard": ["vcf"],
	"video/vnd.dece.hd": ["uvh", "uvvh"],
	"video/vnd.dece.mobile": ["uvm", "uvvm"],
	"video/vnd.dece.pd": ["uvp", "uvvp"],
	"video/vnd.dece.sd": ["uvs", "uvvs"],
	"video/vnd.dece.video": ["uvv", "uvvv"],
	"video/vnd.dvb.file": ["dvb"],
	"video/vnd.fvt": ["fvt"],
	"video/vnd.mpegurl": ["mxu", "m4u"],
	"video/vnd.ms-playready.media.pyv": ["pyv"],
	"video/vnd.uvvu.mp4": ["uvu", "uvvu"],
	"video/vnd.vivo": ["viv"],
	"video/x-f4v": ["f4v"],
	"video/x-fli": ["fli"],
	"video/x-flv": ["flv"],
	"video/x-m4v": ["m4v"],
	"video/x-matroska": [
		"mkv",
		"mk3d",
		"mks"
	],
	"video/x-mng": ["mng"],
	"video/x-ms-asf": ["asf", "asx"],
	"video/x-ms-vob": ["vob"],
	"video/x-ms-wm": ["wm"],
	"video/x-ms-wmv": ["wmv"],
	"video/x-ms-wmx": ["wmx"],
	"video/x-ms-wvx": ["wvx"],
	"video/x-msvideo": ["avi"],
	"video/x-sgi-movie": ["movie"],
	"video/x-smv": ["smv"],
	"x-conference/x-cooltalk": ["ice"]
};
Object.freeze(types$3);
var other_default = types$3;

//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/standard.js
const types$2 = {
	"application/andrew-inset": ["ez"],
	"application/appinstaller": ["appinstaller"],
	"application/applixware": ["aw"],
	"application/appx": ["appx"],
	"application/appxbundle": ["appxbundle"],
	"application/atom+xml": ["atom"],
	"application/atomcat+xml": ["atomcat"],
	"application/atomdeleted+xml": ["atomdeleted"],
	"application/atomsvc+xml": ["atomsvc"],
	"application/atsc-dwd+xml": ["dwd"],
	"application/atsc-held+xml": ["held"],
	"application/atsc-rsat+xml": ["rsat"],
	"application/automationml-aml+xml": ["aml"],
	"application/automationml-amlx+zip": ["amlx"],
	"application/bdoc": ["bdoc"],
	"application/calendar+xml": ["xcs"],
	"application/ccxml+xml": ["ccxml"],
	"application/cdfx+xml": ["cdfx"],
	"application/cdmi-capability": ["cdmia"],
	"application/cdmi-container": ["cdmic"],
	"application/cdmi-domain": ["cdmid"],
	"application/cdmi-object": ["cdmio"],
	"application/cdmi-queue": ["cdmiq"],
	"application/cpl+xml": ["cpl"],
	"application/cu-seeme": ["cu"],
	"application/cwl": ["cwl"],
	"application/dash+xml": ["mpd"],
	"application/dash-patch+xml": ["mpp"],
	"application/davmount+xml": ["davmount"],
	"application/dicom": ["dcm"],
	"application/docbook+xml": ["dbk"],
	"application/dssc+der": ["dssc"],
	"application/dssc+xml": ["xdssc"],
	"application/ecmascript": ["ecma"],
	"application/emma+xml": ["emma"],
	"application/emotionml+xml": ["emotionml"],
	"application/epub+zip": ["epub"],
	"application/exi": ["exi"],
	"application/express": ["exp"],
	"application/fdf": ["fdf"],
	"application/fdt+xml": ["fdt"],
	"application/font-tdpfr": ["pfr"],
	"application/geo+json": ["geojson"],
	"application/gml+xml": ["gml"],
	"application/gpx+xml": ["gpx"],
	"application/gxf": ["gxf"],
	"application/gzip": ["gz"],
	"application/hjson": ["hjson"],
	"application/hyperstudio": ["stk"],
	"application/inkml+xml": ["ink", "inkml"],
	"application/ipfix": ["ipfix"],
	"application/its+xml": ["its"],
	"application/java-archive": [
		"jar",
		"war",
		"ear"
	],
	"application/java-serialized-object": ["ser"],
	"application/java-vm": ["class"],
	"application/javascript": ["*js"],
	"application/json": ["json", "map"],
	"application/json5": ["json5"],
	"application/jsonml+json": ["jsonml"],
	"application/ld+json": ["jsonld"],
	"application/lgr+xml": ["lgr"],
	"application/lost+xml": ["lostxml"],
	"application/mac-binhex40": ["hqx"],
	"application/mac-compactpro": ["cpt"],
	"application/mads+xml": ["mads"],
	"application/manifest+json": ["webmanifest"],
	"application/marc": ["mrc"],
	"application/marcxml+xml": ["mrcx"],
	"application/mathematica": [
		"ma",
		"nb",
		"mb"
	],
	"application/mathml+xml": ["mathml"],
	"application/mbox": ["mbox"],
	"application/media-policy-dataset+xml": ["mpf"],
	"application/mediaservercontrol+xml": ["mscml"],
	"application/metalink+xml": ["metalink"],
	"application/metalink4+xml": ["meta4"],
	"application/mets+xml": ["mets"],
	"application/mmt-aei+xml": ["maei"],
	"application/mmt-usd+xml": ["musd"],
	"application/mods+xml": ["mods"],
	"application/mp21": ["m21", "mp21"],
	"application/mp4": [
		"*mp4",
		"*mpg4",
		"mp4s",
		"m4p"
	],
	"application/msix": ["msix"],
	"application/msixbundle": ["msixbundle"],
	"application/msword": ["doc", "dot"],
	"application/mxf": ["mxf"],
	"application/n-quads": ["nq"],
	"application/n-triples": ["nt"],
	"application/node": ["cjs"],
	"application/octet-stream": [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	],
	"application/oda": ["oda"],
	"application/oebps-package+xml": ["opf"],
	"application/ogg": ["ogx"],
	"application/omdoc+xml": ["omdoc"],
	"application/onenote": [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg",
		"one",
		"onea"
	],
	"application/oxps": ["oxps"],
	"application/p2p-overlay+xml": ["relo"],
	"application/patch-ops-error+xml": ["xer"],
	"application/pdf": ["pdf"],
	"application/pgp-encrypted": ["pgp"],
	"application/pgp-keys": ["asc"],
	"application/pgp-signature": ["sig", "*asc"],
	"application/pics-rules": ["prf"],
	"application/pkcs10": ["p10"],
	"application/pkcs7-mime": ["p7m", "p7c"],
	"application/pkcs7-signature": ["p7s"],
	"application/pkcs8": ["p8"],
	"application/pkix-attr-cert": ["ac"],
	"application/pkix-cert": ["cer"],
	"application/pkix-crl": ["crl"],
	"application/pkix-pkipath": ["pkipath"],
	"application/pkixcmp": ["pki"],
	"application/pls+xml": ["pls"],
	"application/postscript": [
		"ai",
		"eps",
		"ps"
	],
	"application/provenance+xml": ["provx"],
	"application/pskc+xml": ["pskcxml"],
	"application/raml+yaml": ["raml"],
	"application/rdf+xml": ["rdf", "owl"],
	"application/reginfo+xml": ["rif"],
	"application/relax-ng-compact-syntax": ["rnc"],
	"application/resource-lists+xml": ["rl"],
	"application/resource-lists-diff+xml": ["rld"],
	"application/rls-services+xml": ["rs"],
	"application/route-apd+xml": ["rapd"],
	"application/route-s-tsid+xml": ["sls"],
	"application/route-usd+xml": ["rusd"],
	"application/rpki-ghostbusters": ["gbr"],
	"application/rpki-manifest": ["mft"],
	"application/rpki-roa": ["roa"],
	"application/rsd+xml": ["rsd"],
	"application/rss+xml": ["rss"],
	"application/rtf": ["rtf"],
	"application/sbml+xml": ["sbml"],
	"application/scvp-cv-request": ["scq"],
	"application/scvp-cv-response": ["scs"],
	"application/scvp-vp-request": ["spq"],
	"application/scvp-vp-response": ["spp"],
	"application/sdp": ["sdp"],
	"application/senml+xml": ["senmlx"],
	"application/sensml+xml": ["sensmlx"],
	"application/set-payment-initiation": ["setpay"],
	"application/set-registration-initiation": ["setreg"],
	"application/shf+xml": ["shf"],
	"application/sieve": ["siv", "sieve"],
	"application/smil+xml": ["smi", "smil"],
	"application/sparql-query": ["rq"],
	"application/sparql-results+xml": ["srx"],
	"application/sql": ["sql"],
	"application/srgs": ["gram"],
	"application/srgs+xml": ["grxml"],
	"application/sru+xml": ["sru"],
	"application/ssdl+xml": ["ssdl"],
	"application/ssml+xml": ["ssml"],
	"application/swid+xml": ["swidtag"],
	"application/tei+xml": ["tei", "teicorpus"],
	"application/thraud+xml": ["tfi"],
	"application/timestamped-data": ["tsd"],
	"application/toml": ["toml"],
	"application/trig": ["trig"],
	"application/ttml+xml": ["ttml"],
	"application/ubjson": ["ubj"],
	"application/urc-ressheet+xml": ["rsheet"],
	"application/urc-targetdesc+xml": ["td"],
	"application/voicexml+xml": ["vxml"],
	"application/wasm": ["wasm"],
	"application/watcherinfo+xml": ["wif"],
	"application/widget": ["wgt"],
	"application/winhlp": ["hlp"],
	"application/wsdl+xml": ["wsdl"],
	"application/wspolicy+xml": ["wspolicy"],
	"application/xaml+xml": ["xaml"],
	"application/xcap-att+xml": ["xav"],
	"application/xcap-caps+xml": ["xca"],
	"application/xcap-diff+xml": ["xdf"],
	"application/xcap-el+xml": ["xel"],
	"application/xcap-ns+xml": ["xns"],
	"application/xenc+xml": ["xenc"],
	"application/xfdf": ["xfdf"],
	"application/xhtml+xml": ["xhtml", "xht"],
	"application/xliff+xml": ["xlf"],
	"application/xml": [
		"xml",
		"xsl",
		"xsd",
		"rng"
	],
	"application/xml-dtd": ["dtd"],
	"application/xop+xml": ["xop"],
	"application/xproc+xml": ["xpl"],
	"application/xslt+xml": ["*xsl", "xslt"],
	"application/xspf+xml": ["xspf"],
	"application/xv+xml": [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	],
	"application/yang": ["yang"],
	"application/yin+xml": ["yin"],
	"application/zip": ["zip"],
	"application/zip+dotlottie": ["lottie"],
	"audio/3gpp": ["*3gpp"],
	"audio/aac": ["adts", "aac"],
	"audio/adpcm": ["adp"],
	"audio/amr": ["amr"],
	"audio/basic": ["au", "snd"],
	"audio/midi": [
		"mid",
		"midi",
		"kar",
		"rmi"
	],
	"audio/mobile-xmf": ["mxmf"],
	"audio/mp3": ["*mp3"],
	"audio/mp4": [
		"m4a",
		"mp4a",
		"m4b"
	],
	"audio/mpeg": [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	],
	"audio/ogg": [
		"oga",
		"ogg",
		"spx",
		"opus"
	],
	"audio/s3m": ["s3m"],
	"audio/silk": ["sil"],
	"audio/wav": ["wav"],
	"audio/wave": ["*wav"],
	"audio/webm": ["weba"],
	"audio/xm": ["xm"],
	"font/collection": ["ttc"],
	"font/otf": ["otf"],
	"font/ttf": ["ttf"],
	"font/woff": ["woff"],
	"font/woff2": ["woff2"],
	"image/aces": ["exr"],
	"image/apng": ["apng"],
	"image/avci": ["avci"],
	"image/avcs": ["avcs"],
	"image/avif": ["avif"],
	"image/bmp": ["bmp", "dib"],
	"image/cgm": ["cgm"],
	"image/dicom-rle": ["drle"],
	"image/dpx": ["dpx"],
	"image/emf": ["emf"],
	"image/fits": ["fits"],
	"image/g3fax": ["g3"],
	"image/gif": ["gif"],
	"image/heic": ["heic"],
	"image/heic-sequence": ["heics"],
	"image/heif": ["heif"],
	"image/heif-sequence": ["heifs"],
	"image/hej2k": ["hej2"],
	"image/ief": ["ief"],
	"image/jaii": ["jaii"],
	"image/jais": ["jais"],
	"image/jls": ["jls"],
	"image/jp2": ["jp2", "jpg2"],
	"image/jpeg": [
		"jpg",
		"jpeg",
		"jpe"
	],
	"image/jph": ["jph"],
	"image/jphc": ["jhc"],
	"image/jpm": ["jpm", "jpgm"],
	"image/jpx": ["jpx", "jpf"],
	"image/jxl": ["jxl"],
	"image/jxr": ["jxr"],
	"image/jxra": ["jxra"],
	"image/jxrs": ["jxrs"],
	"image/jxs": ["jxs"],
	"image/jxsc": ["jxsc"],
	"image/jxsi": ["jxsi"],
	"image/jxss": ["jxss"],
	"image/ktx": ["ktx"],
	"image/ktx2": ["ktx2"],
	"image/pjpeg": ["jfif"],
	"image/png": ["png"],
	"image/sgi": ["sgi"],
	"image/svg+xml": ["svg", "svgz"],
	"image/t38": ["t38"],
	"image/tiff": ["tif", "tiff"],
	"image/tiff-fx": ["tfx"],
	"image/webp": ["webp"],
	"image/wmf": ["wmf"],
	"message/disposition-notification": ["disposition-notification"],
	"message/global": ["u8msg"],
	"message/global-delivery-status": ["u8dsn"],
	"message/global-disposition-notification": ["u8mdn"],
	"message/global-headers": ["u8hdr"],
	"message/rfc822": [
		"eml",
		"mime",
		"mht",
		"mhtml"
	],
	"model/3mf": ["3mf"],
	"model/gltf+json": ["gltf"],
	"model/gltf-binary": ["glb"],
	"model/iges": ["igs", "iges"],
	"model/jt": ["jt"],
	"model/mesh": [
		"msh",
		"mesh",
		"silo"
	],
	"model/mtl": ["mtl"],
	"model/obj": ["obj"],
	"model/prc": ["prc"],
	"model/step": [
		"step",
		"stp",
		"stpnc",
		"p21",
		"210"
	],
	"model/step+xml": ["stpx"],
	"model/step+zip": ["stpz"],
	"model/step-xml+zip": ["stpxz"],
	"model/stl": ["stl"],
	"model/u3d": ["u3d"],
	"model/vrml": ["wrl", "vrml"],
	"model/x3d+binary": ["*x3db", "x3dbz"],
	"model/x3d+fastinfoset": ["x3db"],
	"model/x3d+vrml": ["*x3dv", "x3dvz"],
	"model/x3d+xml": ["x3d", "x3dz"],
	"model/x3d-vrml": ["x3dv"],
	"text/cache-manifest": ["appcache", "manifest"],
	"text/calendar": ["ics", "ifb"],
	"text/coffeescript": ["coffee", "litcoffee"],
	"text/css": ["css"],
	"text/csv": ["csv"],
	"text/html": [
		"html",
		"htm",
		"shtml"
	],
	"text/jade": ["jade"],
	"text/javascript": ["js", "mjs"],
	"text/jsx": ["jsx"],
	"text/less": ["less"],
	"text/markdown": ["md", "markdown"],
	"text/mathml": ["mml"],
	"text/mdx": ["mdx"],
	"text/n3": ["n3"],
	"text/plain": [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	],
	"text/richtext": ["rtx"],
	"text/rtf": ["*rtf"],
	"text/sgml": ["sgml", "sgm"],
	"text/shex": ["shex"],
	"text/slim": ["slim", "slm"],
	"text/spdx": ["spdx"],
	"text/stylus": ["stylus", "styl"],
	"text/tab-separated-values": ["tsv"],
	"text/troff": [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	],
	"text/turtle": ["ttl"],
	"text/uri-list": [
		"uri",
		"uris",
		"urls"
	],
	"text/vcard": ["vcard"],
	"text/vtt": ["vtt"],
	"text/wgsl": ["wgsl"],
	"text/xml": ["*xml"],
	"text/yaml": ["yaml", "yml"],
	"video/3gpp": ["3gp", "3gpp"],
	"video/3gpp2": ["3g2"],
	"video/h261": ["h261"],
	"video/h263": ["h263"],
	"video/h264": ["h264"],
	"video/iso.segment": ["m4s"],
	"video/jpeg": ["jpgv"],
	"video/jpm": ["*jpm", "*jpgm"],
	"video/mj2": ["mj2", "mjp2"],
	"video/mp2t": [
		"ts",
		"m2t",
		"m2ts",
		"mts"
	],
	"video/mp4": [
		"mp4",
		"mp4v",
		"mpg4"
	],
	"video/mpeg": [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	],
	"video/ogg": ["ogv"],
	"video/quicktime": ["qt", "mov"],
	"video/webm": ["webm"]
};
Object.freeze(types$2);
var standard_default = types$2;

//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/Mime.js
var __classPrivateFieldGet = void 0 && (void 0).__classPrivateFieldGet || function(receiver, state, kind, f$1) {
	if (kind === "a" && !f$1) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f$1 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f$1 : kind === "a" ? f$1.call(receiver) : f$1 ? f$1.value : state.get(receiver);
};
var _Mime_extensionToType, _Mime_typeToExtension, _Mime_typeToExtensions;
var Mime = class {
	constructor(...args) {
		_Mime_extensionToType.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtension.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtensions.set(this, /* @__PURE__ */ new Map());
		for (const arg of args) this.define(arg);
	}
	define(typeMap, force = false) {
		for (let [type$1, extensions] of Object.entries(typeMap)) {
			type$1 = type$1.toLowerCase();
			extensions = extensions.map((ext) => ext.toLowerCase());
			if (!__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").has(type$1)) __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").set(type$1, /* @__PURE__ */ new Set());
			const allExtensions = __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type$1);
			let first = true;
			for (let extension of extensions) {
				const starred = extension.startsWith("*");
				extension = starred ? extension.slice(1) : extension;
				allExtensions?.add(extension);
				if (first) __classPrivateFieldGet(this, _Mime_typeToExtension, "f").set(type$1, extension);
				first = false;
				if (starred) continue;
				const currentType = __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(extension);
				if (currentType && currentType != type$1 && !force) throw new Error(`"${type$1} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`);
				__classPrivateFieldGet(this, _Mime_extensionToType, "f").set(extension, type$1);
			}
		}
		return this;
	}
	getType(path$2) {
		if (typeof path$2 !== "string") return null;
		const last = path$2.replace(/^.*[/\\]/s, "").toLowerCase();
		const ext = last.replace(/^.*\./s, "").toLowerCase();
		const hasPath = last.length < path$2.length;
		if (!(ext.length < last.length - 1) && hasPath) return null;
		return __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(ext) ?? null;
	}
	getExtension(type$1) {
		if (typeof type$1 !== "string") return null;
		type$1 = type$1?.split?.(";")[0];
		return (type$1 && __classPrivateFieldGet(this, _Mime_typeToExtension, "f").get(type$1.trim().toLowerCase())) ?? null;
	}
	getAllExtensions(type$1) {
		if (typeof type$1 !== "string") return null;
		return __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type$1.toLowerCase()) ?? null;
	}
	_freeze() {
		this.define = () => {
			throw new Error("define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances");
		};
		Object.freeze(this);
		for (const extensions of __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").values()) Object.freeze(extensions);
		return this;
	}
	_getTestState() {
		return {
			types: __classPrivateFieldGet(this, _Mime_extensionToType, "f"),
			extensions: __classPrivateFieldGet(this, _Mime_typeToExtension, "f")
		};
	}
};
_Mime_extensionToType = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtension = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtensions = /* @__PURE__ */ new WeakMap();
var Mime_default = Mime;

//#endregion
//#region node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/index.js
var src_default = new Mime_default(standard_default, other_default)._freeze();

//#endregion
//#region src/utils/compress.ts
async function compressPublicAssets(nitro) {
	const publicFiles = await glob("**", {
		cwd: nitro.options.output.publicDir,
		absolute: false,
		dot: true,
		ignore: ["**/*.gz", "**/*.br"]
	});
	await Promise.all(publicFiles.map(async (fileName) => {
		const filePath = resolve$3(nitro.options.output.publicDir, fileName);
		if (existsSync(filePath + ".gz") || existsSync(filePath + ".br")) return;
		const mimeType = src_default.getType(fileName) || "text/plain";
		const fileContents = await fsp.readFile(filePath);
		if (fileContents.length < 1024 || fileName.endsWith(".map") || !isCompressibleMime(mimeType)) return;
		const { gzip, brotli } = nitro.options.compressPublicAssets || {};
		const encodings = [gzip !== false && "gzip", brotli !== false && "br"].filter(Boolean);
		await Promise.all(encodings.map(async (encoding) => {
			const compressedPath = filePath + ("." + (encoding === "gzip" ? "gz" : "br"));
			if (existsSync(compressedPath)) return;
			const gzipOptions = { level: zlib.constants.Z_BEST_COMPRESSION };
			const brotliOptions = {
				[zlib.constants.BROTLI_PARAM_MODE]: isTextMime(mimeType) ? zlib.constants.BROTLI_MODE_TEXT : zlib.constants.BROTLI_MODE_GENERIC,
				[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
				[zlib.constants.BROTLI_PARAM_SIZE_HINT]: fileContents.length
			};
			const compressedBuff = await new Promise((resolve$4, reject) => {
				const cb = (error, result) => error ? reject(error) : resolve$4(result);
				if (encoding === "gzip") zlib.gzip(fileContents, gzipOptions, cb);
				else zlib.brotliCompress(fileContents, brotliOptions, cb);
			});
			await fsp.writeFile(compressedPath, compressedBuff);
		}));
	}));
}
function isTextMime(mimeType) {
	return /text|javascript|json|xml/.test(mimeType);
}
const COMPRESSIBLE_MIMES_RE = new Set([
	"application/dash+xml",
	"application/eot",
	"application/font",
	"application/font-sfnt",
	"application/javascript",
	"application/json",
	"application/opentype",
	"application/otf",
	"application/pdf",
	"application/pkcs7-mime",
	"application/protobuf",
	"application/rss+xml",
	"application/truetype",
	"application/ttf",
	"application/vnd.apple.mpegurl",
	"application/vnd.mapbox-vector-tile",
	"application/vnd.ms-fontobject",
	"application/wasm",
	"application/xhtml+xml",
	"application/xml",
	"application/x-font-opentype",
	"application/x-font-truetype",
	"application/x-font-ttf",
	"application/x-httpd-cgi",
	"application/x-javascript",
	"application/x-mpegurl",
	"application/x-opentype",
	"application/x-otf",
	"application/x-perl",
	"application/x-ttf",
	"font/eot",
	"font/opentype",
	"font/otf",
	"font/ttf",
	"image/svg+xml",
	"text/css",
	"text/csv",
	"text/html",
	"text/javascript",
	"text/js",
	"text/plain",
	"text/richtext",
	"text/tab-separated-values",
	"text/xml",
	"text/x-component",
	"text/x-java-source",
	"text/x-script",
	"vnd.apple.mpegurl"
]);
function isCompressibleMime(mimeType) {
	return COMPRESSIBLE_MIMES_RE.has(mimeType);
}

//#endregion
//#region src/build/assets.ts
const NEGATION_RE = /^(!?)(.*)$/;
const PARENT_DIR_GLOB_RE = /!?\.\.\//;
async function scanUnprefixedPublicAssets(nitro) {
	const scannedPaths = [];
	for (const asset of nitro.options.publicAssets) {
		if (asset.baseURL && asset.baseURL !== "/" && !asset.fallthrough) continue;
		if (!await isDirectory(asset.dir)) continue;
		const publicAssets$1 = await glob(getIncludePatterns(nitro, asset.dir, asset.ignore), {
			cwd: asset.dir,
			absolute: false,
			dot: true
		});
		scannedPaths.push(...publicAssets$1.map((file) => join$2(asset.baseURL || "/", file)));
	}
	return scannedPaths;
}
async function copyPublicAssets(nitro) {
	if (nitro.options.noPublicDir) return;
	for (const asset of nitro.options.publicAssets) {
		const assetDir = asset.dir;
		const dstDir = join$2(nitro.options.output.publicDir, asset.baseURL);
		if (await isDirectory(assetDir)) {
			const publicAssets$1 = await glob(getIncludePatterns(nitro, assetDir, asset.ignore), {
				cwd: assetDir,
				absolute: false,
				dot: true
			});
			await Promise.all(publicAssets$1.map(async (file) => {
				const src = join$2(assetDir, file);
				const dst = join$2(dstDir, file);
				if (!existsSync(dst)) await promises.cp(src, dst);
			}));
		}
	}
	if (nitro.options.compressPublicAssets) await compressPublicAssets(nitro);
	nitro.logger.success("Generated public " + prettyPath(nitro.options.output.publicDir));
}
function getIncludePatterns(nitro, assetDir, ignorePatterns = nitro.options.ignore) {
	return ["**", ...(ignorePatterns || []).map((p$1) => {
		const [_$2, negation, pattern] = p$1.match(NEGATION_RE) || [];
		return (negation ? "" : "!") + (pattern.startsWith("*") ? pattern : relative$2(assetDir, resolve$3(nitro.options.rootDir, pattern)));
	})].filter((p$1) => !PARENT_DIR_GLOB_RE.test(p$1));
}

//#endregion
//#region src/build/prepare.ts
async function prepare(nitro) {
	await prepareDir(nitro.options.output.dir);
	if (!nitro.options.noPublicDir) await prepareDir(nitro.options.output.publicDir);
	if (!nitro.options.static) await prepareDir(nitro.options.output.serverDir);
}
async function prepareDir(dir) {
	await fsp.rm(dir, {
		recursive: true,
		force: true
	});
	await fsp.mkdir(dir, { recursive: true });
}

//#endregion
//#region node_modules/.pnpm/acorn@8.15.0/node_modules/acorn/dist/acorn.mjs
var astralIdentifierCodes = [
	509,
	0,
	227,
	0,
	150,
	4,
	294,
	9,
	1368,
	2,
	2,
	1,
	6,
	3,
	41,
	2,
	5,
	0,
	166,
	1,
	574,
	3,
	9,
	9,
	7,
	9,
	32,
	4,
	318,
	1,
	80,
	3,
	71,
	10,
	50,
	3,
	123,
	2,
	54,
	14,
	32,
	10,
	3,
	1,
	11,
	3,
	46,
	10,
	8,
	0,
	46,
	9,
	7,
	2,
	37,
	13,
	2,
	9,
	6,
	1,
	45,
	0,
	13,
	2,
	49,
	13,
	9,
	3,
	2,
	11,
	83,
	11,
	7,
	0,
	3,
	0,
	158,
	11,
	6,
	9,
	7,
	3,
	56,
	1,
	2,
	6,
	3,
	1,
	3,
	2,
	10,
	0,
	11,
	1,
	3,
	6,
	4,
	4,
	68,
	8,
	2,
	0,
	3,
	0,
	2,
	3,
	2,
	4,
	2,
	0,
	15,
	1,
	83,
	17,
	10,
	9,
	5,
	0,
	82,
	19,
	13,
	9,
	214,
	6,
	3,
	8,
	28,
	1,
	83,
	16,
	16,
	9,
	82,
	12,
	9,
	9,
	7,
	19,
	58,
	14,
	5,
	9,
	243,
	14,
	166,
	9,
	71,
	5,
	2,
	1,
	3,
	3,
	2,
	0,
	2,
	1,
	13,
	9,
	120,
	6,
	3,
	6,
	4,
	0,
	29,
	9,
	41,
	6,
	2,
	3,
	9,
	0,
	10,
	10,
	47,
	15,
	343,
	9,
	54,
	7,
	2,
	7,
	17,
	9,
	57,
	21,
	2,
	13,
	123,
	5,
	4,
	0,
	2,
	1,
	2,
	6,
	2,
	0,
	9,
	9,
	49,
	4,
	2,
	1,
	2,
	4,
	9,
	9,
	330,
	3,
	10,
	1,
	2,
	0,
	49,
	6,
	4,
	4,
	14,
	10,
	5350,
	0,
	7,
	14,
	11465,
	27,
	2343,
	9,
	87,
	9,
	39,
	4,
	60,
	6,
	26,
	9,
	535,
	9,
	470,
	0,
	2,
	54,
	8,
	3,
	82,
	0,
	12,
	1,
	19628,
	1,
	4178,
	9,
	519,
	45,
	3,
	22,
	543,
	4,
	4,
	5,
	9,
	7,
	3,
	6,
	31,
	3,
	149,
	2,
	1418,
	49,
	513,
	54,
	5,
	49,
	9,
	0,
	15,
	0,
	23,
	4,
	2,
	14,
	1361,
	6,
	2,
	16,
	3,
	6,
	2,
	1,
	2,
	4,
	101,
	0,
	161,
	6,
	10,
	9,
	357,
	0,
	62,
	13,
	499,
	13,
	245,
	1,
	2,
	9,
	726,
	6,
	110,
	6,
	6,
	9,
	4759,
	9,
	787719,
	239
];
var astralIdentifierStartCodes = [
	0,
	11,
	2,
	25,
	2,
	18,
	2,
	1,
	2,
	14,
	3,
	13,
	35,
	122,
	70,
	52,
	268,
	28,
	4,
	48,
	48,
	31,
	14,
	29,
	6,
	37,
	11,
	29,
	3,
	35,
	5,
	7,
	2,
	4,
	43,
	157,
	19,
	35,
	5,
	35,
	5,
	39,
	9,
	51,
	13,
	10,
	2,
	14,
	2,
	6,
	2,
	1,
	2,
	10,
	2,
	14,
	2,
	6,
	2,
	1,
	4,
	51,
	13,
	310,
	10,
	21,
	11,
	7,
	25,
	5,
	2,
	41,
	2,
	8,
	70,
	5,
	3,
	0,
	2,
	43,
	2,
	1,
	4,
	0,
	3,
	22,
	11,
	22,
	10,
	30,
	66,
	18,
	2,
	1,
	11,
	21,
	11,
	25,
	71,
	55,
	7,
	1,
	65,
	0,
	16,
	3,
	2,
	2,
	2,
	28,
	43,
	28,
	4,
	28,
	36,
	7,
	2,
	27,
	28,
	53,
	11,
	21,
	11,
	18,
	14,
	17,
	111,
	72,
	56,
	50,
	14,
	50,
	14,
	35,
	39,
	27,
	10,
	22,
	251,
	41,
	7,
	1,
	17,
	2,
	60,
	28,
	11,
	0,
	9,
	21,
	43,
	17,
	47,
	20,
	28,
	22,
	13,
	52,
	58,
	1,
	3,
	0,
	14,
	44,
	33,
	24,
	27,
	35,
	30,
	0,
	3,
	0,
	9,
	34,
	4,
	0,
	13,
	47,
	15,
	3,
	22,
	0,
	2,
	0,
	36,
	17,
	2,
	24,
	20,
	1,
	64,
	6,
	2,
	0,
	2,
	3,
	2,
	14,
	2,
	9,
	8,
	46,
	39,
	7,
	3,
	1,
	3,
	21,
	2,
	6,
	2,
	1,
	2,
	4,
	4,
	0,
	19,
	0,
	13,
	4,
	31,
	9,
	2,
	0,
	3,
	0,
	2,
	37,
	2,
	0,
	26,
	0,
	2,
	0,
	45,
	52,
	19,
	3,
	21,
	2,
	31,
	47,
	21,
	1,
	2,
	0,
	185,
	46,
	42,
	3,
	37,
	47,
	21,
	0,
	60,
	42,
	14,
	0,
	72,
	26,
	38,
	6,
	186,
	43,
	117,
	63,
	32,
	7,
	3,
	0,
	3,
	7,
	2,
	1,
	2,
	23,
	16,
	0,
	2,
	0,
	95,
	7,
	3,
	38,
	17,
	0,
	2,
	0,
	29,
	0,
	11,
	39,
	8,
	0,
	22,
	0,
	12,
	45,
	20,
	0,
	19,
	72,
	200,
	32,
	32,
	8,
	2,
	36,
	18,
	0,
	50,
	29,
	113,
	6,
	2,
	1,
	2,
	37,
	22,
	0,
	26,
	5,
	2,
	1,
	2,
	31,
	15,
	0,
	328,
	18,
	16,
	0,
	2,
	12,
	2,
	33,
	125,
	0,
	80,
	921,
	103,
	110,
	18,
	195,
	2637,
	96,
	16,
	1071,
	18,
	5,
	26,
	3994,
	6,
	582,
	6842,
	29,
	1763,
	568,
	8,
	30,
	18,
	78,
	18,
	29,
	19,
	47,
	17,
	3,
	32,
	20,
	6,
	18,
	433,
	44,
	212,
	63,
	129,
	74,
	6,
	0,
	67,
	12,
	65,
	1,
	2,
	0,
	29,
	6135,
	9,
	1237,
	42,
	9,
	8936,
	3,
	2,
	6,
	2,
	1,
	2,
	290,
	16,
	0,
	30,
	2,
	3,
	0,
	15,
	3,
	9,
	395,
	2309,
	106,
	6,
	12,
	4,
	8,
	8,
	9,
	5991,
	84,
	2,
	70,
	2,
	1,
	3,
	0,
	3,
	1,
	3,
	3,
	2,
	11,
	2,
	0,
	2,
	6,
	2,
	64,
	2,
	3,
	3,
	7,
	2,
	6,
	2,
	27,
	2,
	3,
	2,
	4,
	2,
	0,
	4,
	6,
	2,
	339,
	3,
	24,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	30,
	2,
	24,
	2,
	7,
	1845,
	30,
	7,
	5,
	262,
	61,
	147,
	44,
	11,
	6,
	17,
	0,
	322,
	29,
	19,
	43,
	485,
	27,
	229,
	29,
	3,
	0,
	496,
	6,
	2,
	3,
	2,
	1,
	2,
	14,
	2,
	196,
	60,
	67,
	8,
	0,
	1205,
	3,
	2,
	26,
	2,
	1,
	2,
	0,
	3,
	0,
	2,
	9,
	2,
	3,
	2,
	0,
	2,
	0,
	7,
	0,
	5,
	0,
	2,
	0,
	2,
	0,
	2,
	2,
	2,
	1,
	2,
	0,
	3,
	0,
	2,
	0,
	2,
	0,
	2,
	0,
	2,
	0,
	2,
	1,
	2,
	0,
	3,
	3,
	2,
	6,
	2,
	3,
	2,
	3,
	2,
	0,
	2,
	9,
	2,
	16,
	6,
	2,
	2,
	4,
	2,
	16,
	4421,
	42719,
	33,
	4153,
	7,
	221,
	3,
	5761,
	15,
	7472,
	16,
	621,
	2467,
	541,
	1507,
	4938,
	6,
	4191
];
var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var reservedWords = {
	3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	5: "class enum extends super const export import",
	6: "enum",
	strict: "implements interface let package private protected public static yield",
	strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
	5: ecma5AndLessKeywords,
	"5module": ecma5AndLessKeywords + " export import",
	6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = /* @__PURE__ */ new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = /* @__PURE__ */ new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code, set) {
	var pos = 65536;
	for (var i = 0; i < set.length; i += 2) {
		pos += set[i];
		if (pos > code) return false;
		pos += set[i + 1];
		if (pos >= code) return true;
	}
	return false;
}
function isIdentifierStart(code, astral) {
	if (code < 65) return code === 36;
	if (code < 91) return true;
	if (code < 97) return code === 95;
	if (code < 123) return true;
	if (code <= 65535) return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
	if (astral === false) return false;
	return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
	if (code < 48) return code === 36;
	if (code < 58) return true;
	if (code < 65) return false;
	if (code < 91) return true;
	if (code < 97) return code === 95;
	if (code < 123) return true;
	if (code <= 65535) return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
	if (astral === false) return false;
	return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType(label, conf) {
	if (conf === void 0) conf = {};
	this.label = label;
	this.keyword = conf.keyword;
	this.beforeExpr = !!conf.beforeExpr;
	this.startsExpr = !!conf.startsExpr;
	this.isLoop = !!conf.isLoop;
	this.isAssign = !!conf.isAssign;
	this.prefix = !!conf.prefix;
	this.postfix = !!conf.postfix;
	this.binop = conf.binop || null;
	this.updateContext = null;
};
function binop(name, prec) {
	return new TokenType(name, {
		beforeExpr: true,
		binop: prec
	});
}
var beforeExpr = { beforeExpr: true }, startsExpr = { startsExpr: true };
var keywords = {};
function kw(name, options) {
	if (options === void 0) options = {};
	options.keyword = name;
	return keywords[name] = new TokenType(name, options);
}
var types$1 = {
	num: new TokenType("num", startsExpr),
	regexp: new TokenType("regexp", startsExpr),
	string: new TokenType("string", startsExpr),
	name: new TokenType("name", startsExpr),
	privateId: new TokenType("privateId", startsExpr),
	eof: new TokenType("eof"),
	bracketL: new TokenType("[", {
		beforeExpr: true,
		startsExpr: true
	}),
	bracketR: new TokenType("]"),
	braceL: new TokenType("{", {
		beforeExpr: true,
		startsExpr: true
	}),
	braceR: new TokenType("}"),
	parenL: new TokenType("(", {
		beforeExpr: true,
		startsExpr: true
	}),
	parenR: new TokenType(")"),
	comma: new TokenType(",", beforeExpr),
	semi: new TokenType(";", beforeExpr),
	colon: new TokenType(":", beforeExpr),
	dot: new TokenType("."),
	question: new TokenType("?", beforeExpr),
	questionDot: new TokenType("?."),
	arrow: new TokenType("=>", beforeExpr),
	template: new TokenType("template"),
	invalidTemplate: new TokenType("invalidTemplate"),
	ellipsis: new TokenType("...", beforeExpr),
	backQuote: new TokenType("`", startsExpr),
	dollarBraceL: new TokenType("${", {
		beforeExpr: true,
		startsExpr: true
	}),
	eq: new TokenType("=", {
		beforeExpr: true,
		isAssign: true
	}),
	assign: new TokenType("_=", {
		beforeExpr: true,
		isAssign: true
	}),
	incDec: new TokenType("++/--", {
		prefix: true,
		postfix: true,
		startsExpr: true
	}),
	prefix: new TokenType("!/~", {
		beforeExpr: true,
		prefix: true,
		startsExpr: true
	}),
	logicalOR: binop("||", 1),
	logicalAND: binop("&&", 2),
	bitwiseOR: binop("|", 3),
	bitwiseXOR: binop("^", 4),
	bitwiseAND: binop("&", 5),
	equality: binop("==/!=/===/!==", 6),
	relational: binop("</>/<=/>=", 7),
	bitShift: binop("<</>>/>>>", 8),
	plusMin: new TokenType("+/-", {
		beforeExpr: true,
		binop: 9,
		prefix: true,
		startsExpr: true
	}),
	modulo: binop("%", 10),
	star: binop("*", 10),
	slash: binop("/", 10),
	starstar: new TokenType("**", { beforeExpr: true }),
	coalesce: binop("??", 1),
	_break: kw("break"),
	_case: kw("case", beforeExpr),
	_catch: kw("catch"),
	_continue: kw("continue"),
	_debugger: kw("debugger"),
	_default: kw("default", beforeExpr),
	_do: kw("do", {
		isLoop: true,
		beforeExpr: true
	}),
	_else: kw("else", beforeExpr),
	_finally: kw("finally"),
	_for: kw("for", { isLoop: true }),
	_function: kw("function", startsExpr),
	_if: kw("if"),
	_return: kw("return", beforeExpr),
	_switch: kw("switch"),
	_throw: kw("throw", beforeExpr),
	_try: kw("try"),
	_var: kw("var"),
	_const: kw("const"),
	_while: kw("while", { isLoop: true }),
	_with: kw("with"),
	_new: kw("new", {
		beforeExpr: true,
		startsExpr: true
	}),
	_this: kw("this", startsExpr),
	_super: kw("super", startsExpr),
	_class: kw("class", startsExpr),
	_extends: kw("extends", beforeExpr),
	_export: kw("export"),
	_import: kw("import", startsExpr),
	_null: kw("null", startsExpr),
	_true: kw("true", startsExpr),
	_false: kw("false", startsExpr),
	_in: kw("in", {
		beforeExpr: true,
		binop: 7
	}),
	_instanceof: kw("instanceof", {
		beforeExpr: true,
		binop: 7
	}),
	_typeof: kw("typeof", {
		beforeExpr: true,
		prefix: true,
		startsExpr: true
	}),
	_void: kw("void", {
		beforeExpr: true,
		prefix: true,
		startsExpr: true
	}),
	_delete: kw("delete", {
		beforeExpr: true,
		prefix: true,
		startsExpr: true
	})
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
	return code === 10 || code === 13 || code === 8232 || code === 8233;
}
function nextLineBreak(code, from, end) {
	if (end === void 0) end = code.length;
	for (var i = from; i < end; i++) {
		var next = code.charCodeAt(i);
		if (isNewLine(next)) return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1;
	}
	return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty$2 = ref.hasOwnProperty;
var toString$1 = ref.toString;
var hasOwn = Object.hasOwn || (function(obj, propName) {
	return hasOwnProperty$2.call(obj, propName);
});
var isArray$1 = Array.isArray || (function(obj) {
	return toString$1.call(obj) === "[object Array]";
});
var regexpCache = Object.create(null);
function wordsRegexp(words) {
	return regexpCache[words] || (regexpCache[words] = /* @__PURE__ */ new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code) {
	if (code <= 65535) return String.fromCharCode(code);
	code -= 65536;
	return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position(line, col) {
	this.line = line;
	this.column = col;
};
Position.prototype.offset = function offset(n$2) {
	return new Position(this.line, this.column + n$2);
};
var SourceLocation = function SourceLocation(p$1, start, end) {
	this.start = start;
	this.end = end;
	if (p$1.sourceFile !== null) this.source = p$1.sourceFile;
};
function getLineInfo(input, offset) {
	for (var line = 1, cur = 0;;) {
		var nextBreak = nextLineBreak(input, cur, offset);
		if (nextBreak < 0) return new Position(line, offset - cur);
		++line;
		cur = nextBreak;
	}
}
var defaultOptions = {
	ecmaVersion: null,
	sourceType: "script",
	onInsertedSemicolon: null,
	onTrailingComma: null,
	allowReserved: null,
	allowReturnOutsideFunction: false,
	allowImportExportEverywhere: false,
	allowAwaitOutsideFunction: null,
	allowSuperOutsideMethod: null,
	allowHashBang: false,
	checkPrivateFields: true,
	locations: false,
	onToken: null,
	onComment: null,
	ranges: false,
	program: null,
	sourceFile: null,
	directSourceFile: null,
	preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
	var options = {};
	for (var opt in defaultOptions) options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
	if (options.ecmaVersion === "latest") options.ecmaVersion = 1e8;
	else if (options.ecmaVersion == null) {
		if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
			warnedAboutEcmaVersion = true;
			console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
		}
		options.ecmaVersion = 11;
	} else if (options.ecmaVersion >= 2015) options.ecmaVersion -= 2009;
	if (options.allowReserved == null) options.allowReserved = options.ecmaVersion < 5;
	if (!opts || opts.allowHashBang == null) options.allowHashBang = options.ecmaVersion >= 14;
	if (isArray$1(options.onToken)) {
		var tokens = options.onToken;
		options.onToken = function(token) {
			return tokens.push(token);
		};
	}
	if (isArray$1(options.onComment)) options.onComment = pushComment(options, options.onComment);
	return options;
}
function pushComment(options, array) {
	return function(block, text, start, end, startLoc, endLoc) {
		var comment = {
			type: block ? "Block" : "Line",
			value: text,
			start,
			end
		};
		if (options.locations) comment.loc = new SourceLocation(this, startLoc, endLoc);
		if (options.ranges) comment.range = [start, end];
		array.push(comment);
	};
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_CLASS_FIELD_INIT = 512, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
	return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5;
var Parser = function Parser(options, input, startPos) {
	this.options = options = getOptions(options);
	this.sourceFile = options.sourceFile;
	this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
	var reserved = "";
	if (options.allowReserved !== true) {
		reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
		if (options.sourceType === "module") reserved += " await";
	}
	this.reservedWords = wordsRegexp(reserved);
	var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
	this.reservedWordsStrict = wordsRegexp(reservedStrict);
	this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
	this.input = String(input);
	this.containsEsc = false;
	if (startPos) {
		this.pos = startPos;
		this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
		this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
	} else {
		this.pos = this.lineStart = 0;
		this.curLine = 1;
	}
	this.type = types$1.eof;
	this.value = null;
	this.start = this.end = this.pos;
	this.startLoc = this.endLoc = this.curPosition();
	this.lastTokEndLoc = this.lastTokStartLoc = null;
	this.lastTokStart = this.lastTokEnd = this.pos;
	this.context = this.initialContext();
	this.exprAllowed = true;
	this.inModule = options.sourceType === "module";
	this.strict = this.inModule || this.strictDirective(this.pos);
	this.potentialArrowAt = -1;
	this.potentialArrowInForAwait = false;
	this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
	this.labels = [];
	this.undefinedExports = Object.create(null);
	if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") this.skipLineComment(2);
	this.scopeStack = [];
	this.enterScope(SCOPE_TOP);
	this.regexpState = null;
	this.privateNameStack = [];
};
var prototypeAccessors = {
	inFunction: { configurable: true },
	inGenerator: { configurable: true },
	inAsync: { configurable: true },
	canAwait: { configurable: true },
	allowSuper: { configurable: true },
	allowDirectSuper: { configurable: true },
	treatFunctionsAsVar: { configurable: true },
	allowNewDotTarget: { configurable: true },
	inClassStaticBlock: { configurable: true }
};
Parser.prototype.parse = function parse() {
	var node = this.options.program || this.startNode();
	this.nextToken();
	return this.parseTopLevel(node);
};
prototypeAccessors.inFunction.get = function() {
	return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
	return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
	return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.canAwait.get = function() {
	for (var i = this.scopeStack.length - 1; i >= 0; i--) {
		var flags = this.scopeStack[i].flags;
		if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) return false;
		if (flags & SCOPE_FUNCTION) return (flags & SCOPE_ASYNC) > 0;
	}
	return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
	return (this.currentThisScope().flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
	return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
	return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
	for (var i = this.scopeStack.length - 1; i >= 0; i--) {
		var flags = this.scopeStack[i].flags;
		if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) return true;
	}
	return false;
};
prototypeAccessors.inClassStaticBlock.get = function() {
	return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend() {
	var plugins$1 = [], len = arguments.length;
	while (len--) plugins$1[len] = arguments[len];
	var cls = this;
	for (var i = 0; i < plugins$1.length; i++) cls = plugins$1[i](cls);
	return cls;
};
Parser.parse = function parse(input, options) {
	return new this(options, input).parse();
};
Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
	var parser = new this(options, input, pos);
	parser.nextToken();
	return parser.parseExpression();
};
Parser.tokenizer = function tokenizer(input, options) {
	return new this(options, input);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
	if (this.options.ecmaVersion < 5) return false;
	for (;;) {
		skipWhiteSpace.lastIndex = start;
		start += skipWhiteSpace.exec(this.input)[0].length;
		var match = literal.exec(this.input.slice(start));
		if (!match) return false;
		if ((match[1] || match[2]) === "use strict") {
			skipWhiteSpace.lastIndex = start + match[0].length;
			var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
			var next = this.input.charAt(end);
			return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
		}
		start += match[0].length;
		skipWhiteSpace.lastIndex = start;
		start += skipWhiteSpace.exec(this.input)[0].length;
		if (this.input[start] === ";") start++;
	}
};
pp$9.eat = function(type$1) {
	if (this.type === type$1) {
		this.next();
		return true;
	} else return false;
};
pp$9.isContextual = function(name) {
	return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
	if (!this.isContextual(name)) return false;
	this.next();
	return true;
};
pp$9.expectContextual = function(name) {
	if (!this.eatContextual(name)) this.unexpected();
};
pp$9.canInsertSemicolon = function() {
	return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
	if (this.canInsertSemicolon()) {
		if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
		return true;
	}
};
pp$9.semicolon = function() {
	if (!this.eat(types$1.semi) && !this.insertSemicolon()) this.unexpected();
};
pp$9.afterTrailingComma = function(tokType, notNext) {
	if (this.type === tokType) {
		if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
		if (!notNext) this.next();
		return true;
	}
};
pp$9.expect = function(type$1) {
	this.eat(type$1) || this.unexpected();
};
pp$9.unexpected = function(pos) {
	this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors() {
	this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
	if (!refDestructuringErrors) return;
	if (refDestructuringErrors.trailingComma > -1) this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
	var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
	if (parens > -1) this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
	if (!refDestructuringErrors) return false;
	var shorthandAssign = refDestructuringErrors.shorthandAssign;
	var doubleProto = refDestructuringErrors.doubleProto;
	if (!andThrow) return shorthandAssign >= 0 || doubleProto >= 0;
	if (shorthandAssign >= 0) this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
	if (doubleProto >= 0) this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
};
pp$9.checkYieldAwaitInDefaultParams = function() {
	if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) this.raise(this.yieldPos, "Yield expression cannot be a default value");
	if (this.awaitPos) this.raise(this.awaitPos, "Await expression cannot be a default value");
};
pp$9.isSimpleAssignTarget = function(expr) {
	if (expr.type === "ParenthesizedExpression") return this.isSimpleAssignTarget(expr.expression);
	return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
	var exports = Object.create(null);
	if (!node.body) node.body = [];
	while (this.type !== types$1.eof) {
		var stmt = this.parseStatement(null, true, exports);
		node.body.push(stmt);
	}
	if (this.inModule) for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1) {
		var name = list[i];
		this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
	}
	this.adaptDirectivePrologue(node.body);
	this.next();
	node.sourceType = this.options.sourceType;
	return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
	if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return false;
	skipWhiteSpace.lastIndex = this.pos;
	var skip = skipWhiteSpace.exec(this.input);
	var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
	if (nextCh === 91 || nextCh === 92) return true;
	if (context) return false;
	if (nextCh === 123 || nextCh > 55295 && nextCh < 56320) return true;
	if (isIdentifierStart(nextCh, true)) {
		var pos = next + 1;
		while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) ++pos;
		if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) return true;
		var ident = this.input.slice(next, pos);
		if (!keywordRelationalOperator.test(ident)) return true;
	}
	return false;
};
pp$8.isAsyncFunction = function() {
	if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return false;
	skipWhiteSpace.lastIndex = this.pos;
	var skip = skipWhiteSpace.exec(this.input);
	var next = this.pos + skip[0].length, after;
	return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
};
pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
	if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using")) return false;
	skipWhiteSpace.lastIndex = this.pos;
	var skip = skipWhiteSpace.exec(this.input);
	var next = this.pos + skip[0].length;
	if (lineBreak.test(this.input.slice(this.pos, next))) return false;
	if (isAwaitUsing) {
		var awaitEndPos = next + 5, after;
		if (this.input.slice(next, awaitEndPos) !== "using" || awaitEndPos === this.input.length || isIdentifierChar(after = this.input.charCodeAt(awaitEndPos)) || after > 55295 && after < 56320) return false;
		skipWhiteSpace.lastIndex = awaitEndPos;
		var skipAfterUsing = skipWhiteSpace.exec(this.input);
		if (skipAfterUsing && lineBreak.test(this.input.slice(awaitEndPos, awaitEndPos + skipAfterUsing[0].length))) return false;
	}
	if (isFor) {
		var ofEndPos = next + 2, after$1;
		if (this.input.slice(next, ofEndPos) === "of") {
			if (ofEndPos === this.input.length || !isIdentifierChar(after$1 = this.input.charCodeAt(ofEndPos)) && !(after$1 > 55295 && after$1 < 56320)) return false;
		}
	}
	var ch = this.input.charCodeAt(next);
	return isIdentifierStart(ch, true) || ch === 92;
};
pp$8.isAwaitUsing = function(isFor) {
	return this.isUsingKeyword(true, isFor);
};
pp$8.isUsing = function(isFor) {
	return this.isUsingKeyword(false, isFor);
};
pp$8.parseStatement = function(context, topLevel, exports) {
	var starttype = this.type, node = this.startNode(), kind;
	if (this.isLet(context)) {
		starttype = types$1._var;
		kind = "let";
	}
	switch (starttype) {
		case types$1._break:
		case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword);
		case types$1._debugger: return this.parseDebuggerStatement(node);
		case types$1._do: return this.parseDoStatement(node);
		case types$1._for: return this.parseForStatement(node);
		case types$1._function:
			if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) this.unexpected();
			return this.parseFunctionStatement(node, false, !context);
		case types$1._class:
			if (context) this.unexpected();
			return this.parseClass(node, true);
		case types$1._if: return this.parseIfStatement(node);
		case types$1._return: return this.parseReturnStatement(node);
		case types$1._switch: return this.parseSwitchStatement(node);
		case types$1._throw: return this.parseThrowStatement(node);
		case types$1._try: return this.parseTryStatement(node);
		case types$1._const:
		case types$1._var:
			kind = kind || this.value;
			if (context && kind !== "var") this.unexpected();
			return this.parseVarStatement(node, kind);
		case types$1._while: return this.parseWhileStatement(node);
		case types$1._with: return this.parseWithStatement(node);
		case types$1.braceL: return this.parseBlock(true, node);
		case types$1.semi: return this.parseEmptyStatement(node);
		case types$1._export:
		case types$1._import:
			if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
				skipWhiteSpace.lastIndex = this.pos;
				var skip = skipWhiteSpace.exec(this.input);
				var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
				if (nextCh === 40 || nextCh === 46) return this.parseExpressionStatement(node, this.parseExpression());
			}
			if (!this.options.allowImportExportEverywhere) {
				if (!topLevel) this.raise(this.start, "'import' and 'export' may only appear at the top level");
				if (!this.inModule) this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
			}
			return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);
		default:
			if (this.isAsyncFunction()) {
				if (context) this.unexpected();
				this.next();
				return this.parseFunctionStatement(node, true, !context);
			}
			var usingKind = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
			if (usingKind) {
				if (topLevel && this.options.sourceType === "script") this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script`");
				if (usingKind === "await using") {
					if (!this.canAwait) this.raise(this.start, "Await using cannot appear outside of async function");
					this.next();
				}
				this.next();
				this.parseVar(node, false, usingKind);
				this.semicolon();
				return this.finishNode(node, "VariableDeclaration");
			}
			var maybeName = this.value, expr = this.parseExpression();
			if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) return this.parseLabeledStatement(node, maybeName, expr, context);
			else return this.parseExpressionStatement(node, expr);
	}
};
pp$8.parseBreakContinueStatement = function(node, keyword) {
	var isBreak = keyword === "break";
	this.next();
	if (this.eat(types$1.semi) || this.insertSemicolon()) node.label = null;
	else if (this.type !== types$1.name) this.unexpected();
	else {
		node.label = this.parseIdent();
		this.semicolon();
	}
	var i = 0;
	for (; i < this.labels.length; ++i) {
		var lab = this.labels[i];
		if (node.label == null || lab.name === node.label.name) {
			if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
			if (node.label && isBreak) break;
		}
	}
	if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
	return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
	this.next();
	this.semicolon();
	return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
	this.next();
	this.labels.push(loopLabel);
	node.body = this.parseStatement("do");
	this.labels.pop();
	this.expect(types$1._while);
	node.test = this.parseParenExpression();
	if (this.options.ecmaVersion >= 6) this.eat(types$1.semi);
	else this.semicolon();
	return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
	this.next();
	var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
	this.labels.push(loopLabel);
	this.enterScope(0);
	this.expect(types$1.parenL);
	if (this.type === types$1.semi) {
		if (awaitAt > -1) this.unexpected(awaitAt);
		return this.parseFor(node, null);
	}
	var isLet = this.isLet();
	if (this.type === types$1._var || this.type === types$1._const || isLet) {
		var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
		this.next();
		this.parseVar(init$1, true, kind);
		this.finishNode(init$1, "VariableDeclaration");
		return this.parseForAfterInit(node, init$1, awaitAt);
	}
	var startsWithLet = this.isContextual("let"), isForOf = false;
	var usingKind = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
	if (usingKind) {
		var init$2 = this.startNode();
		this.next();
		if (usingKind === "await using") this.next();
		this.parseVar(init$2, true, usingKind);
		this.finishNode(init$2, "VariableDeclaration");
		return this.parseForAfterInit(node, init$2, awaitAt);
	}
	var containsEsc = this.containsEsc;
	var refDestructuringErrors = new DestructuringErrors();
	var initPos = this.start;
	var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
	if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
		if (awaitAt > -1) {
			if (this.type === types$1._in) this.unexpected(awaitAt);
			node.await = true;
		} else if (isForOf && this.options.ecmaVersion >= 8) {
			if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") this.unexpected();
			else if (this.options.ecmaVersion >= 9) node.await = false;
		}
		if (startsWithLet && isForOf) this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
		this.toAssignable(init, false, refDestructuringErrors);
		this.checkLValPattern(init);
		return this.parseForIn(node, init);
	} else this.checkExpressionErrors(refDestructuringErrors, true);
	if (awaitAt > -1) this.unexpected(awaitAt);
	return this.parseFor(node, init);
};
pp$8.parseForAfterInit = function(node, init, awaitAt) {
	if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1) {
		if (this.options.ecmaVersion >= 9) if (this.type === types$1._in) {
			if (awaitAt > -1) this.unexpected(awaitAt);
		} else node.await = awaitAt > -1;
		return this.parseForIn(node, init);
	}
	if (awaitAt > -1) this.unexpected(awaitAt);
	return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
	this.next();
	return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
	this.next();
	node.test = this.parseParenExpression();
	node.consequent = this.parseStatement("if");
	node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
	return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
	if (!this.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
	this.next();
	if (this.eat(types$1.semi) || this.insertSemicolon()) node.argument = null;
	else {
		node.argument = this.parseExpression();
		this.semicolon();
	}
	return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
	this.next();
	node.discriminant = this.parseParenExpression();
	node.cases = [];
	this.expect(types$1.braceL);
	this.labels.push(switchLabel);
	this.enterScope(0);
	var cur;
	for (var sawDefault = false; this.type !== types$1.braceR;) if (this.type === types$1._case || this.type === types$1._default) {
		var isCase = this.type === types$1._case;
		if (cur) this.finishNode(cur, "SwitchCase");
		node.cases.push(cur = this.startNode());
		cur.consequent = [];
		this.next();
		if (isCase) cur.test = this.parseExpression();
		else {
			if (sawDefault) this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
			sawDefault = true;
			cur.test = null;
		}
		this.expect(types$1.colon);
	} else {
		if (!cur) this.unexpected();
		cur.consequent.push(this.parseStatement(null));
	}
	this.exitScope();
	if (cur) this.finishNode(cur, "SwitchCase");
	this.next();
	this.labels.pop();
	return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
	this.next();
	if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) this.raise(this.lastTokEnd, "Illegal newline after throw");
	node.argument = this.parseExpression();
	this.semicolon();
	return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
	var param = this.parseBindingAtom();
	var simple = param.type === "Identifier";
	this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
	this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
	this.expect(types$1.parenR);
	return param;
};
pp$8.parseTryStatement = function(node) {
	this.next();
	node.block = this.parseBlock();
	node.handler = null;
	if (this.type === types$1._catch) {
		var clause = this.startNode();
		this.next();
		if (this.eat(types$1.parenL)) clause.param = this.parseCatchClauseParam();
		else {
			if (this.options.ecmaVersion < 10) this.unexpected();
			clause.param = null;
			this.enterScope(0);
		}
		clause.body = this.parseBlock(false);
		this.exitScope();
		node.handler = this.finishNode(clause, "CatchClause");
	}
	node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
	if (!node.handler && !node.finalizer) this.raise(node.start, "Missing catch or finally clause");
	return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
	this.next();
	this.parseVar(node, false, kind, allowMissingInitializer);
	this.semicolon();
	return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
	this.next();
	node.test = this.parseParenExpression();
	this.labels.push(loopLabel);
	node.body = this.parseStatement("while");
	this.labels.pop();
	return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
	if (this.strict) this.raise(this.start, "'with' in strict mode");
	this.next();
	node.object = this.parseParenExpression();
	node.body = this.parseStatement("with");
	return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
	this.next();
	return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
	for (var i$1$1 = 0, list = this.labels; i$1$1 < list.length; i$1$1 += 1) if (list[i$1$1].name === maybeName) this.raise(expr.start, "Label '" + maybeName + "' is already declared");
	var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
	for (var i = this.labels.length - 1; i >= 0; i--) {
		var label$1 = this.labels[i];
		if (label$1.statementStart === node.start) {
			label$1.statementStart = this.start;
			label$1.kind = kind;
		} else break;
	}
	this.labels.push({
		name: maybeName,
		kind,
		statementStart: this.start
	});
	node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
	this.labels.pop();
	node.label = expr;
	return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
	node.expression = expr;
	this.semicolon();
	return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
	if (createNewLexicalScope === void 0) createNewLexicalScope = true;
	if (node === void 0) node = this.startNode();
	node.body = [];
	this.expect(types$1.braceL);
	if (createNewLexicalScope) this.enterScope(0);
	while (this.type !== types$1.braceR) {
		var stmt = this.parseStatement(null);
		node.body.push(stmt);
	}
	if (exitStrict) this.strict = false;
	this.next();
	if (createNewLexicalScope) this.exitScope();
	return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
	node.init = init;
	this.expect(types$1.semi);
	node.test = this.type === types$1.semi ? null : this.parseExpression();
	this.expect(types$1.semi);
	node.update = this.type === types$1.parenR ? null : this.parseExpression();
	this.expect(types$1.parenR);
	node.body = this.parseStatement("for");
	this.exitScope();
	this.labels.pop();
	return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
	var isForIn = this.type === types$1._in;
	this.next();
	if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) this.raise(init.start, (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer");
	node.left = init;
	node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
	this.expect(types$1.parenR);
	node.body = this.parseStatement("for");
	this.exitScope();
	this.labels.pop();
	return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
	node.declarations = [];
	node.kind = kind;
	for (;;) {
		var decl = this.startNode();
		this.parseVarId(decl, kind);
		if (this.eat(types$1.eq)) decl.init = this.parseMaybeAssign(isFor);
		else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) this.unexpected();
		else if (!allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of")) this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration");
		else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
		else decl.init = null;
		node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
		if (!this.eat(types$1.comma)) break;
	}
	return node;
};
pp$8.parseVarId = function(decl, kind) {
	decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom();
	this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
	this.initFunction(node);
	if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
		if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) this.unexpected();
		node.generator = this.eat(types$1.star);
	}
	if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
	if (statement & FUNC_STATEMENT) {
		node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
		if (node.id && !(statement & FUNC_HANGING_STATEMENT)) this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
	}
	var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
	this.yieldPos = 0;
	this.awaitPos = 0;
	this.awaitIdentPos = 0;
	this.enterScope(functionFlags(node.async, node.generator));
	if (!(statement & FUNC_STATEMENT)) node.id = this.type === types$1.name ? this.parseIdent() : null;
	this.parseFunctionParams(node);
	this.parseFunctionBody(node, allowExpressionBody, false, forInit);
	this.yieldPos = oldYieldPos;
	this.awaitPos = oldAwaitPos;
	this.awaitIdentPos = oldAwaitIdentPos;
	return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
	this.expect(types$1.parenL);
	node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
	this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
	this.next();
	var oldStrict = this.strict;
	this.strict = true;
	this.parseClassId(node, isStatement);
	this.parseClassSuper(node);
	var privateNameMap = this.enterClassBody();
	var classBody = this.startNode();
	var hadConstructor = false;
	classBody.body = [];
	this.expect(types$1.braceL);
	while (this.type !== types$1.braceR) {
		var element = this.parseClassElement(node.superClass !== null);
		if (element) {
			classBody.body.push(element);
			if (element.type === "MethodDefinition" && element.kind === "constructor") {
				if (hadConstructor) this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
				hadConstructor = true;
			} else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
		}
	}
	this.strict = oldStrict;
	this.next();
	node.body = this.finishNode(classBody, "ClassBody");
	this.exitClassBody();
	return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
	if (this.eat(types$1.semi)) return null;
	var ecmaVersion = this.options.ecmaVersion;
	var node = this.startNode();
	var keyName = "";
	var isGenerator = false;
	var isAsync = false;
	var kind = "method";
	var isStatic = false;
	if (this.eatContextual("static")) {
		if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
			this.parseClassStaticBlock(node);
			return node;
		}
		if (this.isClassElementNameStart() || this.type === types$1.star) isStatic = true;
		else keyName = "static";
	}
	node.static = isStatic;
	if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) isAsync = true;
	else keyName = "async";
	if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) isGenerator = true;
	if (!keyName && !isAsync && !isGenerator) {
		var lastValue = this.value;
		if (this.eatContextual("get") || this.eatContextual("set")) if (this.isClassElementNameStart()) kind = lastValue;
		else keyName = lastValue;
	}
	if (keyName) {
		node.computed = false;
		node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
		node.key.name = keyName;
		this.finishNode(node.key, "Identifier");
	} else this.parseClassElementName(node);
	if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
		var isConstructor = !node.static && checkKeyName(node, "constructor");
		var allowsDirectSuper = isConstructor && constructorAllowsSuper;
		if (isConstructor && kind !== "method") this.raise(node.key.start, "Constructor can't have get/set modifier");
		node.kind = isConstructor ? "constructor" : kind;
		this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
	} else this.parseClassField(node);
	return node;
};
pp$8.isClassElementNameStart = function() {
	return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
	if (this.type === types$1.privateId) {
		if (this.value === "constructor") this.raise(this.start, "Classes can't have an element named '#constructor'");
		element.computed = false;
		element.key = this.parsePrivateIdent();
	} else this.parsePropertyName(element);
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
	var key = method.key;
	if (method.kind === "constructor") {
		if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
		if (isAsync) this.raise(key.start, "Constructor can't be an async method");
	} else if (method.static && checkKeyName(method, "prototype")) this.raise(key.start, "Classes may not have a static property named prototype");
	var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
	if (method.kind === "get" && value.params.length !== 0) this.raiseRecoverable(value.start, "getter should have no params");
	if (method.kind === "set" && value.params.length !== 1) this.raiseRecoverable(value.start, "setter should have exactly one param");
	if (method.kind === "set" && value.params[0].type === "RestElement") this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
	return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
	if (checkKeyName(field, "constructor")) this.raise(field.key.start, "Classes can't have a field named 'constructor'");
	else if (field.static && checkKeyName(field, "prototype")) this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
	if (this.eat(types$1.eq)) {
		this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
		field.value = this.parseMaybeAssign();
		this.exitScope();
	} else field.value = null;
	this.semicolon();
	return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
	node.body = [];
	var oldLabels = this.labels;
	this.labels = [];
	this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
	while (this.type !== types$1.braceR) {
		var stmt = this.parseStatement(null);
		node.body.push(stmt);
	}
	this.next();
	this.exitScope();
	this.labels = oldLabels;
	return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
	if (this.type === types$1.name) {
		node.id = this.parseIdent();
		if (isStatement) this.checkLValSimple(node.id, BIND_LEXICAL, false);
	} else {
		if (isStatement === true) this.unexpected();
		node.id = null;
	}
};
pp$8.parseClassSuper = function(node) {
	node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
	var element = {
		declared: Object.create(null),
		used: []
	};
	this.privateNameStack.push(element);
	return element.declared;
};
pp$8.exitClassBody = function() {
	var ref = this.privateNameStack.pop();
	var declared = ref.declared;
	var used = ref.used;
	if (!this.options.checkPrivateFields) return;
	var len = this.privateNameStack.length;
	var parent = len === 0 ? null : this.privateNameStack[len - 1];
	for (var i = 0; i < used.length; ++i) {
		var id = used[i];
		if (!hasOwn(declared, id.name)) if (parent) parent.used.push(id);
		else this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
	}
};
function isPrivateNameConflicted(privateNameMap, element) {
	var name = element.key.name;
	var curr = privateNameMap[name];
	var next = "true";
	if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) next = (element.static ? "s" : "i") + element.kind;
	if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
		privateNameMap[name] = "true";
		return false;
	} else if (!curr) {
		privateNameMap[name] = next;
		return false;
	} else return true;
}
function checkKeyName(node, name) {
	var computed = node.computed;
	var key = node.key;
	return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
pp$8.parseExportAllDeclaration = function(node, exports) {
	if (this.options.ecmaVersion >= 11) if (this.eatContextual("as")) {
		node.exported = this.parseModuleExportName();
		this.checkExport(exports, node.exported, this.lastTokStart);
	} else node.exported = null;
	this.expectContextual("from");
	if (this.type !== types$1.string) this.unexpected();
	node.source = this.parseExprAtom();
	if (this.options.ecmaVersion >= 16) node.attributes = this.parseWithClause();
	this.semicolon();
	return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports) {
	this.next();
	if (this.eat(types$1.star)) return this.parseExportAllDeclaration(node, exports);
	if (this.eat(types$1._default)) {
		this.checkExport(exports, "default", this.lastTokStart);
		node.declaration = this.parseExportDefaultDeclaration();
		return this.finishNode(node, "ExportDefaultDeclaration");
	}
	if (this.shouldParseExportStatement()) {
		node.declaration = this.parseExportDeclaration(node);
		if (node.declaration.type === "VariableDeclaration") this.checkVariableExport(exports, node.declaration.declarations);
		else this.checkExport(exports, node.declaration.id, node.declaration.id.start);
		node.specifiers = [];
		node.source = null;
		if (this.options.ecmaVersion >= 16) node.attributes = [];
	} else {
		node.declaration = null;
		node.specifiers = this.parseExportSpecifiers(exports);
		if (this.eatContextual("from")) {
			if (this.type !== types$1.string) this.unexpected();
			node.source = this.parseExprAtom();
			if (this.options.ecmaVersion >= 16) node.attributes = this.parseWithClause();
		} else {
			for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
				var spec = list[i];
				this.checkUnreserved(spec.local);
				this.checkLocalExport(spec.local);
				if (spec.local.type === "Literal") this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
			}
			node.source = null;
			if (this.options.ecmaVersion >= 16) node.attributes = [];
		}
		this.semicolon();
	}
	return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
	return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
	var isAsync;
	if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
		var fNode = this.startNode();
		this.next();
		if (isAsync) this.next();
		return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
	} else if (this.type === types$1._class) {
		var cNode = this.startNode();
		return this.parseClass(cNode, "nullableID");
	} else {
		var declaration = this.parseMaybeAssign();
		this.semicolon();
		return declaration;
	}
};
pp$8.checkExport = function(exports, name, pos) {
	if (!exports) return;
	if (typeof name !== "string") name = name.type === "Identifier" ? name.name : name.value;
	if (hasOwn(exports, name)) this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
	exports[name] = true;
};
pp$8.checkPatternExport = function(exports, pat) {
	var type$1 = pat.type;
	if (type$1 === "Identifier") this.checkExport(exports, pat, pat.start);
	else if (type$1 === "ObjectPattern") for (var i = 0, list = pat.properties; i < list.length; i += 1) {
		var prop = list[i];
		this.checkPatternExport(exports, prop);
	}
	else if (type$1 === "ArrayPattern") for (var i$1$1 = 0, list$1 = pat.elements; i$1$1 < list$1.length; i$1$1 += 1) {
		var elt = list$1[i$1$1];
		if (elt) this.checkPatternExport(exports, elt);
	}
	else if (type$1 === "Property") this.checkPatternExport(exports, pat.value);
	else if (type$1 === "AssignmentPattern") this.checkPatternExport(exports, pat.left);
	else if (type$1 === "RestElement") this.checkPatternExport(exports, pat.argument);
};
pp$8.checkVariableExport = function(exports, decls) {
	if (!exports) return;
	for (var i = 0, list = decls; i < list.length; i += 1) {
		var decl = list[i];
		this.checkPatternExport(exports, decl.id);
	}
};
pp$8.shouldParseExportStatement = function() {
	return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports) {
	var node = this.startNode();
	node.local = this.parseModuleExportName();
	node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
	this.checkExport(exports, node.exported, node.exported.start);
	return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports) {
	var nodes = [], first = true;
	this.expect(types$1.braceL);
	while (!this.eat(types$1.braceR)) {
		if (!first) {
			this.expect(types$1.comma);
			if (this.afterTrailingComma(types$1.braceR)) break;
		} else first = false;
		nodes.push(this.parseExportSpecifier(exports));
	}
	return nodes;
};
pp$8.parseImport = function(node) {
	this.next();
	if (this.type === types$1.string) {
		node.specifiers = empty$1;
		node.source = this.parseExprAtom();
	} else {
		node.specifiers = this.parseImportSpecifiers();
		this.expectContextual("from");
		node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
	}
	if (this.options.ecmaVersion >= 16) node.attributes = this.parseWithClause();
	this.semicolon();
	return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
	var node = this.startNode();
	node.imported = this.parseModuleExportName();
	if (this.eatContextual("as")) node.local = this.parseIdent();
	else {
		this.checkUnreserved(node.imported);
		node.local = node.imported;
	}
	this.checkLValSimple(node.local, BIND_LEXICAL);
	return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
	var node = this.startNode();
	node.local = this.parseIdent();
	this.checkLValSimple(node.local, BIND_LEXICAL);
	return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
	var node = this.startNode();
	this.next();
	this.expectContextual("as");
	node.local = this.parseIdent();
	this.checkLValSimple(node.local, BIND_LEXICAL);
	return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
	var nodes = [], first = true;
	if (this.type === types$1.name) {
		nodes.push(this.parseImportDefaultSpecifier());
		if (!this.eat(types$1.comma)) return nodes;
	}
	if (this.type === types$1.star) {
		nodes.push(this.parseImportNamespaceSpecifier());
		return nodes;
	}
	this.expect(types$1.braceL);
	while (!this.eat(types$1.braceR)) {
		if (!first) {
			this.expect(types$1.comma);
			if (this.afterTrailingComma(types$1.braceR)) break;
		} else first = false;
		nodes.push(this.parseImportSpecifier());
	}
	return nodes;
};
pp$8.parseWithClause = function() {
	var nodes = [];
	if (!this.eat(types$1._with)) return nodes;
	this.expect(types$1.braceL);
	var attributeKeys = {};
	var first = true;
	while (!this.eat(types$1.braceR)) {
		if (!first) {
			this.expect(types$1.comma);
			if (this.afterTrailingComma(types$1.braceR)) break;
		} else first = false;
		var attr = this.parseImportAttribute();
		var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
		if (hasOwn(attributeKeys, keyName)) this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
		attributeKeys[keyName] = true;
		nodes.push(attr);
	}
	return nodes;
};
pp$8.parseImportAttribute = function() {
	var node = this.startNode();
	node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
	this.expect(types$1.colon);
	if (this.type !== types$1.string) this.unexpected();
	node.value = this.parseExprAtom();
	return this.finishNode(node, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
	if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
		var stringLiteral = this.parseLiteral(this.value);
		if (loneSurrogate.test(stringLiteral.value)) this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
		return stringLiteral;
	}
	return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
	for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) statements[i].directive = statements[i].expression.raw.slice(1, -1);
};
pp$8.isDirectiveCandidate = function(statement) {
	return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && (this.input[statement.start] === "\"" || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
	if (this.options.ecmaVersion >= 6 && node) switch (node.type) {
		case "Identifier":
			if (this.inAsync && node.name === "await") this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
			break;
		case "ObjectPattern":
		case "ArrayPattern":
		case "AssignmentPattern":
		case "RestElement": break;
		case "ObjectExpression":
			node.type = "ObjectPattern";
			if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
			for (var i = 0, list = node.properties; i < list.length; i += 1) {
				var prop = list[i];
				this.toAssignable(prop, isBinding);
				if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) this.raise(prop.argument.start, "Unexpected token");
			}
			break;
		case "Property":
			if (node.kind !== "init") this.raise(node.key.start, "Object pattern can't contain getter or setter");
			this.toAssignable(node.value, isBinding);
			break;
		case "ArrayExpression":
			node.type = "ArrayPattern";
			if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
			this.toAssignableList(node.elements, isBinding);
			break;
		case "SpreadElement":
			node.type = "RestElement";
			this.toAssignable(node.argument, isBinding);
			if (node.argument.type === "AssignmentPattern") this.raise(node.argument.start, "Rest elements cannot have a default value");
			break;
		case "AssignmentExpression":
			if (node.operator !== "=") this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
			node.type = "AssignmentPattern";
			delete node.operator;
			this.toAssignable(node.left, isBinding);
			break;
		case "ParenthesizedExpression":
			this.toAssignable(node.expression, isBinding, refDestructuringErrors);
			break;
		case "ChainExpression":
			this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
			break;
		case "MemberExpression": if (!isBinding) break;
		default: this.raise(node.start, "Assigning to rvalue");
	}
	else if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
	return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
	var end = exprList.length;
	for (var i = 0; i < end; i++) {
		var elt = exprList[i];
		if (elt) this.toAssignable(elt, isBinding);
	}
	if (end) {
		var last = exprList[end - 1];
		if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") this.unexpected(last.argument.start);
	}
	return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
	var node = this.startNode();
	this.next();
	node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
	return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
	var node = this.startNode();
	this.next();
	if (this.options.ecmaVersion === 6 && this.type !== types$1.name) this.unexpected();
	node.argument = this.parseBindingAtom();
	return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
	if (this.options.ecmaVersion >= 6) switch (this.type) {
		case types$1.bracketL:
			var node = this.startNode();
			this.next();
			node.elements = this.parseBindingList(types$1.bracketR, true, true);
			return this.finishNode(node, "ArrayPattern");
		case types$1.braceL: return this.parseObj(true);
	}
	return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
	var elts = [], first = true;
	while (!this.eat(close)) {
		if (first) first = false;
		else this.expect(types$1.comma);
		if (allowEmpty && this.type === types$1.comma) elts.push(null);
		else if (allowTrailingComma && this.afterTrailingComma(close)) break;
		else if (this.type === types$1.ellipsis) {
			var rest = this.parseRestBinding();
			this.parseBindingListItem(rest);
			elts.push(rest);
			if (this.type === types$1.comma) this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
			this.expect(close);
			break;
		} else elts.push(this.parseAssignableListItem(allowModifiers));
	}
	return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
	var elem = this.parseMaybeDefault(this.start, this.startLoc);
	this.parseBindingListItem(elem);
	return elem;
};
pp$7.parseBindingListItem = function(param) {
	return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
	left = left || this.parseBindingAtom();
	if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) return left;
	var node = this.startNodeAt(startPos, startLoc);
	node.left = left;
	node.right = this.parseMaybeAssign();
	return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
	if (bindingType === void 0) bindingType = BIND_NONE;
	var isBind = bindingType !== BIND_NONE;
	switch (expr.type) {
		case "Identifier":
			if (this.strict && this.reservedWordsStrictBind.test(expr.name)) this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
			if (isBind) {
				if (bindingType === BIND_LEXICAL && expr.name === "let") this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
				if (checkClashes) {
					if (hasOwn(checkClashes, expr.name)) this.raiseRecoverable(expr.start, "Argument name clash");
					checkClashes[expr.name] = true;
				}
				if (bindingType !== BIND_OUTSIDE) this.declareName(expr.name, bindingType, expr.start);
			}
			break;
		case "ChainExpression":
			this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
			break;
		case "MemberExpression":
			if (isBind) this.raiseRecoverable(expr.start, "Binding member expression");
			break;
		case "ParenthesizedExpression":
			if (isBind) this.raiseRecoverable(expr.start, "Binding parenthesized expression");
			return this.checkLValSimple(expr.expression, bindingType, checkClashes);
		default: this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
	}
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
	if (bindingType === void 0) bindingType = BIND_NONE;
	switch (expr.type) {
		case "ObjectPattern":
			for (var i = 0, list = expr.properties; i < list.length; i += 1) {
				var prop = list[i];
				this.checkLValInnerPattern(prop, bindingType, checkClashes);
			}
			break;
		case "ArrayPattern":
			for (var i$1$1 = 0, list$1 = expr.elements; i$1$1 < list$1.length; i$1$1 += 1) {
				var elem = list$1[i$1$1];
				if (elem) this.checkLValInnerPattern(elem, bindingType, checkClashes);
			}
			break;
		default: this.checkLValSimple(expr, bindingType, checkClashes);
	}
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
	if (bindingType === void 0) bindingType = BIND_NONE;
	switch (expr.type) {
		case "Property":
			this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
			break;
		case "AssignmentPattern":
			this.checkLValPattern(expr.left, bindingType, checkClashes);
			break;
		case "RestElement":
			this.checkLValPattern(expr.argument, bindingType, checkClashes);
			break;
		default: this.checkLValPattern(expr, bindingType, checkClashes);
	}
};
var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
	this.token = token;
	this.isExpr = !!isExpr;
	this.preserveSpace = !!preserveSpace;
	this.override = override;
	this.generator = !!generator;
};
var types = {
	b_stat: new TokContext("{", false),
	b_expr: new TokContext("{", true),
	b_tmpl: new TokContext("${", false),
	p_stat: new TokContext("(", false),
	p_expr: new TokContext("(", true),
	q_tmpl: new TokContext("`", true, true, function(p$1) {
		return p$1.tryReadTemplateToken();
	}),
	f_stat: new TokContext("function", false),
	f_expr: new TokContext("function", true),
	f_expr_gen: new TokContext("function", true, false, null, true),
	f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
	return [types.b_stat];
};
pp$6.curContext = function() {
	return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
	var parent = this.curContext();
	if (parent === types.f_expr || parent === types.f_stat) return true;
	if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)) return !parent.isExpr;
	if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
	if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) return true;
	if (prevType === types$1.braceL) return parent === types.b_stat;
	if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) return false;
	return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
	for (var i = this.context.length - 1; i >= 1; i--) {
		var context = this.context[i];
		if (context.token === "function") return context.generator;
	}
	return false;
};
pp$6.updateContext = function(prevType) {
	var update, type$1 = this.type;
	if (type$1.keyword && prevType === types$1.dot) this.exprAllowed = false;
	else if (update = type$1.updateContext) update.call(this, prevType);
	else this.exprAllowed = type$1.beforeExpr;
};
pp$6.overrideContext = function(tokenCtx) {
	if (this.curContext() !== tokenCtx) this.context[this.context.length - 1] = tokenCtx;
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
	if (this.context.length === 1) {
		this.exprAllowed = true;
		return;
	}
	var out = this.context.pop();
	if (out === types.b_stat && this.curContext().token === "function") out = this.context.pop();
	this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
	this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
	this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
	this.context.push(types.b_tmpl);
	this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
	var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
	this.context.push(statementParens ? types.p_stat : types.p_expr);
	this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
	if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) this.context.push(types.f_expr);
	else this.context.push(types.f_stat);
	this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
	if (this.curContext().token === "function") this.context.pop();
	this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
	if (this.curContext() === types.q_tmpl) this.context.pop();
	else this.context.push(types.q_tmpl);
	this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
	if (prevType === types$1._function) {
		var index = this.context.length - 1;
		if (this.context[index] === types.f_expr) this.context[index] = types.f_expr_gen;
		else this.context[index] = types.f_gen;
	}
	this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
	var allowed = false;
	if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
		if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) allowed = true;
	}
	this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
	if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") return;
	if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) return;
	var key = prop.key;
	var name;
	switch (key.type) {
		case "Identifier":
			name = key.name;
			break;
		case "Literal":
			name = String(key.value);
			break;
		default: return;
	}
	var kind = prop.kind;
	if (this.options.ecmaVersion >= 6) {
		if (name === "__proto__" && kind === "init") {
			if (propHash.proto) if (refDestructuringErrors) {
				if (refDestructuringErrors.doubleProto < 0) refDestructuringErrors.doubleProto = key.start;
			} else this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
			propHash.proto = true;
		}
		return;
	}
	name = "$" + name;
	var other = propHash[name];
	if (other) {
		var redefinition;
		if (kind === "init") redefinition = this.strict && other.init || other.get || other.set;
		else redefinition = other.init || other[kind];
		if (redefinition) this.raiseRecoverable(key.start, "Redefinition of property");
	} else other = propHash[name] = {
		init: false,
		get: false,
		set: false
	};
	other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
	var startPos = this.start, startLoc = this.startLoc;
	var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
	if (this.type === types$1.comma) {
		var node = this.startNodeAt(startPos, startLoc);
		node.expressions = [expr];
		while (this.eat(types$1.comma)) node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
		return this.finishNode(node, "SequenceExpression");
	}
	return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
	if (this.isContextual("yield")) if (this.inGenerator) return this.parseYield(forInit);
	else this.exprAllowed = false;
	var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
	if (refDestructuringErrors) {
		oldParenAssign = refDestructuringErrors.parenthesizedAssign;
		oldTrailingComma = refDestructuringErrors.trailingComma;
		oldDoubleProto = refDestructuringErrors.doubleProto;
		refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
	} else {
		refDestructuringErrors = new DestructuringErrors();
		ownDestructuringErrors = true;
	}
	var startPos = this.start, startLoc = this.startLoc;
	if (this.type === types$1.parenL || this.type === types$1.name) {
		this.potentialArrowAt = this.start;
		this.potentialArrowInForAwait = forInit === "await";
	}
	var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
	if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
	if (this.type.isAssign) {
		var node = this.startNodeAt(startPos, startLoc);
		node.operator = this.value;
		if (this.type === types$1.eq) left = this.toAssignable(left, false, refDestructuringErrors);
		if (!ownDestructuringErrors) refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
		if (refDestructuringErrors.shorthandAssign >= left.start) refDestructuringErrors.shorthandAssign = -1;
		if (this.type === types$1.eq) this.checkLValPattern(left);
		else this.checkLValSimple(left);
		node.left = left;
		this.next();
		node.right = this.parseMaybeAssign(forInit);
		if (oldDoubleProto > -1) refDestructuringErrors.doubleProto = oldDoubleProto;
		return this.finishNode(node, "AssignmentExpression");
	} else if (ownDestructuringErrors) this.checkExpressionErrors(refDestructuringErrors, true);
	if (oldParenAssign > -1) refDestructuringErrors.parenthesizedAssign = oldParenAssign;
	if (oldTrailingComma > -1) refDestructuringErrors.trailingComma = oldTrailingComma;
	return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
	var startPos = this.start, startLoc = this.startLoc;
	var expr = this.parseExprOps(forInit, refDestructuringErrors);
	if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
	if (this.eat(types$1.question)) {
		var node = this.startNodeAt(startPos, startLoc);
		node.test = expr;
		node.consequent = this.parseMaybeAssign();
		this.expect(types$1.colon);
		node.alternate = this.parseMaybeAssign(forInit);
		return this.finishNode(node, "ConditionalExpression");
	}
	return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
	var startPos = this.start, startLoc = this.startLoc;
	var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
	if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
	return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
	var prec = this.type.binop;
	if (prec != null && (!forInit || this.type !== types$1._in)) {
		if (prec > minPrec) {
			var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
			var coalesce = this.type === types$1.coalesce;
			if (coalesce) prec = types$1.logicalAND.binop;
			var op = this.value;
			this.next();
			var startPos = this.start, startLoc = this.startLoc;
			var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
			var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
			if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
			return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
		}
	}
	return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
	if (right.type === "PrivateIdentifier") this.raise(right.start, "Private identifier can only be left side of binary expression");
	var node = this.startNodeAt(startPos, startLoc);
	node.left = left;
	node.operator = op;
	node.right = right;
	return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
	var startPos = this.start, startLoc = this.startLoc, expr;
	if (this.isContextual("await") && this.canAwait) {
		expr = this.parseAwait(forInit);
		sawUnary = true;
	} else if (this.type.prefix) {
		var node = this.startNode(), update = this.type === types$1.incDec;
		node.operator = this.value;
		node.prefix = true;
		this.next();
		node.argument = this.parseMaybeUnary(null, true, update, forInit);
		this.checkExpressionErrors(refDestructuringErrors, true);
		if (update) this.checkLValSimple(node.argument);
		else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
		else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) this.raiseRecoverable(node.start, "Private fields can not be deleted");
		else sawUnary = true;
		expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
	} else if (!sawUnary && this.type === types$1.privateId) {
		if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) this.unexpected();
		expr = this.parsePrivateIdent();
		if (this.type !== types$1._in) this.unexpected();
	} else {
		expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
		if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
		while (this.type.postfix && !this.canInsertSemicolon()) {
			var node$1 = this.startNodeAt(startPos, startLoc);
			node$1.operator = this.value;
			node$1.prefix = false;
			node$1.argument = expr;
			this.checkLValSimple(expr);
			this.next();
			expr = this.finishNode(node$1, "UpdateExpression");
		}
	}
	if (!incDec && this.eat(types$1.starstar)) if (sawUnary) this.unexpected(this.lastTokStart);
	else return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
	else return expr;
};
function isLocalVariableAccess(node) {
	return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
	return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
	var startPos = this.start, startLoc = this.startLoc;
	var expr = this.parseExprAtom(refDestructuringErrors, forInit);
	if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") return expr;
	var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
	if (refDestructuringErrors && result.type === "MemberExpression") {
		if (refDestructuringErrors.parenthesizedAssign >= result.start) refDestructuringErrors.parenthesizedAssign = -1;
		if (refDestructuringErrors.parenthesizedBind >= result.start) refDestructuringErrors.parenthesizedBind = -1;
		if (refDestructuringErrors.trailingComma >= result.start) refDestructuringErrors.trailingComma = -1;
	}
	return result;
};
pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
	var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
	var optionalChained = false;
	while (true) {
		var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
		if (element.optional) optionalChained = true;
		if (element === base || element.type === "ArrowFunctionExpression") {
			if (optionalChained) {
				var chainNode = this.startNodeAt(startPos, startLoc);
				chainNode.expression = element;
				element = this.finishNode(chainNode, "ChainExpression");
			}
			return element;
		}
		base = element;
	}
};
pp$5.shouldParseAsyncArrow = function() {
	return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
	return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
	var optionalSupported = this.options.ecmaVersion >= 11;
	var optional = optionalSupported && this.eat(types$1.questionDot);
	if (noCalls && optional) this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
	var computed = this.eat(types$1.bracketL);
	if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
		var node = this.startNodeAt(startPos, startLoc);
		node.object = base;
		if (computed) {
			node.property = this.parseExpression();
			this.expect(types$1.bracketR);
		} else if (this.type === types$1.privateId && base.type !== "Super") node.property = this.parsePrivateIdent();
		else node.property = this.parseIdent(this.options.allowReserved !== "never");
		node.computed = !!computed;
		if (optionalSupported) node.optional = optional;
		base = this.finishNode(node, "MemberExpression");
	} else if (!noCalls && this.eat(types$1.parenL)) {
		var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
		this.yieldPos = 0;
		this.awaitPos = 0;
		this.awaitIdentPos = 0;
		var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
		if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
			this.checkPatternErrors(refDestructuringErrors, false);
			this.checkYieldAwaitInDefaultParams();
			if (this.awaitIdentPos > 0) this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
			this.yieldPos = oldYieldPos;
			this.awaitPos = oldAwaitPos;
			this.awaitIdentPos = oldAwaitIdentPos;
			return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
		}
		this.checkExpressionErrors(refDestructuringErrors, true);
		this.yieldPos = oldYieldPos || this.yieldPos;
		this.awaitPos = oldAwaitPos || this.awaitPos;
		this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
		var node$1 = this.startNodeAt(startPos, startLoc);
		node$1.callee = base;
		node$1.arguments = exprList;
		if (optionalSupported) node$1.optional = optional;
		base = this.finishNode(node$1, "CallExpression");
	} else if (this.type === types$1.backQuote) {
		if (optional || optionalChained) this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
		var node$2 = this.startNodeAt(startPos, startLoc);
		node$2.tag = base;
		node$2.quasi = this.parseTemplate({ isTagged: true });
		base = this.finishNode(node$2, "TaggedTemplateExpression");
	}
	return base;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
	if (this.type === types$1.slash) this.readRegexp();
	var node, canBeArrow = this.potentialArrowAt === this.start;
	switch (this.type) {
		case types$1._super:
			if (!this.allowSuper) this.raise(this.start, "'super' keyword outside a method");
			node = this.startNode();
			this.next();
			if (this.type === types$1.parenL && !this.allowDirectSuper) this.raise(node.start, "super() call outside constructor of a subclass");
			if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) this.unexpected();
			return this.finishNode(node, "Super");
		case types$1._this:
			node = this.startNode();
			this.next();
			return this.finishNode(node, "ThisExpression");
		case types$1.name:
			var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
			var id = this.parseIdent(false);
			if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
				this.overrideContext(types.f_expr);
				return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
			}
			if (canBeArrow && !this.canInsertSemicolon()) {
				if (this.eat(types$1.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
				if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
					id = this.parseIdent(false);
					if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) this.unexpected();
					return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
				}
			}
			return id;
		case types$1.regexp:
			var value = this.value;
			node = this.parseLiteral(value.value);
			node.regex = {
				pattern: value.pattern,
				flags: value.flags
			};
			return node;
		case types$1.num:
		case types$1.string: return this.parseLiteral(this.value);
		case types$1._null:
		case types$1._true:
		case types$1._false:
			node = this.startNode();
			node.value = this.type === types$1._null ? null : this.type === types$1._true;
			node.raw = this.type.keyword;
			this.next();
			return this.finishNode(node, "Literal");
		case types$1.parenL:
			var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
			if (refDestructuringErrors) {
				if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) refDestructuringErrors.parenthesizedAssign = start;
				if (refDestructuringErrors.parenthesizedBind < 0) refDestructuringErrors.parenthesizedBind = start;
			}
			return expr;
		case types$1.bracketL:
			node = this.startNode();
			this.next();
			node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
			return this.finishNode(node, "ArrayExpression");
		case types$1.braceL:
			this.overrideContext(types.b_expr);
			return this.parseObj(false, refDestructuringErrors);
		case types$1._function:
			node = this.startNode();
			this.next();
			return this.parseFunction(node, 0);
		case types$1._class: return this.parseClass(this.startNode(), false);
		case types$1._new: return this.parseNew();
		case types$1.backQuote: return this.parseTemplate();
		case types$1._import: if (this.options.ecmaVersion >= 11) return this.parseExprImport(forNew);
		else return this.unexpected();
		default: return this.parseExprAtomDefault();
	}
};
pp$5.parseExprAtomDefault = function() {
	this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
	var node = this.startNode();
	if (this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword import");
	this.next();
	if (this.type === types$1.parenL && !forNew) return this.parseDynamicImport(node);
	else if (this.type === types$1.dot) {
		var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
		meta.name = "import";
		node.meta = this.finishNode(meta, "Identifier");
		return this.parseImportMeta(node);
	} else this.unexpected();
};
pp$5.parseDynamicImport = function(node) {
	this.next();
	node.source = this.parseMaybeAssign();
	if (this.options.ecmaVersion >= 16) if (!this.eat(types$1.parenR)) {
		this.expect(types$1.comma);
		if (!this.afterTrailingComma(types$1.parenR)) {
			node.options = this.parseMaybeAssign();
			if (!this.eat(types$1.parenR)) {
				this.expect(types$1.comma);
				if (!this.afterTrailingComma(types$1.parenR)) this.unexpected();
			}
		} else node.options = null;
	} else node.options = null;
	else if (!this.eat(types$1.parenR)) {
		var errorPos = this.start;
		if (this.eat(types$1.comma) && this.eat(types$1.parenR)) this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
		else this.unexpected(errorPos);
	}
	return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
	this.next();
	var containsEsc = this.containsEsc;
	node.property = this.parseIdent(true);
	if (node.property.name !== "meta") this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
	if (containsEsc) this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
	if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
	return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
	var node = this.startNode();
	node.value = value;
	node.raw = this.input.slice(this.start, this.end);
	if (node.raw.charCodeAt(node.raw.length - 1) === 110) node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "");
	this.next();
	return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
	this.expect(types$1.parenL);
	var val = this.parseExpression();
	this.expect(types$1.parenR);
	return val;
};
pp$5.shouldParseArrow = function(exprList) {
	return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
	var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
	if (this.options.ecmaVersion >= 6) {
		this.next();
		var innerStartPos = this.start, innerStartLoc = this.startLoc;
		var exprList = [], first = true, lastIsComma = false;
		var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
		this.yieldPos = 0;
		this.awaitPos = 0;
		while (this.type !== types$1.parenR) {
			first ? first = false : this.expect(types$1.comma);
			if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
				lastIsComma = true;
				break;
			} else if (this.type === types$1.ellipsis) {
				spreadStart = this.start;
				exprList.push(this.parseParenItem(this.parseRestBinding()));
				if (this.type === types$1.comma) this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
				break;
			} else exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
		}
		var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
		this.expect(types$1.parenR);
		if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
			this.checkPatternErrors(refDestructuringErrors, false);
			this.checkYieldAwaitInDefaultParams();
			this.yieldPos = oldYieldPos;
			this.awaitPos = oldAwaitPos;
			return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
		}
		if (!exprList.length || lastIsComma) this.unexpected(this.lastTokStart);
		if (spreadStart) this.unexpected(spreadStart);
		this.checkExpressionErrors(refDestructuringErrors, true);
		this.yieldPos = oldYieldPos || this.yieldPos;
		this.awaitPos = oldAwaitPos || this.awaitPos;
		if (exprList.length > 1) {
			val = this.startNodeAt(innerStartPos, innerStartLoc);
			val.expressions = exprList;
			this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
		} else val = exprList[0];
	} else val = this.parseParenExpression();
	if (this.options.preserveParens) {
		var par = this.startNodeAt(startPos, startLoc);
		par.expression = val;
		return this.finishNode(par, "ParenthesizedExpression");
	} else return val;
};
pp$5.parseParenItem = function(item) {
	return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
	return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
	if (this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword new");
	var node = this.startNode();
	this.next();
	if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
		var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
		meta.name = "new";
		node.meta = this.finishNode(meta, "Identifier");
		this.next();
		var containsEsc = this.containsEsc;
		node.property = this.parseIdent(true);
		if (node.property.name !== "target") this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
		if (containsEsc) this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
		if (!this.allowNewDotTarget) this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
		return this.finishNode(node, "MetaProperty");
	}
	var startPos = this.start, startLoc = this.startLoc;
	node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
	if (this.eat(types$1.parenL)) node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
	else node.arguments = empty;
	return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref) {
	var isTagged = ref.isTagged;
	var elem = this.startNode();
	if (this.type === types$1.invalidTemplate) {
		if (!isTagged) this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
		elem.value = {
			raw: this.value.replace(/\r\n?/g, "\n"),
			cooked: null
		};
	} else elem.value = {
		raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
		cooked: this.value
	};
	this.next();
	elem.tail = this.type === types$1.backQuote;
	return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref) {
	if (ref === void 0) ref = {};
	var isTagged = ref.isTagged;
	if (isTagged === void 0) isTagged = false;
	var node = this.startNode();
	this.next();
	node.expressions = [];
	var curElt = this.parseTemplateElement({ isTagged });
	node.quasis = [curElt];
	while (!curElt.tail) {
		if (this.type === types$1.eof) this.raise(this.pos, "Unterminated template literal");
		this.expect(types$1.dollarBraceL);
		node.expressions.push(this.parseExpression());
		this.expect(types$1.braceR);
		node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
	}
	this.next();
	return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
	return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
	var node = this.startNode(), first = true, propHash = {};
	node.properties = [];
	this.next();
	while (!this.eat(types$1.braceR)) {
		if (!first) {
			this.expect(types$1.comma);
			if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) break;
		} else first = false;
		var prop = this.parseProperty(isPattern, refDestructuringErrors);
		if (!isPattern) this.checkPropClash(prop, propHash, refDestructuringErrors);
		node.properties.push(prop);
	}
	return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
	var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
	if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
		if (isPattern) {
			prop.argument = this.parseIdent(false);
			if (this.type === types$1.comma) this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
			return this.finishNode(prop, "RestElement");
		}
		prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
		if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) refDestructuringErrors.trailingComma = this.start;
		return this.finishNode(prop, "SpreadElement");
	}
	if (this.options.ecmaVersion >= 6) {
		prop.method = false;
		prop.shorthand = false;
		if (isPattern || refDestructuringErrors) {
			startPos = this.start;
			startLoc = this.startLoc;
		}
		if (!isPattern) isGenerator = this.eat(types$1.star);
	}
	var containsEsc = this.containsEsc;
	this.parsePropertyName(prop);
	if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
		isAsync = true;
		isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
		this.parsePropertyName(prop);
	} else isAsync = false;
	this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
	return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
	var kind = prop.key.name;
	this.parsePropertyName(prop);
	prop.value = this.parseMethod(false);
	prop.kind = kind;
	var paramCount = prop.kind === "get" ? 0 : 1;
	if (prop.value.params.length !== paramCount) {
		var start = prop.value.start;
		if (prop.kind === "get") this.raiseRecoverable(start, "getter should have no params");
		else this.raiseRecoverable(start, "setter should have exactly one param");
	} else if (prop.kind === "set" && prop.value.params[0].type === "RestElement") this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
	if ((isGenerator || isAsync) && this.type === types$1.colon) this.unexpected();
	if (this.eat(types$1.colon)) {
		prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
		prop.kind = "init";
	} else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
		if (isPattern) this.unexpected();
		prop.method = true;
		prop.value = this.parseMethod(isGenerator, isAsync);
		prop.kind = "init";
	} else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq) {
		if (isGenerator || isAsync) this.unexpected();
		this.parseGetterSetter(prop);
	} else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
		if (isGenerator || isAsync) this.unexpected();
		this.checkUnreserved(prop.key);
		if (prop.key.name === "await" && !this.awaitIdentPos) this.awaitIdentPos = startPos;
		if (isPattern) prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
		else if (this.type === types$1.eq && refDestructuringErrors) {
			if (refDestructuringErrors.shorthandAssign < 0) refDestructuringErrors.shorthandAssign = this.start;
			prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
		} else prop.value = this.copyNode(prop.key);
		prop.kind = "init";
		prop.shorthand = true;
	} else this.unexpected();
};
pp$5.parsePropertyName = function(prop) {
	if (this.options.ecmaVersion >= 6) if (this.eat(types$1.bracketL)) {
		prop.computed = true;
		prop.key = this.parseMaybeAssign();
		this.expect(types$1.bracketR);
		return prop.key;
	} else prop.computed = false;
	return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
	node.id = null;
	if (this.options.ecmaVersion >= 6) node.generator = node.expression = false;
	if (this.options.ecmaVersion >= 8) node.async = false;
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
	var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
	this.initFunction(node);
	if (this.options.ecmaVersion >= 6) node.generator = isGenerator;
	if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
	this.yieldPos = 0;
	this.awaitPos = 0;
	this.awaitIdentPos = 0;
	this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
	this.expect(types$1.parenL);
	node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
	this.checkYieldAwaitInDefaultParams();
	this.parseFunctionBody(node, false, true, false);
	this.yieldPos = oldYieldPos;
	this.awaitPos = oldAwaitPos;
	this.awaitIdentPos = oldAwaitIdentPos;
	return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
	var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
	this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
	this.initFunction(node);
	if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
	this.yieldPos = 0;
	this.awaitPos = 0;
	this.awaitIdentPos = 0;
	node.params = this.toAssignableList(params, true);
	this.parseFunctionBody(node, true, false, forInit);
	this.yieldPos = oldYieldPos;
	this.awaitPos = oldAwaitPos;
	this.awaitIdentPos = oldAwaitIdentPos;
	return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
	var isExpression = isArrowFunction && this.type !== types$1.braceL;
	var oldStrict = this.strict, useStrict = false;
	if (isExpression) {
		node.body = this.parseMaybeAssign(forInit);
		node.expression = true;
		this.checkParams(node, false);
	} else {
		var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
		if (!oldStrict || nonSimple) {
			useStrict = this.strictDirective(this.end);
			if (useStrict && nonSimple) this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
		}
		var oldLabels = this.labels;
		this.labels = [];
		if (useStrict) this.strict = true;
		this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
		if (this.strict && node.id) this.checkLValSimple(node.id, BIND_OUTSIDE);
		node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
		node.expression = false;
		this.adaptDirectivePrologue(node.body.body);
		this.labels = oldLabels;
	}
	this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
	for (var i = 0, list = params; i < list.length; i += 1) if (list[i].type !== "Identifier") return false;
	return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
	var nameHash = Object.create(null);
	for (var i = 0, list = node.params; i < list.length; i += 1) {
		var param = list[i];
		this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
	}
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
	var elts = [], first = true;
	while (!this.eat(close)) {
		if (!first) {
			this.expect(types$1.comma);
			if (allowTrailingComma && this.afterTrailingComma(close)) break;
		} else first = false;
		var elt = void 0;
		if (allowEmpty && this.type === types$1.comma) elt = null;
		else if (this.type === types$1.ellipsis) {
			elt = this.parseSpread(refDestructuringErrors);
			if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) refDestructuringErrors.trailingComma = this.start;
		} else elt = this.parseMaybeAssign(false, refDestructuringErrors);
		elts.push(elt);
	}
	return elts;
};
pp$5.checkUnreserved = function(ref) {
	var start = ref.start;
	var end = ref.end;
	var name = ref.name;
	if (this.inGenerator && name === "yield") this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
	if (this.inAsync && name === "await") this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
	if (!(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments") this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
	if (this.inClassStaticBlock && (name === "arguments" || name === "await")) this.raise(start, "Cannot use " + name + " in class static initialization block");
	if (this.keywords.test(name)) this.raise(start, "Unexpected keyword '" + name + "'");
	if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) return;
	if ((this.strict ? this.reservedWordsStrict : this.reservedWords).test(name)) {
		if (!this.inAsync && name === "await") this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
		this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
	}
};
pp$5.parseIdent = function(liberal) {
	var node = this.parseIdentNode();
	this.next(!!liberal);
	this.finishNode(node, "Identifier");
	if (!liberal) {
		this.checkUnreserved(node);
		if (node.name === "await" && !this.awaitIdentPos) this.awaitIdentPos = node.start;
	}
	return node;
};
pp$5.parseIdentNode = function() {
	var node = this.startNode();
	if (this.type === types$1.name) node.name = this.value;
	else if (this.type.keyword) {
		node.name = this.type.keyword;
		if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) this.context.pop();
		this.type = types$1.name;
	} else this.unexpected();
	return node;
};
pp$5.parsePrivateIdent = function() {
	var node = this.startNode();
	if (this.type === types$1.privateId) node.name = this.value;
	else this.unexpected();
	this.next();
	this.finishNode(node, "PrivateIdentifier");
	if (this.options.checkPrivateFields) if (this.privateNameStack.length === 0) this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
	else this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
	return node;
};
pp$5.parseYield = function(forInit) {
	if (!this.yieldPos) this.yieldPos = this.start;
	var node = this.startNode();
	this.next();
	if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
		node.delegate = false;
		node.argument = null;
	} else {
		node.delegate = this.eat(types$1.star);
		node.argument = this.parseMaybeAssign(forInit);
	}
	return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
	if (!this.awaitPos) this.awaitPos = this.start;
	var node = this.startNode();
	this.next();
	node.argument = this.parseMaybeUnary(null, true, false, forInit);
	return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
	var loc = getLineInfo(this.input, pos);
	message += " (" + loc.line + ":" + loc.column + ")";
	if (this.sourceFile) message += " in " + this.sourceFile;
	var err = new SyntaxError(message);
	err.pos = pos;
	err.loc = loc;
	err.raisedAt = this.pos;
	throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
	if (this.options.locations) return new Position(this.curLine, this.pos - this.lineStart);
};
var pp$3 = Parser.prototype;
var Scope$1 = function Scope$2(flags) {
	this.flags = flags;
	this.var = [];
	this.lexical = [];
	this.functions = [];
};
pp$3.enterScope = function(flags) {
	this.scopeStack.push(new Scope$1(flags));
};
pp$3.exitScope = function() {
	this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
	return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
	var redeclared = false;
	if (bindingType === BIND_LEXICAL) {
		var scope = this.currentScope();
		redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
		scope.lexical.push(name);
		if (this.inModule && scope.flags & SCOPE_TOP) delete this.undefinedExports[name];
	} else if (bindingType === BIND_SIMPLE_CATCH) this.currentScope().lexical.push(name);
	else if (bindingType === BIND_FUNCTION) {
		var scope$2 = this.currentScope();
		if (this.treatFunctionsAsVar) redeclared = scope$2.lexical.indexOf(name) > -1;
		else redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
		scope$2.functions.push(name);
	} else for (var i = this.scopeStack.length - 1; i >= 0; --i) {
		var scope$3 = this.scopeStack[i];
		if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
			redeclared = true;
			break;
		}
		scope$3.var.push(name);
		if (this.inModule && scope$3.flags & SCOPE_TOP) delete this.undefinedExports[name];
		if (scope$3.flags & SCOPE_VAR) break;
	}
	if (redeclared) this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
};
pp$3.checkLocalExport = function(id) {
	if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) this.undefinedExports[id.name] = id;
};
pp$3.currentScope = function() {
	return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
	for (var i = this.scopeStack.length - 1;; i--) {
		var scope = this.scopeStack[i];
		if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) return scope;
	}
};
pp$3.currentThisScope = function() {
	for (var i = this.scopeStack.length - 1;; i--) {
		var scope = this.scopeStack[i];
		if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) return scope;
	}
};
var Node = function Node(parser, pos, loc) {
	this.type = "";
	this.start = pos;
	this.end = 0;
	if (parser.options.locations) this.loc = new SourceLocation(parser, loc);
	if (parser.options.directSourceFile) this.sourceFile = parser.options.directSourceFile;
	if (parser.options.ranges) this.range = [pos, 0];
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
	return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
	return new Node(this, pos, loc);
};
function finishNodeAt(node, type$1, pos, loc) {
	node.type = type$1;
	node.end = pos;
	if (this.options.locations) node.loc.end = loc;
	if (this.options.ranges) node.range[1] = pos;
	return node;
}
pp$2.finishNode = function(node, type$1) {
	return finishNodeAt.call(this, node, type$1, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type$1, pos, loc) {
	return finishNodeAt.call(this, node, type$1, pos, loc);
};
pp$2.copyNode = function(node) {
	var newNode = new Node(this, node.start, this.startLoc);
	for (var prop in node) newNode[prop] = node[prop];
	return newNode;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
	9: ecma9BinaryProperties,
	10: ecma10BinaryProperties,
	11: ecma11BinaryProperties,
	12: ecma12BinaryProperties,
	13: ecma13BinaryProperties,
	14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
	9: "",
	10: "",
	11: "",
	12: "",
	13: "",
	14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
var unicodeScriptValues = {
	9: ecma9ScriptValues,
	10: ecma10ScriptValues,
	11: ecma11ScriptValues,
	12: ecma12ScriptValues,
	13: ecma13ScriptValues,
	14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion) {
	var d$2 = data[ecmaVersion] = {
		binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
		binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion]),
		nonBinary: {
			General_Category: wordsRegexp(unicodeGeneralCategoryValues),
			Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
		}
	};
	d$2.nonBinary.Script_Extensions = d$2.nonBinary.Script;
	d$2.nonBinary.gc = d$2.nonBinary.General_Category;
	d$2.nonBinary.sc = d$2.nonBinary.Script;
	d$2.nonBinary.scx = d$2.nonBinary.Script_Extensions;
}
for (var i = 0, list = [
	9,
	10,
	11,
	12,
	13,
	14
]; i < list.length; i += 1) {
	var ecmaVersion = list[i];
	buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser.prototype;
var BranchID = function BranchID(parent, base) {
	this.parent = parent;
	this.base = base || this;
};
BranchID.prototype.separatedFrom = function separatedFrom(alt) {
	for (var self = this; self; self = self.parent) for (var other = alt; other; other = other.parent) if (self.base === other.base && self !== other) return true;
	return false;
};
BranchID.prototype.sibling = function sibling() {
	return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function RegExpValidationState(parser) {
	this.parser = parser;
	this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
	this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
	this.source = "";
	this.flags = "";
	this.start = 0;
	this.switchU = false;
	this.switchV = false;
	this.switchN = false;
	this.pos = 0;
	this.lastIntValue = 0;
	this.lastStringValue = "";
	this.lastAssertionIsQuantifiable = false;
	this.numCapturingParens = 0;
	this.maxBackReference = 0;
	this.groupNames = Object.create(null);
	this.backReferenceNames = [];
	this.branchID = null;
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
	var unicodeSets = flags.indexOf("v") !== -1;
	var unicode = flags.indexOf("u") !== -1;
	this.start = start | 0;
	this.source = pattern + "";
	this.flags = flags;
	if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
		this.switchU = true;
		this.switchV = true;
		this.switchN = true;
	} else {
		this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
		this.switchV = false;
		this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
	}
};
RegExpValidationState.prototype.raise = function raise(message) {
	this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i, forceU) {
	if (forceU === void 0) forceU = false;
	var s = this.source;
	var l$1 = s.length;
	if (i >= l$1) return -1;
	var c$1 = s.charCodeAt(i);
	if (!(forceU || this.switchU) || c$1 <= 55295 || c$1 >= 57344 || i + 1 >= l$1) return c$1;
	var next = s.charCodeAt(i + 1);
	return next >= 56320 && next <= 57343 ? (c$1 << 10) + next - 56613888 : c$1;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i, forceU) {
	if (forceU === void 0) forceU = false;
	var s = this.source;
	var l$1 = s.length;
	if (i >= l$1) return l$1;
	var c$1 = s.charCodeAt(i), next;
	if (!(forceU || this.switchU) || c$1 <= 55295 || c$1 >= 57344 || i + 1 >= l$1 || (next = s.charCodeAt(i + 1)) < 56320 || next > 57343) return i + 1;
	return i + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
	if (forceU === void 0) forceU = false;
	return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
	if (forceU === void 0) forceU = false;
	return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
	if (forceU === void 0) forceU = false;
	this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
	if (forceU === void 0) forceU = false;
	if (this.current(forceU) === ch) {
		this.advance(forceU);
		return true;
	}
	return false;
};
RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
	if (forceU === void 0) forceU = false;
	var pos = this.pos;
	for (var i = 0, list = chs; i < list.length; i += 1) {
		var ch = list[i];
		var current = this.at(pos, forceU);
		if (current === -1 || current !== ch) return false;
		pos = this.nextIndex(pos, forceU);
	}
	this.pos = pos;
	return true;
};
/**
* Validate the flags part of a given RegExpLiteral.
*
* @param {RegExpValidationState} state The state to validate RegExp.
* @returns {void}
*/
pp$1.validateRegExpFlags = function(state) {
	var validFlags = state.validFlags;
	var flags = state.flags;
	var u$1 = false;
	var v$3 = false;
	for (var i = 0; i < flags.length; i++) {
		var flag = flags.charAt(i);
		if (validFlags.indexOf(flag) === -1) this.raise(state.start, "Invalid regular expression flag");
		if (flags.indexOf(flag, i + 1) > -1) this.raise(state.start, "Duplicate regular expression flag");
		if (flag === "u") u$1 = true;
		if (flag === "v") v$3 = true;
	}
	if (this.options.ecmaVersion >= 15 && u$1 && v$3) this.raise(state.start, "Invalid regular expression flag");
};
function hasProp(obj) {
	for (var _$2 in obj) return true;
	return false;
}
/**
* Validate the pattern part of a given RegExpLiteral.
*
* @param {RegExpValidationState} state The state to validate RegExp.
* @returns {void}
*/
pp$1.validateRegExpPattern = function(state) {
	this.regexp_pattern(state);
	if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
		state.switchN = true;
		this.regexp_pattern(state);
	}
};
pp$1.regexp_pattern = function(state) {
	state.pos = 0;
	state.lastIntValue = 0;
	state.lastStringValue = "";
	state.lastAssertionIsQuantifiable = false;
	state.numCapturingParens = 0;
	state.maxBackReference = 0;
	state.groupNames = Object.create(null);
	state.backReferenceNames.length = 0;
	state.branchID = null;
	this.regexp_disjunction(state);
	if (state.pos !== state.source.length) {
		if (state.eat(41)) state.raise("Unmatched ')'");
		if (state.eat(93) || state.eat(125)) state.raise("Lone quantifier brackets");
	}
	if (state.maxBackReference > state.numCapturingParens) state.raise("Invalid escape");
	for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
		var name = list[i];
		if (!state.groupNames[name]) state.raise("Invalid named capture referenced");
	}
};
pp$1.regexp_disjunction = function(state) {
	var trackDisjunction = this.options.ecmaVersion >= 16;
	if (trackDisjunction) state.branchID = new BranchID(state.branchID, null);
	this.regexp_alternative(state);
	while (state.eat(124)) {
		if (trackDisjunction) state.branchID = state.branchID.sibling();
		this.regexp_alternative(state);
	}
	if (trackDisjunction) state.branchID = state.branchID.parent;
	if (this.regexp_eatQuantifier(state, true)) state.raise("Nothing to repeat");
	if (state.eat(123)) state.raise("Lone quantifier brackets");
};
pp$1.regexp_alternative = function(state) {
	while (state.pos < state.source.length && this.regexp_eatTerm(state));
};
pp$1.regexp_eatTerm = function(state) {
	if (this.regexp_eatAssertion(state)) {
		if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
			if (state.switchU) state.raise("Invalid quantifier");
		}
		return true;
	}
	if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
		this.regexp_eatQuantifier(state);
		return true;
	}
	return false;
};
pp$1.regexp_eatAssertion = function(state) {
	var start = state.pos;
	state.lastAssertionIsQuantifiable = false;
	if (state.eat(94) || state.eat(36)) return true;
	if (state.eat(92)) {
		if (state.eat(66) || state.eat(98)) return true;
		state.pos = start;
	}
	if (state.eat(40) && state.eat(63)) {
		var lookbehind = false;
		if (this.options.ecmaVersion >= 9) lookbehind = state.eat(60);
		if (state.eat(61) || state.eat(33)) {
			this.regexp_disjunction(state);
			if (!state.eat(41)) state.raise("Unterminated group");
			state.lastAssertionIsQuantifiable = !lookbehind;
			return true;
		}
	}
	state.pos = start;
	return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
	if (noError === void 0) noError = false;
	if (this.regexp_eatQuantifierPrefix(state, noError)) {
		state.eat(63);
		return true;
	}
	return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
	return state.eat(42) || state.eat(43) || state.eat(63) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
	var start = state.pos;
	if (state.eat(123)) {
		var min = 0, max = -1;
		if (this.regexp_eatDecimalDigits(state)) {
			min = state.lastIntValue;
			if (state.eat(44) && this.regexp_eatDecimalDigits(state)) max = state.lastIntValue;
			if (state.eat(125)) {
				if (max !== -1 && max < min && !noError) state.raise("numbers out of order in {} quantifier");
				return true;
			}
		}
		if (state.switchU && !noError) state.raise("Incomplete quantifier");
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatAtom = function(state) {
	return this.regexp_eatPatternCharacters(state) || state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
	var start = state.pos;
	if (state.eat(92)) {
		if (this.regexp_eatAtomEscape(state)) return true;
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
	var start = state.pos;
	if (state.eat(40)) {
		if (state.eat(63)) {
			if (this.options.ecmaVersion >= 16) {
				var addModifiers = this.regexp_eatModifiers(state);
				var hasHyphen = state.eat(45);
				if (addModifiers || hasHyphen) {
					for (var i = 0; i < addModifiers.length; i++) {
						var modifier = addModifiers.charAt(i);
						if (addModifiers.indexOf(modifier, i + 1) > -1) state.raise("Duplicate regular expression modifiers");
					}
					if (hasHyphen) {
						var removeModifiers = this.regexp_eatModifiers(state);
						if (!addModifiers && !removeModifiers && state.current() === 58) state.raise("Invalid regular expression modifiers");
						for (var i$1$1 = 0; i$1$1 < removeModifiers.length; i$1$1++) {
							var modifier$1 = removeModifiers.charAt(i$1$1);
							if (removeModifiers.indexOf(modifier$1, i$1$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) state.raise("Duplicate regular expression modifiers");
						}
					}
				}
			}
			if (state.eat(58)) {
				this.regexp_disjunction(state);
				if (state.eat(41)) return true;
				state.raise("Unterminated group");
			}
		}
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
	if (state.eat(40)) {
		if (this.options.ecmaVersion >= 9) this.regexp_groupSpecifier(state);
		else if (state.current() === 63) state.raise("Invalid group");
		this.regexp_disjunction(state);
		if (state.eat(41)) {
			state.numCapturingParens += 1;
			return true;
		}
		state.raise("Unterminated group");
	}
	return false;
};
pp$1.regexp_eatModifiers = function(state) {
	var modifiers = "";
	var ch = 0;
	while ((ch = state.current()) !== -1 && isRegularExpressionModifier(ch)) {
		modifiers += codePointToString(ch);
		state.advance();
	}
	return modifiers;
};
function isRegularExpressionModifier(ch) {
	return ch === 105 || ch === 109 || ch === 115;
}
pp$1.regexp_eatExtendedAtom = function(state) {
	return state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
	if (this.regexp_eatBracedQuantifier(state, true)) state.raise("Nothing to repeat");
	return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
	var ch = state.current();
	if (isSyntaxCharacter(ch)) {
		state.lastIntValue = ch;
		state.advance();
		return true;
	}
	return false;
};
function isSyntaxCharacter(ch) {
	return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
	var start = state.pos;
	var ch = 0;
	while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) state.advance();
	return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
	var ch = state.current();
	if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_groupSpecifier = function(state) {
	if (state.eat(63)) {
		if (!this.regexp_eatGroupName(state)) state.raise("Invalid group");
		var trackDisjunction = this.options.ecmaVersion >= 16;
		var known = state.groupNames[state.lastStringValue];
		if (known) if (trackDisjunction) {
			for (var i = 0, list = known; i < list.length; i += 1) if (!list[i].separatedFrom(state.branchID)) state.raise("Duplicate capture group name");
		} else state.raise("Duplicate capture group name");
		if (trackDisjunction) (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
		else state.groupNames[state.lastStringValue] = true;
	}
};
pp$1.regexp_eatGroupName = function(state) {
	state.lastStringValue = "";
	if (state.eat(60)) {
		if (this.regexp_eatRegExpIdentifierName(state) && state.eat(62)) return true;
		state.raise("Invalid capture group name");
	}
	return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
	state.lastStringValue = "";
	if (this.regexp_eatRegExpIdentifierStart(state)) {
		state.lastStringValue += codePointToString(state.lastIntValue);
		while (this.regexp_eatRegExpIdentifierPart(state)) state.lastStringValue += codePointToString(state.lastIntValue);
		return true;
	}
	return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
	var start = state.pos;
	var forceU = this.options.ecmaVersion >= 11;
	var ch = state.current(forceU);
	state.advance(forceU);
	if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;
	if (isRegExpIdentifierStart(ch)) {
		state.lastIntValue = ch;
		return true;
	}
	state.pos = start;
	return false;
};
function isRegExpIdentifierStart(ch) {
	return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
	var start = state.pos;
	var forceU = this.options.ecmaVersion >= 11;
	var ch = state.current(forceU);
	state.advance(forceU);
	if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;
	if (isRegExpIdentifierPart(ch)) {
		state.lastIntValue = ch;
		return true;
	}
	state.pos = start;
	return false;
};
function isRegExpIdentifierPart(ch) {
	return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
	if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) return true;
	if (state.switchU) {
		if (state.current() === 99) state.raise("Invalid unicode escape");
		state.raise("Invalid escape");
	}
	return false;
};
pp$1.regexp_eatBackReference = function(state) {
	var start = state.pos;
	if (this.regexp_eatDecimalEscape(state)) {
		var n$2 = state.lastIntValue;
		if (state.switchU) {
			if (n$2 > state.maxBackReference) state.maxBackReference = n$2;
			return true;
		}
		if (n$2 <= state.numCapturingParens) return true;
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatKGroupName = function(state) {
	if (state.eat(107)) {
		if (this.regexp_eatGroupName(state)) {
			state.backReferenceNames.push(state.lastStringValue);
			return true;
		}
		state.raise("Invalid named reference");
	}
	return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
	return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
	var start = state.pos;
	if (state.eat(99)) {
		if (this.regexp_eatControlLetter(state)) return true;
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatZero = function(state) {
	if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
		state.lastIntValue = 0;
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_eatControlEscape = function(state) {
	var ch = state.current();
	if (ch === 116) {
		state.lastIntValue = 9;
		state.advance();
		return true;
	}
	if (ch === 110) {
		state.lastIntValue = 10;
		state.advance();
		return true;
	}
	if (ch === 118) {
		state.lastIntValue = 11;
		state.advance();
		return true;
	}
	if (ch === 102) {
		state.lastIntValue = 12;
		state.advance();
		return true;
	}
	if (ch === 114) {
		state.lastIntValue = 13;
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_eatControlLetter = function(state) {
	var ch = state.current();
	if (isControlLetter(ch)) {
		state.lastIntValue = ch % 32;
		state.advance();
		return true;
	}
	return false;
};
function isControlLetter(ch) {
	return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
	if (forceU === void 0) forceU = false;
	var start = state.pos;
	var switchU = forceU || state.switchU;
	if (state.eat(117)) {
		if (this.regexp_eatFixedHexDigits(state, 4)) {
			var lead = state.lastIntValue;
			if (switchU && lead >= 55296 && lead <= 56319) {
				var leadSurrogateEnd = state.pos;
				if (state.eat(92) && state.eat(117) && this.regexp_eatFixedHexDigits(state, 4)) {
					var trail = state.lastIntValue;
					if (trail >= 56320 && trail <= 57343) {
						state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
						return true;
					}
				}
				state.pos = leadSurrogateEnd;
				state.lastIntValue = lead;
			}
			return true;
		}
		if (switchU && state.eat(123) && this.regexp_eatHexDigits(state) && state.eat(125) && isValidUnicode(state.lastIntValue)) return true;
		if (switchU) state.raise("Invalid unicode escape");
		state.pos = start;
	}
	return false;
};
function isValidUnicode(ch) {
	return ch >= 0 && ch <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
	if (state.switchU) {
		if (this.regexp_eatSyntaxCharacter(state)) return true;
		if (state.eat(47)) {
			state.lastIntValue = 47;
			return true;
		}
		return false;
	}
	var ch = state.current();
	if (ch !== 99 && (!state.switchN || ch !== 107)) {
		state.lastIntValue = ch;
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
	state.lastIntValue = 0;
	var ch = state.current();
	if (ch >= 49 && ch <= 57) {
		do {
			state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
			state.advance();
		} while ((ch = state.current()) >= 48 && ch <= 57);
		return true;
	}
	return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
	var ch = state.current();
	if (isCharacterClassEscape(ch)) {
		state.lastIntValue = -1;
		state.advance();
		return CharSetOk;
	}
	var negate = false;
	if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
		state.lastIntValue = -1;
		state.advance();
		var result;
		if (state.eat(123) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(125)) {
			if (negate && result === CharSetString) state.raise("Invalid property name");
			return result;
		}
		state.raise("Invalid property name");
	}
	return CharSetNone;
};
function isCharacterClassEscape(ch) {
	return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
	var start = state.pos;
	if (this.regexp_eatUnicodePropertyName(state) && state.eat(61)) {
		var name = state.lastStringValue;
		if (this.regexp_eatUnicodePropertyValue(state)) {
			var value = state.lastStringValue;
			this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
			return CharSetOk;
		}
	}
	state.pos = start;
	if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
		var nameOrValue = state.lastStringValue;
		return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
	}
	return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
	if (!hasOwn(state.unicodeProperties.nonBinary, name)) state.raise("Invalid property name");
	if (!state.unicodeProperties.nonBinary[name].test(value)) state.raise("Invalid property value");
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
	if (state.unicodeProperties.binary.test(nameOrValue)) return CharSetOk;
	if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) return CharSetString;
	state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
	var ch = 0;
	state.lastStringValue = "";
	while (isUnicodePropertyNameCharacter(ch = state.current())) {
		state.lastStringValue += codePointToString(ch);
		state.advance();
	}
	return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
	return isControlLetter(ch) || ch === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
	var ch = 0;
	state.lastStringValue = "";
	while (isUnicodePropertyValueCharacter(ch = state.current())) {
		state.lastStringValue += codePointToString(ch);
		state.advance();
	}
	return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
	return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
	return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
	if (state.eat(91)) {
		var negate = state.eat(94);
		var result = this.regexp_classContents(state);
		if (!state.eat(93)) state.raise("Unterminated character class");
		if (negate && result === CharSetString) state.raise("Negated character class may contain strings");
		return true;
	}
	return false;
};
pp$1.regexp_classContents = function(state) {
	if (state.current() === 93) return CharSetOk;
	if (state.switchV) return this.regexp_classSetExpression(state);
	this.regexp_nonEmptyClassRanges(state);
	return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
	while (this.regexp_eatClassAtom(state)) {
		var left = state.lastIntValue;
		if (state.eat(45) && this.regexp_eatClassAtom(state)) {
			var right = state.lastIntValue;
			if (state.switchU && (left === -1 || right === -1)) state.raise("Invalid character class");
			if (left !== -1 && right !== -1 && left > right) state.raise("Range out of order in character class");
		}
	}
};
pp$1.regexp_eatClassAtom = function(state) {
	var start = state.pos;
	if (state.eat(92)) {
		if (this.regexp_eatClassEscape(state)) return true;
		if (state.switchU) {
			var ch$1 = state.current();
			if (ch$1 === 99 || isOctalDigit(ch$1)) state.raise("Invalid class escape");
			state.raise("Invalid escape");
		}
		state.pos = start;
	}
	var ch = state.current();
	if (ch !== 93) {
		state.lastIntValue = ch;
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_eatClassEscape = function(state) {
	var start = state.pos;
	if (state.eat(98)) {
		state.lastIntValue = 8;
		return true;
	}
	if (state.switchU && state.eat(45)) {
		state.lastIntValue = 45;
		return true;
	}
	if (!state.switchU && state.eat(99)) {
		if (this.regexp_eatClassControlLetter(state)) return true;
		state.pos = start;
	}
	return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
	var result = CharSetOk, subResult;
	if (this.regexp_eatClassSetRange(state));
	else if (subResult = this.regexp_eatClassSetOperand(state)) {
		if (subResult === CharSetString) result = CharSetString;
		var start = state.pos;
		while (state.eatChars([38, 38])) {
			if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
				if (subResult !== CharSetString) result = CharSetOk;
				continue;
			}
			state.raise("Invalid character in character class");
		}
		if (start !== state.pos) return result;
		while (state.eatChars([45, 45])) {
			if (this.regexp_eatClassSetOperand(state)) continue;
			state.raise("Invalid character in character class");
		}
		if (start !== state.pos) return result;
	} else state.raise("Invalid character in character class");
	for (;;) {
		if (this.regexp_eatClassSetRange(state)) continue;
		subResult = this.regexp_eatClassSetOperand(state);
		if (!subResult) return result;
		if (subResult === CharSetString) result = CharSetString;
	}
};
pp$1.regexp_eatClassSetRange = function(state) {
	var start = state.pos;
	if (this.regexp_eatClassSetCharacter(state)) {
		var left = state.lastIntValue;
		if (state.eat(45) && this.regexp_eatClassSetCharacter(state)) {
			var right = state.lastIntValue;
			if (left !== -1 && right !== -1 && left > right) state.raise("Range out of order in character class");
			return true;
		}
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
	if (this.regexp_eatClassSetCharacter(state)) return CharSetOk;
	return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
	var start = state.pos;
	if (state.eat(91)) {
		var negate = state.eat(94);
		var result = this.regexp_classContents(state);
		if (state.eat(93)) {
			if (negate && result === CharSetString) state.raise("Negated character class may contain strings");
			return result;
		}
		state.pos = start;
	}
	if (state.eat(92)) {
		var result$1 = this.regexp_eatCharacterClassEscape(state);
		if (result$1) return result$1;
		state.pos = start;
	}
	return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
	var start = state.pos;
	if (state.eatChars([92, 113])) {
		if (state.eat(123)) {
			var result = this.regexp_classStringDisjunctionContents(state);
			if (state.eat(125)) return result;
		} else state.raise("Invalid escape");
		state.pos = start;
	}
	return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
	var result = this.regexp_classString(state);
	while (state.eat(124)) if (this.regexp_classString(state) === CharSetString) result = CharSetString;
	return result;
};
pp$1.regexp_classString = function(state) {
	var count = 0;
	while (this.regexp_eatClassSetCharacter(state)) count++;
	return count === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
	var start = state.pos;
	if (state.eat(92)) {
		if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) return true;
		if (state.eat(98)) {
			state.lastIntValue = 8;
			return true;
		}
		state.pos = start;
		return false;
	}
	var ch = state.current();
	if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) return false;
	if (isClassSetSyntaxCharacter(ch)) return false;
	state.advance();
	state.lastIntValue = ch;
	return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch) {
	return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
function isClassSetSyntaxCharacter(ch) {
	return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
	var ch = state.current();
	if (isClassSetReservedPunctuator(ch)) {
		state.lastIntValue = ch;
		state.advance();
		return true;
	}
	return false;
};
function isClassSetReservedPunctuator(ch) {
	return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
pp$1.regexp_eatClassControlLetter = function(state) {
	var ch = state.current();
	if (isDecimalDigit(ch) || ch === 95) {
		state.lastIntValue = ch % 32;
		state.advance();
		return true;
	}
	return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
	var start = state.pos;
	if (state.eat(120)) {
		if (this.regexp_eatFixedHexDigits(state, 2)) return true;
		if (state.switchU) state.raise("Invalid escape");
		state.pos = start;
	}
	return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
	var start = state.pos;
	var ch = 0;
	state.lastIntValue = 0;
	while (isDecimalDigit(ch = state.current())) {
		state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
		state.advance();
	}
	return state.pos !== start;
};
function isDecimalDigit(ch) {
	return ch >= 48 && ch <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
	var start = state.pos;
	var ch = 0;
	state.lastIntValue = 0;
	while (isHexDigit(ch = state.current())) {
		state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
		state.advance();
	}
	return state.pos !== start;
};
function isHexDigit(ch) {
	return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
	if (ch >= 65 && ch <= 70) return 10 + (ch - 65);
	if (ch >= 97 && ch <= 102) return 10 + (ch - 97);
	return ch - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
	if (this.regexp_eatOctalDigit(state)) {
		var n1 = state.lastIntValue;
		if (this.regexp_eatOctalDigit(state)) {
			var n2 = state.lastIntValue;
			if (n1 <= 3 && this.regexp_eatOctalDigit(state)) state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
			else state.lastIntValue = n1 * 8 + n2;
		} else state.lastIntValue = n1;
		return true;
	}
	return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
	var ch = state.current();
	if (isOctalDigit(ch)) {
		state.lastIntValue = ch - 48;
		state.advance();
		return true;
	}
	state.lastIntValue = 0;
	return false;
};
function isOctalDigit(ch) {
	return ch >= 48 && ch <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
	var start = state.pos;
	state.lastIntValue = 0;
	for (var i = 0; i < length; ++i) {
		var ch = state.current();
		if (!isHexDigit(ch)) {
			state.pos = start;
			return false;
		}
		state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
		state.advance();
	}
	return true;
};
var Token = function Token(p$1) {
	this.type = p$1.type;
	this.value = p$1.value;
	this.start = p$1.start;
	this.end = p$1.end;
	if (p$1.options.locations) this.loc = new SourceLocation(p$1, p$1.startLoc, p$1.endLoc);
	if (p$1.options.ranges) this.range = [p$1.start, p$1.end];
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
	if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
	if (this.options.onToken) this.options.onToken(new Token(this));
	this.lastTokEnd = this.end;
	this.lastTokStart = this.start;
	this.lastTokEndLoc = this.endLoc;
	this.lastTokStartLoc = this.startLoc;
	this.nextToken();
};
pp.getToken = function() {
	this.next();
	return new Token(this);
};
if (typeof Symbol !== "undefined") pp[Symbol.iterator] = function() {
	var this$1$1 = this;
	return { next: function() {
		var token = this$1$1.getToken();
		return {
			done: token.type === types$1.eof,
			value: token
		};
	} };
};
pp.nextToken = function() {
	var curContext = this.curContext();
	if (!curContext || !curContext.preserveSpace) this.skipSpace();
	this.start = this.pos;
	if (this.options.locations) this.startLoc = this.curPosition();
	if (this.pos >= this.input.length) return this.finishToken(types$1.eof);
	if (curContext.override) return curContext.override(this);
	else this.readToken(this.fullCharCodeAtPos());
};
pp.readToken = function(code) {
	if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) return this.readWord();
	return this.getTokenFromCode(code);
};
pp.fullCharCodeAtPos = function() {
	var code = this.input.charCodeAt(this.pos);
	if (code <= 55295 || code >= 56320) return code;
	var next = this.input.charCodeAt(this.pos + 1);
	return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
};
pp.skipBlockComment = function() {
	var startLoc = this.options.onComment && this.curPosition();
	var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
	if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
	this.pos = end + 2;
	if (this.options.locations) for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
		++this.curLine;
		pos = this.lineStart = nextBreak;
	}
	if (this.options.onComment) this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
};
pp.skipLineComment = function(startSkip) {
	var start = this.pos;
	var startLoc = this.options.onComment && this.curPosition();
	var ch = this.input.charCodeAt(this.pos += startSkip);
	while (this.pos < this.input.length && !isNewLine(ch)) ch = this.input.charCodeAt(++this.pos);
	if (this.options.onComment) this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
};
pp.skipSpace = function() {
	loop: while (this.pos < this.input.length) {
		var ch = this.input.charCodeAt(this.pos);
		switch (ch) {
			case 32:
			case 160:
				++this.pos;
				break;
			case 13: if (this.input.charCodeAt(this.pos + 1) === 10) ++this.pos;
			case 10:
			case 8232:
			case 8233:
				++this.pos;
				if (this.options.locations) {
					++this.curLine;
					this.lineStart = this.pos;
				}
				break;
			case 47:
				switch (this.input.charCodeAt(this.pos + 1)) {
					case 42:
						this.skipBlockComment();
						break;
					case 47:
						this.skipLineComment(2);
						break;
					default: break loop;
				}
				break;
			default: if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) ++this.pos;
			else break loop;
		}
	}
};
pp.finishToken = function(type$1, val) {
	this.end = this.pos;
	if (this.options.locations) this.endLoc = this.curPosition();
	var prevType = this.type;
	this.type = type$1;
	this.value = val;
	this.updateContext(prevType);
};
pp.readToken_dot = function() {
	var next = this.input.charCodeAt(this.pos + 1);
	if (next >= 48 && next <= 57) return this.readNumber(true);
	var next2 = this.input.charCodeAt(this.pos + 2);
	if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
		this.pos += 3;
		return this.finishToken(types$1.ellipsis);
	} else {
		++this.pos;
		return this.finishToken(types$1.dot);
	}
};
pp.readToken_slash = function() {
	var next = this.input.charCodeAt(this.pos + 1);
	if (this.exprAllowed) {
		++this.pos;
		return this.readRegexp();
	}
	if (next === 61) return this.finishOp(types$1.assign, 2);
	return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code) {
	var next = this.input.charCodeAt(this.pos + 1);
	var size = 1;
	var tokentype = code === 42 ? types$1.star : types$1.modulo;
	if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
		++size;
		tokentype = types$1.starstar;
		next = this.input.charCodeAt(this.pos + 2);
	}
	if (next === 61) return this.finishOp(types$1.assign, size + 1);
	return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code) {
	var next = this.input.charCodeAt(this.pos + 1);
	if (next === code) {
		if (this.options.ecmaVersion >= 12) {
			if (this.input.charCodeAt(this.pos + 2) === 61) return this.finishOp(types$1.assign, 3);
		}
		return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
	}
	if (next === 61) return this.finishOp(types$1.assign, 2);
	return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
	if (this.input.charCodeAt(this.pos + 1) === 61) return this.finishOp(types$1.assign, 2);
	return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code) {
	var next = this.input.charCodeAt(this.pos + 1);
	if (next === code) {
		if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
			this.skipLineComment(3);
			this.skipSpace();
			return this.nextToken();
		}
		return this.finishOp(types$1.incDec, 2);
	}
	if (next === 61) return this.finishOp(types$1.assign, 2);
	return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code) {
	var next = this.input.charCodeAt(this.pos + 1);
	var size = 1;
	if (next === code) {
		size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
		if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(types$1.assign, size + 1);
		return this.finishOp(types$1.bitShift, size);
	}
	if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
		this.skipLineComment(4);
		this.skipSpace();
		return this.nextToken();
	}
	if (next === 61) size = 2;
	return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code) {
	var next = this.input.charCodeAt(this.pos + 1);
	if (next === 61) return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
	if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
		this.pos += 2;
		return this.finishToken(types$1.arrow);
	}
	return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
	var ecmaVersion = this.options.ecmaVersion;
	if (ecmaVersion >= 11) {
		var next = this.input.charCodeAt(this.pos + 1);
		if (next === 46) {
			var next2 = this.input.charCodeAt(this.pos + 2);
			if (next2 < 48 || next2 > 57) return this.finishOp(types$1.questionDot, 2);
		}
		if (next === 63) {
			if (ecmaVersion >= 12) {
				if (this.input.charCodeAt(this.pos + 2) === 61) return this.finishOp(types$1.assign, 3);
			}
			return this.finishOp(types$1.coalesce, 2);
		}
	}
	return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
	var ecmaVersion = this.options.ecmaVersion;
	var code = 35;
	if (ecmaVersion >= 13) {
		++this.pos;
		code = this.fullCharCodeAtPos();
		if (isIdentifierStart(code, true) || code === 92) return this.finishToken(types$1.privateId, this.readWord1());
	}
	this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.getTokenFromCode = function(code) {
	switch (code) {
		case 46: return this.readToken_dot();
		case 40:
			++this.pos;
			return this.finishToken(types$1.parenL);
		case 41:
			++this.pos;
			return this.finishToken(types$1.parenR);
		case 59:
			++this.pos;
			return this.finishToken(types$1.semi);
		case 44:
			++this.pos;
			return this.finishToken(types$1.comma);
		case 91:
			++this.pos;
			return this.finishToken(types$1.bracketL);
		case 93:
			++this.pos;
			return this.finishToken(types$1.bracketR);
		case 123:
			++this.pos;
			return this.finishToken(types$1.braceL);
		case 125:
			++this.pos;
			return this.finishToken(types$1.braceR);
		case 58:
			++this.pos;
			return this.finishToken(types$1.colon);
		case 96:
			if (this.options.ecmaVersion < 6) break;
			++this.pos;
			return this.finishToken(types$1.backQuote);
		case 48:
			var next = this.input.charCodeAt(this.pos + 1);
			if (next === 120 || next === 88) return this.readRadixNumber(16);
			if (this.options.ecmaVersion >= 6) {
				if (next === 111 || next === 79) return this.readRadixNumber(8);
				if (next === 98 || next === 66) return this.readRadixNumber(2);
			}
		case 49:
		case 50:
		case 51:
		case 52:
		case 53:
		case 54:
		case 55:
		case 56:
		case 57: return this.readNumber(false);
		case 34:
		case 39: return this.readString(code);
		case 47: return this.readToken_slash();
		case 37:
		case 42: return this.readToken_mult_modulo_exp(code);
		case 124:
		case 38: return this.readToken_pipe_amp(code);
		case 94: return this.readToken_caret();
		case 43:
		case 45: return this.readToken_plus_min(code);
		case 60:
		case 62: return this.readToken_lt_gt(code);
		case 61:
		case 33: return this.readToken_eq_excl(code);
		case 63: return this.readToken_question();
		case 126: return this.finishOp(types$1.prefix, 1);
		case 35: return this.readToken_numberSign();
	}
	this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};
pp.finishOp = function(type$1, size) {
	var str = this.input.slice(this.pos, this.pos + size);
	this.pos += size;
	return this.finishToken(type$1, str);
};
pp.readRegexp = function() {
	var escaped, inClass, start = this.pos;
	for (;;) {
		if (this.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
		var ch = this.input.charAt(this.pos);
		if (lineBreak.test(ch)) this.raise(start, "Unterminated regular expression");
		if (!escaped) {
			if (ch === "[") inClass = true;
			else if (ch === "]" && inClass) inClass = false;
			else if (ch === "/" && !inClass) break;
			escaped = ch === "\\";
		} else escaped = false;
		++this.pos;
	}
	var pattern = this.input.slice(start, this.pos);
	++this.pos;
	var flagsStart = this.pos;
	var flags = this.readWord1();
	if (this.containsEsc) this.unexpected(flagsStart);
	var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
	state.reset(start, pattern, flags);
	this.validateRegExpFlags(state);
	this.validateRegExpPattern(state);
	var value = null;
	try {
		value = new RegExp(pattern, flags);
	} catch (e) {}
	return this.finishToken(types$1.regexp, {
		pattern,
		flags,
		value
	});
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
	var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
	var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
	var start = this.pos, total = 0, lastCode = 0;
	for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
		var code = this.input.charCodeAt(this.pos), val = void 0;
		if (allowSeparators && code === 95) {
			if (isLegacyOctalNumericLiteral) this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
			if (lastCode === 95) this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
			if (i === 0) this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
			lastCode = code;
			continue;
		}
		if (code >= 97) val = code - 97 + 10;
		else if (code >= 65) val = code - 65 + 10;
		else if (code >= 48 && code <= 57) val = code - 48;
		else val = Infinity;
		if (val >= radix) break;
		lastCode = code;
		total = total * radix + val;
	}
	if (allowSeparators && lastCode === 95) this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
	if (this.pos === start || len != null && this.pos - start !== len) return null;
	return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
	if (isLegacyOctalNumericLiteral) return parseInt(str, 8);
	return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
	if (typeof BigInt !== "function") return null;
	return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
	var start = this.pos;
	this.pos += 2;
	var val = this.readInt(radix);
	if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
	if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
		val = stringToBigInt(this.input.slice(start, this.pos));
		++this.pos;
	} else if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
	return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
	var start = this.pos;
	if (!startsWithDot && this.readInt(10, void 0, true) === null) this.raise(start, "Invalid number");
	var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
	if (octal && this.strict) this.raise(start, "Invalid number");
	var next = this.input.charCodeAt(this.pos);
	if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
		var val$1 = stringToBigInt(this.input.slice(start, this.pos));
		++this.pos;
		if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
		return this.finishToken(types$1.num, val$1);
	}
	if (octal && /[89]/.test(this.input.slice(start, this.pos))) octal = false;
	if (next === 46 && !octal) {
		++this.pos;
		this.readInt(10);
		next = this.input.charCodeAt(this.pos);
	}
	if ((next === 69 || next === 101) && !octal) {
		next = this.input.charCodeAt(++this.pos);
		if (next === 43 || next === 45) ++this.pos;
		if (this.readInt(10) === null) this.raise(start, "Invalid number");
	}
	if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
	var val = stringToNumber(this.input.slice(start, this.pos), octal);
	return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
	var ch = this.input.charCodeAt(this.pos), code;
	if (ch === 123) {
		if (this.options.ecmaVersion < 6) this.unexpected();
		var codePos = ++this.pos;
		code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
		++this.pos;
		if (code > 1114111) this.invalidStringToken(codePos, "Code point out of bounds");
	} else code = this.readHexChar(4);
	return code;
};
pp.readString = function(quote) {
	var out = "", chunkStart = ++this.pos;
	for (;;) {
		if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
		var ch = this.input.charCodeAt(this.pos);
		if (ch === quote) break;
		if (ch === 92) {
			out += this.input.slice(chunkStart, this.pos);
			out += this.readEscapedChar(false);
			chunkStart = this.pos;
		} else if (ch === 8232 || ch === 8233) {
			if (this.options.ecmaVersion < 10) this.raise(this.start, "Unterminated string constant");
			++this.pos;
			if (this.options.locations) {
				this.curLine++;
				this.lineStart = this.pos;
			}
		} else {
			if (isNewLine(ch)) this.raise(this.start, "Unterminated string constant");
			++this.pos;
		}
	}
	out += this.input.slice(chunkStart, this.pos++);
	return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
	this.inTemplateElement = true;
	try {
		this.readTmplToken();
	} catch (err) {
		if (err === INVALID_TEMPLATE_ESCAPE_ERROR) this.readInvalidTemplateToken();
		else throw err;
	}
	this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
	if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw INVALID_TEMPLATE_ESCAPE_ERROR;
	else this.raise(position, message);
};
pp.readTmplToken = function() {
	var out = "", chunkStart = this.pos;
	for (;;) {
		if (this.pos >= this.input.length) this.raise(this.start, "Unterminated template");
		var ch = this.input.charCodeAt(this.pos);
		if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
			if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) if (ch === 36) {
				this.pos += 2;
				return this.finishToken(types$1.dollarBraceL);
			} else {
				++this.pos;
				return this.finishToken(types$1.backQuote);
			}
			out += this.input.slice(chunkStart, this.pos);
			return this.finishToken(types$1.template, out);
		}
		if (ch === 92) {
			out += this.input.slice(chunkStart, this.pos);
			out += this.readEscapedChar(true);
			chunkStart = this.pos;
		} else if (isNewLine(ch)) {
			out += this.input.slice(chunkStart, this.pos);
			++this.pos;
			switch (ch) {
				case 13: if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
				case 10:
					out += "\n";
					break;
				default:
					out += String.fromCharCode(ch);
					break;
			}
			if (this.options.locations) {
				++this.curLine;
				this.lineStart = this.pos;
			}
			chunkStart = this.pos;
		} else ++this.pos;
	}
};
pp.readInvalidTemplateToken = function() {
	for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
		case "\\":
			++this.pos;
			break;
		case "$": if (this.input[this.pos + 1] !== "{") break;
		case "`": return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
		case "\r": if (this.input[this.pos + 1] === "\n") ++this.pos;
		case "\n":
		case "\u2028":
		case "\u2029":
			++this.curLine;
			this.lineStart = this.pos + 1;
			break;
	}
	this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
	var ch = this.input.charCodeAt(++this.pos);
	++this.pos;
	switch (ch) {
		case 110: return "\n";
		case 114: return "\r";
		case 120: return String.fromCharCode(this.readHexChar(2));
		case 117: return codePointToString(this.readCodePoint());
		case 116: return "	";
		case 98: return "\b";
		case 118: return "\v";
		case 102: return "\f";
		case 13: if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
		case 10:
			if (this.options.locations) {
				this.lineStart = this.pos;
				++this.curLine;
			}
			return "";
		case 56:
		case 57:
			if (this.strict) this.invalidStringToken(this.pos - 1, "Invalid escape sequence");
			if (inTemplate) {
				var codePos = this.pos - 1;
				this.invalidStringToken(codePos, "Invalid escape sequence in template string");
			}
		default:
			if (ch >= 48 && ch <= 55) {
				var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
				var octal = parseInt(octalStr, 8);
				if (octal > 255) {
					octalStr = octalStr.slice(0, -1);
					octal = parseInt(octalStr, 8);
				}
				this.pos += octalStr.length - 1;
				ch = this.input.charCodeAt(this.pos);
				if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) this.invalidStringToken(this.pos - 1 - octalStr.length, inTemplate ? "Octal literal in template string" : "Octal literal in strict mode");
				return String.fromCharCode(octal);
			}
			if (isNewLine(ch)) {
				if (this.options.locations) {
					this.lineStart = this.pos;
					++this.curLine;
				}
				return "";
			}
			return String.fromCharCode(ch);
	}
};
pp.readHexChar = function(len) {
	var codePos = this.pos;
	var n$2 = this.readInt(16, len);
	if (n$2 === null) this.invalidStringToken(codePos, "Bad character escape sequence");
	return n$2;
};
pp.readWord1 = function() {
	this.containsEsc = false;
	var word = "", first = true, chunkStart = this.pos;
	var astral = this.options.ecmaVersion >= 6;
	while (this.pos < this.input.length) {
		var ch = this.fullCharCodeAtPos();
		if (isIdentifierChar(ch, astral)) this.pos += ch <= 65535 ? 1 : 2;
		else if (ch === 92) {
			this.containsEsc = true;
			word += this.input.slice(chunkStart, this.pos);
			var escStart = this.pos;
			if (this.input.charCodeAt(++this.pos) !== 117) this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
			++this.pos;
			var esc = this.readCodePoint();
			if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) this.invalidStringToken(escStart, "Invalid Unicode escape");
			word += codePointToString(esc);
			chunkStart = this.pos;
		} else break;
		first = false;
	}
	return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
	var word = this.readWord1();
	var type$1 = types$1.name;
	if (this.keywords.test(word)) type$1 = keywords[word];
	return this.finishToken(type$1, word);
};
var version$2 = "8.15.0";
Parser.acorn = {
	Parser,
	version: version$2,
	defaultOptions,
	Position,
	SourceLocation,
	getLineInfo,
	Node,
	TokenType,
	tokTypes: types$1,
	keywordTypes: keywords,
	TokContext,
	tokContexts: types,
	isIdentifierChar,
	isIdentifierStart,
	Token,
	isNewLine,
	lineBreak,
	lineBreakG,
	nonASCIIwhitespace
};
function parse(input, options) {
	return Parser.parse(input, options);
}
function tokenizer(input, options) {
	return Parser.tokenizer(input, options);
}

//#endregion
//#region node_modules/.pnpm/confbox@0.1.8/node_modules/confbox/dist/shared/confbox.9388d834.mjs
const m = Symbol.for("__confbox_fmt__"), k = /^(\s+)/, v = /(\s+)$/;
function x$1(e, t$1 = {}) {
	return {
		sample: t$1.indent === void 0 && t$1.preserveIndentation !== !1 && e.slice(0, t$1?.sampleSize || 1024),
		whiteSpace: t$1.preserveWhitespace === !1 ? void 0 : {
			start: k.exec(e)?.[0] || "",
			end: v.exec(e)?.[0] || ""
		}
	};
}
function N$1(e, t$1, n$2) {
	!t$1 || typeof t$1 != "object" || Object.defineProperty(t$1, m, {
		enumerable: !1,
		configurable: !0,
		writable: !0,
		value: x$1(e, n$2)
	});
}

//#endregion
//#region node_modules/.pnpm/confbox@0.1.8/node_modules/confbox/dist/shared/confbox.f9f03f05.mjs
function $(n$2, l$1 = !1) {
	const g$2 = n$2.length;
	let e = 0, u$1 = "", p$1 = 0, k$2 = 16, A$1 = 0, o$1 = 0, O$2 = 0, B = 0, b$2 = 0;
	function I$2(i$2, T$2) {
		let s = 0, c$1 = 0;
		for (; s < i$2 || !T$2;) {
			let t$1 = n$2.charCodeAt(e);
			if (t$1 >= 48 && t$1 <= 57) c$1 = c$1 * 16 + t$1 - 48;
			else if (t$1 >= 65 && t$1 <= 70) c$1 = c$1 * 16 + t$1 - 65 + 10;
			else if (t$1 >= 97 && t$1 <= 102) c$1 = c$1 * 16 + t$1 - 97 + 10;
			else break;
			e++, s++;
		}
		return s < i$2 && (c$1 = -1), c$1;
	}
	function V$1(i$2) {
		e = i$2, u$1 = "", p$1 = 0, k$2 = 16, b$2 = 0;
	}
	function F$1() {
		let i$2 = e;
		if (n$2.charCodeAt(e) === 48) e++;
		else for (e++; e < n$2.length && L(n$2.charCodeAt(e));) e++;
		if (e < n$2.length && n$2.charCodeAt(e) === 46) if (e++, e < n$2.length && L(n$2.charCodeAt(e))) for (e++; e < n$2.length && L(n$2.charCodeAt(e));) e++;
		else return b$2 = 3, n$2.substring(i$2, e);
		let T$2 = e;
		if (e < n$2.length && (n$2.charCodeAt(e) === 69 || n$2.charCodeAt(e) === 101)) if (e++, (e < n$2.length && n$2.charCodeAt(e) === 43 || n$2.charCodeAt(e) === 45) && e++, e < n$2.length && L(n$2.charCodeAt(e))) {
			for (e++; e < n$2.length && L(n$2.charCodeAt(e));) e++;
			T$2 = e;
		} else b$2 = 3;
		return n$2.substring(i$2, T$2);
	}
	function j$1() {
		let i$2 = "", T$2 = e;
		for (;;) {
			if (e >= g$2) {
				i$2 += n$2.substring(T$2, e), b$2 = 2;
				break;
			}
			const s = n$2.charCodeAt(e);
			if (s === 34) {
				i$2 += n$2.substring(T$2, e), e++;
				break;
			}
			if (s === 92) {
				if (i$2 += n$2.substring(T$2, e), e++, e >= g$2) {
					b$2 = 2;
					break;
				}
				switch (n$2.charCodeAt(e++)) {
					case 34:
						i$2 += "\"";
						break;
					case 92:
						i$2 += "\\";
						break;
					case 47:
						i$2 += "/";
						break;
					case 98:
						i$2 += "\b";
						break;
					case 102:
						i$2 += "\f";
						break;
					case 110:
						i$2 += `
`;
						break;
					case 114:
						i$2 += "\r";
						break;
					case 116:
						i$2 += "	";
						break;
					case 117:
						const t$1 = I$2(4, !0);
						t$1 >= 0 ? i$2 += String.fromCharCode(t$1) : b$2 = 4;
						break;
					default: b$2 = 5;
				}
				T$2 = e;
				continue;
			}
			if (s >= 0 && s <= 31) if (r(s)) {
				i$2 += n$2.substring(T$2, e), b$2 = 2;
				break;
			} else b$2 = 6;
			e++;
		}
		return i$2;
	}
	function w$1() {
		if (u$1 = "", b$2 = 0, p$1 = e, o$1 = A$1, B = O$2, e >= g$2) return p$1 = g$2, k$2 = 17;
		let i$2 = n$2.charCodeAt(e);
		if (J(i$2)) {
			do
				e++, u$1 += String.fromCharCode(i$2), i$2 = n$2.charCodeAt(e);
			while (J(i$2));
			return k$2 = 15;
		}
		if (r(i$2)) return e++, u$1 += String.fromCharCode(i$2), i$2 === 13 && n$2.charCodeAt(e) === 10 && (e++, u$1 += `
`), A$1++, O$2 = e, k$2 = 14;
		switch (i$2) {
			case 123: return e++, k$2 = 1;
			case 125: return e++, k$2 = 2;
			case 91: return e++, k$2 = 3;
			case 93: return e++, k$2 = 4;
			case 58: return e++, k$2 = 6;
			case 44: return e++, k$2 = 5;
			case 34: return e++, u$1 = j$1(), k$2 = 10;
			case 47:
				const T$2 = e - 1;
				if (n$2.charCodeAt(e + 1) === 47) {
					for (e += 2; e < g$2 && !r(n$2.charCodeAt(e));) e++;
					return u$1 = n$2.substring(T$2, e), k$2 = 12;
				}
				if (n$2.charCodeAt(e + 1) === 42) {
					e += 2;
					const s = g$2 - 1;
					let c$1 = !1;
					for (; e < s;) {
						const t$1 = n$2.charCodeAt(e);
						if (t$1 === 42 && n$2.charCodeAt(e + 1) === 47) {
							e += 2, c$1 = !0;
							break;
						}
						e++, r(t$1) && (t$1 === 13 && n$2.charCodeAt(e) === 10 && e++, A$1++, O$2 = e);
					}
					return c$1 || (e++, b$2 = 1), u$1 = n$2.substring(T$2, e), k$2 = 13;
				}
				return u$1 += String.fromCharCode(i$2), e++, k$2 = 16;
			case 45: if (u$1 += String.fromCharCode(i$2), e++, e === g$2 || !L(n$2.charCodeAt(e))) return k$2 = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return u$1 += F$1(), k$2 = 11;
			default:
				for (; e < g$2 && v$3(i$2);) e++, i$2 = n$2.charCodeAt(e);
				if (p$1 !== e) {
					switch (u$1 = n$2.substring(p$1, e), u$1) {
						case "true": return k$2 = 8;
						case "false": return k$2 = 9;
						case "null": return k$2 = 7;
					}
					return k$2 = 16;
				}
				return u$1 += String.fromCharCode(i$2), e++, k$2 = 16;
		}
	}
	function v$3(i$2) {
		if (J(i$2) || r(i$2)) return !1;
		switch (i$2) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return !1;
		}
		return !0;
	}
	function E$1() {
		let i$2;
		do
			i$2 = w$1();
		while (i$2 >= 12 && i$2 <= 15);
		return i$2;
	}
	return {
		setPosition: V$1,
		getPosition: () => e,
		scan: l$1 ? E$1 : w$1,
		getToken: () => k$2,
		getTokenValue: () => u$1,
		getTokenOffset: () => p$1,
		getTokenLength: () => e - p$1,
		getTokenStartLine: () => o$1,
		getTokenStartCharacter: () => p$1 - B,
		getTokenError: () => b$2
	};
}
function J(n$2) {
	return n$2 === 32 || n$2 === 9;
}
function r(n$2) {
	return n$2 === 10 || n$2 === 13;
}
function L(n$2) {
	return n$2 >= 48 && n$2 <= 57;
}
var Q;
(function(n$2) {
	n$2[n$2.lineFeed = 10] = "lineFeed", n$2[n$2.carriageReturn = 13] = "carriageReturn", n$2[n$2.space = 32] = "space", n$2[n$2._0 = 48] = "_0", n$2[n$2._1 = 49] = "_1", n$2[n$2._2 = 50] = "_2", n$2[n$2._3 = 51] = "_3", n$2[n$2._4 = 52] = "_4", n$2[n$2._5 = 53] = "_5", n$2[n$2._6 = 54] = "_6", n$2[n$2._7 = 55] = "_7", n$2[n$2._8 = 56] = "_8", n$2[n$2._9 = 57] = "_9", n$2[n$2.a = 97] = "a", n$2[n$2.b = 98] = "b", n$2[n$2.c = 99] = "c", n$2[n$2.d = 100] = "d", n$2[n$2.e = 101] = "e", n$2[n$2.f = 102] = "f", n$2[n$2.g = 103] = "g", n$2[n$2.h = 104] = "h", n$2[n$2.i = 105] = "i", n$2[n$2.j = 106] = "j", n$2[n$2.k = 107] = "k", n$2[n$2.l = 108] = "l", n$2[n$2.m = 109] = "m", n$2[n$2.n = 110] = "n", n$2[n$2.o = 111] = "o", n$2[n$2.p = 112] = "p", n$2[n$2.q = 113] = "q", n$2[n$2.r = 114] = "r", n$2[n$2.s = 115] = "s", n$2[n$2.t = 116] = "t", n$2[n$2.u = 117] = "u", n$2[n$2.v = 118] = "v", n$2[n$2.w = 119] = "w", n$2[n$2.x = 120] = "x", n$2[n$2.y = 121] = "y", n$2[n$2.z = 122] = "z", n$2[n$2.A = 65] = "A", n$2[n$2.B = 66] = "B", n$2[n$2.C = 67] = "C", n$2[n$2.D = 68] = "D", n$2[n$2.E = 69] = "E", n$2[n$2.F = 70] = "F", n$2[n$2.G = 71] = "G", n$2[n$2.H = 72] = "H", n$2[n$2.I = 73] = "I", n$2[n$2.J = 74] = "J", n$2[n$2.K = 75] = "K", n$2[n$2.L = 76] = "L", n$2[n$2.M = 77] = "M", n$2[n$2.N = 78] = "N", n$2[n$2.O = 79] = "O", n$2[n$2.P = 80] = "P", n$2[n$2.Q = 81] = "Q", n$2[n$2.R = 82] = "R", n$2[n$2.S = 83] = "S", n$2[n$2.T = 84] = "T", n$2[n$2.U = 85] = "U", n$2[n$2.V = 86] = "V", n$2[n$2.W = 87] = "W", n$2[n$2.X = 88] = "X", n$2[n$2.Y = 89] = "Y", n$2[n$2.Z = 90] = "Z", n$2[n$2.asterisk = 42] = "asterisk", n$2[n$2.backslash = 92] = "backslash", n$2[n$2.closeBrace = 125] = "closeBrace", n$2[n$2.closeBracket = 93] = "closeBracket", n$2[n$2.colon = 58] = "colon", n$2[n$2.comma = 44] = "comma", n$2[n$2.dot = 46] = "dot", n$2[n$2.doubleQuote = 34] = "doubleQuote", n$2[n$2.minus = 45] = "minus", n$2[n$2.openBrace = 123] = "openBrace", n$2[n$2.openBracket = 91] = "openBracket", n$2[n$2.plus = 43] = "plus", n$2[n$2.slash = 47] = "slash", n$2[n$2.formFeed = 12] = "formFeed", n$2[n$2.tab = 9] = "tab";
})(Q || (Q = {})), new Array(20).fill(0).map((n$2, l$1) => " ".repeat(l$1));
const N = 200;
new Array(N).fill(0).map((n$2, l$1) => `
` + " ".repeat(l$1)), new Array(N).fill(0).map((n$2, l$1) => "\r" + " ".repeat(l$1)), new Array(N).fill(0).map((n$2, l$1) => `\r
` + " ".repeat(l$1)), new Array(N).fill(0).map((n$2, l$1) => `
` + "	".repeat(l$1)), new Array(N).fill(0).map((n$2, l$1) => "\r" + "	".repeat(l$1)), new Array(N).fill(0).map((n$2, l$1) => `\r
` + "	".repeat(l$1));
var U;
(function(n$2) {
	n$2.DEFAULT = { allowTrailingComma: !1 };
})(U || (U = {}));
function S(n$2, l$1 = [], g$2 = U.DEFAULT) {
	let e = null, u$1 = [];
	const p$1 = [];
	function k$2(o$1) {
		Array.isArray(u$1) ? u$1.push(o$1) : e !== null && (u$1[e] = o$1);
	}
	return P(n$2, {
		onObjectBegin: () => {
			const o$1 = {};
			k$2(o$1), p$1.push(u$1), u$1 = o$1, e = null;
		},
		onObjectProperty: (o$1) => {
			e = o$1;
		},
		onObjectEnd: () => {
			u$1 = p$1.pop();
		},
		onArrayBegin: () => {
			const o$1 = [];
			k$2(o$1), p$1.push(u$1), u$1 = o$1, e = null;
		},
		onArrayEnd: () => {
			u$1 = p$1.pop();
		},
		onLiteralValue: k$2,
		onError: (o$1, O$2, B) => {
			l$1.push({
				error: o$1,
				offset: O$2,
				length: B
			});
		}
	}, g$2), u$1[0];
}
function P(n$2, l$1, g$2 = U.DEFAULT) {
	const e = $(n$2, !1), u$1 = [];
	let p$1 = 0;
	function k$2(f$1) {
		return f$1 ? () => p$1 === 0 && f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter()) : () => !0;
	}
	function A$1(f$1) {
		return f$1 ? (m$3) => p$1 === 0 && f$1(m$3, e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter()) : () => !0;
	}
	function o$1(f$1) {
		return f$1 ? (m$3) => p$1 === 0 && f$1(m$3, e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter(), () => u$1.slice()) : () => !0;
	}
	function O$2(f$1) {
		return f$1 ? () => {
			p$1 > 0 ? p$1++ : f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter(), () => u$1.slice()) === !1 && (p$1 = 1);
		} : () => !0;
	}
	function B(f$1) {
		return f$1 ? () => {
			p$1 > 0 && p$1--, p$1 === 0 && f$1(e.getTokenOffset(), e.getTokenLength(), e.getTokenStartLine(), e.getTokenStartCharacter());
		} : () => !0;
	}
	const b$2 = O$2(l$1.onObjectBegin), I$2 = o$1(l$1.onObjectProperty), V$1 = B(l$1.onObjectEnd), F$1 = O$2(l$1.onArrayBegin), j$1 = B(l$1.onArrayEnd), w$1 = o$1(l$1.onLiteralValue), v$3 = A$1(l$1.onSeparator), E$1 = k$2(l$1.onComment), i$2 = A$1(l$1.onError), T$2 = g$2 && g$2.disallowComments, s = g$2 && g$2.allowTrailingComma;
	function c$1() {
		for (;;) {
			const f$1 = e.scan();
			switch (e.getTokenError()) {
				case 4:
					t$1(14);
					break;
				case 5:
					t$1(15);
					break;
				case 3:
					t$1(13);
					break;
				case 1:
					T$2 || t$1(11);
					break;
				case 2:
					t$1(12);
					break;
				case 6:
					t$1(16);
					break;
			}
			switch (f$1) {
				case 12:
				case 13:
					T$2 ? t$1(10) : E$1();
					break;
				case 16:
					t$1(1);
					break;
				case 15:
				case 14: break;
				default: return f$1;
			}
		}
	}
	function t$1(f$1, m$3 = [], y$1 = []) {
		if (i$2(f$1), m$3.length + y$1.length > 0) {
			let _$2 = e.getToken();
			for (; _$2 !== 17;) {
				if (m$3.indexOf(_$2) !== -1) {
					c$1();
					break;
				} else if (y$1.indexOf(_$2) !== -1) break;
				_$2 = c$1();
			}
		}
	}
	function D$1(f$1) {
		const m$3 = e.getTokenValue();
		return f$1 ? w$1(m$3) : (I$2(m$3), u$1.push(m$3)), c$1(), !0;
	}
	function G$1() {
		switch (e.getToken()) {
			case 11:
				const f$1 = e.getTokenValue();
				let m$3 = Number(f$1);
				isNaN(m$3) && (t$1(2), m$3 = 0), w$1(m$3);
				break;
			case 7:
				w$1(null);
				break;
			case 8:
				w$1(!0);
				break;
			case 9:
				w$1(!1);
				break;
			default: return !1;
		}
		return c$1(), !0;
	}
	function M$1() {
		return e.getToken() !== 10 ? (t$1(3, [], [2, 5]), !1) : (D$1(!1), e.getToken() === 6 ? (v$3(":"), c$1(), a$1() || t$1(4, [], [2, 5])) : t$1(5, [], [2, 5]), u$1.pop(), !0);
	}
	function X() {
		b$2(), c$1();
		let f$1 = !1;
		for (; e.getToken() !== 2 && e.getToken() !== 17;) {
			if (e.getToken() === 5) {
				if (f$1 || t$1(4, [], []), v$3(","), c$1(), e.getToken() === 2 && s) break;
			} else f$1 && t$1(6, [], []);
			M$1() || t$1(4, [], [2, 5]), f$1 = !0;
		}
		return V$1(), e.getToken() !== 2 ? t$1(7, [2], []) : c$1(), !0;
	}
	function Y$1() {
		F$1(), c$1();
		let f$1 = !0, m$3 = !1;
		for (; e.getToken() !== 4 && e.getToken() !== 17;) {
			if (e.getToken() === 5) {
				if (m$3 || t$1(4, [], []), v$3(","), c$1(), e.getToken() === 4 && s) break;
			} else m$3 && t$1(6, [], []);
			f$1 ? (u$1.push(0), f$1 = !1) : u$1[u$1.length - 1]++, a$1() || t$1(4, [], [4, 5]), m$3 = !0;
		}
		return j$1(), f$1 || u$1.pop(), e.getToken() !== 4 ? t$1(8, [4], []) : c$1(), !0;
	}
	function a$1() {
		switch (e.getToken()) {
			case 3: return Y$1();
			case 1: return X();
			case 10: return D$1(!0);
			default: return G$1();
		}
	}
	return c$1(), e.getToken() === 17 ? g$2.allowEmptyContent ? !0 : (t$1(4, [], []), !1) : a$1() ? (e.getToken() !== 17 && t$1(9, [], []), !0) : (t$1(4, [], []), !1);
}
var W;
(function(n$2) {
	n$2[n$2.None = 0] = "None", n$2[n$2.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", n$2[n$2.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", n$2[n$2.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", n$2[n$2.InvalidUnicode = 4] = "InvalidUnicode", n$2[n$2.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", n$2[n$2.InvalidCharacter = 6] = "InvalidCharacter";
})(W || (W = {}));
var H;
(function(n$2) {
	n$2[n$2.OpenBraceToken = 1] = "OpenBraceToken", n$2[n$2.CloseBraceToken = 2] = "CloseBraceToken", n$2[n$2.OpenBracketToken = 3] = "OpenBracketToken", n$2[n$2.CloseBracketToken = 4] = "CloseBracketToken", n$2[n$2.CommaToken = 5] = "CommaToken", n$2[n$2.ColonToken = 6] = "ColonToken", n$2[n$2.NullKeyword = 7] = "NullKeyword", n$2[n$2.TrueKeyword = 8] = "TrueKeyword", n$2[n$2.FalseKeyword = 9] = "FalseKeyword", n$2[n$2.StringLiteral = 10] = "StringLiteral", n$2[n$2.NumericLiteral = 11] = "NumericLiteral", n$2[n$2.LineCommentTrivia = 12] = "LineCommentTrivia", n$2[n$2.BlockCommentTrivia = 13] = "BlockCommentTrivia", n$2[n$2.LineBreakTrivia = 14] = "LineBreakTrivia", n$2[n$2.Trivia = 15] = "Trivia", n$2[n$2.Unknown = 16] = "Unknown", n$2[n$2.EOF = 17] = "EOF";
})(H || (H = {}));
const K = S;
var q;
(function(n$2) {
	n$2[n$2.InvalidSymbol = 1] = "InvalidSymbol", n$2[n$2.InvalidNumberFormat = 2] = "InvalidNumberFormat", n$2[n$2.PropertyNameExpected = 3] = "PropertyNameExpected", n$2[n$2.ValueExpected = 4] = "ValueExpected", n$2[n$2.ColonExpected = 5] = "ColonExpected", n$2[n$2.CommaExpected = 6] = "CommaExpected", n$2[n$2.CloseBraceExpected = 7] = "CloseBraceExpected", n$2[n$2.CloseBracketExpected = 8] = "CloseBracketExpected", n$2[n$2.EndOfFileExpected = 9] = "EndOfFileExpected", n$2[n$2.InvalidCommentToken = 10] = "InvalidCommentToken", n$2[n$2.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", n$2[n$2.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", n$2[n$2.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", n$2[n$2.InvalidUnicode = 14] = "InvalidUnicode", n$2[n$2.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", n$2[n$2.InvalidCharacter = 16] = "InvalidCharacter";
})(q || (q = {}));
function x(n$2, l$1) {
	const g$2 = JSON.parse(n$2, l$1?.reviver);
	return N$1(n$2, g$2, l$1), g$2;
}
function h(n$2, l$1) {
	const g$2 = K(n$2, l$1?.errors, l$1);
	return N$1(n$2, g$2, l$1), g$2;
}

//#endregion
//#region node_modules/.pnpm/pkg-types@1.3.1/node_modules/pkg-types/dist/index.mjs
const defaultFindOptions = {
	startingFrom: ".",
	rootPattern: /^node_modules$/,
	reverse: false,
	test: (filePath) => {
		try {
			if (statSync(filePath).isFile()) return true;
		} catch {}
	}
};
async function findFile(filename, _options = {}) {
	const filenames = Array.isArray(filename) ? filename : [filename];
	const options = {
		...defaultFindOptions,
		..._options
	};
	const basePath = resolve$3(options.startingFrom);
	const leadingSlash = basePath[0] === "/";
	const segments = basePath.split("/").filter(Boolean);
	if (leadingSlash) segments[0] = "/" + segments[0];
	let root = segments.findIndex((r$3) => r$3.match(options.rootPattern));
	if (root === -1) root = 0;
	if (options.reverse) for (let index = root + 1; index <= segments.length; index++) for (const filename2 of filenames) {
		const filePath = join$2(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	else for (let index = segments.length; index > root; index--) for (const filename2 of filenames) {
		const filePath = join$2(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	throw new Error(`Cannot find matching ${filename} in ${options.startingFrom} or parent directories`);
}
function findNearestFile(filename, _options = {}) {
	return findFile(filename, _options);
}
const FileCache = /* @__PURE__ */ new Map();
async function readPackageJSON(id, options = {}) {
	const resolvedPath = await resolvePackageJSON(id, options);
	const cache$2 = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
	if (options.cache && cache$2.has(resolvedPath)) return cache$2.get(resolvedPath);
	const blob = await promises.readFile(resolvedPath, "utf8");
	let parsed;
	try {
		parsed = x(blob);
	} catch {
		parsed = h(blob);
	}
	cache$2.set(resolvedPath, parsed);
	return parsed;
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
	return findNearestFile("package.json", {
		startingFrom: isAbsolute$2(id) ? id : await resolvePath$1(id, options),
		...options
	});
}

//#endregion
//#region node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist/index.mjs
const BUILTIN_MODULES = new Set(builtinModules);
function normalizeSlash(path$2) {
	return path$2.replace(/\\/g, "/");
}
function matchAll(regex, string, addition) {
	const matches = [];
	for (const match of string.matchAll(regex)) matches.push({
		...addition,
		...match.groups,
		code: match[0],
		start: match.index,
		end: (match.index || 0) + match[0].length
	});
	return matches;
}
function clearImports(imports) {
	return (imports || "").replace(/\/\/[^\n]*\n|\/\*.*\*\//g, "").replace(/\s+/g, " ");
}
function getImportNames(cleanedImports) {
	const topLevelImports = cleanedImports.replace(/{[^}]*}/, "");
	return {
		namespacedImport: topLevelImports.match(/\* as \s*(\S*)/)?.[1],
		defaultImport: topLevelImports.split(",").find((index) => !/[*{}]/.test(index))?.trim() || void 0
	};
}
/**
* @typedef ErrnoExceptionFields
* @property {number | undefined} [errnode]
* @property {string | undefined} [code]
* @property {string | undefined} [path]
* @property {string | undefined} [syscall]
* @property {string | undefined} [url]
*
* @typedef {Error & ErrnoExceptionFields} ErrnoException
*/
const own$1 = {}.hasOwnProperty;
const classRegExp = /^([A-Z][a-z\d]*)+$/;
const kTypes = new Set([
	"string",
	"function",
	"number",
	"object",
	"Function",
	"Object",
	"boolean",
	"bigint",
	"symbol"
]);
const codes = {};
/**
* Create a list string in the form like 'A and B' or 'A, B, ..., and Z'.
* We cannot use Intl.ListFormat because it's not available in
* --without-intl builds.
*
* @param {Array<string>} array
*   An array of strings.
* @param {string} [type]
*   The list type to be inserted before the last element.
* @returns {string}
*/
function formatList(array, type$1 = "and") {
	return array.length < 3 ? array.join(` ${type$1} `) : `${array.slice(0, -1).join(", ")}, ${type$1} ${array[array.length - 1]}`;
}
/** @type {Map<string, MessageFunction | string>} */
const messages = /* @__PURE__ */ new Map();
const nodeInternalPrefix = "__node_internal_";
/** @type {number} */
let userStackTraceLimit;
codes.ERR_INVALID_ARG_TYPE = createError(
	"ERR_INVALID_ARG_TYPE",
	/**
	* @param {string} name
	* @param {Array<string> | string} expected
	* @param {unknown} actual
	*/
	(name, expected, actual) => {
		assert(typeof name === "string", "'name' must be a string");
		if (!Array.isArray(expected)) expected = [expected];
		let message = "The ";
		if (name.endsWith(" argument")) message += `${name} `;
		else {
			const type$1 = name.includes(".") ? "property" : "argument";
			message += `"${name}" ${type$1} `;
		}
		message += "must be ";
		/** @type {Array<string>} */
		const types$4 = [];
		/** @type {Array<string>} */
		const instances = [];
		/** @type {Array<string>} */
		const other = [];
		for (const value of expected) {
			assert(typeof value === "string", "All expected entries have to be of type string");
			if (kTypes.has(value)) types$4.push(value.toLowerCase());
			else if (classRegExp.exec(value) === null) {
				assert(value !== "object", "The value \"object\" should be written as \"Object\"");
				other.push(value);
			} else instances.push(value);
		}
		if (instances.length > 0) {
			const pos = types$4.indexOf("object");
			if (pos !== -1) {
				types$4.slice(pos, 1);
				instances.push("Object");
			}
		}
		if (types$4.length > 0) {
			message += `${types$4.length > 1 ? "one of type" : "of type"} ${formatList(types$4, "or")}`;
			if (instances.length > 0 || other.length > 0) message += " or ";
		}
		if (instances.length > 0) {
			message += `an instance of ${formatList(instances, "or")}`;
			if (other.length > 0) message += " or ";
		}
		if (other.length > 0) if (other.length > 1) message += `one of ${formatList(other, "or")}`;
		else {
			if (other[0].toLowerCase() !== other[0]) message += "an ";
			message += `${other[0]}`;
		}
		message += `. Received ${determineSpecificType(actual)}`;
		return message;
	},
	TypeError
);
codes.ERR_INVALID_MODULE_SPECIFIER = createError(
	"ERR_INVALID_MODULE_SPECIFIER",
	/**
	* @param {string} request
	* @param {string} reason
	* @param {string} [base]
	*/
	(request, reason, base = void 0) => {
		return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
	},
	TypeError
);
codes.ERR_INVALID_PACKAGE_CONFIG = createError(
	"ERR_INVALID_PACKAGE_CONFIG",
	/**
	* @param {string} path
	* @param {string} [base]
	* @param {string} [message]
	*/
	(path$2, base, message) => {
		return `Invalid package config ${path$2}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
	},
	Error
);
codes.ERR_INVALID_PACKAGE_TARGET = createError(
	"ERR_INVALID_PACKAGE_TARGET",
	/**
	* @param {string} packagePath
	* @param {string} key
	* @param {unknown} target
	* @param {boolean} [isImport=false]
	* @param {string} [base]
	*/
	(packagePath, key, target, isImport = false, base = void 0) => {
		const relatedError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
		if (key === ".") {
			assert(isImport === false);
			return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? "; targets must start with \"./\"" : ""}`;
		}
		return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(target)} defined for '${key}' in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? "; targets must start with \"./\"" : ""}`;
	},
	Error
);
codes.ERR_MODULE_NOT_FOUND = createError(
	"ERR_MODULE_NOT_FOUND",
	/**
	* @param {string} path
	* @param {string} base
	* @param {boolean} [exactUrl]
	*/
	(path$2, base, exactUrl = false) => {
		return `Cannot find ${exactUrl ? "module" : "package"} '${path$2}' imported from ${base}`;
	},
	Error
);
codes.ERR_NETWORK_IMPORT_DISALLOWED = createError("ERR_NETWORK_IMPORT_DISALLOWED", "import of '%s' by %s is not supported: %s", Error);
codes.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError(
	"ERR_PACKAGE_IMPORT_NOT_DEFINED",
	/**
	* @param {string} specifier
	* @param {string} packagePath
	* @param {string} base
	*/
	(specifier, packagePath, base) => {
		return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath}package.json` : ""} imported from ${base}`;
	},
	TypeError
);
codes.ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
	"ERR_PACKAGE_PATH_NOT_EXPORTED",
	/**
	* @param {string} packagePath
	* @param {string} subpath
	* @param {string} [base]
	*/
	(packagePath, subpath, base = void 0) => {
		if (subpath === ".") return `No "exports" main defined in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
		return `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
	},
	Error
);
codes.ERR_UNSUPPORTED_DIR_IMPORT = createError("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error);
codes.ERR_UNSUPPORTED_RESOLVE_REQUEST = createError("ERR_UNSUPPORTED_RESOLVE_REQUEST", "Failed to resolve module specifier \"%s\" from \"%s\": Invalid relative URL or base scheme is not hierarchical.", TypeError);
codes.ERR_UNKNOWN_FILE_EXTENSION = createError(
	"ERR_UNKNOWN_FILE_EXTENSION",
	/**
	* @param {string} extension
	* @param {string} path
	*/
	(extension, path$2) => {
		return `Unknown file extension "${extension}" for ${path$2}`;
	},
	TypeError
);
codes.ERR_INVALID_ARG_VALUE = createError(
	"ERR_INVALID_ARG_VALUE",
	/**
	* @param {string} name
	* @param {unknown} value
	* @param {string} [reason='is invalid']
	*/
	(name, value, reason = "is invalid") => {
		let inspected = inspect(value);
		if (inspected.length > 128) inspected = `${inspected.slice(0, 128)}...`;
		return `The ${name.includes(".") ? "property" : "argument"} '${name}' ${reason}. Received ${inspected}`;
	},
	TypeError
);
/**
* Utility function for registering the error codes. Only used here. Exported
* *only* to allow for testing.
* @param {string} sym
* @param {MessageFunction | string} value
* @param {ErrorConstructor} constructor
* @returns {new (...parameters: Array<any>) => Error}
*/
function createError(sym, value, constructor) {
	messages.set(sym, value);
	return makeNodeErrorWithCode(constructor, sym);
}
/**
* @param {ErrorConstructor} Base
* @param {string} key
* @returns {ErrorConstructor}
*/
function makeNodeErrorWithCode(Base, key) {
	return NodeError;
	/**
	* @param {Array<unknown>} parameters
	*/
	function NodeError(...parameters) {
		const limit = Error.stackTraceLimit;
		if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = 0;
		const error = new Base();
		if (isErrorStackTraceLimitWritable()) Error.stackTraceLimit = limit;
		const message = getMessage(key, parameters, error);
		Object.defineProperties(error, {
			message: {
				value: message,
				enumerable: false,
				writable: true,
				configurable: true
			},
			toString: {
				value() {
					return `${this.name} [${key}]: ${this.message}`;
				},
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		captureLargerStackTrace(error);
		error.code = key;
		return error;
	}
}
/**
* @returns {boolean}
*/
function isErrorStackTraceLimitWritable() {
	try {
		if (v8.startupSnapshot.isBuildingSnapshot()) return false;
	} catch {}
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return own$1.call(desc, "writable") && desc.writable !== void 0 ? desc.writable : desc.set !== void 0;
}
/**
* This function removes unnecessary frames from Node.js core errors.
* @template {(...parameters: unknown[]) => unknown} T
* @param {T} wrappedFunction
* @returns {T}
*/
function hideStackFrames(wrappedFunction) {
	const hidden = nodeInternalPrefix + wrappedFunction.name;
	Object.defineProperty(wrappedFunction, "name", { value: hidden });
	return wrappedFunction;
}
const captureLargerStackTrace = hideStackFrames(
	/**
	* @param {Error} error
	* @returns {Error}
	*/
	function(error) {
		const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
		if (stackTraceLimitIsWritable) {
			userStackTraceLimit = Error.stackTraceLimit;
			Error.stackTraceLimit = Number.POSITIVE_INFINITY;
		}
		Error.captureStackTrace(error);
		if (stackTraceLimitIsWritable) Error.stackTraceLimit = userStackTraceLimit;
		return error;
	}
);
/**
* @param {string} key
* @param {Array<unknown>} parameters
* @param {Error} self
* @returns {string}
*/
function getMessage(key, parameters, self) {
	const message = messages.get(key);
	assert(message !== void 0, "expected `message` to be found");
	if (typeof message === "function") {
		assert(message.length <= parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`);
		return Reflect.apply(message, self, parameters);
	}
	const regex = /%[dfijoOs]/g;
	let expectedLength = 0;
	while (regex.exec(message) !== null) expectedLength++;
	assert(expectedLength === parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`);
	if (parameters.length === 0) return message;
	parameters.unshift(message);
	return Reflect.apply(format, null, parameters);
}
/**
* Determine the specific type of a value for type-mismatch errors.
* @param {unknown} value
* @returns {string}
*/
function determineSpecificType(value) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "function" && value.name) return `function ${value.name}`;
	if (typeof value === "object") {
		if (value.constructor && value.constructor.name) return `an instance of ${value.constructor.name}`;
		return `${inspect(value, { depth: -1 })}`;
	}
	let inspected = inspect(value, { colors: false });
	if (inspected.length > 28) inspected = `${inspected.slice(0, 25)}...`;
	return `type ${typeof value} (${inspected})`;
}
const hasOwnProperty$1 = {}.hasOwnProperty;
const { ERR_INVALID_PACKAGE_CONFIG: ERR_INVALID_PACKAGE_CONFIG$1 } = codes;
/** @type {Map<string, PackageConfig>} */
const cache = /* @__PURE__ */ new Map();
/**
* @param {string} jsonPath
* @param {{specifier: URL | string, base?: URL}} options
* @returns {PackageConfig}
*/
function read(jsonPath, { base, specifier }) {
	const existing = cache.get(jsonPath);
	if (existing) return existing;
	/** @type {string | undefined} */
	let string;
	try {
		string = fs.readFileSync(path$1.toNamespacedPath(jsonPath), "utf8");
	} catch (error) {
		const exception = error;
		if (exception.code !== "ENOENT") throw exception;
	}
	/** @type {PackageConfig} */
	const result = {
		exists: false,
		pjsonPath: jsonPath,
		main: void 0,
		name: void 0,
		type: "none",
		exports: void 0,
		imports: void 0
	};
	if (string !== void 0) {
		/** @type {Record<string, unknown>} */
		let parsed;
		try {
			parsed = JSON.parse(string);
		} catch (error_) {
			const cause = error_;
			const error = new ERR_INVALID_PACKAGE_CONFIG$1(jsonPath, (base ? `"${specifier}" from ` : "") + fileURLToPath(base || specifier), cause.message);
			error.cause = cause;
			throw error;
		}
		result.exists = true;
		if (hasOwnProperty$1.call(parsed, "name") && typeof parsed.name === "string") result.name = parsed.name;
		if (hasOwnProperty$1.call(parsed, "main") && typeof parsed.main === "string") result.main = parsed.main;
		if (hasOwnProperty$1.call(parsed, "exports")) result.exports = parsed.exports;
		if (hasOwnProperty$1.call(parsed, "imports")) result.imports = parsed.imports;
		if (hasOwnProperty$1.call(parsed, "type") && (parsed.type === "commonjs" || parsed.type === "module")) result.type = parsed.type;
	}
	cache.set(jsonPath, result);
	return result;
}
/**
* @param {URL | string} resolved
* @returns {PackageConfig}
*/
function getPackageScopeConfig(resolved) {
	let packageJSONUrl = new URL("package.json", resolved);
	while (true) {
		if (packageJSONUrl.pathname.endsWith("node_modules/package.json")) break;
		const packageConfig = read(fileURLToPath(packageJSONUrl), { specifier: resolved });
		if (packageConfig.exists) return packageConfig;
		const lastPackageJSONUrl = packageJSONUrl;
		packageJSONUrl = new URL("../package.json", packageJSONUrl);
		if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
	}
	return {
		pjsonPath: fileURLToPath(packageJSONUrl),
		exists: false,
		type: "none"
	};
}
/**
* Returns the package type for a given URL.
* @param {URL} url - The URL to get the package type for.
* @returns {PackageType}
*/
function getPackageType(url) {
	return getPackageScopeConfig(url).type;
}
const { ERR_UNKNOWN_FILE_EXTENSION } = codes;
const hasOwnProperty = {}.hasOwnProperty;
/** @type {Record<string, string>} */
const extensionFormatMap = {
	__proto__: null,
	".cjs": "commonjs",
	".js": "module",
	".json": "json",
	".mjs": "module"
};
/**
* @param {string | null} mime
* @returns {string | null}
*/
function mimeToFormat(mime) {
	if (mime && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime)) return "module";
	if (mime === "application/json") return "json";
	return null;
}
/**
* @callback ProtocolHandler
* @param {URL} parsed
* @param {{parentURL: string, source?: Buffer}} context
* @param {boolean} ignoreErrors
* @returns {string | null | void}
*/
/**
* @type {Record<string, ProtocolHandler>}
*/
const protocolHandlers = {
	__proto__: null,
	"data:": getDataProtocolModuleFormat,
	"file:": getFileProtocolModuleFormat,
	"http:": getHttpProtocolModuleFormat,
	"https:": getHttpProtocolModuleFormat,
	"node:"() {
		return "builtin";
	}
};
/**
* @param {URL} parsed
*/
function getDataProtocolModuleFormat(parsed) {
	const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(parsed.pathname) || [
		null,
		null,
		null
	];
	return mimeToFormat(mime);
}
/**
* Returns the file extension from a URL.
*
* Should give similar result to
* `require('node:path').extname(require('node:url').fileURLToPath(url))`
* when used with a `file:` URL.
*
* @param {URL} url
* @returns {string}
*/
function extname$2(url) {
	const pathname = url.pathname;
	let index = pathname.length;
	while (index--) {
		const code = pathname.codePointAt(index);
		if (code === 47) return "";
		if (code === 46) return pathname.codePointAt(index - 1) === 47 ? "" : pathname.slice(index);
	}
	return "";
}
/**
* @type {ProtocolHandler}
*/
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
	const value = extname$2(url);
	if (value === ".js") {
		const packageType = getPackageType(url);
		if (packageType !== "none") return packageType;
		return "commonjs";
	}
	if (value === "") {
		const packageType = getPackageType(url);
		if (packageType === "none" || packageType === "commonjs") return "commonjs";
		return "module";
	}
	const format$1 = extensionFormatMap[value];
	if (format$1) return format$1;
	if (ignoreErrors) return;
	throw new ERR_UNKNOWN_FILE_EXTENSION(value, fileURLToPath(url));
}
function getHttpProtocolModuleFormat() {}
/**
* @param {URL} url
* @param {{parentURL: string}} context
* @returns {string | null}
*/
function defaultGetFormatWithoutErrors(url, context) {
	const protocol = url.protocol;
	if (!hasOwnProperty.call(protocolHandlers, protocol)) return null;
	return protocolHandlers[protocol](url, context, true) || null;
}
const RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace];
const { ERR_INVALID_MODULE_SPECIFIER, ERR_INVALID_PACKAGE_CONFIG, ERR_INVALID_PACKAGE_TARGET, ERR_MODULE_NOT_FOUND, ERR_PACKAGE_IMPORT_NOT_DEFINED, ERR_PACKAGE_PATH_NOT_EXPORTED, ERR_UNSUPPORTED_DIR_IMPORT, ERR_UNSUPPORTED_RESOLVE_REQUEST } = codes;
const own = {}.hasOwnProperty;
const invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
const deprecatedInvalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidPackageNameRegEx = /^\.|%|\\/;
const patternRegEx = /\*/g;
const encodedSeparatorRegEx = /%2f|%5c/i;
/** @type {Set<string>} */
const emittedPackageWarnings = /* @__PURE__ */ new Set();
const doubleSlashRegEx = /[/\\]{2}/;
/**
*
* @param {string} target
* @param {string} request
* @param {string} match
* @param {URL} packageJsonUrl
* @param {boolean} internal
* @param {URL} base
* @param {boolean} isTarget
*/
function emitInvalidSegmentDeprecation(target, request, match, packageJsonUrl, internal, base, isTarget) {
	if (process$1.noDeprecation) return;
	const pjsonPath = fileURLToPath(packageJsonUrl);
	const double = doubleSlashRegEx.exec(isTarget ? target : request) !== null;
	process$1.emitWarning(`Use of deprecated ${double ? "double slash" : "leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request === match ? "" : `matched to "${match}" `}in the "${internal ? "imports" : "exports"}" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}.`, "DeprecationWarning", "DEP0166");
}
/**
* @param {URL} url
* @param {URL} packageJsonUrl
* @param {URL} base
* @param {string} [main]
* @returns {void}
*/
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
	if (process$1.noDeprecation) return;
	if (defaultGetFormatWithoutErrors(url, { parentURL: base.href }) !== "module") return;
	const urlPath = fileURLToPath(url.href);
	const packagePath = fileURLToPath(new URL$1(".", packageJsonUrl));
	const basePath = fileURLToPath(base);
	if (!main) process$1.emitWarning(`No "main" or "exports" field defined in the package.json for ${packagePath} resolving the main entry point "${urlPath.slice(packagePath.length)}", imported from ${basePath}.\nDefault "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
	else if (path$1.resolve(packagePath, main) !== urlPath) process$1.emitWarning(`Package ${packagePath} has a "main" field set to "${main}", excluding the full filename and extension to the resolved file at "${urlPath.slice(packagePath.length)}", imported from ${basePath}.\n Automatic extension resolution of the "main" field is deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
}
/**
* @param {string} path
* @returns {Stats | undefined}
*/
function tryStatSync(path$2) {
	try {
		return statSync(path$2);
	} catch {}
}
/**
* Legacy CommonJS main resolution:
* 1. let M = pkg_url + (json main field)
* 2. TRY(M, M.js, M.json, M.node)
* 3. TRY(M/index.js, M/index.json, M/index.node)
* 4. TRY(pkg_url/index.js, pkg_url/index.json, pkg_url/index.node)
* 5. NOT_FOUND
*
* @param {URL} url
* @returns {boolean}
*/
function fileExists(url) {
	const stats = statSync(url, { throwIfNoEntry: false });
	const isFile = stats ? stats.isFile() : void 0;
	return isFile === null || isFile === void 0 ? false : isFile;
}
/**
* @param {URL} packageJsonUrl
* @param {PackageConfig} packageConfig
* @param {URL} base
* @returns {URL}
*/
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
	/** @type {URL | undefined} */
	let guess;
	if (packageConfig.main !== void 0) {
		guess = new URL$1(packageConfig.main, packageJsonUrl);
		if (fileExists(guess)) return guess;
		const tries$1 = [
			`./${packageConfig.main}.js`,
			`./${packageConfig.main}.json`,
			`./${packageConfig.main}.node`,
			`./${packageConfig.main}/index.js`,
			`./${packageConfig.main}/index.json`,
			`./${packageConfig.main}/index.node`
		];
		let i$3 = -1;
		while (++i$3 < tries$1.length) {
			guess = new URL$1(tries$1[i$3], packageJsonUrl);
			if (fileExists(guess)) break;
			guess = void 0;
		}
		if (guess) {
			emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
			return guess;
		}
	}
	const tries = [
		"./index.js",
		"./index.json",
		"./index.node"
	];
	let i$2 = -1;
	while (++i$2 < tries.length) {
		guess = new URL$1(tries[i$2], packageJsonUrl);
		if (fileExists(guess)) break;
		guess = void 0;
	}
	if (guess) {
		emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
		return guess;
	}
	throw new ERR_MODULE_NOT_FOUND(fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
/**
* @param {URL} resolved
* @param {URL} base
* @param {boolean} [preserveSymlinks]
* @returns {URL}
*/
function finalizeResolution(resolved, base, preserveSymlinks) {
	if (encodedSeparatorRegEx.exec(resolved.pathname) !== null) throw new ERR_INVALID_MODULE_SPECIFIER(resolved.pathname, "must not include encoded \"/\" or \"\\\" characters", fileURLToPath(base));
	/** @type {string} */
	let filePath;
	try {
		filePath = fileURLToPath(resolved);
	} catch (error) {
		const cause = error;
		Object.defineProperty(cause, "input", { value: String(resolved) });
		Object.defineProperty(cause, "module", { value: String(base) });
		throw cause;
	}
	const stats = tryStatSync(filePath.endsWith("/") ? filePath.slice(-1) : filePath);
	if (stats && stats.isDirectory()) {
		const error = new ERR_UNSUPPORTED_DIR_IMPORT(filePath, fileURLToPath(base));
		error.url = String(resolved);
		throw error;
	}
	if (!stats || !stats.isFile()) {
		const error = new ERR_MODULE_NOT_FOUND(filePath || resolved.pathname, base && fileURLToPath(base), true);
		error.url = String(resolved);
		throw error;
	}
	{
		const real = realpathSync(filePath);
		const { search, hash: hash$1 } = resolved;
		resolved = pathToFileURL(real + (filePath.endsWith(path$1.sep) ? "/" : ""));
		resolved.search = search;
		resolved.hash = hash$1;
	}
	return resolved;
}
/**
* @param {string} specifier
* @param {URL | undefined} packageJsonUrl
* @param {URL} base
* @returns {Error}
*/
function importNotDefined(specifier, packageJsonUrl, base) {
	return new ERR_PACKAGE_IMPORT_NOT_DEFINED(specifier, packageJsonUrl && fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
/**
* @param {string} subpath
* @param {URL} packageJsonUrl
* @param {URL} base
* @returns {Error}
*/
function exportsNotFound(subpath, packageJsonUrl, base) {
	return new ERR_PACKAGE_PATH_NOT_EXPORTED(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, base && fileURLToPath(base));
}
/**
* @param {string} request
* @param {string} match
* @param {URL} packageJsonUrl
* @param {boolean} internal
* @param {URL} [base]
* @returns {never}
*/
function throwInvalidSubpath(request, match, packageJsonUrl, internal, base) {
	throw new ERR_INVALID_MODULE_SPECIFIER(request, `request is not a valid match in pattern "${match}" for the "${internal ? "imports" : "exports"}" resolution of ${fileURLToPath(packageJsonUrl)}`, base && fileURLToPath(base));
}
/**
* @param {string} subpath
* @param {unknown} target
* @param {URL} packageJsonUrl
* @param {boolean} internal
* @param {URL} [base]
* @returns {Error}
*/
function invalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
	target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
	return new ERR_INVALID_PACKAGE_TARGET(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, target, internal, base && fileURLToPath(base));
}
/**
* @param {string} target
* @param {string} subpath
* @param {string} match
* @param {URL} packageJsonUrl
* @param {URL} base
* @param {boolean} pattern
* @param {boolean} internal
* @param {boolean} isPathMap
* @param {Set<string> | undefined} conditions
* @returns {URL}
*/
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, isPathMap, conditions) {
	if (subpath !== "" && !pattern && target[target.length - 1] !== "/") throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
	if (!target.startsWith("./")) {
		if (internal && !target.startsWith("../") && !target.startsWith("/")) {
			let isURL = false;
			try {
				new URL$1(target);
				isURL = true;
			} catch {}
			if (!isURL) return packageResolve(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target + subpath, packageJsonUrl, conditions);
		}
		throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
	}
	if (invalidSegmentRegEx.exec(target.slice(2)) !== null) if (deprecatedInvalidSegmentRegEx.exec(target.slice(2)) === null) {
		if (!isPathMap) {
			const request = pattern ? match.replace("*", () => subpath) : match + subpath;
			emitInvalidSegmentDeprecation(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, true);
		}
	} else throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
	const resolved = new URL$1(target, packageJsonUrl);
	const resolvedPath = resolved.pathname;
	const packagePath = new URL$1(".", packageJsonUrl).pathname;
	if (!resolvedPath.startsWith(packagePath)) throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
	if (subpath === "") return resolved;
	if (invalidSegmentRegEx.exec(subpath) !== null) {
		const request = pattern ? match.replace("*", () => subpath) : match + subpath;
		if (deprecatedInvalidSegmentRegEx.exec(subpath) === null) {
			if (!isPathMap) emitInvalidSegmentDeprecation(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, false);
		} else throwInvalidSubpath(request, match, packageJsonUrl, internal, base);
	}
	if (pattern) return new URL$1(RegExpPrototypeSymbolReplace.call(patternRegEx, resolved.href, () => subpath));
	return new URL$1(subpath, resolved);
}
/**
* @param {string} key
* @returns {boolean}
*/
function isArrayIndex(key) {
	const keyNumber = Number(key);
	if (`${keyNumber}` !== key) return false;
	return keyNumber >= 0 && keyNumber < 4294967295;
}
/**
* @param {URL} packageJsonUrl
* @param {unknown} target
* @param {string} subpath
* @param {string} packageSubpath
* @param {URL} base
* @param {boolean} pattern
* @param {boolean} internal
* @param {boolean} isPathMap
* @param {Set<string> | undefined} conditions
* @returns {URL | null}
*/
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions) {
	if (typeof target === "string") return resolvePackageTargetString(target, subpath, packageSubpath, packageJsonUrl, base, pattern, internal, isPathMap, conditions);
	if (Array.isArray(target)) {
		/** @type {Array<unknown>} */
		const targetList = target;
		if (targetList.length === 0) return null;
		/** @type {ErrnoException | null | undefined} */
		let lastException;
		let i$2 = -1;
		while (++i$2 < targetList.length) {
			const targetItem = targetList[i$2];
			/** @type {URL | null} */
			let resolveResult;
			try {
				resolveResult = resolvePackageTarget(packageJsonUrl, targetItem, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
			} catch (error) {
				const exception = error;
				lastException = exception;
				if (exception.code === "ERR_INVALID_PACKAGE_TARGET") continue;
				throw error;
			}
			if (resolveResult === void 0) continue;
			if (resolveResult === null) {
				lastException = null;
				continue;
			}
			return resolveResult;
		}
		if (lastException === void 0 || lastException === null) return null;
		throw lastException;
	}
	if (typeof target === "object" && target !== null) {
		const keys = Object.getOwnPropertyNames(target);
		let i$2 = -1;
		while (++i$2 < keys.length) {
			const key = keys[i$2];
			if (isArrayIndex(key)) throw new ERR_INVALID_PACKAGE_CONFIG(fileURLToPath(packageJsonUrl), base, "\"exports\" cannot contain numeric property keys.");
		}
		i$2 = -1;
		while (++i$2 < keys.length) {
			const key = keys[i$2];
			if (key === "default" || conditions && conditions.has(key)) {
				const conditionalTarget = target[key];
				const resolveResult = resolvePackageTarget(packageJsonUrl, conditionalTarget, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
				if (resolveResult === void 0) continue;
				return resolveResult;
			}
		}
		return null;
	}
	if (target === null) return null;
	throw invalidPackageTarget(packageSubpath, target, packageJsonUrl, internal, base);
}
/**
* @param {unknown} exports
* @param {URL} packageJsonUrl
* @param {URL} base
* @returns {boolean}
*/
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
	if (typeof exports === "string" || Array.isArray(exports)) return true;
	if (typeof exports !== "object" || exports === null) return false;
	const keys = Object.getOwnPropertyNames(exports);
	let isConditionalSugar = false;
	let i$2 = 0;
	let keyIndex = -1;
	while (++keyIndex < keys.length) {
		const key = keys[keyIndex];
		const currentIsConditionalSugar = key === "" || key[0] !== ".";
		if (i$2++ === 0) isConditionalSugar = currentIsConditionalSugar;
		else if (isConditionalSugar !== currentIsConditionalSugar) throw new ERR_INVALID_PACKAGE_CONFIG(fileURLToPath(packageJsonUrl), base, "\"exports\" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.");
	}
	return isConditionalSugar;
}
/**
* @param {string} match
* @param {URL} pjsonUrl
* @param {URL} base
*/
function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
	if (process$1.noDeprecation) return;
	const pjsonPath = fileURLToPath(pjsonUrl);
	if (emittedPackageWarnings.has(pjsonPath + "|" + match)) return;
	emittedPackageWarnings.add(pjsonPath + "|" + match);
	process$1.emitWarning(`Use of deprecated trailing slash pattern mapping "${match}" in the "exports" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`, "DeprecationWarning", "DEP0155");
}
/**
* @param {URL} packageJsonUrl
* @param {string} packageSubpath
* @param {Record<string, unknown>} packageConfig
* @param {URL} base
* @param {Set<string> | undefined} conditions
* @returns {URL}
*/
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
	let exports = packageConfig.exports;
	if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) exports = { ".": exports };
	if (own.call(exports, packageSubpath) && !packageSubpath.includes("*") && !packageSubpath.endsWith("/")) {
		const target = exports[packageSubpath];
		const resolveResult = resolvePackageTarget(packageJsonUrl, target, "", packageSubpath, base, false, false, false, conditions);
		if (resolveResult === null || resolveResult === void 0) throw exportsNotFound(packageSubpath, packageJsonUrl, base);
		return resolveResult;
	}
	let bestMatch = "";
	let bestMatchSubpath = "";
	const keys = Object.getOwnPropertyNames(exports);
	let i$2 = -1;
	while (++i$2 < keys.length) {
		const key = keys[i$2];
		const patternIndex = key.indexOf("*");
		if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
			if (packageSubpath.endsWith("/")) emitTrailingSlashPatternDeprecation(packageSubpath, packageJsonUrl, base);
			const patternTrailer = key.slice(patternIndex + 1);
			if (packageSubpath.length >= key.length && packageSubpath.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
				bestMatch = key;
				bestMatchSubpath = packageSubpath.slice(patternIndex, packageSubpath.length - patternTrailer.length);
			}
		}
	}
	if (bestMatch) {
		const target = exports[bestMatch];
		const resolveResult = resolvePackageTarget(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, false, packageSubpath.endsWith("/"), conditions);
		if (resolveResult === null || resolveResult === void 0) throw exportsNotFound(packageSubpath, packageJsonUrl, base);
		return resolveResult;
	}
	throw exportsNotFound(packageSubpath, packageJsonUrl, base);
}
/**
* @param {string} a
* @param {string} b
*/
function patternKeyCompare(a$1, b$2) {
	const aPatternIndex = a$1.indexOf("*");
	const bPatternIndex = b$2.indexOf("*");
	const baseLengthA = aPatternIndex === -1 ? a$1.length : aPatternIndex + 1;
	const baseLengthB = bPatternIndex === -1 ? b$2.length : bPatternIndex + 1;
	if (baseLengthA > baseLengthB) return -1;
	if (baseLengthB > baseLengthA) return 1;
	if (aPatternIndex === -1) return 1;
	if (bPatternIndex === -1) return -1;
	if (a$1.length > b$2.length) return -1;
	if (b$2.length > a$1.length) return 1;
	return 0;
}
/**
* @param {string} name
* @param {URL} base
* @param {Set<string>} [conditions]
* @returns {URL}
*/
function packageImportsResolve(name, base, conditions) {
	if (name === "#" || name.startsWith("#/") || name.endsWith("/")) throw new ERR_INVALID_MODULE_SPECIFIER(name, "is not a valid internal imports specifier name", fileURLToPath(base));
	/** @type {URL | undefined} */
	let packageJsonUrl;
	const packageConfig = getPackageScopeConfig(base);
	if (packageConfig.exists) {
		packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
		const imports = packageConfig.imports;
		if (imports) if (own.call(imports, name) && !name.includes("*")) {
			const resolveResult = resolvePackageTarget(packageJsonUrl, imports[name], "", name, base, false, true, false, conditions);
			if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
		} else {
			let bestMatch = "";
			let bestMatchSubpath = "";
			const keys = Object.getOwnPropertyNames(imports);
			let i$2 = -1;
			while (++i$2 < keys.length) {
				const key = keys[i$2];
				const patternIndex = key.indexOf("*");
				if (patternIndex !== -1 && name.startsWith(key.slice(0, -1))) {
					const patternTrailer = key.slice(patternIndex + 1);
					if (name.length >= key.length && name.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
						bestMatch = key;
						bestMatchSubpath = name.slice(patternIndex, name.length - patternTrailer.length);
					}
				}
			}
			if (bestMatch) {
				const target = imports[bestMatch];
				const resolveResult = resolvePackageTarget(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, true, false, conditions);
				if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
			}
		}
	}
	throw importNotDefined(name, packageJsonUrl, base);
}
/**
* @param {string} specifier
* @param {URL} base
*/
function parsePackageName(specifier, base) {
	let separatorIndex = specifier.indexOf("/");
	let validPackageName = true;
	let isScoped = false;
	if (specifier[0] === "@") {
		isScoped = true;
		if (separatorIndex === -1 || specifier.length === 0) validPackageName = false;
		else separatorIndex = specifier.indexOf("/", separatorIndex + 1);
	}
	const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
	if (invalidPackageNameRegEx.exec(packageName) !== null) validPackageName = false;
	if (!validPackageName) throw new ERR_INVALID_MODULE_SPECIFIER(specifier, "is not a valid package name", fileURLToPath(base));
	return {
		packageName,
		packageSubpath: "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex)),
		isScoped
	};
}
/**
* @param {string} specifier
* @param {URL} base
* @param {Set<string> | undefined} conditions
* @returns {URL}
*/
function packageResolve(specifier, base, conditions) {
	if (builtinModules.includes(specifier)) return new URL$1("node:" + specifier);
	const { packageName, packageSubpath, isScoped } = parsePackageName(specifier, base);
	const packageConfig = getPackageScopeConfig(base);
	/* c8 ignore next 16 */
	if (packageConfig.exists) {
		const packageJsonUrl$1 = pathToFileURL(packageConfig.pjsonPath);
		if (packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) return packageExportsResolve(packageJsonUrl$1, packageSubpath, packageConfig, base, conditions);
	}
	let packageJsonUrl = new URL$1("./node_modules/" + packageName + "/package.json", base);
	let packageJsonPath = fileURLToPath(packageJsonUrl);
	/** @type {string} */
	let lastPath;
	do {
		const stat$2 = tryStatSync(packageJsonPath.slice(0, -13));
		if (!stat$2 || !stat$2.isDirectory()) {
			lastPath = packageJsonPath;
			packageJsonUrl = new URL$1((isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json", packageJsonUrl);
			packageJsonPath = fileURLToPath(packageJsonUrl);
			continue;
		}
		const packageConfig$1 = read(packageJsonPath, {
			base,
			specifier
		});
		if (packageConfig$1.exports !== void 0 && packageConfig$1.exports !== null) return packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig$1, base, conditions);
		if (packageSubpath === ".") return legacyMainResolve(packageJsonUrl, packageConfig$1, base);
		return new URL$1(packageSubpath, packageJsonUrl);
	} while (packageJsonPath.length !== lastPath.length);
	throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), false);
}
/**
* @param {string} specifier
* @returns {boolean}
*/
function isRelativeSpecifier(specifier) {
	if (specifier[0] === ".") {
		if (specifier.length === 1 || specifier[1] === "/") return true;
		if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) return true;
	}
	return false;
}
/**
* @param {string} specifier
* @returns {boolean}
*/
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
	if (specifier === "") return false;
	if (specifier[0] === "/") return true;
	return isRelativeSpecifier(specifier);
}
/**
* The “Resolver Algorithm Specification” as detailed in the Node docs (which is
* sync and slightly lower-level than `resolve`).
*
* @param {string} specifier
*   `/example.js`, `./example.js`, `../example.js`, `some-package`, `fs`, etc.
* @param {URL} base
*   Full URL (to a file) that `specifier` is resolved relative from.
* @param {Set<string>} [conditions]
*   Conditions.
* @param {boolean} [preserveSymlinks]
*   Keep symlinks instead of resolving them.
* @returns {URL}
*   A URL object to the found thing.
*/
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
	const protocol = base.protocol;
	const isRemote = protocol === "data:" || protocol === "http:" || protocol === "https:";
	/** @type {URL | undefined} */
	let resolved;
	if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) try {
		resolved = new URL$1(specifier, base);
	} catch (error_) {
		const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
		error.cause = error_;
		throw error;
	}
	else if (protocol === "file:" && specifier[0] === "#") resolved = packageImportsResolve(specifier, base, conditions);
	else try {
		resolved = new URL$1(specifier);
	} catch (error_) {
		if (isRemote && !builtinModules.includes(specifier)) {
			const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
			error.cause = error_;
			throw error;
		}
		resolved = packageResolve(specifier, base, conditions);
	}
	assert(resolved !== void 0, "expected to be defined");
	if (resolved.protocol !== "file:") return resolved;
	return finalizeResolution(resolved, base);
}
function fileURLToPath$2(id) {
	if (typeof id === "string" && !id.startsWith("file://")) return normalizeSlash(id);
	return normalizeSlash(fileURLToPath(id));
}
function pathToFileURL$2(id) {
	return pathToFileURL(fileURLToPath$2(id)).toString();
}
function normalizeid(id) {
	if (typeof id !== "string") id = id.toString();
	if (/(?:node|data|http|https|file):/.test(id)) return id;
	if (BUILTIN_MODULES.has(id)) return "node:" + id;
	return "file://" + encodeURI(normalizeSlash(id));
}
async function loadURL(url) {
	return await promises.readFile(fileURLToPath$2(url), "utf8");
}
const DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
const DEFAULT_EXTENSIONS = [
	".mjs",
	".cjs",
	".js",
	".json"
];
const NOT_FOUND_ERRORS = /* @__PURE__ */ new Set([
	"ERR_MODULE_NOT_FOUND",
	"ERR_UNSUPPORTED_DIR_IMPORT",
	"MODULE_NOT_FOUND",
	"ERR_PACKAGE_PATH_NOT_EXPORTED"
]);
function _tryModuleResolve(id, url, conditions) {
	try {
		return moduleResolve(id, url, conditions);
	} catch (error) {
		if (!NOT_FOUND_ERRORS.has(error?.code)) throw error;
	}
}
function _resolve$1(id, options = {}) {
	if (typeof id !== "string") if (id instanceof URL) id = fileURLToPath$2(id);
	else throw new TypeError("input must be a `string` or `URL`");
	if (/(?:node|data|http|https):/.test(id)) return id;
	if (BUILTIN_MODULES.has(id)) return "node:" + id;
	if (id.startsWith("file://")) id = fileURLToPath$2(id);
	if (isAbsolute$2(id)) try {
		if (statSync(id).isFile()) return pathToFileURL$2(id);
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
	}
	const conditionsSet = options.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
	const _urls = (Array.isArray(options.url) ? options.url : [options.url]).filter(Boolean).map((url) => new URL(normalizeid(url.toString())));
	if (_urls.length === 0) _urls.push(new URL(pathToFileURL$2(process.cwd())));
	const urls = [..._urls];
	for (const url of _urls) if (url.protocol === "file:") urls.push(new URL("./", url), new URL(joinURL(url.pathname, "_index.js"), url), new URL("node_modules", url));
	let resolved;
	for (const url of urls) {
		resolved = _tryModuleResolve(id, url, conditionsSet);
		if (resolved) break;
		for (const prefix of ["", "/index"]) {
			for (const extension of options.extensions || DEFAULT_EXTENSIONS) {
				resolved = _tryModuleResolve(joinURL(id, prefix) + extension, url, conditionsSet);
				if (resolved) break;
			}
			if (resolved) break;
		}
		if (resolved) break;
	}
	if (!resolved) {
		const error = /* @__PURE__ */ new Error(`Cannot find module ${id} imported from ${urls.join(", ")}`);
		error.code = "ERR_MODULE_NOT_FOUND";
		throw error;
	}
	return pathToFileURL$2(resolved);
}
function resolveSync(id, options) {
	return _resolve$1(id, options);
}
function resolve$2(id, options) {
	try {
		return Promise.resolve(resolveSync(id, options));
	} catch (error) {
		return Promise.reject(error);
	}
}
function resolvePathSync(id, options) {
	return fileURLToPath$2(resolveSync(id, options));
}
function resolvePath$1(id, options) {
	try {
		return Promise.resolve(resolvePathSync(id, options));
	} catch (error) {
		return Promise.reject(error);
	}
}
const NODE_MODULES_RE$2 = /^(.+\/node_modules\/)([^/@]+|@[^/]+\/[^/]+)(\/?.*?)?$/;
function parseNodeModulePath(path$2) {
	if (!path$2) return {};
	path$2 = normalize$2(fileURLToPath$2(path$2));
	const match = NODE_MODULES_RE$2.exec(path$2);
	if (!match) return {};
	const [, dir, name, subpath] = match;
	return {
		dir,
		name,
		subpath: subpath ? `.${subpath}` : void 0
	};
}
async function lookupNodeModuleSubpath(path$2) {
	path$2 = normalize$2(fileURLToPath$2(path$2));
	const { name, subpath } = parseNodeModulePath(path$2);
	if (!name || !subpath) return subpath;
	const { exports } = await readPackageJSON(path$2).catch(() => {}) || {};
	if (exports) {
		const resolvedSubpath = _findSubpath(subpath, exports);
		if (resolvedSubpath) return resolvedSubpath;
	}
	return subpath;
}
function _findSubpath(subpath, exports) {
	if (typeof exports === "string") exports = { ".": exports };
	if (!subpath.startsWith(".")) subpath = subpath.startsWith("/") ? `.${subpath}` : `./${subpath}`;
	if (subpath in (exports || {})) return subpath;
	return _flattenExports(exports).find((p$1) => p$1.fsPath === subpath)?.subpath;
}
function _flattenExports(exports = {}, parentSubpath = "./") {
	return Object.entries(exports).flatMap(([key, value]) => {
		const [subpath, condition] = key.startsWith(".") ? [key.slice(1), void 0] : ["", key];
		const _subPath = joinURL(parentSubpath, subpath);
		if (typeof value === "string") return [{
			subpath: _subPath,
			fsPath: value,
			condition
		}];
		else return _flattenExports(value, _subPath);
	});
}
const ESM_STATIC_IMPORT_RE = /(?<=\s|^|;|\})import\s*(?:[\s"']*(?<imports>[\p{L}\p{M}\w\t\n\r $*,/{}@.]+)from\s*)?["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][\s;]*/gmu;
const EXPORT_DECAL_RE = /\bexport\s+(?<declaration>(?:async function\s*\*?|function\s*\*?|let|const enum|const|enum|var|class))\s+\*?(?<name>[\w$]+)(?<extraNames>.*,\s*[\s\w:[\]{}]*[\w$\]}]+)*/g;
const EXPORT_DECAL_TYPE_RE = /\bexport\s+(?<declaration>(?:interface|type|declare (?:async function|function|let|const enum|const|enum|var|class)))\s+(?<name>[\w$]+)/g;
const EXPORT_NAMED_RE = /\bexport\s*{(?<exports>[^}]+?)[\s,]*}(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_NAMED_TYPE_RE = /\bexport\s+type\s*{(?<exports>[^}]+?)[\s,]*}(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_NAMED_DESTRUCT = /\bexport\s+(?:let|var|const)\s+(?:{(?<exports1>[^}]+?)[\s,]*}|\[(?<exports2>[^\]]+?)[\s,]*])\s+=/gm;
const EXPORT_STAR_RE = /\bexport\s*\*(?:\s*as\s+(?<name>[\w$]+)\s+)?\s*(?:\s*from\s*["']\s*(?<specifier>(?<="\s*)[^"]*[^\s"](?=\s*")|(?<='\s*)[^']*[^\s'](?=\s*'))\s*["'][^\n;]*)?/g;
const EXPORT_DEFAULT_RE = /\bexport\s+default\s+(async function|function|class|true|false|\W|\d)|\bexport\s+default\s+(?<defaultName>.*)/g;
const EXPORT_DEFAULT_CLASS_RE = /\bexport\s+default\s+(?<declaration>class)\s+(?<name>[\w$]+)/g;
const TYPE_RE = /^\s*?type\s/;
function findStaticImports(code) {
	return _filterStatement(_tryGetLocations(code, "import"), matchAll(ESM_STATIC_IMPORT_RE, code, { type: "static" }));
}
function parseStaticImport(matched) {
	const cleanedImports = clearImports(matched.imports);
	const namedImports = {};
	const _matches = cleanedImports.match(/{([^}]*)}/)?.[1]?.split(",") || [];
	for (const namedImport of _matches) {
		const _match = namedImport.match(/^\s*(\S*) as (\S*)\s*$/);
		const source = _match?.[1] || namedImport.trim();
		const importName = _match?.[2] || source;
		if (source && !TYPE_RE.test(source)) namedImports[source] = importName;
	}
	const { namespacedImport, defaultImport } = getImportNames(cleanedImports);
	return {
		...matched,
		defaultImport,
		namespacedImport,
		namedImports
	};
}
function findExports(code) {
	const declaredExports = matchAll(EXPORT_DECAL_RE, code, { type: "declaration" });
	for (const declaredExport of declaredExports) {
		if (/^export\s+(?:async\s+)?function/.test(declaredExport.code)) continue;
		const extraNamesStr = declaredExport.extraNames;
		if (extraNamesStr) {
			const extraNames = matchAll(/({.*?})|(\[.*?])|(,\s*(?<name>\w+))/g, extraNamesStr, {}).map((m$3) => m$3.name).filter(Boolean);
			declaredExport.names = [declaredExport.name, ...extraNames];
		}
		delete declaredExport.extraNames;
	}
	const namedExports = normalizeNamedExports(matchAll(EXPORT_NAMED_RE, code, { type: "named" }));
	const destructuredExports = matchAll(EXPORT_NAMED_DESTRUCT, code, { type: "named" });
	for (const namedExport of destructuredExports) {
		namedExport.exports = namedExport.exports1 || namedExport.exports2;
		namedExport.names = namedExport.exports.replace(/^\r?\n?/, "").split(/\s*,\s*/g).filter((name) => !TYPE_RE.test(name)).map((name) => name.replace(/^.*?\s*:\s*/, "").replace(/\s*=\s*.*$/, "").trim());
	}
	const defaultExport = matchAll(EXPORT_DEFAULT_RE, code, {
		type: "default",
		name: "default"
	});
	const defaultClassExports = matchAll(EXPORT_DEFAULT_CLASS_RE, code, { type: "declaration" });
	const starExports = matchAll(EXPORT_STAR_RE, code, { type: "star" });
	const exports = normalizeExports([
		...declaredExports,
		...namedExports,
		...destructuredExports,
		...defaultExport,
		...defaultClassExports,
		...starExports
	]);
	if (exports.length === 0) return [];
	const exportLocations = _tryGetLocations(code, "export");
	if (exportLocations && exportLocations.length === 0) return [];
	return _filterStatement(exportLocations, exports).filter((exp, index, exports2) => {
		const nextExport = exports2[index + 1];
		return !nextExport || exp.type !== nextExport.type || !exp.name || exp.name !== nextExport.name;
	});
}
function findTypeExports(code) {
	const declaredExports = matchAll(EXPORT_DECAL_TYPE_RE, code, { type: "declaration" });
	const namedExports = normalizeNamedExports(matchAll(EXPORT_NAMED_TYPE_RE, code, { type: "named" }));
	const exports = normalizeExports([...declaredExports, ...namedExports]);
	if (exports.length === 0) return [];
	const exportLocations = _tryGetLocations(code, "export");
	if (exportLocations && exportLocations.length === 0) return [];
	return _filterStatement(exportLocations, exports).filter((exp, index, exports2) => {
		const nextExport = exports2[index + 1];
		return !nextExport || exp.type !== nextExport.type || !exp.name || exp.name !== nextExport.name;
	});
}
function normalizeExports(exports) {
	for (const exp of exports) {
		if (!exp.name && exp.names && exp.names.length === 1) exp.name = exp.names[0];
		if (exp.name === "default" && exp.type !== "default") {
			exp._type = exp.type;
			exp.type = "default";
		}
		if (!exp.names && exp.name) exp.names = [exp.name];
		if (exp.type === "declaration" && exp.declaration) exp.declarationType = exp.declaration.replace(/^declare\s*/, "");
	}
	return exports;
}
function normalizeNamedExports(namedExports) {
	for (const namedExport of namedExports) namedExport.names = namedExport.exports.replace(/^\r?\n?/, "").split(/\s*,\s*/g).filter((name) => !TYPE_RE.test(name)).map((name) => name.replace(/^.*?\sas\s/, "").trim());
	return namedExports;
}
async function resolveModuleExportNames(id, options) {
	const url = await resolvePath$1(id, options);
	const exports = findExports(await loadURL(url));
	const exportNames = new Set(exports.flatMap((exp) => exp.names).filter(Boolean));
	for (const exp of exports) {
		if (exp.type !== "star" || !exp.specifier) continue;
		const subExports = await resolveModuleExportNames(exp.specifier, {
			...options,
			url
		});
		for (const subExport of subExports) exportNames.add(subExport);
	}
	return [...exportNames];
}
function _filterStatement(locations, statements) {
	return statements.filter((exp) => {
		return !locations || locations.some((location) => {
			return exp.start <= location.start && exp.end >= location.end;
		});
	});
}
function _tryGetLocations(code, label) {
	try {
		return _getLocations(code, label);
	} catch {}
}
function _getLocations(code, label) {
	const tokens = tokenizer(code, {
		ecmaVersion: "latest",
		sourceType: "module",
		allowHashBang: true,
		allowAwaitOutsideFunction: true,
		allowImportExportEverywhere: true
	});
	const locations = [];
	for (const token of tokens) if (token.type.label === label) locations.push({
		start: token.start,
		end: token.end
	});
	return locations;
}
const ESM_RE = /(?:[\s;]|^)(?:import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m;
const CJS_RE = /(?:[\s;]|^)(?:module\.exports\b|exports\.\w|require\s*\(|global\.\w)/m;
const COMMENT_RE = /\/\*.+?\*\/|\/\/.*(?=[nr])/g;
function hasESMSyntax(code, opts = {}) {
	if (opts.stripComments) code = code.replace(COMMENT_RE, "");
	return ESM_RE.test(code);
}
function hasCJSSyntax(code, opts = {}) {
	if (opts.stripComments) code = code.replace(COMMENT_RE, "");
	return CJS_RE.test(code);
}
function detectSyntax(code, opts = {}) {
	if (opts.stripComments) code = code.replace(COMMENT_RE, "");
	const hasESM = hasESMSyntax(code, {});
	const hasCJS = hasCJSSyntax(code, {});
	return {
		hasESM,
		hasCJS,
		isMixed: hasESM && hasCJS
	};
}

//#endregion
//#region node_modules/.pnpm/pathe@2.0.3/node_modules/pathe/dist/utils.mjs
const pathSeparators = /* @__PURE__ */ new Set([
	"/",
	"\\",
	void 0
]);
const normalizedAliasSymbol = Symbol.for("pathe:normalizedAlias");
function normalizeAliases(_aliases) {
	if (_aliases[normalizedAliasSymbol]) return _aliases;
	const aliases = Object.fromEntries(Object.entries(_aliases).sort(([a$1], [b$2]) => _compareAliases(a$1, b$2)));
	for (const key in aliases) for (const alias in aliases) {
		if (alias === key || key.startsWith(alias)) continue;
		if (aliases[key]?.startsWith(alias) && pathSeparators.has(aliases[key][alias.length])) aliases[key] = aliases[alias] + aliases[key].slice(alias.length);
	}
	Object.defineProperty(aliases, normalizedAliasSymbol, {
		value: true,
		enumerable: false
	});
	return aliases;
}
function resolveAlias(path$2, aliases) {
	const _path = normalizeWindowsPath(path$2);
	aliases = normalizeAliases(aliases);
	for (const [alias, to] of Object.entries(aliases)) {
		if (!_path.startsWith(alias)) continue;
		if (hasTrailingSlash(_path[(hasTrailingSlash(alias) ? alias.slice(0, -1) : alias).length])) return join$2(to, _path.slice(alias.length));
	}
	return _path;
}
function _compareAliases(a$1, b$2) {
	return b$2.split("/").length - a$1.split("/").length;
}
function hasTrailingSlash(path$2 = "/") {
	const lastChar = path$2[path$2.length - 1];
	return lastChar === "/" || lastChar === "\\";
}

//#endregion
//#region node_modules/.pnpm/untyped@2.0.0/node_modules/untyped/dist/shared/untyped.Br_uXjZG.mjs
function getType(val) {
	const type$1 = typeof val;
	if (type$1 === "undefined" || val === null) return;
	if (Array.isArray(val)) return "array";
	return type$1;
}
function isObject$1(val) {
	return val !== null && !Array.isArray(val) && typeof val === "object";
}
function nonEmpty(arr) {
	return arr.filter(Boolean);
}
function unique(arr) {
	return [...new Set(arr)];
}
function joinPath(a$1, b$2 = "", sep$2 = ".") {
	return a$1 ? a$1 + sep$2 + b$2 : b$2;
}
function setValue(obj, path$2, val) {
	const keys = path$2.split(".");
	const _key = keys.pop();
	for (const key of keys) {
		if (!obj || typeof obj !== "object") return;
		if (!(key in obj)) obj[key] = {};
		obj = obj[key];
	}
	if (_key) {
		if (!obj || typeof obj !== "object") return;
		obj[_key] = val;
	}
}
function getValue(obj, path$2) {
	for (const key of path$2.split(".")) {
		if (!obj || typeof obj !== "object" || !(key in obj)) return;
		obj = obj[key];
	}
	return obj;
}
function normalizeTypes(val) {
	const arr = unique(val.filter(Boolean));
	if (arr.length === 0 || arr.includes("any")) return;
	return arr.length > 1 ? arr : arr[0];
}

//#endregion
//#region node_modules/.pnpm/untyped@2.0.0/node_modules/untyped/dist/shared/untyped.BTwOq8Jl.mjs
async function resolveSchema(obj, defaults, options = {}) {
	return await _resolveSchema(obj, "", {
		root: obj,
		defaults,
		resolveCache: {},
		ignoreDefaults: !!options.ignoreDefaults
	});
}
async function _resolveSchema(input, id, ctx) {
	if (id in ctx.resolveCache) return ctx.resolveCache[id];
	const schemaId = "#" + id.replace(/\./g, "/");
	if (!isObject$1(input)) {
		const safeInput = Array.isArray(input) ? [...input] : input;
		const schema2 = {
			type: getType(input),
			id: schemaId,
			default: ctx.ignoreDefaults ? void 0 : safeInput
		};
		normalizeSchema(schema2, { ignoreDefaults: ctx.ignoreDefaults });
		ctx.resolveCache[id] = schema2;
		if (ctx.defaults && getValue(ctx.defaults, id) === void 0) setValue(ctx.defaults, id, schema2.default);
		return schema2;
	}
	const node = { ...input };
	const schema = ctx.resolveCache[id] = {
		...node.$schema,
		id: schemaId
	};
	for (const key in node) {
		if (key === "$resolve" || key === "$schema" || key === "$default") continue;
		schema.properties = schema.properties || {};
		if (!schema.properties[key]) {
			const child = schema.properties[key] = await _resolveSchema(node[key], joinPath(id, key), ctx);
			if (Array.isArray(child.tags) && child.tags.includes("@required")) {
				schema.required = schema.required || [];
				if (!schema.required.includes(key)) schema.required.push(key);
			}
		}
	}
	if (!ctx.ignoreDefaults) {
		if (ctx.defaults) schema.default = getValue(ctx.defaults, id);
		if (schema.default === void 0 && "$default" in node) schema.default = node.$default;
		if (typeof node.$resolve === "function") schema.default = await node.$resolve(schema.default, async (key) => {
			return (await _resolveSchema(getValue(ctx.root, key), key, ctx)).default;
		});
	}
	if (ctx.defaults) setValue(ctx.defaults, id, schema.default);
	if (!schema.type) schema.type = getType(schema.default) || (schema.properties ? "object" : "any");
	normalizeSchema(schema, { ignoreDefaults: ctx.ignoreDefaults });
	if (ctx.defaults && getValue(ctx.defaults, id) === void 0) setValue(ctx.defaults, id, schema.default);
	return schema;
}
function normalizeSchema(schema, options) {
	if (schema.type === "array" && !("items" in schema)) {
		schema.items = { type: nonEmpty(unique(schema.default.map((i$2) => getType(i$2)))) };
		if (schema.items.type) {
			if (schema.items.type.length === 0) schema.items.type = "any";
			else if (schema.items.type.length === 1) schema.items.type = schema.items.type[0];
		}
	}
	if (!options.ignoreDefaults && schema.default === void 0 && ("properties" in schema || schema.type === "object" || schema.type === "any")) {
		const propsWithDefaults = Object.entries(schema.properties || {}).filter(([, prop]) => "default" in prop).map(([key, value]) => [key, value.default]);
		schema.default = Object.fromEntries(propsWithDefaults);
	}
}

//#endregion
//#region node_modules/.pnpm/knitwork@1.3.0/node_modules/knitwork/dist/index.mjs
function genString(input, options = {}) {
	const str = JSON.stringify(input);
	if (!options.singleQuotes) return str;
	return `'${escapeString(str).slice(1, -1)}'`;
}
const NEEDS_ESCAPE_RE = /[\n\r'\\\u2028\u2029]/;
const QUOTE_NEWLINE_RE = /([\n\r'\u2028\u2029])/g;
const BACKSLASH_RE = /\\/g;
function escapeString(id) {
	if (!NEEDS_ESCAPE_RE.test(id)) return id;
	return id.replace(BACKSLASH_RE, "\\\\").replace(QUOTE_NEWLINE_RE, "\\$1");
}
function genSafeVariableName(name) {
	if (reservedNames.has(name)) return `_${name}`;
	return name.replace(/^\d/, (r$3) => `_${r$3}`).replace(/\W/g, (r$3) => "_" + r$3.charCodeAt(0));
}
const reservedNames = /* @__PURE__ */ new Set([
	"Infinity",
	"NaN",
	"arguments",
	"await",
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"eval",
	"export",
	"extends",
	"false",
	"finally",
	"for",
	"function",
	"if",
	"implements",
	"import",
	"in",
	"instanceof",
	"interface",
	"let",
	"new",
	"null",
	"package",
	"private",
	"protected",
	"public",
	"return",
	"static",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typeof",
	"undefined",
	"var",
	"void",
	"while",
	"with",
	"yield"
]);
const VALID_IDENTIFIER_RE = /^[$_]?([A-Z_a-z]\w*|\d)$/;
function _genStatement(type$1, specifier, names, options = {}) {
	const specifierString = genString(specifier, options);
	if (!names) return `${type$1} ${specifierString};`;
	const nameArray = Array.isArray(names);
	const namesString = (nameArray ? names : [names]).map((index) => {
		if (typeof index === "string") return { name: index };
		if (index.name === index.as) index = { name: index.name };
		return index;
	}).map((index) => index.as ? `${index.name} as ${index.as}` : index.name).join(", ");
	if (nameArray) return `${type$1} { ${namesString} } from ${genString(specifier, options)}${_genImportAttributes(type$1, options)};`;
	return `${type$1} ${namesString} from ${genString(specifier, options)}${_genImportAttributes(type$1, options)};`;
}
function _genImportAttributes(type$1, options) {
	if (type$1 === "import type" || type$1 === "export type") return "";
	if (typeof options.attributes?.type === "string") return ` with { type: ${genString(options.attributes.type)} }`;
	if (typeof options.assert?.type === "string") return ` assert { type: ${genString(options.assert.type)} }`;
	return "";
}
function genImport(specifier, imports, options = {}) {
	return _genStatement("import", specifier, imports, options);
}
function wrapInDelimiters(lines, indent = "", delimiters = "{}", withComma = true) {
	if (lines.length === 0) return delimiters;
	const [start, end] = delimiters;
	return `${start}
` + lines.join(withComma ? ",\n" : "\n") + `
${indent}${end}`;
}
function genObjectKey(key) {
	return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}
function genObjectFromRaw(object, indent = "", options = {}) {
	return genObjectFromRawEntries(Object.entries(object), indent, options);
}
function genArrayFromRaw(array, indent = "", options = {}) {
	const newIdent = indent + "  ";
	return wrapInDelimiters(array.map((index) => `${newIdent}${genRawValue(index, newIdent, options)}`), indent, "[]");
}
function genObjectFromRawEntries(array, indent = "", options = {}) {
	const newIdent = indent + "  ";
	return wrapInDelimiters(array.map(([key, value]) => `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, options)}`), indent, "{}");
}
function genRawValue(value, indent = "", options = {}) {
	if (value === void 0) return "undefined";
	if (value === null) return "null";
	if (Array.isArray(value)) return genArrayFromRaw(value, indent, options);
	if (value && typeof value === "object") return genObjectFromRaw(value, indent, options);
	if (options.preserveTypes && typeof value !== "function") return JSON.stringify(value);
	return value.toString();
}

//#endregion
//#region node_modules/.pnpm/untyped@2.0.0/node_modules/untyped/dist/index.mjs
const GenerateTypesDefaults = {
	interfaceName: "Untyped",
	addExport: true,
	addDefaults: true,
	allowExtraKeys: void 0,
	partial: false,
	indentation: 0
};
const TYPE_MAP = {
	array: "any[]",
	bigint: "bigint",
	boolean: "boolean",
	number: "number",
	object: "",
	any: "any",
	string: "string",
	symbol: "Symbol",
	function: "Function"
};
const SCHEMA_KEYS = /* @__PURE__ */ new Set([
	"items",
	"default",
	"resolve",
	"properties",
	"title",
	"description",
	"$schema",
	"type",
	"tsType",
	"markdownType",
	"tags",
	"args",
	"id",
	"returns"
]);
const DECLARATION_RE = /typeof import\(["'](?<source>[^)]+)["']\)(\.(?<type>\w+)|\[["'](?<type1>\w+)["']])/g;
function extractTypeImports(declarations) {
	const typeImports = {};
	const aliases = /* @__PURE__ */ new Set();
	const imports = [];
	for (const match of declarations.matchAll(DECLARATION_RE)) {
		const { source, type1, type: type$1 = type1 } = match.groups || {};
		typeImports[source] = typeImports[source] || /* @__PURE__ */ new Set();
		typeImports[source].add(type$1);
	}
	for (const source in typeImports) {
		const sourceImports = [];
		for (const type$1 of typeImports[source]) {
			let count = 0;
			let alias = type$1;
			while (aliases.has(alias)) alias = `${type$1}${count++}`;
			aliases.add(alias);
			sourceImports.push(alias === type$1 ? type$1 : `${type$1} as ${alias}`);
			declarations = declarations.replace(new RegExp(`typeof import\\(['"]${source}['"]\\)(\\.${type$1}|\\[['"]${type$1}['"]\\])`, "g"), alias);
		}
		imports.push(`import type { ${sourceImports.join(", ")} } from '${source}'`);
	}
	return [...imports, declarations].join("\n");
}
function generateTypes(schema, opts = {}) {
	opts = {
		...GenerateTypesDefaults,
		...opts
	};
	const baseIden = " ".repeat(opts.indentation || 0);
	const interfaceCode = `interface ${opts.interfaceName} {
` + _genTypes(schema, baseIden + " ", opts).map((l$1) => l$1.trim().length > 0 ? l$1 : "").join("\n") + `
${baseIden}}`;
	if (!opts.addExport) return baseIden + interfaceCode;
	return extractTypeImports(baseIden + `export ${interfaceCode}`);
}
function _genTypes(schema, spaces, opts) {
	const buff = [];
	if (!schema) return buff;
	for (const key in schema.properties) {
		const val = schema.properties[key];
		buff.push(...generateJSDoc(val, opts));
		if (val.tsType) buff.push(`${genObjectKey(key)}${isRequired(schema, key, opts) ? "" : "?"}: ${val.tsType},
`);
		else if (val.type === "object") buff.push(`${genObjectKey(key)}${isRequired(schema, key, opts) ? "" : "?"}: {`, ..._genTypes(val, spaces, opts), "},\n");
		else {
			let type$1;
			if (val.type === "array") type$1 = `Array<${getTsType(val.items || [], opts)}>`;
			else if (val.type === "function") type$1 = genFunctionType(val, opts);
			else type$1 = getTsType(val, opts);
			buff.push(`${genObjectKey(key)}${isRequired(schema, key, opts) ? "" : "?"}: ${type$1},
`);
		}
	}
	if (buff.length > 0) {
		const last = buff.pop() || "";
		buff.push(last.slice(0, Math.max(0, last.length - 1)));
	}
	if (opts.allowExtraKeys === true || buff.length === 0 && opts.allowExtraKeys !== false) buff.push("[key: string]: any");
	return buff.flatMap((l$1) => l$1.split("\n")).map((l$1) => spaces + l$1);
}
function getTsType(type$1, opts) {
	if (Array.isArray(type$1)) return [normalizeTypes(type$1.map((t$1) => getTsType(t$1, opts)))].flat().join("|") || "any";
	if (!type$1) return "any";
	if (type$1.tsType) return type$1.tsType;
	if (!type$1.type) return "any";
	if (Array.isArray(type$1.type)) return type$1.type.map((t$1) => {
		if (t$1 === "object" && type$1.type.length > 1) return `{
` + _genTypes(type$1, " ", opts).join("\n") + `
}`;
		return TYPE_MAP[t$1];
	}).join("|");
	if (type$1.type === "array") return `Array<${getTsType(type$1.items || [], opts)}>`;
	if (type$1.type === "object") return `{
` + _genTypes(type$1, " ", opts).join("\n") + `
}`;
	return TYPE_MAP[type$1.type] || type$1.type;
}
function genFunctionType(schema, opts) {
	return `(${genFunctionArgs(schema.args, opts)}) => ${getTsType(schema.returns || [], opts)}`;
}
function genFunctionArgs(args, opts) {
	return args?.map((arg) => {
		let argStr = arg.name;
		if (arg.optional || arg.default) argStr += "?";
		if (arg.type || arg.tsType) argStr += `: ${getTsType(arg, opts)}`;
		return argStr;
	}).join(", ") || "";
}
function generateJSDoc(schema, opts) {
	opts.defaultDescription = opts.defaultDescription || opts.defaultDescrption;
	let buff = [];
	if (schema.title) buff.push(schema.title, "");
	if (schema.description) buff.push(schema.description, "");
	else if (opts.defaultDescription && schema.type !== "object") buff.push(opts.defaultDescription, "");
	if (opts.addDefaults && schema.type !== "object" && schema.type !== "any" && !(Array.isArray(schema.default) && schema.default.length === 0)) {
		const stringified = JSON.stringify(schema.default);
		if (stringified) buff.push(`@default ${stringified.replace(/\*\//g, String.raw`*\/`)}`);
	}
	for (const key in schema) if (!SCHEMA_KEYS.has(key)) buff.push("", `@${key} ${schema[key]}`);
	if (Array.isArray(schema.tags)) {
		for (const tag of schema.tags) if (tag !== "@untyped") buff.push("", tag);
	}
	buff = buff.flatMap((i$2) => i$2.split("\n"));
	if (buff.length > 0) return buff.length === 1 ? ["/** " + buff[0] + " */"] : [
		"/**",
		...buff.map((i$2) => ` * ${i$2}`),
		"*/"
	];
	return [];
}
function isRequired(schema, key, opts) {
	if (Array.isArray(schema.required) && schema.required.includes(key)) return true;
	return !opts.partial;
}

//#endregion
//#region node_modules/.pnpm/@jridgewell+sourcemap-codec@1.5.5/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i$2 = 0; i$2 < chars.length; i$2++) {
	const c$1 = chars.charCodeAt(i$2);
	intToChar[i$2] = c$1;
	charToInt[c$1] = i$2;
}
function decodeInteger(reader, relative$3) {
	let value = 0;
	let shift = 0;
	let integer = 0;
	do {
		integer = charToInt[reader.next()];
		value |= (integer & 31) << shift;
		shift += 5;
	} while (integer & 32);
	const shouldNegate = value & 1;
	value >>>= 1;
	if (shouldNegate) value = -2147483648 | -value;
	return relative$3 + value;
}
function encodeInteger(builder, num, relative$3) {
	let delta = num - relative$3;
	delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
	do {
		let clamped = delta & 31;
		delta >>>= 5;
		if (delta > 0) clamped |= 32;
		builder.write(intToChar[clamped]);
	} while (delta > 0);
	return num;
}
function hasMoreVlq(reader, max) {
	if (reader.pos >= max) return false;
	return reader.peek() !== comma;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? { decode(buf) {
	return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString();
} } : { decode(buf) {
	let out = "";
	for (let i$2 = 0; i$2 < buf.length; i$2++) out += String.fromCharCode(buf[i$2]);
	return out;
} };
var StringWriter = class {
	constructor() {
		this.pos = 0;
		this.out = "";
		this.buffer = new Uint8Array(bufLength);
	}
	write(v$3) {
		const { buffer } = this;
		buffer[this.pos++] = v$3;
		if (this.pos === bufLength) {
			this.out += td.decode(buffer);
			this.pos = 0;
		}
	}
	flush() {
		const { buffer, out, pos } = this;
		return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
	}
};
var StringReader = class {
	constructor(buffer) {
		this.pos = 0;
		this.buffer = buffer;
	}
	next() {
		return this.buffer.charCodeAt(this.pos++);
	}
	peek() {
		return this.buffer.charCodeAt(this.pos);
	}
	indexOf(char) {
		const { buffer, pos } = this;
		const idx = buffer.indexOf(char, pos);
		return idx === -1 ? buffer.length : idx;
	}
};
function decode(mappings) {
	const { length } = mappings;
	const reader = new StringReader(mappings);
	const decoded = [];
	let genColumn = 0;
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	do {
		const semi = reader.indexOf(";");
		const line = [];
		let sorted = true;
		let lastCol = 0;
		genColumn = 0;
		while (reader.pos < semi) {
			let seg;
			genColumn = decodeInteger(reader, genColumn);
			if (genColumn < lastCol) sorted = false;
			lastCol = genColumn;
			if (hasMoreVlq(reader, semi)) {
				sourcesIndex = decodeInteger(reader, sourcesIndex);
				sourceLine = decodeInteger(reader, sourceLine);
				sourceColumn = decodeInteger(reader, sourceColumn);
				if (hasMoreVlq(reader, semi)) {
					namesIndex = decodeInteger(reader, namesIndex);
					seg = [
						genColumn,
						sourcesIndex,
						sourceLine,
						sourceColumn,
						namesIndex
					];
				} else seg = [
					genColumn,
					sourcesIndex,
					sourceLine,
					sourceColumn
				];
			} else seg = [genColumn];
			line.push(seg);
			reader.pos++;
		}
		if (!sorted) sort(line);
		decoded.push(line);
		reader.pos = semi + 1;
	} while (reader.pos <= length);
	return decoded;
}
function sort(line) {
	line.sort(sortComparator);
}
function sortComparator(a$1, b$2) {
	return a$1[0] - b$2[0];
}
function encode(decoded) {
	const writer = new StringWriter();
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	for (let i$2 = 0; i$2 < decoded.length; i$2++) {
		const line = decoded[i$2];
		if (i$2 > 0) writer.write(semicolon);
		if (line.length === 0) continue;
		let genColumn = 0;
		for (let j$1 = 0; j$1 < line.length; j$1++) {
			const segment = line[j$1];
			if (j$1 > 0) writer.write(comma);
			genColumn = encodeInteger(writer, segment[0], genColumn);
			if (segment.length === 1) continue;
			sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
			sourceLine = encodeInteger(writer, segment[2], sourceLine);
			sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
			if (segment.length === 4) continue;
			namesIndex = encodeInteger(writer, segment[4], namesIndex);
		}
	}
	return writer.flush();
}

//#endregion
//#region node_modules/.pnpm/magic-string@0.30.21/node_modules/magic-string/dist/magic-string.es.mjs
var BitSet = class BitSet {
	constructor(arg) {
		this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
	}
	add(n) {
		this.bits[n >> 5] |= 1 << (n & 31);
	}
	has(n) {
		return !!(this.bits[n >> 5] & 1 << (n & 31));
	}
};
var Chunk = class Chunk {
	constructor(start, end, content) {
		this.start = start;
		this.end = end;
		this.original = content;
		this.intro = "";
		this.outro = "";
		this.content = content;
		this.storeName = false;
		this.edited = false;
		this.previous = null;
		this.next = null;
	}
	appendLeft(content) {
		this.outro += content;
	}
	appendRight(content) {
		this.intro = this.intro + content;
	}
	clone() {
		const chunk = new Chunk(this.start, this.end, this.original);
		chunk.intro = this.intro;
		chunk.outro = this.outro;
		chunk.content = this.content;
		chunk.storeName = this.storeName;
		chunk.edited = this.edited;
		return chunk;
	}
	contains(index) {
		return this.start < index && index < this.end;
	}
	eachNext(fn) {
		let chunk = this;
		while (chunk) {
			fn(chunk);
			chunk = chunk.next;
		}
	}
	eachPrevious(fn) {
		let chunk = this;
		while (chunk) {
			fn(chunk);
			chunk = chunk.previous;
		}
	}
	edit(content, storeName, contentOnly) {
		this.content = content;
		if (!contentOnly) {
			this.intro = "";
			this.outro = "";
		}
		this.storeName = storeName;
		this.edited = true;
		return this;
	}
	prependLeft(content) {
		this.outro = content + this.outro;
	}
	prependRight(content) {
		this.intro = content + this.intro;
	}
	reset() {
		this.intro = "";
		this.outro = "";
		if (this.edited) {
			this.content = this.original;
			this.storeName = false;
			this.edited = false;
		}
	}
	split(index) {
		const sliceIndex = index - this.start;
		const originalBefore = this.original.slice(0, sliceIndex);
		const originalAfter = this.original.slice(sliceIndex);
		this.original = originalBefore;
		const newChunk = new Chunk(index, this.end, originalAfter);
		newChunk.outro = this.outro;
		this.outro = "";
		this.end = index;
		if (this.edited) {
			newChunk.edit("", false);
			this.content = "";
		} else this.content = originalBefore;
		newChunk.next = this.next;
		if (newChunk.next) newChunk.next.previous = newChunk;
		newChunk.previous = this;
		this.next = newChunk;
		return newChunk;
	}
	toString() {
		return this.intro + this.content + this.outro;
	}
	trimEnd(rx) {
		this.outro = this.outro.replace(rx, "");
		if (this.outro.length) return true;
		const trimmed = this.content.replace(rx, "");
		if (trimmed.length) {
			if (trimmed !== this.content) {
				this.split(this.start + trimmed.length).edit("", void 0, true);
				if (this.edited) this.edit(trimmed, this.storeName, true);
			}
			return true;
		} else {
			this.edit("", void 0, true);
			this.intro = this.intro.replace(rx, "");
			if (this.intro.length) return true;
		}
	}
	trimStart(rx) {
		this.intro = this.intro.replace(rx, "");
		if (this.intro.length) return true;
		const trimmed = this.content.replace(rx, "");
		if (trimmed.length) {
			if (trimmed !== this.content) {
				const newChunk = this.split(this.end - trimmed.length);
				if (this.edited) newChunk.edit(trimmed, this.storeName, true);
				this.edit("", void 0, true);
			}
			return true;
		} else {
			this.edit("", void 0, true);
			this.outro = this.outro.replace(rx, "");
			if (this.outro.length) return true;
		}
	}
};
function getBtoa() {
	if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") return (str) => globalThis.btoa(unescape(encodeURIComponent(str)));
	else if (typeof Buffer === "function") return (str) => Buffer.from(str, "utf-8").toString("base64");
	else return () => {
		throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
	};
}
const btoa = /* @__PURE__ */ getBtoa();
var SourceMap = class {
	constructor(properties) {
		this.version = 3;
		this.file = properties.file;
		this.sources = properties.sources;
		this.sourcesContent = properties.sourcesContent;
		this.names = properties.names;
		this.mappings = encode(properties.mappings);
		if (typeof properties.x_google_ignoreList !== "undefined") this.x_google_ignoreList = properties.x_google_ignoreList;
		if (typeof properties.debugId !== "undefined") this.debugId = properties.debugId;
	}
	toString() {
		return JSON.stringify(this);
	}
	toUrl() {
		return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
	}
};
function guessIndent(code) {
	const lines = code.split("\n");
	const tabbed = lines.filter((line) => /^\t+/.test(line));
	const spaced = lines.filter((line) => /^ {2,}/.test(line));
	if (tabbed.length === 0 && spaced.length === 0) return null;
	if (tabbed.length >= spaced.length) return "	";
	const min = spaced.reduce((previous, current) => {
		const numSpaces = /^ +/.exec(current)[0].length;
		return Math.min(numSpaces, previous);
	}, Infinity);
	return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
	const fromParts = from.split(/[/\\]/);
	const toParts = to.split(/[/\\]/);
	fromParts.pop();
	while (fromParts[0] === toParts[0]) {
		fromParts.shift();
		toParts.shift();
	}
	if (fromParts.length) {
		let i$2 = fromParts.length;
		while (i$2--) fromParts[i$2] = "..";
	}
	return fromParts.concat(toParts).join("/");
}
const toString = Object.prototype.toString;
function isObject(thing) {
	return toString.call(thing) === "[object Object]";
}
function getLocator(source) {
	const originalLines = source.split("\n");
	const lineOffsets = [];
	for (let i$2 = 0, pos = 0; i$2 < originalLines.length; i$2++) {
		lineOffsets.push(pos);
		pos += originalLines[i$2].length + 1;
	}
	return function locate(index) {
		let i$2 = 0;
		let j$1 = lineOffsets.length;
		while (i$2 < j$1) {
			const m$3 = i$2 + j$1 >> 1;
			if (index < lineOffsets[m$3]) j$1 = m$3;
			else i$2 = m$3 + 1;
		}
		const line = i$2 - 1;
		return {
			line,
			column: index - lineOffsets[line]
		};
	};
}
const wordRegex = /\w/;
var Mappings = class {
	constructor(hires) {
		this.hires = hires;
		this.generatedCodeLine = 0;
		this.generatedCodeColumn = 0;
		this.raw = [];
		this.rawSegments = this.raw[this.generatedCodeLine] = [];
		this.pending = null;
	}
	addEdit(sourceIndex, content, loc, nameIndex) {
		if (content.length) {
			const contentLengthMinusOne = content.length - 1;
			let contentLineEnd = content.indexOf("\n", 0);
			let previousContentLineEnd = -1;
			while (contentLineEnd >= 0 && contentLengthMinusOne > contentLineEnd) {
				const segment$1 = [
					this.generatedCodeColumn,
					sourceIndex,
					loc.line,
					loc.column
				];
				if (nameIndex >= 0) segment$1.push(nameIndex);
				this.rawSegments.push(segment$1);
				this.generatedCodeLine += 1;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
				this.generatedCodeColumn = 0;
				previousContentLineEnd = contentLineEnd;
				contentLineEnd = content.indexOf("\n", contentLineEnd + 1);
			}
			const segment = [
				this.generatedCodeColumn,
				sourceIndex,
				loc.line,
				loc.column
			];
			if (nameIndex >= 0) segment.push(nameIndex);
			this.rawSegments.push(segment);
			this.advance(content.slice(previousContentLineEnd + 1));
		} else if (this.pending) {
			this.rawSegments.push(this.pending);
			this.advance(content);
		}
		this.pending = null;
	}
	addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
		let originalCharIndex = chunk.start;
		let first = true;
		let charInHiresBoundary = false;
		while (originalCharIndex < chunk.end) {
			if (original[originalCharIndex] === "\n") {
				loc.line += 1;
				loc.column = 0;
				this.generatedCodeLine += 1;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
				this.generatedCodeColumn = 0;
				first = true;
				charInHiresBoundary = false;
			} else {
				if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
					const segment = [
						this.generatedCodeColumn,
						sourceIndex,
						loc.line,
						loc.column
					];
					if (this.hires === "boundary") if (wordRegex.test(original[originalCharIndex])) {
						if (!charInHiresBoundary) {
							this.rawSegments.push(segment);
							charInHiresBoundary = true;
						}
					} else {
						this.rawSegments.push(segment);
						charInHiresBoundary = false;
					}
					else this.rawSegments.push(segment);
				}
				loc.column += 1;
				this.generatedCodeColumn += 1;
				first = false;
			}
			originalCharIndex += 1;
		}
		this.pending = null;
	}
	advance(str) {
		if (!str) return;
		const lines = str.split("\n");
		if (lines.length > 1) {
			for (let i$2 = 0; i$2 < lines.length - 1; i$2++) {
				this.generatedCodeLine++;
				this.raw[this.generatedCodeLine] = this.rawSegments = [];
			}
			this.generatedCodeColumn = 0;
		}
		this.generatedCodeColumn += lines[lines.length - 1].length;
	}
};
const n = "\n";
const warned = {
	insertLeft: false,
	insertRight: false,
	storeName: false
};
var MagicString = class MagicString {
	constructor(string, options = {}) {
		const chunk = new Chunk(0, string.length, string);
		Object.defineProperties(this, {
			original: {
				writable: true,
				value: string
			},
			outro: {
				writable: true,
				value: ""
			},
			intro: {
				writable: true,
				value: ""
			},
			firstChunk: {
				writable: true,
				value: chunk
			},
			lastChunk: {
				writable: true,
				value: chunk
			},
			lastSearchedChunk: {
				writable: true,
				value: chunk
			},
			byStart: {
				writable: true,
				value: {}
			},
			byEnd: {
				writable: true,
				value: {}
			},
			filename: {
				writable: true,
				value: options.filename
			},
			indentExclusionRanges: {
				writable: true,
				value: options.indentExclusionRanges
			},
			sourcemapLocations: {
				writable: true,
				value: new BitSet()
			},
			storedNames: {
				writable: true,
				value: {}
			},
			indentStr: {
				writable: true,
				value: void 0
			},
			ignoreList: {
				writable: true,
				value: options.ignoreList
			},
			offset: {
				writable: true,
				value: options.offset || 0
			}
		});
		this.byStart[0] = chunk;
		this.byEnd[string.length] = chunk;
	}
	addSourcemapLocation(char) {
		this.sourcemapLocations.add(char);
	}
	append(content) {
		if (typeof content !== "string") throw new TypeError("outro content must be a string");
		this.outro += content;
		return this;
	}
	appendLeft(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byEnd[index];
		if (chunk) chunk.appendLeft(content);
		else this.intro += content;
		return this;
	}
	appendRight(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byStart[index];
		if (chunk) chunk.appendRight(content);
		else this.outro += content;
		return this;
	}
	clone() {
		const cloned = new MagicString(this.original, {
			filename: this.filename,
			offset: this.offset
		});
		let originalChunk = this.firstChunk;
		let clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
		while (originalChunk) {
			cloned.byStart[clonedChunk.start] = clonedChunk;
			cloned.byEnd[clonedChunk.end] = clonedChunk;
			const nextOriginalChunk = originalChunk.next;
			const nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
			if (nextClonedChunk) {
				clonedChunk.next = nextClonedChunk;
				nextClonedChunk.previous = clonedChunk;
				clonedChunk = nextClonedChunk;
			}
			originalChunk = nextOriginalChunk;
		}
		cloned.lastChunk = clonedChunk;
		if (this.indentExclusionRanges) cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
		cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
		cloned.intro = this.intro;
		cloned.outro = this.outro;
		return cloned;
	}
	generateDecodedMap(options) {
		options = options || {};
		const sourceIndex = 0;
		const names = Object.keys(this.storedNames);
		const mappings = new Mappings(options.hires);
		const locate = getLocator(this.original);
		if (this.intro) mappings.advance(this.intro);
		this.firstChunk.eachNext((chunk) => {
			const loc = locate(chunk.start);
			if (chunk.intro.length) mappings.advance(chunk.intro);
			if (chunk.edited) mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
			else mappings.addUneditedChunk(sourceIndex, chunk, this.original, loc, this.sourcemapLocations);
			if (chunk.outro.length) mappings.advance(chunk.outro);
		});
		if (this.outro) mappings.advance(this.outro);
		return {
			file: options.file ? options.file.split(/[/\\]/).pop() : void 0,
			sources: [options.source ? getRelativePath(options.file || "", options.source) : options.file || ""],
			sourcesContent: options.includeContent ? [this.original] : void 0,
			names,
			mappings: mappings.raw,
			x_google_ignoreList: this.ignoreList ? [sourceIndex] : void 0
		};
	}
	generateMap(options) {
		return new SourceMap(this.generateDecodedMap(options));
	}
	_ensureindentStr() {
		if (this.indentStr === void 0) this.indentStr = guessIndent(this.original);
	}
	_getRawIndentString() {
		this._ensureindentStr();
		return this.indentStr;
	}
	getIndentString() {
		this._ensureindentStr();
		return this.indentStr === null ? "	" : this.indentStr;
	}
	indent(indentStr, options) {
		const pattern = /^[^\r\n]/gm;
		if (isObject(indentStr)) {
			options = indentStr;
			indentStr = void 0;
		}
		if (indentStr === void 0) {
			this._ensureindentStr();
			indentStr = this.indentStr || "	";
		}
		if (indentStr === "") return this;
		options = options || {};
		const isExcluded = {};
		if (options.exclude) (typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude).forEach((exclusion) => {
			for (let i$2 = exclusion[0]; i$2 < exclusion[1]; i$2 += 1) isExcluded[i$2] = true;
		});
		let shouldIndentNextCharacter = options.indentStart !== false;
		const replacer = (match) => {
			if (shouldIndentNextCharacter) return `${indentStr}${match}`;
			shouldIndentNextCharacter = true;
			return match;
		};
		this.intro = this.intro.replace(pattern, replacer);
		let charIndex = 0;
		let chunk = this.firstChunk;
		while (chunk) {
			const end = chunk.end;
			if (chunk.edited) {
				if (!isExcluded[charIndex]) {
					chunk.content = chunk.content.replace(pattern, replacer);
					if (chunk.content.length) shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
				}
			} else {
				charIndex = chunk.start;
				while (charIndex < end) {
					if (!isExcluded[charIndex]) {
						const char = this.original[charIndex];
						if (char === "\n") shouldIndentNextCharacter = true;
						else if (char !== "\r" && shouldIndentNextCharacter) {
							shouldIndentNextCharacter = false;
							if (charIndex === chunk.start) chunk.prependRight(indentStr);
							else {
								this._splitChunk(chunk, charIndex);
								chunk = chunk.next;
								chunk.prependRight(indentStr);
							}
						}
					}
					charIndex += 1;
				}
			}
			charIndex = chunk.end;
			chunk = chunk.next;
		}
		this.outro = this.outro.replace(pattern, replacer);
		return this;
	}
	insert() {
		throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
	}
	insertLeft(index, content) {
		if (!warned.insertLeft) {
			console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead");
			warned.insertLeft = true;
		}
		return this.appendLeft(index, content);
	}
	insertRight(index, content) {
		if (!warned.insertRight) {
			console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead");
			warned.insertRight = true;
		}
		return this.prependRight(index, content);
	}
	move(start, end, index) {
		start = start + this.offset;
		end = end + this.offset;
		index = index + this.offset;
		if (index >= start && index <= end) throw new Error("Cannot move a selection inside itself");
		this._split(start);
		this._split(end);
		this._split(index);
		const first = this.byStart[start];
		const last = this.byEnd[end];
		const oldLeft = first.previous;
		const oldRight = last.next;
		const newRight = this.byStart[index];
		if (!newRight && last === this.lastChunk) return this;
		const newLeft = newRight ? newRight.previous : this.lastChunk;
		if (oldLeft) oldLeft.next = oldRight;
		if (oldRight) oldRight.previous = oldLeft;
		if (newLeft) newLeft.next = first;
		if (newRight) newRight.previous = last;
		if (!first.previous) this.firstChunk = last.next;
		if (!last.next) {
			this.lastChunk = first.previous;
			this.lastChunk.next = null;
		}
		first.previous = newLeft;
		last.next = newRight || null;
		if (!newLeft) this.firstChunk = first;
		if (!newRight) this.lastChunk = last;
		return this;
	}
	overwrite(start, end, content, options) {
		options = options || {};
		return this.update(start, end, content, {
			...options,
			overwrite: !options.contentOnly
		});
	}
	update(start, end, content, options) {
		start = start + this.offset;
		end = end + this.offset;
		if (typeof content !== "string") throw new TypeError("replacement content must be a string");
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (end > this.original.length) throw new Error("end is out of bounds");
		if (start === end) throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");
		this._split(start);
		this._split(end);
		if (options === true) {
			if (!warned.storeName) {
				console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string");
				warned.storeName = true;
			}
			options = { storeName: true };
		}
		const storeName = options !== void 0 ? options.storeName : false;
		const overwrite = options !== void 0 ? options.overwrite : false;
		if (storeName) {
			const original = this.original.slice(start, end);
			Object.defineProperty(this.storedNames, original, {
				writable: true,
				value: true,
				enumerable: true
			});
		}
		const first = this.byStart[start];
		const last = this.byEnd[end];
		if (first) {
			let chunk = first;
			while (chunk !== last) {
				if (chunk.next !== this.byStart[chunk.end]) throw new Error("Cannot overwrite across a split point");
				chunk = chunk.next;
				chunk.edit("", false);
			}
			first.edit(content, storeName, !overwrite);
		} else {
			const newChunk = new Chunk(start, end, "").edit(content, storeName);
			last.next = newChunk;
			newChunk.previous = last;
		}
		return this;
	}
	prepend(content) {
		if (typeof content !== "string") throw new TypeError("outro content must be a string");
		this.intro = content + this.intro;
		return this;
	}
	prependLeft(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byEnd[index];
		if (chunk) chunk.prependLeft(content);
		else this.intro = content + this.intro;
		return this;
	}
	prependRight(index, content) {
		index = index + this.offset;
		if (typeof content !== "string") throw new TypeError("inserted content must be a string");
		this._split(index);
		const chunk = this.byStart[index];
		if (chunk) chunk.prependRight(content);
		else this.outro = content + this.outro;
		return this;
	}
	remove(start, end) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (start === end) return this;
		if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
		if (start > end) throw new Error("end must be greater than start");
		this._split(start);
		this._split(end);
		let chunk = this.byStart[start];
		while (chunk) {
			chunk.intro = "";
			chunk.outro = "";
			chunk.edit("");
			chunk = end > chunk.end ? this.byStart[chunk.end] : null;
		}
		return this;
	}
	reset(start, end) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		if (start === end) return this;
		if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
		if (start > end) throw new Error("end must be greater than start");
		this._split(start);
		this._split(end);
		let chunk = this.byStart[start];
		while (chunk) {
			chunk.reset();
			chunk = end > chunk.end ? this.byStart[chunk.end] : null;
		}
		return this;
	}
	lastChar() {
		if (this.outro.length) return this.outro[this.outro.length - 1];
		let chunk = this.lastChunk;
		do {
			if (chunk.outro.length) return chunk.outro[chunk.outro.length - 1];
			if (chunk.content.length) return chunk.content[chunk.content.length - 1];
			if (chunk.intro.length) return chunk.intro[chunk.intro.length - 1];
		} while (chunk = chunk.previous);
		if (this.intro.length) return this.intro[this.intro.length - 1];
		return "";
	}
	lastLine() {
		let lineIndex = this.outro.lastIndexOf(n);
		if (lineIndex !== -1) return this.outro.substr(lineIndex + 1);
		let lineStr = this.outro;
		let chunk = this.lastChunk;
		do {
			if (chunk.outro.length > 0) {
				lineIndex = chunk.outro.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.outro.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.outro + lineStr;
			}
			if (chunk.content.length > 0) {
				lineIndex = chunk.content.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.content.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.content + lineStr;
			}
			if (chunk.intro.length > 0) {
				lineIndex = chunk.intro.lastIndexOf(n);
				if (lineIndex !== -1) return chunk.intro.substr(lineIndex + 1) + lineStr;
				lineStr = chunk.intro + lineStr;
			}
		} while (chunk = chunk.previous);
		lineIndex = this.intro.lastIndexOf(n);
		if (lineIndex !== -1) return this.intro.substr(lineIndex + 1) + lineStr;
		return this.intro + lineStr;
	}
	slice(start = 0, end = this.original.length - this.offset) {
		start = start + this.offset;
		end = end + this.offset;
		if (this.original.length !== 0) {
			while (start < 0) start += this.original.length;
			while (end < 0) end += this.original.length;
		}
		let result = "";
		let chunk = this.firstChunk;
		while (chunk && (chunk.start > start || chunk.end <= start)) {
			if (chunk.start < end && chunk.end >= end) return result;
			chunk = chunk.next;
		}
		if (chunk && chunk.edited && chunk.start !== start) throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);
		const startChunk = chunk;
		while (chunk) {
			if (chunk.intro && (startChunk !== chunk || chunk.start === start)) result += chunk.intro;
			const containsEnd = chunk.start < end && chunk.end >= end;
			if (containsEnd && chunk.edited && chunk.end !== end) throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);
			const sliceStart = startChunk === chunk ? start - chunk.start : 0;
			const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
			result += chunk.content.slice(sliceStart, sliceEnd);
			if (chunk.outro && (!containsEnd || chunk.end === end)) result += chunk.outro;
			if (containsEnd) break;
			chunk = chunk.next;
		}
		return result;
	}
	snip(start, end) {
		const clone = this.clone();
		clone.remove(0, start);
		clone.remove(end, clone.original.length);
		return clone;
	}
	_split(index) {
		if (this.byStart[index] || this.byEnd[index]) return;
		let chunk = this.lastSearchedChunk;
		let previousChunk = chunk;
		const searchForward = index > chunk.end;
		while (chunk) {
			if (chunk.contains(index)) return this._splitChunk(chunk, index);
			chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
			if (chunk === previousChunk) return;
			previousChunk = chunk;
		}
	}
	_splitChunk(chunk, index) {
		if (chunk.edited && chunk.content.length) {
			const loc = getLocator(this.original)(index);
			throw new Error(`Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`);
		}
		const newChunk = chunk.split(index);
		this.byEnd[index] = chunk;
		this.byStart[index] = newChunk;
		this.byEnd[newChunk.end] = newChunk;
		if (chunk === this.lastChunk) this.lastChunk = newChunk;
		this.lastSearchedChunk = chunk;
		return true;
	}
	toString() {
		let str = this.intro;
		let chunk = this.firstChunk;
		while (chunk) {
			str += chunk.toString();
			chunk = chunk.next;
		}
		return str + this.outro;
	}
	isEmpty() {
		let chunk = this.firstChunk;
		do
			if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim()) return false;
		while (chunk = chunk.next);
		return true;
	}
	length() {
		let chunk = this.firstChunk;
		let length = 0;
		do
			length += chunk.intro.length + chunk.content.length + chunk.outro.length;
		while (chunk = chunk.next);
		return length;
	}
	trimLines() {
		return this.trim("[\\r\\n]");
	}
	trim(charType) {
		return this.trimStart(charType).trimEnd(charType);
	}
	trimEndAborted(charType) {
		const rx = /* @__PURE__ */ new RegExp((charType || "\\s") + "+$");
		this.outro = this.outro.replace(rx, "");
		if (this.outro.length) return true;
		let chunk = this.lastChunk;
		do {
			const end = chunk.end;
			const aborted = chunk.trimEnd(rx);
			if (chunk.end !== end) {
				if (this.lastChunk === chunk) this.lastChunk = chunk.next;
				this.byEnd[chunk.end] = chunk;
				this.byStart[chunk.next.start] = chunk.next;
				this.byEnd[chunk.next.end] = chunk.next;
			}
			if (aborted) return true;
			chunk = chunk.previous;
		} while (chunk);
		return false;
	}
	trimEnd(charType) {
		this.trimEndAborted(charType);
		return this;
	}
	trimStartAborted(charType) {
		const rx = /* @__PURE__ */ new RegExp("^" + (charType || "\\s") + "+");
		this.intro = this.intro.replace(rx, "");
		if (this.intro.length) return true;
		let chunk = this.firstChunk;
		do {
			const end = chunk.end;
			const aborted = chunk.trimStart(rx);
			if (chunk.end !== end) {
				if (chunk === this.lastChunk) this.lastChunk = chunk.next;
				this.byEnd[chunk.end] = chunk;
				this.byStart[chunk.next.start] = chunk.next;
				this.byEnd[chunk.next.end] = chunk.next;
			}
			if (aborted) return true;
			chunk = chunk.next;
		} while (chunk);
		return false;
	}
	trimStart(charType) {
		this.trimStartAborted(charType);
		return this;
	}
	hasChanged() {
		return this.original !== this.toString();
	}
	_replaceRegexp(searchValue, replacement) {
		function getReplacement(match, str) {
			if (typeof replacement === "string") return replacement.replace(/\$(\$|&|\d+)/g, (_$2, i$2) => {
				if (i$2 === "$") return "$";
				if (i$2 === "&") return match[0];
				if (+i$2 < match.length) return match[+i$2];
				return `$${i$2}`;
			});
			else return replacement(...match, match.index, str, match.groups);
		}
		function matchAll$1(re, str) {
			let match;
			const matches = [];
			while (match = re.exec(str)) matches.push(match);
			return matches;
		}
		if (searchValue.global) matchAll$1(searchValue, this.original).forEach((match) => {
			if (match.index != null) {
				const replacement$1 = getReplacement(match, this.original);
				if (replacement$1 !== match[0]) this.overwrite(match.index, match.index + match[0].length, replacement$1);
			}
		});
		else {
			const match = this.original.match(searchValue);
			if (match && match.index != null) {
				const replacement$1 = getReplacement(match, this.original);
				if (replacement$1 !== match[0]) this.overwrite(match.index, match.index + match[0].length, replacement$1);
			}
		}
		return this;
	}
	_replaceString(string, replacement) {
		const { original } = this;
		const index = original.indexOf(string);
		if (index !== -1) {
			if (typeof replacement === "function") replacement = replacement(string, index, original);
			if (string !== replacement) this.overwrite(index, index + string.length, replacement);
		}
		return this;
	}
	replace(searchValue, replacement) {
		if (typeof searchValue === "string") return this._replaceString(searchValue, replacement);
		return this._replaceRegexp(searchValue, replacement);
	}
	_replaceAllString(string, replacement) {
		const { original } = this;
		const stringLength = string.length;
		for (let index = original.indexOf(string); index !== -1; index = original.indexOf(string, index + stringLength)) {
			const previous = original.slice(index, index + stringLength);
			let _replacement = replacement;
			if (typeof replacement === "function") _replacement = replacement(previous, index, original);
			if (previous !== _replacement) this.overwrite(index, index + stringLength, _replacement);
		}
		return this;
	}
	replaceAll(searchValue, replacement) {
		if (typeof searchValue === "string") return this._replaceAllString(searchValue, replacement);
		if (!searchValue.global) throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");
		return this._replaceRegexp(searchValue, replacement);
	}
};

//#endregion
//#region node_modules/.pnpm/js-tokens@9.0.1/node_modules/js-tokens/index.js
var require_js_tokens = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var HashbangComment, Identifier, JSXIdentifier, JSXPunctuator, JSXString, JSXText, KeywordsWithExpressionAfter, KeywordsWithNoLineTerminatorAfter, LineTerminatorSequence, MultiLineComment, Newline, NumericLiteral, Punctuator, RegularExpressionLiteral = /\/(?![*\/])(?:\[(?:[^\]\\\n\r\u2028\u2029]+|\\.)*\]?|[^\/[\\\n\r\u2028\u2029]+|\\.)*(\/[$_\u200C\u200D\p{ID_Continue}]*|\\)?/uy, SingleLineComment, StringLiteral, Template, TokensNotPrecedingObjectLiteral, TokensPrecedingExpression, WhiteSpace;
	Punctuator = /--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![\/*]))=?|[?~,:;[\](){}]/y;
	Identifier = /(\x23?)(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]+|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/uy;
	StringLiteral = /(['"])(?:[^'"\\\n\r]+|(?!\1)['"]|\\(?:\r\n|[^]))*(\1)?/y;
	NumericLiteral = /(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/y;
	Template = /[`}](?:[^`\\$]+|\\[^]|\$(?!\{))*(`|\$\{)?/y;
	WhiteSpace = /[\t\v\f\ufeff\p{Zs}]+/uy;
	LineTerminatorSequence = /\r?\n|[\r\u2028\u2029]/y;
	MultiLineComment = /\/\*(?:[^*]+|\*(?!\/))*(\*\/)?/y;
	SingleLineComment = /\/\/.*/y;
	HashbangComment = /^#!.*/;
	JSXPunctuator = /[<>.:={}]|\/(?![\/*])/y;
	JSXIdentifier = /[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}-]*/uy;
	JSXString = /(['"])(?:[^'"]+|(?!\1)['"])*(\1)?/y;
	JSXText = /[^<>{}]+/y;
	TokensPrecedingExpression = /^(?:[\/+-]|\.{3}|\?(?:InterpolationIn(?:JSX|Template)|NoLineTerminatorHere|NonExpressionParenEnd|UnaryIncDec))?$|[{}([,;<>=*%&|^!~?:]$/;
	TokensNotPrecedingObjectLiteral = /^(?:=>|[;\]){}]|else|\?(?:NoLineTerminatorHere|NonExpressionParenEnd))?$/;
	KeywordsWithExpressionAfter = /^(?:await|case|default|delete|do|else|instanceof|new|return|throw|typeof|void|yield)$/;
	KeywordsWithNoLineTerminatorAfter = /^(?:return|throw|yield)$/;
	Newline = RegExp(LineTerminatorSequence.source);
	module.exports = function* (input, { jsx = false } = {}) {
		var braces, firstCodePoint, isExpression, lastIndex, lastSignificantToken, length, match, mode, nextLastIndex, nextLastSignificantToken, parenNesting, postfixIncDec, punctuator, stack;
		({length} = input);
		lastIndex = 0;
		lastSignificantToken = "";
		stack = [{ tag: "JS" }];
		braces = [];
		parenNesting = 0;
		postfixIncDec = false;
		if (match = HashbangComment.exec(input)) {
			yield {
				type: "HashbangComment",
				value: match[0]
			};
			lastIndex = match[0].length;
		}
		while (lastIndex < length) {
			mode = stack[stack.length - 1];
			switch (mode.tag) {
				case "JS":
				case "JSNonExpressionParen":
				case "InterpolationInTemplate":
				case "InterpolationInJSX":
					if (input[lastIndex] === "/" && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken))) {
						RegularExpressionLiteral.lastIndex = lastIndex;
						if (match = RegularExpressionLiteral.exec(input)) {
							lastIndex = RegularExpressionLiteral.lastIndex;
							lastSignificantToken = match[0];
							postfixIncDec = true;
							yield {
								type: "RegularExpressionLiteral",
								value: match[0],
								closed: match[1] !== void 0 && match[1] !== "\\"
							};
							continue;
						}
					}
					Punctuator.lastIndex = lastIndex;
					if (match = Punctuator.exec(input)) {
						punctuator = match[0];
						nextLastIndex = Punctuator.lastIndex;
						nextLastSignificantToken = punctuator;
						switch (punctuator) {
							case "(":
								if (lastSignificantToken === "?NonExpressionParenKeyword") stack.push({
									tag: "JSNonExpressionParen",
									nesting: parenNesting
								});
								parenNesting++;
								postfixIncDec = false;
								break;
							case ")":
								parenNesting--;
								postfixIncDec = true;
								if (mode.tag === "JSNonExpressionParen" && parenNesting === mode.nesting) {
									stack.pop();
									nextLastSignificantToken = "?NonExpressionParenEnd";
									postfixIncDec = false;
								}
								break;
							case "{":
								Punctuator.lastIndex = 0;
								isExpression = !TokensNotPrecedingObjectLiteral.test(lastSignificantToken) && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken));
								braces.push(isExpression);
								postfixIncDec = false;
								break;
							case "}":
								switch (mode.tag) {
									case "InterpolationInTemplate":
										if (braces.length === mode.nesting) {
											Template.lastIndex = lastIndex;
											match = Template.exec(input);
											lastIndex = Template.lastIndex;
											lastSignificantToken = match[0];
											if (match[1] === "${") {
												lastSignificantToken = "?InterpolationInTemplate";
												postfixIncDec = false;
												yield {
													type: "TemplateMiddle",
													value: match[0]
												};
											} else {
												stack.pop();
												postfixIncDec = true;
												yield {
													type: "TemplateTail",
													value: match[0],
													closed: match[1] === "`"
												};
											}
											continue;
										}
										break;
									case "InterpolationInJSX": if (braces.length === mode.nesting) {
										stack.pop();
										lastIndex += 1;
										lastSignificantToken = "}";
										yield {
											type: "JSXPunctuator",
											value: "}"
										};
										continue;
									}
								}
								postfixIncDec = braces.pop();
								nextLastSignificantToken = postfixIncDec ? "?ExpressionBraceEnd" : "}";
								break;
							case "]":
								postfixIncDec = true;
								break;
							case "++":
							case "--":
								nextLastSignificantToken = postfixIncDec ? "?PostfixIncDec" : "?UnaryIncDec";
								break;
							case "<":
								if (jsx && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken))) {
									stack.push({ tag: "JSXTag" });
									lastIndex += 1;
									lastSignificantToken = "<";
									yield {
										type: "JSXPunctuator",
										value: punctuator
									};
									continue;
								}
								postfixIncDec = false;
								break;
							default: postfixIncDec = false;
						}
						lastIndex = nextLastIndex;
						lastSignificantToken = nextLastSignificantToken;
						yield {
							type: "Punctuator",
							value: punctuator
						};
						continue;
					}
					Identifier.lastIndex = lastIndex;
					if (match = Identifier.exec(input)) {
						lastIndex = Identifier.lastIndex;
						nextLastSignificantToken = match[0];
						switch (match[0]) {
							case "for":
							case "if":
							case "while":
							case "with": if (lastSignificantToken !== "." && lastSignificantToken !== "?.") nextLastSignificantToken = "?NonExpressionParenKeyword";
						}
						lastSignificantToken = nextLastSignificantToken;
						postfixIncDec = !KeywordsWithExpressionAfter.test(match[0]);
						yield {
							type: match[1] === "#" ? "PrivateIdentifier" : "IdentifierName",
							value: match[0]
						};
						continue;
					}
					StringLiteral.lastIndex = lastIndex;
					if (match = StringLiteral.exec(input)) {
						lastIndex = StringLiteral.lastIndex;
						lastSignificantToken = match[0];
						postfixIncDec = true;
						yield {
							type: "StringLiteral",
							value: match[0],
							closed: match[2] !== void 0
						};
						continue;
					}
					NumericLiteral.lastIndex = lastIndex;
					if (match = NumericLiteral.exec(input)) {
						lastIndex = NumericLiteral.lastIndex;
						lastSignificantToken = match[0];
						postfixIncDec = true;
						yield {
							type: "NumericLiteral",
							value: match[0]
						};
						continue;
					}
					Template.lastIndex = lastIndex;
					if (match = Template.exec(input)) {
						lastIndex = Template.lastIndex;
						lastSignificantToken = match[0];
						if (match[1] === "${") {
							lastSignificantToken = "?InterpolationInTemplate";
							stack.push({
								tag: "InterpolationInTemplate",
								nesting: braces.length
							});
							postfixIncDec = false;
							yield {
								type: "TemplateHead",
								value: match[0]
							};
						} else {
							postfixIncDec = true;
							yield {
								type: "NoSubstitutionTemplate",
								value: match[0],
								closed: match[1] === "`"
							};
						}
						continue;
					}
					break;
				case "JSXTag":
				case "JSXTagEnd":
					JSXPunctuator.lastIndex = lastIndex;
					if (match = JSXPunctuator.exec(input)) {
						lastIndex = JSXPunctuator.lastIndex;
						nextLastSignificantToken = match[0];
						switch (match[0]) {
							case "<":
								stack.push({ tag: "JSXTag" });
								break;
							case ">":
								stack.pop();
								if (lastSignificantToken === "/" || mode.tag === "JSXTagEnd") {
									nextLastSignificantToken = "?JSX";
									postfixIncDec = true;
								} else stack.push({ tag: "JSXChildren" });
								break;
							case "{":
								stack.push({
									tag: "InterpolationInJSX",
									nesting: braces.length
								});
								nextLastSignificantToken = "?InterpolationInJSX";
								postfixIncDec = false;
								break;
							case "/": if (lastSignificantToken === "<") {
								stack.pop();
								if (stack[stack.length - 1].tag === "JSXChildren") stack.pop();
								stack.push({ tag: "JSXTagEnd" });
							}
						}
						lastSignificantToken = nextLastSignificantToken;
						yield {
							type: "JSXPunctuator",
							value: match[0]
						};
						continue;
					}
					JSXIdentifier.lastIndex = lastIndex;
					if (match = JSXIdentifier.exec(input)) {
						lastIndex = JSXIdentifier.lastIndex;
						lastSignificantToken = match[0];
						yield {
							type: "JSXIdentifier",
							value: match[0]
						};
						continue;
					}
					JSXString.lastIndex = lastIndex;
					if (match = JSXString.exec(input)) {
						lastIndex = JSXString.lastIndex;
						lastSignificantToken = match[0];
						yield {
							type: "JSXString",
							value: match[0],
							closed: match[2] !== void 0
						};
						continue;
					}
					break;
				case "JSXChildren":
					JSXText.lastIndex = lastIndex;
					if (match = JSXText.exec(input)) {
						lastIndex = JSXText.lastIndex;
						lastSignificantToken = match[0];
						yield {
							type: "JSXText",
							value: match[0]
						};
						continue;
					}
					switch (input[lastIndex]) {
						case "<":
							stack.push({ tag: "JSXTag" });
							lastIndex++;
							lastSignificantToken = "<";
							yield {
								type: "JSXPunctuator",
								value: "<"
							};
							continue;
						case "{":
							stack.push({
								tag: "InterpolationInJSX",
								nesting: braces.length
							});
							lastIndex++;
							lastSignificantToken = "?InterpolationInJSX";
							postfixIncDec = false;
							yield {
								type: "JSXPunctuator",
								value: "{"
							};
							continue;
					}
			}
			WhiteSpace.lastIndex = lastIndex;
			if (match = WhiteSpace.exec(input)) {
				lastIndex = WhiteSpace.lastIndex;
				yield {
					type: "WhiteSpace",
					value: match[0]
				};
				continue;
			}
			LineTerminatorSequence.lastIndex = lastIndex;
			if (match = LineTerminatorSequence.exec(input)) {
				lastIndex = LineTerminatorSequence.lastIndex;
				postfixIncDec = false;
				if (KeywordsWithNoLineTerminatorAfter.test(lastSignificantToken)) lastSignificantToken = "?NoLineTerminatorHere";
				yield {
					type: "LineTerminatorSequence",
					value: match[0]
				};
				continue;
			}
			MultiLineComment.lastIndex = lastIndex;
			if (match = MultiLineComment.exec(input)) {
				lastIndex = MultiLineComment.lastIndex;
				if (Newline.test(match[0])) {
					postfixIncDec = false;
					if (KeywordsWithNoLineTerminatorAfter.test(lastSignificantToken)) lastSignificantToken = "?NoLineTerminatorHere";
				}
				yield {
					type: "MultiLineComment",
					value: match[0],
					closed: match[1] !== void 0
				};
				continue;
			}
			SingleLineComment.lastIndex = lastIndex;
			if (match = SingleLineComment.exec(input)) {
				lastIndex = SingleLineComment.lastIndex;
				postfixIncDec = false;
				yield {
					type: "SingleLineComment",
					value: match[0]
				};
				continue;
			}
			firstCodePoint = String.fromCodePoint(input.codePointAt(lastIndex));
			lastIndex += firstCodePoint.length;
			lastSignificantToken = firstCodePoint;
			postfixIncDec = false;
			yield {
				type: mode.tag.startsWith("JSX") ? "JSXInvalid" : "Invalid",
				value: firstCodePoint
			};
		}
	};
}));

//#endregion
//#region node_modules/.pnpm/strip-literal@3.1.0/node_modules/strip-literal/dist/index.mjs
var import_js_tokens = /* @__PURE__ */ __toESM$1(require_js_tokens(), 1);
const FILL_COMMENT = " ";
function stripLiteralFromToken(token, fillChar, filter) {
	if (token.type === "SingleLineComment") return FILL_COMMENT.repeat(token.value.length);
	if (token.type === "MultiLineComment") return token.value.replace(/[^\n]/g, FILL_COMMENT);
	if (token.type === "StringLiteral") {
		if (!token.closed) return token.value;
		const body = token.value.slice(1, -1);
		if (filter(body)) return token.value[0] + fillChar.repeat(body.length) + token.value[token.value.length - 1];
	}
	if (token.type === "NoSubstitutionTemplate") {
		const body = token.value.slice(1, -1);
		if (filter(body)) return `\`${body.replace(/[^\n]/g, fillChar)}\``;
	}
	if (token.type === "RegularExpressionLiteral") {
		const body = token.value;
		if (filter(body)) return body.replace(/\/(.*)\/(\w?)$/g, (_$2, $1, $2) => `/${fillChar.repeat($1.length)}/${$2}`);
	}
	if (token.type === "TemplateHead") {
		const body = token.value.slice(1, -2);
		if (filter(body)) return `\`${body.replace(/[^\n]/g, fillChar)}\${`;
	}
	if (token.type === "TemplateTail") {
		const body = token.value.slice(0, -2);
		if (filter(body)) return `}${body.replace(/[^\n]/g, fillChar)}\``;
	}
	if (token.type === "TemplateMiddle") {
		const body = token.value.slice(1, -2);
		if (filter(body)) return `}${body.replace(/[^\n]/g, fillChar)}\${`;
	}
	return token.value;
}
function optionsWithDefaults(options) {
	return {
		fillChar: options?.fillChar ?? " ",
		filter: options?.filter ?? (() => true)
	};
}
function stripLiteral(code, options) {
	let result = "";
	const _options = optionsWithDefaults(options);
	for (const token of (0, import_js_tokens.default)(code, { jsx: false })) result += stripLiteralFromToken(token, _options.fillChar, _options.filter);
	return result;
}

//#endregion
//#region node_modules/.pnpm/unimport@5.6.0/node_modules/unimport/dist/shared/unimport.CWY7iHFZ.mjs
const excludeRE = [
	/\b(import|export)\b([\w$*{},\s]+?)\bfrom\s*["']/g,
	/\bfunction\s*([\w$]+)\s*\(/g,
	/\bclass\s*([\w$]+)\s*\{/g,
	/\b(?:const|let|var)\s+?(\[.*?\]|\{.*?\}|.+?)\s*?[=;\n]/gs
];
const importAsRE = /^.*\sas\s+/;
const separatorRE = /[,[\]{}\n]|\b(?:import|export)\b/g;
const matchRE = /(^|\.\.\.|(?:\bcase|\?)\s+|[^\w$/)]|\bextends\s+)([\w$]+)\s*(?=[.()[\]}:;?+\-*&|`<>,\n]|\b(?:instanceof|in)\b|$|(?<=extends\s+\w+)\s+\{)/g;
const regexRE = /\/\S*?(?<!\\)(?<!\[[^\]]*)\/[gimsuy]*/g;
function stripCommentsAndStrings(code, options) {
	return stripLiteral(code, options).replace(regexRE, "new RegExp(\"\")");
}
function defineUnimportPreset(preset) {
	return preset;
}
const identifierRE = /^[A-Z_$][\w$]*$/i;
const safePropertyName = /^[a-z$_][\w$]*$/i;
function stringifyWith(withValues) {
	let withDefs = "";
	for (let entries = Object.entries(withValues), l$1 = entries.length, i$2 = 0; i$2 < l$1; i$2++) {
		const [prop, value] = entries[i$2];
		withDefs += safePropertyName.test(prop) ? prop : JSON.stringify(prop);
		withDefs += `: ${JSON.stringify(String(value))}`;
		if (i$2 + 1 !== l$1) withDefs += ", ";
	}
	return `{ ${withDefs} }`;
}
function stringifyImports(imports, isCJS = false) {
	const map = toImportModuleMap(imports);
	return Object.entries(map).flatMap(([name, importSet]) => {
		const entries = [];
		const imports2 = Array.from(importSet).filter((i$2) => {
			if (!i$2.name || i$2.as === "") {
				let importStr;
				if (isCJS) importStr = `require('${name}');`;
				else {
					importStr = `import '${name}'`;
					if (i$2.with) importStr += ` with ${stringifyWith(i$2.with)}`;
					importStr += ";";
				}
				entries.push(importStr);
				return false;
			} else if (i$2.name === "default" || i$2.name === "=") {
				let importStr;
				if (isCJS) importStr = i$2.name === "=" ? `const ${i$2.as} = require('${name}');` : `const { default: ${i$2.as} } = require('${name}');`;
				else {
					importStr = `import ${i$2.as} from '${name}'`;
					if (i$2.with) importStr += ` with ${stringifyWith(i$2.with)}`;
					importStr += ";";
				}
				entries.push(importStr);
				return false;
			} else if (i$2.name === "*") {
				let importStr;
				if (isCJS) importStr = `const ${i$2.as} = require('${name}');`;
				else {
					importStr = `import * as ${i$2.as} from '${name}'`;
					if (i$2.with) importStr += ` with ${stringifyWith(i$2.with)}`;
					importStr += ";";
				}
				entries.push(importStr);
				return false;
			} else if (!isCJS && i$2.with) {
				entries.push(`import { ${stringifyImportAlias(i$2)} } from '${name}' with ${stringifyWith(i$2.with)};`);
				return false;
			}
			return true;
		});
		if (imports2.length) {
			const importsAs = imports2.map((i$2) => stringifyImportAlias(i$2, isCJS));
			entries.push(isCJS ? `const { ${importsAs.join(", ")} } = require('${name}');` : `import { ${importsAs.join(", ")} } from '${name}';`);
		}
		return entries;
	}).join("\n");
}
function dedupeImports(imports, warn) {
	const map = /* @__PURE__ */ new Map();
	const indexToRemove = /* @__PURE__ */ new Set();
	imports.filter((i$2) => !i$2.disabled).forEach((i$2, idx) => {
		if (i$2.declarationType === "enum" || i$2.declarationType === "const enum" || i$2.declarationType === "class") return;
		const name = i$2.as ?? i$2.name;
		if (!map.has(name)) {
			map.set(name, idx);
			return;
		}
		const other = imports[map.get(name)];
		if (other.from === i$2.from) {
			indexToRemove.add(idx);
			return;
		}
		const diff = (other.priority || 1) - (i$2.priority || 1);
		if (diff === 0) warn(`Duplicated imports "${name}", the one from "${other.from}" has been ignored and "${i$2.from}" is used`);
		if (diff <= 0) {
			indexToRemove.add(map.get(name));
			map.set(name, idx);
		} else indexToRemove.add(idx);
	});
	return imports.filter((_$2, idx) => !indexToRemove.has(idx));
}
function toExports(imports, fileDir, includeType = false, options = {}) {
	const map = toImportModuleMap(imports, includeType, options);
	return Object.entries(map).flatMap(([name, imports2]) => {
		if (isFilePath(name)) name = name.replace(/\.[a-z]+$/i, "");
		if (fileDir && isAbsolute$2(name)) {
			name = relative$2(fileDir, name);
			if (!name.match(/^[./]/)) name = `./${name}`;
		}
		const entries = [];
		const filtered = Array.from(imports2).filter((i$2) => {
			if (i$2.name === "*") {
				entries.push(`export * as ${i$2.as} from '${name}';`);
				return false;
			}
			return true;
		});
		if (filtered.length) entries.push(`export { ${filtered.map((i$2) => stringifyImportAlias(i$2, false)).join(", ")} } from '${name}';`);
		return entries;
	}).join("\n");
}
function stripFileExtension(path$2) {
	return path$2.replace(/\.[a-z]+$/i, "");
}
function toTypeDeclarationItems(imports, options) {
	return imports.map((i$2) => {
		const from = options?.resolvePath?.(i$2) || stripFileExtension(i$2.typeFrom || i$2.from);
		let typeDef = "";
		if (i$2.with) typeDef += `import('${from}', { with: ${stringifyWith(i$2.with)} })`;
		else typeDef += `import('${from}')`;
		if (i$2.name !== "*" && i$2.name !== "=") typeDef += identifierRE.test(i$2.name) ? `.${i$2.name}` : `['${i$2.name}']`;
		return `const ${i$2.as}: typeof ${typeDef}`;
	}).sort();
}
function toTypeDeclarationFile(imports, options) {
	const items = toTypeDeclarationItems(imports, options);
	const { exportHelper = true } = options || {};
	let declaration = "";
	if (exportHelper) declaration += "export {}\n";
	declaration += `declare global {
${items.map((i$2) => `  ${i$2}`).join("\n")}
}`;
	return declaration;
}
function makeTypeModulesMap(imports, resolvePath) {
	const modulesMap = /* @__PURE__ */ new Map();
	const resolveImportFrom = typeof resolvePath === "function" ? (i$2) => {
		return resolvePath(i$2) || stripFileExtension(i$2.typeFrom || i$2.from);
	} : (i$2) => stripFileExtension(i$2.typeFrom || i$2.from);
	for (const import_ of imports) {
		const from = resolveImportFrom(import_);
		let module = modulesMap.get(from);
		if (!module) {
			module = {
				typeImports: /* @__PURE__ */ new Set(),
				starTypeImport: void 0
			};
			modulesMap.set(from, module);
		}
		if (import_.name === "*") {
			if (import_.as) module.starTypeImport = import_;
		} else module.typeImports.add(import_);
	}
	return modulesMap;
}
function toTypeReExports(imports, options) {
	const importsMap = makeTypeModulesMap(imports, options?.resolvePath);
	return `// for type re-export
declare global {
${Array.from(importsMap).flatMap(([from, module]) => {
		from = from.replace(/\.d\.([cm]?)ts$/i, ".$1js");
		const { starTypeImport, typeImports } = module;
		const strings = [];
		if (typeImports.size) {
			const typeImportNames = Array.from(typeImports).map(({ name, as }) => {
				if (as && as !== name) return `${name} as ${as}`;
				return name;
			});
			strings.push("// @ts-ignore", `export type { ${typeImportNames.join(", ")} } from '${from}'`);
		}
		if (starTypeImport) strings.push("// @ts-ignore", `export type * as ${starTypeImport.as} from '${from}'`);
		if (strings.length) strings.push(`import('${from}')`);
		return strings;
	}).map((i$2) => `  ${i$2}`).join("\n")}
}`;
}
function stringifyImportAlias(item, isCJS = false) {
	return item.as === void 0 || item.name === item.as ? item.name : isCJS ? `${item.name}: ${item.as}` : `${item.name} as ${item.as}`;
}
function toImportModuleMap(imports, includeType = false, options = {}) {
	const map = {};
	for (const _import of imports) {
		if (_import.type && !includeType) continue;
		const from = options.declaration && _import.typeFrom || _import.from;
		if (!map[from]) map[from] = /* @__PURE__ */ new Set();
		map[from].add(_import);
	}
	return map;
}
function getMagicString(code) {
	if (typeof code === "string") return new MagicString(code);
	return code;
}
function addImportToCode(code, imports, isCJS = false, mergeExisting = false, injectAtLast = false, firstOccurrence = Number.POSITIVE_INFINITY, onResolved, onStringified) {
	let newImports = [];
	const s = getMagicString(code);
	let _staticImports;
	const strippedCode = stripCommentsAndStrings(s.original);
	function findStaticImportsLazy() {
		if (!_staticImports) _staticImports = findStaticImports(s.original).filter((i$2) => Boolean(strippedCode.slice(i$2.start, i$2.end).trim())).map((i$2) => parseStaticImport(i$2));
		return _staticImports;
	}
	function hasShebang() {
		return /^#!.+/.test(s.original);
	}
	if (mergeExisting && !isCJS) {
		const existingImports = findStaticImportsLazy();
		const map = /* @__PURE__ */ new Map();
		imports.forEach((i$2) => {
			const target = existingImports.find((e) => e.specifier === i$2.from && e.imports.startsWith("{"));
			if (!target) return newImports.push(i$2);
			if (!map.has(target)) map.set(target, []);
			map.get(target).push(i$2);
		});
		for (const [target, items] of map.entries()) {
			const strings = items.map((i$2) => `${stringifyImportAlias(i$2)}, `);
			const importLength = target.code.match(/^\s*import\s*\{/)?.[0]?.length;
			if (importLength) s.appendLeft(target.start + importLength, ` ${strings.join("").trim()}`);
		}
	} else newImports = imports;
	newImports = onResolved?.(newImports) ?? newImports;
	let newEntries = stringifyImports(newImports, isCJS);
	newEntries = onStringified?.(newEntries, newImports) ?? newEntries;
	if (newEntries) {
		const insertionIndex = injectAtLast ? findStaticImportsLazy().reverse().find((i$2) => i$2.end <= firstOccurrence)?.end ?? 0 : 0;
		if (insertionIndex > 0) s.appendRight(insertionIndex, `
${newEntries}
`);
		else if (hasShebang()) s.appendLeft(s.original.indexOf("\n") + 1, `
${newEntries}
`);
		else s.prepend(`${newEntries}
`);
	}
	return {
		s,
		get code() {
			return s.toString();
		}
	};
}
function normalizeImports(imports) {
	for (const _import of imports) _import.as = _import.as ?? _import.name;
	return imports;
}
function isFilePath(path$2) {
	return path$2.startsWith(".") || isAbsolute$2(path$2) || path$2.includes("://");
}
const contextRE$1 = /\b_ctx\.([$\w]+)\b/g;
const UNREF_KEY = "__unimport_unref_";
const VUE_TEMPLATE_NAME = "unimport:vue-template";
function vueTemplateAddon() {
	const self = {
		name: VUE_TEMPLATE_NAME,
		async transform(s, id) {
			if (!s.original.includes("_ctx.") || s.original.includes(UNREF_KEY)) return s;
			const matches = Array.from(s.original.matchAll(contextRE$1));
			const imports = await this.getImports();
			let targets = [];
			for (const match of matches) {
				const name = match[1];
				const item = imports.find((i$2) => i$2.as === name);
				if (!item) continue;
				const start = match.index;
				const end = start + match[0].length;
				const tempName = `__unimport_${name}`;
				s.overwrite(start, end, `(${JSON.stringify(name)} in _ctx ? _ctx.${name} : ${UNREF_KEY}(${tempName}))`);
				if (!targets.find((i$2) => i$2.as === tempName)) targets.push({
					...item,
					as: tempName
				});
			}
			if (targets.length) {
				targets.push({
					name: "unref",
					from: "vue",
					as: UNREF_KEY
				});
				for (const addon of this.addons) {
					if (addon === self) continue;
					targets = await addon.injectImportsResolved?.call(this, targets, s, id) ?? targets;
				}
				let injection = stringifyImports(targets);
				for (const addon of this.addons) {
					if (addon === self) continue;
					injection = await addon.injectImportsStringified?.call(this, injection, targets, s, id) ?? injection;
				}
				s.prepend(injection);
			}
			return s;
		},
		async declaration(dts, options) {
			return `${dts}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
${(await this.getImports()).map((i$2) => {
				if (i$2.type || i$2.dtsDisabled) return "";
				const from = options?.resolvePath?.(i$2) || i$2.from;
				return `readonly ${i$2.as}: UnwrapRef<typeof import('${from}')${i$2.name !== "*" ? `['${i$2.name}']` : ""}>`;
			}).filter(Boolean).sort().map((i$2) => `    ${i$2}`).join("\n")}
  }
}`;
		}
	};
	return self;
}
const contextRE = /resolveDirective as _resolveDirective/;
const contextText = `${contextRE.source}, `;
const directiveRE = /(?:var|const) (\w+) = _resolveDirective\("([\w.-]+)"\);?\s*/g;
const VUE_DIRECTIVES_NAME = "unimport:vue-directives";
function vueDirectivesAddon(options = {}) {
	function isDirective(importEntry) {
		let isDirective2 = importEntry.meta?.vueDirective === true;
		if (isDirective2) return true;
		isDirective2 = options.isDirective?.(normalizePath$1(process$1.cwd(), importEntry.from), importEntry) ?? false;
		if (isDirective2) {
			importEntry.meta ??= {};
			importEntry.meta.vueDirective = true;
		}
		return isDirective2;
	}
	const self = {
		name: VUE_DIRECTIVES_NAME,
		async transform(s, id) {
			if (!s.original.match(contextRE)) return s;
			const matches = Array.from(s.original.matchAll(directiveRE)).sort((a$1, b$2) => b$2.index - a$1.index);
			if (!matches.length) return s;
			let targets = [];
			for await (const [begin, end, importEntry] of findDirectives(isDirective, matches, this.getImports())) {
				s.overwrite(begin, end, "");
				targets.push(importEntry);
			}
			if (!targets.length) return s;
			if (!s.toString().match(directiveRE)) s.replace(contextText, "");
			for (const addon of this.addons) {
				if (addon === self) continue;
				targets = await addon.injectImportsResolved?.call(this, targets, s, id) ?? targets;
			}
			let injection = stringifyImports(targets);
			for (const addon of this.addons) {
				if (addon === self) continue;
				injection = await addon.injectImportsStringified?.call(this, injection, targets, s, id) ?? injection;
			}
			s.prepend(injection);
			return s;
		},
		async declaration(dts, options2) {
			const directivesMap = await this.getImports().then((imports) => {
				return imports.filter(isDirective).reduce((acc, i$2) => {
					if (i$2.type || i$2.dtsDisabled) return acc;
					let name;
					if (i$2.name === "default" && (i$2.as === "default" || !i$2.as)) {
						const file = basename$1(i$2.from);
						const idx = file.indexOf(".");
						name = idx > -1 ? file.slice(0, idx) : file;
					} else name = i$2.as ?? i$2.name;
					name = name[0] === "v" ? camelCase(name) : camelCase(`v-${name}`);
					if (!acc.has(name)) acc.set(name, i$2);
					return acc;
				}, /* @__PURE__ */ new Map());
			});
			if (!directivesMap.size) return dts;
			return `${dts}
// for vue directives auto import
declare module 'vue' {
  interface GlobalDirectives {
${Array.from(directivesMap.entries()).map(([name, i$2]) => `    ${name}: typeof import('${options2?.resolvePath?.(i$2) || i$2.from}')['${i$2.name}']`).sort().join("\n")}
  }
}`;
		}
	};
	return self;
}
function resolvePath(cwd$2, path$2) {
	return path$2[0] === "." ? resolve$3(cwd$2, path$2) : path$2;
}
function normalizePath$1(cwd$2, path$2) {
	return resolvePath(cwd$2, path$2).replace(/\\/g, "/");
}
async function* findDirectives(isDirective, regexArray, importsPromise) {
	const imports = (await importsPromise).filter(isDirective);
	if (!imports.length) return;
	const symbols = regexArray.reduce((acc, regex) => {
		const [all, symbol, resolveDirectiveName] = regex;
		if (acc.has(symbol)) return acc;
		acc.set(symbol, [
			regex.index,
			regex.index + all.length,
			kebabCase(resolveDirectiveName)
		]);
		return acc;
	}, /* @__PURE__ */ new Map());
	for (const [symbol, data$1] of symbols.entries()) yield* findDirective(imports, symbol, data$1);
}
function* findDirective(imports, symbol, [begin, end, importName]) {
	let resolvedName;
	for (const i$2 of imports) {
		if (i$2.name === "default" && (i$2.as === "default" || !i$2.as)) {
			const file = basename$1(i$2.from);
			const idx = file.indexOf(".");
			resolvedName = kebabCase(idx > -1 ? file.slice(0, idx) : file);
		} else resolvedName = kebabCase(i$2.as ?? i$2.name);
		if (resolvedName === importName) {
			yield [
				begin,
				end,
				{
					...i$2,
					name: i$2.name,
					as: symbol
				}
			];
			return;
		}
		if (resolvedName[0] === "v") resolvedName = resolvedName.slice(resolvedName[1] === "-" ? 2 : 1);
		if (resolvedName === importName) {
			yield [
				begin,
				end,
				{
					...i$2,
					name: i$2.name,
					as: symbol
				}
			];
			return;
		}
	}
}

//#endregion
//#region node_modules/.pnpm/quansync@0.2.11/node_modules/quansync/dist/index.mjs
const GET_IS_ASYNC = Symbol.for("quansync.getIsAsync");
var QuansyncError = class extends Error {
	constructor(message = "Unexpected promise in sync context") {
		super(message);
		this.name = "QuansyncError";
	}
};
function isThenable(value) {
	return value && typeof value === "object" && typeof value.then === "function";
}
function isQuansyncGenerator(value) {
	return value && typeof value === "object" && typeof value[Symbol.iterator] === "function" && "__quansync" in value;
}
function fromObject(options) {
	const generator = function* (...args) {
		if (yield GET_IS_ASYNC) return yield options.async.apply(this, args);
		return options.sync.apply(this, args);
	};
	function fn(...args) {
		const iter = generator.apply(this, args);
		iter.then = (...thenArgs) => options.async.apply(this, args).then(...thenArgs);
		iter.__quansync = true;
		return iter;
	}
	fn.sync = options.sync;
	fn.async = options.async;
	return fn;
}
function fromPromise(promise$1) {
	return fromObject({
		async: () => Promise.resolve(promise$1),
		sync: () => {
			if (isThenable(promise$1)) throw new QuansyncError();
			return promise$1;
		}
	});
}
function unwrapYield(value, isAsync) {
	if (value === GET_IS_ASYNC) return isAsync;
	if (isQuansyncGenerator(value)) return isAsync ? iterateAsync(value) : iterateSync(value);
	if (!isAsync && isThenable(value)) throw new QuansyncError();
	return value;
}
const DEFAULT_ON_YIELD = (value) => value;
function iterateSync(generator, onYield = DEFAULT_ON_YIELD) {
	let current = generator.next();
	while (!current.done) try {
		current = generator.next(unwrapYield(onYield(current.value, false)));
	} catch (err) {
		current = generator.throw(err);
	}
	return unwrapYield(current.value);
}
async function iterateAsync(generator, onYield = DEFAULT_ON_YIELD) {
	let current = generator.next();
	while (!current.done) try {
		current = generator.next(await unwrapYield(onYield(current.value, true), true));
	} catch (err) {
		current = generator.throw(err);
	}
	return current.value;
}
function fromGeneratorFn(generatorFn, options) {
	return fromObject({
		name: generatorFn.name,
		async(...args) {
			return iterateAsync(generatorFn.apply(this, args), options?.onYield);
		},
		sync(...args) {
			return iterateSync(generatorFn.apply(this, args), options?.onYield);
		}
	});
}
function quansync$1(input, options) {
	if (isThenable(input)) return fromPromise(input);
	if (typeof input === "function") return fromGeneratorFn(input, options);
	else return fromObject(input);
}
const getIsAsync = quansync$1({
	async: () => Promise.resolve(true),
	sync: () => false
});

//#endregion
//#region node_modules/.pnpm/quansync@0.2.11/node_modules/quansync/dist/macro.mjs
const quansync = quansync$1;

//#endregion
//#region node_modules/.pnpm/local-pkg@1.1.2/node_modules/local-pkg/dist/index.mjs
const toPath = (urlOrPath) => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
async function findUp$1(name, { cwd: cwd$2 = process$1.cwd(), type: type$1 = "file", stopAt } = {}) {
	let directory = path$1.resolve(toPath(cwd$2) ?? "");
	const { root } = path$1.parse(directory);
	stopAt = path$1.resolve(directory, toPath(stopAt ?? root));
	const isAbsoluteName = path$1.isAbsolute(name);
	while (directory) {
		const filePath = isAbsoluteName ? name : path$1.join(directory, name);
		try {
			const stats = await fsp.stat(filePath);
			if (type$1 === "file" && stats.isFile() || type$1 === "directory" && stats.isDirectory()) return filePath;
		} catch {}
		if (directory === stopAt || directory === root) break;
		directory = path$1.dirname(directory);
	}
}
function findUpSync(name, { cwd: cwd$2 = process$1.cwd(), type: type$1 = "file", stopAt } = {}) {
	let directory = path$1.resolve(toPath(cwd$2) ?? "");
	const { root } = path$1.parse(directory);
	stopAt = path$1.resolve(directory, toPath(stopAt) ?? root);
	const isAbsoluteName = path$1.isAbsolute(name);
	while (directory) {
		const filePath = isAbsoluteName ? name : path$1.join(directory, name);
		try {
			const stats = fs.statSync(filePath, { throwIfNoEntry: false });
			if (type$1 === "file" && stats?.isFile() || type$1 === "directory" && stats?.isDirectory()) return filePath;
		} catch {}
		if (directory === stopAt || directory === root) break;
		directory = path$1.dirname(directory);
	}
}
function _resolve(path$2, options = {}) {
	if (options.platform === "auto" || !options.platform) options.platform = process$1.platform === "win32" ? "win32" : "posix";
	if (process$1.versions.pnp) {
		const paths = options.paths || [];
		if (paths.length === 0) paths.push(process$1.cwd());
		const targetRequire = createRequire(import.meta.url);
		try {
			return targetRequire.resolve(path$2, { paths });
		} catch {}
	}
	const modulePath = resolvePathSync(path$2, { url: options.paths });
	if (options.platform === "win32") return win32$1.normalize(modulePath);
	return modulePath;
}
function resolveModule(name, options = {}) {
	try {
		return _resolve(name, options);
	} catch {
		return;
	}
}
function getPackageJsonPath(name, options = {}) {
	const entry = resolvePackage(name, options);
	if (!entry) return;
	return searchPackageJSON(entry);
}
const readFile$1 = quansync({
	async: (id) => fs.promises.readFile(id, "utf8"),
	sync: (id) => fs.readFileSync(id, "utf8")
});
const getPackageInfo = quansync(function* (name, options = {}) {
	const packageJsonPath = getPackageJsonPath(name, options);
	if (!packageJsonPath) return;
	const packageJson = JSON.parse(yield readFile$1(packageJsonPath));
	return {
		name,
		version: packageJson.version,
		rootPath: dirname$1(packageJsonPath),
		packageJsonPath,
		packageJson
	};
});
const getPackageInfoSync = getPackageInfo.sync;
function resolvePackage(name, options = {}) {
	try {
		return _resolve(`${name}/package.json`, options);
	} catch {}
	try {
		return _resolve(name, options);
	} catch (e) {
		if (e.code !== "MODULE_NOT_FOUND" && e.code !== "ERR_MODULE_NOT_FOUND") console.error(e);
		return false;
	}
}
function searchPackageJSON(dir) {
	let packageJsonPath;
	while (true) {
		if (!dir) return;
		const newDir = dirname$1(dir);
		if (newDir === dir) return;
		dir = newDir;
		packageJsonPath = join$1(dir, "package.json");
		if (fs.existsSync(packageJsonPath)) break;
	}
	return packageJsonPath;
}
const findUp = quansync({
	sync: findUpSync,
	async: findUp$1
});
const loadPackageJSON = quansync(function* (cwd$2 = process$1.cwd()) {
	const path$2 = yield findUp("package.json", { cwd: cwd$2 });
	if (!path$2 || !fs.existsSync(path$2)) return null;
	return JSON.parse(yield readFile$1(path$2));
});
const loadPackageJSONSync = loadPackageJSON.sync;
const isPackageListed = quansync(function* (name, cwd$2) {
	const pkg = (yield loadPackageJSON(cwd$2)) || {};
	return name in (pkg.dependencies || {}) || name in (pkg.devDependencies || {});
});
const isPackageListedSync = isPackageListed.sync;

//#endregion
//#region node_modules/.pnpm/unimport@5.6.0/node_modules/unimport/dist/shared/unimport.u_OYhQoS.mjs
const version$1 = "5.6.0";
function configureAddons(opts) {
	const addons = [];
	if (Array.isArray(opts.addons)) addons.push(...opts.addons);
	else {
		const addonsMap = /* @__PURE__ */ new Map();
		if (opts.addons?.addons?.length) {
			let i$2 = 0;
			for (const addon of opts.addons.addons) addonsMap.set(addon.name || `external:custom-${i$2++}`, addon);
		}
		if (opts.addons?.vueTemplate) {
			if (!addonsMap.has(VUE_TEMPLATE_NAME)) addonsMap.set(VUE_TEMPLATE_NAME, vueTemplateAddon());
		}
		if (opts.addons?.vueDirectives) {
			if (!addonsMap.has(VUE_DIRECTIVES_NAME)) addonsMap.set(VUE_DIRECTIVES_NAME, vueDirectivesAddon(typeof opts.addons.vueDirectives === "object" ? opts.addons.vueDirectives : void 0));
		}
		addons.push(...addonsMap.values());
	}
	return addons;
}
async function detectImportsRegex(code, ctx, options) {
	const s = getMagicString(code);
	const original = s.original;
	const strippedCode = stripCommentsAndStrings(original, options?.transformVirtualImports !== false && ctx.options.virtualImports?.length ? {
		filter: (i$2) => !ctx.options.virtualImports.includes(i$2),
		fillChar: "-"
	} : void 0);
	const syntax = detectSyntax(strippedCode);
	const isCJSContext = syntax.hasCJS && !syntax.hasESM;
	let matchedImports = [];
	const occurrenceMap = /* @__PURE__ */ new Map();
	const map = await ctx.getImportMap();
	if (options?.autoImport !== false) {
		Array.from(strippedCode.matchAll(matchRE)).forEach((i$2) => {
			if (i$2[1] === ".") return null;
			const end = strippedCode[i$2.index + i$2[0].length];
			const before = strippedCode[i$2.index - 1];
			if (end === ":" && !["?", "case"].includes(i$2[1].trim()) && before !== ":") return null;
			const name = i$2[2];
			const occurrence = i$2.index + i$2[1].length;
			if (occurrenceMap.get(name) || Number.POSITIVE_INFINITY > occurrence) occurrenceMap.set(name, occurrence);
		});
		for (const regex of excludeRE) for (const match of strippedCode.matchAll(regex)) {
			const segments = [...match[1]?.split(separatorRE) || [], ...match[2]?.split(separatorRE) || []];
			for (const segment of segments) {
				const identifier = segment.replace(importAsRE, "").trim();
				occurrenceMap.delete(identifier);
			}
		}
		const identifiers = new Set(occurrenceMap.keys());
		matchedImports = Array.from(identifiers).map((name) => {
			const item = map.get(name);
			if (item && !item.disabled) return item;
			occurrenceMap.delete(name);
			return null;
		}).filter(Boolean);
		for (const addon of ctx.addons) matchedImports = await addon.matchImports?.call(ctx, identifiers, matchedImports) || matchedImports;
	}
	if (options?.transformVirtualImports !== false && ctx.options.virtualImports?.length) {
		const virtualImports = parseVirtualImportsRegex(strippedCode, map, ctx.options.virtualImports);
		virtualImports.ranges.forEach(([start, end]) => {
			s.remove(start, end);
		});
		matchedImports.push(...virtualImports.imports);
	}
	const firstOccurrence = Math.min(...Array.from(occurrenceMap.entries()).map((i$2) => i$2[1]));
	return {
		s,
		strippedCode,
		isCJSContext,
		matchedImports,
		firstOccurrence
	};
}
function parseVirtualImportsRegex(strippedCode, importMap, virtualImports) {
	const imports = [];
	const ranges = [];
	if (virtualImports?.length) findStaticImports(strippedCode).filter((i$2) => virtualImports.includes(i$2.specifier)).map((i$2) => parseStaticImport(i$2)).forEach((i$2) => {
		ranges.push([i$2.start, i$2.end]);
		Object.entries(i$2.namedImports || {}).forEach(([name, as]) => {
			const original = importMap.get(name);
			if (!original) throw new Error(`[unimport] failed to find "${name}" imported from "${i$2.specifier}"`);
			imports.push({
				from: original.from,
				name: original.name,
				as
			});
		});
	});
	return {
		imports,
		ranges
	};
}
async function detectImports(code, ctx, options) {
	if (options?.parser === "acorn") return import("../_libs/unimport+unplugin.mjs").then((n) => n.n).then((r$3) => r$3.detectImportsAcorn(code, ctx, options));
	return detectImportsRegex(code, ctx, options);
}
const FileExtensionLookup = [
	"mts",
	"cts",
	"ts",
	"tsx",
	"mjs",
	"cjs",
	"js",
	"jsx"
];
const FileLookupPatterns = `*.{${FileExtensionLookup.join(",")}}`;
function resolveGlobsExclude(glob2, cwd$2) {
	return `${glob2.startsWith("!") ? "!" : ""}${resolve$3(cwd$2, glob2.replace(/^!/, ""))}`;
}
function joinGlobFilePattern(glob2, filePattern) {
	return join$2(basename$2(glob2) === "*" ? dirname$2(glob2) : glob2, filePattern);
}
function normalizeScanDirs(dirs, options) {
	const topLevelTypes = options?.types ?? true;
	const cwd$2 = options?.cwd ?? process$1.cwd();
	const filePatterns = options?.filePatterns || [FileLookupPatterns];
	return dirs.map((dir) => {
		const isString = typeof dir === "string";
		const glob2 = resolveGlobsExclude(isString ? dir : dir.glob, cwd$2);
		const types$4 = isString ? topLevelTypes : dir.types ?? topLevelTypes;
		if (glob2.match(/\.\w+$/)) return {
			glob: glob2,
			types: types$4
		};
		const withFilePatterns = filePatterns.map((filePattern) => ({
			glob: joinGlobFilePattern(glob2, filePattern),
			types: types$4
		}));
		return [{
			glob: glob2,
			types: types$4
		}, ...withFilePatterns];
	}).flat();
}
async function scanFilesFromDir(dir, options) {
	const dirGlobs = (Array.isArray(dir) ? dir : [dir]).map((i$2) => i$2.glob);
	const files = (await glob(dirGlobs, {
		absolute: true,
		cwd: options?.cwd || process$1.cwd(),
		onlyFiles: true,
		followSymbolicLinks: true,
		expandDirectories: false
	})).map((i$2) => normalize$2(i$2));
	const fileFilter = options?.fileFilter || (() => true);
	const indexOfDirs = (file) => dirGlobs.findIndex((glob2) => import_picomatch.default.isMatch(file, glob2));
	return files.reduce((acc, file) => {
		const index = indexOfDirs(file);
		if (acc[index]) acc[index].push(normalize$2(file));
		else acc[index] = [normalize$2(file)];
		return acc;
	}, []).map((files2) => files2.sort()).flat().filter(fileFilter);
}
async function scanDirExports(dirs, options) {
	const normalizedDirs = normalizeScanDirs(dirs, options);
	const files = await scanFilesFromDir(normalizedDirs, options);
	const includeTypesDirs = normalizedDirs.filter((dir) => !dir.glob.startsWith("!") && dir.types);
	const isIncludeTypes = (file) => includeTypesDirs.some((dir) => import_picomatch.default.isMatch(file, dir.glob));
	return dedupeDtsExports((await Promise.all(files.map((file) => scanExports(file, isIncludeTypes(file))))).flat());
}
function dedupeDtsExports(exports) {
	return exports.filter((i$2) => {
		if (!i$2.type) return true;
		if (i$2.declarationType === "enum" || i$2.declarationType === "const enum" || i$2.declarationType === "class") return true;
		return !exports.find((e) => e.as === i$2.as && e.name === i$2.name && !e.type);
	});
}
async function scanExports(filepath, includeTypes, seen = /* @__PURE__ */ new Set()) {
	if (seen.has(filepath)) {
		console.warn(`[unimport] "${filepath}" is already scanned, skipping`);
		return [];
	}
	seen.add(filepath);
	const imports = [];
	const code = await readFile(filepath, "utf-8");
	const exports = findExports(code);
	if (exports.find((i$2) => i$2.type === "default")) {
		let name = parse$1(filepath).name;
		if (name === "index") name = parse$1(filepath.split("/").slice(0, -1).join("/")).name;
		const as = /[-_.]/.test(name) ? camelCase(name) : name;
		imports.push({
			name: "default",
			as,
			from: filepath
		});
	}
	async function toImport$1(exports2, additional) {
		for (const exp of exports2) if (exp.type === "named") for (const name of exp.names) imports.push({
			name,
			as: name,
			from: filepath,
			...additional
		});
		else if (exp.type === "declaration") {
			if (exp.name) {
				imports.push({
					name: exp.name,
					as: exp.name,
					from: filepath,
					...additional
				});
				if (exp.declarationType === "enum" || exp.declarationType === "const enum" || exp.declarationType === "class") imports.push({
					name: exp.name,
					as: exp.name,
					from: filepath,
					type: true,
					declarationType: exp.declarationType,
					...additional
				});
			}
		} else if (exp.type === "star" && exp.specifier) if (exp.name) imports.push({
			name: exp.name,
			as: exp.name,
			from: filepath,
			...additional
		});
		else {
			const subfile = exp.specifier;
			let subfilepath = resolve$3(dirname$2(filepath), subfile);
			let subfilepathResolved = false;
			for (const ext of FileExtensionLookup) if (existsSync(`${subfilepath}.${ext}`)) {
				subfilepath = `${subfilepath}.${ext}`;
				break;
			} else if (existsSync(`${subfilepath}/index.${ext}`)) {
				subfilepath = `${subfilepath}/index.${ext}`;
				break;
			}
			if (existsSync(subfilepath)) subfilepathResolved = true;
			else try {
				subfilepath = await resolve$2(exp.specifier);
				subfilepath = normalize$2(fileURLToPath(subfilepath));
				if (existsSync(subfilepath)) subfilepathResolved = true;
			} catch {}
			if (!subfilepathResolved) {
				console.warn(`[unimport] failed to resolve "${subfilepath}", skip scanning`);
				continue;
			}
			const nested = await scanExports(subfilepath, includeTypes, seen);
			imports.push(...additional ? nested.map((i$2) => ({
				...i$2,
				...additional
			})) : nested);
		}
	}
	if (filepath.match(/\.d\.[mc]?ts$/)) {
		if (includeTypes) {
			await toImport$1(exports, { type: true });
			await toImport$1(findTypeExports(code), { type: true });
		}
	} else {
		await toImport$1(exports);
		if (includeTypes) await toImport$1(findTypeExports(code), { type: true });
	}
	return imports;
}
const CACHE_PATH = /* @__PURE__ */ join$2(os.tmpdir(), "unimport");
let CACHE_WRITEABLE;
async function resolvePackagePreset(preset) {
	return (await extractExports(preset.package, preset.url, preset.cache)).filter((name) => {
		for (const item of preset.ignore || []) {
			if (typeof item === "string" && item === name) return false;
			if (item instanceof RegExp && item.test(name)) return false;
			if (typeof item === "function" && item(name) === false) return false;
		}
		return true;
	}).map((name) => ({
		from: preset.package,
		name
	}));
}
async function extractExports(name, url, cache$2 = true) {
	const version$3 = (await readPackageJSON$1(await resolvePackageJSON$1(name, { url }))).version;
	const cachePath = join$2(CACHE_PATH, `${name}@${version$3}`, "exports.json");
	if (cache$2 && CACHE_WRITEABLE === void 0) try {
		CACHE_WRITEABLE = isWritable(CACHE_PATH);
	} catch {
		CACHE_WRITEABLE = false;
	}
	const useCache = cache$2 && version$3 && CACHE_WRITEABLE;
	if (useCache && existsSync(cachePath)) return JSON.parse(await promises.readFile(cachePath, "utf-8"));
	const scanned = await resolveModuleExportNames(name, { url });
	if (useCache) {
		await promises.mkdir(dirname$2(cachePath), { recursive: true });
		await promises.writeFile(cachePath, JSON.stringify(scanned), "utf-8");
	}
	return scanned;
}
function isWritable(filename) {
	try {
		accessSync(filename, constants.W_OK);
		return true;
	} catch {
		return false;
	}
}
const dateFns = defineUnimportPreset({
	from: "date-fns",
	imports: [
		"add",
		"addBusinessDays",
		"addDays",
		"addHours",
		"addISOWeekYears",
		"addMilliseconds",
		"addMinutes",
		"addMonths",
		"addQuarters",
		"addSeconds",
		"addWeeks",
		"addYears",
		"areIntervalsOverlapping",
		"clamp",
		"closestIndexTo",
		"closestTo",
		"compareAsc",
		"compareDesc",
		"constants",
		"daysToWeeks",
		"differenceInBusinessDays",
		"differenceInCalendarDays",
		"differenceInCalendarISOWeekYears",
		"differenceInCalendarISOWeeks",
		"differenceInCalendarMonths",
		"differenceInCalendarQuarters",
		"differenceInCalendarWeeks",
		"differenceInCalendarYears",
		"differenceInDays",
		"differenceInHours",
		"differenceInISOWeekYears",
		"differenceInMilliseconds",
		"differenceInMinutes",
		"differenceInMonths",
		"differenceInQuarters",
		"differenceInSeconds",
		"differenceInWeeks",
		"differenceInYears",
		"eachDayOfInterval",
		"eachHourOfInterval",
		"eachMinuteOfInterval",
		"eachMonthOfInterval",
		"eachQuarterOfInterval",
		"eachWeekOfInterval",
		"eachWeekendOfInterval",
		"eachWeekendOfMonth",
		"eachWeekendOfYear",
		"eachYearOfInterval",
		"endOfDay",
		"endOfDecade",
		"endOfHour",
		"endOfISOWeek",
		"endOfISOWeekYear",
		"endOfMinute",
		"endOfMonth",
		"endOfQuarter",
		"endOfSecond",
		"endOfToday",
		"endOfTomorrow",
		"endOfWeek",
		"endOfYear",
		"endOfYesterday",
		"format",
		"formatDistance",
		"formatDistanceStrict",
		"formatDistanceToNow",
		"formatDistanceToNowStrict",
		"formatDuration",
		"formatISO",
		"formatISO9075",
		"formatISODuration",
		"formatRFC3339",
		"formatRFC7231",
		"formatRelative",
		"fromUnixTime",
		"getDate",
		"getDay",
		"getDayOfYear",
		"getDaysInMonth",
		"getDaysInYear",
		"getDecade",
		"getDefaultOptions",
		"getHours",
		"getISODay",
		"getISOWeek",
		"getISOWeekYear",
		"getISOWeeksInYear",
		"getMilliseconds",
		"getMinutes",
		"getMonth",
		"getOverlappingDaysInIntervals",
		"getQuarter",
		"getSeconds",
		"getTime",
		"getUnixTime",
		"getWeek",
		"getWeekOfMonth",
		"getWeekYear",
		"getWeeksInMonth",
		"getYear",
		"hoursToMilliseconds",
		"hoursToMinutes",
		"hoursToSeconds",
		"intervalToDuration",
		"intlFormat",
		"intlFormatDistance",
		"isAfter",
		"isBefore",
		"isDate",
		"isEqual",
		"isExists",
		"isFirstDayOfMonth",
		"isFriday",
		"isFuture",
		"isLastDayOfMonth",
		"isLeapYear",
		"isMatch",
		"isMonday",
		"isPast",
		"isSameDay",
		"isSameHour",
		"isSameISOWeek",
		"isSameISOWeekYear",
		"isSameMinute",
		"isSameMonth",
		"isSameQuarter",
		"isSameSecond",
		"isSameWeek",
		"isSameYear",
		"isSaturday",
		"isSunday",
		"isThisHour",
		"isThisISOWeek",
		"isThisMinute",
		"isThisMonth",
		"isThisQuarter",
		"isThisSecond",
		"isThisWeek",
		"isThisYear",
		"isThursday",
		"isToday",
		"isTomorrow",
		"isTuesday",
		"isValid",
		"isWednesday",
		"isWeekend",
		"isWithinInterval",
		"isYesterday",
		"lastDayOfDecade",
		"lastDayOfISOWeek",
		"lastDayOfISOWeekYear",
		"lastDayOfMonth",
		"lastDayOfQuarter",
		"lastDayOfWeek",
		"lastDayOfYear",
		"lightFormat",
		"max",
		"milliseconds",
		"millisecondsToHours",
		"millisecondsToMinutes",
		"millisecondsToSeconds",
		"min",
		"minutesToHours",
		"minutesToMilliseconds",
		"minutesToSeconds",
		"monthsToQuarters",
		"monthsToYears",
		"nextDay",
		"nextFriday",
		"nextMonday",
		"nextSaturday",
		"nextSunday",
		"nextThursday",
		"nextTuesday",
		"nextWednesday",
		"parse",
		"parseISO",
		"parseJSON",
		"previousDay",
		"previousFriday",
		"previousMonday",
		"previousSaturday",
		"previousSunday",
		"previousThursday",
		"previousTuesday",
		"previousWednesday",
		"quartersToMonths",
		"quartersToYears",
		"roundToNearestMinutes",
		"secondsToHours",
		"secondsToMilliseconds",
		"secondsToMinutes",
		"set",
		"setDate",
		"setDay",
		"setDayOfYear",
		"setDefaultOptions",
		"setHours",
		"setISODay",
		"setISOWeek",
		"setISOWeekYear",
		"setMilliseconds",
		"setMinutes",
		"setMonth",
		"setQuarter",
		"setSeconds",
		"setWeek",
		"setWeekYear",
		"setYear",
		"startOfDay",
		"startOfDecade",
		"startOfHour",
		"startOfISOWeek",
		"startOfISOWeekYear",
		"startOfMinute",
		"startOfMonth",
		"startOfQuarter",
		"startOfSecond",
		"startOfToday",
		"startOfTomorrow",
		"startOfWeek",
		"startOfWeekYear",
		"startOfYear",
		"startOfYesterday",
		"sub",
		"subBusinessDays",
		"subDays",
		"subHours",
		"subISOWeekYears",
		"subMilliseconds",
		"subMinutes",
		"subMonths",
		"subQuarters",
		"subSeconds",
		"subWeeks",
		"subYears",
		"toDate",
		"weeksToDays",
		"yearsToMonths",
		"yearsToQuarters"
	]
});
const pinia = defineUnimportPreset({
	from: "pinia",
	imports: [
		"acceptHMRUpdate",
		"createPinia",
		"defineStore",
		"getActivePinia",
		"mapActions",
		"mapGetters",
		"mapState",
		"mapStores",
		"mapWritableState",
		"setActivePinia",
		"setMapStoreSuffix",
		"storeToRefs"
	]
});
const preact = defineUnimportPreset({
	from: "preact",
	imports: [
		"useState",
		"useCallback",
		"useMemo",
		"useEffect",
		"useRef",
		"useContext",
		"useReducer"
	]
});
const quasar = defineUnimportPreset({
	from: "quasar",
	imports: [
		"useQuasar",
		"useDialogPluginComponent",
		"useFormChild",
		"useMeta"
	]
});
const react = defineUnimportPreset({
	from: "react",
	imports: [
		"useState",
		"useCallback",
		"useMemo",
		"useEffect",
		"useRef",
		"useContext",
		"useReducer"
	]
});
const ReactRouterHooks = [
	"useOutletContext",
	"useHref",
	"useInRouterContext",
	"useLocation",
	"useNavigationType",
	"useNavigate",
	"useOutlet",
	"useParams",
	"useResolvedPath",
	"useRoutes"
];
const reactRouter = defineUnimportPreset({
	from: "react-router",
	imports: [...ReactRouterHooks]
});
const reactRouterDom = defineUnimportPreset({
	from: "react-router-dom",
	imports: [
		...ReactRouterHooks,
		"useLinkClickHandler",
		"useSearchParams",
		"Link",
		"NavLink",
		"Navigate",
		"Outlet",
		"Route",
		"Routes"
	]
});
const rxjs = defineUnimportPreset({
	from: "rxjs",
	imports: [
		"of",
		"from",
		"map",
		"tap",
		"filter",
		"forkJoin",
		"throwError",
		"catchError",
		"Observable",
		"mergeMap",
		"switchMap",
		"merge",
		"zip",
		"take",
		"takeUntil",
		"first",
		"lastValueFrom",
		"skip",
		"skipUntil",
		"distinct",
		"distinctUntilChanged",
		"throttle",
		"throttleTime",
		"retry",
		"retryWhen",
		"timeout",
		"delay",
		"debounce",
		"debounceTime",
		"find",
		"every"
	]
});
const solid = defineUnimportPreset({
	from: "solid-js",
	imports: [
		defineUnimportPreset({
			from: "solid-js",
			imports: [
				"createSignal",
				"createEffect",
				"createMemo",
				"createResource",
				"onMount",
				"onCleanup",
				"onError",
				"untrack",
				"batch",
				"on",
				"createRoot",
				"mergeProps",
				"splitProps",
				"useTransition",
				"observable",
				"mapArray",
				"indexArray",
				"createContext",
				"useContext",
				"children",
				"lazy",
				"createDeferred",
				"createRenderEffect",
				"createSelector",
				"For",
				"Show",
				"Switch",
				"Match",
				"Index",
				"ErrorBoundary",
				"Suspense",
				"SuspenseList"
			]
		}),
		defineUnimportPreset({
			from: "solid-js/store",
			imports: [
				"createStore",
				"produce",
				"reconcile",
				"createMutable"
			]
		}),
		defineUnimportPreset({
			from: "solid-js/web",
			imports: [
				"Dynamic",
				"hydrate",
				"render",
				"renderToString",
				"renderToStringAsync",
				"renderToStream",
				"isServer",
				"Portal"
			]
		})
	]
});
const solidAppRouter = defineUnimportPreset({
	from: "solid-app-router",
	imports: [
		"Link",
		"NavLink",
		"Navigate",
		"Outlet",
		"Route",
		"Router",
		"Routes",
		"_mergeSearchString",
		"createIntegration",
		"hashIntegration",
		"normalizeIntegration",
		"pathIntegration",
		"staticIntegration",
		"useHref",
		"useIsRouting",
		"useLocation",
		"useMatch",
		"useNavigate",
		"useParams",
		"useResolvedPath",
		"useRouteData",
		"useRoutes",
		"useSearchParams"
	]
});
const svelteAnimate = defineUnimportPreset({
	from: "svelte/animate",
	imports: ["flip"]
});
const svelteEasing = defineUnimportPreset({
	from: "svelte/easing",
	imports: [
		"back",
		"bounce",
		"circ",
		"cubic",
		"elastic",
		"expo",
		"quad",
		"quart",
		"quint",
		"sine"
	].reduce((acc, e) => {
		acc.push(`${e}In`, `${e}Out`, `${e}InOut`);
		return acc;
	}, ["linear"])
});
const svelteStore = defineUnimportPreset({
	from: "svelte/store",
	imports: [
		"writable",
		"readable",
		"derived",
		"get"
	]
});
const svelteMotion = defineUnimportPreset({
	from: "svelte/motion",
	imports: ["tweened", "spring"]
});
const svelteTransition = defineUnimportPreset({
	from: "svelte/transition",
	imports: [
		"fade",
		"blur",
		"fly",
		"slide",
		"scale",
		"draw",
		"crossfade"
	]
});
const svelte = defineUnimportPreset({
	from: "svelte",
	imports: [
		"onMount",
		"beforeUpdate",
		"afterUpdate",
		"onDestroy",
		"tick",
		"setContext",
		"getContext",
		"hasContext",
		"getAllContexts",
		"createEventDispatcher"
	]
});
const uniApp = defineUnimportPreset({
	from: "@dcloudio/uni-app",
	imports: [
		"onAddToFavorites",
		"onBackPress",
		"onError",
		"onHide",
		"onLaunch",
		"onLoad",
		"onNavigationBarButtonTap",
		"onNavigationBarSearchInputChanged",
		"onNavigationBarSearchInputClicked",
		"onNavigationBarSearchInputConfirmed",
		"onNavigationBarSearchInputFocusChanged",
		"onPageNotFound",
		"onPageScroll",
		"onPullDownRefresh",
		"onReachBottom",
		"onReady",
		"onResize",
		"onShareAppMessage",
		"onShareTimeline",
		"onShow",
		"onTabItemTap",
		"onThemeChange",
		"onUnhandledRejection",
		"onUnload"
	]
});
const veeValidate = defineUnimportPreset({
	from: "vee-validate",
	imports: [
		"validate",
		"defineRule",
		"configure",
		"useField",
		"useForm",
		"useFieldArray",
		"useResetForm",
		"useIsFieldDirty",
		"useIsFieldTouched",
		"useIsFieldValid",
		"useIsSubmitting",
		"useValidateField",
		"useIsFormDirty",
		"useIsFormTouched",
		"useIsFormValid",
		"useValidateForm",
		"useSubmitCount",
		"useFieldValue",
		"useFormValues",
		"useFormErrors",
		"useFieldError",
		"useSubmitForm",
		"FormContextKey",
		"FieldContextKey"
	]
});
const vitepress = defineUnimportPreset({
	from: "vitepress",
	imports: [
		"useData",
		"useRoute",
		"useRouter",
		"withBase"
	]
});
const vitest = defineUnimportPreset({
	from: "vitest",
	imports: [
		"suite",
		"test",
		"describe",
		"it",
		"chai",
		"expect",
		"assert",
		"vitest",
		"vi",
		"beforeAll",
		"afterAll",
		"beforeEach",
		"afterEach"
	]
});
const CommonCompositionAPI = [
	"onActivated",
	"onBeforeMount",
	"onBeforeUnmount",
	"onBeforeUpdate",
	"onErrorCaptured",
	"onDeactivated",
	"onMounted",
	"onServerPrefetch",
	"onUnmounted",
	"onUpdated",
	"useAttrs",
	"useSlots",
	"computed",
	"customRef",
	"isReadonly",
	"isRef",
	"isShallow",
	"isProxy",
	"isReactive",
	"markRaw",
	"reactive",
	"readonly",
	"ref",
	"shallowReactive",
	"shallowReadonly",
	"shallowRef",
	"triggerRef",
	"toRaw",
	"toRef",
	"toRefs",
	"toValue",
	"unref",
	"watch",
	"watchEffect",
	"watchPostEffect",
	"watchSyncEffect",
	"defineComponent",
	"defineAsyncComponent",
	"getCurrentInstance",
	"h",
	"inject",
	"nextTick",
	"provide",
	"useCssModule",
	"createApp",
	"effectScope",
	"EffectScope",
	"getCurrentScope",
	"onScopeDispose",
	...[
		"Component",
		"Slot",
		"Slots",
		"ComponentPublicInstance",
		"ComputedRef",
		"DirectiveBinding",
		"ExtractDefaultPropTypes",
		"ExtractPropTypes",
		"ExtractPublicPropTypes",
		"InjectionKey",
		"PropType",
		"Ref",
		"ShallowRef",
		"MaybeRef",
		"MaybeRefOrGetter",
		"VNode",
		"WritableComputedRef"
	].map((name) => ({
		name,
		type: true
	}))
];
const vue = defineUnimportPreset({
	from: "vue",
	imports: [
		...CommonCompositionAPI,
		"onRenderTracked",
		"onRenderTriggered",
		"resolveComponent",
		"useCssVars",
		"useModel",
		"getCurrentWatcher",
		"onWatcherCleanup",
		"useId",
		"useTemplateRef"
	]
});
const vueCompositionApi = defineUnimportPreset({
	from: "@vue/composition-api",
	imports: CommonCompositionAPI
});
const vueDemi = defineUnimportPreset({
	from: "vue-demi",
	imports: CommonCompositionAPI
});
const vueI18n = defineUnimportPreset({
	from: "vue-i18n",
	imports: ["useI18n"]
});
const vueMacros = defineUnimportPreset({
	from: "vue/macros",
	imports: [
		"$",
		"$$",
		"$ref",
		"$shallowRef",
		"$toRef",
		"$customRef",
		"$computed"
	]
});
const vueRouter = defineUnimportPreset({
	from: "vue-router",
	imports: [
		"useRouter",
		"useRoute",
		"useLink",
		"onBeforeRouteLeave",
		"onBeforeRouteUpdate"
	]
});
const vueRouterComposables = defineUnimportPreset({
	from: "vue-router/composables",
	imports: [
		"useRouter",
		"useRoute",
		"useLink",
		"onBeforeRouteLeave",
		"onBeforeRouteUpdate"
	]
});
let _cache;
const vueuseCore = () => {
	const excluded = ["toRefs", "utils"];
	if (!_cache) try {
		const corePath = resolveModule("@vueuse/core") || process$1.cwd();
		const path$2 = resolveModule("@vueuse/core/indexes.json") || resolveModule("@vueuse/metadata/index.json") || resolveModule("@vueuse/metadata/index.json", { paths: [corePath] });
		_cache = defineUnimportPreset({
			from: "@vueuse/core",
			imports: JSON.parse(readFileSync(path$2, "utf-8")).functions.filter((i$2) => ["core", "shared"].includes(i$2.package)).map((i$2) => i$2.name).filter((i$2) => i$2 && i$2.length >= 4 && !excluded.includes(i$2))
		});
	} catch (error) {
		console.error(error);
		throw new Error("[auto-import] failed to load @vueuse/core, have you installed it?");
	}
	return _cache;
};
const vueuseHead = defineUnimportPreset({
	from: "@vueuse/head",
	imports: ["useHead"]
});
const vuex = defineUnimportPreset({
	from: "vuex",
	imports: [
		"createStore",
		"createLogger",
		"mapState",
		"mapGetters",
		"mapActions",
		"mapMutations",
		"createNamespacedHelpers",
		"useStore"
	]
});
const builtinPresets = {
	"@vue/composition-api": vueCompositionApi,
	"@vueuse/core": vueuseCore,
	"@vueuse/head": vueuseHead,
	"pinia": pinia,
	"preact": preact,
	"quasar": quasar,
	"react": react,
	"react-router": reactRouter,
	"react-router-dom": reactRouterDom,
	"svelte": svelte,
	"svelte/animate": svelteAnimate,
	"svelte/easing": svelteEasing,
	"svelte/motion": svelteMotion,
	"svelte/store": svelteStore,
	"svelte/transition": svelteTransition,
	"vee-validate": veeValidate,
	"vitepress": vitepress,
	"vue-demi": vueDemi,
	"vue-i18n": vueI18n,
	"vue-router": vueRouter,
	"vue-router-composables": vueRouterComposables,
	"vue": vue,
	"vue/macros": vueMacros,
	"vuex": vuex,
	"vitest": vitest,
	"uni-app": uniApp,
	"solid-js": solid,
	"solid-app-router": solidAppRouter,
	"rxjs": rxjs,
	"date-fns": dateFns
};
const commonProps = [
	"from",
	"priority",
	"disabled",
	"dtsDisabled",
	"declarationType",
	"meta",
	"type",
	"typeFrom"
];
async function resolvePreset(preset) {
	const imports = [];
	if ("package" in preset) return await resolvePackagePreset(preset);
	const common = {};
	commonProps.forEach((i$2) => {
		if (i$2 in preset) common[i$2] = preset[i$2];
	});
	for (const _import of preset.imports) if (typeof _import === "string") imports.push({
		...common,
		name: _import,
		as: _import
	});
	else if (Array.isArray(_import)) imports.push({
		...common,
		name: _import[0],
		as: _import[1] || _import[0],
		from: _import[2] || preset.from
	});
	else if (_import.imports) imports.push(...await resolvePreset(_import));
	else imports.push({
		...common,
		..._import
	});
	return imports;
}
async function resolveBuiltinPresets(presets) {
	return (await Promise.all(presets.map(async (p$1) => {
		let preset = typeof p$1 === "string" ? builtinPresets[p$1] : p$1;
		if (typeof preset === "function") preset = preset();
		return await resolvePreset(preset);
	}))).flat();
}
function createUnimport(opts) {
	const ctx = createInternalContext(opts);
	async function generateTypeDeclarations(options) {
		const opts2 = {
			resolvePath: (i$2) => stripFileExtension(i$2.typeFrom || i$2.from),
			...options
		};
		const { typeReExports = true } = opts2;
		const imports = await ctx.getImports();
		let dts = toTypeDeclarationFile(imports.filter((i$2) => !i$2.type && !i$2.dtsDisabled), opts2);
		const typeOnly = imports.filter((i$2) => i$2.type);
		if (typeReExports && typeOnly.length) dts += `
${toTypeReExports(typeOnly, opts2)}`;
		for (const addon of ctx.addons) dts = await addon.declaration?.call(ctx, dts, opts2) ?? dts;
		return dts;
	}
	async function scanImportsFromFile(filepath, includeTypes = true) {
		const additions = await scanExports(filepath, includeTypes);
		await ctx.modifyDynamicImports((imports) => imports.filter((i$2) => i$2.from !== filepath).concat(additions));
		return additions;
	}
	async function scanImportsFromDir(dirs = ctx.options.dirs || [], options = ctx.options.dirsScanOptions) {
		const imports = await scanDirExports(dirs, options);
		const files = new Set(imports.map((f$1) => f$1.from));
		await ctx.modifyDynamicImports((i$2) => i$2.filter((i2) => !files.has(i2.from)).concat(imports));
		return imports;
	}
	async function injectImportsWithContext(code, id, options) {
		const result = await injectImports(code, id, ctx, {
			...opts,
			...options
		});
		const metadata = ctx.getMetadata();
		if (metadata) result.imports.forEach((i$2) => {
			metadata.injectionUsage[i$2.name] = metadata.injectionUsage[i$2.name] || {
				import: i$2,
				count: 0,
				moduleIds: []
			};
			metadata.injectionUsage[i$2.name].count++;
			if (id && !metadata.injectionUsage[i$2.name].moduleIds.includes(id)) metadata.injectionUsage[i$2.name].moduleIds.push(id);
		});
		return result;
	}
	async function init() {
		if (ctx.options.dirs?.length) await scanImportsFromDir();
	}
	return {
		version: version$1,
		init,
		clearDynamicImports: () => ctx.clearDynamicImports(),
		modifyDynamicImports: (fn) => ctx.modifyDynamicImports(fn),
		scanImportsFromDir,
		scanImportsFromFile,
		getImports: () => ctx.getImports(),
		getImportMap: () => ctx.getImportMap(),
		detectImports: (code) => detectImports(code, ctx),
		injectImports: injectImportsWithContext,
		generateTypeDeclarations: (options) => generateTypeDeclarations(options),
		getMetadata: () => ctx.getMetadata(),
		getInternalContext: () => ctx,
		toExports: async (filepath, includeTypes = false) => toExports(await ctx.getImports(), filepath, includeTypes)
	};
}
function createInternalContext(opts) {
	let _combinedImports;
	const _map = /* @__PURE__ */ new Map();
	const addons = configureAddons(opts);
	opts.addons = addons;
	opts.commentsDisable = opts.commentsDisable ?? ["@unimport-disable", "@imports-disable"];
	opts.commentsDebug = opts.commentsDebug ?? ["@unimport-debug", "@imports-debug"];
	let metadata;
	if (opts.collectMeta) metadata = { injectionUsage: {} };
	let resolvePromise;
	const ctx = {
		version: version$1,
		options: opts,
		addons,
		staticImports: [...opts.imports || []].filter(Boolean),
		dynamicImports: [],
		modifyDynamicImports,
		clearDynamicImports,
		async getImports() {
			await resolvePromise;
			return updateImports();
		},
		async replaceImports(imports) {
			ctx.staticImports = [...imports || []].filter(Boolean);
			ctx.invalidate();
			await resolvePromise;
			return updateImports();
		},
		async getImportMap() {
			await ctx.getImports();
			return _map;
		},
		getMetadata() {
			return metadata;
		},
		invalidate() {
			_combinedImports = void 0;
		},
		resolveId: (id, parentId) => opts.resolveId?.(id, parentId)
	};
	resolvePromise = resolveBuiltinPresets(opts.presets || []).then((r$3) => {
		ctx.staticImports.unshift(...r$3);
		_combinedImports = void 0;
		updateImports();
	});
	function updateImports() {
		if (!_combinedImports) {
			let imports = normalizeImports(dedupeImports([...ctx.staticImports, ...ctx.dynamicImports], opts.warn || console.warn));
			for (const addon of ctx.addons) if (addon.extendImports) imports = addon.extendImports.call(ctx, imports) ?? imports;
			imports = imports.filter((i$2) => !i$2.disabled);
			_map.clear();
			for (const _import of imports) if (!_import.type) _map.set(_import.as ?? _import.name, _import);
			_combinedImports = imports;
		}
		return _combinedImports;
	}
	async function modifyDynamicImports(fn) {
		const result = await fn(ctx.dynamicImports);
		if (Array.isArray(result)) ctx.dynamicImports = result;
		ctx.invalidate();
	}
	function clearDynamicImports() {
		ctx.dynamicImports.length = 0;
		ctx.invalidate();
	}
	return ctx;
}
async function injectImports(code, id, ctx, options) {
	const s = getMagicString(code);
	if (ctx.options.commentsDisable?.some((c$1) => s.original.includes(c$1))) return {
		s,
		get code() {
			return s.toString();
		},
		imports: []
	};
	for (const addon of ctx.addons) await addon.transform?.call(ctx, s, id);
	const { isCJSContext, matchedImports, firstOccurrence } = await detectImports(s, ctx, options);
	const imports = await resolveImports(ctx, matchedImports, id);
	if (ctx.options.commentsDebug?.some((c$1) => s.original.includes(c$1))) (ctx.options.debugLog || console.log)(`[unimport] ${imports.length} imports detected in "${id}"${imports.length ? `: ${imports.map((i$2) => i$2.name).join(", ")}` : ""}`);
	return {
		...addImportToCode(s, imports, isCJSContext, options?.mergeExisting, options?.injectAtEnd, firstOccurrence, (imports2) => {
			for (const addon of ctx.addons) imports2 = addon.injectImportsResolved?.call(ctx, imports2, s, id) ?? imports2;
			return imports2;
		}, (str, imports2) => {
			for (const addon of ctx.addons) str = addon.injectImportsStringified?.call(ctx, str, imports2, s, id) ?? str;
			return str;
		}),
		imports
	};
}
async function resolveImports(ctx, imports, id) {
	const resolveCache = /* @__PURE__ */ new Map();
	return (await Promise.all(imports.map(async (i$2) => {
		if (!resolveCache.has(i$2.from)) resolveCache.set(i$2.from, await ctx.resolveId(i$2.from, id) || i$2.from);
		const from = resolveCache.get(i$2.from);
		if (i$2.from === id || !from || from === "." || from === id) return;
		return {
			...i$2,
			from
		};
	}))).filter(Boolean);
}

//#endregion
//#region node_modules/.pnpm/unimport@5.6.0/node_modules/unimport/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({ createUnimport: () => createUnimport });

//#endregion
//#region src/build/types.ts
async function writeTypes(nitro) {
	const types$4 = { routes: {} };
	const generatedTypesDir = resolve$3(nitro.options.rootDir, nitro.options.typescript.generatedTypesDir || "node_modules/.nitro/types");
	const middleware = [...nitro.scannedHandlers, ...nitro.options.handlers];
	for (const mw of middleware) {
		if (typeof mw.handler !== "string" || !mw.route) continue;
		const relativePath = relative$2(generatedTypesDir, resolveNitroPath(mw.handler, nitro.options)).replace(/\.(js|mjs|cjs|ts|mts|cts|tsx|jsx)$/, "");
		const method = mw.method || "default";
		types$4.routes[mw.route] ??= {};
		types$4.routes[mw.route][method] ??= [];
		types$4.routes[mw.route][method].push(`Simplify<Serialize<Awaited<ReturnType<typeof import('${relativePath}').default>>>>`);
	}
	let autoImportedTypes = [];
	let autoImportExports = "";
	if (nitro.unimport) {
		await nitro.unimport.init();
		const allImports = await nitro.unimport.getImports();
		autoImportExports = toExports(allImports).replace(/#internal\/nitro/g, relative$2(generatedTypesDir, runtimeDir));
		const resolvedImportPathMap = /* @__PURE__ */ new Map();
		for (const i$2 of allImports) {
			const from = i$2.typeFrom || i$2.from;
			if (resolvedImportPathMap.has(from)) continue;
			let path$2 = resolveAlias(from, nitro.options.alias);
			if (!isAbsolute$2(path$2)) {
				const resolvedPath = resolveModulePath(from, {
					try: true,
					from: nitro.options.rootDir,
					conditions: [
						"type",
						"node",
						"import"
					],
					suffixes: ["", "/index"],
					extensions: [
						".mjs",
						".cjs",
						".js",
						".mts",
						".cts",
						".ts"
					]
				});
				if (resolvedPath) {
					const { dir, name } = parseNodeModulePath(resolvedPath);
					if (!dir || !name) path$2 = resolvedPath;
					else path$2 = join$2(dir, name, await lookupNodeModuleSubpath(resolvedPath) || "");
				}
			}
			if (existsSync(path$2) && !await isDirectory(path$2)) path$2 = path$2.replace(/\.[a-z]+$/, "");
			if (isAbsolute$2(path$2)) path$2 = relative$2(generatedTypesDir, path$2);
			resolvedImportPathMap.set(from, path$2);
		}
		autoImportedTypes = [nitro.options.imports && nitro.options.imports.autoImport !== false ? (await nitro.unimport.generateTypeDeclarations({
			exportHelper: false,
			resolvePath: (i$2) => {
				const from = i$2.typeFrom || i$2.from;
				return resolvedImportPathMap.get(from) ?? from;
			}
		})).trim() : ""];
	}
	const generateRoutes = () => [
		"// Generated by nitro",
		"import type { Serialize, Simplify } from \"nitro/types\";",
		"declare module \"nitro/types\" {",
		"  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T",
		"  interface InternalApi {",
		...Object.entries(types$4.routes).map(([path$2, methods]) => [
			`    '${path$2}': {`,
			...Object.entries(methods).map(([method, types$5]) => `      '${method}': ${types$5.join(" | ")}`),
			"    }"
		].join("\n")),
		"  }",
		"}",
		"export {}"
	];
	const config = [
		"// Generated by nitro",
		`declare module "nitro/types" {`,
		nitro.options.typescript.generateRuntimeConfigTypes ? generateTypes(await resolveSchema(Object.fromEntries(Object.entries(nitro.options.runtimeConfig).filter(([key]) => !["app", "nitro"].includes(key)))), {
			interfaceName: "NitroRuntimeConfig",
			addExport: false,
			addDefaults: false,
			allowExtraKeys: false,
			indentation: 2
		}) : "",
		`}`,
		"export {}"
	];
	const declarations = [
		"/// <reference path=\"./nitro-routes.d.ts\" />",
		"/// <reference path=\"./nitro-config.d.ts\" />",
		"/// <reference path=\"./nitro-imports.d.ts\" />"
	];
	const buildFiles = [];
	buildFiles.push({
		path: join$2(generatedTypesDir, "nitro-routes.d.ts"),
		contents: () => generateRoutes().join("\n")
	});
	buildFiles.push({
		path: join$2(generatedTypesDir, "nitro-config.d.ts"),
		contents: config.join("\n")
	});
	buildFiles.push({
		path: join$2(generatedTypesDir, "nitro-imports.d.ts"),
		contents: [...autoImportedTypes, autoImportExports || "export {}"].join("\n")
	});
	buildFiles.push({
		path: join$2(generatedTypesDir, "nitro.d.ts"),
		contents: declarations.join("\n")
	});
	if (nitro.options.typescript.generateTsConfig) {
		const tsConfigPath = resolve$3(generatedTypesDir, nitro.options.typescript.tsconfigPath || "tsconfig.json");
		const tsconfigDir = dirname$2(tsConfigPath);
		const tsConfig = defu(nitro.options.typescript.tsConfig, {
			compilerOptions: {
				esModuleInterop: true,
				allowSyntheticDefaultImports: true,
				skipLibCheck: true,
				target: "ESNext",
				allowJs: true,
				resolveJsonModule: true,
				moduleDetection: "force",
				isolatedModules: true,
				verbatimModuleSyntax: true,
				allowImportingTsExtensions: true,
				strict: nitro.options.typescript.strict,
				noUncheckedIndexedAccess: true,
				noImplicitOverride: true,
				forceConsistentCasingInFileNames: true,
				module: "Preserve",
				jsx: "preserve",
				jsxFactory: "h",
				jsxFragmentFactory: "Fragment",
				paths: { "#imports": [relativeWithDot(tsconfigDir, join$2(generatedTypesDir, "nitro-imports"))] }
			},
			include: [
				relativeWithDot(tsconfigDir, join$2(generatedTypesDir, "nitro.d.ts")).replace(/^(?=[^.])/, "./"),
				join$2(relativeWithDot(tsconfigDir, nitro.options.rootDir), "**/*"),
				...!nitro.options.serverDir || nitro.options.serverDir === nitro.options.rootDir ? [] : [join$2(relativeWithDot(tsconfigDir, nitro.options.serverDir), "**/*")]
			]
		});
		for (const alias in tsConfig.compilerOptions.paths) {
			const paths = await Promise.all(tsConfig.compilerOptions.paths[alias].map(async (path$2) => {
				if (!isAbsolute$2(path$2)) return path$2;
				return relativeWithDot(tsconfigDir, (await promises.stat(path$2).catch(() => null))?.isFile() ? path$2.replace(/(?<=\w)\.\w+$/g, "") : path$2);
			}));
			tsConfig.compilerOptions.paths[alias] = [...new Set(paths)];
		}
		tsConfig.include = [...new Set(tsConfig.include.map((p$1) => isAbsolute$2(p$1) ? relativeWithDot(tsconfigDir, p$1) : p$1))];
		if (tsConfig.exclude) tsConfig.exclude = [...new Set(tsConfig.exclude.map((p$1) => isAbsolute$2(p$1) ? relativeWithDot(tsconfigDir, p$1) : p$1))];
		types$4.tsConfig = tsConfig;
		buildFiles.push({
			path: tsConfigPath,
			contents: () => JSON.stringify(tsConfig, null, 2)
		});
	}
	await nitro.hooks.callHook("types:extend", types$4);
	await Promise.all(buildFiles.map(async (file) => {
		await writeFile$1(resolve$3(generatedTypesDir, file.path), typeof file.contents === "string" ? file.contents : file.contents());
	}));
}
const RELATIVE_RE = /^\.{1,2}\//;
function relativeWithDot(from, to) {
	const rel = relative$2(from, to);
	return RELATIVE_RE.test(rel) ? rel : "./" + rel;
}

//#endregion
//#region src/presets/_types.gen.ts
const presetsWithConfig = [
	"awsAmplify",
	"awsLambda",
	"azure",
	"cloudflare",
	"firebase",
	"netlify",
	"vercel"
];

//#endregion
//#region src/build/info.ts
const NITRO_WELLKNOWN_DIR = "node_modules/.nitro";
async function getBuildInfo(root) {
	const outputDir = await findLastBuildDir(root);
	if (!await stat$1(outputDir).then((s) => s.isDirectory()).catch(() => false)) return {};
	return {
		outputDir,
		buildInfo: await readFile(resolve$3(outputDir, "nitro.json"), "utf8").then(JSON.parse).catch(() => void 0)
	};
}
async function findLastBuildDir(root) {
	const lastBuildLink = join$2(root, NITRO_WELLKNOWN_DIR, "last-build.json");
	return await readFile(lastBuildLink, "utf8").then(JSON.parse).then((data$1) => resolve$3(lastBuildLink, data$1.outputDir || "../../../.output")).catch(() => resolve$3(root, ".output"));
}
async function writeBuildInfo(nitro) {
	const buildInfoPath = resolve$3(nitro.options.output.dir, "nitro.json");
	const buildInfo = {
		date: (/* @__PURE__ */ new Date()).toJSON(),
		preset: nitro.options.preset,
		framework: nitro.options.framework,
		versions: { nitro: version },
		commands: {
			preview: nitro.options.commands.preview,
			deploy: nitro.options.commands.deploy
		},
		config: { ...Object.fromEntries(presetsWithConfig.map((key) => [key, nitro.options[key]])) }
	};
	await writeFile$1(buildInfoPath, JSON.stringify(buildInfo, null, 2), true);
	const lastBuild = join$2(nitro.options.rootDir, NITRO_WELLKNOWN_DIR, "last-build.json");
	await mkdir(dirname$1(lastBuild), { recursive: true });
	await writeFile$1(lastBuild, JSON.stringify({ outputDir: relative$2(lastBuild, nitro.options.output.dir) }));
	return buildInfo;
}
async function writeDevBuildInfo(nitro, addr) {
	const buildInfoPath = join$2(nitro.options.rootDir, NITRO_WELLKNOWN_DIR, "nitro.dev.json");
	const buildInfo = {
		date: (/* @__PURE__ */ new Date()).toJSON(),
		preset: nitro.options.preset,
		framework: nitro.options.framework,
		versions: { nitro: version },
		dev: {
			pid: process.pid,
			workerAddress: addr
		}
	};
	await writeFile$1(buildInfoPath, JSON.stringify(buildInfo, null, 2));
}

//#endregion
//#region src/utils/parallel.ts
async function runParallel(inputs, cb, opts) {
	const errors = [];
	const tasks$1 = /* @__PURE__ */ new Set();
	function queueNext() {
		const route = inputs.values().next().value;
		if (!route) return;
		inputs.delete(route);
		const task = (opts.interval ? new Promise((resolve$4) => setTimeout(resolve$4, opts.interval)) : Promise.resolve()).then(() => cb(route)).catch((error) => {
			console.error(error);
			errors.push(error);
		});
		tasks$1.add(task);
		return task.then(() => {
			tasks$1.delete(task);
			if (inputs.size > 0) return refillQueue();
		});
	}
	function refillQueue() {
		const workers = Math.min(opts.concurrency - tasks$1.size, inputs.size);
		return Promise.all(Array.from({ length: workers }, () => queueNext()));
	}
	await refillQueue();
	return { errors };
}

//#endregion
//#region src/utils/regex.ts
function escapeRegExp$1(string) {
	return string.replace(/[-\\^$*+?.()|[\]{}]/g, String.raw`\$&`);
}
function pathRegExp(string) {
	if (A) string = string.replace(/\\/g, "/");
	let escaped = escapeRegExp$1(string);
	if (A) escaped = escaped.replace(/\//g, String.raw`[/\\]`);
	return escaped;
}
function toPathRegExp(input) {
	if (input instanceof RegExp) return input;
	if (typeof input === "string") return new RegExp(pathRegExp(input));
	throw new TypeError("Expected a string or RegExp", { cause: input });
}

//#endregion
//#region src/build/config.ts
function baseBuildConfig(nitro) {
	const extensions = [
		".ts",
		".mjs",
		".js",
		".json",
		".node",
		".tsx",
		".jsx"
	];
	const isNodeless = nitro.options.node === false;
	const importMetaInjections = {
		dev: nitro.options.dev,
		preset: nitro.options.preset,
		prerender: nitro.options.preset === "nitro-prerender",
		nitro: true,
		server: true,
		client: false,
		baseURL: nitro.options.baseURL,
		_asyncContext: nitro.options.experimental.asyncContext,
		_tasks: nitro.options.experimental.tasks,
		_websocket: nitro.options.features.websocket ?? nitro.options.experimental.websocket
	};
	const replacements = {
		...Object.fromEntries(Object.entries(importMetaInjections).map(([key, val]) => [`import.meta.${key}`, JSON.stringify(val)])),
		...nitro.options.replace
	};
	const { env } = defineEnv({
		nodeCompat: isNodeless,
		resolve: true,
		presets: nitro.options.unenv,
		overrides: { alias: nitro.options.alias }
	});
	return {
		extensions,
		isNodeless,
		replacements,
		env,
		aliases: resolveAliases({ ...env.alias }),
		noExternal: getNoExternals(nitro),
		ignoreWarningCodes: new Set([
			"EVAL",
			"CIRCULAR_DEPENDENCY",
			"THIS_IS_UNDEFINED",
			"EMPTY_BUNDLE"
		])
	};
}
function getNoExternals(nitro) {
	const noExternal = [
		/\.[mc]?tsx?$/,
		/^(?:[\0#~.]|virtual:)/,
		/* @__PURE__ */ new RegExp("^" + pathRegExp(pkgDir) + "(?!.*node_modules)"),
		...[nitro.options.rootDir, ...nitro.options.scanDirs.filter((dir) => dir.includes("node_modules") || !dir.startsWith(nitro.options.rootDir))].map((dir) => /* @__PURE__ */ new RegExp("^" + pathRegExp(dir) + "(?!.*node_modules)"))
	];
	if (nitro.options.wasm !== false) noExternal.push(/\.wasm$/);
	if (Array.isArray(nitro.options.noExternals)) noExternal.push(...nitro.options.noExternals.filter(Boolean).map((item) => toPathRegExp(item)));
	return noExternal.sort((a$1, b$2) => a$1.source.length - b$2.source.length);
}
function resolveAliases(_aliases) {
	const aliases = Object.fromEntries(Object.entries(_aliases).sort(([a$1], [b$2]) => b$2.split("/").length - a$1.split("/").length || b$2.length - a$1.length));
	for (const key in aliases) for (const alias in aliases) {
		if (![
			"~",
			"@",
			"#"
		].includes(alias[0])) continue;
		if (alias === "@" && !aliases[key].startsWith("@/")) continue;
		if (aliases[key].startsWith(alias)) aliases[key] = aliases[alias] + aliases[key].slice(alias.length);
	}
	return aliases;
}

//#endregion
//#region src/build/chunks.ts
const virtualRe = /^(?:\0|#|virtual:)/;
const NODE_MODULES_RE$1 = /node_modules[/\\][^.]/;
function libChunkName(id) {
	return `_libs/${id.match(/.*(?:[/\\])node_modules(?:[/\\])(?<package>@[^/\\]+[/\\][^/\\]+|[^/\\.][^/\\]*)/)?.groups?.package || "common"}`;
}
function getChunkName(chunk, nitro) {
	if (chunk.name === "rolldown-runtime") return "_runtime.mjs";
	if (chunk.moduleIds.every((id) => /node_modules[/\\]\w/.test(id))) {
		const pkgNames = [...new Set(chunk.moduleIds.map((id) => id.match(/.*[/\\]node_modules[/\\](?<package>@[^/\\]+[/\\][^/\\]+|[^/\\]+)/)?.groups?.package).filter(Boolean).map((name) => name.split(/[/\\]/).pop()).filter(Boolean))].sort((a$1, b$2) => a$1.length - b$2.length);
		let chunkName = "";
		for (const name of pkgNames) {
			const separator = chunkName ? "+" : "";
			if ((chunkName + separator + name).length > 30) return `_libs/_[hash].mjs`;
			chunkName += separator + name;
		}
		return `_libs/${chunkName || "_"}.mjs`;
	}
	if (chunk.moduleIds.length === 0) return `_chunks/${chunk.name}.mjs`;
	const ids = chunk.moduleIds.filter((id) => !virtualRe.test(id));
	if (ids.length === 0) {
		if (chunk.moduleIds.every((id) => id.includes("virtual:raw"))) return `_raw/[name].mjs`;
		return `_virtual/[name].mjs`;
	}
	if (ids.every((id) => id.endsWith(".wasm"))) return `_wasm/[name].mjs`;
	if (ids.every((id) => id.includes("vite/services"))) return `_ssr/[name].mjs`;
	if (ids.every((id) => id.startsWith(nitro.options.buildDir))) return `_build/[name].mjs`;
	if (ids.every((id) => id.startsWith(runtimeDir) || id.startsWith(presetsDir))) return `_nitro/[name].mjs`;
	const mainId = ids.at(-1);
	if (mainId) {
		const routeHandler = nitro.routing.routes.routes.flatMap((h$4) => h$4.data).find((h$4) => h$4.handler === mainId);
		if (routeHandler?.route) return `_routes/${routeToFsPath(routeHandler.route)}.mjs`;
		if (Object.entries(nitro.options.tasks).find(([_$2, task]) => task.handler === mainId)) return `_tasks/[name].mjs`;
	}
	return `_chunks/[name].mjs`;
}
function routeToFsPath(route) {
	return route.split("/").slice(1).map((s) => `${s.replace(/[:*]+/g, "$").replace(/[^$a-zA-Z0-9_.[\]/]/g, "_")}`).join("/") || "index";
}

//#endregion
//#region src/build/virtual/database.ts
function database(nitro) {
	return {
		id: "#nitro/virtual/database",
		template: () => {
			if (!nitro.options.experimental.database) return `export const connectionConfigs = {};`;
			const dbConfigs = nitro.options.dev && nitro.options.devDatabase || nitro.options.database;
			const connectorsNames = [...new Set(Object.values(dbConfigs || {}).map((config) => config?.connector))].filter(Boolean);
			for (const name of connectorsNames) if (!connectors[name]) throw new Error(`Database connector "${name}" is invalid.`);
			return `
${connectorsNames.map((name) => `import ${camelCase(name)}Connector from "${connectors[name]}";`).join("\n")}

export const connectionConfigs = {
  ${Object.entries(dbConfigs || {}).filter(([, config]) => !!config?.connector).map(([name, { connector, options }]) => `${name}: {
          connector: ${camelCase(connector)}Connector,
          options: ${JSON.stringify(options)}
        }`).join(",\n")}
};
        `;
		}
	};
}

//#endregion
//#region src/build/virtual/error-handler.ts
function errorHandler(nitro) {
	return {
		id: "#nitro/virtual/error-handler",
		template: () => {
			const errorHandlers = Array.isArray(nitro.options.errorHandler) ? nitro.options.errorHandler : [nitro.options.errorHandler];
			const builtinHandler = join$2(runtimeDir, `internal/error/${nitro.options.dev ? "dev" : "prod"}`);
			return `
${errorHandlers.map((h$4, i$2) => `import errorHandler$${i$2} from "${h$4}";`).join("\n")}

const errorHandlers = [${errorHandlers.map((_$2, i$2) => `errorHandler$${i$2}`).join(", ")}];

import { defaultHandler } from "${builtinHandler}";

export default async function(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}
`;
		}
	};
}

//#endregion
//#region src/build/virtual/feature-flags.ts
function featureFlags(nitro) {
	return {
		id: "#nitro/virtual/feature-flags",
		template: () => {
			const featureFlags = {
				hasRoutes: nitro.routing.routes.hasRoutes(),
				hasRouteRules: nitro.routing.routeRules.hasRoutes(),
				hasRoutedMiddleware: nitro.routing.routedMiddleware.hasRoutes(),
				hasGlobalMiddleware: nitro.routing.globalMiddleware.length > 0,
				hasPlugins: nitro.options.plugins.length > 0,
				hasHooks: nitro.options.features?.runtimeHooks ?? nitro.options.plugins.length > 0
			};
			return Object.entries(featureFlags).map(([key, value]) => `export const ${key} = ${Boolean(value)};`).join("\n");
		}
	};
}

//#endregion
//#region src/build/virtual/plugins.ts
function plugins(nitro) {
	return {
		id: "#nitro/virtual/plugins",
		template: () => {
			const nitroPlugins = [...new Set(nitro.options.plugins)];
			return `
  ${nitroPlugins.map((plugin) => `import _${hash(plugin).replace(/-/g, "")} from "${plugin}";`).join("\n")}

  export const plugins = [
    ${nitroPlugins.map((plugin) => `_${hash(plugin).replace(/-/g, "")}`).join(",\n")}
  ]
      `;
		}
	};
}

//#endregion
//#region src/build/virtual/polyfills.ts
function polyfills(_nitro, polyfills) {
	return {
		id: "#nitro/virtual/polyfills",
		moduleSideEffects: true,
		template: () => {
			return polyfills.map((p$1) => `import '${p$1}';`).join("\n") || `/* No polyfills */`;
		}
	};
}

//#endregion
//#region node_modules/.pnpm/etag@1.8.1/node_modules/etag/index.js
/*!
* etag
* Copyright(c) 2014-2016 Douglas Christopher Wilson
* MIT Licensed
*/
var require_etag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module exports.
	* @public
	*/
	module.exports = etag;
	/**
	* Module dependencies.
	* @private
	*/
	var crypto = __require$1("crypto");
	var Stats$1 = __require$1("fs").Stats;
	/**
	* Module variables.
	* @private
	*/
	var toString = Object.prototype.toString;
	/**
	* Generate an entity tag.
	*
	* @param {Buffer|string} entity
	* @return {string}
	* @private
	*/
	function entitytag(entity) {
		if (entity.length === 0) return "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"";
		var hash$1 = crypto.createHash("sha1").update(entity, "utf8").digest("base64").substring(0, 27);
		return "\"" + (typeof entity === "string" ? Buffer.byteLength(entity, "utf8") : entity.length).toString(16) + "-" + hash$1 + "\"";
	}
	/**
	* Create a simple ETag.
	*
	* @param {string|Buffer|Stats} entity
	* @param {object} [options]
	* @param {boolean} [options.weak]
	* @return {String}
	* @public
	*/
	function etag(entity, options) {
		if (entity == null) throw new TypeError("argument entity is required");
		var isStats = isstats(entity);
		var weak = options && typeof options.weak === "boolean" ? options.weak : isStats;
		if (!isStats && typeof entity !== "string" && !Buffer.isBuffer(entity)) throw new TypeError("argument entity must be string, Buffer, or fs.Stats");
		var tag = isStats ? stattag(entity) : entitytag(entity);
		return weak ? "W/" + tag : tag;
	}
	/**
	* Determine if object is a Stats object.
	*
	* @param {object} obj
	* @return {boolean}
	* @api private
	*/
	function isstats(obj) {
		if (typeof Stats$1 === "function" && obj instanceof Stats$1) return true;
		return obj && typeof obj === "object" && "ctime" in obj && toString.call(obj.ctime) === "[object Date]" && "mtime" in obj && toString.call(obj.mtime) === "[object Date]" && "ino" in obj && typeof obj.ino === "number" && "size" in obj && typeof obj.size === "number";
	}
	/**
	* Generate a tag for a stat.
	*
	* @param {object} stat
	* @return {string}
	* @private
	*/
	function stattag(stat$2) {
		var mtime = stat$2.mtime.getTime().toString(16);
		return "\"" + stat$2.size.toString(16) + "-" + mtime + "\"";
	}
}));

//#endregion
//#region src/build/virtual/public-assets.ts
var import_etag = /* @__PURE__ */ __toESM$1(require_etag(), 1);
const readAssetHandler = {
	true: "node",
	node: "node",
	false: "null",
	deno: "deno",
	inline: "inline"
};
function publicAssets(nitro) {
	return [
		{
			id: "#nitro/virtual/public-assets-data",
			template: async () => {
				const assets = {};
				const files = await glob("**", {
					cwd: nitro.options.output.publicDir,
					absolute: false,
					dot: true
				});
				const { errors } = await runParallel(new Set(files), async (id) => {
					let mimeType = src_default.getType(id.replace(/\.(gz|br)$/, "")) || "text/plain";
					if (mimeType.startsWith("text")) mimeType += "; charset=utf-8";
					const fullPath = resolve$3(nitro.options.output.publicDir, id);
					const [assetData, stat$2] = await Promise.all([promises.readFile(fullPath), promises.stat(fullPath)]);
					const etag = (0, import_etag.default)(assetData);
					const assetId = joinURL(nitro.options.baseURL, decodeURIComponent(id));
					let encoding;
					if (id.endsWith(".gz")) encoding = "gzip";
					else if (id.endsWith(".br")) encoding = "br";
					assets[assetId] = {
						type: nitro._prerenderMeta?.[assetId]?.contentType || mimeType,
						encoding,
						etag,
						mtime: stat$2.mtime.toJSON(),
						size: stat$2.size,
						path: relative$2(nitro.options.output.serverDir, fullPath),
						data: nitro.options.serveStatic === "inline" ? assetData.toString("base64") : void 0
					};
				}, { concurrency: 25 });
				if (errors.length > 0) throw new Error(`Failed to process public assets:\n${errors.join("\n")}`, { cause: errors });
				return `export default ${JSON.stringify(assets, null, 2)};`;
			}
		},
		{
			id: "#nitro/virtual/public-assets",
			template: () => {
				const publicAssetBases = Object.fromEntries(nitro.options.publicAssets.filter((dir) => !dir.fallthrough && dir.baseURL !== "/").map((dir) => [withTrailingSlash(joinURL(nitro.options.baseURL, dir.baseURL || "/")), { maxAge: dir.maxAge }]));
				return `
import assets from '#nitro/virtual/public-assets-data'
export { readAsset } from "${`#nitro/virtual/public-assets-${readAssetHandler[nitro.options.serveStatic] || "null"}`}"
export const publicAssetBases = ${JSON.stringify(publicAssetBases)}

export function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

export function getPublicAssetMeta(id = '') {
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return publicAssetBases[base] }
  }
  return {}
}

export function getAsset (id) {
  return assets[id]
}
`;
			}
		},
		{
			id: "#nitro/virtual/public-assets-node",
			template: () => {
				return `
import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import assets from '#nitro/virtual/public-assets-data'
export function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__))
  return fsp.readFile(resolve(serverDir, assets[id].path))
}`;
			}
		},
		{
			id: "#nitro/virtual/public-assets-deno",
			template: () => {
				return `
import assets from '#nitro/virtual/public-assets-data'
export function readAsset (id) {
  // https://deno.com/deploy/docs/serve-static-assets
  const path = '.' + decodeURIComponent(new URL(\`../public\${id}\`, 'file://').pathname)
  return Deno.readFile(path);
}`;
			}
		},
		{
			id: "#nitro/virtual/public-assets-null",
			template: () => {
				return `
    export function readAsset (id) {
        return Promise.resolve(null);
    }`;
			}
		},
		{
			id: "#nitro/virtual/public-assets-inline",
			template: () => {
				return `
  import assets from '#nitro/virtual/public-assets-data'
  export function readAsset (id) {
    if (!assets[id]) { return undefined }
    if (assets[id]._data) { return assets[id]._data }
    if (!assets[id].data) { return assets[id].data }
    assets[id]._data = Uint8Array.from(atob(assets[id].data), (c) => c.charCodeAt(0))
    return assets[id]._data
}`;
			}
		}
	];
}

//#endregion
//#region src/build/virtual/renderer-template.ts
function rendererTemplate(nitro) {
	return {
		id: "#nitro/virtual/renderer-template",
		template: async () => {
			const template = nitro.options.renderer?.template;
			if (typeof template !== "string") return `
            export const rendererTemplate = () => '<!-- renderer.template is not set -->';
            export const rendererTemplateFile = undefined;
            export const isStaticTemplate = true;`;
			if (nitro.options.dev) return `
            import { readFile } from 'node:fs/promises';
            export const rendererTemplate = () => readFile(${JSON.stringify(template)}, "utf8");
            export const rendererTemplateFile = ${JSON.stringify(template)};
            export const isStaticTemplate = ${JSON.stringify(nitro.options.renderer?.static)};
            `;
			else {
				const html = await readFile(template, "utf8");
				if (nitro.options.renderer?.static ?? !hasTemplateSyntax(html)) return `
              import { HTTPResponse } from "h3";
              export const rendererTemplate = () => new HTTPResponse(${JSON.stringify(html)}, { headers: { "content-type": "text/html; charset=utf-8" } });
            `;
				else return `
            import { renderToResponse } from 'rendu'
            import { serverFetch } from 'nitro/app'
            const template = ${compileTemplateToString(html, { contextKeys: [...RENDER_CONTEXT_KEYS] })};
            export const rendererTemplate = (request) => renderToResponse(template, { request, context: { serverFetch } })
            `;
			}
		}
	};
}

//#endregion
//#region src/build/virtual/routing-meta.ts
function routingMeta(nitro) {
	return {
		id: "#nitro/virtual/routing-meta",
		template: () => {
			const routeHandlers = uniqueBy$1(Object.values(nitro.routing.routes.routes).flatMap((h$4) => h$4.data), "_importHash");
			return `
  ${routeHandlers.map((h$4) => `import ${h$4._importHash}Meta from "${h$4.handler}?meta";`).join("\n")}
export const handlersMeta = [
  ${routeHandlers.map((h$4) => `{ route: ${JSON.stringify(h$4.route)}, method: ${JSON.stringify(h$4.method?.toLowerCase())}, meta: ${h$4._importHash}Meta }`).join(",\n")}
  ];
        `.trim();
		}
	};
}
function uniqueBy$1(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}

//#endregion
//#region src/build/virtual/routing.ts
const RuntimeRouteRules = [
	"headers",
	"redirect",
	"proxy",
	"cache"
];
function routing(nitro) {
	return {
		id: "#nitro/virtual/routing",
		template: () => {
			const allHandlers = uniqueBy([
				...Object.values(nitro.routing.routes.routes).flatMap((h$4) => h$4.data),
				...Object.values(nitro.routing.routedMiddleware.routes).map((h$4) => h$4.data),
				...nitro.routing.globalMiddleware
			], "_importHash");
			return `
import * as __routeRules__ from "#nitro/runtime/route-rules";
import * as srvxNode from "srvx/node"
import * as h3 from "h3";

export const findRouteRules = ${nitro.routing.routeRules.compileToString({
				serialize: serializeRouteRule,
				matchAll: true
			})}

const multiHandler = (...handlers) => {
  const final = handlers.pop()
  const middleware = handlers.filter(Boolean).map(h => h3.toMiddleware(h));
  return (ev) => h3.callMiddleware(ev, middleware, final);
}

${allHandlers.filter((h$4) => !h$4.lazy).map((h$4) => `import ${h$4._importHash} from "${h$4.handler}";`).join("\n")}

${allHandlers.filter((h$4) => h$4.lazy).map((h$4) => `const ${h$4._importHash} = h3.defineLazyEventHandler(() => import("${h$4.handler}")${h$4.format === "node" ? ".then(m => srvxNode.toFetchHandler(m.default))" : ""});`).join("\n")}

export const findRoute = ${nitro.routing.routes.compileToString({ serialize: serializeHandler })}

export const findRoutedMiddleware = ${nitro.routing.routedMiddleware.compileToString({
				serialize: serializeHandler,
				matchAll: true
			})};

export const globalMiddleware = [
  ${nitro.routing.globalMiddleware.map((h$4) => h$4.lazy ? h$4._importHash : `h3.toEventHandler(${h$4._importHash})`).join(",")}
].filter(Boolean);
  `;
		}
	};
}
function uniqueBy(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}
function serializeHandler(h$4) {
	const meta = Array.isArray(h$4) ? h$4[0] : h$4;
	return `{${[
		`route:${JSON.stringify(meta.route)}`,
		meta.method && `method:${JSON.stringify(meta.method)}`,
		meta.meta && `meta:${JSON.stringify(meta.meta)}`,
		`handler:${Array.isArray(h$4) ? `multiHandler(${h$4.map((handler) => serializeHandlerFn(handler)).join(",")})` : serializeHandlerFn(h$4)}`
	].filter(Boolean).join(",")}}`;
}
function serializeHandlerFn(h$4) {
	let code = h$4._importHash;
	if (!h$4.lazy) {
		if (h$4.format === "node") code = `srvxNode.toFetchHandler(${code})`;
		code = `h3.toEventHandler(${code})`;
	}
	return code;
}
function serializeRouteRule(h$4) {
	return `[${Object.entries(h$4).filter(([name, options]) => options !== void 0 && name[0] !== "_").map(([name, options]) => {
		return `{${[
			`name:${JSON.stringify(name)}`,
			`route:${JSON.stringify(h$4._route)}`,
			h$4._method && `method:${JSON.stringify(h$4._method)}`,
			RuntimeRouteRules.includes(name) && `handler:__routeRules__.${name}`,
			`options:${JSON.stringify(options)}`
		].filter(Boolean).join(",")}}`;
	}).join(",")}]`;
}

//#endregion
//#region src/build/virtual/runtime-config.ts
function runtimeConfig(nitro) {
	return {
		id: "#nitro/virtual/runtime-config",
		template: () => {
			return `export const runtimeConfig = ${JSON.stringify(nitro.options.runtimeConfig || {})};`;
		}
	};
}

//#endregion
//#region src/build/virtual/server-assets.ts
function serverAssets(nitro) {
	return {
		id: "#nitro/virtual/server-assets",
		template: async () => {
			if (nitro.options.dev || nitro.options.preset === "nitro-prerender") return `
          import { createStorage } from 'unstorage'
          import fsDriver from 'unstorage/drivers/fs'
          const serverAssets = ${JSON.stringify(nitro.options.serverAssets)}
          export const assets = createStorage()
          for (const asset of serverAssets) {
            assets.mount(asset.baseName, fsDriver({ base: asset.dir, ignore: (asset?.ignore || []) }))
          }`;
			const assets = {};
			for (const asset of nitro.options.serverAssets) {
				const files = await glob(asset.pattern || "**/*", {
					cwd: asset.dir,
					absolute: false,
					ignore: asset.ignore
				});
				for (const _id of files) {
					const fsPath = resolve$3(asset.dir, _id);
					const id = asset.baseName + "/" + _id;
					assets[id] = {
						fsPath,
						meta: {}
					};
					let type$1 = src_default.getType(id) || "text/plain";
					if (type$1.startsWith("text")) type$1 += "; charset=utf-8";
					const etag = (0, import_etag.default)(await promises.readFile(fsPath));
					const mtime = await promises.stat(fsPath).then((s) => s.mtime.toJSON());
					assets[id].meta = {
						type: type$1,
						etag,
						mtime
					};
				}
			}
			return `
const _assets = {\n${Object.entries(assets).map(([id, asset]) => `  [${JSON.stringify(normalizeKey(id))}]: {\n    import: () => import(${JSON.stringify("raw:" + asset.fsPath)}).then(r => r.default || r),\n    meta: ${JSON.stringify(asset.meta)}\n  }`).join(",\n")}\n}

const normalizeKey = ${normalizeKey.toString()}

export const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id)
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
}
`;
		}
	};
}

//#endregion
//#region src/build/virtual/storage.ts
function storage(nitro) {
	return {
		id: "#nitro/virtual/storage",
		template: () => {
			const mounts = [];
			const storageMounts = nitro.options.dev || nitro.options.preset === "nitro-prerender" ? {
				...nitro.options.storage,
				...nitro.options.devStorage
			} : nitro.options.storage;
			for (const path$2 in storageMounts) {
				const { driver: driverName, ...driverOpts } = storageMounts[path$2];
				mounts.push({
					path: path$2,
					driver: builtinDrivers[driverName] || driverName,
					opts: driverOpts
				});
			}
			return `
import { createStorage } from 'unstorage'
import { assets } from '#nitro/virtual/server-assets'

${[...new Set(mounts.map((m$3) => m$3.driver))].map((i$2) => genImport(i$2, genSafeVariableName(i$2))).join("\n")}

export function initStorage() {
  const storage = createStorage({})
  storage.mount('/assets', assets)
  ${mounts.map((m$3) => `storage.mount('${m$3.path}', ${genSafeVariableName(m$3.driver)}(${JSON.stringify(m$3.opts)}))`).join("\n")}
  return storage
}
`;
		}
	};
}

//#endregion
//#region src/build/virtual/tasks.ts
function tasks(nitro) {
	return {
		id: "#nitro/virtual/tasks",
		template: () => {
			const _scheduledTasks = Object.entries(nitro.options.scheduledTasks || {}).map(([cron, _tasks]) => {
				return {
					cron,
					tasks: (Array.isArray(_tasks) ? _tasks : [_tasks]).filter((name) => {
						if (!nitro.options.tasks[name]) {
							nitro.logger.warn(`Scheduled task \`${name}\` is not defined!`);
							return false;
						}
						return true;
					})
				};
			}).filter((e) => e.tasks.length > 0);
			const scheduledTasks = _scheduledTasks.length > 0 ? _scheduledTasks : false;
			return `
export const scheduledTasks = ${JSON.stringify(scheduledTasks)};

export const tasks = {
  ${Object.entries(nitro.options.tasks).map(([name, task]) => `"${name}": {
          meta: {
            description: ${JSON.stringify(task.description)},
          },
          resolve: ${task.handler ? `() => import("${normalize$2(task.handler)}").then(r => r.default || r)` : "undefined"},
        }`).join(",\n")}
};`;
		}
	};
}

//#endregion
//#region src/build/virtual/_all.ts
function virtualTemplates(nitro, _polyfills) {
	const nitroTemplates = [
		database,
		errorHandler,
		featureFlags,
		plugins,
		polyfills,
		publicAssets,
		rendererTemplate,
		routingMeta,
		routing,
		runtimeConfig,
		serverAssets,
		storage,
		tasks
	].flatMap((t$1) => t$1(nitro, _polyfills));
	const customTemplates = Object.entries(nitro.options.virtual).map(([id, template]) => ({
		id,
		template
	}));
	return [...nitroTemplates, ...customTemplates];
}

//#endregion
//#region node_modules/.pnpm/estree-walker@2.0.2/node_modules/estree-walker/dist/esm/estree-walker.js
/** @typedef { import('estree').BaseNode} BaseNode */
/** @typedef {{
skip: () => void;
remove: () => void;
replace: (node: BaseNode) => void;
}} WalkerContext */
var WalkerBase = class {
	constructor() {
		/** @type {boolean} */
		this.should_skip = false;
		/** @type {boolean} */
		this.should_remove = false;
		/** @type {BaseNode | null} */
		this.replacement = null;
		/** @type {WalkerContext} */
		this.context = {
			skip: () => this.should_skip = true,
			remove: () => this.should_remove = true,
			replace: (node) => this.replacement = node
		};
	}
	/**
	*
	* @param {any} parent
	* @param {string} prop
	* @param {number} index
	* @param {BaseNode} node
	*/
	replace(parent, prop, index, node) {
		if (parent) if (index !== null) parent[prop][index] = node;
		else parent[prop] = node;
	}
	/**
	*
	* @param {any} parent
	* @param {string} prop
	* @param {number} index
	*/
	remove(parent, prop, index) {
		if (parent) if (index !== null) parent[prop].splice(index, 1);
		else delete parent[prop];
	}
};
/** @typedef { import('estree').BaseNode} BaseNode */
/** @typedef { import('./walker.js').WalkerContext} WalkerContext */
/** @typedef {(
*    this: WalkerContext,
*    node: BaseNode,
*    parent: BaseNode,
*    key: string,
*    index: number
* ) => void} SyncHandler */
var SyncWalker = class extends WalkerBase {
	/**
	*
	* @param {SyncHandler} enter
	* @param {SyncHandler} leave
	*/
	constructor(enter, leave) {
		super();
		/** @type {SyncHandler} */
		this.enter = enter;
		/** @type {SyncHandler} */
		this.leave = leave;
	}
	/**
	*
	* @param {BaseNode} node
	* @param {BaseNode} parent
	* @param {string} [prop]
	* @param {number} [index]
	* @returns {BaseNode}
	*/
	visit(node, parent, prop, index) {
		if (node) {
			if (this.enter) {
				const _should_skip = this.should_skip;
				const _should_remove = this.should_remove;
				const _replacement = this.replacement;
				this.should_skip = false;
				this.should_remove = false;
				this.replacement = null;
				this.enter.call(this.context, node, parent, prop, index);
				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}
				if (this.should_remove) this.remove(parent, prop, index);
				const skipped = this.should_skip;
				const removed = this.should_remove;
				this.should_skip = _should_skip;
				this.should_remove = _should_remove;
				this.replacement = _replacement;
				if (skipped) return node;
				if (removed) return null;
			}
			for (const key in node) {
				const value = node[key];
				if (typeof value !== "object") continue;
				else if (Array.isArray(value)) {
					for (let i$2 = 0; i$2 < value.length; i$2 += 1) if (value[i$2] !== null && typeof value[i$2].type === "string") {
						if (!this.visit(value[i$2], node, key, i$2)) i$2--;
					}
				} else if (value !== null && typeof value.type === "string") this.visit(value, node, key, null);
			}
			if (this.leave) {
				const _replacement = this.replacement;
				const _should_remove = this.should_remove;
				this.replacement = null;
				this.should_remove = false;
				this.leave.call(this.context, node, parent, prop, index);
				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}
				if (this.should_remove) this.remove(parent, prop, index);
				const removed = this.should_remove;
				this.replacement = _replacement;
				this.should_remove = _should_remove;
				if (removed) return null;
			}
		}
		return node;
	}
};
/** @typedef { import('estree').BaseNode} BaseNode */
/** @typedef { import('./sync.js').SyncHandler} SyncHandler */
/** @typedef { import('./async.js').AsyncHandler} AsyncHandler */
/**
*
* @param {BaseNode} ast
* @param {{
*   enter?: SyncHandler
*   leave?: SyncHandler
* }} walker
* @returns {BaseNode}
*/
function walk(ast, { enter, leave }) {
	return new SyncWalker(enter, leave).visit(ast, null);
}

//#endregion
//#region node_modules/.pnpm/@rollup+pluginutils@5.3.0_rollup@4.55.3/node_modules/@rollup/pluginutils/dist/es/index.js
const extractors = {
	ArrayPattern(names, param) {
		for (const element of param.elements) if (element) extractors[element.type](names, element);
	},
	AssignmentPattern(names, param) {
		extractors[param.left.type](names, param.left);
	},
	Identifier(names, param) {
		names.push(param.name);
	},
	MemberExpression() {},
	ObjectPattern(names, param) {
		for (const prop of param.properties) if (prop.type === "RestElement") extractors.RestElement(names, prop);
		else extractors[prop.value.type](names, prop.value);
	},
	RestElement(names, param) {
		extractors[param.argument.type](names, param.argument);
	}
};
const extractAssignedNames = function extractAssignedNames(param) {
	const names = [];
	extractors[param.type](names, param);
	return names;
};
const blockDeclarations = {
	const: true,
	let: true
};
var Scope = class {
	constructor(options = {}) {
		this.parent = options.parent;
		this.isBlockScope = !!options.block;
		this.declarations = Object.create(null);
		if (options.params) options.params.forEach((param) => {
			extractAssignedNames(param).forEach((name) => {
				this.declarations[name] = true;
			});
		});
	}
	addDeclaration(node, isBlockDeclaration, isVar) {
		if (!isBlockDeclaration && this.isBlockScope) this.parent.addDeclaration(node, isBlockDeclaration, isVar);
		else if (node.id) extractAssignedNames(node.id).forEach((name) => {
			this.declarations[name] = true;
		});
	}
	contains(name) {
		return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
	}
};
const attachScopes = function attachScopes(ast, propertyName = "scope") {
	let scope = new Scope();
	walk(ast, {
		enter(n$2, parent) {
			const node = n$2;
			if (/(?:Function|Class)Declaration/.test(node.type)) scope.addDeclaration(node, false, false);
			if (node.type === "VariableDeclaration") {
				const { kind } = node;
				const isBlockDeclaration = blockDeclarations[kind];
				node.declarations.forEach((declaration) => {
					scope.addDeclaration(declaration, isBlockDeclaration, true);
				});
			}
			let newScope;
			if (node.type.includes("Function")) {
				const func = node;
				newScope = new Scope({
					parent: scope,
					block: false,
					params: func.params
				});
				if (func.type === "FunctionExpression" && func.id) newScope.addDeclaration(func, false, false);
			}
			if (/For(?:In|Of)?Statement/.test(node.type)) newScope = new Scope({
				parent: scope,
				block: true
			});
			if (node.type === "BlockStatement" && !parent.type.includes("Function")) newScope = new Scope({
				parent: scope,
				block: true
			});
			if (node.type === "CatchClause") newScope = new Scope({
				parent: scope,
				params: node.param ? [node.param] : [],
				block: true
			});
			if (newScope) {
				Object.defineProperty(node, propertyName, {
					value: newScope,
					configurable: true
				});
				scope = newScope;
			}
		},
		leave(n$2) {
			if (n$2[propertyName]) scope = scope.parent;
		}
	});
	return scope;
};
function isArray(arg) {
	return Array.isArray(arg);
}
function ensureArray(thing) {
	if (isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
const normalizePathRegExp = new RegExp(`\\${win32.sep}`, "g");
const normalizePath = function normalizePath(filename) {
	return filename.replace(normalizePathRegExp, posix.sep);
};
function getMatcherString(id, resolutionBase) {
	if (resolutionBase === false || isAbsolute(id) || id.startsWith("**")) return normalizePath(id);
	const basePath = normalizePath(resolve(resolutionBase || "")).replace(/[-^$*+?.()|[\]{}]/g, "\\$&");
	return posix.join(basePath, normalizePath(id));
}
const createFilter = function createFilter(include, exclude, options) {
	const resolutionBase = options && options.resolve;
	const getMatcher = (id) => id instanceof RegExp ? id : { test: (what) => {
		return (0, import_picomatch.default)(getMatcherString(id, resolutionBase), { dot: true })(what);
	} };
	const includeMatchers = ensureArray(include).map(getMatcher);
	const excludeMatchers = ensureArray(exclude).map(getMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function result(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = normalizePath(id);
		for (let i$2 = 0; i$2 < excludeMatchers.length; ++i$2) {
			const matcher = excludeMatchers[i$2];
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (let i$2 = 0; i$2 < includeMatchers.length; ++i$2) {
			const matcher = includeMatchers[i$2];
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
};
const forbiddenIdentifiers = new Set(`break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl`.split(" "));
forbiddenIdentifiers.add("");
const makeLegalIdentifier = function makeLegalIdentifier(str) {
	let identifier = str.replace(/-(\w)/g, (_$2, letter) => letter.toUpperCase()).replace(/[^$_a-zA-Z0-9]/g, "_");
	if (/\d/.test(identifier[0]) || forbiddenIdentifiers.has(identifier)) identifier = `_${identifier}`;
	return identifier || "_";
};
function stringify(obj) {
	return (JSON.stringify(obj) || "undefined").replace(/[\u2028\u2029]/g, (char) => `\\u${`000${char.charCodeAt(0).toString(16)}`.slice(-4)}`);
}
function serializeArray(arr, indent, baseIndent) {
	let output = "[";
	const separator = indent ? `\n${baseIndent}${indent}` : "";
	for (let i$2 = 0; i$2 < arr.length; i$2++) {
		const key = arr[i$2];
		output += `${i$2 > 0 ? "," : ""}${separator}${serialize(key, indent, baseIndent + indent)}`;
	}
	return `${output}${indent ? `\n${baseIndent}` : ""}]`;
}
function serializeObject(obj, indent, baseIndent) {
	let output = "{";
	const separator = indent ? `\n${baseIndent}${indent}` : "";
	const entries = Object.entries(obj);
	for (let i$2 = 0; i$2 < entries.length; i$2++) {
		const [key, value] = entries[i$2];
		const stringKey = makeLegalIdentifier(key) === key ? key : stringify(key);
		output += `${i$2 > 0 ? "," : ""}${separator}${stringKey}:${indent ? " " : ""}${serialize(value, indent, baseIndent + indent)}`;
	}
	return `${output}${indent ? `\n${baseIndent}` : ""}}`;
}
function serialize(obj, indent, baseIndent) {
	if (typeof obj === "object" && obj !== null) {
		if (Array.isArray(obj)) return serializeArray(obj, indent, baseIndent);
		if (obj instanceof Date) return `new Date(${obj.getTime()})`;
		if (obj instanceof RegExp) return obj.toString();
		return serializeObject(obj, indent, baseIndent);
	}
	if (typeof obj === "number") {
		if (obj === Infinity) return "Infinity";
		if (obj === -Infinity) return "-Infinity";
		if (obj === 0) return 1 / obj === Infinity ? "0" : "-0";
		if (obj !== obj) return "NaN";
	}
	if (typeof obj === "symbol") {
		const key = Symbol.keyFor(obj);
		if (key !== void 0) return `Symbol.for(${stringify(key)})`;
	}
	if (typeof obj === "bigint") return `${obj}n`;
	return stringify(obj);
}
const hasStringIsWellFormed = "isWellFormed" in String.prototype;
function isWellFormedString(input) {
	if (hasStringIsWellFormed) return input.isWellFormed();
	return !/\p{Surrogate}/u.test(input);
}
const dataToEsm = function dataToEsm(data$1, options = {}) {
	var _a, _b;
	const t$1 = options.compact ? "" : "indent" in options ? options.indent : "	";
	const _$2 = options.compact ? "" : " ";
	const n$2 = options.compact ? "" : "\n";
	const declarationType = options.preferConst ? "const" : "var";
	if (options.namedExports === false || typeof data$1 !== "object" || Array.isArray(data$1) || data$1 instanceof Date || data$1 instanceof RegExp || data$1 === null) {
		const code = serialize(data$1, options.compact ? null : t$1, "");
		return `export default${_$2 || (/^[{[\-\/]/.test(code) ? "" : " ")}${code};`;
	}
	let maxUnderbarPrefixLength = 0;
	for (const key of Object.keys(data$1)) {
		const underbarPrefixLength = (_b = (_a = /^(_+)/.exec(key)) === null || _a === void 0 ? void 0 : _a[0].length) !== null && _b !== void 0 ? _b : 0;
		if (underbarPrefixLength > maxUnderbarPrefixLength) maxUnderbarPrefixLength = underbarPrefixLength;
	}
	const arbitraryNamePrefix = `${"_".repeat(maxUnderbarPrefixLength + 1)}arbitrary`;
	let namedExportCode = "";
	const defaultExportRows = [];
	const arbitraryNameExportRows = [];
	for (const [key, value] of Object.entries(data$1)) if (key === makeLegalIdentifier(key)) {
		if (options.objectShorthand) defaultExportRows.push(key);
		else defaultExportRows.push(`${key}:${_$2}${key}`);
		namedExportCode += `export ${declarationType} ${key}${_$2}=${_$2}${serialize(value, options.compact ? null : t$1, "")};${n$2}`;
	} else {
		defaultExportRows.push(`${stringify(key)}:${_$2}${serialize(value, options.compact ? null : t$1, "")}`);
		if (options.includeArbitraryNames && isWellFormedString(key)) {
			const variableName = `${arbitraryNamePrefix}${arbitraryNameExportRows.length}`;
			namedExportCode += `${declarationType} ${variableName}${_$2}=${_$2}${serialize(value, options.compact ? null : t$1, "")};${n$2}`;
			arbitraryNameExportRows.push(`${variableName} as ${JSON.stringify(key)}`);
		}
	}
	const arbitraryExportCode = arbitraryNameExportRows.length > 0 ? `export${_$2}{${n$2}${t$1}${arbitraryNameExportRows.join(`,${n$2}${t$1}`)}${n$2}};${n$2}` : "";
	const defaultExportCode = `export default${_$2}{${n$2}${t$1}${defaultExportRows.join(`,${n$2}${t$1}`)}${n$2}};${n$2}`;
	return `${namedExportCode}${arbitraryExportCode}${defaultExportCode}`;
};

//#endregion
//#region node_modules/.pnpm/@rollup+plugin-replace@6.0.3_rollup@4.55.3/node_modules/@rollup/plugin-replace/dist/es/index.js
function escape(str) {
	return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}
function ensureFunction(functionOrValue) {
	if (typeof functionOrValue === "function") return functionOrValue;
	return function() {
		return functionOrValue;
	};
}
function longest(a$1, b$2) {
	return b$2.length - a$1.length;
}
function getReplacements(options) {
	if (options.values) return Object.assign({}, options.values);
	var values = Object.assign({}, options);
	delete values.delimiters;
	delete values.include;
	delete values.exclude;
	delete values.sourcemap;
	delete values.sourceMap;
	delete values.objectGuards;
	delete values.preventAssignment;
	return values;
}
function mapToFunctions(object) {
	return Object.keys(object).reduce(function(fns, key) {
		var functions = Object.assign({}, fns);
		functions[key] = ensureFunction(object[key]);
		return functions;
	}, {});
}
var objKeyRegEx = /^([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)(\.([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*))+$/;
function expandTypeofReplacements(replacements) {
	Object.keys(replacements).forEach(function(key) {
		var objMatch = key.match(objKeyRegEx);
		if (!objMatch) return;
		var dotIndex = objMatch[1].length;
		do {
			replacements["typeof " + key.slice(0, dotIndex)] = "\"object\"";
			dotIndex = key.indexOf(".", dotIndex + 1);
		} while (dotIndex !== -1);
	});
}
function replace(options) {
	if (options === void 0) options = {};
	var filter = createFilter(options.include, options.exclude);
	var delimiters = options.delimiters;
	if (delimiters === void 0) delimiters = ["(?<![_$a-zA-Z0-9\\xA0-\\uFFFF])", "(?![_$a-zA-Z0-9\\xA0-\\uFFFF])(?!\\.)"];
	var preventAssignment = options.preventAssignment;
	var objectGuards = options.objectGuards;
	var replacements = getReplacements(options);
	if (objectGuards) expandTypeofReplacements(replacements);
	var functionValues = mapToFunctions(replacements);
	var keys = Object.keys(functionValues).sort(longest).map(escape);
	var lookbehind = preventAssignment ? "(?<!\\b(?:const|let|var)\\s*)" : "";
	var lookahead = preventAssignment ? "(?!\\s*=[^=])" : "";
	var pattern = new RegExp("" + lookbehind + delimiters[0] + "(" + keys.join("|") + ")" + delimiters[1] + lookahead, "g");
	return {
		name: "replace",
		buildStart: function buildStart() {
			if (![true, false].includes(preventAssignment)) this.warn({ message: "@rollup/plugin-replace: 'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`." });
		},
		renderChunk: function renderChunk(code, chunk) {
			var id = chunk.fileName;
			if (!keys.length) return null;
			if (!filter(id)) return null;
			return executeReplacement(code, id);
		},
		transform: function transform(code, id) {
			if (!keys.length) return null;
			if (!filter(id)) return null;
			return executeReplacement(code, id);
		}
	};
	function executeReplacement(code, id) {
		var magicString = new MagicString(code);
		if (!codeHasReplacements(code, id, magicString)) return null;
		var result = { code: magicString.toString() };
		if (isSourceMapEnabled()) result.map = magicString.generateMap({ hires: true });
		return result;
	}
	function codeHasReplacements(code, id, magicString) {
		var result = false;
		var match;
		while (match = pattern.exec(code)) {
			result = true;
			var start = match.index;
			var end = start + match[0].length;
			var replacement = String(functionValues[match[1]](id));
			magicString.overwrite(start, end, replacement);
		}
		return result;
	}
	function isSourceMapEnabled() {
		return options.sourceMap !== false && options.sourcemap !== false;
	}
}

//#endregion
//#region node_modules/.pnpm/unwasm@0.5.3/node_modules/unwasm/dist/plugin/index.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require$2() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_lib = __commonJS({ "node_modules/.pnpm/@webassemblyjs+helper-api-error@1.13.2/node_modules/@webassemblyjs/helper-api-error/lib/index.js"(exports) {
	"use strict";
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LinkError = exports.CompileError = exports.RuntimeError = void 0;
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			writable: true,
			configurable: true
		} });
		if (superClass) _setPrototypeOf(subClass, superClass);
	}
	function _createSuper(Derived) {
		var hasNativeReflectConstruct = _isNativeReflectConstruct();
		return function _createSuperInternal() {
			var Super = _getPrototypeOf(Derived), result;
			if (hasNativeReflectConstruct) {
				var NewTarget = _getPrototypeOf(this).constructor;
				result = Reflect.construct(Super, arguments, NewTarget);
			} else result = Super.apply(this, arguments);
			return _possibleConstructorReturn(this, result);
		};
	}
	function _possibleConstructorReturn(self, call) {
		if (call && (_typeof(call) === "object" || typeof call === "function")) return call;
		else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
		return _assertThisInitialized(self);
	}
	function _assertThisInitialized(self) {
		if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return self;
	}
	function _wrapNativeSuper(Class) {
		var _cache$1 = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
		_wrapNativeSuper = function _wrapNativeSuper2(Class2) {
			if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
			if (typeof Class2 !== "function") throw new TypeError("Super expression must either be null or a function");
			if (typeof _cache$1 !== "undefined") {
				if (_cache$1.has(Class2)) return _cache$1.get(Class2);
				_cache$1.set(Class2, Wrapper);
			}
			function Wrapper() {
				return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
			}
			Wrapper.prototype = Object.create(Class2.prototype, { constructor: {
				value: Wrapper,
				enumerable: false,
				writable: true,
				configurable: true
			} });
			return _setPrototypeOf(Wrapper, Class2);
		};
		return _wrapNativeSuper(Class);
	}
	function _construct(Parent, args, Class) {
		if (_isNativeReflectConstruct()) _construct = Reflect.construct;
		else _construct = function _construct2(Parent2, args2, Class2) {
			var a$1 = [null];
			a$1.push.apply(a$1, args2);
			var instance = new (Function.bind.apply(Parent2, a$1))();
			if (Class2) _setPrototypeOf(instance, Class2.prototype);
			return instance;
		};
		return _construct.apply(null, arguments);
	}
	function _isNativeReflectConstruct() {
		if (typeof Reflect === "undefined" || !Reflect.construct) return false;
		if (Reflect.construct.sham) return false;
		if (typeof Proxy === "function") return true;
		try {
			Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
			return true;
		} catch (e) {
			return false;
		}
	}
	function _isNativeFunction(fn) {
		return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}
	function _setPrototypeOf(o$1, p$1) {
		_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
			o2.__proto__ = p2;
			return o2;
		};
		return _setPrototypeOf(o$1, p$1);
	}
	function _getPrototypeOf(o$1) {
		_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
			return o2.__proto__ || Object.getPrototypeOf(o2);
		};
		return _getPrototypeOf(o$1);
	}
	exports.RuntimeError = /* @__PURE__ */ (function(_Error) {
		_inherits(RuntimeError2, _Error);
		var _super = _createSuper(RuntimeError2);
		function RuntimeError2() {
			_classCallCheck(this, RuntimeError2);
			return _super.apply(this, arguments);
		}
		return RuntimeError2;
	})(/* @__PURE__ */ _wrapNativeSuper(Error));
	exports.CompileError = /* @__PURE__ */ (function(_Error2) {
		_inherits(CompileError2, _Error2);
		var _super2 = _createSuper(CompileError2);
		function CompileError2() {
			_classCallCheck(this, CompileError2);
			return _super2.apply(this, arguments);
		}
		return CompileError2;
	})(/* @__PURE__ */ _wrapNativeSuper(Error));
	exports.LinkError = /* @__PURE__ */ (function(_Error3) {
		_inherits(LinkError2, _Error3);
		var _super3 = _createSuper(LinkError2);
		function LinkError2() {
			_classCallCheck(this, LinkError2);
			return _super3.apply(this, arguments);
		}
		return LinkError2;
	})(/* @__PURE__ */ _wrapNativeSuper(Error));
} });
var require_index_cjs = __commonJS({ "node_modules/.pnpm/@xtuc+ieee754@1.2.0/node_modules/@xtuc/ieee754/dist/index.cjs.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = read$2;
	exports.write = write;
	function read$2(buffer, offset, isLE, mLen, nBytes) {
		var e, m$3;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var nBits = -7;
		var i$2 = isLE ? nBytes - 1 : 0;
		var d$2 = isLE ? -1 : 1;
		var s = buffer[offset + i$2];
		i$2 += d$2;
		e = s & (1 << -nBits) - 1;
		s >>= -nBits;
		nBits += eLen;
		for (; nBits > 0; e = e * 256 + buffer[offset + i$2], i$2 += d$2, nBits -= 8);
		m$3 = e & (1 << -nBits) - 1;
		e >>= -nBits;
		nBits += mLen;
		for (; nBits > 0; m$3 = m$3 * 256 + buffer[offset + i$2], i$2 += d$2, nBits -= 8);
		if (e === 0) e = 1 - eBias;
		else if (e === eMax) return m$3 ? NaN : (s ? -1 : 1) * Infinity;
		else {
			m$3 = m$3 + Math.pow(2, mLen);
			e = e - eBias;
		}
		return (s ? -1 : 1) * m$3 * Math.pow(2, e - mLen);
	}
	function write(buffer, value, offset, isLE, mLen, nBytes) {
		var e, m$3, c$1;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
		var i$2 = isLE ? 0 : nBytes - 1;
		var d$2 = isLE ? 1 : -1;
		var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
		value = Math.abs(value);
		if (isNaN(value) || value === Infinity) {
			m$3 = isNaN(value) ? 1 : 0;
			e = eMax;
		} else {
			e = Math.floor(Math.log(value) / Math.LN2);
			if (value * (c$1 = Math.pow(2, -e)) < 1) {
				e--;
				c$1 *= 2;
			}
			if (e + eBias >= 1) value += rt / c$1;
			else value += rt * Math.pow(2, 1 - eBias);
			if (value * c$1 >= 2) {
				e++;
				c$1 /= 2;
			}
			if (e + eBias >= eMax) {
				m$3 = 0;
				e = eMax;
			} else if (e + eBias >= 1) {
				m$3 = (value * c$1 - 1) * Math.pow(2, mLen);
				e = e + eBias;
			} else {
				m$3 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
				e = 0;
			}
		}
		for (; mLen >= 8; buffer[offset + i$2] = m$3 & 255, i$2 += d$2, m$3 /= 256, mLen -= 8);
		e = e << mLen | m$3;
		eLen += mLen;
		for (; eLen > 0; buffer[offset + i$2] = e & 255, i$2 += d$2, e /= 256, eLen -= 8);
		buffer[offset + i$2 - d$2] |= s * 128;
	}
} });
var require_lib2 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ieee754@1.14.1/node_modules/@webassemblyjs/ieee754/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encodeF32 = encodeF32;
	exports.encodeF64 = encodeF64;
	exports.decodeF32 = decodeF32;
	exports.decodeF64 = decodeF64;
	exports.DOUBLE_PRECISION_MANTISSA = exports.SINGLE_PRECISION_MANTISSA = exports.NUMBER_OF_BYTE_F64 = exports.NUMBER_OF_BYTE_F32 = void 0;
	var _ieee = require_index_cjs();
	var NUMBER_OF_BYTE_F32 = 4;
	exports.NUMBER_OF_BYTE_F32 = NUMBER_OF_BYTE_F32;
	var NUMBER_OF_BYTE_F64 = 8;
	exports.NUMBER_OF_BYTE_F64 = NUMBER_OF_BYTE_F64;
	var SINGLE_PRECISION_MANTISSA = 23;
	exports.SINGLE_PRECISION_MANTISSA = SINGLE_PRECISION_MANTISSA;
	var DOUBLE_PRECISION_MANTISSA = 52;
	exports.DOUBLE_PRECISION_MANTISSA = DOUBLE_PRECISION_MANTISSA;
	function encodeF32(v$3) {
		var buffer = [];
		(0, _ieee.write)(buffer, v$3, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
		return buffer;
	}
	function encodeF64(v$3) {
		var buffer = [];
		(0, _ieee.write)(buffer, v$3, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
		return buffer;
	}
	function decodeF32(bytes) {
		var buffer = new Uint8Array(bytes);
		return (0, _ieee.read)(buffer, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
	}
	function decodeF64(bytes) {
		var buffer = new Uint8Array(bytes);
		return (0, _ieee.read)(buffer, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
	}
} });
var require_decoder = __commonJS({ "node_modules/.pnpm/@webassemblyjs+utf8@1.14.1/node_modules/@webassemblyjs/utf8/lib/decoder.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = decode2;
	function con(b$2) {
		if ((b$2 & 192) === 128) return b$2 & 63;
		else throw new Error("invalid UTF-8 encoding");
	}
	function code(min, n$2) {
		if (n$2 < min || 55296 <= n$2 && n$2 < 57344 || n$2 >= 65536) throw new Error("invalid UTF-8 encoding");
		else return n$2;
	}
	function decode2(bytes) {
		return _decode(bytes).map(function(x$5) {
			return String.fromCharCode(x$5);
		}).join("");
	}
	function _decode(bytes) {
		var result = [];
		while (bytes.length > 0) {
			var b1 = bytes[0];
			if (b1 < 128) {
				result.push(code(0, b1));
				bytes = bytes.slice(1);
				continue;
			}
			if (b1 < 192) throw new Error("invalid UTF-8 encoding");
			var b2 = bytes[1];
			if (b1 < 224) {
				result.push(code(128, ((b1 & 31) << 6) + con(b2)));
				bytes = bytes.slice(2);
				continue;
			}
			var b3 = bytes[2];
			if (b1 < 240) {
				result.push(code(2048, ((b1 & 15) << 12) + (con(b2) << 6) + con(b3)));
				bytes = bytes.slice(3);
				continue;
			}
			var b4 = bytes[3];
			if (b1 < 248) {
				result.push(code(65536, (((b1 & 7) << 18) + con(b2) << 12) + (con(b3) << 6) + con(b4)));
				bytes = bytes.slice(4);
				continue;
			}
			throw new Error("invalid UTF-8 encoding");
		}
		return result;
	}
} });
var require_encoder = __commonJS({ "node_modules/.pnpm/@webassemblyjs+utf8@1.14.1/node_modules/@webassemblyjs/utf8/lib/encoder.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encode = encode$1;
	function _toConsumableArray(arr) {
		return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}
	function _nonIterableSpread() {
		throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _arrayWithoutHoles(arr) {
		if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}
	function _toArray(arr) {
		return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(o$1, minLen) {
		if (!o$1) return;
		if (typeof o$1 === "string") return _arrayLikeToArray(o$1, minLen);
		var n$2 = Object.prototype.toString.call(o$1).slice(8, -1);
		if (n$2 === "Object" && o$1.constructor) n$2 = o$1.constructor.name;
		if (n$2 === "Map" || n$2 === "Set") return Array.from(o$1);
		if (n$2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$2)) return _arrayLikeToArray(o$1, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i$2 = 0, arr2 = new Array(len); i$2 < len; i$2++) arr2[i$2] = arr[i$2];
		return arr2;
	}
	function _iterableToArray(iter) {
		if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}
	function _arrayWithHoles(arr) {
		if (Array.isArray(arr)) return arr;
	}
	function con(n$2) {
		return 128 | n$2 & 63;
	}
	function encode$1(str) {
		return _encode(str.split("").map(function(x$5) {
			return x$5.charCodeAt(0);
		}));
	}
	function _encode(arr) {
		if (arr.length === 0) return [];
		var _arr = _toArray(arr), n$2 = _arr[0], ns = _arr.slice(1);
		if (n$2 < 0) throw new Error("utf8");
		if (n$2 < 128) return [n$2].concat(_toConsumableArray(_encode(ns)));
		if (n$2 < 2048) return [192 | n$2 >>> 6, con(n$2)].concat(_toConsumableArray(_encode(ns)));
		if (n$2 < 65536) return [
			224 | n$2 >>> 12,
			con(n$2 >>> 6),
			con(n$2)
		].concat(_toConsumableArray(_encode(ns)));
		if (n$2 < 1114112) return [
			240 | n$2 >>> 18,
			con(n$2 >>> 12),
			con(n$2 >>> 6),
			con(n$2)
		].concat(_toConsumableArray(_encode(ns)));
		throw new Error("utf8");
	}
} });
var require_lib3 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+utf8@1.14.1/node_modules/@webassemblyjs/utf8/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "decode", {
		enumerable: true,
		get: function get() {
			return _decoder.decode;
		}
	});
	Object.defineProperty(exports, "encode", {
		enumerable: true,
		get: function get() {
			return _encoder.encode;
		}
	});
	var _decoder = require_decoder();
	var _encoder = require_encoder();
} });
var require_nodes = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/nodes.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.module = _module;
	exports.moduleMetadata = moduleMetadata;
	exports.moduleNameMetadata = moduleNameMetadata;
	exports.functionNameMetadata = functionNameMetadata;
	exports.localNameMetadata = localNameMetadata;
	exports.binaryModule = binaryModule;
	exports.quoteModule = quoteModule;
	exports.sectionMetadata = sectionMetadata;
	exports.producersSectionMetadata = producersSectionMetadata;
	exports.producerMetadata = producerMetadata;
	exports.producerMetadataVersionedName = producerMetadataVersionedName;
	exports.loopInstruction = loopInstruction;
	exports.instr = instr;
	exports.ifInstruction = ifInstruction;
	exports.stringLiteral = stringLiteral;
	exports.numberLiteral = numberLiteral;
	exports.longNumberLiteral = longNumberLiteral;
	exports.floatLiteral = floatLiteral;
	exports.elem = elem;
	exports.indexInFuncSection = indexInFuncSection;
	exports.valtypeLiteral = valtypeLiteral;
	exports.typeInstruction = typeInstruction;
	exports.start = start;
	exports.globalType = globalType;
	exports.leadingComment = leadingComment;
	exports.blockComment = blockComment;
	exports.data = data$1;
	exports.global = global;
	exports.table = table;
	exports.memory = memory;
	exports.funcImportDescr = funcImportDescr;
	exports.moduleImport = moduleImport;
	exports.moduleExportDescr = moduleExportDescr;
	exports.moduleExport = moduleExport;
	exports.limit = limit;
	exports.signature = signature;
	exports.program = program;
	exports.identifier = identifier;
	exports.blockInstruction = blockInstruction;
	exports.callInstruction = callInstruction;
	exports.callIndirectInstruction = callIndirectInstruction;
	exports.byteArray = byteArray;
	exports.func = func;
	exports.internalBrUnless = internalBrUnless;
	exports.internalGoto = internalGoto;
	exports.internalCallExtern = internalCallExtern;
	exports.internalEndAndReturn = internalEndAndReturn;
	exports.assertInternalCallExtern = exports.assertInternalGoto = exports.assertInternalBrUnless = exports.assertFunc = exports.assertByteArray = exports.assertCallIndirectInstruction = exports.assertCallInstruction = exports.assertBlockInstruction = exports.assertIdentifier = exports.assertProgram = exports.assertSignature = exports.assertLimit = exports.assertModuleExport = exports.assertModuleExportDescr = exports.assertModuleImport = exports.assertFuncImportDescr = exports.assertMemory = exports.assertTable = exports.assertGlobal = exports.assertData = exports.assertBlockComment = exports.assertLeadingComment = exports.assertGlobalType = exports.assertStart = exports.assertTypeInstruction = exports.assertValtypeLiteral = exports.assertIndexInFuncSection = exports.assertElem = exports.assertFloatLiteral = exports.assertLongNumberLiteral = exports.assertNumberLiteral = exports.assertStringLiteral = exports.assertIfInstruction = exports.assertInstr = exports.assertLoopInstruction = exports.assertProducerMetadataVersionedName = exports.assertProducerMetadata = exports.assertProducersSectionMetadata = exports.assertSectionMetadata = exports.assertQuoteModule = exports.assertBinaryModule = exports.assertLocalNameMetadata = exports.assertFunctionNameMetadata = exports.assertModuleNameMetadata = exports.assertModuleMetadata = exports.assertModule = exports.isIntrinsic = exports.isImportDescr = exports.isNumericLiteral = exports.isExpression = exports.isInstruction = exports.isBlock = exports.isNode = exports.isInternalEndAndReturn = exports.isInternalCallExtern = exports.isInternalGoto = exports.isInternalBrUnless = exports.isFunc = exports.isByteArray = exports.isCallIndirectInstruction = exports.isCallInstruction = exports.isBlockInstruction = exports.isIdentifier = exports.isProgram = exports.isSignature = exports.isLimit = exports.isModuleExport = exports.isModuleExportDescr = exports.isModuleImport = exports.isFuncImportDescr = exports.isMemory = exports.isTable = exports.isGlobal = exports.isData = exports.isBlockComment = exports.isLeadingComment = exports.isGlobalType = exports.isStart = exports.isTypeInstruction = exports.isValtypeLiteral = exports.isIndexInFuncSection = exports.isElem = exports.isFloatLiteral = exports.isLongNumberLiteral = exports.isNumberLiteral = exports.isStringLiteral = exports.isIfInstruction = exports.isInstr = exports.isLoopInstruction = exports.isProducerMetadataVersionedName = exports.isProducerMetadata = exports.isProducersSectionMetadata = exports.isSectionMetadata = exports.isQuoteModule = exports.isBinaryModule = exports.isLocalNameMetadata = exports.isFunctionNameMetadata = exports.isModuleNameMetadata = exports.isModuleMetadata = exports.isModule = void 0;
	exports.nodeAndUnionTypes = exports.unionTypesMap = exports.assertInternalEndAndReturn = void 0;
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	function isTypeOf(t$1) {
		return function(n$2) {
			return n$2.type === t$1;
		};
	}
	function assertTypeOf(t$1) {
		return function(n$2) {
			return (function() {
				if (!(n$2.type === t$1)) throw new Error("n.type === t error: unknown");
			})();
		};
	}
	function _module(id, fields, metadata) {
		if (id !== null && id !== void 0) {
			if (!(typeof id === "string")) throw new Error("typeof id === \"string\" error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
		}
		if (!(_typeof(fields) === "object" && typeof fields.length !== "undefined")) throw new Error("typeof fields === \"object\" && typeof fields.length !== \"undefined\" error: unknown");
		var node = {
			type: "Module",
			id,
			fields
		};
		if (typeof metadata !== "undefined") node.metadata = metadata;
		return node;
	}
	function moduleMetadata(sections, functionNames, localNames, producers) {
		if (!(_typeof(sections) === "object" && typeof sections.length !== "undefined")) throw new Error("typeof sections === \"object\" && typeof sections.length !== \"undefined\" error: unknown");
		if (functionNames !== null && functionNames !== void 0) {
			if (!(_typeof(functionNames) === "object" && typeof functionNames.length !== "undefined")) throw new Error("typeof functionNames === \"object\" && typeof functionNames.length !== \"undefined\" error: unknown");
		}
		if (localNames !== null && localNames !== void 0) {
			if (!(_typeof(localNames) === "object" && typeof localNames.length !== "undefined")) throw new Error("typeof localNames === \"object\" && typeof localNames.length !== \"undefined\" error: unknown");
		}
		if (producers !== null && producers !== void 0) {
			if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) throw new Error("typeof producers === \"object\" && typeof producers.length !== \"undefined\" error: unknown");
		}
		var node = {
			type: "ModuleMetadata",
			sections
		};
		if (typeof functionNames !== "undefined" && functionNames.length > 0) node.functionNames = functionNames;
		if (typeof localNames !== "undefined" && localNames.length > 0) node.localNames = localNames;
		if (typeof producers !== "undefined" && producers.length > 0) node.producers = producers;
		return node;
	}
	function moduleNameMetadata(value) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		return {
			type: "ModuleNameMetadata",
			value
		};
	}
	function functionNameMetadata(value, index) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		if (!(typeof index === "number")) throw new Error("typeof index === \"number\" error: " + ("Argument index must be of type number, given: " + _typeof(index) || "unknown"));
		return {
			type: "FunctionNameMetadata",
			value,
			index
		};
	}
	function localNameMetadata(value, localIndex, functionIndex) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		if (!(typeof localIndex === "number")) throw new Error("typeof localIndex === \"number\" error: " + ("Argument localIndex must be of type number, given: " + _typeof(localIndex) || "unknown"));
		if (!(typeof functionIndex === "number")) throw new Error("typeof functionIndex === \"number\" error: " + ("Argument functionIndex must be of type number, given: " + _typeof(functionIndex) || "unknown"));
		return {
			type: "LocalNameMetadata",
			value,
			localIndex,
			functionIndex
		};
	}
	function binaryModule(id, blob) {
		if (id !== null && id !== void 0) {
			if (!(typeof id === "string")) throw new Error("typeof id === \"string\" error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
		}
		if (!(_typeof(blob) === "object" && typeof blob.length !== "undefined")) throw new Error("typeof blob === \"object\" && typeof blob.length !== \"undefined\" error: unknown");
		return {
			type: "BinaryModule",
			id,
			blob
		};
	}
	function quoteModule(id, string) {
		if (id !== null && id !== void 0) {
			if (!(typeof id === "string")) throw new Error("typeof id === \"string\" error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
		}
		if (!(_typeof(string) === "object" && typeof string.length !== "undefined")) throw new Error("typeof string === \"object\" && typeof string.length !== \"undefined\" error: unknown");
		return {
			type: "QuoteModule",
			id,
			string
		};
	}
	function sectionMetadata(section, startOffset, size, vectorOfSize) {
		if (!(typeof startOffset === "number")) throw new Error("typeof startOffset === \"number\" error: " + ("Argument startOffset must be of type number, given: " + _typeof(startOffset) || "unknown"));
		return {
			type: "SectionMetadata",
			section,
			startOffset,
			size,
			vectorOfSize
		};
	}
	function producersSectionMetadata(producers) {
		if (!(_typeof(producers) === "object" && typeof producers.length !== "undefined")) throw new Error("typeof producers === \"object\" && typeof producers.length !== \"undefined\" error: unknown");
		return {
			type: "ProducersSectionMetadata",
			producers
		};
	}
	function producerMetadata(language, processedBy, sdk) {
		if (!(_typeof(language) === "object" && typeof language.length !== "undefined")) throw new Error("typeof language === \"object\" && typeof language.length !== \"undefined\" error: unknown");
		if (!(_typeof(processedBy) === "object" && typeof processedBy.length !== "undefined")) throw new Error("typeof processedBy === \"object\" && typeof processedBy.length !== \"undefined\" error: unknown");
		if (!(_typeof(sdk) === "object" && typeof sdk.length !== "undefined")) throw new Error("typeof sdk === \"object\" && typeof sdk.length !== \"undefined\" error: unknown");
		return {
			type: "ProducerMetadata",
			language,
			processedBy,
			sdk
		};
	}
	function producerMetadataVersionedName(name, version$3) {
		if (!(typeof name === "string")) throw new Error("typeof name === \"string\" error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
		if (!(typeof version$3 === "string")) throw new Error("typeof version === \"string\" error: " + ("Argument version must be of type string, given: " + _typeof(version$3) || "unknown"));
		return {
			type: "ProducerMetadataVersionedName",
			name,
			version: version$3
		};
	}
	function loopInstruction(label, resulttype, instr2) {
		if (!(_typeof(instr2) === "object" && typeof instr2.length !== "undefined")) throw new Error("typeof instr === \"object\" && typeof instr.length !== \"undefined\" error: unknown");
		return {
			type: "LoopInstruction",
			id: "loop",
			label,
			resulttype,
			instr: instr2
		};
	}
	function instr(id, object, args, namedArgs) {
		if (!(typeof id === "string")) throw new Error("typeof id === \"string\" error: " + ("Argument id must be of type string, given: " + _typeof(id) || "unknown"));
		if (!(_typeof(args) === "object" && typeof args.length !== "undefined")) throw new Error("typeof args === \"object\" && typeof args.length !== \"undefined\" error: unknown");
		var node = {
			type: "Instr",
			id,
			args
		};
		if (typeof object !== "undefined") node.object = object;
		if (typeof namedArgs !== "undefined" && Object.keys(namedArgs).length !== 0) node.namedArgs = namedArgs;
		return node;
	}
	function ifInstruction(testLabel, test, result, consequent, alternate) {
		if (!(_typeof(test) === "object" && typeof test.length !== "undefined")) throw new Error("typeof test === \"object\" && typeof test.length !== \"undefined\" error: unknown");
		if (!(_typeof(consequent) === "object" && typeof consequent.length !== "undefined")) throw new Error("typeof consequent === \"object\" && typeof consequent.length !== \"undefined\" error: unknown");
		if (!(_typeof(alternate) === "object" && typeof alternate.length !== "undefined")) throw new Error("typeof alternate === \"object\" && typeof alternate.length !== \"undefined\" error: unknown");
		return {
			type: "IfInstruction",
			id: "if",
			testLabel,
			test,
			result,
			consequent,
			alternate
		};
	}
	function stringLiteral(value) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		return {
			type: "StringLiteral",
			value
		};
	}
	function numberLiteral(value, raw$1) {
		if (!(typeof value === "number")) throw new Error("typeof value === \"number\" error: " + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
		if (!(typeof raw$1 === "string")) throw new Error("typeof raw === \"string\" error: " + ("Argument raw must be of type string, given: " + _typeof(raw$1) || "unknown"));
		return {
			type: "NumberLiteral",
			value,
			raw: raw$1
		};
	}
	function longNumberLiteral(value, raw$1) {
		if (!(typeof raw$1 === "string")) throw new Error("typeof raw === \"string\" error: " + ("Argument raw must be of type string, given: " + _typeof(raw$1) || "unknown"));
		return {
			type: "LongNumberLiteral",
			value,
			raw: raw$1
		};
	}
	function floatLiteral(value, nan, inf, raw$1) {
		if (!(typeof value === "number")) throw new Error("typeof value === \"number\" error: " + ("Argument value must be of type number, given: " + _typeof(value) || "unknown"));
		if (nan !== null && nan !== void 0) {
			if (!(typeof nan === "boolean")) throw new Error("typeof nan === \"boolean\" error: " + ("Argument nan must be of type boolean, given: " + _typeof(nan) || "unknown"));
		}
		if (inf !== null && inf !== void 0) {
			if (!(typeof inf === "boolean")) throw new Error("typeof inf === \"boolean\" error: " + ("Argument inf must be of type boolean, given: " + _typeof(inf) || "unknown"));
		}
		if (!(typeof raw$1 === "string")) throw new Error("typeof raw === \"string\" error: " + ("Argument raw must be of type string, given: " + _typeof(raw$1) || "unknown"));
		var node = {
			type: "FloatLiteral",
			value,
			raw: raw$1
		};
		if (nan === true) node.nan = true;
		if (inf === true) node.inf = true;
		return node;
	}
	function elem(table2, offset, funcs) {
		if (!(_typeof(offset) === "object" && typeof offset.length !== "undefined")) throw new Error("typeof offset === \"object\" && typeof offset.length !== \"undefined\" error: unknown");
		if (!(_typeof(funcs) === "object" && typeof funcs.length !== "undefined")) throw new Error("typeof funcs === \"object\" && typeof funcs.length !== \"undefined\" error: unknown");
		return {
			type: "Elem",
			table: table2,
			offset,
			funcs
		};
	}
	function indexInFuncSection(index) {
		return {
			type: "IndexInFuncSection",
			index
		};
	}
	function valtypeLiteral(name) {
		return {
			type: "ValtypeLiteral",
			name
		};
	}
	function typeInstruction(id, functype) {
		return {
			type: "TypeInstruction",
			id,
			functype
		};
	}
	function start(index) {
		return {
			type: "Start",
			index
		};
	}
	function globalType(valtype, mutability) {
		return {
			type: "GlobalType",
			valtype,
			mutability
		};
	}
	function leadingComment(value) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		return {
			type: "LeadingComment",
			value
		};
	}
	function blockComment(value) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		return {
			type: "BlockComment",
			value
		};
	}
	function data$1(memoryIndex, offset, init) {
		return {
			type: "Data",
			memoryIndex,
			offset,
			init
		};
	}
	function global(globalType2, init, name) {
		if (!(_typeof(init) === "object" && typeof init.length !== "undefined")) throw new Error("typeof init === \"object\" && typeof init.length !== \"undefined\" error: unknown");
		return {
			type: "Global",
			globalType: globalType2,
			init,
			name
		};
	}
	function table(elementType, limits, name, elements) {
		if (!(limits.type === "Limit")) throw new Error("limits.type === \"Limit\" error: " + ("Argument limits must be of type Limit, given: " + limits.type || "unknown"));
		if (elements !== null && elements !== void 0) {
			if (!(_typeof(elements) === "object" && typeof elements.length !== "undefined")) throw new Error("typeof elements === \"object\" && typeof elements.length !== \"undefined\" error: unknown");
		}
		var node = {
			type: "Table",
			elementType,
			limits,
			name
		};
		if (typeof elements !== "undefined" && elements.length > 0) node.elements = elements;
		return node;
	}
	function memory(limits, id) {
		return {
			type: "Memory",
			limits,
			id
		};
	}
	function funcImportDescr(id, signature2) {
		return {
			type: "FuncImportDescr",
			id,
			signature: signature2
		};
	}
	function moduleImport(module2, name, descr) {
		if (!(typeof module2 === "string")) throw new Error("typeof module === \"string\" error: " + ("Argument module must be of type string, given: " + _typeof(module2) || "unknown"));
		if (!(typeof name === "string")) throw new Error("typeof name === \"string\" error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
		return {
			type: "ModuleImport",
			module: module2,
			name,
			descr
		};
	}
	function moduleExportDescr(exportType, id) {
		return {
			type: "ModuleExportDescr",
			exportType,
			id
		};
	}
	function moduleExport(name, descr) {
		if (!(typeof name === "string")) throw new Error("typeof name === \"string\" error: " + ("Argument name must be of type string, given: " + _typeof(name) || "unknown"));
		return {
			type: "ModuleExport",
			name,
			descr
		};
	}
	function limit(min, max, shared) {
		if (!(typeof min === "number")) throw new Error("typeof min === \"number\" error: " + ("Argument min must be of type number, given: " + _typeof(min) || "unknown"));
		if (max !== null && max !== void 0) {
			if (!(typeof max === "number")) throw new Error("typeof max === \"number\" error: " + ("Argument max must be of type number, given: " + _typeof(max) || "unknown"));
		}
		if (shared !== null && shared !== void 0) {
			if (!(typeof shared === "boolean")) throw new Error("typeof shared === \"boolean\" error: " + ("Argument shared must be of type boolean, given: " + _typeof(shared) || "unknown"));
		}
		var node = {
			type: "Limit",
			min
		};
		if (typeof max !== "undefined") node.max = max;
		if (shared === true) node.shared = true;
		return node;
	}
	function signature(params, results) {
		if (!(_typeof(params) === "object" && typeof params.length !== "undefined")) throw new Error("typeof params === \"object\" && typeof params.length !== \"undefined\" error: unknown");
		if (!(_typeof(results) === "object" && typeof results.length !== "undefined")) throw new Error("typeof results === \"object\" && typeof results.length !== \"undefined\" error: unknown");
		return {
			type: "Signature",
			params,
			results
		};
	}
	function program(body) {
		if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) throw new Error("typeof body === \"object\" && typeof body.length !== \"undefined\" error: unknown");
		return {
			type: "Program",
			body
		};
	}
	function identifier(value, raw$1) {
		if (!(typeof value === "string")) throw new Error("typeof value === \"string\" error: " + ("Argument value must be of type string, given: " + _typeof(value) || "unknown"));
		if (raw$1 !== null && raw$1 !== void 0) {
			if (!(typeof raw$1 === "string")) throw new Error("typeof raw === \"string\" error: " + ("Argument raw must be of type string, given: " + _typeof(raw$1) || "unknown"));
		}
		var node = {
			type: "Identifier",
			value
		};
		if (typeof raw$1 !== "undefined") node.raw = raw$1;
		return node;
	}
	function blockInstruction(label, instr2, result) {
		if (!(_typeof(instr2) === "object" && typeof instr2.length !== "undefined")) throw new Error("typeof instr === \"object\" && typeof instr.length !== \"undefined\" error: unknown");
		return {
			type: "BlockInstruction",
			id: "block",
			label,
			instr: instr2,
			result
		};
	}
	function callInstruction(index, instrArgs, numeric) {
		if (instrArgs !== null && instrArgs !== void 0) {
			if (!(_typeof(instrArgs) === "object" && typeof instrArgs.length !== "undefined")) throw new Error("typeof instrArgs === \"object\" && typeof instrArgs.length !== \"undefined\" error: unknown");
		}
		var node = {
			type: "CallInstruction",
			id: "call",
			index
		};
		if (typeof instrArgs !== "undefined" && instrArgs.length > 0) node.instrArgs = instrArgs;
		if (typeof numeric !== "undefined") node.numeric = numeric;
		return node;
	}
	function callIndirectInstruction(signature2, intrs) {
		if (intrs !== null && intrs !== void 0) {
			if (!(_typeof(intrs) === "object" && typeof intrs.length !== "undefined")) throw new Error("typeof intrs === \"object\" && typeof intrs.length !== \"undefined\" error: unknown");
		}
		var node = {
			type: "CallIndirectInstruction",
			id: "call_indirect",
			signature: signature2
		};
		if (typeof intrs !== "undefined" && intrs.length > 0) node.intrs = intrs;
		return node;
	}
	function byteArray(values) {
		if (!(_typeof(values) === "object" && typeof values.length !== "undefined")) throw new Error("typeof values === \"object\" && typeof values.length !== \"undefined\" error: unknown");
		return {
			type: "ByteArray",
			values
		};
	}
	function func(name, signature2, body, isExternal, metadata) {
		if (!(_typeof(body) === "object" && typeof body.length !== "undefined")) throw new Error("typeof body === \"object\" && typeof body.length !== \"undefined\" error: unknown");
		if (isExternal !== null && isExternal !== void 0) {
			if (!(typeof isExternal === "boolean")) throw new Error("typeof isExternal === \"boolean\" error: " + ("Argument isExternal must be of type boolean, given: " + _typeof(isExternal) || "unknown"));
		}
		var node = {
			type: "Func",
			name,
			signature: signature2,
			body
		};
		if (isExternal === true) node.isExternal = true;
		if (typeof metadata !== "undefined") node.metadata = metadata;
		return node;
	}
	function internalBrUnless(target) {
		if (!(typeof target === "number")) throw new Error("typeof target === \"number\" error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
		return {
			type: "InternalBrUnless",
			target
		};
	}
	function internalGoto(target) {
		if (!(typeof target === "number")) throw new Error("typeof target === \"number\" error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
		return {
			type: "InternalGoto",
			target
		};
	}
	function internalCallExtern(target) {
		if (!(typeof target === "number")) throw new Error("typeof target === \"number\" error: " + ("Argument target must be of type number, given: " + _typeof(target) || "unknown"));
		return {
			type: "InternalCallExtern",
			target
		};
	}
	function internalEndAndReturn() {
		return { type: "InternalEndAndReturn" };
	}
	var isModule = isTypeOf("Module");
	exports.isModule = isModule;
	var isModuleMetadata = isTypeOf("ModuleMetadata");
	exports.isModuleMetadata = isModuleMetadata;
	var isModuleNameMetadata = isTypeOf("ModuleNameMetadata");
	exports.isModuleNameMetadata = isModuleNameMetadata;
	var isFunctionNameMetadata = isTypeOf("FunctionNameMetadata");
	exports.isFunctionNameMetadata = isFunctionNameMetadata;
	var isLocalNameMetadata = isTypeOf("LocalNameMetadata");
	exports.isLocalNameMetadata = isLocalNameMetadata;
	var isBinaryModule = isTypeOf("BinaryModule");
	exports.isBinaryModule = isBinaryModule;
	var isQuoteModule = isTypeOf("QuoteModule");
	exports.isQuoteModule = isQuoteModule;
	var isSectionMetadata = isTypeOf("SectionMetadata");
	exports.isSectionMetadata = isSectionMetadata;
	var isProducersSectionMetadata = isTypeOf("ProducersSectionMetadata");
	exports.isProducersSectionMetadata = isProducersSectionMetadata;
	var isProducerMetadata = isTypeOf("ProducerMetadata");
	exports.isProducerMetadata = isProducerMetadata;
	var isProducerMetadataVersionedName = isTypeOf("ProducerMetadataVersionedName");
	exports.isProducerMetadataVersionedName = isProducerMetadataVersionedName;
	var isLoopInstruction = isTypeOf("LoopInstruction");
	exports.isLoopInstruction = isLoopInstruction;
	var isInstr = isTypeOf("Instr");
	exports.isInstr = isInstr;
	var isIfInstruction = isTypeOf("IfInstruction");
	exports.isIfInstruction = isIfInstruction;
	var isStringLiteral = isTypeOf("StringLiteral");
	exports.isStringLiteral = isStringLiteral;
	var isNumberLiteral = isTypeOf("NumberLiteral");
	exports.isNumberLiteral = isNumberLiteral;
	var isLongNumberLiteral = isTypeOf("LongNumberLiteral");
	exports.isLongNumberLiteral = isLongNumberLiteral;
	var isFloatLiteral = isTypeOf("FloatLiteral");
	exports.isFloatLiteral = isFloatLiteral;
	var isElem = isTypeOf("Elem");
	exports.isElem = isElem;
	var isIndexInFuncSection = isTypeOf("IndexInFuncSection");
	exports.isIndexInFuncSection = isIndexInFuncSection;
	var isValtypeLiteral = isTypeOf("ValtypeLiteral");
	exports.isValtypeLiteral = isValtypeLiteral;
	var isTypeInstruction = isTypeOf("TypeInstruction");
	exports.isTypeInstruction = isTypeInstruction;
	var isStart = isTypeOf("Start");
	exports.isStart = isStart;
	var isGlobalType = isTypeOf("GlobalType");
	exports.isGlobalType = isGlobalType;
	var isLeadingComment = isTypeOf("LeadingComment");
	exports.isLeadingComment = isLeadingComment;
	var isBlockComment = isTypeOf("BlockComment");
	exports.isBlockComment = isBlockComment;
	var isData = isTypeOf("Data");
	exports.isData = isData;
	var isGlobal = isTypeOf("Global");
	exports.isGlobal = isGlobal;
	var isTable = isTypeOf("Table");
	exports.isTable = isTable;
	var isMemory = isTypeOf("Memory");
	exports.isMemory = isMemory;
	var isFuncImportDescr = isTypeOf("FuncImportDescr");
	exports.isFuncImportDescr = isFuncImportDescr;
	var isModuleImport = isTypeOf("ModuleImport");
	exports.isModuleImport = isModuleImport;
	var isModuleExportDescr = isTypeOf("ModuleExportDescr");
	exports.isModuleExportDescr = isModuleExportDescr;
	var isModuleExport = isTypeOf("ModuleExport");
	exports.isModuleExport = isModuleExport;
	var isLimit = isTypeOf("Limit");
	exports.isLimit = isLimit;
	var isSignature = isTypeOf("Signature");
	exports.isSignature = isSignature;
	var isProgram = isTypeOf("Program");
	exports.isProgram = isProgram;
	var isIdentifier = isTypeOf("Identifier");
	exports.isIdentifier = isIdentifier;
	var isBlockInstruction = isTypeOf("BlockInstruction");
	exports.isBlockInstruction = isBlockInstruction;
	var isCallInstruction = isTypeOf("CallInstruction");
	exports.isCallInstruction = isCallInstruction;
	var isCallIndirectInstruction = isTypeOf("CallIndirectInstruction");
	exports.isCallIndirectInstruction = isCallIndirectInstruction;
	var isByteArray = isTypeOf("ByteArray");
	exports.isByteArray = isByteArray;
	var isFunc = isTypeOf("Func");
	exports.isFunc = isFunc;
	var isInternalBrUnless = isTypeOf("InternalBrUnless");
	exports.isInternalBrUnless = isInternalBrUnless;
	var isInternalGoto = isTypeOf("InternalGoto");
	exports.isInternalGoto = isInternalGoto;
	var isInternalCallExtern = isTypeOf("InternalCallExtern");
	exports.isInternalCallExtern = isInternalCallExtern;
	var isInternalEndAndReturn = isTypeOf("InternalEndAndReturn");
	exports.isInternalEndAndReturn = isInternalEndAndReturn;
	exports.isNode = function isNode2(node) {
		return isModule(node) || isModuleMetadata(node) || isModuleNameMetadata(node) || isFunctionNameMetadata(node) || isLocalNameMetadata(node) || isBinaryModule(node) || isQuoteModule(node) || isSectionMetadata(node) || isProducersSectionMetadata(node) || isProducerMetadata(node) || isProducerMetadataVersionedName(node) || isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isElem(node) || isIndexInFuncSection(node) || isValtypeLiteral(node) || isTypeInstruction(node) || isStart(node) || isGlobalType(node) || isLeadingComment(node) || isBlockComment(node) || isData(node) || isGlobal(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node) || isModuleImport(node) || isModuleExportDescr(node) || isModuleExport(node) || isLimit(node) || isSignature(node) || isProgram(node) || isIdentifier(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node) || isByteArray(node) || isFunc(node) || isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
	};
	exports.isBlock = function isBlock2(node) {
		return isLoopInstruction(node) || isBlockInstruction(node) || isFunc(node);
	};
	exports.isInstruction = function isInstruction2(node) {
		return isLoopInstruction(node) || isInstr(node) || isIfInstruction(node) || isTypeInstruction(node) || isBlockInstruction(node) || isCallInstruction(node) || isCallIndirectInstruction(node);
	};
	exports.isExpression = function isExpression2(node) {
		return isInstr(node) || isStringLiteral(node) || isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node) || isValtypeLiteral(node) || isIdentifier(node);
	};
	exports.isNumericLiteral = function isNumericLiteral2(node) {
		return isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node);
	};
	exports.isImportDescr = function isImportDescr2(node) {
		return isGlobalType(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node);
	};
	exports.isIntrinsic = function isIntrinsic2(node) {
		return isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
	};
	exports.assertModule = assertTypeOf("Module");
	exports.assertModuleMetadata = assertTypeOf("ModuleMetadata");
	exports.assertModuleNameMetadata = assertTypeOf("ModuleNameMetadata");
	exports.assertFunctionNameMetadata = assertTypeOf("FunctionNameMetadata");
	exports.assertLocalNameMetadata = assertTypeOf("LocalNameMetadata");
	exports.assertBinaryModule = assertTypeOf("BinaryModule");
	exports.assertQuoteModule = assertTypeOf("QuoteModule");
	exports.assertSectionMetadata = assertTypeOf("SectionMetadata");
	exports.assertProducersSectionMetadata = assertTypeOf("ProducersSectionMetadata");
	exports.assertProducerMetadata = assertTypeOf("ProducerMetadata");
	exports.assertProducerMetadataVersionedName = assertTypeOf("ProducerMetadataVersionedName");
	exports.assertLoopInstruction = assertTypeOf("LoopInstruction");
	exports.assertInstr = assertTypeOf("Instr");
	exports.assertIfInstruction = assertTypeOf("IfInstruction");
	exports.assertStringLiteral = assertTypeOf("StringLiteral");
	exports.assertNumberLiteral = assertTypeOf("NumberLiteral");
	exports.assertLongNumberLiteral = assertTypeOf("LongNumberLiteral");
	exports.assertFloatLiteral = assertTypeOf("FloatLiteral");
	exports.assertElem = assertTypeOf("Elem");
	exports.assertIndexInFuncSection = assertTypeOf("IndexInFuncSection");
	exports.assertValtypeLiteral = assertTypeOf("ValtypeLiteral");
	exports.assertTypeInstruction = assertTypeOf("TypeInstruction");
	exports.assertStart = assertTypeOf("Start");
	exports.assertGlobalType = assertTypeOf("GlobalType");
	exports.assertLeadingComment = assertTypeOf("LeadingComment");
	exports.assertBlockComment = assertTypeOf("BlockComment");
	exports.assertData = assertTypeOf("Data");
	exports.assertGlobal = assertTypeOf("Global");
	exports.assertTable = assertTypeOf("Table");
	exports.assertMemory = assertTypeOf("Memory");
	exports.assertFuncImportDescr = assertTypeOf("FuncImportDescr");
	exports.assertModuleImport = assertTypeOf("ModuleImport");
	exports.assertModuleExportDescr = assertTypeOf("ModuleExportDescr");
	exports.assertModuleExport = assertTypeOf("ModuleExport");
	exports.assertLimit = assertTypeOf("Limit");
	exports.assertSignature = assertTypeOf("Signature");
	exports.assertProgram = assertTypeOf("Program");
	exports.assertIdentifier = assertTypeOf("Identifier");
	exports.assertBlockInstruction = assertTypeOf("BlockInstruction");
	exports.assertCallInstruction = assertTypeOf("CallInstruction");
	exports.assertCallIndirectInstruction = assertTypeOf("CallIndirectInstruction");
	exports.assertByteArray = assertTypeOf("ByteArray");
	exports.assertFunc = assertTypeOf("Func");
	exports.assertInternalBrUnless = assertTypeOf("InternalBrUnless");
	exports.assertInternalGoto = assertTypeOf("InternalGoto");
	exports.assertInternalCallExtern = assertTypeOf("InternalCallExtern");
	exports.assertInternalEndAndReturn = assertTypeOf("InternalEndAndReturn");
	exports.unionTypesMap = {
		Module: ["Node"],
		ModuleMetadata: ["Node"],
		ModuleNameMetadata: ["Node"],
		FunctionNameMetadata: ["Node"],
		LocalNameMetadata: ["Node"],
		BinaryModule: ["Node"],
		QuoteModule: ["Node"],
		SectionMetadata: ["Node"],
		ProducersSectionMetadata: ["Node"],
		ProducerMetadata: ["Node"],
		ProducerMetadataVersionedName: ["Node"],
		LoopInstruction: [
			"Node",
			"Block",
			"Instruction"
		],
		Instr: [
			"Node",
			"Expression",
			"Instruction"
		],
		IfInstruction: ["Node", "Instruction"],
		StringLiteral: ["Node", "Expression"],
		NumberLiteral: [
			"Node",
			"NumericLiteral",
			"Expression"
		],
		LongNumberLiteral: [
			"Node",
			"NumericLiteral",
			"Expression"
		],
		FloatLiteral: [
			"Node",
			"NumericLiteral",
			"Expression"
		],
		Elem: ["Node"],
		IndexInFuncSection: ["Node"],
		ValtypeLiteral: ["Node", "Expression"],
		TypeInstruction: ["Node", "Instruction"],
		Start: ["Node"],
		GlobalType: ["Node", "ImportDescr"],
		LeadingComment: ["Node"],
		BlockComment: ["Node"],
		Data: ["Node"],
		Global: ["Node"],
		Table: ["Node", "ImportDescr"],
		Memory: ["Node", "ImportDescr"],
		FuncImportDescr: ["Node", "ImportDescr"],
		ModuleImport: ["Node"],
		ModuleExportDescr: ["Node"],
		ModuleExport: ["Node"],
		Limit: ["Node"],
		Signature: ["Node"],
		Program: ["Node"],
		Identifier: ["Node", "Expression"],
		BlockInstruction: [
			"Node",
			"Block",
			"Instruction"
		],
		CallInstruction: ["Node", "Instruction"],
		CallIndirectInstruction: ["Node", "Instruction"],
		ByteArray: ["Node"],
		Func: ["Node", "Block"],
		InternalBrUnless: ["Node", "Intrinsic"],
		InternalGoto: ["Node", "Intrinsic"],
		InternalCallExtern: ["Node", "Intrinsic"],
		InternalEndAndReturn: ["Node", "Intrinsic"]
	};
	exports.nodeAndUnionTypes = [
		"Module",
		"ModuleMetadata",
		"ModuleNameMetadata",
		"FunctionNameMetadata",
		"LocalNameMetadata",
		"BinaryModule",
		"QuoteModule",
		"SectionMetadata",
		"ProducersSectionMetadata",
		"ProducerMetadata",
		"ProducerMetadataVersionedName",
		"LoopInstruction",
		"Instr",
		"IfInstruction",
		"StringLiteral",
		"NumberLiteral",
		"LongNumberLiteral",
		"FloatLiteral",
		"Elem",
		"IndexInFuncSection",
		"ValtypeLiteral",
		"TypeInstruction",
		"Start",
		"GlobalType",
		"LeadingComment",
		"BlockComment",
		"Data",
		"Global",
		"Table",
		"Memory",
		"FuncImportDescr",
		"ModuleImport",
		"ModuleExportDescr",
		"ModuleExport",
		"Limit",
		"Signature",
		"Program",
		"Identifier",
		"BlockInstruction",
		"CallInstruction",
		"CallIndirectInstruction",
		"ByteArray",
		"Func",
		"InternalBrUnless",
		"InternalGoto",
		"InternalCallExtern",
		"InternalEndAndReturn",
		"Node",
		"Block",
		"Instruction",
		"Expression",
		"NumericLiteral",
		"ImportDescr",
		"Intrinsic"
	];
} });
var require_long = __commonJS({ "node_modules/.pnpm/@xtuc+long@4.2.2/node_modules/@xtuc/long/src/long.js"(exports, module) {
	module.exports = Long;
	var wasm = null;
	try {
		wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
			0,
			97,
			115,
			109,
			1,
			0,
			0,
			0,
			1,
			13,
			2,
			96,
			0,
			1,
			127,
			96,
			4,
			127,
			127,
			127,
			127,
			1,
			127,
			3,
			7,
			6,
			0,
			1,
			1,
			1,
			1,
			1,
			6,
			6,
			1,
			127,
			1,
			65,
			0,
			11,
			7,
			50,
			6,
			3,
			109,
			117,
			108,
			0,
			1,
			5,
			100,
			105,
			118,
			95,
			115,
			0,
			2,
			5,
			100,
			105,
			118,
			95,
			117,
			0,
			3,
			5,
			114,
			101,
			109,
			95,
			115,
			0,
			4,
			5,
			114,
			101,
			109,
			95,
			117,
			0,
			5,
			8,
			103,
			101,
			116,
			95,
			104,
			105,
			103,
			104,
			0,
			0,
			10,
			191,
			1,
			6,
			4,
			0,
			35,
			0,
			11,
			36,
			1,
			1,
			126,
			32,
			0,
			173,
			32,
			1,
			173,
			66,
			32,
			134,
			132,
			32,
			2,
			173,
			32,
			3,
			173,
			66,
			32,
			134,
			132,
			126,
			34,
			4,
			66,
			32,
			135,
			167,
			36,
			0,
			32,
			4,
			167,
			11,
			36,
			1,
			1,
			126,
			32,
			0,
			173,
			32,
			1,
			173,
			66,
			32,
			134,
			132,
			32,
			2,
			173,
			32,
			3,
			173,
			66,
			32,
			134,
			132,
			127,
			34,
			4,
			66,
			32,
			135,
			167,
			36,
			0,
			32,
			4,
			167,
			11,
			36,
			1,
			1,
			126,
			32,
			0,
			173,
			32,
			1,
			173,
			66,
			32,
			134,
			132,
			32,
			2,
			173,
			32,
			3,
			173,
			66,
			32,
			134,
			132,
			128,
			34,
			4,
			66,
			32,
			135,
			167,
			36,
			0,
			32,
			4,
			167,
			11,
			36,
			1,
			1,
			126,
			32,
			0,
			173,
			32,
			1,
			173,
			66,
			32,
			134,
			132,
			32,
			2,
			173,
			32,
			3,
			173,
			66,
			32,
			134,
			132,
			129,
			34,
			4,
			66,
			32,
			135,
			167,
			36,
			0,
			32,
			4,
			167,
			11,
			36,
			1,
			1,
			126,
			32,
			0,
			173,
			32,
			1,
			173,
			66,
			32,
			134,
			132,
			32,
			2,
			173,
			32,
			3,
			173,
			66,
			32,
			134,
			132,
			130,
			34,
			4,
			66,
			32,
			135,
			167,
			36,
			0,
			32,
			4,
			167,
			11
		])), {}).exports;
	} catch (e) {}
	function Long(low, high, unsigned) {
		this.low = low | 0;
		this.high = high | 0;
		this.unsigned = !!unsigned;
	}
	Long.prototype.__isLong__;
	Object.defineProperty(Long.prototype, "__isLong__", { value: true });
	function isLong(obj) {
		return (obj && obj["__isLong__"]) === true;
	}
	Long.isLong = isLong;
	var INT_CACHE = {};
	var UINT_CACHE = {};
	function fromInt(value, unsigned) {
		var obj, cachedObj, cache$2;
		if (unsigned) {
			value >>>= 0;
			if (cache$2 = 0 <= value && value < 256) {
				cachedObj = UINT_CACHE[value];
				if (cachedObj) return cachedObj;
			}
			obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
			if (cache$2) UINT_CACHE[value] = obj;
			return obj;
		} else {
			value |= 0;
			if (cache$2 = -128 <= value && value < 128) {
				cachedObj = INT_CACHE[value];
				if (cachedObj) return cachedObj;
			}
			obj = fromBits(value, value < 0 ? -1 : 0, false);
			if (cache$2) INT_CACHE[value] = obj;
			return obj;
		}
	}
	Long.fromInt = fromInt;
	function fromNumber(value, unsigned) {
		if (isNaN(value)) return unsigned ? UZERO : ZERO;
		if (unsigned) {
			if (value < 0) return UZERO;
			if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
		} else {
			if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
			if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
		}
		if (value < 0) return fromNumber(-value, unsigned).neg();
		return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
	}
	Long.fromNumber = fromNumber;
	function fromBits(lowBits, highBits, unsigned) {
		return new Long(lowBits, highBits, unsigned);
	}
	Long.fromBits = fromBits;
	var pow_dbl = Math.pow;
	function fromString(str, unsigned, radix) {
		if (str.length === 0) throw Error("empty string");
		if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return ZERO;
		if (typeof unsigned === "number") radix = unsigned, unsigned = false;
		else unsigned = !!unsigned;
		radix = radix || 10;
		if (radix < 2 || 36 < radix) throw RangeError("radix");
		var p$1;
		if ((p$1 = str.indexOf("-")) > 0) throw Error("interior hyphen");
		else if (p$1 === 0) return fromString(str.substring(1), unsigned, radix).neg();
		var radixToPower = fromNumber(pow_dbl(radix, 8));
		var result = ZERO;
		for (var i$2 = 0; i$2 < str.length; i$2 += 8) {
			var size = Math.min(8, str.length - i$2), value = parseInt(str.substring(i$2, i$2 + size), radix);
			if (size < 8) {
				var power = fromNumber(pow_dbl(radix, size));
				result = result.mul(power).add(fromNumber(value));
			} else {
				result = result.mul(radixToPower);
				result = result.add(fromNumber(value));
			}
		}
		result.unsigned = unsigned;
		return result;
	}
	Long.fromString = fromString;
	function fromValue(val, unsigned) {
		if (typeof val === "number") return fromNumber(val, unsigned);
		if (typeof val === "string") return fromString(val, unsigned);
		return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
	}
	Long.fromValue = fromValue;
	var TWO_PWR_16_DBL = 65536;
	var TWO_PWR_24_DBL = 1 << 24;
	var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
	var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
	var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
	var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
	var ZERO = fromInt(0);
	Long.ZERO = ZERO;
	var UZERO = fromInt(0, true);
	Long.UZERO = UZERO;
	var ONE = fromInt(1);
	Long.ONE = ONE;
	var UONE = fromInt(1, true);
	Long.UONE = UONE;
	var NEG_ONE = fromInt(-1);
	Long.NEG_ONE = NEG_ONE;
	var MAX_VALUE = fromBits(-1, 2147483647, false);
	Long.MAX_VALUE = MAX_VALUE;
	var MAX_UNSIGNED_VALUE = fromBits(-1, -1, true);
	Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
	var MIN_VALUE = fromBits(0, -2147483648, false);
	Long.MIN_VALUE = MIN_VALUE;
	var LongPrototype = Long.prototype;
	LongPrototype.toInt = function toInt() {
		return this.unsigned ? this.low >>> 0 : this.low;
	};
	LongPrototype.toNumber = function toNumber() {
		if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
		return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
	};
	LongPrototype.toString = function toString$2(radix) {
		radix = radix || 10;
		if (radix < 2 || 36 < radix) throw RangeError("radix");
		if (this.isZero()) return "0";
		if (this.isNegative()) if (this.eq(MIN_VALUE)) {
			var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
			return div.toString(radix) + rem1.toInt().toString(radix);
		} else return "-" + this.neg().toString(radix);
		var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
		var result = "";
		while (true) {
			var remDiv = rem.div(radixToPower), digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
			rem = remDiv;
			if (rem.isZero()) return digits + result;
			else {
				while (digits.length < 6) digits = "0" + digits;
				result = "" + digits + result;
			}
		}
	};
	LongPrototype.getHighBits = function getHighBits() {
		return this.high;
	};
	LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
		return this.high >>> 0;
	};
	LongPrototype.getLowBits = function getLowBits() {
		return this.low;
	};
	LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
		return this.low >>> 0;
	};
	LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
		if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
		var val = this.high != 0 ? this.high : this.low;
		for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
		return this.high != 0 ? bit + 33 : bit + 1;
	};
	LongPrototype.isZero = function isZero() {
		return this.high === 0 && this.low === 0;
	};
	LongPrototype.eqz = LongPrototype.isZero;
	LongPrototype.isNegative = function isNegative() {
		return !this.unsigned && this.high < 0;
	};
	LongPrototype.isPositive = function isPositive() {
		return this.unsigned || this.high >= 0;
	};
	LongPrototype.isOdd = function isOdd() {
		return (this.low & 1) === 1;
	};
	LongPrototype.isEven = function isEven() {
		return (this.low & 1) === 0;
	};
	LongPrototype.equals = function equals(other) {
		if (!isLong(other)) other = fromValue(other);
		if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
		return this.high === other.high && this.low === other.low;
	};
	LongPrototype.eq = LongPrototype.equals;
	LongPrototype.notEquals = function notEquals(other) {
		return !this.eq(other);
	};
	LongPrototype.neq = LongPrototype.notEquals;
	LongPrototype.ne = LongPrototype.notEquals;
	LongPrototype.lessThan = function lessThan(other) {
		return this.comp(other) < 0;
	};
	LongPrototype.lt = LongPrototype.lessThan;
	LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
		return this.comp(other) <= 0;
	};
	LongPrototype.lte = LongPrototype.lessThanOrEqual;
	LongPrototype.le = LongPrototype.lessThanOrEqual;
	LongPrototype.greaterThan = function greaterThan(other) {
		return this.comp(other) > 0;
	};
	LongPrototype.gt = LongPrototype.greaterThan;
	LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
		return this.comp(other) >= 0;
	};
	LongPrototype.gte = LongPrototype.greaterThanOrEqual;
	LongPrototype.ge = LongPrototype.greaterThanOrEqual;
	LongPrototype.compare = function compare(other) {
		if (!isLong(other)) other = fromValue(other);
		if (this.eq(other)) return 0;
		var thisNeg = this.isNegative(), otherNeg = other.isNegative();
		if (thisNeg && !otherNeg) return -1;
		if (!thisNeg && otherNeg) return 1;
		if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
		return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
	};
	LongPrototype.comp = LongPrototype.compare;
	LongPrototype.negate = function negate() {
		if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
		return this.not().add(ONE);
	};
	LongPrototype.neg = LongPrototype.negate;
	LongPrototype.add = function add(addend) {
		if (!isLong(addend)) addend = fromValue(addend);
		var a48 = this.high >>> 16;
		var a32 = this.high & 65535;
		var a16 = this.low >>> 16;
		var a00 = this.low & 65535;
		var b48 = addend.high >>> 16;
		var b32 = addend.high & 65535;
		var b16 = addend.low >>> 16;
		var b00 = addend.low & 65535;
		var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
		c00 += a00 + b00;
		c16 += c00 >>> 16;
		c00 &= 65535;
		c16 += a16 + b16;
		c32 += c16 >>> 16;
		c16 &= 65535;
		c32 += a32 + b32;
		c48 += c32 >>> 16;
		c32 &= 65535;
		c48 += a48 + b48;
		c48 &= 65535;
		return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
	};
	LongPrototype.subtract = function subtract(subtrahend) {
		if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
		return this.add(subtrahend.neg());
	};
	LongPrototype.sub = LongPrototype.subtract;
	LongPrototype.multiply = function multiply(multiplier) {
		if (this.isZero()) return ZERO;
		if (!isLong(multiplier)) multiplier = fromValue(multiplier);
		if (wasm) return fromBits(wasm["mul"](this.low, this.high, multiplier.low, multiplier.high), wasm["get_high"](), this.unsigned);
		if (multiplier.isZero()) return ZERO;
		if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
		if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
		if (this.isNegative()) if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
		else return this.neg().mul(multiplier).neg();
		else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
		if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
		var a48 = this.high >>> 16;
		var a32 = this.high & 65535;
		var a16 = this.low >>> 16;
		var a00 = this.low & 65535;
		var b48 = multiplier.high >>> 16;
		var b32 = multiplier.high & 65535;
		var b16 = multiplier.low >>> 16;
		var b00 = multiplier.low & 65535;
		var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
		c00 += a00 * b00;
		c16 += c00 >>> 16;
		c00 &= 65535;
		c16 += a16 * b00;
		c32 += c16 >>> 16;
		c16 &= 65535;
		c16 += a00 * b16;
		c32 += c16 >>> 16;
		c16 &= 65535;
		c32 += a32 * b00;
		c48 += c32 >>> 16;
		c32 &= 65535;
		c32 += a16 * b16;
		c48 += c32 >>> 16;
		c32 &= 65535;
		c32 += a00 * b32;
		c48 += c32 >>> 16;
		c32 &= 65535;
		c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
		c48 &= 65535;
		return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
	};
	LongPrototype.mul = LongPrototype.multiply;
	LongPrototype.divide = function divide(divisor) {
		if (!isLong(divisor)) divisor = fromValue(divisor);
		if (divisor.isZero()) throw Error("division by zero");
		if (wasm) {
			if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) return this;
			return fromBits((this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
		}
		if (this.isZero()) return this.unsigned ? UZERO : ZERO;
		var approx, rem, res;
		if (!this.unsigned) {
			if (this.eq(MIN_VALUE)) if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE;
			else if (divisor.eq(MIN_VALUE)) return ONE;
			else {
				approx = this.shr(1).div(divisor).shl(1);
				if (approx.eq(ZERO)) return divisor.isNegative() ? ONE : NEG_ONE;
				else {
					rem = this.sub(divisor.mul(approx));
					res = approx.add(rem.div(divisor));
					return res;
				}
			}
			else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
			if (this.isNegative()) {
				if (divisor.isNegative()) return this.neg().div(divisor.neg());
				return this.neg().div(divisor).neg();
			} else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
			res = ZERO;
		} else {
			if (!divisor.unsigned) divisor = divisor.toUnsigned();
			if (divisor.gt(this)) return UZERO;
			if (divisor.gt(this.shru(1))) return UONE;
			res = UZERO;
		}
		rem = this;
		while (rem.gte(divisor)) {
			approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
			var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
			while (approxRem.isNegative() || approxRem.gt(rem)) {
				approx -= delta;
				approxRes = fromNumber(approx, this.unsigned);
				approxRem = approxRes.mul(divisor);
			}
			if (approxRes.isZero()) approxRes = ONE;
			res = res.add(approxRes);
			rem = rem.sub(approxRem);
		}
		return res;
	};
	LongPrototype.div = LongPrototype.divide;
	LongPrototype.modulo = function modulo(divisor) {
		if (!isLong(divisor)) divisor = fromValue(divisor);
		if (wasm) return fromBits((this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
		return this.sub(this.div(divisor).mul(divisor));
	};
	LongPrototype.mod = LongPrototype.modulo;
	LongPrototype.rem = LongPrototype.modulo;
	LongPrototype.not = function not() {
		return fromBits(~this.low, ~this.high, this.unsigned);
	};
	LongPrototype.and = function and(other) {
		if (!isLong(other)) other = fromValue(other);
		return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
	};
	LongPrototype.or = function or(other) {
		if (!isLong(other)) other = fromValue(other);
		return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
	};
	LongPrototype.xor = function xor(other) {
		if (!isLong(other)) other = fromValue(other);
		return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
	};
	LongPrototype.shiftLeft = function shiftLeft(numBits) {
		if (isLong(numBits)) numBits = numBits.toInt();
		if ((numBits &= 63) === 0) return this;
		else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
		else return fromBits(0, this.low << numBits - 32, this.unsigned);
	};
	LongPrototype.shl = LongPrototype.shiftLeft;
	LongPrototype.shiftRight = function shiftRight(numBits) {
		if (isLong(numBits)) numBits = numBits.toInt();
		if ((numBits &= 63) === 0) return this;
		else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
		else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
	};
	LongPrototype.shr = LongPrototype.shiftRight;
	LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
		if (isLong(numBits)) numBits = numBits.toInt();
		if ((numBits &= 63) === 0) return this;
		if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
		if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
		return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
	};
	LongPrototype.shru = LongPrototype.shiftRightUnsigned;
	LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
	LongPrototype.rotateLeft = function rotateLeft(numBits) {
		var b$2;
		if (isLong(numBits)) numBits = numBits.toInt();
		if ((numBits &= 63) === 0) return this;
		if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
		if (numBits < 32) {
			b$2 = 32 - numBits;
			return fromBits(this.low << numBits | this.high >>> b$2, this.high << numBits | this.low >>> b$2, this.unsigned);
		}
		numBits -= 32;
		b$2 = 32 - numBits;
		return fromBits(this.high << numBits | this.low >>> b$2, this.low << numBits | this.high >>> b$2, this.unsigned);
	};
	LongPrototype.rotl = LongPrototype.rotateLeft;
	LongPrototype.rotateRight = function rotateRight(numBits) {
		var b$2;
		if (isLong(numBits)) numBits = numBits.toInt();
		if ((numBits &= 63) === 0) return this;
		if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
		if (numBits < 32) {
			b$2 = 32 - numBits;
			return fromBits(this.high << b$2 | this.low >>> numBits, this.low << b$2 | this.high >>> numBits, this.unsigned);
		}
		numBits -= 32;
		b$2 = 32 - numBits;
		return fromBits(this.low << b$2 | this.high >>> numBits, this.high << b$2 | this.low >>> numBits, this.unsigned);
	};
	LongPrototype.rotr = LongPrototype.rotateRight;
	LongPrototype.toSigned = function toSigned() {
		if (!this.unsigned) return this;
		return fromBits(this.low, this.high, false);
	};
	LongPrototype.toUnsigned = function toUnsigned() {
		if (this.unsigned) return this;
		return fromBits(this.low, this.high, true);
	};
	LongPrototype.toBytes = function toBytes(le) {
		return le ? this.toBytesLE() : this.toBytesBE();
	};
	LongPrototype.toBytesLE = function toBytesLE() {
		var hi = this.high, lo = this.low;
		return [
			lo & 255,
			lo >>> 8 & 255,
			lo >>> 16 & 255,
			lo >>> 24,
			hi & 255,
			hi >>> 8 & 255,
			hi >>> 16 & 255,
			hi >>> 24
		];
	};
	LongPrototype.toBytesBE = function toBytesBE() {
		var hi = this.high, lo = this.low;
		return [
			hi >>> 24,
			hi >>> 16 & 255,
			hi >>> 8 & 255,
			hi & 255,
			lo >>> 24,
			lo >>> 16 & 255,
			lo >>> 8 & 255,
			lo & 255
		];
	};
	Long.fromBytes = function fromBytes(bytes, unsigned, le) {
		return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
	};
	Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
		return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
	};
	Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
		return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
	};
} });
var require_lib4 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+floating-point-hex-parser@1.13.2/node_modules/@webassemblyjs/floating-point-hex-parser/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = parse$2;
	function parse$2(input) {
		input = input.toUpperCase();
		var splitIndex = input.indexOf("P");
		var mantissa, exponent;
		if (splitIndex !== -1) {
			mantissa = input.substring(0, splitIndex);
			exponent = parseInt(input.substring(splitIndex + 1));
		} else {
			mantissa = input;
			exponent = 0;
		}
		var dotIndex = mantissa.indexOf(".");
		if (dotIndex !== -1) {
			var integerPart = parseInt(mantissa.substring(0, dotIndex), 16);
			var sign = Math.sign(integerPart);
			integerPart = sign * integerPart;
			var fractionLength = mantissa.length - dotIndex - 1;
			var fractionalPart = parseInt(mantissa.substring(dotIndex + 1), 16);
			var fraction = fractionLength > 0 ? fractionalPart / Math.pow(16, fractionLength) : 0;
			if (sign === 0) if (fraction === 0) mantissa = sign;
			else if (Object.is(sign, -0)) mantissa = -fraction;
			else mantissa = fraction;
			else mantissa = sign * (integerPart + fraction);
		} else mantissa = parseInt(mantissa, 16);
		return mantissa * (splitIndex !== -1 ? Math.pow(2, exponent) : 1);
	}
} });
var require_lib5 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+helper-numbers@1.13.2/node_modules/@webassemblyjs/helper-numbers/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parse32F = parse32F;
	exports.parse64F = parse64F;
	exports.parse32I = parse32I;
	exports.parseU32 = parseU32;
	exports.parse64I = parse64I;
	exports.isInfLiteral = isInfLiteral;
	exports.isNanLiteral = isNanLiteral;
	var _long2 = _interopRequireDefault(require_long());
	var _floatingPointHexParser = _interopRequireDefault(require_lib4());
	var _helperApiError = require_lib();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	function parse32F(sourceString) {
		if (isHexLiteral(sourceString)) return (0, _floatingPointHexParser["default"])(sourceString);
		if (isInfLiteral(sourceString)) return sourceString[0] === "-" ? -1 : 1;
		if (isNanLiteral(sourceString)) return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 4194304);
		return parseFloat(sourceString);
	}
	function parse64F(sourceString) {
		if (isHexLiteral(sourceString)) return (0, _floatingPointHexParser["default"])(sourceString);
		if (isInfLiteral(sourceString)) return sourceString[0] === "-" ? -1 : 1;
		if (isNanLiteral(sourceString)) return (sourceString[0] === "-" ? -1 : 1) * (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 0x8000000000000);
		if (isHexLiteral(sourceString)) return (0, _floatingPointHexParser["default"])(sourceString);
		return parseFloat(sourceString);
	}
	function parse32I(sourceString) {
		var value = 0;
		if (isHexLiteral(sourceString)) value = ~~parseInt(sourceString, 16);
		else if (isDecimalExponentLiteral(sourceString)) throw new Error("This number literal format is yet to be implemented.");
		else value = parseInt(sourceString, 10);
		return value;
	}
	function parseU32(sourceString) {
		var value = parse32I(sourceString);
		if (value < 0) throw new _helperApiError.CompileError("Illegal value for u32: " + sourceString);
		return value;
	}
	function parse64I(sourceString) {
		var _long;
		if (isHexLiteral(sourceString)) _long = _long2["default"].fromString(sourceString, false, 16);
		else if (isDecimalExponentLiteral(sourceString)) throw new Error("This number literal format is yet to be implemented.");
		else _long = _long2["default"].fromString(sourceString);
		return {
			high: _long.high,
			low: _long.low
		};
	}
	var NAN_WORD = /^\+?-?nan/;
	var INF_WORD = /^\+?-?inf/;
	function isInfLiteral(sourceString) {
		return INF_WORD.test(sourceString.toLowerCase());
	}
	function isNanLiteral(sourceString) {
		return NAN_WORD.test(sourceString.toLowerCase());
	}
	function isDecimalExponentLiteral(sourceString) {
		return !isHexLiteral(sourceString) && sourceString.toUpperCase().includes("E");
	}
	function isHexLiteral(sourceString) {
		return sourceString.substring(0, 2).toUpperCase() === "0X" || sourceString.substring(0, 3).toUpperCase() === "-0X";
	}
} });
var require_node_helpers = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/node-helpers.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.numberLiteralFromRaw = numberLiteralFromRaw;
	exports.instruction = instruction;
	exports.objectInstruction = objectInstruction;
	exports.withLoc = withLoc;
	exports.withRaw = withRaw;
	exports.funcParam = funcParam;
	exports.indexLiteral = indexLiteral;
	exports.memIndexLiteral = memIndexLiteral;
	var _helperNumbers = require_lib5();
	var _nodes = require_nodes();
	function numberLiteralFromRaw(rawValue) {
		var instructionType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "i32";
		var original = rawValue;
		if (typeof rawValue === "string") rawValue = rawValue.replace(/_/g, "");
		if (typeof rawValue === "number") return (0, _nodes.numberLiteral)(rawValue, String(original));
		else switch (instructionType) {
			case "i32": return (0, _nodes.numberLiteral)((0, _helperNumbers.parse32I)(rawValue), String(original));
			case "u32": return (0, _nodes.numberLiteral)((0, _helperNumbers.parseU32)(rawValue), String(original));
			case "i64": return (0, _nodes.longNumberLiteral)((0, _helperNumbers.parse64I)(rawValue), String(original));
			case "f32": return (0, _nodes.floatLiteral)((0, _helperNumbers.parse32F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
			default: return (0, _nodes.floatLiteral)((0, _helperNumbers.parse64F)(rawValue), (0, _helperNumbers.isNanLiteral)(rawValue), (0, _helperNumbers.isInfLiteral)(rawValue), String(original));
		}
	}
	function instruction(id) {
		var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
		var namedArgs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		return (0, _nodes.instr)(id, void 0, args, namedArgs);
	}
	function objectInstruction(id, object) {
		var args = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
		var namedArgs = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		return (0, _nodes.instr)(id, object, args, namedArgs);
	}
	function withLoc(n$2, end, start) {
		n$2.loc = {
			start,
			end
		};
		return n$2;
	}
	function withRaw(n$2, raw$1) {
		n$2.raw = raw$1;
		return n$2;
	}
	function funcParam(valtype, id) {
		return {
			id,
			valtype
		};
	}
	function indexLiteral(value) {
		return numberLiteralFromRaw(value, "u32");
	}
	function memIndexLiteral(value) {
		return numberLiteralFromRaw(value, "u32");
	}
} });
var require_node_path = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/node-path.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createPath = createPath;
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread(target) {
		for (var i$2 = 1; i$2 < arguments.length; i$2++) {
			var source = arguments[i$2] != null ? arguments[i$2] : {};
			if (i$2 % 2) ownKeys(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function findParent(_ref, cb) {
		var parentPath = _ref.parentPath;
		if (parentPath == null) throw new Error("node is root");
		var currentPath = parentPath;
		while (cb(currentPath) !== false) {
			if (currentPath.parentPath == null) return null;
			currentPath = currentPath.parentPath;
		}
		return currentPath.node;
	}
	function insertBefore(context, newNode) {
		return insert(context, newNode);
	}
	function insertAfter(context, newNode) {
		return insert(context, newNode, 1);
	}
	function insert(_ref2, newNode) {
		var node = _ref2.node, inList = _ref2.inList, parentPath = _ref2.parentPath, parentKey = _ref2.parentKey;
		var indexOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
		if (!inList) throw new Error("inList error: insert can only be used for nodes that are within lists");
		if (!(parentPath != null)) throw new Error("parentPath != null error: Can not remove root node");
		var parentList = parentPath.node[parentKey];
		var indexInList = parentList.findIndex(function(n$2) {
			return n$2 === node;
		});
		parentList.splice(indexInList + indexOffset, 0, newNode);
	}
	function remove(_ref3) {
		var node = _ref3.node, parentKey = _ref3.parentKey, parentPath = _ref3.parentPath;
		if (!(parentPath != null)) throw new Error("parentPath != null error: Can not remove root node");
		var parentNode = parentPath.node;
		var parentProperty = parentNode[parentKey];
		if (Array.isArray(parentProperty)) parentNode[parentKey] = parentProperty.filter(function(n$2) {
			return n$2 !== node;
		});
		else delete parentNode[parentKey];
		node._deleted = true;
	}
	function stop(context) {
		context.shouldStop = true;
	}
	function replaceWith(context, newNode) {
		var parentNode = context.parentPath.node;
		var parentProperty = parentNode[context.parentKey];
		if (Array.isArray(parentProperty)) {
			var indexInList = parentProperty.findIndex(function(n$2) {
				return n$2 === context.node;
			});
			parentProperty.splice(indexInList, 1, newNode);
		} else parentNode[context.parentKey] = newNode;
		context.node._deleted = true;
		context.node = newNode;
	}
	function bindNodeOperations(operations, context) {
		var keys = Object.keys(operations);
		var boundOperations = {};
		keys.forEach(function(key) {
			boundOperations[key] = operations[key].bind(null, context);
		});
		return boundOperations;
	}
	function createPathOperations(context) {
		return bindNodeOperations({
			findParent,
			replaceWith,
			remove,
			insertBefore,
			insertAfter,
			stop
		}, context);
	}
	function createPath(context) {
		var path$2 = _objectSpread({}, context);
		Object.assign(path$2, createPathOperations(path$2));
		return path$2;
	}
} });
var require_traverse = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/traverse.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.traverse = traverse;
	var _nodePath = require_node_path();
	var _nodes = require_nodes();
	function walk$1(context, callback$1) {
		var stop = false;
		function innerWalk(context2, callback2) {
			if (stop) return;
			var node = context2.node;
			if (node === void 0) {
				console.warn("traversing with an empty context");
				return;
			}
			if (node._deleted === true) return;
			var path$2 = (0, _nodePath.createPath)(context2);
			callback2(node.type, path$2);
			if (path$2.shouldStop) {
				stop = true;
				return;
			}
			Object.keys(node).forEach(function(prop) {
				var value = node[prop];
				if (value === null || value === void 0) return;
				(Array.isArray(value) ? value : [value]).forEach(function(childNode) {
					if (typeof childNode.type === "string") innerWalk({
						node: childNode,
						parentKey: prop,
						parentPath: path$2,
						shouldStop: false,
						inList: Array.isArray(value)
					}, callback2);
				});
			});
		}
		innerWalk(context, callback$1);
	}
	var noop = function noop2() {};
	function traverse(node, visitors) {
		var before = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : noop;
		var after = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : noop;
		Object.keys(visitors).forEach(function(visitor) {
			if (!_nodes.nodeAndUnionTypes.includes(visitor)) throw new Error("Unexpected visitor ".concat(visitor));
		});
		walk$1({
			node,
			inList: false,
			shouldStop: false,
			parentPath: null,
			parentKey: null
		}, function(type$1, path$2) {
			if (typeof visitors[type$1] === "function") {
				before(type$1, path$2);
				visitors[type$1](path$2);
				after(type$1, path$2);
			}
			var unionTypes = _nodes.unionTypesMap[type$1];
			if (!unionTypes) throw new Error("Unexpected node type ".concat(type$1));
			unionTypes.forEach(function(unionType) {
				if (typeof visitors[unionType] === "function") {
					before(unionType, path$2);
					visitors[unionType](path$2);
					after(unionType, path$2);
				}
			});
		});
	}
} });
var require_signatures = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/signatures.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.signatures = void 0;
	function sign(input, output) {
		return [input, output];
	}
	var u32 = "u32";
	var i32 = "i32";
	var i64 = "i64";
	var f32 = "f32";
	var f64 = "f64";
	var controlInstructions = {
		unreachable: sign([], []),
		nop: sign([], []),
		br: sign([u32], []),
		br_if: sign([u32], []),
		br_table: sign(function vector2(t$1) {
			var vecType = [t$1];
			vecType.vector = true;
			return vecType;
		}(u32), []),
		"return": sign([], []),
		call: sign([u32], []),
		call_indirect: sign([u32], [])
	};
	var parametricInstructions = {
		drop: sign([], []),
		select: sign([], [])
	};
	var variableInstructions = {
		get_local: sign([u32], []),
		set_local: sign([u32], []),
		tee_local: sign([u32], []),
		get_global: sign([u32], []),
		set_global: sign([u32], [])
	};
	var memoryInstructions = {
		"i32.load": sign([u32, u32], [i32]),
		"i64.load": sign([u32, u32], []),
		"f32.load": sign([u32, u32], []),
		"f64.load": sign([u32, u32], []),
		"i32.load8_s": sign([u32, u32], [i32]),
		"i32.load8_u": sign([u32, u32], [i32]),
		"i32.load16_s": sign([u32, u32], [i32]),
		"i32.load16_u": sign([u32, u32], [i32]),
		"i64.load8_s": sign([u32, u32], [i64]),
		"i64.load8_u": sign([u32, u32], [i64]),
		"i64.load16_s": sign([u32, u32], [i64]),
		"i64.load16_u": sign([u32, u32], [i64]),
		"i64.load32_s": sign([u32, u32], [i64]),
		"i64.load32_u": sign([u32, u32], [i64]),
		"i32.store": sign([u32, u32], []),
		"i64.store": sign([u32, u32], []),
		"f32.store": sign([u32, u32], []),
		"f64.store": sign([u32, u32], []),
		"i32.store8": sign([u32, u32], []),
		"i32.store16": sign([u32, u32], []),
		"i64.store8": sign([u32, u32], []),
		"i64.store16": sign([u32, u32], []),
		"i64.store32": sign([u32, u32], []),
		current_memory: sign([], []),
		grow_memory: sign([], [])
	};
	var numericInstructions = {
		"i32.const": sign([i32], [i32]),
		"i64.const": sign([i64], [i64]),
		"f32.const": sign([f32], [f32]),
		"f64.const": sign([f64], [f64]),
		"i32.eqz": sign([i32], [i32]),
		"i32.eq": sign([i32, i32], [i32]),
		"i32.ne": sign([i32, i32], [i32]),
		"i32.lt_s": sign([i32, i32], [i32]),
		"i32.lt_u": sign([i32, i32], [i32]),
		"i32.gt_s": sign([i32, i32], [i32]),
		"i32.gt_u": sign([i32, i32], [i32]),
		"i32.le_s": sign([i32, i32], [i32]),
		"i32.le_u": sign([i32, i32], [i32]),
		"i32.ge_s": sign([i32, i32], [i32]),
		"i32.ge_u": sign([i32, i32], [i32]),
		"i64.eqz": sign([i64], [i64]),
		"i64.eq": sign([i64, i64], [i32]),
		"i64.ne": sign([i64, i64], [i32]),
		"i64.lt_s": sign([i64, i64], [i32]),
		"i64.lt_u": sign([i64, i64], [i32]),
		"i64.gt_s": sign([i64, i64], [i32]),
		"i64.gt_u": sign([i64, i64], [i32]),
		"i64.le_s": sign([i64, i64], [i32]),
		"i64.le_u": sign([i64, i64], [i32]),
		"i64.ge_s": sign([i64, i64], [i32]),
		"i64.ge_u": sign([i64, i64], [i32]),
		"f32.eq": sign([f32, f32], [i32]),
		"f32.ne": sign([f32, f32], [i32]),
		"f32.lt": sign([f32, f32], [i32]),
		"f32.gt": sign([f32, f32], [i32]),
		"f32.le": sign([f32, f32], [i32]),
		"f32.ge": sign([f32, f32], [i32]),
		"f64.eq": sign([f64, f64], [i32]),
		"f64.ne": sign([f64, f64], [i32]),
		"f64.lt": sign([f64, f64], [i32]),
		"f64.gt": sign([f64, f64], [i32]),
		"f64.le": sign([f64, f64], [i32]),
		"f64.ge": sign([f64, f64], [i32]),
		"i32.clz": sign([i32], [i32]),
		"i32.ctz": sign([i32], [i32]),
		"i32.popcnt": sign([i32], [i32]),
		"i32.add": sign([i32, i32], [i32]),
		"i32.sub": sign([i32, i32], [i32]),
		"i32.mul": sign([i32, i32], [i32]),
		"i32.div_s": sign([i32, i32], [i32]),
		"i32.div_u": sign([i32, i32], [i32]),
		"i32.rem_s": sign([i32, i32], [i32]),
		"i32.rem_u": sign([i32, i32], [i32]),
		"i32.and": sign([i32, i32], [i32]),
		"i32.or": sign([i32, i32], [i32]),
		"i32.xor": sign([i32, i32], [i32]),
		"i32.shl": sign([i32, i32], [i32]),
		"i32.shr_s": sign([i32, i32], [i32]),
		"i32.shr_u": sign([i32, i32], [i32]),
		"i32.rotl": sign([i32, i32], [i32]),
		"i32.rotr": sign([i32, i32], [i32]),
		"i64.clz": sign([i64], [i64]),
		"i64.ctz": sign([i64], [i64]),
		"i64.popcnt": sign([i64], [i64]),
		"i64.add": sign([i64, i64], [i64]),
		"i64.sub": sign([i64, i64], [i64]),
		"i64.mul": sign([i64, i64], [i64]),
		"i64.div_s": sign([i64, i64], [i64]),
		"i64.div_u": sign([i64, i64], [i64]),
		"i64.rem_s": sign([i64, i64], [i64]),
		"i64.rem_u": sign([i64, i64], [i64]),
		"i64.and": sign([i64, i64], [i64]),
		"i64.or": sign([i64, i64], [i64]),
		"i64.xor": sign([i64, i64], [i64]),
		"i64.shl": sign([i64, i64], [i64]),
		"i64.shr_s": sign([i64, i64], [i64]),
		"i64.shr_u": sign([i64, i64], [i64]),
		"i64.rotl": sign([i64, i64], [i64]),
		"i64.rotr": sign([i64, i64], [i64]),
		"f32.abs": sign([f32], [f32]),
		"f32.neg": sign([f32], [f32]),
		"f32.ceil": sign([f32], [f32]),
		"f32.floor": sign([f32], [f32]),
		"f32.trunc": sign([f32], [f32]),
		"f32.nearest": sign([f32], [f32]),
		"f32.sqrt": sign([f32], [f32]),
		"f32.add": sign([f32, f32], [f32]),
		"f32.sub": sign([f32, f32], [f32]),
		"f32.mul": sign([f32, f32], [f32]),
		"f32.div": sign([f32, f32], [f32]),
		"f32.min": sign([f32, f32], [f32]),
		"f32.max": sign([f32, f32], [f32]),
		"f32.copysign": sign([f32, f32], [f32]),
		"f64.abs": sign([f64], [f64]),
		"f64.neg": sign([f64], [f64]),
		"f64.ceil": sign([f64], [f64]),
		"f64.floor": sign([f64], [f64]),
		"f64.trunc": sign([f64], [f64]),
		"f64.nearest": sign([f64], [f64]),
		"f64.sqrt": sign([f64], [f64]),
		"f64.add": sign([f64, f64], [f64]),
		"f64.sub": sign([f64, f64], [f64]),
		"f64.mul": sign([f64, f64], [f64]),
		"f64.div": sign([f64, f64], [f64]),
		"f64.min": sign([f64, f64], [f64]),
		"f64.max": sign([f64, f64], [f64]),
		"f64.copysign": sign([f64, f64], [f64]),
		"i32.wrap/i64": sign([i64], [i32]),
		"i32.trunc_s/f32": sign([f32], [i32]),
		"i32.trunc_u/f32": sign([f32], [i32]),
		"i32.trunc_s/f64": sign([f32], [i32]),
		"i32.trunc_u/f64": sign([f64], [i32]),
		"i64.extend_s/i32": sign([i32], [i64]),
		"i64.extend_u/i32": sign([i32], [i64]),
		"i64.trunc_s/f32": sign([f32], [i64]),
		"i64.trunc_u/f32": sign([f32], [i64]),
		"i64.trunc_s/f64": sign([f64], [i64]),
		"i64.trunc_u/f64": sign([f64], [i64]),
		"f32.convert_s/i32": sign([i32], [f32]),
		"f32.convert_u/i32": sign([i32], [f32]),
		"f32.convert_s/i64": sign([i64], [f32]),
		"f32.convert_u/i64": sign([i64], [f32]),
		"f32.demote/f64": sign([f64], [f32]),
		"f64.convert_s/i32": sign([i32], [f64]),
		"f64.convert_u/i32": sign([i32], [f64]),
		"f64.convert_s/i64": sign([i64], [f64]),
		"f64.convert_u/i64": sign([i64], [f64]),
		"f64.promote/f32": sign([f32], [f64]),
		"i32.reinterpret/f32": sign([f32], [i32]),
		"i64.reinterpret/f64": sign([f64], [i64]),
		"f32.reinterpret/i32": sign([i32], [f32]),
		"f64.reinterpret/i64": sign([i64], [f64])
	};
	exports.signatures = Object.assign({}, controlInstructions, parametricInstructions, variableInstructions, memoryInstructions, numericInstructions);
} });
var require_section = __commonJS({ "node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.14.1_patch_hash=339774429611ed34bc80bc6bbe80b2e7a85c850a1f7612f4e8d36151bf486101/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/section.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSectionForNode = getSectionForNode;
	function getSectionForNode(n$2) {
		switch (n$2.type) {
			case "ModuleImport": return "import";
			case "CallInstruction":
			case "CallIndirectInstruction":
			case "Func":
			case "Instr": return "code";
			case "ModuleExport": return "export";
			case "Start": return "start";
			case "TypeInstruction": return "type";
			case "IndexInFuncSection": return "func";
			case "Global": return "global";
			default: return;
		}
	}
} });
var require_lib6 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+helper-wasm-bytecode@1.14.1_patch_hash=339774429611ed34bc80bc6bbe80b2e7a85c850a1f7612f4e8d36151bf486101/node_modules/@webassemblyjs/helper-wasm-bytecode/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "getSectionForNode", {
		enumerable: true,
		get: function get() {
			return _section.getSectionForNode;
		}
	});
	exports["default"] = void 0;
	var _section = require_section();
	var illegalop = "illegal";
	var magicModuleHeader = [
		0,
		97,
		115,
		109
	];
	var moduleVersion = [
		1,
		0,
		0,
		0
	];
	function invertMap(obj) {
		var keyModifierFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function(k$2) {
			return k$2;
		};
		var result = {};
		var keys = Object.keys(obj);
		for (var i$2 = 0, length = keys.length; i$2 < length; i$2++) result[keyModifierFn(obj[keys[i$2]])] = keys[i$2];
		return result;
	}
	function createSymbolObject(name, object) {
		return {
			name,
			object,
			numberOfArgs: arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0
		};
	}
	function createSymbol(name) {
		return {
			name,
			numberOfArgs: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0
		};
	}
	var types$4 = {
		func: 96,
		result: 64
	};
	var exportTypes = {
		0: "Func",
		1: "Table",
		2: "Memory",
		3: "Global"
	};
	var exportTypesByName = invertMap(exportTypes);
	var valtypes = {
		127: "i32",
		126: "i64",
		125: "f32",
		124: "f64",
		123: "v128",
		112: "anyfunc",
		111: "externref"
	};
	var valtypesByString = invertMap(valtypes);
	var tableTypes = {
		112: "anyfunc",
		111: "externref"
	};
	var blockTypes = Object.assign({}, valtypes, {
		64: null,
		127: "i32",
		126: "i64",
		125: "f32",
		124: "f64"
	});
	var globalTypes = {
		0: "const",
		1: "var"
	};
	var globalTypesByString = invertMap(globalTypes);
	var importTypes = {
		0: "func",
		1: "table",
		2: "memory",
		3: "global"
	};
	var sections = {
		custom: 0,
		type: 1,
		"import": 2,
		func: 3,
		table: 4,
		memory: 5,
		global: 6,
		"export": 7,
		start: 8,
		element: 9,
		code: 10,
		data: 11
	};
	var symbolsByByte = {
		0: createSymbol("unreachable"),
		1: createSymbol("nop"),
		2: createSymbol("block"),
		3: createSymbol("loop"),
		4: createSymbol("if"),
		5: createSymbol("else"),
		6: illegalop,
		7: illegalop,
		8: illegalop,
		9: illegalop,
		10: illegalop,
		11: createSymbol("end"),
		12: createSymbol("br", 1),
		13: createSymbol("br_if", 1),
		14: createSymbol("br_table"),
		15: createSymbol("return"),
		16: createSymbol("call", 1),
		17: createSymbol("call_indirect", 2),
		18: illegalop,
		19: illegalop,
		20: illegalop,
		21: illegalop,
		22: illegalop,
		23: illegalop,
		24: illegalop,
		25: illegalop,
		26: createSymbol("drop"),
		27: createSymbol("select"),
		28: illegalop,
		29: illegalop,
		30: illegalop,
		31: illegalop,
		32: createSymbol("get_local", 1),
		33: createSymbol("set_local", 1),
		34: createSymbol("tee_local", 1),
		35: createSymbol("get_global", 1),
		36: createSymbol("set_global", 1),
		37: createSymbol("table.get", 1),
		38: createSymbol("table.set", 1),
		39: illegalop,
		40: createSymbolObject("load", "u32", 1),
		41: createSymbolObject("load", "u64", 1),
		42: createSymbolObject("load", "f32", 1),
		43: createSymbolObject("load", "f64", 1),
		44: createSymbolObject("load8_s", "u32", 1),
		45: createSymbolObject("load8_u", "u32", 1),
		46: createSymbolObject("load16_s", "u32", 1),
		47: createSymbolObject("load16_u", "u32", 1),
		48: createSymbolObject("load8_s", "u64", 1),
		49: createSymbolObject("load8_u", "u64", 1),
		50: createSymbolObject("load16_s", "u64", 1),
		51: createSymbolObject("load16_u", "u64", 1),
		52: createSymbolObject("load32_s", "u64", 1),
		53: createSymbolObject("load32_u", "u64", 1),
		54: createSymbolObject("store", "u32", 1),
		55: createSymbolObject("store", "u64", 1),
		56: createSymbolObject("store", "f32", 1),
		57: createSymbolObject("store", "f64", 1),
		58: createSymbolObject("store8", "u32", 1),
		59: createSymbolObject("store16", "u32", 1),
		60: createSymbolObject("store8", "u64", 1),
		61: createSymbolObject("store16", "u64", 1),
		62: createSymbolObject("store32", "u64", 1),
		63: createSymbolObject("current_memory"),
		64: createSymbolObject("grow_memory"),
		65: createSymbolObject("const", "i32", 1),
		66: createSymbolObject("const", "i64", 1),
		67: createSymbolObject("const", "f32", 1),
		68: createSymbolObject("const", "f64", 1),
		69: createSymbolObject("eqz", "i32"),
		70: createSymbolObject("eq", "i32"),
		71: createSymbolObject("ne", "i32"),
		72: createSymbolObject("lt_s", "i32"),
		73: createSymbolObject("lt_u", "i32"),
		74: createSymbolObject("gt_s", "i32"),
		75: createSymbolObject("gt_u", "i32"),
		76: createSymbolObject("le_s", "i32"),
		77: createSymbolObject("le_u", "i32"),
		78: createSymbolObject("ge_s", "i32"),
		79: createSymbolObject("ge_u", "i32"),
		80: createSymbolObject("eqz", "i64"),
		81: createSymbolObject("eq", "i64"),
		82: createSymbolObject("ne", "i64"),
		83: createSymbolObject("lt_s", "i64"),
		84: createSymbolObject("lt_u", "i64"),
		85: createSymbolObject("gt_s", "i64"),
		86: createSymbolObject("gt_u", "i64"),
		87: createSymbolObject("le_s", "i64"),
		88: createSymbolObject("le_u", "i64"),
		89: createSymbolObject("ge_s", "i64"),
		90: createSymbolObject("ge_u", "i64"),
		91: createSymbolObject("eq", "f32"),
		92: createSymbolObject("ne", "f32"),
		93: createSymbolObject("lt", "f32"),
		94: createSymbolObject("gt", "f32"),
		95: createSymbolObject("le", "f32"),
		96: createSymbolObject("ge", "f32"),
		97: createSymbolObject("eq", "f64"),
		98: createSymbolObject("ne", "f64"),
		99: createSymbolObject("lt", "f64"),
		100: createSymbolObject("gt", "f64"),
		101: createSymbolObject("le", "f64"),
		102: createSymbolObject("ge", "f64"),
		103: createSymbolObject("clz", "i32"),
		104: createSymbolObject("ctz", "i32"),
		105: createSymbolObject("popcnt", "i32"),
		106: createSymbolObject("add", "i32"),
		107: createSymbolObject("sub", "i32"),
		108: createSymbolObject("mul", "i32"),
		109: createSymbolObject("div_s", "i32"),
		110: createSymbolObject("div_u", "i32"),
		111: createSymbolObject("rem_s", "i32"),
		112: createSymbolObject("rem_u", "i32"),
		113: createSymbolObject("and", "i32"),
		114: createSymbolObject("or", "i32"),
		115: createSymbolObject("xor", "i32"),
		116: createSymbolObject("shl", "i32"),
		117: createSymbolObject("shr_s", "i32"),
		118: createSymbolObject("shr_u", "i32"),
		119: createSymbolObject("rotl", "i32"),
		120: createSymbolObject("rotr", "i32"),
		121: createSymbolObject("clz", "i64"),
		122: createSymbolObject("ctz", "i64"),
		123: createSymbolObject("popcnt", "i64"),
		124: createSymbolObject("add", "i64"),
		125: createSymbolObject("sub", "i64"),
		126: createSymbolObject("mul", "i64"),
		127: createSymbolObject("div_s", "i64"),
		128: createSymbolObject("div_u", "i64"),
		129: createSymbolObject("rem_s", "i64"),
		130: createSymbolObject("rem_u", "i64"),
		131: createSymbolObject("and", "i64"),
		132: createSymbolObject("or", "i64"),
		133: createSymbolObject("xor", "i64"),
		134: createSymbolObject("shl", "i64"),
		135: createSymbolObject("shr_s", "i64"),
		136: createSymbolObject("shr_u", "i64"),
		137: createSymbolObject("rotl", "i64"),
		138: createSymbolObject("rotr", "i64"),
		139: createSymbolObject("abs", "f32"),
		140: createSymbolObject("neg", "f32"),
		141: createSymbolObject("ceil", "f32"),
		142: createSymbolObject("floor", "f32"),
		143: createSymbolObject("trunc", "f32"),
		144: createSymbolObject("nearest", "f32"),
		145: createSymbolObject("sqrt", "f32"),
		146: createSymbolObject("add", "f32"),
		147: createSymbolObject("sub", "f32"),
		148: createSymbolObject("mul", "f32"),
		149: createSymbolObject("div", "f32"),
		150: createSymbolObject("min", "f32"),
		151: createSymbolObject("max", "f32"),
		152: createSymbolObject("copysign", "f32"),
		153: createSymbolObject("abs", "f64"),
		154: createSymbolObject("neg", "f64"),
		155: createSymbolObject("ceil", "f64"),
		156: createSymbolObject("floor", "f64"),
		157: createSymbolObject("trunc", "f64"),
		158: createSymbolObject("nearest", "f64"),
		159: createSymbolObject("sqrt", "f64"),
		160: createSymbolObject("add", "f64"),
		161: createSymbolObject("sub", "f64"),
		162: createSymbolObject("mul", "f64"),
		163: createSymbolObject("div", "f64"),
		164: createSymbolObject("min", "f64"),
		165: createSymbolObject("max", "f64"),
		166: createSymbolObject("copysign", "f64"),
		167: createSymbolObject("wrap/i64", "i32"),
		168: createSymbolObject("trunc_s/f32", "i32"),
		169: createSymbolObject("trunc_u/f32", "i32"),
		170: createSymbolObject("trunc_s/f64", "i32"),
		171: createSymbolObject("trunc_u/f64", "i32"),
		172: createSymbolObject("extend_s/i32", "i64"),
		173: createSymbolObject("extend_u/i32", "i64"),
		174: createSymbolObject("trunc_s/f32", "i64"),
		175: createSymbolObject("trunc_u/f32", "i64"),
		176: createSymbolObject("trunc_s/f64", "i64"),
		177: createSymbolObject("trunc_u/f64", "i64"),
		178: createSymbolObject("convert_s/i32", "f32"),
		179: createSymbolObject("convert_u/i32", "f32"),
		180: createSymbolObject("convert_s/i64", "f32"),
		181: createSymbolObject("convert_u/i64", "f32"),
		182: createSymbolObject("demote/f64", "f32"),
		183: createSymbolObject("convert_s/i32", "f64"),
		184: createSymbolObject("convert_u/i32", "f64"),
		185: createSymbolObject("convert_s/i64", "f64"),
		186: createSymbolObject("convert_u/i64", "f64"),
		187: createSymbolObject("promote/f32", "f64"),
		188: createSymbolObject("reinterpret/f32", "i32"),
		189: createSymbolObject("reinterpret/f64", "i64"),
		190: createSymbolObject("reinterpret/i32", "f32"),
		191: createSymbolObject("reinterpret/i64", "f64"),
		192: createSymbolObject("extend8_s", "i32"),
		193: createSymbolObject("extend16_s", "i32"),
		194: createSymbolObject("extend8_s", "i64"),
		195: createSymbolObject("extend16_s", "i64"),
		196: createSymbolObject("extend32_s", "i64"),
		208: createSymbol("ref.null"),
		209: createSymbol("ref.is_null"),
		210: createSymbol("ref.func", 1),
		64522: createSymbol("memory.copy"),
		64523: createSymbol("memory.fill"),
		64524: createSymbol("table.init", 2),
		64525: createSymbol("elem.drop", 1),
		64526: createSymbol("table.copy", 2),
		64527: createSymbol("table.grow", 1),
		64528: createSymbol("table.size", 1),
		64529: createSymbol("table.fill", 1),
		65024: createSymbol("memory.atomic.notify", 1),
		65025: createSymbol("memory.atomic.wait32", 1),
		65026: createSymbol("memory.atomic.wait64", 1),
		65040: createSymbolObject("atomic.load", "i32", 1),
		65041: createSymbolObject("atomic.load", "i64", 1),
		65042: createSymbolObject("atomic.load8_u", "i32", 1),
		65043: createSymbolObject("atomic.load16_u", "i32", 1),
		65044: createSymbolObject("atomic.load8_u", "i64", 1),
		65045: createSymbolObject("atomic.load16_u", "i64", 1),
		65046: createSymbolObject("atomic.load32_u", "i64", 1),
		65047: createSymbolObject("atomic.store", "i32", 1),
		65048: createSymbolObject("atomic.store", "i64", 1),
		65049: createSymbolObject("atomic.store8_u", "i32", 1),
		65050: createSymbolObject("atomic.store16_u", "i32", 1),
		65051: createSymbolObject("atomic.store8_u", "i64", 1),
		65052: createSymbolObject("atomic.store16_u", "i64", 1),
		65053: createSymbolObject("atomic.store32_u", "i64", 1),
		65054: createSymbolObject("atomic.rmw.add", "i32", 1),
		65055: createSymbolObject("atomic.rmw.add", "i64", 1),
		65056: createSymbolObject("atomic.rmw8_u.add_u", "i32", 1),
		65057: createSymbolObject("atomic.rmw16_u.add_u", "i32", 1),
		65058: createSymbolObject("atomic.rmw8_u.add_u", "i64", 1),
		65059: createSymbolObject("atomic.rmw16_u.add_u", "i64", 1),
		65060: createSymbolObject("atomic.rmw32_u.add_u", "i64", 1),
		65061: createSymbolObject("atomic.rmw.sub", "i32", 1),
		65062: createSymbolObject("atomic.rmw.sub", "i64", 1),
		65063: createSymbolObject("atomic.rmw8_u.sub_u", "i32", 1),
		65064: createSymbolObject("atomic.rmw16_u.sub_u", "i32", 1),
		65065: createSymbolObject("atomic.rmw8_u.sub_u", "i64", 1),
		65066: createSymbolObject("atomic.rmw16_u.sub_u", "i64", 1),
		65067: createSymbolObject("atomic.rmw32_u.sub_u", "i64", 1),
		65068: createSymbolObject("atomic.rmw.and", "i32", 1),
		65069: createSymbolObject("atomic.rmw.and", "i64", 1),
		65070: createSymbolObject("atomic.rmw8_u.and_u", "i32", 1),
		65071: createSymbolObject("atomic.rmw16_u.and_u", "i32", 1),
		65072: createSymbolObject("atomic.rmw8_u.and_u", "i64", 1),
		65073: createSymbolObject("atomic.rmw16_u.and_u", "i64", 1),
		65074: createSymbolObject("atomic.rmw32_u.and_u", "i64", 1),
		65075: createSymbolObject("atomic.rmw.or", "i32", 1),
		65076: createSymbolObject("atomic.rmw.or", "i64", 1),
		65077: createSymbolObject("atomic.rmw8_u.or_u", "i32", 1),
		65078: createSymbolObject("atomic.rmw16_u.or_u", "i32", 1),
		65079: createSymbolObject("atomic.rmw8_u.or_u", "i64", 1),
		65080: createSymbolObject("atomic.rmw16_u.or_u", "i64", 1),
		65081: createSymbolObject("atomic.rmw32_u.or_u", "i64", 1),
		65082: createSymbolObject("atomic.rmw.xor", "i32", 1),
		65083: createSymbolObject("atomic.rmw.xor", "i64", 1),
		65084: createSymbolObject("atomic.rmw8_u.xor_u", "i32", 1),
		65085: createSymbolObject("atomic.rmw16_u.xor_u", "i32", 1),
		65086: createSymbolObject("atomic.rmw8_u.xor_u", "i64", 1),
		65087: createSymbolObject("atomic.rmw16_u.xor_u", "i64", 1),
		65088: createSymbolObject("atomic.rmw32_u.xor_u", "i64", 1),
		65089: createSymbolObject("atomic.rmw.xchg", "i32", 1),
		65090: createSymbolObject("atomic.rmw.xchg", "i64", 1),
		65091: createSymbolObject("atomic.rmw8_u.xchg_u", "i32", 1),
		65092: createSymbolObject("atomic.rmw16_u.xchg_u", "i32", 1),
		65093: createSymbolObject("atomic.rmw8_u.xchg_u", "i64", 1),
		65094: createSymbolObject("atomic.rmw16_u.xchg_u", "i64", 1),
		65095: createSymbolObject("atomic.rmw32_u.xchg_u", "i64", 1),
		65096: createSymbolObject("atomic.rmw.cmpxchg", "i32", 1),
		65097: createSymbolObject("atomic.rmw.cmpxchg", "i64", 1),
		65098: createSymbolObject("atomic.rmw8_u.cmpxchg_u", "i32", 1),
		65099: createSymbolObject("atomic.rmw16_u.cmpxchg_u", "i32", 1),
		65100: createSymbolObject("atomic.rmw8_u.cmpxchg_u", "i64", 1),
		65101: createSymbolObject("atomic.rmw16_u.cmpxchg_u", "i64", 1),
		65102: createSymbolObject("atomic.rmw32_u.cmpxchg_u", "i64", 1),
		64519: createSymbolObject("trunc_sat_f64_u", "i64", 0),
		64515: createSymbolObject("trunc_sat_f64_u", "i32", 0),
		64518: createSymbolObject("trunc_sat_f64_s", "i64", 0),
		0: createSymbolObject("unreachable", "void", 0),
		6: createSymbolObject("try", "block", 1),
		7: createSymbolObject("catch", "tag", 1),
		8: createSymbolObject("throw", "tag", 1),
		10: createSymbolObject("throw_ref", "exnref", 0),
		12: createSymbolObject("br", "label", 1),
		24: createSymbolObject("delegate", "label", 1),
		232: illegalop,
		247: illegalop,
		246: illegalop,
		245: illegalop,
		198: illegalop,
		203: illegalop,
		207: illegalop,
		219: illegalop,
		220: illegalop
	};
	exports["default"] = {
		symbolsByByte,
		sections,
		magicModuleHeader,
		moduleVersion,
		types: types$4,
		valtypes,
		exportTypes,
		blockTypes,
		tableTypes,
		globalTypes,
		importTypes,
		valtypesByString,
		globalTypesByString,
		exportTypesByName,
		symbolsByName: invertMap(symbolsByByte, function(obj) {
			if (typeof obj.object === "string") return "".concat(obj.object, ".").concat(obj.name);
			return obj.name;
		})
	};
} });
var require_utils = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/utils.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAnonymous = isAnonymous;
	exports.getSectionMetadata = getSectionMetadata;
	exports.getSectionMetadatas = getSectionMetadatas;
	exports.sortSectionMetadata = sortSectionMetadata;
	exports.orderedInsertNode = orderedInsertNode;
	exports.assertHasLoc = assertHasLoc;
	exports.getEndOfSection = getEndOfSection;
	exports.shiftLoc = shiftLoc;
	exports.shiftSection = shiftSection;
	exports.signatureForOpcode = signatureForOpcode;
	exports.getUniqueNameGenerator = getUniqueNameGenerator;
	exports.getStartByteOffset = getStartByteOffset;
	exports.getEndByteOffset = getEndByteOffset;
	exports.getFunctionBeginingByteOffset = getFunctionBeginingByteOffset;
	exports.getEndBlockByteOffset = getEndBlockByteOffset;
	exports.getStartBlockByteOffset = getStartBlockByteOffset;
	var _signatures = require_signatures();
	var _traverse = require_traverse();
	var _helperWasmBytecode = _interopRequireWildcard(require_lib6());
	function _getRequireWildcardCache(nodeInterop) {
		if (typeof WeakMap !== "function") return null;
		var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
		var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
			return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
		})(nodeInterop);
	}
	function _interopRequireWildcard(obj, nodeInterop) {
		if (!nodeInterop && obj && obj.__esModule) return obj;
		if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") return { "default": obj };
		var cache$2 = _getRequireWildcardCache(nodeInterop);
		if (cache$2 && cache$2.has(obj)) return cache$2.get(obj);
		var newObj = {};
		var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var key in obj) if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
			var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
			if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
			else newObj[key] = obj[key];
		}
		newObj["default"] = obj;
		if (cache$2) cache$2.set(obj, newObj);
		return newObj;
	}
	function _slicedToArray(arr, i$2) {
		return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i$2) || _unsupportedIterableToArray(arr, i$2) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(o$1, minLen) {
		if (!o$1) return;
		if (typeof o$1 === "string") return _arrayLikeToArray(o$1, minLen);
		var n$2 = Object.prototype.toString.call(o$1).slice(8, -1);
		if (n$2 === "Object" && o$1.constructor) n$2 = o$1.constructor.name;
		if (n$2 === "Map" || n$2 === "Set") return Array.from(o$1);
		if (n$2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$2)) return _arrayLikeToArray(o$1, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i$2 = 0, arr2 = new Array(len); i$2 < len; i$2++) arr2[i$2] = arr[i$2];
		return arr2;
	}
	function _iterableToArrayLimit(arr, i$2) {
		var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
		if (_i == null) return;
		var _arr = [];
		var _n = true;
		var _d = false;
		var _s, _e;
		try {
			for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
				_arr.push(_s.value);
				if (i$2 && _arr.length === i$2) break;
			}
		} catch (err) {
			_d = true;
			_e = err;
		} finally {
			try {
				if (!_n && _i["return"] != null) _i["return"]();
			} finally {
				if (_d) throw _e;
			}
		}
		return _arr;
	}
	function _arrayWithHoles(arr) {
		if (Array.isArray(arr)) return arr;
	}
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	function isAnonymous(ident) {
		return ident.raw === "";
	}
	function getSectionMetadata(ast, name) {
		var section;
		(0, _traverse.traverse)(ast, { SectionMetadata: (function(_SectionMetadata) {
			function SectionMetadata(_x) {
				return _SectionMetadata.apply(this, arguments);
			}
			SectionMetadata.toString = function() {
				return _SectionMetadata.toString();
			};
			return SectionMetadata;
		})(function(_ref) {
			var node = _ref.node;
			if (node.section === name) section = node;
		}) });
		return section;
	}
	function getSectionMetadatas(ast, name) {
		var sections = [];
		(0, _traverse.traverse)(ast, { SectionMetadata: (function(_SectionMetadata2) {
			function SectionMetadata(_x2) {
				return _SectionMetadata2.apply(this, arguments);
			}
			SectionMetadata.toString = function() {
				return _SectionMetadata2.toString();
			};
			return SectionMetadata;
		})(function(_ref2) {
			var node = _ref2.node;
			if (node.section === name) sections.push(node);
		}) });
		return sections;
	}
	function sortSectionMetadata(m$3) {
		if (m$3.metadata == null) {
			console.warn("sortSectionMetadata: no metadata to sort");
			return;
		}
		m$3.metadata.sections.sort(function(a$1, b$2) {
			var aId = _helperWasmBytecode["default"].sections[a$1.section];
			var bId = _helperWasmBytecode["default"].sections[b$2.section];
			if (typeof aId !== "number" || typeof bId !== "number") throw new Error("Section id not found");
			return aId - bId;
		});
	}
	function orderedInsertNode(m$3, n$2) {
		assertHasLoc(n$2);
		var didInsert = false;
		if (n$2.type === "ModuleExport") {
			m$3.fields.push(n$2);
			return;
		}
		m$3.fields = m$3.fields.reduce(function(acc, field) {
			var fieldEndCol = Infinity;
			if (field.loc != null) fieldEndCol = field.loc.end.column;
			if (didInsert === false && n$2.loc.start.column < fieldEndCol) {
				didInsert = true;
				acc.push(n$2);
			}
			acc.push(field);
			return acc;
		}, []);
		if (didInsert === false) m$3.fields.push(n$2);
	}
	function assertHasLoc(n$2) {
		if (n$2.loc == null || n$2.loc.start == null || n$2.loc.end == null) throw new Error("Internal failure: node (".concat(JSON.stringify(n$2.type), ") has no location information"));
	}
	function getEndOfSection(s) {
		assertHasLoc(s.size);
		return s.startOffset + s.size.value + (s.size.loc.end.column - s.size.loc.start.column);
	}
	function shiftLoc(node, delta) {
		node.loc.start.column += delta;
		node.loc.end.column += delta;
	}
	function shiftSection(ast, node, delta) {
		if (node.type !== "SectionMetadata") throw new Error("Can not shift node " + JSON.stringify(node.type));
		node.startOffset += delta;
		if (_typeof(node.size.loc) === "object") shiftLoc(node.size, delta);
		if (_typeof(node.vectorOfSize) === "object" && _typeof(node.vectorOfSize.loc) === "object") shiftLoc(node.vectorOfSize, delta);
		var sectionName = node.section;
		(0, _traverse.traverse)(ast, { Node: function Node$1(_ref3) {
			var node2 = _ref3.node;
			if ((0, _helperWasmBytecode.getSectionForNode)(node2) === sectionName && _typeof(node2.loc) === "object") shiftLoc(node2, delta);
		} });
	}
	function signatureForOpcode(object, name) {
		var opcodeName = name;
		if (object !== void 0 && object !== "") opcodeName = object + "." + name;
		var sign = _signatures.signatures[opcodeName];
		if (sign == void 0) return [object, object];
		return sign[0];
	}
	function getUniqueNameGenerator() {
		var inc = {};
		return function() {
			var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "temp";
			if (!(prefix in inc)) inc[prefix] = 0;
			else inc[prefix] = inc[prefix] + 1;
			return prefix + "_" + inc[prefix];
		};
	}
	function getStartByteOffset(n$2) {
		if (typeof n$2.loc === "undefined" || typeof n$2.loc.start === "undefined") throw new Error("Can not get byte offset without loc informations, node: " + String(n$2.id));
		return n$2.loc.start.column;
	}
	function getEndByteOffset(n$2) {
		if (typeof n$2.loc === "undefined" || typeof n$2.loc.end === "undefined") throw new Error("Can not get byte offset without loc informations, node: " + n$2.type);
		return n$2.loc.end.column;
	}
	function getFunctionBeginingByteOffset(n$2) {
		if (!(n$2.body.length > 0)) throw new Error("n.body.length > 0 error: unknown");
		var firstInstruction = _slicedToArray(n$2.body, 1)[0];
		return getStartByteOffset(firstInstruction);
	}
	function getEndBlockByteOffset(n$2) {
		if (!(n$2.instr.length > 0 || n$2.body.length > 0)) throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");
		var lastInstruction;
		if (n$2.instr) lastInstruction = n$2.instr[n$2.instr.length - 1];
		if (n$2.body) lastInstruction = n$2.body[n$2.body.length - 1];
		if (!(_typeof(lastInstruction) === "object")) throw new Error("typeof lastInstruction === \"object\" error: unknown");
		return getStartByteOffset(lastInstruction);
	}
	function getStartBlockByteOffset(n$2) {
		if (!(n$2.instr.length > 0 || n$2.body.length > 0)) throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");
		var fistInstruction;
		if (n$2.instr) fistInstruction = _slicedToArray(n$2.instr, 1)[0];
		if (n$2.body) fistInstruction = _slicedToArray(n$2.body, 1)[0];
		if (!(_typeof(fistInstruction) === "object")) throw new Error("typeof fistInstruction === \"object\" error: unknown");
		return getStartByteOffset(fistInstruction);
	}
} });
var require_clone = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/clone.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.cloneNode = cloneNode;
	function cloneNode(n$2) {
		return Object.assign({}, n$2);
	}
} });
var require_ast_module_to_module_context = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/transform/ast-module-to-module-context/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.moduleContextFromModuleAST = moduleContextFromModuleAST;
	exports.ModuleContext = void 0;
	var _nodes = require_nodes();
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(target, props) {
		for (var i$2 = 0; i$2 < props.length; i$2++) {
			var descriptor = props[i$2];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	function _createClass(Constructor, protoProps, staticProps) {
		if (protoProps) _defineProperties(Constructor.prototype, protoProps);
		if (staticProps) _defineProperties(Constructor, staticProps);
		return Constructor;
	}
	function moduleContextFromModuleAST(m$3) {
		var moduleContext = new ModuleContext();
		if (!(m$3.type === "Module")) throw new Error("m.type === \"Module\" error: unknown");
		m$3.fields.forEach(function(field) {
			switch (field.type) {
				case "Start":
					moduleContext.setStart(field.index);
					break;
				case "TypeInstruction":
					moduleContext.addType(field);
					break;
				case "Func":
					moduleContext.addFunction(field);
					break;
				case "Global":
					moduleContext.defineGlobal(field);
					break;
				case "ModuleImport":
					switch (field.descr.type) {
						case "GlobalType":
							moduleContext.importGlobal(field.descr.valtype, field.descr.mutability);
							break;
						case "Memory":
							moduleContext.addMemory(field.descr.limits.min, field.descr.limits.max);
							break;
						case "FuncImportDescr":
							moduleContext.importFunction(field.descr);
							break;
						case "Table": break;
						default: throw new Error("Unsupported ModuleImport of type " + JSON.stringify(field.descr.type));
					}
					break;
				case "Memory":
					moduleContext.addMemory(field.limits.min, field.limits.max);
					break;
			}
		});
		return moduleContext;
	}
	var ModuleContext = /* @__PURE__ */ (function() {
		function ModuleContext2() {
			_classCallCheck(this, ModuleContext2);
			this.funcs = [];
			this.funcsOffsetByIdentifier = [];
			this.types = [];
			this.globals = [];
			this.globalsOffsetByIdentifier = [];
			this.mems = [];
			this.locals = [];
			this.labels = [];
			this["return"] = [];
			this.debugName = "unknown";
			this.start = null;
		}
		_createClass(ModuleContext2, [
			{
				key: "setStart",
				value: function setStart(index) {
					this.start = index.value;
				}
			},
			{
				key: "getStart",
				value: function getStart() {
					return this.start;
				}
			},
			{
				key: "newContext",
				value: function newContext(debugName, expectedResult) {
					this.locals = [];
					this.labels = [expectedResult];
					this["return"] = expectedResult;
					this.debugName = debugName;
				}
			},
			{
				key: "addFunction",
				value: function addFunction(func) {
					var _ref = func.signature || {}, _ref$params = _ref.params, args = _ref$params === void 0 ? [] : _ref$params, _ref$results = _ref.results, result = _ref$results === void 0 ? [] : _ref$results;
					args = args.map(function(arg) {
						return arg.valtype;
					});
					this.funcs.push({
						args,
						result
					});
					if (typeof func.name !== "undefined") this.funcsOffsetByIdentifier[func.name.value] = this.funcs.length - 1;
				}
			},
			{
				key: "importFunction",
				value: function importFunction(funcimport) {
					if ((0, _nodes.isSignature)(funcimport.signature)) {
						var _funcimport$signature = funcimport.signature, args = _funcimport$signature.params, result = _funcimport$signature.results;
						args = args.map(function(arg) {
							return arg.valtype;
						});
						this.funcs.push({
							args,
							result
						});
					} else {
						if (!(0, _nodes.isNumberLiteral)(funcimport.signature)) throw new Error("isNumberLiteral(funcimport.signature) error: unknown");
						var typeId = funcimport.signature.value;
						if (!this.hasType(typeId)) throw new Error("this.hasType(typeId) error: unknown");
						var signature = this.getType(typeId);
						this.funcs.push({
							args: signature.params.map(function(arg) {
								return arg.valtype;
							}),
							result: signature.results
						});
					}
					if (typeof funcimport.id !== "undefined") this.funcsOffsetByIdentifier[funcimport.id.value] = this.funcs.length - 1;
				}
			},
			{
				key: "hasFunction",
				value: function hasFunction(index) {
					return typeof this.getFunction(index) !== "undefined";
				}
			},
			{
				key: "getFunction",
				value: function getFunction(index) {
					if (typeof index !== "number") throw new Error("getFunction only supported for number index");
					return this.funcs[index];
				}
			},
			{
				key: "getFunctionOffsetByIdentifier",
				value: function getFunctionOffsetByIdentifier(name) {
					if (!(typeof name === "string")) throw new Error("typeof name === \"string\" error: unknown");
					return this.funcsOffsetByIdentifier[name];
				}
			},
			{
				key: "addLabel",
				value: function addLabel(result) {
					this.labels.unshift(result);
				}
			},
			{
				key: "hasLabel",
				value: function hasLabel(index) {
					return this.labels.length > index && index >= 0;
				}
			},
			{
				key: "getLabel",
				value: function getLabel(index) {
					return this.labels[index];
				}
			},
			{
				key: "popLabel",
				value: function popLabel() {
					this.labels.shift();
				}
			},
			{
				key: "hasLocal",
				value: function hasLocal(index) {
					return typeof this.getLocal(index) !== "undefined";
				}
			},
			{
				key: "getLocal",
				value: function getLocal(index) {
					return this.locals[index];
				}
			},
			{
				key: "addLocal",
				value: function addLocal(type$1) {
					this.locals.push(type$1);
				}
			},
			{
				key: "addType",
				value: function addType(type$1) {
					if (!(type$1.functype.type === "Signature")) throw new Error("type.functype.type === \"Signature\" error: unknown");
					this.types.push(type$1.functype);
				}
			},
			{
				key: "hasType",
				value: function hasType(index) {
					return this.types[index] !== void 0;
				}
			},
			{
				key: "getType",
				value: function getType$1(index) {
					return this.types[index];
				}
			},
			{
				key: "hasGlobal",
				value: function hasGlobal(index) {
					return this.globals.length > index && index >= 0;
				}
			},
			{
				key: "getGlobal",
				value: function getGlobal(index) {
					return this.globals[index].type;
				}
			},
			{
				key: "getGlobalOffsetByIdentifier",
				value: function getGlobalOffsetByIdentifier(name) {
					if (!(typeof name === "string")) throw new Error("typeof name === \"string\" error: unknown");
					return this.globalsOffsetByIdentifier[name];
				}
			},
			{
				key: "defineGlobal",
				value: function defineGlobal(global) {
					var type$1 = global.globalType.valtype;
					var mutability = global.globalType.mutability;
					this.globals.push({
						type: type$1,
						mutability
					});
					if (typeof global.name !== "undefined") this.globalsOffsetByIdentifier[global.name.value] = this.globals.length - 1;
				}
			},
			{
				key: "importGlobal",
				value: function importGlobal(type$1, mutability) {
					this.globals.push({
						type: type$1,
						mutability
					});
				}
			},
			{
				key: "isMutableGlobal",
				value: function isMutableGlobal(index) {
					return this.globals[index].mutability === "var";
				}
			},
			{
				key: "isImmutableGlobal",
				value: function isImmutableGlobal(index) {
					return this.globals[index].mutability === "const";
				}
			},
			{
				key: "hasMemory",
				value: function hasMemory(index) {
					return this.mems.length > index && index >= 0;
				}
			},
			{
				key: "addMemory",
				value: function addMemory(min, max) {
					this.mems.push({
						min,
						max
					});
				}
			},
			{
				key: "getMemory",
				value: function getMemory(index) {
					return this.mems[index];
				}
			}
		]);
		return ModuleContext2;
	})();
	exports.ModuleContext = ModuleContext;
} });
var require_lib7 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+ast@1.14.1/node_modules/@webassemblyjs/ast/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var _exportNames = {
		numberLiteralFromRaw: true,
		withLoc: true,
		withRaw: true,
		funcParam: true,
		indexLiteral: true,
		memIndexLiteral: true,
		instruction: true,
		objectInstruction: true,
		traverse: true,
		signatures: true,
		cloneNode: true,
		moduleContextFromModuleAST: true
	};
	Object.defineProperty(exports, "numberLiteralFromRaw", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.numberLiteralFromRaw;
		}
	});
	Object.defineProperty(exports, "withLoc", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.withLoc;
		}
	});
	Object.defineProperty(exports, "withRaw", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.withRaw;
		}
	});
	Object.defineProperty(exports, "funcParam", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.funcParam;
		}
	});
	Object.defineProperty(exports, "indexLiteral", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.indexLiteral;
		}
	});
	Object.defineProperty(exports, "memIndexLiteral", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.memIndexLiteral;
		}
	});
	Object.defineProperty(exports, "instruction", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.instruction;
		}
	});
	Object.defineProperty(exports, "objectInstruction", {
		enumerable: true,
		get: function get() {
			return _nodeHelpers.objectInstruction;
		}
	});
	Object.defineProperty(exports, "traverse", {
		enumerable: true,
		get: function get() {
			return _traverse.traverse;
		}
	});
	Object.defineProperty(exports, "signatures", {
		enumerable: true,
		get: function get() {
			return _signatures.signatures;
		}
	});
	Object.defineProperty(exports, "cloneNode", {
		enumerable: true,
		get: function get() {
			return _clone.cloneNode;
		}
	});
	Object.defineProperty(exports, "moduleContextFromModuleAST", {
		enumerable: true,
		get: function get() {
			return _astModuleToModuleContext.moduleContextFromModuleAST;
		}
	});
	var _nodes = require_nodes();
	Object.keys(_nodes).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _nodes[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function get() {
				return _nodes[key];
			}
		});
	});
	var _nodeHelpers = require_node_helpers();
	var _traverse = require_traverse();
	var _signatures = require_signatures();
	var _utils = require_utils();
	Object.keys(_utils).forEach(function(key) {
		if (key === "default" || key === "__esModule") return;
		if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		if (key in exports && exports[key] === _utils[key]) return;
		Object.defineProperty(exports, key, {
			enumerable: true,
			get: function get() {
				return _utils[key];
			}
		});
	});
	var _clone = require_clone();
	var _astModuleToModuleContext = require_ast_module_to_module_context();
} });
var require_bits = __commonJS({ "node_modules/.pnpm/@webassemblyjs+leb128@1.14.1/node_modules/@webassemblyjs/leb128/lib/bits.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extract = extract;
	exports.inject = inject;
	exports.getSign = getSign;
	exports.highOrder = highOrder;
	function extract(buffer, bitIndex, bitLength, defaultBit) {
		if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");
		if (defaultBit === void 0) defaultBit = 0;
		else if (defaultBit !== 0 && defaultBit !== 1) throw new Error("Bad value for defaultBit.");
		var defaultByte = defaultBit * 255;
		var result = 0;
		var lastBit = bitIndex + bitLength;
		var startByte = Math.floor(bitIndex / 8);
		var startBit = bitIndex % 8;
		var endByte = Math.floor(lastBit / 8);
		var endBit = lastBit % 8;
		if (endBit !== 0) result = get(endByte) & (1 << endBit) - 1;
		while (endByte > startByte) {
			endByte--;
			result = result << 8 | get(endByte);
		}
		result >>>= startBit;
		return result;
		function get(index) {
			var result2 = buffer[index];
			return result2 === void 0 ? defaultByte : result2;
		}
	}
	function inject(buffer, bitIndex, bitLength, value) {
		if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");
		var lastByte = Math.floor((bitIndex + bitLength - 1) / 8);
		if (bitIndex < 0 || lastByte >= buffer.length) throw new Error("Index out of range.");
		var atByte = Math.floor(bitIndex / 8);
		var atBit = bitIndex % 8;
		while (bitLength > 0) {
			if (value & 1) buffer[atByte] |= 1 << atBit;
			else buffer[atByte] &= ~(1 << atBit);
			value >>= 1;
			bitLength--;
			atBit = (atBit + 1) % 8;
			if (atBit === 0) atByte++;
		}
	}
	function getSign(buffer) {
		return buffer[buffer.length - 1] >>> 7;
	}
	function highOrder(bit, buffer) {
		var length = buffer.length;
		var fullyWrongByte = (bit ^ 1) * 255;
		while (length > 0 && buffer[length - 1] === fullyWrongByte) length--;
		if (length === 0) return -1;
		var byteToCheck = buffer[length - 1];
		var result = length * 8 - 1;
		for (var i$2 = 7; i$2 > 0; i$2--) {
			if ((byteToCheck >> i$2 & 1) === bit) break;
			result--;
		}
		return result;
	}
} });
var require_bufs = __commonJS({ "node_modules/.pnpm/@webassemblyjs+leb128@1.14.1/node_modules/@webassemblyjs/leb128/lib/bufs.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.alloc = alloc;
	exports.free = free;
	exports.resize = resize;
	exports.readInt = readInt;
	exports.readUInt = readUInt;
	exports.writeInt64 = writeInt64;
	exports.writeUInt64 = writeUInt64;
	var bufPool = [];
	var TEMP_BUF_MAXIMUM_LENGTH = 20;
	var MIN_EXACT_INT64 = -0x8000000000000000;
	var MAX_EXACT_INT64 = 0x7ffffffffffffc00;
	var MAX_EXACT_UINT64 = 0xfffffffffffff800;
	var BIT_32 = 4294967296;
	var BIT_64 = 0x10000000000000000;
	function lowestBit(num) {
		return num & -num;
	}
	function isLossyToAdd(accum, num) {
		if (num === 0) return false;
		var lowBit = lowestBit(num);
		var added = accum + lowBit;
		if (added === accum) return true;
		if (added - lowBit !== accum) return true;
		return false;
	}
	function alloc(length) {
		var result = bufPool[length];
		if (result) bufPool[length] = void 0;
		else result = new Uint8Array(length);
		result.fill(0);
		return result;
	}
	function free(buffer) {
		var length = buffer.length;
		if (length < TEMP_BUF_MAXIMUM_LENGTH) bufPool[length] = buffer;
	}
	function resize(buffer, length) {
		if (length === buffer.length) return buffer;
		var newBuf = alloc(length);
		for (var i$2 = 0; i$2 <= buffer.length; i$2++) newBuf[i$2] = buffer[i$2];
		free(buffer);
		return newBuf;
	}
	function readInt(buffer) {
		var length = buffer.length;
		var result = buffer[length - 1] < 128 ? 0 : -1;
		var lossy = false;
		if (length < 7) for (var i$2 = length - 1; i$2 >= 0; i$2--) result = result * 256 + buffer[i$2];
		else for (var _i = length - 1; _i >= 0; _i--) {
			var one = buffer[_i];
			result *= 256;
			if (isLossyToAdd(result, one)) lossy = true;
			result += one;
		}
		return {
			value: result,
			lossy
		};
	}
	function readUInt(buffer) {
		var length = buffer.length;
		var result = 0;
		var lossy = false;
		if (length < 7) for (var i$2 = length - 1; i$2 >= 0; i$2--) result = result * 256 + buffer[i$2];
		else for (var _i2 = length - 1; _i2 >= 0; _i2--) {
			var one = buffer[_i2];
			result *= 256;
			if (isLossyToAdd(result, one)) lossy = true;
			result += one;
		}
		return {
			value: result,
			lossy
		};
	}
	function writeInt64(value, buffer) {
		if (value < MIN_EXACT_INT64 || value > MAX_EXACT_INT64) throw new Error("Value out of range.");
		if (value < 0) value += BIT_64;
		writeUInt64(value, buffer);
	}
	function writeUInt64(value, buffer) {
		if (value < 0 || value > MAX_EXACT_UINT64) throw new Error("Value out of range.");
		var lowWord = value % BIT_32;
		var highWord = Math.floor(value / BIT_32);
		buffer[0] = lowWord & 255;
		buffer[1] = lowWord >> 8 & 255;
		buffer[2] = lowWord >> 16 & 255;
		buffer[3] = lowWord >> 24 & 255;
		buffer[4] = highWord & 255;
		buffer[5] = highWord >> 8 & 255;
		buffer[6] = highWord >> 16 & 255;
		buffer[7] = highWord >> 24 & 255;
	}
} });
var require_leb = __commonJS({ "node_modules/.pnpm/@webassemblyjs+leb128@1.14.1/node_modules/@webassemblyjs/leb128/lib/leb.js"(exports) {
	"use strict";
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	var _long = _interopRequireDefault(require_long());
	var bits = _interopRequireWildcard(require_bits());
	var bufs = _interopRequireWildcard(require_bufs());
	function _getRequireWildcardCache(nodeInterop) {
		if (typeof WeakMap !== "function") return null;
		var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
		var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
			return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
		})(nodeInterop);
	}
	function _interopRequireWildcard(obj, nodeInterop) {
		if (!nodeInterop && obj && obj.__esModule) return obj;
		if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") return { "default": obj };
		var cache$2 = _getRequireWildcardCache(nodeInterop);
		if (cache$2 && cache$2.has(obj)) return cache$2.get(obj);
		var newObj = {};
		var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var key in obj) if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
			var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
			if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
			else newObj[key] = obj[key];
		}
		newObj["default"] = obj;
		if (cache$2) cache$2.set(obj, newObj);
		return newObj;
	}
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	var MIN_INT32 = -2147483648;
	var MAX_INT32 = 2147483647;
	var MAX_UINT32 = 4294967295;
	function signedBitCount(buffer) {
		return bits.highOrder(bits.getSign(buffer) ^ 1, buffer) + 2;
	}
	function unsignedBitCount(buffer) {
		var result = bits.highOrder(1, buffer) + 1;
		return result ? result : 1;
	}
	function encodeBufferCommon(buffer, signed) {
		var signBit;
		var bitCount;
		if (signed) {
			signBit = bits.getSign(buffer);
			bitCount = signedBitCount(buffer);
		} else {
			signBit = 0;
			bitCount = unsignedBitCount(buffer);
		}
		var byteCount = Math.ceil(bitCount / 7);
		var result = bufs.alloc(byteCount);
		for (var i$2 = 0; i$2 < byteCount; i$2++) result[i$2] = bits.extract(buffer, i$2 * 7, 7, signBit) | 128;
		result[byteCount - 1] &= 127;
		return result;
	}
	function encodedLength(encodedBuffer, index) {
		var result = 0;
		while (encodedBuffer[index + result] >= 128) result++;
		result++;
		if (index + result > encodedBuffer.length) {}
		return result;
	}
	function decodeBufferCommon(encodedBuffer, index, signed) {
		index = index === void 0 ? 0 : index;
		var length = encodedLength(encodedBuffer, index);
		var bitLength = length * 7;
		var byteLength = Math.ceil(bitLength / 8);
		var result = bufs.alloc(byteLength);
		var outIndex = 0;
		while (length > 0) {
			bits.inject(result, outIndex, 7, encodedBuffer[index]);
			outIndex += 7;
			index++;
			length--;
		}
		var signBit;
		var signByte;
		if (signed) {
			var lastByte = result[byteLength - 1];
			var endBit = outIndex % 8;
			if (endBit !== 0) {
				var shift = 32 - endBit;
				lastByte = result[byteLength - 1] = lastByte << shift >> shift & 255;
			}
			signBit = lastByte >> 7;
			signByte = signBit * 255;
		} else {
			signBit = 0;
			signByte = 0;
		}
		while (byteLength > 1 && result[byteLength - 1] === signByte && (!signed || result[byteLength - 2] >> 7 === signBit)) byteLength--;
		result = bufs.resize(result, byteLength);
		return {
			value: result,
			nextIndex: index
		};
	}
	function encodeIntBuffer(buffer) {
		return encodeBufferCommon(buffer, true);
	}
	function decodeIntBuffer(encodedBuffer, index) {
		return decodeBufferCommon(encodedBuffer, index, true);
	}
	function encodeInt32(num) {
		var buf = new Uint8Array(4);
		buf[0] = num & 255;
		buf[1] = num >> 8 & 255;
		buf[2] = num >> 16 & 255;
		buf[3] = num >> 24 & 255;
		return encodeIntBuffer(buf);
	}
	function decodeInt32(encodedBuffer, index) {
		var result = decodeIntBuffer(encodedBuffer, index);
		var value = bufs.readInt(result.value).value;
		bufs.free(result.value);
		if (value < MIN_INT32 || value > MAX_INT32) throw new Error("integer too large");
		return {
			value,
			nextIndex: result.nextIndex
		};
	}
	function encodeInt64(num) {
		var buf = bufs.alloc(8);
		bufs.writeInt64(num, buf);
		var result = encodeIntBuffer(buf);
		bufs.free(buf);
		return result;
	}
	function decodeInt64(encodedBuffer, index) {
		var result = decodeIntBuffer(encodedBuffer, index);
		var length = result.value.length;
		if (result.value[length - 1] >> 7) {
			result.value = bufs.resize(result.value, 8);
			result.value.fill(255, length);
		}
		var value = _long["default"].fromBytesLE(result.value, false);
		bufs.free(result.value);
		return {
			value,
			nextIndex: result.nextIndex,
			lossy: false
		};
	}
	function encodeUIntBuffer(buffer) {
		return encodeBufferCommon(buffer, false);
	}
	function decodeUIntBuffer(encodedBuffer, index) {
		return decodeBufferCommon(encodedBuffer, index, false);
	}
	function encodeUInt32(num) {
		var buf = new Uint8Array(4);
		buf[0] = num & 255;
		buf[1] = num >> 8 & 255;
		buf[2] = num >> 16 & 255;
		buf[3] = num >> 24 & 255;
		return encodeUIntBuffer(buf);
	}
	function decodeUInt32(encodedBuffer, index) {
		var result = decodeUIntBuffer(encodedBuffer, index);
		var value = bufs.readUInt(result.value).value;
		bufs.free(result.value);
		if (value > MAX_UINT32) throw new Error("integer too large");
		return {
			value,
			nextIndex: result.nextIndex
		};
	}
	function encodeUInt64(num) {
		var buf = bufs.alloc(8);
		bufs.writeUInt64(num, buf);
		var result = encodeUIntBuffer(buf);
		bufs.free(buf);
		return result;
	}
	function decodeUInt64(encodedBuffer, index) {
		var result = decodeUIntBuffer(encodedBuffer, index);
		var value = _long["default"].fromBytesLE(result.value, true);
		bufs.free(result.value);
		return {
			value,
			nextIndex: result.nextIndex,
			lossy: false
		};
	}
	exports["default"] = {
		decodeInt32,
		decodeInt64,
		decodeIntBuffer,
		decodeUInt32,
		decodeUInt64,
		decodeUIntBuffer,
		encodeInt32,
		encodeInt64,
		encodeIntBuffer,
		encodeUInt32,
		encodeUInt64,
		encodeUIntBuffer
	};
} });
var require_lib8 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+leb128@1.14.1/node_modules/@webassemblyjs/leb128/lib/index.js"(exports) {
	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeInt64 = decodeInt64;
	exports.decodeUInt64 = decodeUInt64;
	exports.decodeInt32 = decodeInt32;
	exports.decodeUInt32 = decodeUInt32;
	exports.encodeU32 = encodeU32;
	exports.encodeI32 = encodeI32;
	exports.encodeI64 = encodeI64;
	exports.MAX_NUMBER_OF_BYTE_U64 = exports.MAX_NUMBER_OF_BYTE_U32 = void 0;
	var _leb = _interopRequireDefault(require_leb());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	exports.MAX_NUMBER_OF_BYTE_U32 = 5;
	exports.MAX_NUMBER_OF_BYTE_U64 = 10;
	function decodeInt64(encodedBuffer, index) {
		return _leb["default"].decodeInt64(encodedBuffer, index);
	}
	function decodeUInt64(encodedBuffer, index) {
		return _leb["default"].decodeUInt64(encodedBuffer, index);
	}
	function decodeInt32(encodedBuffer, index) {
		return _leb["default"].decodeInt32(encodedBuffer, index);
	}
	function decodeUInt32(encodedBuffer, index) {
		return _leb["default"].decodeUInt32(encodedBuffer, index);
	}
	function encodeU32(v$3) {
		return _leb["default"].encodeUInt32(v$3);
	}
	function encodeI32(v$3) {
		return _leb["default"].encodeInt32(v$3);
	}
	function encodeI64(v$3) {
		return _leb["default"].encodeInt64(v$3);
	}
} });
var require_decoder2 = __commonJS({ "node_modules/.pnpm/@webassemblyjs+wasm-parser@1.14.1/node_modules/@webassemblyjs/wasm-parser/lib/decoder.js"(exports) {
	"use strict";
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = decode2;
	var _helperApiError = require_lib();
	var ieee754 = _interopRequireWildcard(require_lib2());
	var utf8 = _interopRequireWildcard(require_lib3());
	var t$1 = _interopRequireWildcard(require_lib7());
	var _leb = require_lib8();
	var _helperWasmBytecode = _interopRequireDefault(require_lib6());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	function _getRequireWildcardCache(nodeInterop) {
		if (typeof WeakMap !== "function") return null;
		var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
		var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
			return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
		})(nodeInterop);
	}
	function _interopRequireWildcard(obj, nodeInterop) {
		if (!nodeInterop && obj && obj.__esModule) return obj;
		if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") return { "default": obj };
		var cache$2 = _getRequireWildcardCache(nodeInterop);
		if (cache$2 && cache$2.has(obj)) return cache$2.get(obj);
		var newObj = {};
		var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var key in obj) if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
			var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
			if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
			else newObj[key] = obj[key];
		}
		newObj["default"] = obj;
		if (cache$2) cache$2.set(obj, newObj);
		return newObj;
	}
	function _toConsumableArray(arr) {
		return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}
	function _nonIterableSpread() {
		throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(o$1, minLen) {
		if (!o$1) return;
		if (typeof o$1 === "string") return _arrayLikeToArray(o$1, minLen);
		var n$2 = Object.prototype.toString.call(o$1).slice(8, -1);
		if (n$2 === "Object" && o$1.constructor) n$2 = o$1.constructor.name;
		if (n$2 === "Map" || n$2 === "Set") return Array.from(o$1);
		if (n$2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n$2)) return _arrayLikeToArray(o$1, minLen);
	}
	function _iterableToArray(iter) {
		if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}
	function _arrayWithoutHoles(arr) {
		if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i$2 = 0, arr2 = new Array(len); i$2 < len; i$2++) arr2[i$2] = arr[i$2];
		return arr2;
	}
	function toHex(n$2) {
		return "0x" + Number(n$2).toString(16);
	}
	function byteArrayEq(l$1, r$3) {
		if (l$1.length !== r$3.length) return false;
		for (var i$2 = 0; i$2 < l$1.length; i$2++) if (l$1[i$2] !== r$3[i$2]) return false;
		return true;
	}
	function decode2(ab, opts) {
		var buf = new Uint8Array(ab);
		var getUniqueName = t$1.getUniqueNameGenerator();
		var offset = 0;
		function getPosition() {
			return {
				line: -1,
				column: offset
			};
		}
		function dump(b$2, msg) {
			if (opts.dump === false) return;
			var pad = "										";
			var str = "";
			if (b$2.length < 5) str = b$2.map(toHex).join(" ");
			else str = "...";
			console.log(toHex(offset) + ":	", str, pad, ";", msg);
		}
		function dumpSep(msg) {
			if (opts.dump === false) return;
			console.log(";", msg);
		}
		var state = {
			elementsInFuncSection: [],
			elementsInExportSection: [],
			elementsInCodeSection: [],
			memoriesInModule: [],
			typesInModule: [],
			functionsInModule: [],
			tablesInModule: [],
			globalsInModule: []
		};
		function isEOF() {
			return offset >= buf.length;
		}
		function eatBytes(n$2) {
			offset = offset + n$2;
		}
		function readBytesAtOffset(_offset, numberOfBytes) {
			var arr = [];
			for (var i$2 = 0; i$2 < numberOfBytes; i$2++) arr.push(buf[_offset + i$2]);
			return arr;
		}
		function readBytes(numberOfBytes) {
			return readBytesAtOffset(offset, numberOfBytes);
		}
		function readF64() {
			var bytes = readBytes(ieee754.NUMBER_OF_BYTE_F64);
			var value = ieee754.decodeF64(bytes);
			if (Math.sign(value) * value === Infinity) return {
				value: Math.sign(value),
				inf: true,
				nextIndex: ieee754.NUMBER_OF_BYTE_F64
			};
			if (isNaN(value)) {
				var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1;
				var mantissa = 0;
				for (var i$2 = 0; i$2 < bytes.length - 2; ++i$2) mantissa += bytes[i$2] * Math.pow(256, i$2);
				mantissa += bytes[bytes.length - 2] % 16 * Math.pow(256, bytes.length - 2);
				return {
					value: sign * mantissa,
					nan: true,
					nextIndex: ieee754.NUMBER_OF_BYTE_F64
				};
			}
			return {
				value,
				nextIndex: ieee754.NUMBER_OF_BYTE_F64
			};
		}
		function readF32() {
			var bytes = readBytes(ieee754.NUMBER_OF_BYTE_F32);
			var value = ieee754.decodeF32(bytes);
			if (Math.sign(value) * value === Infinity) return {
				value: Math.sign(value),
				inf: true,
				nextIndex: ieee754.NUMBER_OF_BYTE_F32
			};
			if (isNaN(value)) {
				var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1;
				var mantissa = 0;
				for (var i$2 = 0; i$2 < bytes.length - 2; ++i$2) mantissa += bytes[i$2] * Math.pow(256, i$2);
				mantissa += bytes[bytes.length - 2] % 128 * Math.pow(256, bytes.length - 2);
				return {
					value: sign * mantissa,
					nan: true,
					nextIndex: ieee754.NUMBER_OF_BYTE_F32
				};
			}
			return {
				value,
				nextIndex: ieee754.NUMBER_OF_BYTE_F32
			};
		}
		function readUTF8String() {
			var lenu32 = readU32();
			var strlen = lenu32.value;
			dump([strlen], "string length");
			var bytes = readBytesAtOffset(offset + lenu32.nextIndex, strlen);
			return {
				value: utf8.decode(bytes),
				nextIndex: strlen + lenu32.nextIndex
			};
		}
		function readU32() {
			var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U32);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeUInt32)(buffer);
		}
		function readVaruint32() {
			var bytes = readBytes(4);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeUInt32)(buffer);
		}
		function readVaruint7() {
			var bytes = readBytes(1);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeUInt32)(buffer);
		}
		function read32() {
			var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U32);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeInt32)(buffer);
		}
		function read64() {
			var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U64);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeInt64)(buffer);
		}
		function readU64() {
			var bytes = readBytes(_leb.MAX_NUMBER_OF_BYTE_U64);
			var buffer = new Uint8Array(bytes);
			return (0, _leb.decodeUInt64)(buffer);
		}
		function readByte() {
			return readBytes(1)[0];
		}
		function parseModuleHeader() {
			if (isEOF() === true || offset + 4 > buf.length) throw new Error("unexpected end");
			var header = readBytes(4);
			if (byteArrayEq(_helperWasmBytecode["default"].magicModuleHeader, header) === false) throw new _helperApiError.CompileError("magic header not detected");
			dump(header, "wasm magic header");
			eatBytes(4);
		}
		function parseVersion() {
			if (isEOF() === true || offset + 4 > buf.length) throw new Error("unexpected end");
			var version$3 = readBytes(4);
			if (byteArrayEq(_helperWasmBytecode["default"].moduleVersion, version$3) === false) throw new _helperApiError.CompileError("unknown binary version");
			dump(version$3, "wasm version");
			eatBytes(4);
		}
		function parseVec(cast) {
			var u32 = readU32();
			var length = u32.value;
			eatBytes(u32.nextIndex);
			dump([length], "number");
			if (length === 0) return [];
			var elements = [];
			for (var i$2 = 0; i$2 < length; i$2++) {
				var _byte = readByte();
				eatBytes(1);
				var value = cast(_byte);
				dump([_byte], value);
				if (typeof value === "undefined") throw new _helperApiError.CompileError("Internal failure: parseVec could not cast the value");
				elements.push(value);
			}
			return elements;
		}
		function parseTypeSection(numberOfTypes) {
			var typeInstructionNodes = [];
			dump([numberOfTypes], "num types");
			for (var i$2 = 0; i$2 < numberOfTypes; i$2++) {
				var _startLoc = getPosition();
				dumpSep("type " + i$2);
				var type$1 = readByte();
				eatBytes(1);
				if (type$1 == _helperWasmBytecode["default"].types.func) {
					dump([type$1], "func");
					var params = parseVec(function(b$2) {
						var valtype = _helperWasmBytecode["default"].valtypes[b$2];
						if (valtype === void 0) throw new Error("unexpected value type ".concat(b$2));
						return valtype;
					}).map(function(v$3) {
						return t$1.funcParam(v$3);
					});
					var result = parseVec(function(b$2) {
						return _helperWasmBytecode["default"].valtypes[b$2];
					});
					typeInstructionNodes.push((function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.typeInstruction(void 0, t$1.signature(params, result)), endLoc, _startLoc);
					})());
					state.typesInModule.push({
						params,
						result
					});
				} else throw new Error("Unsupported type: " + toHex(type$1));
			}
			return typeInstructionNodes;
		}
		function parseImportSection(numberOfImports) {
			var imports = [];
			for (var i$2 = 0; i$2 < numberOfImports; i$2++) {
				dumpSep("import header " + i$2);
				var _startLoc2 = getPosition();
				var moduleName = readUTF8String();
				eatBytes(moduleName.nextIndex);
				dump([], "module name (".concat(moduleName.value, ")"));
				var name = readUTF8String();
				eatBytes(name.nextIndex);
				dump([], "name (".concat(name.value, ")"));
				var descrTypeByte = readByte();
				eatBytes(1);
				var descrType = _helperWasmBytecode["default"].importTypes[descrTypeByte];
				dump([descrTypeByte], "import kind");
				if (typeof descrType === "undefined") throw new _helperApiError.CompileError("Unknown import description type: " + toHex(descrTypeByte));
				var importDescr = void 0;
				if (descrType === "func") {
					var indexU32 = readU32();
					var typeindex = indexU32.value;
					eatBytes(indexU32.nextIndex);
					dump([typeindex], "type index");
					var signature = state.typesInModule[typeindex];
					if (typeof signature === "undefined") throw new _helperApiError.CompileError("function signature not found (".concat(typeindex, ")"));
					var id = getUniqueName("func");
					importDescr = t$1.funcImportDescr(id, t$1.signature(signature.params, signature.result));
					state.functionsInModule.push({
						id: t$1.identifier(name.value),
						signature,
						isExternal: true
					});
				} else if (descrType === "global") {
					importDescr = parseGlobalType();
					var globalNode = t$1.global(importDescr, []);
					state.globalsInModule.push(globalNode);
				} else if (descrType === "table") importDescr = parseTableType(i$2);
				else if (descrType === "memory") {
					var memoryNode = parseMemoryType(0);
					state.memoriesInModule.push(memoryNode);
					importDescr = memoryNode;
				} else throw new _helperApiError.CompileError("Unsupported import of type: " + descrType);
				imports.push((function() {
					var endLoc = getPosition();
					return t$1.withLoc(t$1.moduleImport(moduleName.value, name.value, importDescr), endLoc, _startLoc2);
				})());
			}
			return imports;
		}
		function parseFuncSection(numberOfFunctions) {
			dump([numberOfFunctions], "num funcs");
			for (var i$2 = 0; i$2 < numberOfFunctions; i$2++) {
				var indexU32 = readU32();
				var typeindex = indexU32.value;
				eatBytes(indexU32.nextIndex);
				dump([typeindex], "type index");
				var signature = state.typesInModule[typeindex];
				if (typeof signature === "undefined") throw new _helperApiError.CompileError("function signature not found (".concat(typeindex, ")"));
				var id = t$1.withRaw(t$1.identifier(getUniqueName("func")), "");
				state.functionsInModule.push({
					id,
					signature,
					isExternal: false
				});
			}
		}
		function parseExportSection(numberOfExport) {
			dump([numberOfExport], "num exports");
			for (var i$2 = 0; i$2 < numberOfExport; i$2++) {
				var _startLoc3 = getPosition();
				var name = readUTF8String();
				eatBytes(name.nextIndex);
				dump([], "export name (".concat(name.value, ")"));
				var typeIndex = readByte();
				eatBytes(1);
				dump([typeIndex], "export kind");
				var indexu32 = readU32();
				var index = indexu32.value;
				eatBytes(indexu32.nextIndex);
				dump([index], "export index");
				var id = void 0, signature = void 0;
				if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Func") {
					var func = state.functionsInModule[index];
					if (typeof func === "undefined") throw new _helperApiError.CompileError("unknown function (".concat(index, ")"));
					id = t$1.numberLiteralFromRaw(index, String(index));
					signature = func.signature;
				} else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Table") {
					if (typeof state.tablesInModule[index] === "undefined") throw new _helperApiError.CompileError("unknown table ".concat(index));
					id = t$1.numberLiteralFromRaw(index, String(index));
					signature = null;
				} else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Memory") {
					if (typeof state.memoriesInModule[index] === "undefined") throw new _helperApiError.CompileError("unknown memory ".concat(index));
					id = t$1.numberLiteralFromRaw(index, String(index));
					signature = null;
				} else if (_helperWasmBytecode["default"].exportTypes[typeIndex] === "Global") {
					if (typeof state.globalsInModule[index] === "undefined") throw new _helperApiError.CompileError("unknown global ".concat(index));
					id = t$1.numberLiteralFromRaw(index, String(index));
					signature = null;
				} else {
					console.warn("Unsupported export type: " + toHex(typeIndex));
					return;
				}
				var endLoc = getPosition();
				state.elementsInExportSection.push({
					name: name.value,
					type: _helperWasmBytecode["default"].exportTypes[typeIndex],
					signature,
					id,
					index,
					endLoc,
					startLoc: _startLoc3
				});
			}
		}
		function parseCodeSection(numberOfFuncs) {
			dump([numberOfFuncs], "number functions");
			for (var i$2 = 0; i$2 < numberOfFuncs; i$2++) {
				var _startLoc4 = getPosition();
				dumpSep("function body " + i$2);
				var bodySizeU32 = readU32();
				eatBytes(bodySizeU32.nextIndex);
				dump([bodySizeU32.value], "function body size");
				var code = [];
				var funcLocalNumU32 = readU32();
				var funcLocalNum = funcLocalNumU32.value;
				eatBytes(funcLocalNumU32.nextIndex);
				dump([funcLocalNum], "num locals");
				var locals = [];
				for (var _i = 0; _i < funcLocalNum; _i++) {
					var _startLoc5 = getPosition();
					var localCountU32 = readU32();
					var localCount = localCountU32.value;
					eatBytes(localCountU32.nextIndex);
					dump([localCount], "num local");
					var valtypeByte = readByte();
					eatBytes(1);
					var type$1 = _helperWasmBytecode["default"].valtypes[valtypeByte];
					var args = [];
					for (var _i2 = 0; _i2 < localCount; _i2++) args.push(t$1.valtypeLiteral(type$1));
					var localNode = (function() {
						var endLoc2 = getPosition();
						return t$1.withLoc(t$1.instruction("local", args), endLoc2, _startLoc5);
					})();
					locals.push(localNode);
					dump([valtypeByte], type$1);
					if (typeof type$1 === "undefined") throw new _helperApiError.CompileError("Unexpected valtype: " + toHex(valtypeByte));
				}
				code.push.apply(code, locals);
				parseInstructionBlock(code);
				var endLoc = getPosition();
				state.elementsInCodeSection.push({
					code,
					locals,
					endLoc,
					startLoc: _startLoc4,
					bodySize: bodySizeU32.value
				});
			}
		}
		function parseInstructionBlock(code) {
			while (true) {
				var _startLoc6 = getPosition();
				var instructionAlreadyCreated = false;
				var instructionByte = readByte();
				eatBytes(1);
				if (instructionByte === 254) {
					instructionByte = 65024 + readByte();
					eatBytes(1);
				}
				if (instructionByte === 252) {
					instructionByte = 64512 + readByte();
					eatBytes(1);
				}
				var instruction = _helperWasmBytecode["default"].symbolsByByte[instructionByte];
				if (typeof instruction === "undefined") throw new _helperApiError.CompileError("Unexpected instruction: " + toHex(instructionByte));
				if (instruction === "illegal") throw new Error("tried to decode an illegal bytecode: ".concat(toHex(instructionByte)));
				if (typeof instruction.object === "string") dump([instructionByte], "".concat(instruction.object, ".").concat(instruction.name));
				else dump([instructionByte], instruction.name);
				if (instruction.name === "end") {
					var node = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.instruction(instruction.name), endLoc, _startLoc6);
					})();
					code.push(node);
					break;
				}
				var args = [];
				var namedArgs = void 0;
				if (instruction.name === "loop") {
					var _startLoc7 = getPosition();
					var blocktype = parseBlockType();
					var instr = [];
					parseInstructionBlock(instr);
					var label = t$1.withRaw(t$1.identifier(getUniqueName("loop")), "");
					var loopNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.loopInstruction(label, blocktype, instr), endLoc, _startLoc7);
					})();
					code.push(loopNode);
					instructionAlreadyCreated = true;
				} else if (instruction.name === "if") {
					var _startLoc8 = getPosition();
					var _blocktype = parseBlockType();
					var testIndex = t$1.withRaw(t$1.identifier(getUniqueName("if")), "");
					var ifBody = [];
					parseInstructionBlock(ifBody);
					var elseIndex = 0;
					for (elseIndex = 0; elseIndex < ifBody.length; ++elseIndex) {
						var _instr = ifBody[elseIndex];
						if (_instr.type === "Instr" && _instr.id === "else") break;
					}
					var consequentInstr = ifBody.slice(0, elseIndex);
					var alternate = ifBody.slice(elseIndex + 1);
					var testInstrs = [];
					var ifNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.ifInstruction(testIndex, testInstrs, _blocktype, consequentInstr, alternate), endLoc, _startLoc8);
					})();
					code.push(ifNode);
					instructionAlreadyCreated = true;
				} else if (instruction.name === "block") {
					var _startLoc9 = getPosition();
					var _blocktype2 = parseBlockType();
					var _instr2 = [];
					parseInstructionBlock(_instr2);
					var _label = t$1.withRaw(t$1.identifier(getUniqueName("block")), "");
					var blockNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.blockInstruction(_label, _instr2, _blocktype2), endLoc, _startLoc9);
					})();
					code.push(blockNode);
					instructionAlreadyCreated = true;
				} else if (instruction.name === "call") {
					var indexu32 = readU32();
					var index = indexu32.value;
					eatBytes(indexu32.nextIndex);
					dump([index], "index");
					var callNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.callInstruction(t$1.indexLiteral(index)), endLoc, _startLoc6);
					})();
					code.push(callNode);
					instructionAlreadyCreated = true;
				} else if (instruction.name === "call_indirect") {
					var _startLoc10 = getPosition();
					var indexU32 = readU32();
					var typeindex = indexU32.value;
					eatBytes(indexU32.nextIndex);
					dump([typeindex], "type index");
					var signature = state.typesInModule[typeindex];
					if (typeof signature === "undefined") throw new _helperApiError.CompileError("call_indirect signature not found (".concat(typeindex, ")"));
					var _callNode = t$1.callIndirectInstruction(t$1.signature(signature.params, signature.result), []);
					var flagU32 = readU32();
					var flag = flagU32.value;
					eatBytes(flagU32.nextIndex);
					if (flag !== 0) throw new _helperApiError.CompileError("zero flag expected");
					code.push((function() {
						var endLoc = getPosition();
						return t$1.withLoc(_callNode, endLoc, _startLoc10);
					})());
					instructionAlreadyCreated = true;
				} else if (instruction.name === "br_table") {
					var indicesu32 = readU32();
					var indices = indicesu32.value;
					eatBytes(indicesu32.nextIndex);
					dump([indices], "num indices");
					for (var i$2 = 0; i$2 <= indices; i$2++) {
						var _indexu = readU32();
						var _index = _indexu.value;
						eatBytes(_indexu.nextIndex);
						dump([_index], "index");
						args.push(t$1.numberLiteralFromRaw(_indexu.value.toString(), "u32"));
					}
				} else if (instructionByte >= 40 && instructionByte <= 64) if (instruction.name === "grow_memory" || instruction.name === "current_memory") {
					var _indexU = readU32();
					var _index2 = _indexU.value;
					eatBytes(_indexU.nextIndex);
					if (_index2 !== 0) throw new Error("zero flag expected");
					dump([_index2], "index");
				} else {
					var aligun32 = readU32();
					var align = aligun32.value;
					eatBytes(aligun32.nextIndex);
					dump([align], "align");
					var offsetu32 = readU32();
					var _offset2 = offsetu32.value;
					eatBytes(offsetu32.nextIndex);
					dump([_offset2], "offset");
					if (namedArgs === void 0) namedArgs = {};
					namedArgs.offset = t$1.numberLiteralFromRaw(_offset2);
				}
				else if (instructionByte >= 65 && instructionByte <= 68) {
					if (instruction.object === "i32") {
						var value32 = read32();
						var value = value32.value;
						eatBytes(value32.nextIndex);
						dump([value], "i32 value");
						args.push(t$1.numberLiteralFromRaw(value));
					}
					if (instruction.object === "u32") {
						var valueu32 = readU32();
						var _value = valueu32.value;
						eatBytes(valueu32.nextIndex);
						dump([_value], "u32 value");
						args.push(t$1.numberLiteralFromRaw(_value));
					}
					if (instruction.object === "i64") {
						var value64 = read64();
						var _value2 = value64.value;
						eatBytes(value64.nextIndex);
						dump([Number(_value2.toString())], "i64 value");
						var _node = {
							type: "LongNumberLiteral",
							value: {
								high: _value2.high,
								low: _value2.low
							}
						};
						args.push(_node);
					}
					if (instruction.object === "u64") {
						var valueu64 = readU64();
						var _value3 = valueu64.value;
						eatBytes(valueu64.nextIndex);
						dump([Number(_value3.toString())], "u64 value");
						var _node2 = {
							type: "LongNumberLiteral",
							value: {
								high: _value3.high,
								low: _value3.low
							}
						};
						args.push(_node2);
					}
					if (instruction.object === "f32") {
						var valuef32 = readF32();
						var _value4 = valuef32.value;
						eatBytes(valuef32.nextIndex);
						dump([_value4], "f32 value");
						args.push(t$1.floatLiteral(_value4, valuef32.nan, valuef32.inf, String(_value4)));
					}
					if (instruction.object === "f64") {
						var valuef64 = readF64();
						var _value5 = valuef64.value;
						eatBytes(valuef64.nextIndex);
						dump([_value5], "f64 value");
						args.push(t$1.floatLiteral(_value5, valuef64.nan, valuef64.inf, String(_value5)));
					}
				} else if (instructionByte >= 65024 && instructionByte <= 65279) {
					var align32 = readU32();
					var _align = align32.value;
					eatBytes(align32.nextIndex);
					dump([_align], "align");
					var _offsetu = readU32();
					var _offset3 = _offsetu.value;
					eatBytes(_offsetu.nextIndex);
					dump([_offset3], "offset");
				} else for (var _i3 = 0; _i3 < instruction.numberOfArgs; _i3++) {
					var u32 = readU32();
					eatBytes(u32.nextIndex);
					dump([u32.value], "argument " + _i3);
					args.push(t$1.numberLiteralFromRaw(u32.value));
				}
				if (instructionAlreadyCreated === false) if (typeof instruction.object === "string") {
					var _node3 = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.objectInstruction(instruction.name, instruction.object, args, namedArgs), endLoc, _startLoc6);
					})();
					code.push(_node3);
				} else {
					var _node4 = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.instruction(instruction.name, args, namedArgs), endLoc, _startLoc6);
					})();
					code.push(_node4);
				}
			}
		}
		function parseLimits() {
			var limitType = readByte();
			eatBytes(1);
			var shared = limitType === 3;
			dump([limitType], "limit type" + (shared ? " (shared)" : ""));
			var min, max;
			if (limitType === 1 || limitType === 3) {
				var u32min = readU32();
				min = parseInt(u32min.value);
				eatBytes(u32min.nextIndex);
				dump([min], "min");
				var u32max = readU32();
				max = parseInt(u32max.value);
				eatBytes(u32max.nextIndex);
				dump([max], "max");
			}
			if (limitType === 0) {
				var _u32min = readU32();
				min = parseInt(_u32min.value);
				eatBytes(_u32min.nextIndex);
				dump([min], "min");
			}
			return t$1.limit(min, max, shared);
		}
		function parseTableType(index) {
			var name = t$1.withRaw(t$1.identifier(getUniqueName("table")), String(index));
			var elementTypeByte = readByte();
			eatBytes(1);
			dump([elementTypeByte], "element type");
			var elementType = _helperWasmBytecode["default"].tableTypes[elementTypeByte];
			if (typeof elementType === "undefined") throw new _helperApiError.CompileError("Unknown element type in table: " + toHex(elementTypeByte));
			var limits = parseLimits();
			return t$1.table(elementType, limits, name);
		}
		function parseGlobalType() {
			var valtypeByte = readByte();
			eatBytes(1);
			var type$1 = _helperWasmBytecode["default"].valtypes[valtypeByte];
			dump([valtypeByte], type$1);
			if (typeof type$1 === "undefined") throw new _helperApiError.CompileError("Unknown valtype: " + toHex(valtypeByte));
			var globalTypeByte = readByte();
			eatBytes(1);
			var globalType = _helperWasmBytecode["default"].globalTypes[globalTypeByte];
			dump([globalTypeByte], "global type (".concat(globalType, ")"));
			if (typeof globalType === "undefined") throw new _helperApiError.CompileError("Invalid mutability: " + toHex(globalTypeByte));
			return t$1.globalType(type$1, globalType);
		}
		function parseNameSectionFunctions() {
			var functionNames = [];
			var numberOfFunctionsu32 = readU32();
			var numbeOfFunctions = numberOfFunctionsu32.value;
			eatBytes(numberOfFunctionsu32.nextIndex);
			for (var i$2 = 0; i$2 < numbeOfFunctions; i$2++) {
				var indexu32 = readU32();
				var index = indexu32.value;
				eatBytes(indexu32.nextIndex);
				var name = readUTF8String();
				eatBytes(name.nextIndex);
				functionNames.push(t$1.functionNameMetadata(name.value, index));
			}
			return functionNames;
		}
		function parseNameSectionLocals() {
			var localNames = [];
			var numbeOfFunctionsu32 = readU32();
			var numbeOfFunctions = numbeOfFunctionsu32.value;
			eatBytes(numbeOfFunctionsu32.nextIndex);
			for (var i$2 = 0; i$2 < numbeOfFunctions; i$2++) {
				var functionIndexu32 = readU32();
				var functionIndex = functionIndexu32.value;
				eatBytes(functionIndexu32.nextIndex);
				var numLocalsu32 = readU32();
				var numLocals = numLocalsu32.value;
				eatBytes(numLocalsu32.nextIndex);
				for (var _i4 = 0; _i4 < numLocals; _i4++) {
					var localIndexu32 = readU32();
					var localIndex = localIndexu32.value;
					eatBytes(localIndexu32.nextIndex);
					var name = readUTF8String();
					eatBytes(name.nextIndex);
					localNames.push(t$1.localNameMetadata(name.value, localIndex, functionIndex));
				}
			}
			return localNames;
		}
		function parseNameSection(remainingBytes) {
			var nameMetadata = [];
			var initialOffset = offset;
			while (offset - initialOffset < remainingBytes) {
				var sectionTypeByte = readVaruint7();
				eatBytes(sectionTypeByte.nextIndex);
				var subSectionSizeInBytesu32 = readVaruint32();
				eatBytes(subSectionSizeInBytesu32.nextIndex);
				switch (sectionTypeByte.value) {
					case 1:
						nameMetadata.push.apply(nameMetadata, _toConsumableArray(parseNameSectionFunctions()));
						break;
					case 2:
						nameMetadata.push.apply(nameMetadata, _toConsumableArray(parseNameSectionLocals()));
						break;
					default: eatBytes(subSectionSizeInBytesu32.value);
				}
			}
			return nameMetadata;
		}
		function parseProducersSection() {
			var metadata2 = t$1.producersSectionMetadata([]);
			var sectionTypeByte = readVaruint32();
			eatBytes(sectionTypeByte.nextIndex);
			dump([sectionTypeByte.value], "num of producers");
			var fields = {
				language: [],
				"processed-by": [],
				sdk: []
			};
			for (var fieldI = 0; fieldI < sectionTypeByte.value; fieldI++) {
				var fieldName = readUTF8String();
				eatBytes(fieldName.nextIndex);
				var valueCount = readVaruint32();
				eatBytes(valueCount.nextIndex);
				for (var producerI = 0; producerI < valueCount.value; producerI++) {
					var producerName = readUTF8String();
					eatBytes(producerName.nextIndex);
					var producerVersion = readUTF8String();
					eatBytes(producerVersion.nextIndex);
					fields[fieldName.value].push(t$1.producerMetadataVersionedName(producerName.value, producerVersion.value));
				}
				metadata2.producers.push(fields[fieldName.value]);
			}
			return metadata2;
		}
		function parseGlobalSection(numberOfGlobals) {
			var globals = [];
			dump([numberOfGlobals], "num globals");
			for (var i$2 = 0; i$2 < numberOfGlobals; i$2++) {
				var _startLoc11 = getPosition();
				var globalType = parseGlobalType();
				var init = [];
				parseInstructionBlock(init);
				var node = (function() {
					var endLoc = getPosition();
					return t$1.withLoc(t$1.global(globalType, init), endLoc, _startLoc11);
				})();
				globals.push(node);
				state.globalsInModule.push(node);
			}
			return globals;
		}
		function parseElemSection(numberOfElements) {
			var elems = [];
			dump([numberOfElements], "num elements");
			for (var i$2 = 0; i$2 < numberOfElements; i$2++) {
				var _startLoc12 = getPosition();
				var tableindexu32 = readU32();
				var bitfield = tableindexu32.value;
				eatBytes(tableindexu32.nextIndex);
				dump([bitfield], "bitfield");
				if (bitfield === 0) {
					var instr = [];
					parseInstructionBlock(instr);
					var indicesu32 = readU32();
					var indices = indicesu32.value;
					eatBytes(indicesu32.nextIndex);
					dump([indices], "num indices");
					var indexValues = [];
					for (var _i5 = 0; _i5 < indices; _i5++) {
						var indexu32 = readU32();
						var index = indexu32.value;
						eatBytes(indexu32.nextIndex);
						dump([index], "index");
						indexValues.push(t$1.indexLiteral(index));
					}
					var elemNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.elem(t$1.indexLiteral(bitfield), instr, indexValues), endLoc, _startLoc12);
					})();
					elems.push(elemNode);
				} else if (bitfield === 1) {
					var elemKind = readByte();
					eatBytes(1);
					if (elemKind !== 0) throw new Error("unexpected Elem kind: ".concat(toHex(elemKind)));
					var _indicesu = readU32();
					var _indices = _indicesu.value;
					eatBytes(_indicesu.nextIndex);
					dump([_indices], "num indices");
					var _indexValues = [];
					for (var _i6 = 0; _i6 < _indices; _i6++) {
						var _indexu2 = readU32();
						var _index3 = _indexu2.value;
						eatBytes(_indexu2.nextIndex);
						dump([_index3], "index");
						_indexValues.push(t$1.indexLiteral(_index3));
					}
				} else if (bitfield === 2) {
					var u32 = readU32();
					var tableidx = u32.value;
					eatBytes(u32.nextIndex);
					dump([tableidx], "tableidx");
					var _instr3 = [];
					parseInstructionBlock(_instr3);
					var _elemKind = readByte();
					eatBytes(1);
					if (_elemKind !== 0) throw new Error("unexpected Elem kind: ".concat(toHex(_elemKind)));
					var _indicesu2 = readU32();
					var _indices2 = _indicesu2.value;
					eatBytes(_indicesu2.nextIndex);
					dump([_indices2], "num indices");
					var _indexValues2 = [];
					for (var _i7 = 0; _i7 < _indices2; _i7++) {
						var _indexu3 = readU32();
						var _index4 = _indexu3.value;
						eatBytes(_indexu3.nextIndex);
						dump([_index4], "index");
						_indexValues2.push(t$1.indexLiteral(_index4));
					}
					var _elemNode = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.elem(t$1.indexLiteral(bitfield), _instr3, _indexValues2), endLoc, _startLoc12);
					})();
					elems.push(_elemNode);
				} else if (bitfield === 3) {
					var _elemKind2 = readByte();
					eatBytes(1);
					if (_elemKind2 !== 0) throw new Error("unexpected Elem kind: ".concat(toHex(_elemKind2)));
					var countU32 = readU32();
					var count = countU32.value;
					eatBytes(countU32.nextIndex);
					dump([count], "count");
					for (var _i8 = 0; _i8 < count; _i8++) {
						var _indexu4 = readU32();
						var _index5 = _indexu4.value;
						eatBytes(_indexu4.nextIndex);
						dump([_index5], "index");
					}
				} else if (bitfield === 4) {
					parseInstructionBlock([]);
					var _countU = readU32();
					var _count = _countU.value;
					eatBytes(_countU.nextIndex);
					dump([_count], "count");
					for (var _i9 = 0; _i9 < _count; _i9++) parseInstructionBlock([]);
				} else if (bitfield === 5) {
					var reftype = readByte();
					eatBytes(1);
					dump([reftype], "reftype");
					var _countU2 = readU32();
					var _count2 = _countU2.value;
					eatBytes(_countU2.nextIndex);
					dump([_count2], "count");
					for (var _i10 = 0; _i10 < _count2; _i10++) parseInstructionBlock([]);
				} else if (bitfield === 7) {
					var _reftype = readByte();
					eatBytes(1);
					dump([_reftype], "reftype");
					var _countU3 = readU32();
					var _count3 = _countU3.value;
					eatBytes(_countU3.nextIndex);
					dump([_count3], "count");
					for (var _i11 = 0; _i11 < _count3; _i11++) parseInstructionBlock([]);
				} else throw new Error("unexpected Elem with bitfield ".concat(toHex(bitfield)));
			}
			return elems;
		}
		function parseMemoryType(i$2) {
			var limits = parseLimits();
			return t$1.memory(limits, t$1.indexLiteral(i$2));
		}
		function parseTableSection(numberOfElements) {
			var tables = [];
			dump([numberOfElements], "num elements");
			for (var i$2 = 0; i$2 < numberOfElements; i$2++) {
				var tablesNode = parseTableType(i$2);
				state.tablesInModule.push(tablesNode);
				tables.push(tablesNode);
			}
			return tables;
		}
		function parseMemorySection(numberOfElements) {
			var memories = [];
			dump([numberOfElements], "num elements");
			for (var i$2 = 0; i$2 < numberOfElements; i$2++) {
				var memoryNode = parseMemoryType(i$2);
				state.memoriesInModule.push(memoryNode);
				memories.push(memoryNode);
			}
			return memories;
		}
		function parseStartSection() {
			var startLoc = getPosition();
			var u32 = readU32();
			var startFuncIndex = u32.value;
			eatBytes(u32.nextIndex);
			dump([startFuncIndex], "index");
			return (function() {
				var endLoc = getPosition();
				return t$1.withLoc(t$1.start(t$1.indexLiteral(startFuncIndex)), endLoc, startLoc);
			})();
		}
		function parseDataSection(numberOfElements) {
			var dataEntries = [];
			dump([numberOfElements], "num elements");
			for (var i$2 = 0; i$2 < numberOfElements; i$2++) {
				var memoryIndexu32 = readU32();
				var memoryIndex = memoryIndexu32.value;
				eatBytes(memoryIndexu32.nextIndex);
				dump([memoryIndex], "memory index");
				var instrs = [];
				parseInstructionBlock(instrs);
				if (instrs.filter(function(i2) {
					return i2.id !== "end";
				}).length !== 1) throw new _helperApiError.CompileError("data section offset must be a single instruction");
				var bytes = parseVec(function(b$2) {
					return b$2;
				});
				dump([], "init");
				dataEntries.push(t$1.data(t$1.memIndexLiteral(memoryIndex), instrs[0], t$1.byteArray(bytes)));
			}
			return dataEntries;
		}
		function parseSection(sectionIndex2) {
			var sectionId = readByte();
			eatBytes(1);
			if (sectionId >= sectionIndex2 || sectionIndex2 === _helperWasmBytecode["default"].sections.custom) sectionIndex2 = sectionId + 1;
			else if (sectionId !== _helperWasmBytecode["default"].sections.custom) throw new _helperApiError.CompileError("Unexpected section: " + toHex(sectionId));
			var nextSectionIndex2 = sectionIndex2;
			var startOffset = offset;
			var startLoc = getPosition();
			var u32 = readU32();
			var sectionSizeInBytes = u32.value;
			eatBytes(u32.nextIndex);
			var sectionSizeInBytesNode = (function() {
				var endLoc = getPosition();
				return t$1.withLoc(t$1.numberLiteralFromRaw(sectionSizeInBytes), endLoc, startLoc);
			})();
			switch (sectionId) {
				case _helperWasmBytecode["default"].sections.type:
					dumpSep("section Type");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc13 = getPosition();
					var _u = readU32();
					var numberOfTypes = _u.value;
					eatBytes(_u.nextIndex);
					var metadata2 = t$1.sectionMetadata("type", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfTypes), endLoc, _startLoc13);
					})());
					return {
						nodes: parseTypeSection(numberOfTypes),
						metadata: metadata2,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.table:
					dumpSep("section Table");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc14 = getPosition();
					var _u2 = readU32();
					var numberOfTable = _u2.value;
					eatBytes(_u2.nextIndex);
					dump([numberOfTable], "num tables");
					var _metadata = t$1.sectionMetadata("table", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfTable), endLoc, _startLoc14);
					})());
					return {
						nodes: parseTableSection(numberOfTable),
						metadata: _metadata,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections["import"]:
					dumpSep("section Import");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc15 = getPosition();
					var numberOfImportsu32 = readU32();
					var numberOfImports = numberOfImportsu32.value;
					eatBytes(numberOfImportsu32.nextIndex);
					dump([numberOfImports], "number of imports");
					var _metadata2 = t$1.sectionMetadata("import", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfImports), endLoc, _startLoc15);
					})());
					return {
						nodes: parseImportSection(numberOfImports),
						metadata: _metadata2,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.func:
					dumpSep("section Function");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc16 = getPosition();
					var numberOfFunctionsu32 = readU32();
					var numberOfFunctions = numberOfFunctionsu32.value;
					eatBytes(numberOfFunctionsu32.nextIndex);
					var _metadata3 = t$1.sectionMetadata("func", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfFunctions), endLoc, _startLoc16);
					})());
					parseFuncSection(numberOfFunctions);
					return {
						nodes: [],
						metadata: _metadata3,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections["export"]:
					dumpSep("section Export");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc17 = getPosition();
					var _u3 = readU32();
					var numberOfExport = _u3.value;
					eatBytes(_u3.nextIndex);
					var _metadata4 = t$1.sectionMetadata("export", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfExport), endLoc, _startLoc17);
					})());
					parseExportSection(numberOfExport);
					return {
						nodes: [],
						metadata: _metadata4,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.code:
					dumpSep("section Code");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc18 = getPosition();
					var _u4 = readU32();
					var numberOfFuncs = _u4.value;
					eatBytes(_u4.nextIndex);
					var _metadata5 = t$1.sectionMetadata("code", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfFuncs), endLoc, _startLoc18);
					})());
					if (opts.ignoreCodeSection === true) eatBytes(sectionSizeInBytes - _u4.nextIndex);
					else parseCodeSection(numberOfFuncs);
					return {
						nodes: [],
						metadata: _metadata5,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.start:
					dumpSep("section Start");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _metadata6 = t$1.sectionMetadata("start", startOffset, sectionSizeInBytesNode);
					return {
						nodes: [parseStartSection()],
						metadata: _metadata6,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.element:
					dumpSep("section Element");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc19 = getPosition();
					var numberOfElementsu32 = readU32();
					var numberOfElements = numberOfElementsu32.value;
					eatBytes(numberOfElementsu32.nextIndex);
					var _metadata7 = t$1.sectionMetadata("element", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfElements), endLoc, _startLoc19);
					})());
					return {
						nodes: parseElemSection(numberOfElements),
						metadata: _metadata7,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.global:
					dumpSep("section Global");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc20 = getPosition();
					var numberOfGlobalsu32 = readU32();
					var numberOfGlobals = numberOfGlobalsu32.value;
					eatBytes(numberOfGlobalsu32.nextIndex);
					var _metadata8 = t$1.sectionMetadata("global", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(numberOfGlobals), endLoc, _startLoc20);
					})());
					return {
						nodes: parseGlobalSection(numberOfGlobals),
						metadata: _metadata8,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.memory:
					dumpSep("section Memory");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _startLoc21 = getPosition();
					var _numberOfElementsu = readU32();
					var _numberOfElements = _numberOfElementsu.value;
					eatBytes(_numberOfElementsu.nextIndex);
					var _metadata9 = t$1.sectionMetadata("memory", startOffset, sectionSizeInBytesNode, (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(_numberOfElements), endLoc, _startLoc21);
					})());
					return {
						nodes: parseMemorySection(_numberOfElements),
						metadata: _metadata9,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.data:
					dumpSep("section Data");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _metadata10 = t$1.sectionMetadata("data", startOffset, sectionSizeInBytesNode);
					var _startLoc22 = getPosition();
					var _numberOfElementsu2 = readU32();
					var _numberOfElements2 = _numberOfElementsu2.value;
					eatBytes(_numberOfElementsu2.nextIndex);
					_metadata10.vectorOfSize = (function() {
						var endLoc = getPosition();
						return t$1.withLoc(t$1.numberLiteralFromRaw(_numberOfElements2), endLoc, _startLoc22);
					})();
					if (opts.ignoreDataSection === true) {
						eatBytes(sectionSizeInBytes - _numberOfElementsu2.nextIndex);
						dumpSep("ignore data (" + sectionSizeInBytes + " bytes)");
						return {
							nodes: [],
							metadata: _metadata10,
							nextSectionIndex: nextSectionIndex2
						};
					} else return {
						nodes: parseDataSection(_numberOfElements2),
						metadata: _metadata10,
						nextSectionIndex: nextSectionIndex2
					};
				case _helperWasmBytecode["default"].sections.custom:
					dumpSep("section Custom");
					dump([sectionId], "section code");
					dump([sectionSizeInBytes], "section size");
					var _metadata11 = [t$1.sectionMetadata("custom", startOffset, sectionSizeInBytesNode)];
					var sectionName = readUTF8String();
					eatBytes(sectionName.nextIndex);
					dump([], "section name (".concat(sectionName.value, ")"));
					var _remainingBytes2 = sectionSizeInBytes - sectionName.nextIndex;
					if (sectionName.value === "name") {
						var initialOffset = offset;
						try {
							_metadata11.push.apply(_metadata11, _toConsumableArray(parseNameSection(_remainingBytes2)));
						} catch (e) {
							console.warn("Failed to decode custom \"name\" section @".concat(offset, "; ignoring (").concat(e.message, ")."));
							eatBytes(offset - (initialOffset + _remainingBytes2));
						}
					} else if (sectionName.value === "producers") {
						var _initialOffset = offset;
						try {
							_metadata11.push(parseProducersSection());
						} catch (e) {
							console.warn("Failed to decode custom \"producers\" section @".concat(offset, "; ignoring (").concat(e.message, ")."));
							eatBytes(offset - (_initialOffset + _remainingBytes2));
						}
					} else {
						eatBytes(_remainingBytes2);
						dumpSep("ignore custom " + JSON.stringify(sectionName.value) + " section (" + _remainingBytes2 + " bytes)");
					}
					return {
						nodes: [],
						metadata: _metadata11,
						nextSectionIndex: nextSectionIndex2
					};
			}
			if (opts.errorOnUnknownSection) throw new _helperApiError.CompileError("Unexpected section: " + toHex(sectionId));
			else {
				dumpSep("section " + toHex(sectionId));
				dump([sectionId], "section code");
				dump([sectionSizeInBytes], "section size");
				eatBytes(sectionSizeInBytes);
				dumpSep("ignoring (" + sectionSizeInBytes + " bytes)");
				return {
					nodes: [],
					metadata: [],
					nextSectionIndex: 0
				};
			}
		}
		function parseBlockType() {
			var blocktypeByte = readByte();
			var blocktype = _helperWasmBytecode["default"].blockTypes[blocktypeByte];
			if (typeof blocktype !== "undefined") {
				eatBytes(1);
				dump([blocktypeByte], "blocktype");
				return blocktype;
			} else {
				var u32 = readU32();
				eatBytes(u32.nextIndex);
				var signature = state.typesInModule[u32.value];
				console.log({ signature });
				dump([u32.value], "typeidx");
				return u32.value;
			}
		}
		parseModuleHeader();
		parseVersion();
		var moduleFields = [];
		var sectionIndex = 0;
		var moduleMetadata = {
			sections: [],
			functionNames: [],
			localNames: [],
			producers: []
		};
		while (offset < buf.length) {
			var _parseSection = parseSection(sectionIndex), nodes = _parseSection.nodes, metadata = _parseSection.metadata, nextSectionIndex = _parseSection.nextSectionIndex;
			moduleFields.push.apply(moduleFields, _toConsumableArray(nodes));
			(Array.isArray(metadata) ? metadata : [metadata]).forEach(function(metadataItem) {
				if (metadataItem.type === "FunctionNameMetadata") moduleMetadata.functionNames.push(metadataItem);
				else if (metadataItem.type === "LocalNameMetadata") moduleMetadata.localNames.push(metadataItem);
				else if (metadataItem.type === "ProducersSectionMetadata") moduleMetadata.producers.push(metadataItem);
				else moduleMetadata.sections.push(metadataItem);
			});
			if (nextSectionIndex) sectionIndex = nextSectionIndex;
		}
		var funcIndex = 0;
		state.functionsInModule.forEach(function(func) {
			var params = func.signature.params;
			var result = func.signature.result;
			var body = [];
			if (func.isExternal === true) return;
			var decodedElementInCodeSection = state.elementsInCodeSection[funcIndex];
			if (opts.ignoreCodeSection === false) {
				if (typeof decodedElementInCodeSection === "undefined") throw new _helperApiError.CompileError("func " + toHex(funcIndex) + " code not found");
				body = decodedElementInCodeSection.code;
			}
			funcIndex++;
			var funcNode = t$1.func(func.id, t$1.signature(params, result), body);
			if (func.isExternal === true) funcNode.isExternal = func.isExternal;
			if (opts.ignoreCodeSection === false) {
				var _startLoc23 = decodedElementInCodeSection.startLoc, endLoc = decodedElementInCodeSection.endLoc, bodySize = decodedElementInCodeSection.bodySize;
				funcNode = t$1.withLoc(funcNode, endLoc, _startLoc23);
				funcNode.metadata = { bodySize };
			}
			moduleFields.push(funcNode);
		});
		state.elementsInExportSection.forEach(function(moduleExport) {
			if (moduleExport.id != null) moduleFields.push(t$1.withLoc(t$1.moduleExport(moduleExport.name, t$1.moduleExportDescr(moduleExport.type, moduleExport.id)), moduleExport.endLoc, moduleExport.startLoc));
		});
		dumpSep("end of program");
		var module2 = t$1.module(null, moduleFields, t$1.moduleMetadata(moduleMetadata.sections, moduleMetadata.functionNames, moduleMetadata.localNames, moduleMetadata.producers));
		return t$1.program([module2]);
	}
} });
var export_decode = __toESM(__commonJS({ "node_modules/.pnpm/@webassemblyjs+wasm-parser@1.14.1/node_modules/@webassemblyjs/wasm-parser/lib/index.js"(exports) {
	"use strict";
	function _typeof(obj) {
		"@babel/helpers - typeof";
		if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof2(obj2) {
			return typeof obj2;
		};
		else _typeof = function _typeof2(obj2) {
			return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
		};
		return _typeof(obj);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = decode2;
	var decoder = _interopRequireWildcard(require_decoder2());
	var t$1 = _interopRequireWildcard(require_lib7());
	function _getRequireWildcardCache(nodeInterop) {
		if (typeof WeakMap !== "function") return null;
		var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
		var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
		return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
			return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
		})(nodeInterop);
	}
	function _interopRequireWildcard(obj, nodeInterop) {
		if (!nodeInterop && obj && obj.__esModule) return obj;
		if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") return { "default": obj };
		var cache$2 = _getRequireWildcardCache(nodeInterop);
		if (cache$2 && cache$2.has(obj)) return cache$2.get(obj);
		var newObj = {};
		var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
		for (var key in obj) if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
			var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
			if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
			else newObj[key] = obj[key];
		}
		newObj["default"] = obj;
		if (cache$2) cache$2.set(obj, newObj);
		return newObj;
	}
	var defaultDecoderOpts = {
		dump: false,
		ignoreCodeSection: false,
		ignoreDataSection: false,
		ignoreCustomNameSection: false
	};
	function restoreFunctionNames(ast) {
		var functionNames = [];
		t$1.traverse(ast, { FunctionNameMetadata: function FunctionNameMetadata(_ref) {
			var node = _ref.node;
			functionNames.push({
				name: node.value,
				index: node.index
			});
		} });
		if (functionNames.length === 0) return;
		t$1.traverse(ast, {
			Func: (function(_Func) {
				function Func(_x) {
					return _Func.apply(this, arguments);
				}
				Func.toString = function() {
					return _Func.toString();
				};
				return Func;
			})(function(_ref2) {
				var nodeName = _ref2.node.name;
				var indexBasedFunctionName = nodeName.value;
				var index = Number(indexBasedFunctionName.replace("func_", ""));
				var functionName = functionNames.find(function(f$1) {
					return f$1.index === index;
				});
				if (functionName) {
					var oldValue = nodeName.value;
					nodeName.value = functionName.name;
					nodeName.numeric = oldValue;
					delete nodeName.raw;
				}
			}),
			ModuleExport: (function(_ModuleExport) {
				function ModuleExport(_x2) {
					return _ModuleExport.apply(this, arguments);
				}
				ModuleExport.toString = function() {
					return _ModuleExport.toString();
				};
				return ModuleExport;
			})(function(_ref3) {
				var node = _ref3.node;
				if (node.descr.exportType === "Func") {
					var index = node.descr.id.value;
					var functionName = functionNames.find(function(f$1) {
						return f$1.index === index;
					});
					if (functionName) node.descr.id = t$1.identifier(functionName.name);
				}
			}),
			ModuleImport: (function(_ModuleImport) {
				function ModuleImport(_x3) {
					return _ModuleImport.apply(this, arguments);
				}
				ModuleImport.toString = function() {
					return _ModuleImport.toString();
				};
				return ModuleImport;
			})(function(_ref4) {
				var node = _ref4.node;
				if (node.descr.type === "FuncImportDescr") {
					var indexBasedFunctionName = node.descr.id;
					var index = Number(indexBasedFunctionName.replace("func_", ""));
					var functionName = functionNames.find(function(f$1) {
						return f$1.index === index;
					});
					if (functionName) node.descr.id = t$1.identifier(functionName.name);
				}
			}),
			CallInstruction: (function(_CallInstruction) {
				function CallInstruction(_x4) {
					return _CallInstruction.apply(this, arguments);
				}
				CallInstruction.toString = function() {
					return _CallInstruction.toString();
				};
				return CallInstruction;
			})(function(nodePath) {
				var node = nodePath.node;
				var index = node.index.value;
				var functionName = functionNames.find(function(f$1) {
					return f$1.index === index;
				});
				if (functionName) {
					var oldValue = node.index;
					node.index = t$1.identifier(functionName.name);
					node.numeric = oldValue;
					delete node.raw;
				}
			})
		});
	}
	function restoreLocalNames(ast) {
		var localNames = [];
		t$1.traverse(ast, { LocalNameMetadata: function LocalNameMetadata(_ref5) {
			var node = _ref5.node;
			localNames.push({
				name: node.value,
				localIndex: node.localIndex,
				functionIndex: node.functionIndex
			});
		} });
		if (localNames.length === 0) return;
		t$1.traverse(ast, { Func: (function(_Func2) {
			function Func(_x5) {
				return _Func2.apply(this, arguments);
			}
			Func.toString = function() {
				return _Func2.toString();
			};
			return Func;
		})(function(_ref6) {
			var node = _ref6.node;
			var signature = node.signature;
			if (signature.type !== "Signature") return;
			var indexBasedFunctionName = node.name.value;
			var functionIndex = Number(indexBasedFunctionName.replace("func_", ""));
			signature.params.forEach(function(param, paramIndex) {
				var paramName = localNames.find(function(f$1) {
					return f$1.localIndex === paramIndex && f$1.functionIndex === functionIndex;
				});
				if (paramName && paramName.name !== "") param.id = paramName.name;
			});
		}) });
	}
	function restoreModuleName(ast) {
		t$1.traverse(ast, { ModuleNameMetadata: (function(_ModuleNameMetadata) {
			function ModuleNameMetadata(_x6) {
				return _ModuleNameMetadata.apply(this, arguments);
			}
			ModuleNameMetadata.toString = function() {
				return _ModuleNameMetadata.toString();
			};
			return ModuleNameMetadata;
		})(function(moduleNameMetadataPath) {
			t$1.traverse(ast, { Module: (function(_Module) {
				function Module(_x7) {
					return _Module.apply(this, arguments);
				}
				Module.toString = function() {
					return _Module.toString();
				};
				return Module;
			})(function(_ref7) {
				var node = _ref7.node;
				var name = moduleNameMetadataPath.node.value;
				if (name === "") name = null;
				node.id = name;
			}) });
		}) });
	}
	function decode2(buf, customOpts) {
		var opts = Object.assign({}, defaultDecoderOpts, customOpts);
		var ast = decoder.decode(buf, opts);
		if (opts.ignoreCustomNameSection === false) {
			restoreFunctionNames(ast);
			restoreLocalNames(ast);
			restoreModuleName(ast);
		}
		return ast;
	}
} })(), 1).decode;
function parseWasm(source, opts = {}) {
	let ast;
	try {
		ast = export_decode(source);
	} catch (error) {
		throw new Error(`[unwasm] Failed to parse ${opts.name || "wasm module"}: ${error}`, { cause: error });
	}
	const modules = [];
	for (const body of ast.body) if (body.type === "Module") {
		const module = {
			imports: [],
			exports: []
		};
		modules.push(module);
		for (const field of body.fields) if (field.type === "ModuleImport") module.imports.push({
			module: field.module,
			name: field.name,
			returnType: field.descr?.signature?.results?.[0],
			params: field.descr.signature.params?.map((p$1) => ({
				id: p$1.id,
				type: p$1.valtype
			}))
		});
		else if (field.type === "ModuleExport") module.exports.push({
			name: field.name,
			id: field.descr.id.value,
			type: field.descr.exportType
		});
	}
	return { modules };
}
const UNWASM_EXTERNAL_PREFIX = "\0unwasm:external:";
const UNWASM_EXTERNAL_RE = /(\0|\\0)unwasm:external:([^"']+)/gu;
const UMWASM_HELPERS_ID = "\0unwasm:helpers";
function sha1(source) {
	return createHash("sha1").update(source).digest("hex").slice(0, 16);
}
function escapeRegExp(string) {
	return string.replace(/[-\\^$*+?.()|[\]{}]/g, String.raw`\$&`);
}
async function getWasmImports(asset, _opts) {
	const importNames = Object.keys(asset.imports || {});
	if (importNames.length === 0) return {
		code: "const _imports = { /* no imports */ }",
		resolved: true
	};
	const { readPackageJSON: readPackageJSON$2 } = await Promise.resolve().then(() => dist_exports$1);
	const pkg = await readPackageJSON$2(asset.id);
	const resolved = true;
	const imports = [];
	const importsObject = {};
	for (const moduleName of importNames) {
		const importNames$1 = asset.imports[moduleName];
		const importAlias = pkg.imports?.[moduleName] || pkg.imports?.[`#${moduleName}`];
		const resolved$1 = importAlias && typeof importAlias === "string" ? importAlias : resolveModulePath(moduleName, { from: asset.id });
		const importName = "_imports_" + genSafeVariableName(moduleName);
		imports.push(genImport(resolved$1, {
			name: "*",
			as: importName
		}));
		importsObject[moduleName] = Object.fromEntries(importNames$1.map((name) => [name, `${importName}[${genString(name)}]`]));
	}
	return {
		code: `${imports.join("\n")}\n\nconst _imports = ${genObjectFromRaw(importsObject)}`,
		resolved
	};
}
async function getWasmESMBinding(asset, opts) {
	const autoImports = await getWasmImports(asset, opts);
	const instantiateCode = opts.esmImport ? getESMImportInstantiate(asset, autoImports.code) : getBase64Instantiate(asset, autoImports.code);
	return opts.lazy !== true && autoImports.resolved ? getExports(asset, instantiateCode) : getLazyExports(asset, instantiateCode);
}
/** Generate WebAssembly.Module binding for compatibility */
function getWasmModuleBinding(asset, opts) {
	return opts.esmImport ? `
const _mod = ${opts.lazy === true ? "" : `await`} import("${UNWASM_EXTERNAL_PREFIX}${asset.name}").then(r => r.default || r);
export default _mod;
  ` : `
import { base64ToUint8Array } from "${UMWASM_HELPERS_ID}";
const _data = base64ToUint8Array("${asset.source.toString("base64")}");
const _mod = new WebAssembly.Module(_data);
export default _mod;
  `;
}
/** Get the code to instantiate module with direct import */
function getESMImportInstantiate(asset, importsCode) {
	return `
${importsCode}

async function _instantiate(imports = _imports) {
const _mod = await import("${UNWASM_EXTERNAL_PREFIX}${asset.name}").then(r => r.default || r);
return WebAssembly.instantiate(_mod, imports)
}
  `;
}
/** Get the code to instantiate module from inlined base64 data */
function getBase64Instantiate(asset, importsCode) {
	return `
import { base64ToUint8Array } from "${UMWASM_HELPERS_ID}";

${importsCode}

function _instantiate(imports = _imports) {
  const _data = base64ToUint8Array("${asset.source.toString("base64")}")
  return WebAssembly.instantiate(_data, imports)  }
  `;
}
/** Get the exports code with top level await support */
function getExports(asset, instantiateCode) {
	return `
import { getExports } from "${UMWASM_HELPERS_ID}";

${instantiateCode}

const $exports = getExports(await _instantiate());

${asset.exports.map((name) => `export const ${name} = $exports.${name};`).join("\n")}

const defaultExport = () => $exports;
${asset.exports.map((name) => `defaultExport["${name}"] = $exports.${name};`).join("\n")}
export default defaultExport;
      `;
}
/** Proxied exports when imports are needed or we can't have top-level await */
function getLazyExports(asset, instantiateCode) {
	return `
import { createLazyWasmModule } from "${UMWASM_HELPERS_ID}";

${instantiateCode}

const _mod = createLazyWasmModule(_instantiate);

${asset.exports.map((name) => `export const ${name} = _mod.${name};`).join("\n")}

export default _mod;
      `;
}
function getPluginUtils() {
	return `
export function debug(...args) {
  console.log('[unwasm] [debug]', ...args);
}

export function getExports(input) {
  return input?.instance?.exports || input?.exports || input;
}

export function base64ToUint8Array(str) {
  const data = atob(str);
  const size = data.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes;
}

export function createLazyWasmModule(_instantiator) {
  const _exports = Object.create(null);
  let _loaded;
  let _promise;

  const init = (imports) => {
    if (_loaded) {
      return Promise.resolve(exportsProxy);
    }
    if (_promise) {
      return _promise;
    }
    return _promise = _instantiator(imports)
      .then(r => {
        Object.assign(_exports, getExports(r));
        _loaded = true;
        _promise = undefined;
        return exportsProxy;
      })
      .catch(error => {
        _promise = undefined;
        console.error('[wasm] [error]', error);
        throw error;
      });
  }

  const exportsProxy = new Proxy(_exports, {
    get(_, prop) {
      if (_loaded) {
        return _exports[prop];
      }
      return (...args) => {
        return _loaded
          ? _exports[prop]?.(...args)
          : init().then(() => _exports[prop]?.(...args));
      };
    },
  });


  const lazyProxy = new Proxy(() => {}, {
    get(_, prop) {
      return exportsProxy[prop];
    },
    apply(_, __, args) {
      return init(args[0])
    },
  });

  return lazyProxy;
}
  `;
}
const WASM_ID_RE = /\.wasm(?:\?.*)?$/i;
function unwasm(opts) {
	const assets = Object.create(null);
	const _parseCache = Object.create(null);
	function parse$2(name, source) {
		if (_parseCache[name]) return _parseCache[name];
		const imports = Object.create(null);
		const exports = [];
		try {
			const parsed = parseWasm(source, { name });
			for (const mod of parsed.modules) {
				exports.push(...mod.exports.map((e) => e.name));
				for (const imp of mod.imports) {
					if (!imports[imp.module]) imports[imp.module] = [];
					imports[imp.module].push(imp.name);
				}
			}
		} catch (error) {
			console.warn(`[unwasm] Failed to parse WASM module ${name}:`, error);
		}
		_parseCache[name] = {
			imports,
			exports
		};
		return _parseCache[name];
	}
	return {
		name: "unwasm",
		resolveId: {
			order: "pre",
			filter: { id: [
				/* @__PURE__ */ new RegExp("^" + escapeRegExp(UMWASM_HELPERS_ID) + "$"),
				/* @__PURE__ */ new RegExp("^" + UNWASM_EXTERNAL_PREFIX),
				WASM_ID_RE
			] },
			async handler(id, importer) {
				if (id === UMWASM_HELPERS_ID) return id;
				if (id.startsWith(UNWASM_EXTERNAL_PREFIX)) return {
					id,
					external: true
				};
				if (WASM_ID_RE.test(id)) {
					const resolved = await this.resolve(id, importer);
					if (!resolved?.id) return resolved;
					let resolvedId = resolved?.id;
					if (resolvedId && resolvedId.startsWith("file://")) resolvedId = fileURLToPath(resolvedId);
					return {
						...resolved,
						id: resolvedId,
						external: false,
						moduleSideEffects: false,
						resolvedBy: "unwasm",
						meta: {
							...resolved.meta,
							unwasm: { resolved }
						}
					};
				}
			}
		},
		generateBundle() {
			if (opts.esmImport) for (const asset of Object.values(assets)) this.emitFile({
				type: "asset",
				source: asset.source,
				fileName: asset.name
			});
		},
		load: {
			order: "pre",
			filter: { id: [/* @__PURE__ */ new RegExp("^" + escapeRegExp(UMWASM_HELPERS_ID) + "$"), WASM_ID_RE] },
			async handler(id) {
				if (id === UMWASM_HELPERS_ID) return getPluginUtils();
				if (!WASM_ID_RE.test(id)) return;
				const idPath = id.split("?")[0];
				if (!existsSync(idPath)) return;
				this.addWatchFile(idPath);
				return (await promises.readFile(idPath)).toString("binary");
			}
		},
		transform: {
			order: "pre",
			filter: { id: WASM_ID_RE },
			async handler(code, id) {
				const buff = Buffer.from(code, "binary");
				let isModule = id.endsWith("?module");
				const name = `wasm/${basename$2(id.split("?")[0], ".wasm")}-${sha1(buff)}.wasm`;
				let parsed = {
					imports: {},
					exports: ["default"]
				};
				if (!isModule) try {
					parsed = parse$2(name, buff);
				} catch (error) {
					if (!opts.silent) this.warn({
						id,
						cause: error,
						message: "Failed to parse the WebAssembly module; falling back to module mode."
					});
					isModule = true;
				}
				const asset = assets[name] = {
					name,
					id,
					source: buff,
					imports: parsed.imports,
					exports: parsed.exports
				};
				return {
					code: isModule ? await getWasmModuleBinding(asset, opts) : await getWasmESMBinding(asset, opts).catch((error) => {
						if (!opts.silent) this.warn({
							id,
							cause: error,
							message: "Failed to load the WebAssembly module; falling back to module mode: " + error.message
						});
						return getWasmModuleBinding(asset, opts);
					}),
					map: { mappings: "" }
				};
			}
		},
		renderChunk(code, chunk) {
			if (!opts.esmImport) return;
			if (!(chunk.moduleIds.some((id) => WASM_ID_RE.test(id)) || chunk.imports.some((id) => WASM_ID_RE.test(id)))) return;
			const s = new MagicString(code);
			const resolveImport = (id) => {
				if (typeof id !== "string") return;
				const asset = assets[id];
				if (!asset) return;
				const nestedLevel = chunk.fileName.split("/").filter(Boolean).length - 1;
				return {
					relativeId: (nestedLevel ? "../".repeat(nestedLevel) : "./") + asset.name,
					asset
				};
			};
			for (const match of code.matchAll(UNWASM_EXTERNAL_RE)) {
				const resolved = resolveImport(match[2]);
				const index = match.index;
				const len = match[0].length;
				if (!resolved || !index) {
					console.warn(`Failed to resolve WASM import: ${JSON.stringify(match[1])}`);
					continue;
				}
				s.overwrite(index, index + len, resolved.relativeId);
			}
			if (s.hasChanged()) return {
				code: s.toString(),
				map: s.generateMap({ includeContent: true })
			};
		}
	};
}

//#endregion
//#region src/build/plugins/route-meta.ts
const PREFIX$1 = "\0nitro:route-meta:";
function routeMeta(nitro) {
	return {
		name: "nitro:route-meta",
		resolveId: {
			filter: { id: /^(?!\u0000)(.+)\?meta$/ },
			async handler(id, importer, resolveOpts) {
				if (id.endsWith("?meta")) {
					const resolved = await this.resolve(id.replace("?meta", ""), importer, resolveOpts);
					if (!resolved) return;
					return PREFIX$1 + resolved.id;
				}
			}
		},
		load: {
			filter: { id: /* @__PURE__ */ new RegExp(`^${escapeRegExp$1(PREFIX$1)}`) },
			handler(id) {
				if (id.startsWith(PREFIX$1)) {
					const fullPath = id.slice(18);
					if (isAbsolute$2(fullPath)) return readFile(fullPath, { encoding: "utf8" });
					else return "export default undefined;";
				}
			}
		},
		transform: {
			filter: { id: /* @__PURE__ */ new RegExp(`^${escapeRegExp$1(PREFIX$1)}`) },
			async handler(code, id) {
				let meta = null;
				try {
					const transformRes = transformSync(id, code);
					if (transformRes.errors?.length > 0) {
						for (const error of transformRes.errors) this.warn(error);
						return {
							code: `export default {};`,
							map: null
						};
					}
					const ast = this.parse(transformRes.code);
					for (const node of ast.body) if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier" && node.expression.callee.name === "defineRouteMeta" && node.expression.arguments.length === 1) {
						meta = astToObject(node.expression.arguments[0]);
						break;
					}
				} catch (error) {
					nitro.logger.warn(`[handlers-meta] Cannot extra route meta for: ${id}: ${error}`);
				}
				return {
					code: `export default ${JSON.stringify(meta)};`,
					map: null
				};
			}
		}
	};
}
function astToObject(node) {
	switch (node.type) {
		case "ObjectExpression": {
			const obj = {};
			for (const prop of node.properties) if (prop.type === "Property") {
				const key = prop.key.name ?? prop.key.value;
				obj[key] = astToObject(prop.value);
			}
			return obj;
		}
		case "ArrayExpression": return node.elements.map((el) => astToObject(el)).filter((obj) => obj !== void 0);
		case "Literal": return node.value;
	}
}

//#endregion
//#region src/build/plugins/server-main.ts
function serverMain(nitro) {
	return {
		name: "nitro:server-main",
		renderChunk(code, chunk) {
			if (chunk.isEntry) return {
				code: `globalThis.__nitro_main__ = import.meta.url; ${code}`,
				map: null
			};
		}
	};
}

//#endregion
//#region src/build/plugins/virtual.ts
function virtual(input) {
	const modules = /* @__PURE__ */ new Map();
	for (const mod of input) {
		const render = () => typeof mod.template === "function" ? mod.template() : mod.template;
		modules.set(mod.id, {
			module: mod,
			render
		});
	}
	const include = [/^#nitro\/virtual/];
	const extraIds = [...modules.keys()].filter((key) => !key.startsWith("#nitro/virtual"));
	if (extraIds.length > 0) include.push(/* @__PURE__ */ new RegExp(`^(${extraIds.map((id) => pathRegExp(id)).join("|")})$`));
	return {
		name: "nitro:virtual",
		api: { modules },
		resolveId: {
			order: "pre",
			filter: { id: include },
			handler: (id) => {
				const mod = modules.get(id);
				if (mod) return {
					id,
					moduleSideEffects: mod.module.moduleSideEffects ?? false
				};
			}
		},
		load: {
			order: "pre",
			filter: { id: include },
			handler: async (id) => {
				const mod = modules.get(id);
				if (!mod) throw new Error(`Virtual module ${id} not found.`);
				return {
					code: await mod.render(),
					map: null
				};
			}
		}
	};
}
function virtualDeps() {
	const cache$2 = /* @__PURE__ */ new Map();
	return {
		name: "nitro:virtual-deps",
		resolveId: {
			order: "pre",
			filter: { id: /* @__PURE__ */ new RegExp(`^(#nitro|${runtimeDependencies.map((dep) => pathRegExp(dep)).join("|")})`) },
			handler(id, importer) {
				if (!importer || !importer.startsWith("#nitro/virtual")) return;
				let resolved = cache$2.get(id);
				if (!resolved) resolved = this.resolve(id, runtimeDir).then((_resolved) => {
					cache$2.set(id, _resolved);
					return _resolved;
				}).catch((error) => {
					cache$2.delete(id);
					throw error;
				});
				return resolved;
			}
		}
	};
}

//#endregion
//#region src/build/plugins/sourcemap-min.ts
function sourcemapMinify() {
	return {
		name: "nitro:sourcemap-minify",
		generateBundle(_options, bundle) {
			for (const [key, asset] of Object.entries(bundle)) {
				if (!key.endsWith(".map") || !("source" in asset) || typeof asset.source !== "string") continue;
				const sourcemap = JSON.parse(asset.source);
				delete sourcemap.sourcesContent;
				delete sourcemap.x_google_ignoreList;
				if ((sourcemap.sources || []).some((s) => s.includes("node_modules"))) sourcemap.mappings = "";
				asset.source = JSON.stringify(sourcemap);
			}
		}
	};
}

//#endregion
//#region src/build/plugins/raw.ts
const HELPER_ID = "\0nitro-raw-helpers";
const RESOLVED_PREFIX = "\0nitro:raw:";
const PREFIX = "raw:";
function raw() {
	return {
		name: "nitro:raw",
		resolveId: {
			order: "pre",
			filter: { id: [/* @__PURE__ */ new RegExp(`^${HELPER_ID}$`), /* @__PURE__ */ new RegExp(`^${PREFIX}`)] },
			async handler(id, importer, resolveOpts) {
				if (id === HELPER_ID) return id;
				if (id.startsWith(PREFIX)) {
					const resolvedId = (await this.resolve(id.slice(4), importer, resolveOpts))?.id;
					if (!resolvedId) return null;
					return { id: RESOLVED_PREFIX + resolvedId };
				}
			}
		},
		load: {
			order: "pre",
			filter: { id: [/* @__PURE__ */ new RegExp(`^${HELPER_ID}$`), /* @__PURE__ */ new RegExp(`^${RESOLVED_PREFIX}`)] },
			handler(id) {
				if (id === HELPER_ID) return getHelpers();
				if (id.startsWith(RESOLVED_PREFIX)) return promises.readFile(id.slice(11), isBinary(id) ? "binary" : "utf8");
			}
		},
		transform: {
			order: "pre",
			filter: { id: /* @__PURE__ */ new RegExp(`^${RESOLVED_PREFIX}`) },
			handler(code, id) {
				const path$2 = id.slice(11);
				if (isBinary(id)) return {
					code: `import {base64ToUint8Array } from "${HELPER_ID}" \n export default base64ToUint8Array("${Buffer.from(code, "binary").toString("base64")}")`,
					map: rawAssetMap(path$2)
				};
				return {
					code: `export default ${JSON.stringify(code)}`,
					map: rawAssetMap(path$2),
					moduleType: "js"
				};
			}
		}
	};
}
function isBinary(id) {
	const idMime = src_default.getType(id) || "";
	if (idMime.startsWith("text/")) return false;
	if (/application\/(json|sql|xml|yaml)/.test(idMime)) return false;
	return true;
}
function getHelpers() {
	return `
export function base64ToUint8Array(str) {
  const data = atob(str);
  const size = data.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes;
}
  `;
}
function rawAssetMap(id) {
	return {
		version: 3,
		file: id,
		sources: [id],
		sourcesContent: [],
		names: [],
		mappings: ""
	};
}

//#endregion
//#region src/build/plugins/externals.ts
const PLUGIN_NAME = "nitro:externals";
function externals(opts) {
	const include = opts?.include ? opts.include.map((p$1) => toPathRegExp(p$1)) : void 0;
	const exclude = [/^(?:[\0#~.]|[a-z0-9]{2,}:)|\?/, ...(opts?.exclude || []).map((p$1) => toPathRegExp(p$1))];
	const filter = (id) => {
		if (include && !include.some((r$3) => r$3.test(id))) return false;
		if (exclude.some((r$3) => r$3.test(id))) return false;
		return true;
	};
	const tryResolve = (id, from) => resolveModulePath(id, {
		try: true,
		from: from && isAbsolute$2(from) ? from : opts.rootDir,
		conditions: opts.conditions
	});
	const tracedPaths = /* @__PURE__ */ new Set();
	if (include && include.length === 0) return { name: PLUGIN_NAME };
	return {
		name: PLUGIN_NAME,
		resolveId: {
			order: "pre",
			filter: { id: {
				exclude,
				include
			} },
			async handler(id, importer, rOpts) {
				if (builtinModules.includes(id)) return {
					resolvedBy: PLUGIN_NAME,
					external: true,
					id: id.includes(":") ? id : `node:${id}`
				};
				if (rOpts.custom?.["node-resolve"]) return null;
				let resolved = await this.resolve(id, importer, rOpts);
				const cjsResolved = resolved?.meta?.commonjs?.resolved;
				if (cjsResolved) {
					if (!filter(cjsResolved.id)) return resolved;
					resolved = cjsResolved;
				}
				if (!resolved?.id || !filter(resolved.id)) return resolved;
				let resolvedPath = resolved.id;
				if (!isAbsolute$2(resolvedPath)) resolvedPath = tryResolve(resolvedPath, importer) || resolvedPath;
				if (opts.trace) {
					let importId = toImport(id) || toImport(resolvedPath);
					if (!importId) return resolved;
					if (!tryResolve(importId, importer)) {
						const guessed = await guessSubpath(resolvedPath, opts.conditions);
						if (!guessed) return resolved;
						importId = guessed;
					}
					tracedPaths.add(resolvedPath);
					return {
						...resolved,
						resolvedBy: PLUGIN_NAME,
						external: true,
						id: importId
					};
				}
				return {
					...resolved,
					resolvedBy: PLUGIN_NAME,
					external: true,
					id: isAbsolute$2(resolvedPath) ? pathToFileURL(resolvedPath).href : resolvedPath
				};
			}
		},
		buildEnd: {
			order: "post",
			async handler() {
				if (!opts.trace || tracedPaths.size === 0) return;
				const { traceNodeModules } = await import("nf3");
				const traceTime = Date.now();
				let traceFilesCount = 0;
				let tracedPkgsCount = 0;
				await traceNodeModules([...tracedPaths], {
					...opts.trace,
					conditions: opts.conditions,
					rootDir: opts.rootDir,
					writePackageJson: true,
					hooks: {
						tracedFiles(result) {
							traceFilesCount = Object.keys(result).length;
						},
						tracedPackages: (pkgs) => {
							tracedPkgsCount = Object.keys(pkgs).length;
							consola$1.info(`Tracing dependencies:\n${Object.entries(pkgs).map(([name, versions]) => `- \`${name}\` (${Object.keys(versions.versions).join(", ")})`).join("\n")}`);
						}
					}
				});
				consola$1.success(`Traced ${tracedPkgsCount} dependencies (${traceFilesCount} files) in ${Date.now() - traceTime}ms.`);
				consola$1.info(`Ensure your production environment matches the builder OS and architecture (\`${process.platform}-${process.arch}\`) to avoid native module issues.`);
			}
		}
	};
}
const NODE_MODULES_RE = /^(?<dir>.+[\\/]node_modules[\\/])(?<name>[^@\\/]+|@[^\\/]+[\\/][^\\/]+)(?:[\\/](?<subpath>.+))?$/;
const IMPORT_RE = /^(?!\.)(?<name>[^@/\\]+|@[^/\\]+[/\\][^/\\]+)(?:[/\\](?<subpath>.+))?$/;
function toImport(id) {
	if (isAbsolute$2(id)) {
		const { name, subpath } = NODE_MODULES_RE.exec(id)?.groups || {};
		if (name && subpath) return join$2(name, subpath);
	} else if (IMPORT_RE.test(id)) return id;
}
function guessSubpath(path$2, conditions) {
	const { dir, name, subpath } = NODE_MODULES_RE.exec(path$2)?.groups || {};
	if (!dir || !name || !subpath) return;
	const exports = getPkgJSON(join$2(dir, name) + "/")?.exports;
	if (!exports || typeof exports !== "object") return;
	for (const e of flattenExports(exports)) {
		if (!conditions.includes(e.condition || "default")) continue;
		if (e.fsPath === subpath) return join$2(name, e.subpath);
		if (e.fsPath.includes("*")) {
			const fsPathRe = /* @__PURE__ */ new RegExp("^" + escapeRegExp$1(e.fsPath).replace(String.raw`\*`, "(.+?)") + "$");
			if (fsPathRe.test(subpath)) {
				const matched = fsPathRe.exec(subpath)?.[1];
				if (matched) return join$2(name, e.subpath.replace("*", matched));
			}
		}
	}
}
function getPkgJSON(dir) {
	const cache$2 = getPkgJSON._cache ||= /* @__PURE__ */ new Map();
	if (cache$2.has(dir)) return cache$2.get(dir);
	try {
		const pkg = createRequire(dir)("./package.json");
		cache$2.set(dir, pkg);
		return pkg;
	} catch {}
}
function flattenExports(exports = {}, parentSubpath = "./") {
	return Object.entries(exports).flatMap(([key, value]) => {
		const [subpath, condition] = key.startsWith(".") ? [key.slice(1)] : [void 0, key];
		const _subPath = join$2(parentSubpath, subpath || "");
		if (typeof value === "string") return [{
			subpath: _subPath,
			fsPath: value.replace(/^\.\//, ""),
			condition
		}];
		return typeof value === "object" ? flattenExports(value, _subPath) : [];
	});
}

//#endregion
//#region src/build/plugins.ts
const FORCE_TRACE_DEPS = ["pg"];
async function baseBuildPlugins(nitro, base) {
	const plugins$1 = [];
	const virtualPlugin = virtual(virtualTemplates(nitro, [...base.env.polyfill]));
	nitro.vfs = virtualPlugin.api.modules;
	plugins$1.push(virtualPlugin, virtualDeps());
	if (nitro.options.imports) {
		const unimportPlugin = await import("../_libs/unimport+unplugin.mjs").then((n) => n.t);
		plugins$1.push(unimportPlugin.default.rollup(nitro.options.imports));
	}
	if (nitro.options.wasm !== false) plugins$1.push(unwasm(nitro.options.wasm || {}));
	plugins$1.push(serverMain(nitro));
	plugins$1.push(raw());
	if (nitro.options.experimental.openAPI) plugins$1.push(routeMeta(nitro));
	plugins$1.push(replace({
		preventAssignment: true,
		values: base.replacements
	}));
	if (nitro.options.node && nitro.options.noExternals !== true) {
		const isDevOrPrerender = nitro.options.dev || nitro.options.preset === "nitro-prerender";
		const traceDeps = [...new Set([
			...NodeNativePackages,
			...FORCE_TRACE_DEPS,
			...nitro.options.traceDeps || []
		])];
		plugins$1.push(externals({
			rootDir: nitro.options.rootDir,
			conditions: nitro.options.exportConditions || ["default"],
			exclude: [...base.noExternal],
			include: isDevOrPrerender ? void 0 : [/* @__PURE__ */ new RegExp(`^(?:${traceDeps.join("|")})|[/\\\\]node_modules[/\\\\](?:${traceDeps.join("|")})(?:[/\\\\])`)],
			trace: isDevOrPrerender ? false : { outDir: nitro.options.output.serverDir }
		}));
	}
	if (nitro.options.sourcemap && !nitro.options.dev && nitro.options.experimental.sourcemapMinify !== false) plugins$1.push(sourcemapMinify());
	return plugins$1;
}

//#endregion
//#region src/build/plugins/oxc.ts
function oxc(options) {
	return {
		name: "nitro:oxc",
		transform: {
			filter: { id: /^(?!.*\/node_modules\/).*\.m?[jt]sx?$/ },
			handler(code, id) {
				const res = transformSync(id, code, {
					sourcemap: options.sourcemap,
					...options.transform
				});
				if (res.errors?.length > 0) this.error(res.errors.join("\n"));
				return res;
			}
		},
		renderChunk(code, chunk) {
			if (options.minify) return minifySync(chunk.fileName, code, {
				sourcemap: options.sourcemap,
				...typeof options.minify === "object" ? options.minify : {}
			});
		}
	};
}

//#endregion
export { resolveModulePath as $, compressPublicAssets as A, T as B, decode as C, prepare as D, parse as E, Builder as F, findFile$1 as G, d as H, prettyPath as I, readGitConfig as J, findNearestFile$1 as K, resolveNitroPath as L, build as M, glob as N, copyPublicAssets as O, require_picomatch as P, N$4 as Q, writeFile$1 as R, MagicString as S, Parser as T, p as U, a as V, dist_exports$1 as W, h$2 as X, readPackageJSON$1 as Y, C$1 as Z, writeTypes as _, dataToEsm as a, join$2 as at, getMagicString as b, walk as c, resolve$3 as ct, libChunkName as d, resolveModuleURL as et, baseBuildConfig as f, writeDevBuildInfo as g, writeBuildInfo as h, createFilter as i, isAbsolute$2 as it, src_default as j, scanUnprefixedPublicAssets as k, NODE_MODULES_RE$1 as l, getBuildInfo as m, baseBuildPlugins as n, dirname$2 as nt, extractAssignedNames as o, normalize$2 as ot, runParallel as p, findWorkspaceDir as q, attachScopes as r, extname$4 as rt, makeLegalIdentifier as s, relative$2 as st, oxc as t, basename$2 as tt, getChunkName as u, dist_exports as v, encode as w, stripLiteral as x, createUnimport as y, K$1 as z };