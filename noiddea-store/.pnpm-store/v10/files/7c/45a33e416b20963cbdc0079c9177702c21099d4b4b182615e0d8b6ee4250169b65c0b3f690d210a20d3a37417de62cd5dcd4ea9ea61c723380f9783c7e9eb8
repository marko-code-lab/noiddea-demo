import { i as __toESM, n as __exportAll, r as __require, t as __commonJSMin } from "../_common.mjs";
import { $ as resolveModulePath, Y as readPackageJSON, at as join$1, ct as resolve$1, nt as dirname$1, ot as normalize$1, q as findWorkspaceDir, rt as extname$1, tt as basename$1 } from "../_build/common.mjs";
import { existsSync, promises, readFileSync, statSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { createJiti } from "jiti";
import destr from "destr";
import { defu } from "defu";

//#region node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "dotenv",
		"version": "17.2.3",
		"description": "Loads environment variables from .env file",
		"main": "lib/main.js",
		"types": "lib/main.d.ts",
		"exports": {
			".": {
				"types": "./lib/main.d.ts",
				"require": "./lib/main.js",
				"default": "./lib/main.js"
			},
			"./config": "./config.js",
			"./config.js": "./config.js",
			"./lib/env-options": "./lib/env-options.js",
			"./lib/env-options.js": "./lib/env-options.js",
			"./lib/cli-options": "./lib/cli-options.js",
			"./lib/cli-options.js": "./lib/cli-options.js",
			"./package.json": "./package.json"
		},
		"scripts": {
			"dts-check": "tsc --project tests/types/tsconfig.json",
			"lint": "standard",
			"pretest": "npm run lint && npm run dts-check",
			"test": "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
			"test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
			"prerelease": "npm test",
			"release": "standard-version"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/motdotla/dotenv.git"
		},
		"homepage": "https://github.com/motdotla/dotenv#readme",
		"funding": "https://dotenvx.com",
		"keywords": [
			"dotenv",
			"env",
			".env",
			"environment",
			"variables",
			"config",
			"settings"
		],
		"readmeFilename": "README.md",
		"license": "BSD-2-Clause",
		"devDependencies": {
			"@types/node": "^18.11.3",
			"decache": "^4.6.2",
			"sinon": "^14.0.1",
			"standard": "^17.0.0",
			"standard-version": "^9.5.0",
			"tap": "^19.2.0",
			"typescript": "^4.8.4"
		},
		"engines": { "node": ">=12" },
		"browser": { "fs": false }
	};
}));

//#endregion
//#region node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs$1 = __require("fs");
	const path$1 = __require("path");
	const os$1 = __require("os");
	const crypto = __require("crypto");
	const version = require_package().version;
	const TIPS = [
		"🔐 encrypt with Dotenvx: https://dotenvx.com",
		"🔐 prevent committing .env to code: https://dotenvx.com/precommit",
		"🔐 prevent building .env in docker: https://dotenvx.com/prebuild",
		"📡 add observability to secrets: https://dotenvx.com/ops",
		"👥 sync secrets across teammates & machines: https://dotenvx.com/ops",
		"🗂️ backup and recover secrets: https://dotenvx.com/ops",
		"✅ audit secrets and track compliance: https://dotenvx.com/ops",
		"🔄 add secrets lifecycle management: https://dotenvx.com/ops",
		"🔑 add access controls to secrets: https://dotenvx.com/ops",
		"🛠️  run anywhere with `dotenvx run -- yourcommand`",
		"⚙️  specify custom .env file path with { path: '/custom/path/.env' }",
		"⚙️  enable debug logging with { debug: true }",
		"⚙️  override existing env vars with { override: true }",
		"⚙️  suppress all logs with { quiet: true }",
		"⚙️  write to custom object with { processEnv: myObject }",
		"⚙️  load multiple .env files with { path: ['.env.local', '.env'] }"
	];
	function _getRandomTip() {
		return TIPS[Math.floor(Math.random() * TIPS.length)];
	}
	function parseBoolean(value) {
		if (typeof value === "string") return ![
			"false",
			"0",
			"no",
			"off",
			""
		].includes(value.toLowerCase());
		return Boolean(value);
	}
	function supportsAnsi() {
		return process.stdout.isTTY;
	}
	function dim(text) {
		return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text;
	}
	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.error(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _log(message) {
		console.log(`[dotenv@${version}] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs$1.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path$1.resolve(process.cwd(), ".env.vault");
		if (fs$1.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$1.join(os$1.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
		const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (debug || !quiet) _log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$1.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
		let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path$2 of optionPaths) try {
			const parsed = DotenvModule.parse(fs$1.readFileSync(path$2, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path$2} ${e.message}`);
			lastError = e;
		}
		const populated = DotenvModule.populate(processEnv, parsedAll, options);
		debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
		quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
		if (debug || !quiet) {
			const keysCount = Object.keys(populated).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative$1 = path$1.relative(process.cwd(), filePath);
				shortPaths.push(relative$1);
			} catch (e) {
				if (debug) _debug(`Failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		const populated = {};
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) {
				processEnv[key] = parsed[key];
				populated[key] = parsed[key];
			}
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else {
			processEnv[key] = parsed[key];
			populated[key] = parsed[key];
		}
		return populated;
	}
	const DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));

//#endregion
//#region node_modules/.pnpm/rc9@2.1.2/node_modules/rc9/dist/index.mjs
function isBuffer(obj) {
	return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function keyIdentity(key) {
	return key;
}
function flatten(target, opts) {
	opts = opts || {};
	const delimiter$1 = opts.delimiter || ".";
	const maxDepth = opts.maxDepth;
	const transformKey = opts.transformKey || keyIdentity;
	const output = {};
	function step(object, prev, currentDepth) {
		currentDepth = currentDepth || 1;
		Object.keys(object).forEach(function(key) {
			const value = object[key];
			const isarray = opts.safe && Array.isArray(value);
			const type$1 = Object.prototype.toString.call(value);
			const isbuffer = isBuffer(value);
			const isobject = type$1 === "[object Object]" || type$1 === "[object Array]";
			const newKey = prev ? prev + delimiter$1 + transformKey(key) : transformKey(key);
			if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) return step(value, newKey, currentDepth + 1);
			output[newKey] = value;
		});
	}
	step(target);
	return output;
}
function unflatten(target, opts) {
	opts = opts || {};
	const delimiter$1 = opts.delimiter || ".";
	const overwrite = opts.overwrite || false;
	const transformKey = opts.transformKey || keyIdentity;
	const result = {};
	if (isBuffer(target) || Object.prototype.toString.call(target) !== "[object Object]") return target;
	function getkey(key) {
		const parsedKey = Number(key);
		return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts.object ? key : parsedKey;
	}
	function addKeys(keyPrefix, recipient, target$1) {
		return Object.keys(target$1).reduce(function(result$1, key) {
			result$1[keyPrefix + delimiter$1 + key] = target$1[key];
			return result$1;
		}, recipient);
	}
	function isEmpty(val) {
		const type$1 = Object.prototype.toString.call(val);
		const isArray = type$1 === "[object Array]";
		const isObject = type$1 === "[object Object]";
		if (!val) return true;
		else if (isArray) return !val.length;
		else if (isObject) return !Object.keys(val).length;
	}
	target = Object.keys(target).reduce(function(result$1, key) {
		const type$1 = Object.prototype.toString.call(target[key]);
		if (!(type$1 === "[object Object]" || type$1 === "[object Array]") || isEmpty(target[key])) {
			result$1[key] = target[key];
			return result$1;
		} else return addKeys(key, result$1, flatten(target[key], opts));
	}, {});
	Object.keys(target).forEach(function(key) {
		const split = key.split(delimiter$1).map(transformKey);
		let key1 = getkey(split.shift());
		let key2 = getkey(split[0]);
		let recipient = result;
		while (key2 !== void 0) {
			if (key1 === "__proto__") return;
			const type$1 = Object.prototype.toString.call(recipient[key1]);
			const isobject = type$1 === "[object Object]" || type$1 === "[object Array]";
			if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") return;
			if (overwrite && !isobject || !overwrite && recipient[key1] == null) recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
			recipient = recipient[key1];
			if (split.length > 0) {
				key1 = getkey(split.shift());
				key2 = getkey(split[0]);
			}
		}
		recipient[key1] = unflatten(target[key], opts);
	});
	return result;
}
const RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
const RE_LINES = /\n|\r|\r\n/;
const defaults = {
	name: ".conf",
	dir: process.cwd(),
	flat: false
};
function withDefaults(options) {
	if (typeof options === "string") options = { name: options };
	return {
		...defaults,
		...options
	};
}
function parse(contents, options = {}) {
	const config = {};
	const lines = contents.split(RE_LINES);
	for (const line of lines) {
		const match = line.match(RE_KEY_VAL);
		if (!match) continue;
		const key = match[1];
		if (!key || key === "__proto__" || key === "constructor") continue;
		const value = destr((match[2] || "").trim());
		if (key.endsWith("[]")) {
			const nkey = key.slice(0, Math.max(0, key.length - 2));
			config[nkey] = (config[nkey] || []).concat(value);
			continue;
		}
		config[key] = value;
	}
	return options.flat ? config : unflatten(config, { overwrite: true });
}
function parseFile(path$2, options) {
	if (!existsSync(path$2)) return {};
	return parse(readFileSync(path$2, "utf8"), options);
}
function read(options) {
	options = withDefaults(options);
	return parseFile(resolve(options.dir, options.name), options);
}
function readUser(options) {
	options = withDefaults(options);
	options.dir = process.env.XDG_CONFIG_HOME || homedir();
	return read(options);
}

//#endregion
//#region node_modules/.pnpm/perfect-debounce@2.0.0/node_modules/perfect-debounce/dist/index.mjs
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve$2) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve$2(leadingValue);
			} else resolveList.push(resolve$2);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

//#endregion
//#region node_modules/.pnpm/c12@3.3.3_magicast@0.5.1/node_modules/c12/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	SUPPORTED_EXTENSIONS: () => SUPPORTED_EXTENSIONS,
	loadConfig: () => loadConfig,
	loadDotenv: () => loadDotenv,
	setupDotenv: () => setupDotenv,
	watchConfig: () => watchConfig
});
var import_main = /* @__PURE__ */ __toESM(require_main(), 1);
/**
* Load and interpolate environment variables into `process.env`.
* If you need more control (or access to the values), consider using `loadDotenv` instead
*
*/
async function setupDotenv(options) {
	const targetEnvironment = options.env ?? process.env;
	const environment = await loadDotenv({
		cwd: options.cwd,
		fileName: options.fileName ?? ".env",
		env: targetEnvironment,
		interpolate: options.interpolate ?? true
	});
	const dotenvVars = getDotEnvVars(targetEnvironment);
	for (const key in environment) {
		if (key.startsWith("_")) continue;
		if (targetEnvironment[key] === void 0 || dotenvVars.has(key)) targetEnvironment[key] = environment[key];
	}
	return environment;
}
/** Load environment variables into an object. */
async function loadDotenv(options) {
	const environment = Object.create(null);
	const cwd = resolve$1(options.cwd || ".");
	const _fileName = options.fileName || ".env";
	const dotenvFiles = typeof _fileName === "string" ? [_fileName] : _fileName;
	const dotenvVars = getDotEnvVars(options.env || {});
	Object.assign(environment, options.env);
	for (const file of dotenvFiles) {
		const dotenvFile = resolve$1(cwd, file);
		if (!statSync(dotenvFile, { throwIfNoEntry: false })?.isFile()) continue;
		const parsed = import_main.parse(await promises.readFile(dotenvFile, "utf8"));
		for (const key in parsed) {
			if (key in environment && !dotenvVars.has(key)) continue;
			environment[key] = parsed[key];
			dotenvVars.add(key);
		}
	}
	if (options.interpolate) interpolate(environment);
	return environment;
}
function interpolate(target, source = {}, parse$1 = (v) => v) {
	function getValue(key) {
		return source[key] === void 0 ? target[key] : source[key];
	}
	function interpolate$1(value, parents = []) {
		if (typeof value !== "string") return value;
		return parse$1((value.match(/(.?\${?(?:[\w:]+)?}?)/g) || []).reduce((newValue, match) => {
			const parts = /(.?)\${?([\w:]+)?}?/g.exec(match) || [];
			const prefix = parts[1];
			let value$1, replacePart;
			if (prefix === "\\") {
				replacePart = parts[0] || "";
				value$1 = replacePart.replace(String.raw`\$`, "$");
			} else {
				const key = parts[2];
				replacePart = (parts[0] || "").slice(prefix.length);
				if (parents.includes(key)) {
					console.warn(`Please avoid recursive environment variables ( loop: ${parents.join(" > ")} > ${key} )`);
					return "";
				}
				value$1 = getValue(key);
				value$1 = interpolate$1(value$1, [...parents, key]);
			}
			return value$1 === void 0 ? newValue : newValue.replace(replacePart, value$1);
		}, value));
	}
	for (const key in target) target[key] = interpolate$1(getValue(key));
}
function getDotEnvVars(targetEnvironment) {
	const globalRegistry = globalThis.__c12_dotenv_vars__ ||= /* @__PURE__ */ new Map();
	if (!globalRegistry.has(targetEnvironment)) globalRegistry.set(targetEnvironment, /* @__PURE__ */ new Set());
	return globalRegistry.get(targetEnvironment);
}
const _normalize = (p) => p?.replace(/\\/g, "/");
const ASYNC_LOADERS = {
	".yaml": () => import("./confbox.mjs").then((n) => n.a).then((r) => r.parseYAML),
	".yml": () => import("./confbox.mjs").then((n) => n.a).then((r) => r.parseYAML),
	".jsonc": () => import("./confbox.mjs").then((n) => n.t).then((r) => r.parseJSONC),
	".json5": () => import("./confbox.mjs").then((n) => n.o).then((r) => r.parseJSON5),
	".toml": () => import("./confbox.mjs").then((n) => n.r).then((r) => r.parseTOML)
};
const SUPPORTED_EXTENSIONS = Object.freeze([
	".js",
	".ts",
	".mjs",
	".cjs",
	".mts",
	".cts",
	".json",
	".jsonc",
	".json5",
	".yaml",
	".yml",
	".toml"
]);
async function loadConfig(options) {
	options.cwd = resolve$1(process.cwd(), options.cwd || ".");
	options.name = options.name || "config";
	options.envName = options.envName ?? process.env.NODE_ENV;
	options.configFile = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
	options.rcFile = options.rcFile ?? `.${options.name}rc`;
	if (options.extend !== false) options.extend = {
		extendKey: "extends",
		...options.extend
	};
	const _merger = options.merger || defu;
	options.jiti = options.jiti || createJiti(join$1(options.cwd, options.configFile), {
		interopDefault: true,
		moduleCache: false,
		extensions: [...SUPPORTED_EXTENSIONS],
		...options.jitiOptions
	});
	const r = {
		config: {},
		cwd: options.cwd,
		configFile: resolve$1(options.cwd, options.configFile),
		layers: [],
		_configFile: void 0
	};
	const rawConfigs = {
		overrides: options.overrides,
		main: void 0,
		rc: void 0,
		packageJson: void 0,
		defaultConfig: options.defaultConfig
	};
	if (options.dotenv) await setupDotenv({
		cwd: options.cwd,
		...options.dotenv === true ? {} : options.dotenv
	});
	const _mainConfig = await resolveConfig(".", options);
	if (_mainConfig.configFile) {
		rawConfigs.main = _mainConfig.config;
		r.configFile = _mainConfig.configFile;
		r._configFile = _mainConfig._configFile;
	}
	if (_mainConfig.meta) r.meta = _mainConfig.meta;
	if (options.rcFile) {
		const rcSources = [];
		rcSources.push(read({
			name: options.rcFile,
			dir: options.cwd
		}));
		if (options.globalRc) {
			const workspaceDir = await findWorkspaceDir(options.cwd).catch(() => {});
			if (workspaceDir) rcSources.push(read({
				name: options.rcFile,
				dir: workspaceDir
			}));
			rcSources.push(readUser({
				name: options.rcFile,
				dir: options.cwd
			}));
		}
		rawConfigs.rc = _merger({}, ...rcSources);
	}
	if (options.packageJson) {
		const keys = (Array.isArray(options.packageJson) ? options.packageJson : [typeof options.packageJson === "string" ? options.packageJson : options.name]).filter((t) => t && typeof t === "string");
		const pkgJsonFile = await readPackageJSON(options.cwd).catch(() => {});
		rawConfigs.packageJson = _merger({}, ...keys.map((key) => pkgJsonFile?.[key]));
	}
	const configs = {};
	for (const key in rawConfigs) {
		const value = rawConfigs[key];
		configs[key] = await (typeof value === "function" ? value({
			configs,
			rawConfigs
		}) : value);
	}
	if (Array.isArray(configs.main)) r.config = configs.main;
	else {
		r.config = _merger(configs.overrides, configs.main, configs.rc, configs.packageJson, configs.defaultConfig);
		if (options.extend) {
			await extendConfig(r.config, options);
			r.layers = r.config._layers;
			delete r.config._layers;
			r.config = _merger(r.config, ...r.layers.map((e) => e.config));
		}
	}
	r.layers = [...[
		configs.overrides && {
			config: configs.overrides,
			configFile: void 0,
			cwd: void 0
		},
		{
			config: configs.main,
			configFile: options.configFile,
			cwd: options.cwd
		},
		configs.rc && {
			config: configs.rc,
			configFile: options.rcFile
		},
		configs.packageJson && {
			config: configs.packageJson,
			configFile: "package.json"
		}
	].filter((l) => l && l.config), ...r.layers];
	if (options.defaults) r.config = _merger(r.config, options.defaults);
	if (options.omit$Keys) {
		for (const key in r.config) if (key.startsWith("$")) delete r.config[key];
	}
	if (options.configFileRequired && !r._configFile) throw new Error(`Required config (${r.configFile}) cannot be resolved.`);
	return r;
}
async function extendConfig(config, options) {
	config._layers = config._layers || [];
	if (!options.extend) return;
	let keys = options.extend.extendKey;
	if (typeof keys === "string") keys = [keys];
	const extendSources = [];
	for (const key of keys) {
		extendSources.push(...(Array.isArray(config[key]) ? config[key] : [config[key]]).filter(Boolean));
		delete config[key];
	}
	for (let extendSource of extendSources) {
		const originalExtendSource = extendSource;
		let sourceOptions = {};
		if (extendSource.source) {
			sourceOptions = extendSource.options || {};
			extendSource = extendSource.source;
		}
		if (Array.isArray(extendSource)) {
			sourceOptions = extendSource[1] || {};
			extendSource = extendSource[0];
		}
		if (typeof extendSource !== "string") {
			console.warn(`Cannot extend config from \`${JSON.stringify(originalExtendSource)}\` in ${options.cwd}`);
			continue;
		}
		const _config = await resolveConfig(extendSource, options, sourceOptions);
		if (!_config.config) {
			console.warn(`Cannot extend config from \`${extendSource}\` in ${options.cwd}`);
			continue;
		}
		await extendConfig(_config.config, {
			...options,
			cwd: _config.cwd
		});
		config._layers.push(_config);
		if (_config.config._layers) {
			config._layers.push(..._config.config._layers);
			delete _config.config._layers;
		}
	}
}
const GIGET_PREFIXES = [
	"gh:",
	"github:",
	"gitlab:",
	"bitbucket:",
	"https://",
	"http://"
];
const NPM_PACKAGE_RE = /^(@[\da-z~-][\d._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*($|\/.*)/;
async function resolveConfig(source, options, sourceOptions = {}) {
	if (options.resolve) {
		const res$1 = await options.resolve(source, options);
		if (res$1) return res$1;
	}
	const _merger = options.merger || defu;
	const customProviderKeys = Object.keys(sourceOptions.giget?.providers || {}).map((key) => `${key}:`);
	const gigetPrefixes = customProviderKeys.length > 0 ? [...new Set([...customProviderKeys, ...GIGET_PREFIXES])] : GIGET_PREFIXES;
	if (options.giget !== false && gigetPrefixes.some((prefix) => source.startsWith(prefix))) {
		const { downloadTemplate } = await import("./nypm+giget+tinyexec.mjs").then((n) => n.t);
		const { digest } = await import("ohash");
		const cloneName = source.replace(/\W+/g, "_").split("_").splice(0, 3).join("_") + "_" + digest(source).slice(0, 10).replace(/[-_]/g, "");
		let cloneDir;
		const localNodeModules = resolve$1(options.cwd, "node_modules");
		const parentDir = dirname$1(options.cwd);
		if (basename$1(parentDir) === ".c12") cloneDir = join$1(parentDir, cloneName);
		else if (existsSync(localNodeModules)) cloneDir = join$1(localNodeModules, ".c12", cloneName);
		else cloneDir = process.env.XDG_CACHE_HOME ? resolve$1(process.env.XDG_CACHE_HOME, "c12", cloneName) : resolve$1(homedir(), ".cache/c12", cloneName);
		if (existsSync(cloneDir) && !sourceOptions.install) await rm(cloneDir, { recursive: true });
		source = (await downloadTemplate(source, {
			dir: cloneDir,
			install: sourceOptions.install,
			force: sourceOptions.install,
			auth: sourceOptions.auth,
			...options.giget,
			...sourceOptions.giget
		})).dir;
	}
	if (NPM_PACKAGE_RE.test(source)) source = tryResolve(source, options) || source;
	const ext = extname$1(source);
	const isDir = !ext || ext === basename$1(source);
	const cwd = resolve$1(options.cwd, isDir ? source : dirname$1(source));
	if (isDir) source = options.configFile;
	const res = {
		config: void 0,
		configFile: void 0,
		cwd,
		source,
		sourceOptions
	};
	res.configFile = tryResolve(resolve$1(cwd, source), options) || tryResolve(resolve$1(cwd, ".config", source.replace(/\.config$/, "")), options) || tryResolve(resolve$1(cwd, ".config", source), options) || source;
	if (!existsSync(res.configFile)) return res;
	res._configFile = res.configFile;
	const configFileExt = extname$1(res.configFile) || "";
	if (configFileExt in ASYNC_LOADERS) res.config = (await ASYNC_LOADERS[configFileExt]())(await readFile(res.configFile, "utf8"));
	else res.config = await options.jiti.import(res.configFile, { default: true });
	if (typeof res.config === "function") res.config = await res.config(options.context);
	if (options.envName) {
		const envConfig = {
			...res.config["$" + options.envName],
			...res.config.$env?.[options.envName]
		};
		if (Object.keys(envConfig).length > 0) res.config = _merger(envConfig, res.config);
	}
	res.meta = defu(res.sourceOptions.meta, res.config.$meta);
	delete res.config.$meta;
	if (res.sourceOptions.overrides) res.config = _merger(res.sourceOptions.overrides, res.config);
	res.configFile = _normalize(res.configFile);
	res.source = _normalize(res.source);
	return res;
}
function tryResolve(id, options) {
	const res = resolveModulePath(id, {
		try: true,
		from: pathToFileURL(join$1(options.cwd || ".", options.configFile || "/")),
		suffixes: ["", "/index"],
		extensions: SUPPORTED_EXTENSIONS,
		cache: false
	});
	return res ? normalize$1(res) : void 0;
}
const eventMap = {
	add: "created",
	change: "updated",
	unlink: "removed"
};
async function watchConfig(options) {
	let config = await loadConfig(options);
	const configName = options.name || "config";
	const configFileName = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
	const watchingFiles = [...new Set((config.layers || []).filter((l) => l.cwd).flatMap((l) => [
		...SUPPORTED_EXTENSIONS.flatMap((ext) => [
			resolve$1(l.cwd, configFileName + ext),
			resolve$1(l.cwd, ".config", configFileName + ext),
			resolve$1(l.cwd, ".config", configFileName.replace(/\.config$/, "") + ext)
		]),
		l.source && resolve$1(l.cwd, l.source),
		options.rcFile && resolve$1(l.cwd, typeof options.rcFile === "string" ? options.rcFile : `.${configName}rc`),
		options.packageJson && resolve$1(l.cwd, "package.json")
	]).filter(Boolean))];
	const watch$1 = await import("./readdirp+chokidar.mjs").then((n) => n.t).then((r) => r.watch || r.default || r);
	const { diff } = await import("ohash/utils");
	const _fswatcher = watch$1(watchingFiles, {
		ignoreInitial: true,
		...options.chokidarOptions
	});
	const onChange = async (event, path$2) => {
		const type$1 = eventMap[event];
		if (!type$1) return;
		if (options.onWatch) await options.onWatch({
			type: type$1,
			path: path$2
		});
		const oldConfig = config;
		try {
			config = await loadConfig(options);
		} catch (error) {
			console.warn(`Failed to load config ${path$2}\n${error}`);
			return;
		}
		const changeCtx = {
			newConfig: config,
			oldConfig,
			getDiff: () => diff(oldConfig.config, config.config)
		};
		if (options.acceptHMR) {
			if (await options.acceptHMR(changeCtx)) return;
		}
		if (options.onUpdate) await options.onUpdate(changeCtx);
	};
	if (options.debounce === false) _fswatcher.on("all", onChange);
	else _fswatcher.on("all", debounce(onChange, options.debounce ?? 100));
	const utils = {
		watchingFiles,
		unwatch: async () => {
			await _fswatcher.close();
		}
	};
	return new Proxy(utils, { get(_, prop) {
		if (prop in utils) return utils[prop];
		return config[prop];
	} });
}

//#endregion
export { debounce as i, loadConfig as n, watchConfig as r, dist_exports as t };