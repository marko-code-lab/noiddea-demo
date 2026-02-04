import { i as __toESM, r as __require, t as __commonJSMin } from "../_common.mjs";
import { N as glob, V as a, ct as resolve, nt as dirname, p as runParallel, st as relative } from "../_build/common.mjs";
import fs, { promises } from "node:fs";
import { promisify } from "node:util";
import { colors } from "consola/utils";
import zlib from "node:zlib";
import "node:stream";

//#region node_modules/.pnpm/duplexer@0.1.2/node_modules/duplexer/index.js
var require_duplexer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stream = __require("stream");
	var writeMethods = [
		"write",
		"end",
		"destroy"
	];
	var readMethods = ["resume", "pause"];
	var readEvents = ["data", "close"];
	var slice = Array.prototype.slice;
	module.exports = duplex;
	function forEach(arr, fn) {
		if (arr.forEach) return arr.forEach(fn);
		for (var i = 0; i < arr.length; i++) fn(arr[i], i);
	}
	function duplex(writer, reader) {
		var stream = new Stream();
		var ended = false;
		forEach(writeMethods, proxyWriter);
		forEach(readMethods, proxyReader);
		forEach(readEvents, proxyStream);
		reader.on("end", handleEnd);
		writer.on("drain", function() {
			stream.emit("drain");
		});
		writer.on("error", reemit);
		reader.on("error", reemit);
		stream.writable = writer.writable;
		stream.readable = reader.readable;
		return stream;
		function proxyWriter(methodName) {
			stream[methodName] = method;
			function method() {
				return writer[methodName].apply(writer, arguments);
			}
		}
		function proxyReader(methodName) {
			stream[methodName] = method;
			function method() {
				stream.emit(methodName);
				var func = reader[methodName];
				if (func) return func.apply(reader, arguments);
				reader.emit(methodName);
			}
		}
		function proxyStream(methodName) {
			reader.on(methodName, reemit$1);
			function reemit$1() {
				var args = slice.call(arguments);
				args.unshift(methodName);
				stream.emit.apply(stream, args);
			}
		}
		function handleEnd() {
			if (ended) return;
			ended = true;
			var args = slice.call(arguments);
			args.unshift("end");
			stream.emit.apply(stream, args);
		}
		function reemit(err) {
			stream.emit("error", err);
		}
	}
}));

//#endregion
//#region node_modules/.pnpm/gzip-size@7.0.0/node_modules/gzip-size/index.js
var import_duplexer = /* @__PURE__ */ __toESM(require_duplexer(), 1);
const getOptions = (options) => ({
	level: 9,
	...options
});
const gzip = promisify(zlib.gzip);
async function gzipSize(input, options) {
	if (!input) return 0;
	return (await gzip(input, getOptions(options))).length;
}

//#endregion
//#region node_modules/.pnpm/pretty-bytes@7.1.0/node_modules/pretty-bytes/index.js
const BYTE_UNITS = [
	"B",
	"kB",
	"MB",
	"GB",
	"TB",
	"PB",
	"EB",
	"ZB",
	"YB"
];
const BIBYTE_UNITS = [
	"B",
	"KiB",
	"MiB",
	"GiB",
	"TiB",
	"PiB",
	"EiB",
	"ZiB",
	"YiB"
];
const BIT_UNITS = [
	"b",
	"kbit",
	"Mbit",
	"Gbit",
	"Tbit",
	"Pbit",
	"Ebit",
	"Zbit",
	"Ybit"
];
const BIBIT_UNITS = [
	"b",
	"kibit",
	"Mibit",
	"Gibit",
	"Tibit",
	"Pibit",
	"Eibit",
	"Zibit",
	"Yibit"
];
const toLocaleString = (number, locale, options) => {
	let result = number;
	if (typeof locale === "string" || Array.isArray(locale)) result = number.toLocaleString(locale, options);
	else if (locale === true || options !== void 0) result = number.toLocaleString(void 0, options);
	return result;
};
const log10 = (numberOrBigInt) => {
	if (typeof numberOrBigInt === "number") return Math.log10(numberOrBigInt);
	const string = numberOrBigInt.toString(10);
	return string.length + Math.log10(`0.${string.slice(0, 15)}`);
};
const log = (numberOrBigInt) => {
	if (typeof numberOrBigInt === "number") return Math.log(numberOrBigInt);
	return log10(numberOrBigInt) * Math.log(10);
};
const divide = (numberOrBigInt, divisor) => {
	if (typeof numberOrBigInt === "number") return numberOrBigInt / divisor;
	const integerPart = numberOrBigInt / BigInt(divisor);
	const remainder = numberOrBigInt % BigInt(divisor);
	return Number(integerPart) + Number(remainder) / divisor;
};
const applyFixedWidth = (result, fixedWidth) => {
	if (fixedWidth === void 0) return result;
	if (typeof fixedWidth !== "number" || !Number.isSafeInteger(fixedWidth) || fixedWidth < 0) throw new TypeError(`Expected fixedWidth to be a non-negative integer, got ${typeof fixedWidth}: ${fixedWidth}`);
	if (fixedWidth === 0) return result;
	return result.length < fixedWidth ? result.padStart(fixedWidth, " ") : result;
};
const buildLocaleOptions = (options) => {
	const { minimumFractionDigits, maximumFractionDigits } = options;
	if (minimumFractionDigits === void 0 && maximumFractionDigits === void 0) return;
	return {
		...minimumFractionDigits !== void 0 && { minimumFractionDigits },
		...maximumFractionDigits !== void 0 && { maximumFractionDigits },
		roundingMode: "trunc"
	};
};
function prettyBytes(number, options) {
	if (typeof number !== "bigint" && !Number.isFinite(number)) throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
	options = {
		bits: false,
		binary: false,
		space: true,
		nonBreakingSpace: false,
		...options
	};
	const UNITS = options.bits ? options.binary ? BIBIT_UNITS : BIT_UNITS : options.binary ? BIBYTE_UNITS : BYTE_UNITS;
	const separator = options.space ? options.nonBreakingSpace ? "\xA0" : " " : "";
	const isZero = typeof number === "number" ? number === 0 : number === 0n;
	if (options.signed && isZero) return applyFixedWidth(` 0${separator}${UNITS[0]}`, options.fixedWidth);
	const isNegative = number < 0;
	const prefix = isNegative ? "-" : options.signed ? "+" : "";
	if (isNegative) number = -number;
	const localeOptions = buildLocaleOptions(options);
	let result;
	if (number < 1) result = prefix + toLocaleString(number, options.locale, localeOptions) + separator + UNITS[0];
	else {
		const exponent = Math.min(Math.floor(options.binary ? log(number) / Math.log(1024) : log10(number) / 3), UNITS.length - 1);
		number = divide(number, (options.binary ? 1024 : 1e3) ** exponent);
		if (!localeOptions) {
			const minPrecision = Math.max(3, Math.floor(number).toString().length);
			number = number.toPrecision(minPrecision);
		}
		const numberString = toLocaleString(Number(number), options.locale, localeOptions);
		const unit = UNITS[exponent];
		result = prefix + numberString + separator + unit;
	}
	return applyFixedWidth(result, options.fixedWidth);
}

//#endregion
//#region src/utils/fs-tree.ts
async function generateFSTree(dir, options = {}) {
	if (a) return;
	const files = await glob("**/*.*", {
		cwd: dir,
		ignore: ["*.map"]
	});
	const items = [];
	await runParallel(new Set(files), async (file) => {
		const path = resolve(dir, file);
		const src = await promises.readFile(path);
		const size = src.byteLength;
		const gzip$1 = options.compressedSizes ? await gzipSize(src) : 0;
		items.push({
			file,
			path,
			size,
			gzip: gzip$1
		});
	}, { concurrency: 10 });
	items.sort((a$1, b) => a$1.path.localeCompare(b.path));
	let totalSize = 0;
	let totalGzip = 0;
	let totalNodeModulesSize = 0;
	let totalNodeModulesGzip = 0;
	let treeText = "";
	for (const [index, item] of items.entries()) {
		let dir$1 = dirname(item.file);
		if (dir$1 === ".") dir$1 = "";
		const rpath = relative(process.cwd(), item.path);
		const treeChar = index === items.length - 1 ? "└─" : "├─";
		if (item.file.includes("node_modules")) {
			totalNodeModulesSize += item.size;
			totalNodeModulesGzip += item.gzip;
			continue;
		}
		treeText += colors.gray(`  ${treeChar} ${rpath} (${prettyBytes(item.size)})`);
		if (options.compressedSizes) treeText += colors.gray(` (${prettyBytes(item.gzip)} gzip)`);
		treeText += "\n";
		totalSize += item.size;
		totalGzip += item.gzip;
	}
	treeText += `${colors.cyan("Σ Total size:")} ${prettyBytes(totalSize + totalNodeModulesSize)}`;
	if (options.compressedSizes) treeText += ` (${prettyBytes(totalGzip + totalNodeModulesGzip)} gzip)`;
	treeText += "\n";
	return treeText;
}

//#endregion
export { generateFSTree as t };