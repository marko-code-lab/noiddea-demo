import fs, { promises } from "node:fs";
import path from "node:path";
import { createRequire } from "module";

//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/util.js
const POSIX_SEP_RE = new RegExp("\\" + path.posix.sep, "g");
const NATIVE_SEP_RE = new RegExp("\\" + path.sep, "g");
/** @type {Map<string,RegExp>}*/
const PATTERN_REGEX_CACHE = /* @__PURE__ */ new Map();
const GLOB_ALL_PATTERN = `**/*`;
const TS_EXTENSIONS = [
	".ts",
	".tsx",
	".mts",
	".cts"
];
const TSJS_EXTENSIONS = TS_EXTENSIONS.concat([
	".js",
	".jsx",
	".mjs",
	".cjs"
]);
const TS_EXTENSIONS_RE_GROUP = `\\.(?:${TS_EXTENSIONS.map((ext) => ext.substring(1)).join("|")})`;
const TSJS_EXTENSIONS_RE_GROUP = `\\.(?:${TSJS_EXTENSIONS.map((ext) => ext.substring(1)).join("|")})`;
const IS_POSIX = path.posix.sep === path.sep;
/**
* @template T
* @returns {{resolve:(result:T)=>void, reject:(error:any)=>void, promise: Promise<T>}}
*/
function makePromise() {
	let resolve$1, reject;
	return {
		promise: new Promise((res, rej) => {
			resolve$1 = res;
			reject = rej;
		}),
		resolve: resolve$1,
		reject
	};
}
/**
* @param {string} filename
* @param {import('./cache.js').TSConfckCache} [cache]
* @returns {Promise<string|void>}
*/
async function resolveTSConfigJson(filename, cache) {
	if (path.extname(filename) !== ".json") return;
	const tsconfig = path.resolve(filename);
	if (cache && (cache.hasParseResult(tsconfig) || cache.hasParseResult(filename))) return tsconfig;
	return promises.stat(tsconfig).then((stat$1) => {
		if (stat$1.isFile() || stat$1.isFIFO()) return tsconfig;
		else throw new Error(`${filename} exists but is not a regular file.`);
	});
}
/**
*
* @param {string} dir an absolute directory path
* @returns {boolean}  if dir path includes a node_modules segment
*/
const isInNodeModules = IS_POSIX ? (dir) => dir.includes("/node_modules/") : (dir) => dir.match(/[/\\]node_modules[/\\]/);
/**
* convert posix separator to native separator
*
* eg.
* windows: C:/foo/bar -> c:\foo\bar
* linux: /foo/bar -> /foo/bar
*
* @param {string} filename with posix separators
* @returns {string} filename with native separators
*/
const posix2native = IS_POSIX ? (filename) => filename : (filename) => filename.replace(POSIX_SEP_RE, path.sep);
/**
* convert native separator to posix separator
*
* eg.
* windows: C:\foo\bar -> c:/foo/bar
* linux: /foo/bar -> /foo/bar
*
* @param {string} filename - filename with native separators
* @returns {string} filename with posix separators
*/
const native2posix = IS_POSIX ? (filename) => filename : (filename) => filename.replace(NATIVE_SEP_RE, path.posix.sep);
/**
* converts params to native separator, resolves path and converts native back to posix
*
* needed on windows to handle posix paths in tsconfig
*
* @param dir {string|null} directory to resolve from
* @param filename {string} filename or pattern to resolve
* @returns string
*/
const resolve2posix = IS_POSIX ? (dir, filename) => dir ? path.resolve(dir, filename) : path.resolve(filename) : (dir, filename) => native2posix(dir ? path.resolve(posix2native(dir), posix2native(filename)) : path.resolve(posix2native(filename)));
/**
*
* @param {import('./public.d.ts').TSConfckParseResult} result
* @param {import('./public.d.ts').TSConfckParseOptions} [options]
* @returns {string[]}
*/
function resolveReferencedTSConfigFiles(result, options) {
	const dir = path.dirname(result.tsconfigFile);
	return result.tsconfig.references.map((ref) => {
		return resolve2posix(dir, ref.path.endsWith(".json") ? ref.path : path.join(ref.path, options?.configName ?? "tsconfig.json"));
	});
}
/**
* @param {string} filename
* @param {import('./public.d.ts').TSConfckParseResult} result
* @returns {import('./public.d.ts').TSConfckParseResult}
*/
function resolveSolutionTSConfig(filename, result) {
	const extensions = result.tsconfig.compilerOptions?.allowJs ? TSJS_EXTENSIONS : TS_EXTENSIONS;
	if (result.referenced && extensions.some((ext) => filename.endsWith(ext)) && !isIncluded(filename, result)) {
		const solutionTSConfig = result.referenced.find((referenced) => isIncluded(filename, referenced));
		if (solutionTSConfig) return solutionTSConfig;
	}
	return result;
}
/**
*
* @param {string} filename
* @param {import('./public.d.ts').TSConfckParseResult} result
* @returns {boolean}
*/
function isIncluded(filename, result) {
	const dir = native2posix(path.dirname(result.tsconfigFile));
	const files = (result.tsconfig.files || []).map((file) => resolve2posix(dir, file));
	const absoluteFilename = resolve2posix(null, filename);
	if (files.includes(filename)) return true;
	const allowJs = result.tsconfig.compilerOptions?.allowJs;
	if (isGlobMatch(absoluteFilename, dir, result.tsconfig.include || (result.tsconfig.files ? [] : [GLOB_ALL_PATTERN]), allowJs)) return !isGlobMatch(absoluteFilename, dir, result.tsconfig.exclude || [], allowJs);
	return false;
}
/**
* test filenames agains glob patterns in tsconfig
*
* @param filename {string} posix style abolute path to filename to test
* @param dir {string} posix style absolute path to directory of tsconfig containing patterns
* @param patterns {string[]} glob patterns to match against
* @param allowJs {boolean} allowJs setting in tsconfig to include js extensions in checks
* @returns {boolean} true when at least one pattern matches filename
*/
function isGlobMatch(filename, dir, patterns, allowJs) {
	const extensions = allowJs ? TSJS_EXTENSIONS : TS_EXTENSIONS;
	return patterns.some((pattern) => {
		let lastWildcardIndex = pattern.length;
		let hasWildcard = false;
		let hasExtension = false;
		let hasSlash = false;
		let lastSlashIndex = -1;
		for (let i = pattern.length - 1; i > -1; i--) {
			const c = pattern[i];
			if (!hasWildcard) {
				if (c === "*" || c === "?") {
					lastWildcardIndex = i;
					hasWildcard = true;
				}
			}
			if (!hasSlash) {
				if (c === ".") hasExtension = true;
				else if (c === "/") {
					lastSlashIndex = i;
					hasSlash = true;
				}
			}
			if (hasWildcard && hasSlash) break;
		}
		if (!hasExtension && (!hasWildcard || lastWildcardIndex < lastSlashIndex)) {
			pattern += `${pattern.endsWith("/") ? "" : "/"}${GLOB_ALL_PATTERN}`;
			lastWildcardIndex = pattern.length - 1;
			hasWildcard = true;
		}
		if (lastWildcardIndex < pattern.length - 1 && !filename.endsWith(pattern.slice(lastWildcardIndex + 1))) return false;
		if (pattern.endsWith("*") && !extensions.some((ext) => filename.endsWith(ext))) return false;
		if (pattern === GLOB_ALL_PATTERN) return filename.startsWith(`${dir}/`);
		const resolvedPattern = resolve2posix(dir, pattern);
		let firstWildcardIndex = -1;
		for (let i = 0; i < resolvedPattern.length; i++) if (resolvedPattern[i] === "*" || resolvedPattern[i] === "?") {
			firstWildcardIndex = i;
			hasWildcard = true;
			break;
		}
		if (firstWildcardIndex > 1 && !filename.startsWith(resolvedPattern.slice(0, firstWildcardIndex - 1))) return false;
		if (!hasWildcard) return filename === resolvedPattern;
		else if (firstWildcardIndex + GLOB_ALL_PATTERN.length === resolvedPattern.length - (pattern.length - 1 - lastWildcardIndex) && resolvedPattern.slice(firstWildcardIndex, firstWildcardIndex + GLOB_ALL_PATTERN.length) === GLOB_ALL_PATTERN) return true;
		if (PATTERN_REGEX_CACHE.has(resolvedPattern)) return PATTERN_REGEX_CACHE.get(resolvedPattern).test(filename);
		const regex = pattern2regex(resolvedPattern, allowJs);
		PATTERN_REGEX_CACHE.set(resolvedPattern, regex);
		return regex.test(filename);
	});
}
/**
* @param {string} resolvedPattern
* @param {boolean} allowJs
* @returns {RegExp}
*/
function pattern2regex(resolvedPattern, allowJs) {
	let regexStr = "^";
	for (let i = 0; i < resolvedPattern.length; i++) {
		const char = resolvedPattern[i];
		if (char === "?") {
			regexStr += "[^\\/]";
			continue;
		}
		if (char === "*") {
			if (resolvedPattern[i + 1] === "*" && resolvedPattern[i + 2] === "/") {
				i += 2;
				regexStr += "(?:[^\\/]*\\/)*";
				continue;
			}
			regexStr += "[^\\/]*";
			continue;
		}
		if ("/.+^${}()|[]\\".includes(char)) regexStr += `\\`;
		regexStr += char;
	}
	if (resolvedPattern.endsWith("*")) regexStr += allowJs ? TSJS_EXTENSIONS_RE_GROUP : TS_EXTENSIONS_RE_GROUP;
	regexStr += "$";
	return new RegExp(regexStr);
}
/**
* replace tokens like ${configDir}
* @param {import('./public.d.ts').TSConfckParseResult} result
*/
function replaceTokens(result) {
	if (result.tsconfig) result.tsconfig = JSON.parse(JSON.stringify(result.tsconfig).replaceAll(/"\${configDir}/g, `"${native2posix(path.dirname(result.tsconfigFile))}`));
}

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/find.js
/**
* find the closest tsconfig.json file
*
* @param {string} filename - path to file to find tsconfig for (absolute or relative to cwd)
* @param {import('./public.d.ts').TSConfckFindOptions} [options] - options
* @returns {Promise<string|null>} absolute path to closest tsconfig.json or null if not found
*/
async function find(filename, options) {
	let dir = path.dirname(path.resolve(filename));
	if (options?.ignoreNodeModules && isInNodeModules(dir)) return null;
	const cache = options?.cache;
	const configName = options?.configName ?? "tsconfig.json";
	if (cache?.hasConfigPath(dir, configName)) return cache.getConfigPath(dir, configName);
	const { promise, resolve: resolve$1, reject } = makePromise();
	if (options?.root && !path.isAbsolute(options.root)) options.root = path.resolve(options.root);
	findUp(dir, {
		promise,
		resolve: resolve$1,
		reject
	}, options);
	return promise;
}
/**
*
* @param {string} dir
* @param {{promise:Promise<string|null>,resolve:(result:string|null)=>void,reject:(err:any)=>void}} madePromise
* @param {import('./public.d.ts').TSConfckFindOptions} [options] - options
*/
function findUp(dir, { resolve: resolve$1, reject, promise }, options) {
	const { cache, root, configName } = options ?? {};
	if (cache) if (cache.hasConfigPath(dir, configName)) {
		let cached;
		try {
			cached = cache.getConfigPath(dir, configName);
		} catch (e) {
			reject(e);
			return;
		}
		if (cached?.then) cached.then(resolve$1).catch(reject);
		else resolve$1(cached);
	} else cache.setConfigPath(dir, promise, configName);
	const tsconfig = path.join(dir, options?.configName ?? "tsconfig.json");
	fs.stat(tsconfig, (err, stats) => {
		if (stats && (stats.isFile() || stats.isFIFO())) resolve$1(tsconfig);
		else if (err?.code !== "ENOENT") reject(err);
		else {
			let parent;
			if (root === dir || (parent = path.dirname(dir)) === dir) resolve$1(null);
			else findUp(parent, {
				promise,
				resolve: resolve$1,
				reject
			}, options);
		}
	});
}

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/find-all.js
/**
* @typedef WalkState
* @interface
* @property {string[]} files - files
* @property {number} calls - number of ongoing calls
* @property {(dir: string)=>boolean} skip - function to skip dirs
* @property {boolean} err - error flag
* @property {string[]} configNames - config file names
*/
const sep$1 = path.sep;

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/to-json.js
/**
* convert content of tsconfig.json to regular json
*
* @param {string} tsconfigJson - content of tsconfig.json
* @returns {string} content as regular json, comments and dangling commas have been replaced with whitespace
*/
function toJson(tsconfigJson) {
	const stripped = stripDanglingComma(stripJsonComments(stripBom(tsconfigJson)));
	if (stripped.trim() === "") return "{}";
	else return stripped;
}
/**
* replace dangling commas from pseudo-json string with single space
* implementation heavily inspired by strip-json-comments
*
* @param {string} pseudoJson
* @returns {string}
*/
function stripDanglingComma(pseudoJson) {
	let insideString = false;
	let offset = 0;
	let result = "";
	let danglingCommaPos = null;
	for (let i = 0; i < pseudoJson.length; i++) {
		const currentCharacter = pseudoJson[i];
		if (currentCharacter === "\"") {
			if (!isEscaped(pseudoJson, i)) insideString = !insideString;
		}
		if (insideString) {
			danglingCommaPos = null;
			continue;
		}
		if (currentCharacter === ",") {
			danglingCommaPos = i;
			continue;
		}
		if (danglingCommaPos) {
			if (currentCharacter === "}" || currentCharacter === "]") {
				result += pseudoJson.slice(offset, danglingCommaPos) + " ";
				offset = danglingCommaPos + 1;
				danglingCommaPos = null;
			} else if (!currentCharacter.match(/\s/)) danglingCommaPos = null;
		}
	}
	return result + pseudoJson.substring(offset);
}
/**
*
* @param {string} jsonString
* @param {number} quotePosition
* @returns {boolean}
*/
function isEscaped(jsonString, quotePosition) {
	let index = quotePosition - 1;
	let backslashCount = 0;
	while (jsonString[index] === "\\") {
		index -= 1;
		backslashCount += 1;
	}
	return Boolean(backslashCount % 2);
}
/**
*
* @param {string} string
* @param {number?} start
* @param {number?} end
*/
function strip(string, start, end) {
	return string.slice(start, end).replace(/\S/g, " ");
}
const singleComment = Symbol("singleComment");
const multiComment = Symbol("multiComment");
/**
* @param {string} jsonString
* @returns {string}
*/
function stripJsonComments(jsonString) {
	let isInsideString = false;
	/** @type {false | symbol} */
	let isInsideComment = false;
	let offset = 0;
	let result = "";
	for (let index = 0; index < jsonString.length; index++) {
		const currentCharacter = jsonString[index];
		const nextCharacter = jsonString[index + 1];
		if (!isInsideComment && currentCharacter === "\"") {
			if (!isEscaped(jsonString, index)) isInsideString = !isInsideString;
		}
		if (isInsideString) continue;
		if (!isInsideComment && currentCharacter + nextCharacter === "//") {
			result += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = singleComment;
			index++;
		} else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
			index++;
			isInsideComment = false;
			result += strip(jsonString, offset, index);
			offset = index;
		} else if (isInsideComment === singleComment && currentCharacter === "\n") {
			isInsideComment = false;
			result += strip(jsonString, offset, index);
			offset = index;
		} else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
			result += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = multiComment;
			index++;
		} else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
			index++;
			isInsideComment = false;
			result += strip(jsonString, offset, index + 1);
			offset = index + 1;
		}
	}
	return result + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}
/**
* @param {string} string
* @returns {string}
*/
function stripBom(string) {
	if (string.charCodeAt(0) === 65279) return string.slice(1);
	return string;
}

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/parse.js
const not_found_result = {
	tsconfigFile: null,
	tsconfig: {}
};
/**
* parse the closest tsconfig.json file
*
* @param {string} filename - path to a tsconfig .json or a source file or directory (absolute or relative to cwd)
* @param {import('./public.d.ts').TSConfckParseOptions} [options] - options
* @returns {Promise<import('./public.d.ts').TSConfckParseResult>}
* @throws {TSConfckParseError}
*/
async function parse(filename, options) {
	/** @type {import('./cache.js').TSConfckCache} */
	const cache = options?.cache;
	if (cache?.hasParseResult(filename)) return getParsedDeep(filename, cache, options);
	const { resolve: resolve$1, reject, promise } = makePromise();
	cache?.setParseResult(filename, promise, true);
	try {
		let tsconfigFile = await resolveTSConfigJson(filename, cache) || await find(filename, options);
		if (!tsconfigFile) {
			resolve$1(not_found_result);
			return promise;
		}
		let result;
		if (filename !== tsconfigFile && cache?.hasParseResult(tsconfigFile)) result = await getParsedDeep(tsconfigFile, cache, options);
		else {
			result = await parseFile(tsconfigFile, cache, filename === tsconfigFile);
			await Promise.all([parseExtends(result, cache), parseReferences(result, options)]);
		}
		replaceTokens(result);
		resolve$1(resolveSolutionTSConfig(filename, result));
	} catch (e) {
		reject(e);
	}
	return promise;
}
/**
* ensure extends and references are parsed
*
* @param {string} filename - cached file
* @param {import('./cache.js').TSConfckCache} cache - cache
* @param {import('./public.d.ts').TSConfckParseOptions} options - options
*/
async function getParsedDeep(filename, cache, options) {
	const result = await cache.getParseResult(filename);
	if (result.tsconfig.extends && !result.extended || result.tsconfig.references && !result.referenced) {
		const promise = Promise.all([parseExtends(result, cache), parseReferences(result, options)]).then(() => result);
		cache.setParseResult(filename, promise, true);
		return promise;
	}
	return result;
}
/**
*
* @param {string} tsconfigFile - path to tsconfig file
* @param {import('./cache.js').TSConfckCache} [cache] - cache
* @param {boolean} [skipCache] - skip cache
* @returns {Promise<import('./public.d.ts').TSConfckParseResult>}
*/
async function parseFile(tsconfigFile, cache, skipCache) {
	if (!skipCache && cache?.hasParseResult(tsconfigFile) && !cache.getParseResult(tsconfigFile)._isRootFile_) return cache.getParseResult(tsconfigFile);
	const promise = promises.readFile(tsconfigFile, "utf-8").then(toJson).then((json) => {
		const parsed = JSON.parse(json);
		applyDefaults(parsed, tsconfigFile);
		return {
			tsconfigFile,
			tsconfig: normalizeTSConfig(parsed, path.dirname(tsconfigFile))
		};
	}).catch((e) => {
		throw new TSConfckParseError(`parsing ${tsconfigFile} failed: ${e}`, "PARSE_FILE", tsconfigFile, e);
	});
	if (!skipCache && (!cache?.hasParseResult(tsconfigFile) || !cache.getParseResult(tsconfigFile)._isRootFile_)) cache?.setParseResult(tsconfigFile, promise);
	return promise;
}
/**
* normalize to match the output of ts.parseJsonConfigFileContent
*
* @param {any} tsconfig - typescript tsconfig output
* @param {string} dir - directory
*/
function normalizeTSConfig(tsconfig, dir) {
	const baseUrl = tsconfig.compilerOptions?.baseUrl;
	if (baseUrl && !baseUrl.startsWith("${") && !path.isAbsolute(baseUrl)) tsconfig.compilerOptions.baseUrl = resolve2posix(dir, baseUrl);
	return tsconfig;
}
/**
*
* @param {import('./public.d.ts').TSConfckParseResult} result
* @param {import('./public.d.ts').TSConfckParseOptions} [options]
* @returns {Promise<void>}
*/
async function parseReferences(result, options) {
	if (!result.tsconfig.references) return;
	const referencedFiles = resolveReferencedTSConfigFiles(result, options);
	const referenced = await Promise.all(referencedFiles.map((file) => parseFile(file, options?.cache)));
	await Promise.all(referenced.map((ref) => parseExtends(ref, options?.cache)));
	referenced.forEach((ref) => {
		ref.solution = result;
		replaceTokens(ref);
	});
	result.referenced = referenced;
}
/**
* @param {import('./public.d.ts').TSConfckParseResult} result
* @param {import('./cache.js').TSConfckCache}[cache]
* @returns {Promise<void>}
*/
async function parseExtends(result, cache) {
	if (!result.tsconfig.extends) return;
	/** @type {import('./public.d.ts').TSConfckParseResult[]} */
	const extended = [{
		tsconfigFile: result.tsconfigFile,
		tsconfig: JSON.parse(JSON.stringify(result.tsconfig))
	}];
	let pos = 0;
	/** @type {string[]} */
	const extendsPath = [];
	let currentBranchDepth = 0;
	while (pos < extended.length) {
		const extending = extended[pos];
		extendsPath.push(extending.tsconfigFile);
		if (extending.tsconfig.extends) {
			currentBranchDepth += 1;
			/** @type {string[]} */
			let resolvedExtends;
			if (!Array.isArray(extending.tsconfig.extends)) resolvedExtends = [resolveExtends(extending.tsconfig.extends, extending.tsconfigFile)];
			else resolvedExtends = extending.tsconfig.extends.reverse().map((ex) => resolveExtends(ex, extending.tsconfigFile));
			const circularExtends = resolvedExtends.find((tsconfigFile) => extendsPath.includes(tsconfigFile));
			if (circularExtends) throw new TSConfckParseError(`Circular dependency in "extends": ${extendsPath.concat([circularExtends]).join(" -> ")}`, "EXTENDS_CIRCULAR", result.tsconfigFile);
			extended.splice(pos + 1, 0, ...await Promise.all(resolvedExtends.map((file) => parseFile(file, cache))));
		} else {
			extendsPath.splice(-currentBranchDepth);
			currentBranchDepth = 0;
		}
		pos = pos + 1;
	}
	result.extended = extended;
	for (const ext of result.extended.slice(1)) extendTSConfig(result, ext);
}
/**
*
* @param {string} extended
* @param {string} from
* @returns {string}
*/
function resolveExtends(extended, from) {
	if ([".", ".."].includes(extended)) extended = extended + "/tsconfig.json";
	const req = createRequire(from);
	let error;
	try {
		return req.resolve(extended);
	} catch (e) {
		error = e;
	}
	if (extended[0] !== "." && !path.isAbsolute(extended)) try {
		return req.resolve(`${extended}/tsconfig.json`);
	} catch (e) {
		error = e;
	}
	throw new TSConfckParseError(`failed to resolve "extends":"${extended}" in ${from}`, "EXTENDS_RESOLVE", from, error);
}
const EXTENDABLE_KEYS = [
	"compilerOptions",
	"files",
	"include",
	"exclude",
	"watchOptions",
	"compileOnSave",
	"typeAcquisition",
	"buildOptions"
];
/**
*
* @param {import('./public.d.ts').TSConfckParseResult} extending
* @param {import('./public.d.ts').TSConfckParseResult} extended
* @returns void
*/
function extendTSConfig(extending, extended) {
	const extendingConfig = extending.tsconfig;
	const extendedConfig = extended.tsconfig;
	const relativePath = native2posix(path.relative(path.dirname(extending.tsconfigFile), path.dirname(extended.tsconfigFile)));
	for (const key of Object.keys(extendedConfig).filter((key$1) => EXTENDABLE_KEYS.includes(key$1))) if (key === "compilerOptions") {
		if (!extendingConfig.compilerOptions) extendingConfig.compilerOptions = {};
		for (const option of Object.keys(extendedConfig.compilerOptions)) {
			if (Object.prototype.hasOwnProperty.call(extendingConfig.compilerOptions, option)) continue;
			extendingConfig.compilerOptions[option] = rebaseRelative(option, extendedConfig.compilerOptions[option], relativePath);
		}
	} else if (extendingConfig[key] === void 0) if (key === "watchOptions") {
		extendingConfig.watchOptions = {};
		for (const option of Object.keys(extendedConfig.watchOptions)) extendingConfig.watchOptions[option] = rebaseRelative(option, extendedConfig.watchOptions[option], relativePath);
	} else extendingConfig[key] = rebaseRelative(key, extendedConfig[key], relativePath);
}
const REBASE_KEYS = [
	"files",
	"include",
	"exclude",
	"baseUrl",
	"rootDir",
	"rootDirs",
	"typeRoots",
	"outDir",
	"outFile",
	"declarationDir",
	"excludeDirectories",
	"excludeFiles"
];
/** @typedef {string | string[]} PathValue */
/**
*
* @param {string} key
* @param {PathValue} value
* @param {string} prependPath
* @returns {PathValue}
*/
function rebaseRelative(key, value, prependPath) {
	if (!REBASE_KEYS.includes(key)) return value;
	if (Array.isArray(value)) return value.map((x) => rebasePath(x, prependPath));
	else return rebasePath(value, prependPath);
}
/**
*
* @param {string} value
* @param {string} prependPath
* @returns {string}
*/
function rebasePath(value, prependPath) {
	if (path.isAbsolute(value) || value.startsWith("${configDir}")) return value;
	else return path.posix.normalize(path.posix.join(prependPath, value));
}
var TSConfckParseError = class TSConfckParseError extends Error {
	/**
	* error code
	* @type {string}
	*/
	code;
	/**
	* error cause
	* @type { Error | undefined}
	*/
	cause;
	/**
	* absolute path of tsconfig file where the error happened
	* @type {string}
	*/
	tsconfigFile;
	/**
	*
	* @param {string} message - error message
	* @param {string} code - error code
	* @param {string} tsconfigFile - path to tsconfig file
	* @param {Error?} cause - cause of this error
	*/
	constructor(message, code, tsconfigFile, cause) {
		super(message);
		Object.setPrototypeOf(this, TSConfckParseError.prototype);
		this.name = TSConfckParseError.name;
		this.code = code;
		this.cause = cause;
		this.tsconfigFile = tsconfigFile;
	}
};
/**
*
* @param {any} tsconfig
* @param {string} tsconfigFile
*/
function applyDefaults(tsconfig, tsconfigFile) {
	if (isJSConfig(tsconfigFile)) tsconfig.compilerOptions = {
		...DEFAULT_JSCONFIG_COMPILER_OPTIONS,
		...tsconfig.compilerOptions
	};
}
const DEFAULT_JSCONFIG_COMPILER_OPTIONS = {
	allowJs: true,
	maxNodeModuleJsDepth: 2,
	allowSyntheticDefaultImports: true,
	skipLibCheck: true,
	noEmit: true
};
/**
* @param {string} configFileName
*/
function isJSConfig(configFileName) {
	return path.basename(configFileName) === "jsconfig.json";
}

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/parse-native.js
/** @typedef TSDiagnosticError {
code: number;
category: number;
messageText: string;
start?: number;
} TSDiagnosticError */

//#endregion
//#region node_modules/.pnpm/tsconfck@3.1.6_typescript@5.9.3/node_modules/tsconfck/src/cache.js
/** @template T */
var TSConfckCache = class {
	/**
	* clear cache, use this if you have a long running process and tsconfig files have been added,changed or deleted
	*/
	clear() {
		this.#configPaths.clear();
		this.#parsed.clear();
	}
	/**
	* has cached closest config for files in dir
	* @param {string} dir
	* @param {string} [configName=tsconfig.json]
	* @returns {boolean}
	*/
	hasConfigPath(dir, configName = "tsconfig.json") {
		return this.#configPaths.has(`${dir}/${configName}`);
	}
	/**
	* get cached closest tsconfig for files in dir
	* @param {string} dir
	* @param {string} [configName=tsconfig.json]
	* @returns {Promise<string|null>|string|null}
	* @throws {unknown} if cached value is an error
	*/
	getConfigPath(dir, configName = "tsconfig.json") {
		const key = `${dir}/${configName}`;
		const value = this.#configPaths.get(key);
		if (value == null || value.length || value.then) return value;
		else throw value;
	}
	/**
	* has parsed tsconfig for file
	* @param {string} file
	* @returns {boolean}
	*/
	hasParseResult(file) {
		return this.#parsed.has(file);
	}
	/**
	* get parsed tsconfig for file
	* @param {string} file
	* @returns {Promise<T>|T}
	* @throws {unknown} if cached value is an error
	*/
	getParseResult(file) {
		const value = this.#parsed.get(file);
		if (value.then || value.tsconfig) return value;
		else throw value;
	}
	/**
	* @internal
	* @private
	* @param file
	* @param {boolean} isRootFile a flag to check if current file which involking the parse() api, used to distinguish the normal cache which only parsed by parseFile()
	* @param {Promise<T>} result
	*/
	setParseResult(file, result, isRootFile = false) {
		Object.defineProperty(result, "_isRootFile_", {
			value: isRootFile,
			writable: false,
			enumerable: false,
			configurable: false
		});
		this.#parsed.set(file, result);
		result.then((parsed) => {
			if (this.#parsed.get(file) === result) this.#parsed.set(file, parsed);
		}).catch((e) => {
			if (this.#parsed.get(file) === result) this.#parsed.set(file, e);
		});
	}
	/**
	* @internal
	* @private
	* @param {string} dir
	* @param {Promise<string|null>} configPath
	* @param {string} [configName=tsconfig.json]
	*/
	setConfigPath(dir, configPath, configName = "tsconfig.json") {
		const key = `${dir}/${configName}`;
		this.#configPaths.set(key, configPath);
		configPath.then((path$1) => {
			if (this.#configPaths.get(key) === configPath) this.#configPaths.set(key, path$1);
		}).catch((e) => {
			if (this.#configPaths.get(key) === configPath) this.#configPaths.set(key, e);
		});
	}
	/**
	* map directories to their closest tsconfig.json
	* @internal
	* @private
	* @type{Map<string,(Promise<string|null>|string|null)>}
	*/
	#configPaths = /* @__PURE__ */ new Map();
	/**
	* map files to their parsed tsconfig result
	* @internal
	* @private
	* @type {Map<string,(Promise<T>|T)> }
	*/
	#parsed = /* @__PURE__ */ new Map();
};

//#endregion
export { parse as n, TSConfckCache as t };