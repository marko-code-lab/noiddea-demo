import { n as __exportAll } from "../_common.mjs";
import { at as join$2, ct as resolve$2, nt as dirname$2, ot as normalize$2, tt as basename$2 } from "../_build/common.mjs";
import { createRequire } from "node:module";
import { createWriteStream, existsSync, readdirSync, renameSync } from "node:fs";
import nativeFs from "fs";
import path from "path";
import Ds from "crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { delimiter, dirname as dirname$1, join as join$1, normalize as normalize$1, resolve as resolve$1 } from "node:path";
import { cwd } from "node:process";
import { promisify } from "node:util";
import { defu } from "defu";
import { createRequire as createRequire$1 } from "module";
import { PassThrough, pipeline } from "node:stream";
import { spawn } from "node:child_process";
import j$1 from "assert";
import nt from "events";
import ot from "stream";
import ht from "string_decoder";
import P from "buffer";
import O$2 from "zlib";
import nt$1 from "process";
import a$a from "util";
import c from "node:readline";

//#region node_modules/.pnpm/tinyexec@1.0.2/node_modules/tinyexec/dist/main.js
var l$2 = Object.create;
var u$5 = Object.defineProperty;
var d = Object.getOwnPropertyDescriptor;
var f$4 = Object.getOwnPropertyNames;
var p$1 = Object.getPrototypeOf;
var m$3 = Object.prototype.hasOwnProperty;
var h$1 = (e$7, t$7) => () => (t$7 || e$7((t$7 = { exports: {} }).exports, t$7), t$7.exports);
var g = (e$7, t$7, n$4, r) => {
	if (t$7 && typeof t$7 === "object" || typeof t$7 === "function") for (var i$8 = f$4(t$7), a$11 = 0, o$6 = i$8.length, s$8; a$11 < o$6; a$11++) {
		s$8 = i$8[a$11];
		if (!m$3.call(e$7, s$8) && s$8 !== n$4) u$5(e$7, s$8, {
			get: ((e$8) => t$7[e$8]).bind(null, s$8),
			enumerable: !(r = d(t$7, s$8)) || r.enumerable
		});
	}
	return e$7;
};
var _$1 = (e$7, t$7, n$4) => (n$4 = e$7 != null ? l$2(p$1(e$7)) : {}, g(t$7 || !e$7 || !e$7.__esModule ? u$5(n$4, "default", {
	value: e$7,
	enumerable: true
}) : n$4, e$7));
var v$2 = /* @__PURE__ */ createRequire$1(import.meta.url);
const y$3 = /^path$/i;
const b = {
	key: "PATH",
	value: ""
};
function x(e$7) {
	for (const t$7 in e$7) {
		if (!Object.prototype.hasOwnProperty.call(e$7, t$7) || !y$3.test(t$7)) continue;
		const n$4 = e$7[t$7];
		if (!n$4) return b;
		return {
			key: t$7,
			value: n$4
		};
	}
	return b;
}
function S$1(e$7, t$7) {
	const i$8 = t$7.value.split(delimiter);
	let o$6 = e$7;
	let s$8;
	do {
		i$8.push(resolve$1(o$6, "node_modules", ".bin"));
		s$8 = o$6;
		o$6 = dirname$1(o$6);
	} while (o$6 !== s$8);
	return {
		key: t$7.key,
		value: i$8.join(delimiter)
	};
}
function C$1(e$7, t$7) {
	const n$4 = {
		...process.env,
		...t$7
	};
	const r = S$1(e$7, x(n$4));
	n$4[r.key] = r.value;
	return n$4;
}
const w$2 = (e$7) => {
	let t$7 = e$7.length;
	const n$4 = new PassThrough();
	const r = () => {
		if (--t$7 === 0) n$4.emit("end");
	};
	for (const t$8 of e$7) {
		t$8.pipe(n$4, { end: false });
		t$8.on("end", r);
	}
	return n$4;
};
var T$1 = h$1((exports, t$7) => {
	t$7.exports = a$11;
	a$11.sync = o$6;
	var n$4 = v$2("fs");
	function r(e$7, t$8) {
		var n$5 = t$8.pathExt !== void 0 ? t$8.pathExt : process.env.PATHEXT;
		if (!n$5) return true;
		n$5 = n$5.split(";");
		if (n$5.indexOf("") !== -1) return true;
		for (var r$3 = 0; r$3 < n$5.length; r$3++) {
			var i$9 = n$5[r$3].toLowerCase();
			if (i$9 && e$7.substr(-i$9.length).toLowerCase() === i$9) return true;
		}
		return false;
	}
	function i$8(e$7, t$8, n$5) {
		if (!e$7.isSymbolicLink() && !e$7.isFile()) return false;
		return r(t$8, n$5);
	}
	function a$11(e$7, t$8, r$3) {
		n$4.stat(e$7, function(n$5, a$12) {
			r$3(n$5, n$5 ? false : i$8(a$12, e$7, t$8));
		});
	}
	function o$6(e$7, t$8) {
		return i$8(n$4.statSync(e$7), e$7, t$8);
	}
});
var E$1 = h$1((exports, t$7) => {
	t$7.exports = r;
	r.sync = i$8;
	var n$4 = v$2("fs");
	function r(e$7, t$8, r$3) {
		n$4.stat(e$7, function(e$8, n$5) {
			r$3(e$8, e$8 ? false : a$11(n$5, t$8));
		});
	}
	function i$8(e$7, t$8) {
		return a$11(n$4.statSync(e$7), t$8);
	}
	function a$11(e$7, t$8) {
		return e$7.isFile() && o$6(e$7, t$8);
	}
	function o$6(e$7, t$8) {
		var n$5 = e$7.mode;
		var r$3 = e$7.uid;
		var i$9 = e$7.gid;
		var a$12 = t$8.uid !== void 0 ? t$8.uid : process.getuid && process.getuid();
		var o$7 = t$8.gid !== void 0 ? t$8.gid : process.getgid && process.getgid();
		var s$8 = parseInt("100", 8);
		var c$6 = parseInt("010", 8);
		var l$3 = parseInt("001", 8);
		var u$6 = s$8 | c$6;
		return n$5 & l$3 || n$5 & c$6 && i$9 === o$7 || n$5 & s$8 && r$3 === a$12 || n$5 & u$6 && a$12 === 0;
	}
});
var D = h$1((exports, t$7) => {
	v$2("fs");
	var r;
	if (process.platform === "win32" || global.TESTING_WINDOWS) r = T$1();
	else r = E$1();
	t$7.exports = i$8;
	i$8.sync = a$11;
	function i$8(e$7, t$8, n$4) {
		if (typeof t$8 === "function") {
			n$4 = t$8;
			t$8 = {};
		}
		if (!n$4) {
			if (typeof Promise !== "function") throw new TypeError("callback not provided");
			return new Promise(function(n$5, r$3) {
				i$8(e$7, t$8 || {}, function(e$8, t$9) {
					if (e$8) r$3(e$8);
					else n$5(t$9);
				});
			});
		}
		r(e$7, t$8 || {}, function(e$8, r$3) {
			if (e$8) {
				if (e$8.code === "EACCES" || t$8 && t$8.ignoreErrors) {
					e$8 = null;
					r$3 = false;
				}
			}
			n$4(e$8, r$3);
		});
	}
	function a$11(e$7, t$8) {
		try {
			return r.sync(e$7, t$8 || {});
		} catch (e$8) {
			if (t$8 && t$8.ignoreErrors || e$8.code === "EACCES") return false;
			else throw e$8;
		}
	}
});
var O$3 = h$1((exports, t$7) => {
	const n$4 = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
	const r = v$2("path");
	const i$8 = n$4 ? ";" : ":";
	const a$11 = D();
	const o$6 = (e$7) => Object.assign(/* @__PURE__ */ new Error(`not found: ${e$7}`), { code: "ENOENT" });
	const s$8 = (e$7, t$8) => {
		const r$3 = t$8.colon || i$8;
		const a$12 = e$7.match(/\//) || n$4 && e$7.match(/\\/) ? [""] : [...n$4 ? [process.cwd()] : [], ...(t$8.path || process.env.PATH || "").split(r$3)];
		const o$7 = n$4 ? t$8.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
		const s$9 = n$4 ? o$7.split(r$3) : [""];
		if (n$4) {
			if (e$7.indexOf(".") !== -1 && s$9[0] !== "") s$9.unshift("");
		}
		return {
			pathEnv: a$12,
			pathExt: s$9,
			pathExtExe: o$7
		};
	};
	const c$6 = (e$7, t$8, n$5) => {
		if (typeof t$8 === "function") {
			n$5 = t$8;
			t$8 = {};
		}
		if (!t$8) t$8 = {};
		const { pathEnv: i$9, pathExt: c$7, pathExtExe: l$4 } = s$8(e$7, t$8);
		const u$6 = [];
		const d = (n$6) => new Promise((a$12, s$9) => {
			if (n$6 === i$9.length) return t$8.all && u$6.length ? a$12(u$6) : s$9(o$6(e$7));
			const c$8 = i$9[n$6];
			const l$5 = /^".*"$/.test(c$8) ? c$8.slice(1, -1) : c$8;
			const d$1 = r.join(l$5, e$7);
			a$12(f$5(!l$5 && /^\.[\\\/]/.test(e$7) ? e$7.slice(0, 2) + d$1 : d$1, n$6, 0));
		});
		const f$5 = (e$8, n$6, r$3) => new Promise((i$10, o$7) => {
			if (r$3 === c$7.length) return i$10(d(n$6 + 1));
			const s$9 = c$7[r$3];
			a$11(e$8 + s$9, { pathExt: l$4 }, (a$12, o$8) => {
				if (!a$12 && o$8) if (t$8.all) u$6.push(e$8 + s$9);
				else return i$10(e$8 + s$9);
				return i$10(f$5(e$8, n$6, r$3 + 1));
			});
		});
		return n$5 ? d(0).then((e$8) => n$5(null, e$8), n$5) : d(0);
	};
	const l$3 = (e$7, t$8) => {
		t$8 = t$8 || {};
		const { pathEnv: n$5, pathExt: i$9, pathExtExe: c$7 } = s$8(e$7, t$8);
		const l$4 = [];
		for (let o$7 = 0; o$7 < n$5.length; o$7++) {
			const s$9 = n$5[o$7];
			const u$6 = /^".*"$/.test(s$9) ? s$9.slice(1, -1) : s$9;
			const d = r.join(u$6, e$7);
			const f$5 = !u$6 && /^\.[\\\/]/.test(e$7) ? e$7.slice(0, 2) + d : d;
			for (let e$8 = 0; e$8 < i$9.length; e$8++) {
				const n$6 = f$5 + i$9[e$8];
				try {
					if (a$11.sync(n$6, { pathExt: c$7 })) if (t$8.all) l$4.push(n$6);
					else return n$6;
				} catch (e$9) {}
			}
		}
		if (t$8.all && l$4.length) return l$4;
		if (t$8.nothrow) return null;
		throw o$6(e$7);
	};
	t$7.exports = c$6;
	c$6.sync = l$3;
});
var k$1 = h$1((exports, t$7) => {
	const n$4 = (e$7 = {}) => {
		const t$8 = e$7.env || process.env;
		if ((e$7.platform || process.platform) !== "win32") return "PATH";
		return Object.keys(t$8).reverse().find((e$8) => e$8.toUpperCase() === "PATH") || "Path";
	};
	t$7.exports = n$4;
	t$7.exports.default = n$4;
});
var A = h$1((exports, t$7) => {
	const n$4 = v$2("path");
	const r = O$3();
	const i$8 = k$1();
	function a$11(e$7, t$8) {
		const a$12 = e$7.options.env || process.env;
		const o$7 = process.cwd();
		const s$8 = e$7.options.cwd != null;
		const c$6 = s$8 && process.chdir !== void 0 && !process.chdir.disabled;
		if (c$6) try {
			process.chdir(e$7.options.cwd);
		} catch (e$8) {}
		let l$3;
		try {
			l$3 = r.sync(e$7.command, {
				path: a$12[i$8({ env: a$12 })],
				pathExt: t$8 ? n$4.delimiter : void 0
			});
		} catch (e$8) {} finally {
			if (c$6) process.chdir(o$7);
		}
		if (l$3) l$3 = n$4.resolve(s$8 ? e$7.options.cwd : "", l$3);
		return l$3;
	}
	function o$6(e$7) {
		return a$11(e$7) || a$11(e$7, true);
	}
	t$7.exports = o$6;
});
var j$2 = h$1((exports, t$7) => {
	const n$4 = /([()\][%!^"`<>&|;, *?])/g;
	function r(e$7) {
		e$7 = e$7.replace(n$4, "^$1");
		return e$7;
	}
	function i$8(e$7, t$8) {
		e$7 = `${e$7}`;
		e$7 = e$7.replace(/(\\*)"/g, "$1$1\\\"");
		e$7 = e$7.replace(/(\\*)$/, "$1$1");
		e$7 = `"${e$7}"`;
		e$7 = e$7.replace(n$4, "^$1");
		if (t$8) e$7 = e$7.replace(n$4, "^$1");
		return e$7;
	}
	t$7.exports.command = r;
	t$7.exports.argument = i$8;
});
var M = h$1((exports, t$7) => {
	t$7.exports = /^#!(.*)/;
});
var N = h$1((exports, t$7) => {
	const n$4 = M();
	t$7.exports = (e$7 = "") => {
		const t$8 = e$7.match(n$4);
		if (!t$8) return null;
		const [r, i$8] = t$8[0].replace(/#! ?/, "").split(" ");
		const a$11 = r.split("/").pop();
		if (a$11 === "env") return i$8;
		return i$8 ? `${a$11} ${i$8}` : a$11;
	};
});
var P$1 = h$1((exports, t$7) => {
	const n$4 = v$2("fs");
	const r = N();
	function i$8(e$7) {
		const t$8 = 150;
		const i$9 = Buffer.alloc(t$8);
		let a$11;
		try {
			a$11 = n$4.openSync(e$7, "r");
			n$4.readSync(a$11, i$9, 0, t$8, 0);
			n$4.closeSync(a$11);
		} catch (e$8) {}
		return r(i$9.toString());
	}
	t$7.exports = i$8;
});
var F$3 = h$1((exports, t$7) => {
	const n$4 = v$2("path");
	const r = A();
	const i$8 = j$2();
	const a$11 = P$1();
	const o$6 = process.platform === "win32";
	const s$8 = /\.(?:com|exe)$/i;
	const c$6 = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
	function l$3(e$7) {
		e$7.file = r(e$7);
		const t$8 = e$7.file && a$11(e$7.file);
		if (t$8) {
			e$7.args.unshift(e$7.file);
			e$7.command = t$8;
			return r(e$7);
		}
		return e$7.file;
	}
	function u$6(e$7) {
		if (!o$6) return e$7;
		const t$8 = l$3(e$7);
		const r$3 = !s$8.test(t$8);
		if (e$7.options.forceShell || r$3) {
			const r$4 = c$6.test(t$8);
			e$7.command = n$4.normalize(e$7.command);
			e$7.command = i$8.command(e$7.command);
			e$7.args = e$7.args.map((e$8) => i$8.argument(e$8, r$4));
			e$7.args = [
				"/d",
				"/s",
				"/c",
				`"${[e$7.command].concat(e$7.args).join(" ")}"`
			];
			e$7.command = process.env.comspec || "cmd.exe";
			e$7.options.windowsVerbatimArguments = true;
		}
		return e$7;
	}
	function d(e$7, t$8, n$5) {
		if (t$8 && !Array.isArray(t$8)) {
			n$5 = t$8;
			t$8 = null;
		}
		t$8 = t$8 ? t$8.slice(0) : [];
		n$5 = Object.assign({}, n$5);
		const r$3 = {
			command: e$7,
			args: t$8,
			options: n$5,
			file: void 0,
			original: {
				command: e$7,
				args: t$8
			}
		};
		return n$5.shell ? r$3 : u$6(r$3);
	}
	t$7.exports = d;
});
var I = h$1((exports, t$7) => {
	const n$4 = process.platform === "win32";
	function r(e$7, t$8) {
		return Object.assign(/* @__PURE__ */ new Error(`${t$8} ${e$7.command} ENOENT`), {
			code: "ENOENT",
			errno: "ENOENT",
			syscall: `${t$8} ${e$7.command}`,
			path: e$7.command,
			spawnargs: e$7.args
		});
	}
	function i$8(e$7, t$8) {
		if (!n$4) return;
		const r$3 = e$7.emit;
		e$7.emit = function(n$5, i$9) {
			if (n$5 === "exit") {
				const n$6 = a$11(i$9, t$8, "spawn");
				if (n$6) return r$3.call(e$7, "error", n$6);
			}
			return r$3.apply(e$7, arguments);
		};
	}
	function a$11(e$7, t$8) {
		if (n$4 && e$7 === 1 && !t$8.file) return r(t$8.original, "spawn");
		return null;
	}
	function o$6(e$7, t$8) {
		if (n$4 && e$7 === 1 && !t$8.file) return r(t$8.original, "spawnSync");
		return null;
	}
	t$7.exports = {
		hookChildProcess: i$8,
		verifyENOENT: a$11,
		verifyENOENTSync: o$6,
		notFoundError: r
	};
});
var R$2 = _$1(h$1((exports, t$7) => {
	const n$4 = v$2("child_process");
	const r = F$3();
	const i$8 = I();
	function a$11(e$7, t$8, a$12) {
		const o$7 = r(e$7, t$8, a$12);
		const s$8 = n$4.spawn(o$7.command, o$7.args, o$7.options);
		i$8.hookChildProcess(s$8, o$7);
		return s$8;
	}
	function o$6(e$7, t$8, a$12) {
		const o$7 = r(e$7, t$8, a$12);
		const s$8 = n$4.spawnSync(o$7.command, o$7.args, o$7.options);
		s$8.error = s$8.error || i$8.verifyENOENTSync(s$8.status, o$7);
		return s$8;
	}
	t$7.exports = a$11;
	t$7.exports.spawn = a$11;
	t$7.exports.sync = o$6;
	t$7.exports._parse = r;
	t$7.exports._enoent = i$8;
})(), 1);
var z$1 = class extends Error {
	result;
	output;
	get exitCode() {
		if (this.result.exitCode !== null) return this.result.exitCode;
	}
	constructor(e$7, t$7) {
		super(`Process exited with non-zero status (${e$7.exitCode})`);
		this.result = e$7;
		this.output = t$7;
	}
};
const B = {
	timeout: void 0,
	persist: false
};
const V = { windowsHide: true };
function H$2(e$7, t$7) {
	return {
		command: normalize$1(e$7),
		args: t$7 ?? []
	};
}
function U(e$7) {
	const t$7 = new AbortController();
	for (const n$4 of e$7) {
		if (n$4.aborted) {
			t$7.abort();
			return n$4;
		}
		const e$8 = () => {
			t$7.abort(n$4.reason);
		};
		n$4.addEventListener("abort", e$8, { signal: t$7.signal });
	}
	return t$7.signal;
}
async function W(e$7) {
	let t$7 = "";
	for await (const n$4 of e$7) t$7 += n$4.toString();
	return t$7;
}
var G$1 = class {
	_process;
	_aborted = false;
	_options;
	_command;
	_args;
	_resolveClose;
	_processClosed;
	_thrownError;
	get process() {
		return this._process;
	}
	get pid() {
		return this._process?.pid;
	}
	get exitCode() {
		if (this._process && this._process.exitCode !== null) return this._process.exitCode;
	}
	constructor(e$7, t$7, n$4) {
		this._options = {
			...B,
			...n$4
		};
		this._command = e$7;
		this._args = t$7 ?? [];
		this._processClosed = new Promise((e$8) => {
			this._resolveClose = e$8;
		});
	}
	kill(e$7) {
		return this._process?.kill(e$7) === true;
	}
	get aborted() {
		return this._aborted;
	}
	get killed() {
		return this._process?.killed === true;
	}
	pipe(e$7, t$7, n$4) {
		return q$1(e$7, t$7, {
			...n$4,
			stdin: this
		});
	}
	async *[Symbol.asyncIterator]() {
		const e$7 = this._process;
		if (!e$7) return;
		const t$7 = [];
		if (this._streamErr) t$7.push(this._streamErr);
		if (this._streamOut) t$7.push(this._streamOut);
		const n$4 = w$2(t$7);
		const r = c.createInterface({ input: n$4 });
		for await (const e$8 of r) yield e$8.toString();
		await this._processClosed;
		e$7.removeAllListeners();
		if (this._thrownError) throw this._thrownError;
		if (this._options?.throwOnError && this.exitCode !== 0 && this.exitCode !== void 0) throw new z$1(this);
	}
	async _waitForOutput() {
		const e$7 = this._process;
		if (!e$7) throw new Error("No process was started");
		const [t$7, n$4] = await Promise.all([this._streamOut ? W(this._streamOut) : "", this._streamErr ? W(this._streamErr) : ""]);
		await this._processClosed;
		if (this._options?.stdin) await this._options.stdin;
		e$7.removeAllListeners();
		if (this._thrownError) throw this._thrownError;
		const r = {
			stderr: n$4,
			stdout: t$7,
			exitCode: this.exitCode
		};
		if (this._options.throwOnError && this.exitCode !== 0 && this.exitCode !== void 0) throw new z$1(this, r);
		return r;
	}
	then(e$7, t$7) {
		return this._waitForOutput().then(e$7, t$7);
	}
	_streamOut;
	_streamErr;
	spawn() {
		const e$7 = cwd();
		const n$4 = this._options;
		const r = {
			...V,
			...n$4.nodeOptions
		};
		const i$8 = [];
		this._resetState();
		if (n$4.timeout !== void 0) i$8.push(AbortSignal.timeout(n$4.timeout));
		if (n$4.signal !== void 0) i$8.push(n$4.signal);
		if (n$4.persist === true) r.detached = true;
		if (i$8.length > 0) r.signal = U(i$8);
		r.env = C$1(e$7, r.env);
		const { command: a$11, args: s$8 } = H$2(this._command, this._args);
		const c$6 = (0, R$2._parse)(a$11, s$8, r);
		const l$3 = spawn(c$6.command, c$6.args, c$6.options);
		if (l$3.stderr) this._streamErr = l$3.stderr;
		if (l$3.stdout) this._streamOut = l$3.stdout;
		this._process = l$3;
		l$3.once("error", this._onError);
		l$3.once("close", this._onClose);
		if (n$4.stdin !== void 0 && l$3.stdin && n$4.stdin.process) {
			const { stdout: e$8 } = n$4.stdin.process;
			if (e$8) e$8.pipe(l$3.stdin);
		}
	}
	_resetState() {
		this._aborted = false;
		this._processClosed = new Promise((e$7) => {
			this._resolveClose = e$7;
		});
		this._thrownError = void 0;
	}
	_onError = (e$7) => {
		if (e$7.name === "AbortError" && (!(e$7.cause instanceof Error) || e$7.cause.name !== "TimeoutError")) {
			this._aborted = true;
			return;
		}
		this._thrownError = e$7;
	};
	_onClose = () => {
		if (this._resolveClose) this._resolveClose();
	};
};
const K = (e$7, t$7, n$4) => {
	const r = new G$1(e$7, t$7, n$4);
	r.spawn();
	return r;
};
const q$1 = K;

//#endregion
//#region node_modules/.pnpm/nypm@0.6.4/node_modules/nypm/dist/index.mjs
var dist_exports$1 = /* @__PURE__ */ __exportAll({
	addDependency: () => addDependency,
	addDevDependency: () => addDevDependency,
	detectPackageManager: () => detectPackageManager,
	installDependencies: () => installDependencies,
	packageManagers: () => packageManagers
});
async function findup(cwd$1, match, options = {}) {
	const segments = normalize$2(cwd$1).split("/");
	while (segments.length > 0) {
		const result = await match(segments.join("/") || "/");
		if (result || !options.includeParentDirs) return result;
		segments.pop();
	}
}
async function readPackageJSON(cwd$1) {
	return findup(cwd$1, (p$2) => {
		const pkgPath = join$1(p$2, "package.json");
		if (existsSync(pkgPath)) return readFile(pkgPath, "utf8").then((data) => JSON.parse(data));
	});
}
function cached(fn) {
	let v$3;
	return () => {
		if (v$3 === void 0) v$3 = fn().then((r) => {
			v$3 = r;
			return v$3;
		});
		return v$3;
	};
}
const hasCorepack = cached(async () => {
	if (globalThis.process?.versions?.webcontainer) return false;
	try {
		const { exitCode } = await K("corepack", ["--version"]);
		return exitCode === 0;
	} catch {
		return false;
	}
});
async function executeCommand(command, args, options = {}) {
	const xArgs = command !== "npm" && command !== "bun" && command !== "deno" && options.corepack !== false && await hasCorepack() ? ["corepack", [command, ...args]] : [command, args];
	const { exitCode, stdout, stderr } = await K(xArgs[0], xArgs[1], { nodeOptions: {
		cwd: resolve$2(options.cwd || process.cwd()),
		env: options.env,
		stdio: options.silent ? "pipe" : "inherit"
	} });
	if (exitCode !== 0) throw new Error(`\`${xArgs.flat().join(" ")}\` failed.${options.silent ? [
		"",
		stdout,
		stderr
	].join("\n") : ""}`);
}
const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG = "No package manager auto-detected.";
async function resolveOperationOptions(options = {}) {
	const cwd$1 = options.cwd || process.cwd();
	const env = {
		...process.env,
		...options.env
	};
	const packageManager = (typeof options.packageManager === "string" ? packageManagers.find((pm) => pm.name === options.packageManager) : options.packageManager) || await detectPackageManager(options.cwd || process.cwd());
	if (!packageManager) throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
	return {
		cwd: cwd$1,
		env,
		silent: options.silent ?? false,
		packageManager,
		dev: options.dev ?? false,
		workspace: options.workspace,
		global: options.global ?? false,
		dry: options.dry ?? false,
		corepack: options.corepack ?? true
	};
}
function getWorkspaceArgs(options) {
	if (!options.workspace) return [];
	const workspacePkg = typeof options.workspace === "string" && options.workspace !== "" ? options.workspace : void 0;
	if (options.packageManager.name === "pnpm") return workspacePkg ? ["--filter", workspacePkg] : ["--workspace-root"];
	if (options.packageManager.name === "npm") return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
	if (options.packageManager.name === "yarn") if (!options.packageManager.majorVersion || options.packageManager.majorVersion === "1") return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
	else return workspacePkg ? ["workspace", workspacePkg] : [];
	return [];
}
function parsePackageManagerField(packageManager) {
	const [name, _version] = (packageManager || "").split("@");
	const [version, buildMeta] = _version?.split("+") || [];
	if (name && name !== "-" && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) return {
		name,
		version,
		buildMeta
	};
	const sanitized = (name || "").replace(/\W+/g, "");
	return {
		name: sanitized,
		version,
		buildMeta,
		warnings: [`Abnormal characters found in \`packageManager\` field, sanitizing from \`${name}\` to \`${sanitized}\``]
	};
}
const packageManagers = [
	{
		name: "npm",
		command: "npm",
		lockFile: "package-lock.json"
	},
	{
		name: "pnpm",
		command: "pnpm",
		lockFile: "pnpm-lock.yaml",
		files: ["pnpm-workspace.yaml"]
	},
	{
		name: "bun",
		command: "bun",
		lockFile: ["bun.lockb", "bun.lock"]
	},
	{
		name: "yarn",
		command: "yarn",
		lockFile: "yarn.lock",
		files: [".yarnrc.yml"]
	},
	{
		name: "deno",
		command: "deno",
		lockFile: "deno.lock",
		files: ["deno.json"]
	}
];
/**
* Detect the package manager used in a directory (and up) by checking various sources:
*
* 1. Use `packageManager` field from package.json
*
* 2. Known lock files and other files
*/
async function detectPackageManager(cwd$1, options = {}) {
	const detected = await findup(resolve$2(cwd$1 || "."), async (path$2) => {
		if (!options.ignorePackageJSON) {
			const packageJSONPath = join$2(path$2, "package.json");
			if (existsSync(packageJSONPath)) {
				const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
				if (packageJSON?.packageManager) {
					const { name, version = "0.0.0", buildMeta, warnings } = parsePackageManagerField(packageJSON.packageManager);
					if (name) {
						const majorVersion = version.split(".")[0];
						const packageManager = packageManagers.find((pm) => pm.name === name && pm.majorVersion === majorVersion) || packageManagers.find((pm) => pm.name === name);
						return {
							name,
							command: name,
							version,
							majorVersion,
							buildMeta,
							warnings,
							files: packageManager?.files,
							lockFile: packageManager?.lockFile
						};
					}
				}
			}
			if (existsSync(join$2(path$2, "deno.json"))) return packageManagers.find((pm) => pm.name === "deno");
		}
		if (!options.ignoreLockFile) {
			for (const packageManager of packageManagers) if ([packageManager.lockFile, packageManager.files].flat().filter(Boolean).some((file) => existsSync(resolve$2(path$2, file)))) return { ...packageManager };
		}
	}, { includeParentDirs: options.includeParentDirs ?? true });
	if (!detected && !options.ignoreArgv) {
		const scriptArg = process.argv[1];
		if (scriptArg) {
			for (const packageManager of packageManagers) if ((/* @__PURE__ */ new RegExp(`[/\\\\]\\.?${packageManager.command}`)).test(scriptArg)) return packageManager;
		}
	}
	return detected;
}
/**
* Installs project dependencies.
*
* @param options - Options to pass to the API call.
* @param options.cwd - The directory to run the command in.
* @param options.silent - Whether to run the command in silent mode.
* @param options.packageManager - The package manager info to use (auto-detected).
* @param options.frozenLockFile - Whether to install dependencies with frozen lock file.
*/
async function installDependencies(options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const commandArgs = options.frozenLockFile ? {
		npm: ["ci"],
		yarn: ["install", "--immutable"],
		bun: ["install", "--frozen-lockfile"],
		pnpm: ["install", "--frozen-lockfile"],
		deno: ["install", "--frozen"]
	}[resolvedOptions.packageManager.name] : ["install"];
	if (options.ignoreWorkspace && resolvedOptions.packageManager.name === "pnpm") commandArgs.push("--ignore-workspace");
	if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, commandArgs, {
		cwd: resolvedOptions.cwd,
		silent: resolvedOptions.silent,
		corepack: resolvedOptions.corepack
	});
	return { exec: {
		command: resolvedOptions.packageManager.command,
		args: commandArgs
	} };
}
/**
* Adds dependency to the project.
*
* @param name - Name of the dependency to add.
* @param options - Options to pass to the API call.
* @param options.cwd - The directory to run the command in.
* @param options.silent - Whether to run the command in silent mode.
* @param options.packageManager - The package manager info to use (auto-detected).
* @param options.dev - Whether to add the dependency as dev dependency.
* @param options.workspace - The name of the workspace to use.
* @param options.global - Whether to run the command in global mode.
*/
async function addDependency(name, options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const names = Array.isArray(name) ? name : [name];
	if (resolvedOptions.packageManager.name === "deno") {
		for (let i$8 = 0; i$8 < names.length; i$8++) if (!/^(npm|jsr|file):.+$/.test(names[i$8] || "")) names[i$8] = `npm:${names[i$8]}`;
	}
	if (names.length === 0) return {};
	const args = (resolvedOptions.packageManager.name === "yarn" ? [
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.global && resolvedOptions.packageManager.majorVersion === "1" ? "global" : "",
		"add",
		resolvedOptions.dev ? "-D" : "",
		...names
	] : [
		resolvedOptions.packageManager.name === "npm" ? "install" : "add",
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.dev ? "-D" : "",
		resolvedOptions.global ? "-g" : "",
		...names
	]).filter(Boolean);
	if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, args, {
		cwd: resolvedOptions.cwd,
		silent: resolvedOptions.silent,
		corepack: resolvedOptions.corepack
	});
	if (!resolvedOptions.dry && options.installPeerDependencies) {
		const existingPkg = await readPackageJSON(resolvedOptions.cwd);
		const peerDeps = [];
		const peerDevDeps = [];
		for (const _name of names) {
			const pkgName = _name.match(/^(.[^@]+)/)?.[0];
			const pkg = createRequire(join$1(resolvedOptions.cwd, "/_.js"))(`${pkgName}/package.json`);
			if (!pkg.peerDependencies || pkg.name !== pkgName) continue;
			for (const [peerDependency, version] of Object.entries(pkg.peerDependencies)) {
				if (pkg.peerDependenciesMeta?.[peerDependency]?.optional) continue;
				if (existingPkg?.dependencies?.[peerDependency] || existingPkg?.devDependencies?.[peerDependency]) continue;
				(pkg.peerDependenciesMeta?.[peerDependency]?.dev ? peerDevDeps : peerDeps).push(`${peerDependency}@${version}`);
			}
		}
		if (peerDeps.length > 0) await addDependency(peerDeps, { ...resolvedOptions });
		if (peerDevDeps.length > 0) await addDevDependency(peerDevDeps, { ...resolvedOptions });
	}
	return { exec: {
		command: resolvedOptions.packageManager.command,
		args
	} };
}
/**
* Adds dev dependency to the project.
*
* @param name - Name of the dev dependency to add.
* @param options - Options to pass to the API call.
* @param options.cwd - The directory to run the command in.
* @param options.silent - Whether to run the command in silent mode.
* @param options.packageManager - The package manager info to use (auto-detected).
* @param options.workspace - The name of the workspace to use.
* @param options.global - Whether to run the command in global mode.
*
*/
async function addDevDependency(name, options = {}) {
	return await addDependency(name, {
		...options,
		dev: true
	});
}

//#endregion
//#region node_modules/.pnpm/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/native.mjs
const e$6 = globalThis.Blob, o$5 = globalThis.File, a$10 = globalThis.FormData, s$7 = globalThis.Headers, t$6 = globalThis.Request, h = globalThis.Response, i$7 = globalThis.AbortController, l$1 = globalThis.fetch || (() => {
	throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!");
});

//#endregion
//#region node_modules/.pnpm/giget@2.0.0/node_modules/giget/dist/shared/giget.OCaTp9b-.mjs
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x$1) {
	return x$1 && x$1.__esModule && Object.prototype.hasOwnProperty.call(x$1, "default") ? x$1["default"] : x$1;
}
var i$6, t$5;
function s$6() {
	if (t$5) return i$6;
	t$5 = 1;
	const n = new Map([
		["C", "cwd"],
		["f", "file"],
		["z", "gzip"],
		["P", "preservePaths"],
		["U", "unlink"],
		["strip-components", "strip"],
		["stripComponents", "strip"],
		["keep-newer", "newer"],
		["keepNewer", "newer"],
		["keep-newer-files", "newer"],
		["keepNewerFiles", "newer"],
		["k", "keep"],
		["keep-existing", "keep"],
		["keepExisting", "keep"],
		["m", "noMtime"],
		["no-mtime", "noMtime"],
		["p", "preserveOwner"],
		["L", "follow"],
		["h", "follow"]
	]);
	return i$6 = (r) => r ? Object.keys(r).map((e) => [n.has(e) ? n.get(e) : e, r[e]]).reduce((e, p) => (e[p[0]] = p[1], e), Object.create(null)) : {}, i$6;
}
var e$5, t$4;
function c$4() {
	return t$4 || (t$4 = 1, e$5 = (o) => class extends o {
		warn(n, i, r = {}) {
			this.file && (r.file = this.file), this.cwd && (r.cwd = this.cwd), r.code = i instanceof Error && i.code || n, r.tarCode = n, !this.strict && r.recoverable !== false ? (i instanceof Error && (r = Object.assign(i, r), i = i.message), this.emit("warn", r.tarCode, i, r)) : i instanceof Error ? this.emit("error", Object.assign(i, r)) : this.emit("error", Object.assign(/* @__PURE__ */ new Error(`${n}: ${i}`), r));
		}
	}), e$5;
}
var e$4 = {};
var a$9;
function n$3() {
	return a$9 ? e$4 : (a$9 = 1, function(e) {
		e.name = new Map([
			["0", "File"],
			["", "OldFile"],
			["1", "Link"],
			["2", "SymbolicLink"],
			["3", "CharacterDevice"],
			["4", "BlockDevice"],
			["5", "Directory"],
			["6", "FIFO"],
			["7", "ContiguousFile"],
			["g", "GlobalExtendedHeader"],
			["x", "ExtendedHeader"],
			["A", "SolarisACL"],
			["D", "GNUDumpDir"],
			["I", "Inode"],
			["K", "NextFileHasLongLinkpath"],
			["L", "NextFileHasLongPath"],
			["M", "ContinuationFile"],
			["N", "OldGnuLongPath"],
			["S", "SparseFile"],
			["V", "TapeVolumeHeader"],
			["X", "OldExtendedHeader"]
		]), e.code = new Map(Array.from(e.name).map((i) => [i[1], i[0]]));
	}(e$4), e$4);
}
var f$3, i$5;
function w$1() {
	if (i$5) return f$3;
	i$5 = 1;
	const v = (e, r) => {
		if (Number.isSafeInteger(e)) e < 0 ? g$1(e, r) : p(e, r);
		else throw Error("cannot encode number outside of javascript safe integer range");
		return r;
	}, p = (e, r) => {
		r[0] = 128;
		for (var o = r.length; o > 1; o--) r[o - 1] = e & 255, e = Math.floor(e / 256);
	}, g$1 = (e, r) => {
		r[0] = 255;
		var o = false;
		e = e * -1;
		for (var s = r.length; s > 1; s--) {
			var a = e & 255;
			e = Math.floor(e / 256), o ? r[s - 1] = l(a) : a === 0 ? r[s - 1] = 0 : (o = true, r[s - 1] = c$1(a));
		}
	}, h$2 = (e) => {
		const r = e[0], o = r === 128 ? d$1(e.slice(1, e.length)) : r === 255 ? x$1(e) : null;
		if (o === null) throw Error("invalid base256 encoding");
		if (!Number.isSafeInteger(o)) throw Error("parsed number outside of javascript safe integer range");
		return o;
	}, x$1 = (e) => {
		for (var r = e.length, o = 0, s = false, a = r - 1; a > -1; a--) {
			var n = e[a], t;
			s ? t = l(n) : n === 0 ? t = n : (s = true, t = c$1(n)), t !== 0 && (o -= t * Math.pow(256, r - a - 1));
		}
		return o;
	}, d$1 = (e) => {
		for (var r = e.length, o = 0, s = r - 1; s > -1; s--) {
			var a = e[s];
			a !== 0 && (o += a * Math.pow(256, r - s - 1));
		}
		return o;
	}, l = (e) => (255 ^ e) & 255, c$1 = (e) => (255 ^ e) + 1 & 255;
	return f$3 = {
		encode: v,
		parse: h$2
	}, f$3;
}
var k, w;
function E() {
	if (w) return k;
	w = 1;
	const u = n$3(), x$1 = path.posix, y = w$1(), P$2 = Symbol("slurp"), a = Symbol("type");
	class B$1 {
		constructor(e, t, i, h$2) {
			this.cksumValid = false, this.needPax = false, this.nullBlock = false, this.block = null, this.path = null, this.mode = null, this.uid = null, this.gid = null, this.size = null, this.mtime = null, this.cksum = null, this[a] = "0", this.linkpath = null, this.uname = null, this.gname = null, this.devmaj = 0, this.devmin = 0, this.atime = null, this.ctime = null, Buffer.isBuffer(e) ? this.decode(e, t || 0, i, h$2) : e && this.set(e);
		}
		decode(e, t, i, h$2) {
			if (t || (t = 0), !e || !(e.length >= t + 512)) throw new Error("need 512 bytes for header");
			if (this.path = d$1(e, t, 100), this.mode = r(e, t + 100, 8), this.uid = r(e, t + 108, 8), this.gid = r(e, t + 116, 8), this.size = r(e, t + 124, 12), this.mtime = o(e, t + 136, 12), this.cksum = r(e, t + 148, 12), this[P$2](i), this[P$2](h$2, true), this[a] = d$1(e, t + 156, 1), this[a] === "" && (this[a] = "0"), this[a] === "0" && this.path.slice(-1) === "/" && (this[a] = "5"), this[a] === "5" && (this.size = 0), this.linkpath = d$1(e, t + 157, 100), e.slice(t + 257, t + 265).toString() === "ustar\x0000") if (this.uname = d$1(e, t + 265, 32), this.gname = d$1(e, t + 297, 32), this.devmaj = r(e, t + 329, 8), this.devmin = r(e, t + 337, 8), e[t + 475] !== 0) this.path = d$1(e, t + 345, 155) + "/" + this.path;
			else {
				const n = d$1(e, t + 345, 130);
				n && (this.path = n + "/" + this.path), this.atime = o(e, t + 476, 12), this.ctime = o(e, t + 488, 12);
			}
			let l = 256;
			for (let n = t; n < t + 148; n++) l += e[n];
			for (let n = t + 156; n < t + 512; n++) l += e[n];
			this.cksumValid = l === this.cksum, this.cksum === null && l === 256 && (this.nullBlock = true);
		}
		[P$2](e, t) {
			for (const i in e) e[i] !== null && e[i] !== void 0 && !(t && i === "path") && (this[i] = e[i]);
		}
		encode(e, t) {
			if (e || (e = this.block = Buffer.alloc(512), t = 0), t || (t = 0), !(e.length >= t + 512)) throw new Error("need 512 bytes for header");
			const i = this.ctime || this.atime ? 130 : 155, h$2 = L(this.path || "", i), l = h$2[0], n = h$2[1];
			this.needPax = h$2[2], this.needPax = m(e, t, 100, l) || this.needPax, this.needPax = c$1(e, t + 100, 8, this.mode) || this.needPax, this.needPax = c$1(e, t + 108, 8, this.uid) || this.needPax, this.needPax = c$1(e, t + 116, 8, this.gid) || this.needPax, this.needPax = c$1(e, t + 124, 12, this.size) || this.needPax, this.needPax = g$1(e, t + 136, 12, this.mtime) || this.needPax, e[t + 156] = this[a].charCodeAt(0), this.needPax = m(e, t + 157, 100, this.linkpath) || this.needPax, e.write("ustar\x0000", t + 257, 8), this.needPax = m(e, t + 265, 32, this.uname) || this.needPax, this.needPax = m(e, t + 297, 32, this.gname) || this.needPax, this.needPax = c$1(e, t + 329, 8, this.devmaj) || this.needPax, this.needPax = c$1(e, t + 337, 8, this.devmin) || this.needPax, this.needPax = m(e, t + 345, i, n) || this.needPax, e[t + 475] !== 0 ? this.needPax = m(e, t + 345, 155, n) || this.needPax : (this.needPax = m(e, t + 345, 130, n) || this.needPax, this.needPax = g$1(e, t + 476, 12, this.atime) || this.needPax, this.needPax = g$1(e, t + 488, 12, this.ctime) || this.needPax);
			let S = 256;
			for (let p = t; p < t + 148; p++) S += e[p];
			for (let p = t + 156; p < t + 512; p++) S += e[p];
			return this.cksum = S, c$1(e, t + 148, 8, this.cksum), this.cksumValid = true, this.needPax;
		}
		set(e) {
			for (const t in e) e[t] !== null && e[t] !== void 0 && (this[t] = e[t]);
		}
		get type() {
			return u.name.get(this[a]) || this[a];
		}
		get typeKey() {
			return this[a];
		}
		set type(e) {
			u.code.has(e) ? this[a] = u.code.get(e) : this[a] = e;
		}
	}
	const L = (s, e) => {
		let i = s, h$2 = "", l;
		const n = x$1.parse(s).root || ".";
		if (Buffer.byteLength(i) < 100) l = [
			i,
			h$2,
			false
		];
		else {
			h$2 = x$1.dirname(i), i = x$1.basename(i);
			do
				Buffer.byteLength(i) <= 100 && Buffer.byteLength(h$2) <= e ? l = [
					i,
					h$2,
					false
				] : Buffer.byteLength(i) > 100 && Buffer.byteLength(h$2) <= e ? l = [
					i.slice(0, 99),
					h$2,
					true
				] : (i = x$1.join(x$1.basename(h$2), i), h$2 = x$1.dirname(h$2));
			while (h$2 !== n && !l);
			l || (l = [
				s.slice(0, 99),
				"",
				true
			]);
		}
		return l;
	}, d$1 = (s, e, t) => s.slice(e, e + t).toString("utf8").replace(/\0.*/, ""), o = (s, e, t) => N$1(r(s, e, t)), N$1 = (s) => s === null ? null : /* @__PURE__ */ new Date(s * 1e3), r = (s, e, t) => s[e] & 128 ? y.parse(s.slice(e, e + t)) : j(s, e, t), q = (s) => isNaN(s) ? null : s, j = (s, e, t) => q(parseInt(s.slice(e, e + t).toString("utf8").replace(/\0.*$/, "").trim(), 8)), v = {
		12: 8589934591,
		8: 2097151
	}, c$1 = (s, e, t, i) => i === null ? false : i > v[t] || i < 0 ? (y.encode(i, s.slice(e, e + t)), true) : ($(s, e, t, i), false), $ = (s, e, t, i) => s.write(_(i, t), e, t, "ascii"), _ = (s, e) => z(Math.floor(s).toString(8), e), z = (s, e) => (s.length === e - 1 ? s : new Array(e - s.length - 1).join("0") + s + " ") + "\0", g$1 = (s, e, t, i) => i === null ? false : c$1(s, e, t, i.getTime() / 1e3), A$1 = new Array(156).join("\0"), m = (s, e, t, i) => i === null ? false : (s.write(i + A$1, e, t, "utf8"), i.length !== Buffer.byteLength(i) || i.length > t);
	return k = B$1, k;
}
var e$3, t$3;
function i$4() {
	return t$3 || (t$3 = 1, e$3 = function(o) {
		o.prototype[Symbol.iterator] = function* () {
			for (let r = this.head; r; r = r.next) yield r.value;
		};
	}), e$3;
}
var u$4, a$8;
function c$3() {
	if (a$8) return u$4;
	a$8 = 1, u$4 = r, r.Node = s, r.create = r;
	function r(t) {
		var i = this;
		if (i instanceof r || (i = new r()), i.tail = null, i.head = null, i.length = 0, t && typeof t.forEach == "function") t.forEach(function(n) {
			i.push(n);
		});
		else if (arguments.length > 0) for (var e = 0, h$2 = arguments.length; e < h$2; e++) i.push(arguments[e]);
		return i;
	}
	r.prototype.removeNode = function(t) {
		if (t.list !== this) throw new Error("removing node which does not belong to this list");
		var i = t.next, e = t.prev;
		return i && (i.prev = e), e && (e.next = i), t === this.head && (this.head = i), t === this.tail && (this.tail = e), t.list.length--, t.next = null, t.prev = null, t.list = null, i;
	}, r.prototype.unshiftNode = function(t) {
		if (t !== this.head) {
			t.list && t.list.removeNode(t);
			var i = this.head;
			t.list = this, t.next = i, i && (i.prev = t), this.head = t, this.tail || (this.tail = t), this.length++;
		}
	}, r.prototype.pushNode = function(t) {
		if (t !== this.tail) {
			t.list && t.list.removeNode(t);
			var i = this.tail;
			t.list = this, t.prev = i, i && (i.next = t), this.tail = t, this.head || (this.head = t), this.length++;
		}
	}, r.prototype.push = function() {
		for (var t = 0, i = arguments.length; t < i; t++) f(this, arguments[t]);
		return this.length;
	}, r.prototype.unshift = function() {
		for (var t = 0, i = arguments.length; t < i; t++) o(this, arguments[t]);
		return this.length;
	}, r.prototype.pop = function() {
		if (this.tail) {
			var t = this.tail.value;
			return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, this.length--, t;
		}
	}, r.prototype.shift = function() {
		if (this.head) {
			var t = this.head.value;
			return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, this.length--, t;
		}
	}, r.prototype.forEach = function(t, i) {
		i = i || this;
		for (var e = this.head, h$2 = 0; e !== null; h$2++) t.call(i, e.value, h$2, this), e = e.next;
	}, r.prototype.forEachReverse = function(t, i) {
		i = i || this;
		for (var e = this.tail, h$2 = this.length - 1; e !== null; h$2--) t.call(i, e.value, h$2, this), e = e.prev;
	}, r.prototype.get = function(t) {
		for (var i = 0, e = this.head; e !== null && i < t; i++) e = e.next;
		if (i === t && e !== null) return e.value;
	}, r.prototype.getReverse = function(t) {
		for (var i = 0, e = this.tail; e !== null && i < t; i++) e = e.prev;
		if (i === t && e !== null) return e.value;
	}, r.prototype.map = function(t, i) {
		i = i || this;
		for (var e = new r(), h$2 = this.head; h$2 !== null;) e.push(t.call(i, h$2.value, this)), h$2 = h$2.next;
		return e;
	}, r.prototype.mapReverse = function(t, i) {
		i = i || this;
		for (var e = new r(), h$2 = this.tail; h$2 !== null;) e.push(t.call(i, h$2.value, this)), h$2 = h$2.prev;
		return e;
	}, r.prototype.reduce = function(t, i) {
		var e, h$2 = this.head;
		if (arguments.length > 1) e = i;
		else if (this.head) h$2 = this.head.next, e = this.head.value;
		else throw new TypeError("Reduce of empty list with no initial value");
		for (var n = 0; h$2 !== null; n++) e = t(e, h$2.value, n), h$2 = h$2.next;
		return e;
	}, r.prototype.reduceReverse = function(t, i) {
		var e, h$2 = this.tail;
		if (arguments.length > 1) e = i;
		else if (this.tail) h$2 = this.tail.prev, e = this.tail.value;
		else throw new TypeError("Reduce of empty list with no initial value");
		for (var n = this.length - 1; h$2 !== null; n--) e = t(e, h$2.value, n), h$2 = h$2.prev;
		return e;
	}, r.prototype.toArray = function() {
		for (var t = new Array(this.length), i = 0, e = this.head; e !== null; i++) t[i] = e.value, e = e.next;
		return t;
	}, r.prototype.toArrayReverse = function() {
		for (var t = new Array(this.length), i = 0, e = this.tail; e !== null; i++) t[i] = e.value, e = e.prev;
		return t;
	}, r.prototype.slice = function(t, i) {
		i = i || this.length, i < 0 && (i += this.length), t = t || 0, t < 0 && (t += this.length);
		var e = new r();
		if (i < t || i < 0) return e;
		t < 0 && (t = 0), i > this.length && (i = this.length);
		for (var h$2 = 0, n = this.head; n !== null && h$2 < t; h$2++) n = n.next;
		for (; n !== null && h$2 < i; h$2++, n = n.next) e.push(n.value);
		return e;
	}, r.prototype.sliceReverse = function(t, i) {
		i = i || this.length, i < 0 && (i += this.length), t = t || 0, t < 0 && (t += this.length);
		var e = new r();
		if (i < t || i < 0) return e;
		t < 0 && (t = 0), i > this.length && (i = this.length);
		for (var h$2 = this.length, n = this.tail; n !== null && h$2 > i; h$2--) n = n.prev;
		for (; n !== null && h$2 > t; h$2--, n = n.prev) e.push(n.value);
		return e;
	}, r.prototype.splice = function(t, i, ...e) {
		t > this.length && (t = this.length - 1), t < 0 && (t = this.length + t);
		for (var h$2 = 0, n = this.head; n !== null && h$2 < t; h$2++) n = n.next;
		for (var l = [], h$2 = 0; n && h$2 < i; h$2++) l.push(n.value), n = this.removeNode(n);
		n === null && (n = this.tail), n !== this.head && n !== this.tail && (n = n.prev);
		for (var h$2 = 0; h$2 < e.length; h$2++) n = v(this, n, e[h$2]);
		return l;
	}, r.prototype.reverse = function() {
		for (var t = this.head, i = this.tail, e = t; e !== null; e = e.prev) {
			var h$2 = e.prev;
			e.prev = e.next, e.next = h$2;
		}
		return this.head = i, this.tail = t, this;
	};
	function v(t, i, e) {
		var h$2 = i === t.head ? new s(e, null, i, t) : new s(e, i, i.next, t);
		return h$2.next === null && (t.tail = h$2), h$2.prev === null && (t.head = h$2), t.length++, h$2;
	}
	function f(t, i) {
		t.tail = new s(i, t.tail, null, t), t.head || (t.head = t.tail), t.length++;
	}
	function o(t, i) {
		t.head = new s(i, null, t.head, t), t.tail || (t.tail = t.head), t.length++;
	}
	function s(t, i, e, h$2) {
		if (!(this instanceof s)) return new s(t, i, e, h$2);
		this.list = h$2, this.value = t, i ? (i.next = this, this.prev = i) : this.prev = null, e ? (e.prev = this, this.next = e) : this.next = null;
	}
	try {
		i$4()(r);
	} catch {}
	return u$4;
}
var s$5 = {};
var X$1;
function ft() {
	if (X$1) return s$5;
	X$1 = 1;
	const H = typeof process == "object" && process ? process : {
		stdout: null,
		stderr: null
	}, Z = nt, q = ot, G = ht.StringDecoder, m = Symbol("EOF"), d$1 = Symbol("maybeEmitEnd"), y = Symbol("emittedEnd"), R = Symbol("emittingEnd"), g$1 = Symbol("emittedError"), B$1 = Symbol("closed"), Y = Symbol("read"), T = Symbol("flush"), $ = Symbol("flushChunk"), f = Symbol("encoding"), c$1 = Symbol("decoder"), M$1 = Symbol("flowing"), S = Symbol("paused"), b$1 = Symbol("resume"), i = Symbol("buffer"), a = Symbol("pipes"), n = Symbol("bufferLength"), j = Symbol("bufferPush"), I$1 = Symbol("bufferShift"), o = Symbol("objectMode"), r = Symbol("destroyed"), P$2 = Symbol("error"), x$1 = Symbol("emitData"), V$1 = Symbol("emitEnd"), N$1 = Symbol("emitEnd2"), p = Symbol("async"), _ = Symbol("abort"), O = Symbol("aborted"), E = Symbol("signal"), w = (h$2) => Promise.resolve().then(h$2), J = commonjsGlobal._MP_NO_ITERATOR_SYMBOLS_ !== "1", K$1 = J && Symbol.asyncIterator || Symbol("asyncIterator not implemented"), W$1 = J && Symbol.iterator || Symbol("iterator not implemented"), k = (h$2) => h$2 === "end" || h$2 === "finish" || h$2 === "prefinish", tt = (h$2) => h$2 instanceof ArrayBuffer || typeof h$2 == "object" && h$2.constructor && h$2.constructor.name === "ArrayBuffer" && h$2.byteLength >= 0, et = (h$2) => !Buffer.isBuffer(h$2) && ArrayBuffer.isView(h$2);
	class z {
		constructor(t, e, s) {
			this.src = t, this.dest = e, this.opts = s, this.ondrain = () => t[b$1](), e.on("drain", this.ondrain);
		}
		unpipe() {
			this.dest.removeListener("drain", this.ondrain);
		}
		proxyErrors() {}
		end() {
			this.unpipe(), this.opts.end && this.dest.end();
		}
	}
	class st extends z {
		unpipe() {
			this.src.removeListener("error", this.proxyErrors), super.unpipe();
		}
		constructor(t, e, s) {
			super(t, e, s), this.proxyErrors = (l) => e.emit("error", l), t.on("error", this.proxyErrors);
		}
	}
	class F extends q {
		constructor(t) {
			super(), this[M$1] = false, this[S] = false, this[a] = [], this[i] = [], this[o] = t && t.objectMode || false, this[o] ? this[f] = null : this[f] = t && t.encoding || null, this[f] === "buffer" && (this[f] = null), this[p] = t && !!t.async || false, this[c$1] = this[f] ? new G(this[f]) : null, this[m] = false, this[y] = false, this[R] = false, this[B$1] = false, this[g$1] = null, this.writable = true, this.readable = true, this[n] = 0, this[r] = false, t && t.debugExposeBuffer === true && Object.defineProperty(this, "buffer", { get: () => this[i] }), t && t.debugExposePipes === true && Object.defineProperty(this, "pipes", { get: () => this[a] }), this[E] = t && t.signal, this[O] = false, this[E] && (this[E].addEventListener("abort", () => this[_]()), this[E].aborted && this[_]());
		}
		get bufferLength() {
			return this[n];
		}
		get encoding() {
			return this[f];
		}
		set encoding(t) {
			if (this[o]) throw new Error("cannot set encoding in objectMode");
			if (this[f] && t !== this[f] && (this[c$1] && this[c$1].lastNeed || this[n])) throw new Error("cannot change encoding");
			this[f] !== t && (this[c$1] = t ? new G(t) : null, this[i].length && (this[i] = this[i].map((e) => this[c$1].write(e)))), this[f] = t;
		}
		setEncoding(t) {
			this.encoding = t;
		}
		get objectMode() {
			return this[o];
		}
		set objectMode(t) {
			this[o] = this[o] || !!t;
		}
		get async() {
			return this[p];
		}
		set async(t) {
			this[p] = this[p] || !!t;
		}
		[_]() {
			this[O] = true, this.emit("abort", this[E].reason), this.destroy(this[E].reason);
		}
		get aborted() {
			return this[O];
		}
		set aborted(t) {}
		write(t, e, s) {
			if (this[O]) return false;
			if (this[m]) throw new Error("write after end");
			if (this[r]) return this.emit("error", Object.assign(/* @__PURE__ */ new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" })), true;
			typeof e == "function" && (s = e, e = "utf8"), e || (e = "utf8");
			const l = this[p] ? w : (u) => u();
			return !this[o] && !Buffer.isBuffer(t) && (et(t) ? t = Buffer.from(t.buffer, t.byteOffset, t.byteLength) : tt(t) ? t = Buffer.from(t) : typeof t != "string" && (this.objectMode = true)), this[o] ? (this.flowing && this[n] !== 0 && this[T](true), this.flowing ? this.emit("data", t) : this[j](t), this[n] !== 0 && this.emit("readable"), s && l(s), this.flowing) : t.length ? (typeof t == "string" && !(e === this[f] && !this[c$1].lastNeed) && (t = Buffer.from(t, e)), Buffer.isBuffer(t) && this[f] && (t = this[c$1].write(t)), this.flowing && this[n] !== 0 && this[T](true), this.flowing ? this.emit("data", t) : this[j](t), this[n] !== 0 && this.emit("readable"), s && l(s), this.flowing) : (this[n] !== 0 && this.emit("readable"), s && l(s), this.flowing);
		}
		read(t) {
			if (this[r]) return null;
			if (this[n] === 0 || t === 0 || t > this[n]) return this[d$1](), null;
			this[o] && (t = null), this[i].length > 1 && !this[o] && (this.encoding ? this[i] = [this[i].join("")] : this[i] = [Buffer.concat(this[i], this[n])]);
			const e = this[Y](t || null, this[i][0]);
			return this[d$1](), e;
		}
		[Y](t, e) {
			return t === e.length || t === null ? this[I$1]() : (this[i][0] = e.slice(t), e = e.slice(0, t), this[n] -= t), this.emit("data", e), !this[i].length && !this[m] && this.emit("drain"), e;
		}
		end(t, e, s) {
			return typeof t == "function" && (s = t, t = null), typeof e == "function" && (s = e, e = "utf8"), t && this.write(t, e), s && this.once("end", s), this[m] = true, this.writable = false, (this.flowing || !this[S]) && this[d$1](), this;
		}
		[b$1]() {
			this[r] || (this[S] = false, this[M$1] = true, this.emit("resume"), this[i].length ? this[T]() : this[m] ? this[d$1]() : this.emit("drain"));
		}
		resume() {
			return this[b$1]();
		}
		pause() {
			this[M$1] = false, this[S] = true;
		}
		get destroyed() {
			return this[r];
		}
		get flowing() {
			return this[M$1];
		}
		get paused() {
			return this[S];
		}
		[j](t) {
			this[o] ? this[n] += 1 : this[n] += t.length, this[i].push(t);
		}
		[I$1]() {
			return this[o] ? this[n] -= 1 : this[n] -= this[i][0].length, this[i].shift();
		}
		[T](t) {
			do			;
while (this[$](this[I$1]()) && this[i].length);
			!t && !this[i].length && !this[m] && this.emit("drain");
		}
		[$](t) {
			return this.emit("data", t), this.flowing;
		}
		pipe(t, e) {
			if (this[r]) return;
			const s = this[y];
			return e = e || {}, t === H.stdout || t === H.stderr ? e.end = false : e.end = e.end !== false, e.proxyErrors = !!e.proxyErrors, s ? e.end && t.end() : (this[a].push(e.proxyErrors ? new st(this, t, e) : new z(this, t, e)), this[p] ? w(() => this[b$1]()) : this[b$1]()), t;
		}
		unpipe(t) {
			const e = this[a].find((s) => s.dest === t);
			e && (this[a].splice(this[a].indexOf(e), 1), e.unpipe());
		}
		addListener(t, e) {
			return this.on(t, e);
		}
		on(t, e) {
			const s = super.on(t, e);
			return t === "data" && !this[a].length && !this.flowing ? this[b$1]() : t === "readable" && this[n] !== 0 ? super.emit("readable") : k(t) && this[y] ? (super.emit(t), this.removeAllListeners(t)) : t === "error" && this[g$1] && (this[p] ? w(() => e.call(this, this[g$1])) : e.call(this, this[g$1])), s;
		}
		get emittedEnd() {
			return this[y];
		}
		[d$1]() {
			!this[R] && !this[y] && !this[r] && this[i].length === 0 && this[m] && (this[R] = true, this.emit("end"), this.emit("prefinish"), this.emit("finish"), this[B$1] && this.emit("close"), this[R] = false);
		}
		emit(t, e, ...s) {
			if (t !== "error" && t !== "close" && t !== r && this[r]) return;
			if (t === "data") return !this[o] && !e ? false : this[p] ? w(() => this[x$1](e)) : this[x$1](e);
			if (t === "end") return this[V$1]();
			if (t === "close") {
				if (this[B$1] = true, !this[y] && !this[r]) return;
				const u = super.emit("close");
				return this.removeAllListeners("close"), u;
			} else if (t === "error") {
				this[g$1] = e, super.emit(P$2, e);
				const u = !this[E] || this.listeners("error").length ? super.emit("error", e) : false;
				return this[d$1](), u;
			} else if (t === "resume") {
				const u = super.emit("resume");
				return this[d$1](), u;
			} else if (t === "finish" || t === "prefinish") {
				const u = super.emit(t);
				return this.removeAllListeners(t), u;
			}
			const l = super.emit(t, e, ...s);
			return this[d$1](), l;
		}
		[x$1](t) {
			for (const s of this[a]) s.dest.write(t) === false && this.pause();
			const e = super.emit("data", t);
			return this[d$1](), e;
		}
		[V$1]() {
			this[y] || (this[y] = true, this.readable = false, this[p] ? w(() => this[N$1]()) : this[N$1]());
		}
		[N$1]() {
			if (this[c$1]) {
				const e = this[c$1].end();
				if (e) {
					for (const s of this[a]) s.dest.write(e);
					super.emit("data", e);
				}
			}
			for (const e of this[a]) e.end();
			const t = super.emit("end");
			return this.removeAllListeners("end"), t;
		}
		collect() {
			const t = [];
			this[o] || (t.dataLength = 0);
			const e = this.promise();
			return this.on("data", (s) => {
				t.push(s), this[o] || (t.dataLength += s.length);
			}), e.then(() => t);
		}
		concat() {
			return this[o] ? Promise.reject(/* @__PURE__ */ new Error("cannot concat in objectMode")) : this.collect().then((t) => this[o] ? Promise.reject(/* @__PURE__ */ new Error("cannot concat in objectMode")) : this[f] ? t.join("") : Buffer.concat(t, t.dataLength));
		}
		promise() {
			return new Promise((t, e) => {
				this.on(r, () => e(/* @__PURE__ */ new Error("stream destroyed"))), this.on("error", (s) => e(s)), this.on("end", () => t());
			});
		}
		[K$1]() {
			let t = false;
			const e = () => (this.pause(), t = true, Promise.resolve({ done: true }));
			return {
				next: () => {
					if (t) return e();
					const l = this.read();
					if (l !== null) return Promise.resolve({
						done: false,
						value: l
					});
					if (this[m]) return e();
					let u = null, Q = null;
					const A$1 = (L) => {
						this.removeListener("data", U$1), this.removeListener("end", C), this.removeListener(r, D$1), e(), Q(L);
					}, U$1 = (L) => {
						this.removeListener("error", A$1), this.removeListener("end", C), this.removeListener(r, D$1), this.pause(), u({
							value: L,
							done: !!this[m]
						});
					}, C = () => {
						this.removeListener("error", A$1), this.removeListener("data", U$1), this.removeListener(r, D$1), e(), u({ done: true });
					}, D$1 = () => A$1(/* @__PURE__ */ new Error("stream destroyed"));
					return new Promise((L, it) => {
						Q = it, u = L, this.once(r, D$1), this.once("error", A$1), this.once("end", C), this.once("data", U$1);
					});
				},
				throw: e,
				return: e,
				[K$1]() {
					return this;
				}
			};
		}
		[W$1]() {
			let t = false;
			const e = () => (this.pause(), this.removeListener(P$2, e), this.removeListener(r, e), this.removeListener("end", e), t = true, { done: true }), s = () => {
				if (t) return e();
				const l = this.read();
				return l === null ? e() : { value: l };
			};
			return this.once("end", e), this.once(P$2, e), this.once(r, e), {
				next: s,
				throw: e,
				return: e,
				[W$1]() {
					return this;
				}
			};
		}
		destroy(t) {
			return this[r] ? (t ? this.emit("error", t) : this.emit(r), this) : (this[r] = true, this[i].length = 0, this[n] = 0, typeof this.close == "function" && !this[B$1] && this.close(), t ? this.emit("error", t) : this.emit(r), this);
		}
		static isStream(t) {
			return !!t && (t instanceof F || t instanceof q || t instanceof Z && (typeof t.pipe == "function" || typeof t.write == "function" && typeof t.end == "function"));
		}
	}
	return s$5.Minipass = F, s$5;
}
var e$2, o$4;
function a$7() {
	return o$4 || (o$4 = 1, e$2 = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) !== "win32" ? (r) => r : (r) => r && r.replace(/\\/g, "/")), e$2;
}
var n$2, a$6;
function u$3() {
	if (a$6) return n$2;
	a$6 = 1;
	const { Minipass: o } = ft(), s = a$7(), r = Symbol("slurp");
	return n$2 = class extends o {
		constructor(t, e, i) {
			switch (super(), this.pause(), this.extended = e, this.globalExtended = i, this.header = t, this.startBlockSize = 512 * Math.ceil(t.size / 512), this.blockRemain = this.startBlockSize, this.remain = t.size, this.type = t.type, this.meta = false, this.ignore = false, this.type) {
				case "File":
				case "OldFile":
				case "Link":
				case "SymbolicLink":
				case "CharacterDevice":
				case "BlockDevice":
				case "Directory":
				case "FIFO":
				case "ContiguousFile":
				case "GNUDumpDir": break;
				case "NextFileHasLongLinkpath":
				case "NextFileHasLongPath":
				case "OldGnuLongPath":
				case "GlobalExtendedHeader":
				case "ExtendedHeader":
				case "OldExtendedHeader":
					this.meta = true;
					break;
				default: this.ignore = true;
			}
			this.path = s(t.path), this.mode = t.mode, this.mode && (this.mode = this.mode & 4095), this.uid = t.uid, this.gid = t.gid, this.uname = t.uname, this.gname = t.gname, this.size = t.size, this.mtime = t.mtime, this.atime = t.atime, this.ctime = t.ctime, this.linkpath = s(t.linkpath), this.uname = t.uname, this.gname = t.gname, e && this[r](e), i && this[r](i, true);
		}
		write(t) {
			const e = t.length;
			if (e > this.blockRemain) throw new Error("writing more to entry than is appropriate");
			const i = this.remain, c$1 = this.blockRemain;
			return this.remain = Math.max(0, i - e), this.blockRemain = Math.max(0, c$1 - e), this.ignore ? true : i >= e ? super.write(t) : super.write(t.slice(0, i));
		}
		[r](t, e) {
			for (const i in t) t[i] !== null && t[i] !== void 0 && !(e && i === "path") && (this[i] = i === "path" || i === "linkpath" ? s(t[i]) : t[i]);
		}
	}, n$2;
}
var r$2, a$5;
function f$2() {
	if (a$5) return r$2;
	a$5 = 1;
	const c$1 = E(), d$1 = path;
	class h$2 {
		constructor(e, n) {
			this.atime = e.atime || null, this.charset = e.charset || null, this.comment = e.comment || null, this.ctime = e.ctime || null, this.gid = e.gid || null, this.gname = e.gname || null, this.linkpath = e.linkpath || null, this.mtime = e.mtime || null, this.path = e.path || null, this.size = e.size || null, this.uid = e.uid || null, this.uname = e.uname || null, this.dev = e.dev || null, this.ino = e.ino || null, this.nlink = e.nlink || null, this.global = n || false;
		}
		encode() {
			const e = this.encodeBody();
			if (e === "") return null;
			const n = Buffer.byteLength(e), l = 512 * Math.ceil(1 + n / 512), i = Buffer.allocUnsafe(l);
			for (let t = 0; t < 512; t++) i[t] = 0;
			new c$1({
				path: ("PaxHeader/" + d$1.basename(this.path)).slice(0, 99),
				mode: this.mode || 420,
				uid: this.uid || null,
				gid: this.gid || null,
				size: n,
				mtime: this.mtime || null,
				type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
				linkpath: "",
				uname: this.uname || "",
				gname: this.gname || "",
				devmaj: 0,
				devmin: 0,
				atime: this.atime || null,
				ctime: this.ctime || null
			}).encode(i), i.write(e, 512, n, "utf8");
			for (let t = n + 512; t < i.length; t++) i[t] = 0;
			return i;
		}
		encodeBody() {
			return this.encodeField("path") + this.encodeField("ctime") + this.encodeField("atime") + this.encodeField("dev") + this.encodeField("ino") + this.encodeField("nlink") + this.encodeField("charset") + this.encodeField("comment") + this.encodeField("gid") + this.encodeField("gname") + this.encodeField("linkpath") + this.encodeField("mtime") + this.encodeField("size") + this.encodeField("uid") + this.encodeField("uname");
		}
		encodeField(e) {
			if (this[e] === null || this[e] === void 0) return "";
			const n = this[e] instanceof Date ? this[e].getTime() / 1e3 : this[e], l = " " + (e === "dev" || e === "ino" || e === "nlink" ? "SCHILY." : "") + e + "=" + n + `
`, i = Buffer.byteLength(l);
			let t = Math.floor(Math.log(i) / Math.log(10)) + 1;
			return i + t >= Math.pow(10, t) && (t += 1), t + i + l;
		}
	}
	h$2.parse = (s, e, n) => new h$2(o(u(s), e), n);
	const o = (s, e) => e ? Object.keys(s).reduce((n, l) => (n[l] = s[l], n), e) : s, u = (s) => s.replace(/\n$/, "").split(`
`).reduce(m, Object.create(null)), m = (s, e) => {
		const n = parseInt(e, 10);
		if (n !== Buffer.byteLength(e) + 1) return s;
		e = e.slice((n + " ").length);
		const l = e.split("="), i = l.shift().replace(/^SCHILY\.(dev|ino|nlink)/, "$1");
		if (!i) return s;
		const t = l.join("=");
		return s[i] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(i) ? /* @__PURE__ */ new Date(t * 1e3) : /^[0-9]+$/.test(t) ? +t : t, s;
	};
	return r$2 = h$2, r$2;
}
var i$3 = {};
var _, R$1;
function T() {
	if (R$1) return _;
	R$1 = 1;
	const E = O$2.constants || { ZLIB_VERNUM: 4736 };
	return _ = Object.freeze(Object.assign(Object.create(null), {
		Z_NO_FLUSH: 0,
		Z_PARTIAL_FLUSH: 1,
		Z_SYNC_FLUSH: 2,
		Z_FULL_FLUSH: 3,
		Z_FINISH: 4,
		Z_BLOCK: 5,
		Z_OK: 0,
		Z_STREAM_END: 1,
		Z_NEED_DICT: 2,
		Z_ERRNO: -1,
		Z_STREAM_ERROR: -2,
		Z_DATA_ERROR: -3,
		Z_MEM_ERROR: -4,
		Z_BUF_ERROR: -5,
		Z_VERSION_ERROR: -6,
		Z_NO_COMPRESSION: 0,
		Z_BEST_SPEED: 1,
		Z_BEST_COMPRESSION: 9,
		Z_DEFAULT_COMPRESSION: -1,
		Z_FILTERED: 1,
		Z_HUFFMAN_ONLY: 2,
		Z_RLE: 3,
		Z_FIXED: 4,
		Z_DEFAULT_STRATEGY: 0,
		DEFLATE: 1,
		INFLATE: 2,
		GZIP: 3,
		GUNZIP: 4,
		DEFLATERAW: 5,
		INFLATERAW: 6,
		UNZIP: 7,
		BROTLI_DECODE: 8,
		BROTLI_ENCODE: 9,
		Z_MIN_WINDOWBITS: 8,
		Z_MAX_WINDOWBITS: 15,
		Z_DEFAULT_WINDOWBITS: 15,
		Z_MIN_CHUNK: 64,
		Z_MAX_CHUNK: Infinity,
		Z_DEFAULT_CHUNK: 16384,
		Z_MIN_MEMLEVEL: 1,
		Z_MAX_MEMLEVEL: 9,
		Z_DEFAULT_MEMLEVEL: 8,
		Z_MIN_LEVEL: -1,
		Z_MAX_LEVEL: 9,
		Z_DEFAULT_LEVEL: -1,
		BROTLI_OPERATION_PROCESS: 0,
		BROTLI_OPERATION_FLUSH: 1,
		BROTLI_OPERATION_FINISH: 2,
		BROTLI_OPERATION_EMIT_METADATA: 3,
		BROTLI_MODE_GENERIC: 0,
		BROTLI_MODE_TEXT: 1,
		BROTLI_MODE_FONT: 2,
		BROTLI_DEFAULT_MODE: 0,
		BROTLI_MIN_QUALITY: 0,
		BROTLI_MAX_QUALITY: 11,
		BROTLI_DEFAULT_QUALITY: 11,
		BROTLI_MIN_WINDOW_BITS: 10,
		BROTLI_MAX_WINDOW_BITS: 24,
		BROTLI_LARGE_MAX_WINDOW_BITS: 30,
		BROTLI_DEFAULT_WINDOW: 22,
		BROTLI_MIN_INPUT_BLOCK_BITS: 16,
		BROTLI_MAX_INPUT_BLOCK_BITS: 24,
		BROTLI_PARAM_MODE: 0,
		BROTLI_PARAM_QUALITY: 1,
		BROTLI_PARAM_LGWIN: 2,
		BROTLI_PARAM_LGBLOCK: 3,
		BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
		BROTLI_PARAM_SIZE_HINT: 5,
		BROTLI_PARAM_LARGE_WINDOW: 6,
		BROTLI_PARAM_NPOSTFIX: 7,
		BROTLI_PARAM_NDIRECT: 8,
		BROTLI_DECODER_RESULT_ERROR: 0,
		BROTLI_DECODER_RESULT_SUCCESS: 1,
		BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
		BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
		BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
		BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
		BROTLI_DECODER_NO_ERROR: 0,
		BROTLI_DECODER_SUCCESS: 1,
		BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
		BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
		BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
		BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
		BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
		BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
		BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
		BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
		BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
		BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
		BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
		BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
		BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
		BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
		BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
		BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
		BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
		BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
		BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
		BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
		BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
		BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
		BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
		BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
		BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
		BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
		BROTLI_DECODER_ERROR_UNREACHABLE: -31
	}, E)), _;
}
var j, H$1;
function tt() {
	if (H$1) return j;
	H$1 = 1;
	const I$1 = typeof process == "object" && process ? process : {
		stdout: null,
		stderr: null
	}, Y = nt, x$1 = ot, N$1 = ht.StringDecoder, u = Symbol("EOF"), a = Symbol("maybeEmitEnd"), c$1 = Symbol("emittedEnd"), S = Symbol("emittingEnd"), E = Symbol("emittedError"), w = Symbol("closed"), P$2 = Symbol("read"), L = Symbol("flush"), _ = Symbol("flushChunk"), h$2 = Symbol("encoding"), m = Symbol("decoder"), M$1 = Symbol("flowing"), y = Symbol("paused"), p = Symbol("resume"), s = Symbol("bufferLength"), T = Symbol("bufferPush"), B$1 = Symbol("bufferShift"), r = Symbol("objectMode"), n = Symbol("destroyed"), D$1 = Symbol("emitData"), F = Symbol("emitEnd"), R = Symbol("emitEnd2"), d$1 = Symbol("async"), b$1 = (o) => Promise.resolve().then(o), C = commonjsGlobal._MP_NO_ITERATOR_SYMBOLS_ !== "1", $ = C && Symbol.asyncIterator || Symbol("asyncIterator not implemented"), G = C && Symbol.iterator || Symbol("iterator not implemented"), V$1 = (o) => o === "end" || o === "finish" || o === "prefinish", v = (o) => o instanceof ArrayBuffer || typeof o == "object" && o.constructor && o.constructor.name === "ArrayBuffer" && o.byteLength >= 0, J = (o) => !Buffer.isBuffer(o) && ArrayBuffer.isView(o);
	class U$1 {
		constructor(t, e, i) {
			this.src = t, this.dest = e, this.opts = i, this.ondrain = () => t[p](), e.on("drain", this.ondrain);
		}
		unpipe() {
			this.dest.removeListener("drain", this.ondrain);
		}
		proxyErrors() {}
		end() {
			this.unpipe(), this.opts.end && this.dest.end();
		}
	}
	class K$1 extends U$1 {
		unpipe() {
			this.src.removeListener("error", this.proxyErrors), super.unpipe();
		}
		constructor(t, e, i) {
			super(t, e, i), this.proxyErrors = (l) => e.emit("error", l), t.on("error", this.proxyErrors);
		}
	}
	return j = class q extends x$1 {
		constructor(t) {
			super(), this[M$1] = false, this[y] = false, this.pipes = [], this.buffer = [], this[r] = t && t.objectMode || false, this[r] ? this[h$2] = null : this[h$2] = t && t.encoding || null, this[h$2] === "buffer" && (this[h$2] = null), this[d$1] = t && !!t.async || false, this[m] = this[h$2] ? new N$1(this[h$2]) : null, this[u] = false, this[c$1] = false, this[S] = false, this[w] = false, this[E] = null, this.writable = true, this.readable = true, this[s] = 0, this[n] = false;
		}
		get bufferLength() {
			return this[s];
		}
		get encoding() {
			return this[h$2];
		}
		set encoding(t) {
			if (this[r]) throw new Error("cannot set encoding in objectMode");
			if (this[h$2] && t !== this[h$2] && (this[m] && this[m].lastNeed || this[s])) throw new Error("cannot change encoding");
			this[h$2] !== t && (this[m] = t ? new N$1(t) : null, this.buffer.length && (this.buffer = this.buffer.map((e) => this[m].write(e)))), this[h$2] = t;
		}
		setEncoding(t) {
			this.encoding = t;
		}
		get objectMode() {
			return this[r];
		}
		set objectMode(t) {
			this[r] = this[r] || !!t;
		}
		get async() {
			return this[d$1];
		}
		set async(t) {
			this[d$1] = this[d$1] || !!t;
		}
		write(t, e, i) {
			if (this[u]) throw new Error("write after end");
			if (this[n]) return this.emit("error", Object.assign(/* @__PURE__ */ new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" })), true;
			typeof e == "function" && (i = e, e = "utf8"), e || (e = "utf8");
			const l = this[d$1] ? b$1 : (f) => f();
			return !this[r] && !Buffer.isBuffer(t) && (J(t) ? t = Buffer.from(t.buffer, t.byteOffset, t.byteLength) : v(t) ? t = Buffer.from(t) : typeof t != "string" && (this.objectMode = true)), this[r] ? (this.flowing && this[s] !== 0 && this[L](true), this.flowing ? this.emit("data", t) : this[T](t), this[s] !== 0 && this.emit("readable"), i && l(i), this.flowing) : t.length ? (typeof t == "string" && !(e === this[h$2] && !this[m].lastNeed) && (t = Buffer.from(t, e)), Buffer.isBuffer(t) && this[h$2] && (t = this[m].write(t)), this.flowing && this[s] !== 0 && this[L](true), this.flowing ? this.emit("data", t) : this[T](t), this[s] !== 0 && this.emit("readable"), i && l(i), this.flowing) : (this[s] !== 0 && this.emit("readable"), i && l(i), this.flowing);
		}
		read(t) {
			if (this[n]) return null;
			if (this[s] === 0 || t === 0 || t > this[s]) return this[a](), null;
			this[r] && (t = null), this.buffer.length > 1 && !this[r] && (this.encoding ? this.buffer = [this.buffer.join("")] : this.buffer = [Buffer.concat(this.buffer, this[s])]);
			const e = this[P$2](t || null, this.buffer[0]);
			return this[a](), e;
		}
		[P$2](t, e) {
			return t === e.length || t === null ? this[B$1]() : (this.buffer[0] = e.slice(t), e = e.slice(0, t), this[s] -= t), this.emit("data", e), !this.buffer.length && !this[u] && this.emit("drain"), e;
		}
		end(t, e, i) {
			return typeof t == "function" && (i = t, t = null), typeof e == "function" && (i = e, e = "utf8"), t && this.write(t, e), i && this.once("end", i), this[u] = true, this.writable = false, (this.flowing || !this[y]) && this[a](), this;
		}
		[p]() {
			this[n] || (this[y] = false, this[M$1] = true, this.emit("resume"), this.buffer.length ? this[L]() : this[u] ? this[a]() : this.emit("drain"));
		}
		resume() {
			return this[p]();
		}
		pause() {
			this[M$1] = false, this[y] = true;
		}
		get destroyed() {
			return this[n];
		}
		get flowing() {
			return this[M$1];
		}
		get paused() {
			return this[y];
		}
		[T](t) {
			this[r] ? this[s] += 1 : this[s] += t.length, this.buffer.push(t);
		}
		[B$1]() {
			return this.buffer.length && (this[r] ? this[s] -= 1 : this[s] -= this.buffer[0].length), this.buffer.shift();
		}
		[L](t) {
			do			;
while (this[_](this[B$1]()));
			!t && !this.buffer.length && !this[u] && this.emit("drain");
		}
		[_](t) {
			return t ? (this.emit("data", t), this.flowing) : false;
		}
		pipe(t, e) {
			if (this[n]) return;
			const i = this[c$1];
			return e = e || {}, t === I$1.stdout || t === I$1.stderr ? e.end = false : e.end = e.end !== false, e.proxyErrors = !!e.proxyErrors, i ? e.end && t.end() : (this.pipes.push(e.proxyErrors ? new K$1(this, t, e) : new U$1(this, t, e)), this[d$1] ? b$1(() => this[p]()) : this[p]()), t;
		}
		unpipe(t) {
			const e = this.pipes.find((i) => i.dest === t);
			e && (this.pipes.splice(this.pipes.indexOf(e), 1), e.unpipe());
		}
		addListener(t, e) {
			return this.on(t, e);
		}
		on(t, e) {
			const i = super.on(t, e);
			return t === "data" && !this.pipes.length && !this.flowing ? this[p]() : t === "readable" && this[s] !== 0 ? super.emit("readable") : V$1(t) && this[c$1] ? (super.emit(t), this.removeAllListeners(t)) : t === "error" && this[E] && (this[d$1] ? b$1(() => e.call(this, this[E])) : e.call(this, this[E])), i;
		}
		get emittedEnd() {
			return this[c$1];
		}
		[a]() {
			!this[S] && !this[c$1] && !this[n] && this.buffer.length === 0 && this[u] && (this[S] = true, this.emit("end"), this.emit("prefinish"), this.emit("finish"), this[w] && this.emit("close"), this[S] = false);
		}
		emit(t, e, ...i) {
			if (t !== "error" && t !== "close" && t !== n && this[n]) return;
			if (t === "data") return e ? this[d$1] ? b$1(() => this[D$1](e)) : this[D$1](e) : false;
			if (t === "end") return this[F]();
			if (t === "close") {
				if (this[w] = true, !this[c$1] && !this[n]) return;
				const f = super.emit("close");
				return this.removeAllListeners("close"), f;
			} else if (t === "error") {
				this[E] = e;
				const f = super.emit("error", e);
				return this[a](), f;
			} else if (t === "resume") {
				const f = super.emit("resume");
				return this[a](), f;
			} else if (t === "finish" || t === "prefinish") {
				const f = super.emit(t);
				return this.removeAllListeners(t), f;
			}
			const l = super.emit(t, e, ...i);
			return this[a](), l;
		}
		[D$1](t) {
			for (const i of this.pipes) i.dest.write(t) === false && this.pause();
			const e = super.emit("data", t);
			return this[a](), e;
		}
		[F]() {
			this[c$1] || (this[c$1] = true, this.readable = false, this[d$1] ? b$1(() => this[R]()) : this[R]());
		}
		[R]() {
			if (this[m]) {
				const e = this[m].end();
				if (e) {
					for (const i of this.pipes) i.dest.write(e);
					super.emit("data", e);
				}
			}
			for (const e of this.pipes) e.end();
			const t = super.emit("end");
			return this.removeAllListeners("end"), t;
		}
		collect() {
			const t = [];
			this[r] || (t.dataLength = 0);
			const e = this.promise();
			return this.on("data", (i) => {
				t.push(i), this[r] || (t.dataLength += i.length);
			}), e.then(() => t);
		}
		concat() {
			return this[r] ? Promise.reject(/* @__PURE__ */ new Error("cannot concat in objectMode")) : this.collect().then((t) => this[r] ? Promise.reject(/* @__PURE__ */ new Error("cannot concat in objectMode")) : this[h$2] ? t.join("") : Buffer.concat(t, t.dataLength));
		}
		promise() {
			return new Promise((t, e) => {
				this.on(n, () => e(/* @__PURE__ */ new Error("stream destroyed"))), this.on("error", (i) => e(i)), this.on("end", () => t());
			});
		}
		[$]() {
			return { next: () => {
				const e = this.read();
				if (e !== null) return Promise.resolve({
					done: false,
					value: e
				});
				if (this[u]) return Promise.resolve({ done: true });
				let i = null, l = null;
				const f = (g$1) => {
					this.removeListener("data", A$1), this.removeListener("end", O), l(g$1);
				}, A$1 = (g$1) => {
					this.removeListener("error", f), this.removeListener("end", O), this.pause(), i({
						value: g$1,
						done: !!this[u]
					});
				}, O = () => {
					this.removeListener("error", f), this.removeListener("data", A$1), i({ done: true });
				}, W$1 = () => f(/* @__PURE__ */ new Error("stream destroyed"));
				return new Promise((g$1, z) => {
					l = z, i = g$1, this.once(n, W$1), this.once("error", f), this.once("end", O), this.once("data", A$1);
				});
			} };
		}
		[G]() {
			return { next: () => {
				const e = this.read();
				return {
					value: e,
					done: e === null
				};
			} };
		}
		destroy(t) {
			return this[n] ? (t ? this.emit("error", t) : this.emit(n), this) : (this[n] = true, this.buffer.length = 0, this[s] = 0, typeof this.close == "function" && !this[w] && this.close(), t ? this.emit("error", t) : this.emit(n), this);
		}
		static isStream(t) {
			return !!t && (t instanceof q || t instanceof x$1 || t instanceof Y && (typeof t.pipe == "function" || typeof t.write == "function" && typeof t.end == "function"));
		}
	}, j;
}
var C;
function J() {
	if (C) return i$3;
	C = 1;
	const w = j$1, n = P.Buffer, z = O$2, u = i$3.constants = T(), L = tt(), E = n.concat, c$1 = Symbol("_superWrite");
	class d$1 extends Error {
		constructor(s) {
			super("zlib: " + s.message), this.code = s.code, this.errno = s.errno, this.code || (this.code = "ZLIB_ERROR"), this.message = "zlib: " + s.message, Error.captureStackTrace(this, this.constructor);
		}
		get name() {
			return "ZlibError";
		}
	}
	const Z = Symbol("opts"), p = Symbol("flushFlag"), I$1 = Symbol("finishFlushFlag"), y = Symbol("fullFlushFlag"), t = Symbol("handle"), _ = Symbol("onError"), f = Symbol("sawError"), F = Symbol("level"), S = Symbol("strategy"), g$1 = Symbol("ended");
	class x$1 extends L {
		constructor(s, e) {
			if (!s || typeof s != "object") throw new TypeError("invalid options for ZlibBase constructor");
			super(s), this[f] = false, this[g$1] = false, this[Z] = s, this[p] = s.flush, this[I$1] = s.finishFlush;
			try {
				this[t] = new z[e](s);
			} catch (i) {
				throw new d$1(i);
			}
			this[_] = (i) => {
				this[f] || (this[f] = true, this.close(), this.emit("error", i));
			}, this[t].on("error", (i) => this[_](new d$1(i))), this.once("end", () => this.close);
		}
		close() {
			this[t] && (this[t].close(), this[t] = null, this.emit("close"));
		}
		reset() {
			if (!this[f]) return w(this[t], "zlib binding closed"), this[t].reset();
		}
		flush(s) {
			this.ended || (typeof s != "number" && (s = this[y]), this.write(Object.assign(n.alloc(0), { [p]: s })));
		}
		end(s, e, i) {
			return s && this.write(s, e), this.flush(this[I$1]), this[g$1] = true, super.end(null, null, i);
		}
		get ended() {
			return this[g$1];
		}
		write(s, e, i) {
			if (typeof e == "function" && (i = e, e = "utf8"), typeof s == "string" && (s = n.from(s, e)), this[f]) return;
			w(this[t], "zlib binding closed");
			const m = this[t]._handle, R = m.close;
			m.close = () => {};
			const G = this[t].close;
			this[t].close = () => {}, n.concat = (l) => l;
			let h$2;
			try {
				const l = typeof s[p] == "number" ? s[p] : this[p];
				h$2 = this[t]._processChunk(s, l), n.concat = E;
			} catch (l) {
				n.concat = E, this[_](new d$1(l));
			} finally {
				this[t] && (this[t]._handle = m, m.close = R, this[t].close = G, this[t].removeAllListeners("error"));
			}
			this[t] && this[t].on("error", (l) => this[_](new d$1(l)));
			let b$1;
			if (h$2) if (Array.isArray(h$2) && h$2.length > 0) {
				b$1 = this[c$1](n.from(h$2[0]));
				for (let l = 1; l < h$2.length; l++) b$1 = this[c$1](h$2[l]);
			} else b$1 = this[c$1](n.from(h$2));
			return i && i(), b$1;
		}
		[c$1](s) {
			return super.write(s);
		}
	}
	class a extends x$1 {
		constructor(s, e) {
			s = s || {}, s.flush = s.flush || u.Z_NO_FLUSH, s.finishFlush = s.finishFlush || u.Z_FINISH, super(s, e), this[y] = u.Z_FULL_FLUSH, this[F] = s.level, this[S] = s.strategy;
		}
		params(s, e) {
			if (!this[f]) {
				if (!this[t]) throw new Error("cannot switch params when binding is closed");
				if (!this[t].params) throw new Error("not supported in this implementation");
				if (this[F] !== s || this[S] !== e) {
					this.flush(u.Z_SYNC_FLUSH), w(this[t], "zlib binding closed");
					const i = this[t].flush;
					this[t].flush = (m, R) => {
						this.flush(m), R();
					};
					try {
						this[t].params(s, e);
					} finally {
						this[t].flush = i;
					}
					this[t] && (this[F] = s, this[S] = e);
				}
			}
		}
	}
	class q extends a {
		constructor(s) {
			super(s, "Deflate");
		}
	}
	class D$1 extends a {
		constructor(s) {
			super(s, "Inflate");
		}
	}
	const B$1 = Symbol("_portable");
	class $ extends a {
		constructor(s) {
			super(s, "Gzip"), this[B$1] = s && !!s.portable;
		}
		[c$1](s) {
			return this[B$1] ? (this[B$1] = false, s[9] = 255, super[c$1](s)) : super[c$1](s);
		}
	}
	class N$1 extends a {
		constructor(s) {
			super(s, "Gunzip");
		}
	}
	class H extends a {
		constructor(s) {
			super(s, "DeflateRaw");
		}
	}
	let T$1$1 = class T extends a {
		constructor(s) {
			super(s, "InflateRaw");
		}
	};
	class U$1 extends a {
		constructor(s) {
			super(s, "Unzip");
		}
	}
	class O extends x$1 {
		constructor(s, e) {
			s = s || {}, s.flush = s.flush || u.BROTLI_OPERATION_PROCESS, s.finishFlush = s.finishFlush || u.BROTLI_OPERATION_FINISH, super(s, e), this[y] = u.BROTLI_OPERATION_FLUSH;
		}
	}
	class v extends O {
		constructor(s) {
			super(s, "BrotliCompress");
		}
	}
	class A$1 extends O {
		constructor(s) {
			super(s, "BrotliDecompress");
		}
	}
	return i$3.Deflate = q, i$3.Inflate = D$1, i$3.Gzip = $, i$3.Gunzip = N$1, i$3.DeflateRaw = H, i$3.InflateRaw = T$1$1, i$3.Unzip = U$1, typeof z.BrotliCompress == "function" ? (i$3.BrotliCompress = v, i$3.BrotliDecompress = A$1) : i$3.BrotliCompress = i$3.BrotliDecompress = class {
		constructor() {
			throw new Error("Brotli is not supported in this version of Node.js");
		}
	}, i$3;
}
var O$1, F$2;
function rt() {
	if (F$2) return O$1;
	F$2 = 1;
	const P$2 = c$4(), $ = E(), v = nt, W$1 = c$3(), G = 1024 * 1024, k = u$3(), C = f$2(), x$1 = J(), { nextTick: j } = nt$1, B$1 = Buffer.from([31, 139]), h$2 = Symbol("state"), d$1 = Symbol("writeEntry"), a = Symbol("readEntry"), I$1 = Symbol("nextEntry"), U$1 = Symbol("processEntry"), l = Symbol("extendedHeader"), y = Symbol("globalExtendedHeader"), c$1 = Symbol("meta"), H = Symbol("emitMeta"), n = Symbol("buffer"), f = Symbol("queue"), u = Symbol("ended"), L = Symbol("emittedEnd"), b$1 = Symbol("emit"), r = Symbol("unzip"), _ = Symbol("consumeChunk"), g$1 = Symbol("consumeChunkSub"), q = Symbol("consumeBody"), z = Symbol("consumeMeta"), Y = Symbol("consumeHeader"), N$1 = Symbol("consuming"), D$1 = Symbol("bufferConcat"), M$1 = Symbol("maybeEnd"), S = Symbol("writing"), m = Symbol("aborted"), T = Symbol("onDone"), E$1$1 = Symbol("sawValidEntry"), R = Symbol("sawNullBlock"), A$1 = Symbol("sawEOF"), V$1 = Symbol("closeStream"), K$1 = (X) => true;
	return O$1 = P$2(class extends v {
		constructor(t) {
			t = t || {}, super(t), this.file = t.file || "", this[E$1$1] = null, this.on(T, (s) => {
				(this[h$2] === "begin" || this[E$1$1] === false) && this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
			}), t.ondone ? this.on(T, t.ondone) : this.on(T, (s) => {
				this.emit("prefinish"), this.emit("finish"), this.emit("end");
			}), this.strict = !!t.strict, this.maxMetaEntrySize = t.maxMetaEntrySize || G, this.filter = typeof t.filter == "function" ? t.filter : K$1;
			const i = t.file && (t.file.endsWith(".tar.br") || t.file.endsWith(".tbr"));
			this.brotli = !t.gzip && t.brotli !== void 0 ? t.brotli : i ? void 0 : false, this.writable = true, this.readable = false, this[f] = new W$1(), this[n] = null, this[a] = null, this[d$1] = null, this[h$2] = "begin", this[c$1] = "", this[l] = null, this[y] = null, this[u] = false, this[r] = null, this[m] = false, this[R] = false, this[A$1] = false, this.on("end", () => this[V$1]()), typeof t.onwarn == "function" && this.on("warn", t.onwarn), typeof t.onentry == "function" && this.on("entry", t.onentry);
		}
		[Y](t, i) {
			this[E$1$1] === null && (this[E$1$1] = false);
			let s;
			try {
				s = new $(t, i, this[l], this[y]);
			} catch (o) {
				return this.warn("TAR_ENTRY_INVALID", o);
			}
			if (s.nullBlock) this[R] ? (this[A$1] = true, this[h$2] === "begin" && (this[h$2] = "header"), this[b$1]("eof")) : (this[R] = true, this[b$1]("nullBlock"));
			else if (this[R] = false, !s.cksumValid) this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: s });
			else if (!s.path) this.warn("TAR_ENTRY_INVALID", "path is required", { header: s });
			else {
				const o = s.type;
				if (/^(Symbolic)?Link$/.test(o) && !s.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: s });
				else if (!/^(Symbolic)?Link$/.test(o) && s.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: s });
				else {
					const e = this[d$1] = new k(s, this[l], this[y]);
					if (!this[E$1$1]) if (e.remain) {
						const w = () => {
							e.invalid || (this[E$1$1] = true);
						};
						e.on("end", w);
					} else this[E$1$1] = true;
					e.meta ? e.size > this.maxMetaEntrySize ? (e.ignore = true, this[b$1]("ignoredEntry", e), this[h$2] = "ignore", e.resume()) : e.size > 0 && (this[c$1] = "", e.on("data", (w) => this[c$1] += w), this[h$2] = "meta") : (this[l] = null, e.ignore = e.ignore || !this.filter(e.path, e), e.ignore ? (this[b$1]("ignoredEntry", e), this[h$2] = e.remain ? "ignore" : "header", e.resume()) : (e.remain ? this[h$2] = "body" : (this[h$2] = "header", e.end()), this[a] ? this[f].push(e) : (this[f].push(e), this[I$1]())));
				}
			}
		}
		[V$1]() {
			j(() => this.emit("close"));
		}
		[U$1](t) {
			let i = true;
			return t ? Array.isArray(t) ? this.emit.apply(this, t) : (this[a] = t, this.emit("entry", t), t.emittedEnd || (t.on("end", (s) => this[I$1]()), i = false)) : (this[a] = null, i = false), i;
		}
		[I$1]() {
			do			;
while (this[U$1](this[f].shift()));
			if (!this[f].length) {
				const t = this[a];
				!t || t.flowing || t.size === t.remain ? this[S] || this.emit("drain") : t.once("drain", (s) => this.emit("drain"));
			}
		}
		[q](t, i) {
			const s = this[d$1], o = s.blockRemain, e = o >= t.length && i === 0 ? t : t.slice(i, i + o);
			return s.write(e), s.blockRemain || (this[h$2] = "header", this[d$1] = null, s.end()), e.length;
		}
		[z](t, i) {
			const s = this[d$1], o = this[q](t, i);
			return this[d$1] || this[H](s), o;
		}
		[b$1](t, i, s) {
			!this[f].length && !this[a] ? this.emit(t, i, s) : this[f].push([
				t,
				i,
				s
			]);
		}
		[H](t) {
			switch (this[b$1]("meta", this[c$1]), t.type) {
				case "ExtendedHeader":
				case "OldExtendedHeader":
					this[l] = C.parse(this[c$1], this[l], false);
					break;
				case "GlobalExtendedHeader":
					this[y] = C.parse(this[c$1], this[y], true);
					break;
				case "NextFileHasLongPath":
				case "OldGnuLongPath":
					this[l] = this[l] || Object.create(null), this[l].path = this[c$1].replace(/\0.*/, "");
					break;
				case "NextFileHasLongLinkpath":
					this[l] = this[l] || Object.create(null), this[l].linkpath = this[c$1].replace(/\0.*/, "");
					break;
				default: throw new Error("unknown meta: " + t.type);
			}
		}
		abort(t) {
			this[m] = true, this.emit("abort", t), this.warn("TAR_ABORT", t, { recoverable: false });
		}
		write(t) {
			if (this[m]) return;
			if ((this[r] === null || this.brotli === void 0 && this[r] === false) && t) {
				if (this[n] && (t = Buffer.concat([this[n], t]), this[n] = null), t.length < B$1.length) return this[n] = t, true;
				for (let e = 0; this[r] === null && e < B$1.length; e++) t[e] !== B$1[e] && (this[r] = false);
				const o = this.brotli === void 0;
				if (this[r] === false && o) if (t.length < 512) if (this[u]) this.brotli = true;
				else return this[n] = t, true;
				else try {
					new $(t.slice(0, 512)), this.brotli = !1;
				} catch {
					this.brotli = true;
				}
				if (this[r] === null || this[r] === false && this.brotli) {
					const e = this[u];
					this[u] = false, this[r] = this[r] === null ? new x$1.Unzip() : new x$1.BrotliDecompress(), this[r].on("data", (p) => this[_](p)), this[r].on("error", (p) => this.abort(p)), this[r].on("end", (p) => {
						this[u] = true, this[_]();
					}), this[S] = true;
					const w = this[r][e ? "end" : "write"](t);
					return this[S] = false, w;
				}
			}
			this[S] = true, this[r] ? this[r].write(t) : this[_](t), this[S] = false;
			const s = this[f].length ? false : this[a] ? this[a].flowing : true;
			return !s && !this[f].length && this[a].once("drain", (o) => this.emit("drain")), s;
		}
		[D$1](t) {
			t && !this[m] && (this[n] = this[n] ? Buffer.concat([this[n], t]) : t);
		}
		[M$1]() {
			if (this[u] && !this[L] && !this[m] && !this[N$1]) {
				this[L] = true;
				const t = this[d$1];
				if (t && t.blockRemain) {
					const i = this[n] ? this[n].length : 0;
					this.warn("TAR_BAD_ARCHIVE", `Truncated input (needed ${t.blockRemain} more bytes, only ${i} available)`, { entry: t }), this[n] && t.write(this[n]), t.end();
				}
				this[b$1](T);
			}
		}
		[_](t) {
			if (this[N$1]) this[D$1](t);
			else if (!t && !this[n]) this[M$1]();
			else {
				if (this[N$1] = true, this[n]) {
					this[D$1](t);
					const i = this[n];
					this[n] = null, this[g$1](i);
				} else this[g$1](t);
				for (; this[n] && this[n].length >= 512 && !this[m] && !this[A$1];) {
					const i = this[n];
					this[n] = null, this[g$1](i);
				}
				this[N$1] = false;
			}
			(!this[n] || this[u]) && this[M$1]();
		}
		[g$1](t) {
			let i = 0;
			const s = t.length;
			for (; i + 512 <= s && !this[m] && !this[A$1];) switch (this[h$2]) {
				case "begin":
				case "header":
					this[Y](t, i), i += 512;
					break;
				case "ignore":
				case "body":
					i += this[q](t, i);
					break;
				case "meta":
					i += this[z](t, i);
					break;
				default: throw new Error("invalid state: " + this[h$2]);
			}
			i < s && (this[n] ? this[n] = Buffer.concat([t.slice(i), this[n]]) : this[n] = t.slice(i));
		}
		end(t) {
			this[m] || (this[r] ? this[r].end(t) : (this[u] = true, this.brotli === void 0 && (t = t || Buffer.alloc(0)), this.write(t)));
		}
	}), O$1;
}
var s$4 = {};
var v$1;
function X() {
	if (v$1) return s$4;
	v$1 = 1;
	const H = tt(), I$1 = nt.EventEmitter, r = nativeFs;
	let R = r.writev;
	if (!R) {
		const c$1 = process.binding("fs"), t = c$1.FSReqWrap || c$1.FSReqCallback;
		R = (e, i, $, A$1) => {
			const G = (J, K$1) => A$1(J, K$1, i), j = new t();
			j.oncomplete = G, c$1.writeBuffers(e, i, $, j);
		};
	}
	const m = Symbol("_autoClose"), h$2 = Symbol("_close"), g$1 = Symbol("_ended"), s = Symbol("_fd"), B$1 = Symbol("_finished"), o = Symbol("_flags"), x$1 = Symbol("_flush"), z = Symbol("_handleChunk"), T = Symbol("_makeBuf"), q = Symbol("_mode"), E = Symbol("_needDrain"), d$1 = Symbol("_onerror"), y = Symbol("_onopen"), W$1 = Symbol("_onread"), _ = Symbol("_onwrite"), a = Symbol("_open"), l = Symbol("_path"), u = Symbol("_pos"), n = Symbol("_queue"), S = Symbol("_read"), M$1 = Symbol("_readSize"), f = Symbol("_reading"), k = Symbol("_remain"), N$1 = Symbol("_size"), C = Symbol("_write"), b$1 = Symbol("_writing"), F = Symbol("_defaultFlag"), p = Symbol("_errored");
	class D$1 extends H {
		constructor(t, e) {
			if (e = e || {}, super(e), this.readable = true, this.writable = false, typeof t != "string") throw new TypeError("path must be a string");
			this[p] = false, this[s] = typeof e.fd == "number" ? e.fd : null, this[l] = t, this[M$1] = e.readSize || 16 * 1024 * 1024, this[f] = false, this[N$1] = typeof e.size == "number" ? e.size : Infinity, this[k] = this[N$1], this[m] = typeof e.autoClose == "boolean" ? e.autoClose : true, typeof this[s] == "number" ? this[S]() : this[a]();
		}
		get fd() {
			return this[s];
		}
		get path() {
			return this[l];
		}
		write() {
			throw new TypeError("this is a readable stream");
		}
		end() {
			throw new TypeError("this is a readable stream");
		}
		[a]() {
			r.open(this[l], "r", (t, e) => this[y](t, e));
		}
		[y](t, e) {
			t ? this[d$1](t) : (this[s] = e, this.emit("open", e), this[S]());
		}
		[T]() {
			return Buffer.allocUnsafe(Math.min(this[M$1], this[k]));
		}
		[S]() {
			if (!this[f]) {
				this[f] = true;
				const t = this[T]();
				if (t.length === 0) return process.nextTick(() => this[W$1](null, 0, t));
				r.read(this[s], t, 0, t.length, null, (e, i, $) => this[W$1](e, i, $));
			}
		}
		[W$1](t, e, i) {
			this[f] = false, t ? this[d$1](t) : this[z](e, i) && this[S]();
		}
		[h$2]() {
			if (this[m] && typeof this[s] == "number") {
				const t = this[s];
				this[s] = null, r.close(t, (e) => e ? this.emit("error", e) : this.emit("close"));
			}
		}
		[d$1](t) {
			this[f] = true, this[h$2](), this.emit("error", t);
		}
		[z](t, e) {
			let i = false;
			return this[k] -= t, t > 0 && (i = super.write(t < e.length ? e.slice(0, t) : e)), (t === 0 || this[k] <= 0) && (i = false, this[h$2](), super.end()), i;
		}
		emit(t, e) {
			switch (t) {
				case "prefinish":
				case "finish": break;
				case "drain":
					typeof this[s] == "number" && this[S]();
					break;
				case "error": return this[p] ? void 0 : (this[p] = true, super.emit(t, e));
				default: return super.emit(t, e);
			}
		}
	}
	class P$2 extends D$1 {
		[a]() {
			let t = true;
			try {
				this[y](null, r.openSync(this[l], "r")), t = !1;
			} finally {
				t && this[h$2]();
			}
		}
		[S]() {
			let t = true;
			try {
				if (!this[f]) {
					this[f] = !0;
					do {
						const e = this[T](), i = e.length === 0 ? 0 : r.readSync(this[s], e, 0, e.length, null);
						if (!this[z](i, e)) break;
					} while (!0);
					this[f] = !1;
				}
				t = !1;
			} finally {
				t && this[h$2]();
			}
		}
		[h$2]() {
			if (this[m] && typeof this[s] == "number") {
				const t = this[s];
				this[s] = null, r.closeSync(t), this.emit("close");
			}
		}
	}
	class O extends I$1 {
		constructor(t, e) {
			e = e || {}, super(e), this.readable = false, this.writable = true, this[p] = false, this[b$1] = false, this[g$1] = false, this[E] = false, this[n] = [], this[l] = t, this[s] = typeof e.fd == "number" ? e.fd : null, this[q] = e.mode === void 0 ? 438 : e.mode, this[u] = typeof e.start == "number" ? e.start : null, this[m] = typeof e.autoClose == "boolean" ? e.autoClose : true;
			const i = this[u] !== null ? "r+" : "w";
			this[F] = e.flags === void 0, this[o] = this[F] ? i : e.flags, this[s] === null && this[a]();
		}
		emit(t, e) {
			if (t === "error") {
				if (this[p]) return;
				this[p] = true;
			}
			return super.emit(t, e);
		}
		get fd() {
			return this[s];
		}
		get path() {
			return this[l];
		}
		[d$1](t) {
			this[h$2](), this[b$1] = true, this.emit("error", t);
		}
		[a]() {
			r.open(this[l], this[o], this[q], (t, e) => this[y](t, e));
		}
		[y](t, e) {
			this[F] && this[o] === "r+" && t && t.code === "ENOENT" ? (this[o] = "w", this[a]()) : t ? this[d$1](t) : (this[s] = e, this.emit("open", e), this[x$1]());
		}
		end(t, e) {
			return t && this.write(t, e), this[g$1] = true, !this[b$1] && !this[n].length && typeof this[s] == "number" && this[_](null, 0), this;
		}
		write(t, e) {
			return typeof t == "string" && (t = Buffer.from(t, e)), this[g$1] ? (this.emit("error", /* @__PURE__ */ new Error("write() after end()")), false) : this[s] === null || this[b$1] || this[n].length ? (this[n].push(t), this[E] = true, false) : (this[b$1] = true, this[C](t), true);
		}
		[C](t) {
			r.write(this[s], t, 0, t.length, this[u], (e, i) => this[_](e, i));
		}
		[_](t, e) {
			t ? this[d$1](t) : (this[u] !== null && (this[u] += e), this[n].length ? this[x$1]() : (this[b$1] = false, this[g$1] && !this[B$1] ? (this[B$1] = true, this[h$2](), this.emit("finish")) : this[E] && (this[E] = false, this.emit("drain"))));
		}
		[x$1]() {
			if (this[n].length === 0) this[g$1] && this[_](null, 0);
			else if (this[n].length === 1) this[C](this[n].pop());
			else {
				const t = this[n];
				this[n] = [], R(this[s], t, this[u], (e, i) => this[_](e, i));
			}
		}
		[h$2]() {
			if (this[m] && typeof this[s] == "number") {
				const t = this[s];
				this[s] = null, r.close(t, (e) => e ? this.emit("error", e) : this.emit("close"));
			}
		}
	}
	class U$1 extends O {
		[a]() {
			let t;
			if (this[F] && this[o] === "r+") try {
				t = r.openSync(this[l], this[o], this[q]);
			} catch (e) {
				if (e.code === "ENOENT") return this[o] = "w", this[a]();
				throw e;
			}
			else t = r.openSync(this[l], this[o], this[q]);
			this[y](null, t);
		}
		[h$2]() {
			if (this[m] && typeof this[s] == "number") {
				const t = this[s];
				this[s] = null, r.closeSync(t), this.emit("close");
			}
		}
		[C](t) {
			let e = true;
			try {
				this[_](null, r.writeSync(this[s], t, 0, t.length, this[u])), e = !1;
			} finally {
				if (e) try {
					this[h$2]();
				} catch {}
			}
		}
	}
	return s$4.ReadStream = D$1, s$4.ReadStreamSync = P$2, s$4.WriteStream = O, s$4.WriteStreamSync = U$1, s$4;
}
var r$1 = { exports: {} };
var i$2, m$2;
function t$2() {
	if (m$2) return i$2;
	m$2 = 1;
	const { promisify: n } = a$a, e = nativeFs;
	return i$2 = (r) => {
		if (!r) r = {
			mode: 511,
			fs: e
		};
		else if (typeof r == "object") r = {
			mode: 511,
			fs: e,
			...r
		};
		else if (typeof r == "number") r = {
			mode: r,
			fs: e
		};
		else if (typeof r == "string") r = {
			mode: parseInt(r, 8),
			fs: e
		};
		else throw new TypeError("invalid options argument");
		return r.mkdir = r.mkdir || r.fs.mkdir || e.mkdir, r.mkdirAsync = n(r.mkdir), r.stat = r.stat || r.fs.stat || e.stat, r.statAsync = n(r.stat), r.statSync = r.statSync || r.fs.statSync || e.statSync, r.mkdirSync = r.mkdirSync || r.fs.mkdirSync || e.mkdirSync, r;
	}, i$2;
}
var e$1, t$1;
function u$2() {
	if (t$1) return e$1;
	t$1 = 1;
	const s = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform, { resolve: o, parse: n } = path;
	return e$1 = (r) => {
		if (/\0/.test(r)) throw Object.assign(/* @__PURE__ */ new TypeError("path must be a string without null bytes"), {
			path: r,
			code: "ERR_INVALID_ARG_VALUE"
		});
		if (r = o(r), s === "win32") {
			const i = /[*|"<>?:]/, { root: a } = n(r);
			if (i.test(r.substr(a.length))) throw Object.assign(/* @__PURE__ */ new Error("Illegal characters in path."), {
				path: r,
				code: "EINVAL"
			});
		}
		return r;
	}, e$1;
}
var i$1, c$2;
function t() {
	if (c$2) return i$1;
	c$2 = 1;
	const { dirname: u } = path, f = (r, e, n = void 0) => n === e ? Promise.resolve() : r.statAsync(e).then((d$1) => d$1.isDirectory() ? n : void 0, (d$1) => d$1.code === "ENOENT" ? f(r, u(e), e) : void 0), o = (r, e, n = void 0) => {
		if (n !== e) try {
			return r.statSync(e).isDirectory() ? n : void 0;
		} catch (d$1) {
			return d$1.code === "ENOENT" ? o(r, u(e), e) : void 0;
		}
	};
	return i$1 = {
		findMade: f,
		findMadeSync: o
	}, i$1;
}
var o$3, a$4;
function y$2() {
	if (a$4) return o$3;
	a$4 = 1;
	const { dirname: f } = path, t = (n, e, c$1) => {
		e.recursive = false;
		const i = f(n);
		return i === n ? e.mkdirAsync(n, e).catch((r) => {
			if (r.code !== "EISDIR") throw r;
		}) : e.mkdirAsync(n, e).then(() => c$1 || n, (r) => {
			if (r.code === "ENOENT") return t(i, e).then((u) => t(n, e, u));
			if (r.code !== "EEXIST" && r.code !== "EROFS") throw r;
			return e.statAsync(n).then((u) => {
				if (u.isDirectory()) return c$1;
				throw r;
			}, () => {
				throw r;
			});
		});
	}, d$1 = (n, e, c$1) => {
		const i = f(n);
		if (e.recursive = false, i === n) try {
			return e.mkdirSync(n, e);
		} catch (r) {
			if (r.code !== "EISDIR") throw r;
			return;
		}
		try {
			return e.mkdirSync(n, e), c$1 || n;
		} catch (r) {
			if (r.code === "ENOENT") return d$1(n, e, d$1(i, e, c$1));
			if (r.code !== "EEXIST" && r.code !== "EROFS") throw r;
			try {
				if (!e.statSync(n).isDirectory()) throw r;
			} catch {
				throw r;
			}
		}
	};
	return o$3 = {
		mkdirpManual: t,
		mkdirpManualSync: d$1
	}, o$3;
}
var c$1, m$1;
function s$3() {
	if (m$1) return c$1;
	m$1 = 1;
	const { dirname: u } = path, { findMade: d$1, findMadeSync: t$1 } = t(), { mkdirpManual: a, mkdirpManualSync: k } = y$2();
	return c$1 = {
		mkdirpNative: (e, r) => (r.recursive = true, u(e) === e ? r.mkdirAsync(e, r) : d$1(r, e).then((n) => r.mkdirAsync(e, r).then(() => n).catch((i) => {
			if (i.code === "ENOENT") return a(e, r);
			throw i;
		}))),
		mkdirpNativeSync: (e, r) => {
			if (r.recursive = true, u(e) === e) return r.mkdirSync(e, r);
			const n = t$1(r, e);
			try {
				return r.mkdirSync(e, r), n;
			} catch (i) {
				if (i.code === "ENOENT") return k(e, r);
				throw i;
			}
		}
	}, c$1;
}
var s$2, n$1;
function a$3() {
	if (n$1) return s$2;
	n$1 = 1;
	const i = nativeFs, e = (process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version).replace(/^v/, "").split("."), t = +e[0] > 10 || +e[0] == 10 && +e[1] >= 12;
	return s$2 = {
		useNative: t ? (r) => r.mkdir === i.mkdir : () => false,
		useNativeSync: t ? (r) => r.mkdirSync === i.mkdirSync : () => false
	}, s$2;
}
var m, s$1;
function S() {
	if (s$1) return m;
	s$1 = 1;
	const i = t$2(), u = u$2(), { mkdirpNative: a, mkdirpNativeSync: c$1 } = s$3(), { mkdirpManual: o, mkdirpManualSync: q } = y$2(), { useNative: t, useNativeSync: _ } = a$3(), n = (e, r) => (e = u(e), r = i(r), t(r) ? a(e, r) : o(e, r)), d$1 = (e, r) => (e = u(e), r = i(r), _(r) ? c$1(e, r) : q(e, r));
	return n.sync = d$1, n.native = (e, r) => a(u(e), i(r)), n.manual = (e, r) => o(u(e), i(r)), n.nativeSync = (e, r) => c$1(u(e), i(r)), n.manualSync = (e, r) => q(u(e), i(r)), m = n, m;
}
var y$1, O;
function F$1() {
	if (O) return y$1;
	O = 1;
	const c$1 = nativeFs, a = path, T = c$1.lchown ? "lchown" : "chown", I$1 = c$1.lchownSync ? "lchownSync" : "chownSync", i = c$1.lchown && !process.version.match(/v1[1-9]+\./) && !process.version.match(/v10\.[6-9]/), u = (r, e, n) => {
		try {
			return c$1[I$1](r, e, n);
		} catch (t) {
			if (t.code !== "ENOENT") throw t;
		}
	}, D$1 = (r, e, n) => {
		try {
			return c$1.chownSync(r, e, n);
		} catch (t) {
			if (t.code !== "ENOENT") throw t;
		}
	}, _ = i ? (r, e, n, t) => (o) => {
		!o || o.code !== "EISDIR" ? t(o) : c$1.chown(r, e, n, t);
	} : (r, e, n, t) => t, w = i ? (r, e, n) => {
		try {
			return u(r, e, n);
		} catch (t) {
			if (t.code !== "EISDIR") throw t;
			D$1(r, e, n);
		}
	} : (r, e, n) => u(r, e, n), R = process.version;
	let N$1 = (r, e, n) => c$1.readdir(r, e, n), q = (r, e) => c$1.readdirSync(r, e);
	/^v4\./.test(R) && (N$1 = (r, e, n) => c$1.readdir(r, n));
	const h$2 = (r, e, n, t) => {
		c$1[T](r, e, n, _(r, e, n, (o) => {
			t(o && o.code !== "ENOENT" ? o : null);
		}));
	}, S = (r, e, n, t, o) => {
		if (typeof e == "string") return c$1.lstat(a.resolve(r, e), (s, f) => {
			if (s) return o(s.code !== "ENOENT" ? s : null);
			f.name = e, S(r, f, n, t, o);
		});
		if (e.isDirectory()) E(a.resolve(r, e.name), n, t, (s) => {
			if (s) return o(s);
			h$2(a.resolve(r, e.name), n, t, o);
		});
		else h$2(a.resolve(r, e.name), n, t, o);
	}, E = (r, e, n, t) => {
		N$1(r, { withFileTypes: true }, (o, s) => {
			if (o) {
				if (o.code === "ENOENT") return t();
				if (o.code !== "ENOTDIR" && o.code !== "ENOTSUP") return t(o);
			}
			if (o || !s.length) return h$2(r, e, n, t);
			let f = s.length, v = null;
			const H = (l) => {
				if (!v) {
					if (l) return t(v = l);
					if (--f === 0) return h$2(r, e, n, t);
				}
			};
			s.forEach((l) => S(r, l, e, n, H));
		});
	}, C = (r, e, n, t) => {
		if (typeof e == "string") try {
			const o = c$1.lstatSync(a.resolve(r, e));
			o.name = e, e = o;
		} catch (o) {
			if (o.code === "ENOENT") return;
			throw o;
		}
		e.isDirectory() && m(a.resolve(r, e.name), n, t), w(a.resolve(r, e.name), n, t);
	}, m = (r, e, n) => {
		let t;
		try {
			t = q(r, { withFileTypes: !0 });
		} catch (o) {
			if (o.code === "ENOENT") return;
			if (o.code === "ENOTDIR" || o.code === "ENOTSUP") return w(r, e, n);
			throw o;
		}
		return t && t.length && t.forEach((o) => C(r, o, e, n)), w(r, e, n);
	};
	return y$1 = E, E.sync = m, y$1;
}
var R;
function H() {
	if (R) return r$1.exports;
	R = 1;
	const g$1 = S(), l = nativeFs, p = path, x$1 = F$1(), y = a$7();
	class D$1 extends Error {
		constructor(e, s) {
			super("Cannot extract through symbolic link"), this.path = s, this.symlink = e;
		}
		get name() {
			return "SylinkError";
		}
	}
	class E extends Error {
		constructor(e, s) {
			super(s + ": Cannot cd into '" + e + "'"), this.path = e, this.code = s;
		}
		get name() {
			return "CwdError";
		}
	}
	const v = (n, e) => n.get(y(e)), q = (n, e, s) => n.set(y(e), s), I$1 = (n, e) => {
		l.stat(n, (s, r) => {
			(s || !r.isDirectory()) && (s = new E(n, s && s.code || "ENOTDIR")), e(s);
		});
	};
	r$1.exports = (n, e, s) => {
		n = y(n);
		const r = e.umask, c$1 = e.mode | 448, f = (c$1 & r) !== 0, t = e.uid, i = e.gid, a = typeof t == "number" && typeof i == "number" && (t !== e.processUid || i !== e.processGid), u = e.preserve, m = e.unlink, h$2 = e.cache, d$1 = y(e.cwd), w = (k, o) => {
			k ? s(k) : (q(h$2, n, true), o && a ? x$1(o, t, i, (G) => w(G)) : f ? l.chmod(n, c$1, s) : s());
		};
		if (h$2 && v(h$2, n) === true) return w();
		if (n === d$1) return I$1(n, w);
		if (u) return g$1(n, { mode: c$1 }).then((k) => w(null, k), w);
		C(d$1, y(p.relative(d$1, n)).split("/"), c$1, h$2, m, d$1, null, w);
	};
	const C = (n, e, s, r, c$1, f, t, i) => {
		if (!e.length) return i(null, t);
		const a = e.shift(), u = y(p.resolve(n + "/" + a));
		if (v(r, u)) return C(u, e, s, r, c$1, f, t, i);
		l.mkdir(u, s, j(u, e, s, r, c$1, f, t, i));
	}, j = (n, e, s, r, c$1, f, t, i) => (a) => {
		a ? l.lstat(n, (u, m) => {
			if (u) u.path = u.path && y(u.path), i(u);
			else if (m.isDirectory()) C(n, e, s, r, c$1, f, t, i);
			else if (c$1) l.unlink(n, (h$2) => {
				if (h$2) return i(h$2);
				l.mkdir(n, s, j(n, e, s, r, c$1, f, t, i));
			});
			else {
				if (m.isSymbolicLink()) return i(new D$1(n, n + "/" + e.join("/")));
				i(a);
			}
		}) : (t = t || n, C(n, e, s, r, c$1, f, t, i));
	}, L = (n) => {
		let e = false, s = "ENOTDIR";
		try {
			e = l.statSync(n).isDirectory();
		} catch (r) {
			s = r.code;
		} finally {
			if (!e) throw new E(n, s);
		}
	};
	return r$1.exports.sync = (n, e) => {
		n = y(n);
		const s = e.umask, r = e.mode | 448, c$1 = (r & s) !== 0, f = e.uid, t = e.gid, i = typeof f == "number" && typeof t == "number" && (f !== e.processUid || t !== e.processGid), a = e.preserve, u = e.unlink, m = e.cache, h$2 = y(e.cwd), d$1 = (k) => {
			q(m, n, true), k && i && x$1.sync(k, f, t), c$1 && l.chmodSync(n, r);
		};
		if (m && v(m, n) === true) return d$1();
		if (n === h$2) return L(h$2), d$1();
		if (a) return d$1(g$1.sync(n, r));
		const $ = y(p.relative(h$2, n)).split("/");
		let S = null;
		for (let k = $.shift(), o = h$2; k && (o += "/" + k); k = $.shift()) if (o = y(p.resolve(o)), !v(m, o)) try {
			l.mkdirSync(o, r), S = S || o, q(m, o, !0);
		} catch {
			const M$1 = l.lstatSync(o);
			if (M$1.isDirectory()) {
				q(m, o, true);
				continue;
			} else if (u) {
				l.unlinkSync(o), l.mkdirSync(o, r), S = S || o, q(m, o, true);
				continue;
			} else if (M$1.isSymbolicLink()) return new D$1(o, o + "/" + $.join("/"));
		}
		return d$1(S);
	}, r$1.exports;
}
var a$2, i;
function p() {
	if (i) return a$2;
	i = 1;
	const o = [
		"|",
		"<",
		">",
		"?",
		":"
	], t = o.map((e) => String.fromCharCode(61440 + e.charCodeAt(0))), s = new Map(o.map((e, r) => [e, t[r]])), c$1 = new Map(t.map((e, r) => [e, o[r]]));
	return a$2 = {
		encode: (e) => o.reduce((r, n) => r.split(n).join(s.get(n)), e),
		decode: (e) => t.reduce((r, n) => r.split(n).join(c$1.get(n)), e)
	}, a$2;
}
var o$2, n;
function a$1() {
	if (n) return o$2;
	n = 1;
	const r = Object.create(null), { hasOwnProperty: i } = Object.prototype;
	return o$2 = (e) => (i.call(r, e) || (r[e] = e.normalize("NFD")), r[e]), o$2;
}
var a, l;
function s() {
	return l || (l = 1, a = (r) => {
		let e = r.length - 1, i = -1;
		for (; e > -1 && r.charAt(e) === "/";) i = e, e--;
		return i === -1 ? r : r.slice(0, i);
	}), a;
}
var u$1, f$1;
function z() {
	if (f$1) return u$1;
	f$1 = 1;
	const l = j$1, m = a$1(), g$1 = s(), { join: d$1 } = path, q = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32";
	return u$1 = () => {
		const i = /* @__PURE__ */ new Map(), c$1 = /* @__PURE__ */ new Map(), v = (e) => e.split("/").slice(0, -1).reduce((o, r) => (o.length && (r = d$1(o[o.length - 1], r)), o.push(r || "/"), o), []), a = /* @__PURE__ */ new Set(), w = (e) => {
			const s = c$1.get(e);
			if (!s) throw new Error("function does not have any path reservations");
			return {
				paths: s.paths.map((o) => i.get(o)),
				dirs: [...s.dirs].map((o) => i.get(o))
			};
		}, h$2 = (e) => {
			const { paths: s, dirs: o } = w(e);
			return s.every((r) => r[0] === e) && o.every((r) => r[0] instanceof Set && r[0].has(e));
		}, p = (e) => a.has(e) || !h$2(e) ? false : (a.add(e), e(() => S(e)), true), S = (e) => {
			if (!a.has(e)) return false;
			const { paths: s, dirs: o } = c$1.get(e), r = /* @__PURE__ */ new Set();
			return s.forEach((t) => {
				const n = i.get(t);
				l.equal(n[0], e), n.length === 1 ? i.delete(t) : (n.shift(), typeof n[0] == "function" ? r.add(n[0]) : n[0].forEach((E) => r.add(E)));
			}), o.forEach((t) => {
				const n = i.get(t);
				l(n[0] instanceof Set), n[0].size === 1 && n.length === 1 ? i.delete(t) : n[0].size === 1 ? (n.shift(), r.add(n[0])) : n[0].delete(e);
			}), a.delete(e), r.forEach((t) => p(t)), true;
		};
		return {
			check: h$2,
			reserve: (e, s) => {
				e = q ? ["win32 parallelization disabled"] : e.map((r) => g$1(d$1(m(r))).toLowerCase());
				const o = new Set(e.map((r) => v(r)).reduce((r, t) => r.concat(t)));
				return c$1.set(s, {
					dirs: o,
					paths: e
				}), e.forEach((r) => {
					const t = i.get(r);
					t ? t.push(s) : i.set(r, [s]);
				}), o.forEach((r) => {
					const t = i.get(r);
					t ? t[t.length - 1] instanceof Set ? t[t.length - 1].add(s) : t.push(new Set([s])) : i.set(r, [new Set([s])]);
				}), p(s);
			}
		};
	}, u$1;
}
var o$1, u;
function c$5() {
	if (u) return o$1;
	u = 1;
	const { isAbsolute: l, parse: t } = path.win32;
	return o$1 = (r) => {
		let s = "", e = t(r);
		for (; l(r) || e.root;) {
			const i = r.charAt(0) === "/" && r.slice(0, 4) !== "//?/" ? "/" : e.root;
			r = r.slice(i.length), s += i, e = t(r);
		}
		return [s, r];
	}, o$1;
}
var e, o;
function F() {
	if (o) return e;
	o = 1;
	const t = process.env.__FAKE_PLATFORM__ || process.platform, s = typeof Bun < "u" ? false : t === "win32", { O_CREAT: _, O_TRUNC: a, O_WRONLY: i, UV_FS_O_FILEMAP: r = 0 } = (commonjsGlobal.__FAKE_TESTING_FS__ || nativeFs).constants, c$1 = s && !!r, f = 512 * 1024, p = r | a | _ | i;
	return e = c$1 ? (l) => l < f ? p : "w" : () => "w", e;
}
var G, y;
function Os() {
	if (y) return G;
	y = 1;
	const ss = j$1, is = rt(), r = nativeFs, es = X(), w = path, M$1 = H(), K$1 = p(), ts = z(), os$1 = c$5(), l = a$7(), rs = s(), hs = a$1(), H$1 = Symbol("onEntry"), q = Symbol("checkFs"), Y = Symbol("checkFs2"), v = Symbol("pruneCache"), N$1 = Symbol("isReusable"), d$1 = Symbol("makeFs"), U$1 = Symbol("file"), F$1 = Symbol("directory"), O = Symbol("link"), B$1 = Symbol("symlink"), z$1$1 = Symbol("hardlink"), W$1 = Symbol("unsupported"), j = Symbol("checkPath"), b$1 = Symbol("mkdir"), m = Symbol("onError"), $ = Symbol("pending"), V$1 = Symbol("pend"), S = Symbol("unpend"), P$2 = Symbol("ended"), A$1 = Symbol("maybeClose"), x$1 = Symbol("skip"), E = Symbol("doChown"), R = Symbol("uid"), _ = Symbol("gid"), g$1 = Symbol("checkedCwd"), X$1 = Ds, J = F(), C = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32", cs = 1024, as = (a, s) => {
		if (!C) return r.unlink(a, s);
		const i = a + ".DELETE." + X$1.randomBytes(16).toString("hex");
		r.rename(a, i, (e) => {
			if (e) return s(e);
			r.unlink(i, s);
		});
	}, us = (a) => {
		if (!C) return r.unlinkSync(a);
		const s = a + ".DELETE." + X$1.randomBytes(16).toString("hex");
		r.renameSync(a, s), r.unlinkSync(s);
	}, Q = (a, s, i) => a === a >>> 0 ? a : s === s >>> 0 ? s : i, Z = (a) => rs(l(hs(a))).toLowerCase(), ns = (a, s) => {
		s = Z(s);
		for (const i of a.keys()) {
			const e = Z(i);
			(e === s || e.indexOf(s + "/") === 0) && a.delete(i);
		}
	}, ms = (a) => {
		for (const s of a.keys()) a.delete(s);
	};
	class L extends is {
		constructor(s) {
			if (s || (s = {}), s.ondone = (i) => {
				this[P$2] = true, this[A$1]();
			}, super(s), this[g$1] = false, this.reservations = ts(), this.transform = typeof s.transform == "function" ? s.transform : null, this.writable = true, this.readable = false, this[$] = 0, this[P$2] = false, this.dirCache = s.dirCache || /* @__PURE__ */ new Map(), typeof s.uid == "number" || typeof s.gid == "number") {
				if (typeof s.uid != "number" || typeof s.gid != "number") throw new TypeError("cannot set owner without number uid and gid");
				if (s.preserveOwner) throw new TypeError("cannot preserve owner in archive and also set owner explicitly");
				this.uid = s.uid, this.gid = s.gid, this.setOwner = true;
			} else this.uid = null, this.gid = null, this.setOwner = false;
			s.preserveOwner === void 0 && typeof s.uid != "number" ? this.preserveOwner = process.getuid && process.getuid() === 0 : this.preserveOwner = !!s.preserveOwner, this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : null, this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : null, this.maxDepth = typeof s.maxDepth == "number" ? s.maxDepth : cs, this.forceChown = s.forceChown === true, this.win32 = !!s.win32 || C, this.newer = !!s.newer, this.keep = !!s.keep, this.noMtime = !!s.noMtime, this.preservePaths = !!s.preservePaths, this.unlink = !!s.unlink, this.cwd = l(w.resolve(s.cwd || process.cwd())), this.strip = +s.strip || 0, this.processUmask = s.noChmod ? 0 : process.umask(), this.umask = typeof s.umask == "number" ? s.umask : this.processUmask, this.dmode = s.dmode || 511 & ~this.umask, this.fmode = s.fmode || 438 & ~this.umask, this.on("entry", (i) => this[H$1](i));
		}
		warn(s, i, e = {}) {
			return (s === "TAR_BAD_ARCHIVE" || s === "TAR_ABORT") && (e.recoverable = false), super.warn(s, i, e);
		}
		[A$1]() {
			this[P$2] && this[$] === 0 && (this.emit("prefinish"), this.emit("finish"), this.emit("end"));
		}
		[j](s) {
			const i = l(s.path), e = i.split("/");
			if (this.strip) {
				if (e.length < this.strip) return false;
				if (s.type === "Link") {
					const t = l(s.linkpath).split("/");
					if (t.length >= this.strip) s.linkpath = t.slice(this.strip).join("/");
					else return false;
				}
				e.splice(0, this.strip), s.path = e.join("/");
			}
			if (isFinite(this.maxDepth) && e.length > this.maxDepth) return this.warn("TAR_ENTRY_ERROR", "path excessively deep", {
				entry: s,
				path: i,
				depth: e.length,
				maxDepth: this.maxDepth
			}), false;
			if (!this.preservePaths) {
				if (e.includes("..") || C && /^[a-z]:\.\.$/i.test(e[0])) return this.warn("TAR_ENTRY_ERROR", "path contains '..'", {
					entry: s,
					path: i
				}), false;
				const [t, o] = os$1(i);
				t && (s.path = o, this.warn("TAR_ENTRY_INFO", `stripping ${t} from absolute path`, {
					entry: s,
					path: i
				}));
			}
			if (w.isAbsolute(s.path) ? s.absolute = l(w.resolve(s.path)) : s.absolute = l(w.resolve(this.cwd, s.path)), !this.preservePaths && s.absolute.indexOf(this.cwd + "/") !== 0 && s.absolute !== this.cwd) return this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
				entry: s,
				path: l(s.path),
				resolvedPath: s.absolute,
				cwd: this.cwd
			}), false;
			if (s.absolute === this.cwd && s.type !== "Directory" && s.type !== "GNUDumpDir") return false;
			if (this.win32) {
				const { root: t } = w.win32.parse(s.absolute);
				s.absolute = t + K$1.encode(s.absolute.slice(t.length));
				const { root: o } = w.win32.parse(s.path);
				s.path = o + K$1.encode(s.path.slice(o.length));
			}
			return true;
		}
		[H$1](s) {
			if (!this[j](s)) return s.resume();
			switch (ss.equal(typeof s.absolute, "string"), s.type) {
				case "Directory":
				case "GNUDumpDir": s.mode && (s.mode = s.mode | 448);
				case "File":
				case "OldFile":
				case "ContiguousFile":
				case "Link":
				case "SymbolicLink": return this[q](s);
				case "CharacterDevice":
				case "BlockDevice":
				case "FIFO":
				default: return this[W$1](s);
			}
		}
		[m](s, i) {
			s.name === "CwdError" ? this.emit("error", s) : (this.warn("TAR_ENTRY_ERROR", s, { entry: i }), this[S](), i.resume());
		}
		[b$1](s, i, e) {
			M$1(l(s), {
				uid: this.uid,
				gid: this.gid,
				processUid: this.processUid,
				processGid: this.processGid,
				umask: this.processUmask,
				preserve: this.preservePaths,
				unlink: this.unlink,
				cache: this.dirCache,
				cwd: this.cwd,
				mode: i,
				noChmod: this.noChmod
			}, e);
		}
		[E](s) {
			return this.forceChown || this.preserveOwner && (typeof s.uid == "number" && s.uid !== this.processUid || typeof s.gid == "number" && s.gid !== this.processGid) || typeof this.uid == "number" && this.uid !== this.processUid || typeof this.gid == "number" && this.gid !== this.processGid;
		}
		[R](s) {
			return Q(this.uid, s.uid, this.processUid);
		}
		[_](s) {
			return Q(this.gid, s.gid, this.processGid);
		}
		[U$1](s, i) {
			const e = s.mode & 4095 || this.fmode, t = new es.WriteStream(s.absolute, {
				flags: J(s.size),
				mode: e,
				autoClose: false
			});
			t.on("error", (c$1) => {
				t.fd && r.close(t.fd, () => {}), t.write = () => true, this[m](c$1, s), i();
			});
			let o = 1;
			const u = (c$1) => {
				if (c$1) {
					t.fd && r.close(t.fd, () => {}), this[m](c$1, s), i();
					return;
				}
				--o === 0 && r.close(t.fd, (n) => {
					n ? this[m](n, s) : this[S](), i();
				});
			};
			t.on("finish", (c$1) => {
				const n = s.absolute, p = t.fd;
				if (s.mtime && !this.noMtime) {
					o++;
					const f = s.atime || /* @__PURE__ */ new Date(), k = s.mtime;
					r.futimes(p, f, k, (D$1) => D$1 ? r.utimes(n, f, k, (I$1) => u(I$1 && D$1)) : u());
				}
				if (this[E](s)) {
					o++;
					const f = this[R](s), k = this[_](s);
					r.fchown(p, f, k, (D$1) => D$1 ? r.chown(n, f, k, (I$1) => u(I$1 && D$1)) : u());
				}
				u();
			});
			const h$2 = this.transform && this.transform(s) || s;
			h$2 !== s && (h$2.on("error", (c$1) => {
				this[m](c$1, s), i();
			}), s.pipe(h$2)), h$2.pipe(t);
		}
		[F$1](s, i) {
			const e = s.mode & 4095 || this.dmode;
			this[b$1](s.absolute, e, (t) => {
				if (t) {
					this[m](t, s), i();
					return;
				}
				let o = 1;
				const u = (h$2) => {
					--o === 0 && (i(), this[S](), s.resume());
				};
				s.mtime && !this.noMtime && (o++, r.utimes(s.absolute, s.atime || /* @__PURE__ */ new Date(), s.mtime, u)), this[E](s) && (o++, r.chown(s.absolute, this[R](s), this[_](s), u)), u();
			});
		}
		[W$1](s) {
			s.unsupported = true, this.warn("TAR_ENTRY_UNSUPPORTED", `unsupported entry type: ${s.type}`, { entry: s }), s.resume();
		}
		[B$1](s, i) {
			this[O](s, s.linkpath, "symlink", i);
		}
		[z$1$1](s, i) {
			const e = l(w.resolve(this.cwd, s.linkpath));
			this[O](s, e, "link", i);
		}
		[V$1]() {
			this[$]++;
		}
		[S]() {
			this[$]--, this[A$1]();
		}
		[x$1](s) {
			this[S](), s.resume();
		}
		[N$1](s, i) {
			return s.type === "File" && !this.unlink && i.isFile() && i.nlink <= 1 && !C;
		}
		[q](s) {
			this[V$1]();
			const i = [s.path];
			s.linkpath && i.push(s.linkpath), this.reservations.reserve(i, (e) => this[Y](s, e));
		}
		[v](s) {
			s.type === "SymbolicLink" ? ms(this.dirCache) : s.type !== "Directory" && ns(this.dirCache, s.absolute);
		}
		[Y](s, i) {
			this[v](s);
			const e = (h$2) => {
				this[v](s), i(h$2);
			}, t = () => {
				this[b$1](this.cwd, this.dmode, (h$2) => {
					if (h$2) {
						this[m](h$2, s), e();
						return;
					}
					this[g$1] = true, o();
				});
			}, o = () => {
				if (s.absolute !== this.cwd) {
					const h$2 = l(w.dirname(s.absolute));
					if (h$2 !== this.cwd) return this[b$1](h$2, this.dmode, (c$1) => {
						if (c$1) {
							this[m](c$1, s), e();
							return;
						}
						u();
					});
				}
				u();
			}, u = () => {
				r.lstat(s.absolute, (h$2, c$1) => {
					if (c$1 && (this.keep || this.newer && c$1.mtime > s.mtime)) {
						this[x$1](s), e();
						return;
					}
					if (h$2 || this[N$1](s, c$1)) return this[d$1](null, s, e);
					if (c$1.isDirectory()) {
						if (s.type === "Directory") {
							const n = !this.noChmod && s.mode && (c$1.mode & 4095) !== s.mode, p = (f) => this[d$1](f, s, e);
							return n ? r.chmod(s.absolute, s.mode, p) : p();
						}
						if (s.absolute !== this.cwd) return r.rmdir(s.absolute, (n) => this[d$1](n, s, e));
					}
					if (s.absolute === this.cwd) return this[d$1](null, s, e);
					as(s.absolute, (n) => this[d$1](n, s, e));
				});
			};
			this[g$1] ? o() : t();
		}
		[d$1](s, i, e) {
			if (s) {
				this[m](s, i), e();
				return;
			}
			switch (i.type) {
				case "File":
				case "OldFile":
				case "ContiguousFile": return this[U$1](i, e);
				case "Link": return this[z$1$1](i, e);
				case "SymbolicLink": return this[B$1](i, e);
				case "Directory":
				case "GNUDumpDir": return this[F$1](i, e);
			}
		}
		[O](s, i, e, t) {
			r[e](i, s.absolute, (o) => {
				o ? this[m](o, s) : (this[S](), s.resume()), t();
			});
		}
	}
	const T = (a) => {
		try {
			return [null, a()];
		} catch (s) {
			return [s, null];
		}
	};
	class ls extends L {
		[d$1](s, i) {
			return super[d$1](s, i, () => {});
		}
		[q](s) {
			if (this[v](s), !this[g$1]) {
				const o = this[b$1](this.cwd, this.dmode);
				if (o) return this[m](o, s);
				this[g$1] = true;
			}
			if (s.absolute !== this.cwd) {
				const o = l(w.dirname(s.absolute));
				if (o !== this.cwd) {
					const u = this[b$1](o, this.dmode);
					if (u) return this[m](u, s);
				}
			}
			const [i, e] = T(() => r.lstatSync(s.absolute));
			if (e && (this.keep || this.newer && e.mtime > s.mtime)) return this[x$1](s);
			if (i || this[N$1](s, e)) return this[d$1](null, s);
			if (e.isDirectory()) {
				if (s.type === "Directory") {
					const [h$2] = !this.noChmod && s.mode && (e.mode & 4095) !== s.mode ? T(() => {
						r.chmodSync(s.absolute, s.mode);
					}) : [];
					return this[d$1](h$2, s);
				}
				const [o] = T(() => r.rmdirSync(s.absolute));
				this[d$1](o, s);
			}
			const [t] = s.absolute === this.cwd ? [] : T(() => us(s.absolute));
			this[d$1](t, s);
		}
		[U$1](s, i) {
			const e = s.mode & 4095 || this.fmode, t = (h$2) => {
				let c$1;
				try {
					r.closeSync(o);
				} catch (n) {
					c$1 = n;
				}
				(h$2 || c$1) && this[m](h$2 || c$1, s), i();
			};
			let o;
			try {
				o = r.openSync(s.absolute, J(s.size), e);
			} catch (h$2) {
				return t(h$2);
			}
			const u = this.transform && this.transform(s) || s;
			u !== s && (u.on("error", (h$2) => this[m](h$2, s)), s.pipe(u)), u.on("data", (h$2) => {
				try {
					r.writeSync(o, h$2, 0, h$2.length);
				} catch (c$1) {
					t(c$1);
				}
			}), u.on("end", (h$2) => {
				let c$1 = null;
				if (s.mtime && !this.noMtime) {
					const n = s.atime || /* @__PURE__ */ new Date(), p = s.mtime;
					try {
						r.futimesSync(o, n, p);
					} catch (f) {
						try {
							r.utimesSync(s.absolute, n, p);
						} catch {
							c$1 = f;
						}
					}
				}
				if (this[E](s)) {
					const n = this[R](s), p = this[_](s);
					try {
						r.fchownSync(o, n, p);
					} catch (f) {
						try {
							r.chownSync(s.absolute, n, p);
						} catch {
							c$1 = c$1 || f;
						}
					}
				}
				t(c$1);
			});
		}
		[F$1](s, i) {
			const e = s.mode & 4095 || this.dmode, t = this[b$1](s.absolute, e);
			if (t) {
				this[m](t, s), i();
				return;
			}
			if (s.mtime && !this.noMtime) try {
				r.utimesSync(s.absolute, s.atime || /* @__PURE__ */ new Date(), s.mtime);
			} catch {}
			if (this[E](s)) try {
				r.chownSync(s.absolute, this[R](s), this[_](s));
			} catch {}
			i(), s.resume();
		}
		[b$1](s, i) {
			try {
				return M$1.sync(l(s), {
					uid: this.uid,
					gid: this.gid,
					processUid: this.processUid,
					processGid: this.processGid,
					umask: this.processUmask,
					preserve: this.preservePaths,
					unlink: this.unlink,
					cache: this.dirCache,
					cwd: this.cwd,
					mode: i
				});
			} catch (e) {
				return e;
			}
		}
		[O](s, i, e, t) {
			try {
				r[e + "Sync"](i, s.absolute), t(), s.resume();
			} catch (o) {
				return this[m](o, s);
			}
		}
	}
	return L.Sync = ls, G = L, G;
}
var f, q;
function v() {
	if (q) return f;
	q = 1;
	const w = s$6(), u = Os(), p = nativeFs, y = X(), l = path, m = s();
	f = (r, e, o) => {
		typeof r == "function" ? (o = r, e = null, r = {}) : Array.isArray(r) && (e = r, r = {}), typeof e == "function" && (o = e, e = null), e ? e = Array.from(e) : e = [];
		const t = w(r);
		if (t.sync && typeof o == "function") throw new TypeError("callback not supported for sync tar functions");
		if (!t.file && typeof o == "function") throw new TypeError("callback only supported with file option");
		return e.length && d$1(t, e), t.file && t.sync ? $(t) : t.file ? h$2(t, o) : t.sync ? x$1(t) : z(t);
	};
	const d$1 = (r, e) => {
		const o = new Map(e.map((n) => [m(n), true])), t = r.filter, s = (n, i) => {
			const a = i || l.parse(n).root || ".", c$1 = n === a ? false : o.has(n) ? o.get(n) : s(l.dirname(n), a);
			return o.set(n, c$1), c$1;
		};
		r.filter = t ? (n, i) => t(n, i) && s(m(n)) : (n) => s(m(n));
	}, $ = (r) => {
		const e = new u.Sync(r), o = r.file, t = p.statSync(o), s = r.maxReadSize || 16 * 1024 * 1024;
		new y.ReadStreamSync(o, {
			readSize: s,
			size: t.size
		}).pipe(e);
	}, h$2 = (r, e) => {
		const o = new u(r), t = r.maxReadSize || 16 * 1024 * 1024, s = r.file, n = new Promise((i, a) => {
			o.on("error", a), o.on("close", i), p.stat(s, (c$1, R) => {
				if (c$1) a(c$1);
				else {
					const S = new y.ReadStream(s, {
						readSize: t,
						size: R.size
					});
					S.on("error", a), S.pipe(o);
				}
			});
		});
		return e ? n.then(e, e) : n;
	}, x$1 = (r) => new u.Sync(r), z = (r) => new u(r);
	return f;
}
const tarExtract = getDefaultExportFromCjs(v());
async function download(url, filePath, options = {}) {
	const infoPath = filePath + ".json";
	const info = JSON.parse(await readFile(infoPath, "utf8").catch(() => "{}"));
	const etag = (await sendFetch(url, {
		method: "HEAD",
		headers: options.headers
	}).catch(() => void 0))?.headers.get("etag");
	if (info.etag === etag && existsSync(filePath)) return;
	if (typeof etag === "string") info.etag = etag;
	const response = await sendFetch(url, { headers: options.headers });
	if (response.status >= 400) throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
	const stream = createWriteStream(filePath);
	await promisify(pipeline)(response.body, stream);
	await writeFile(infoPath, JSON.stringify(info), "utf8");
}
const inputRegex = /^(?<repo>[\w.-]+\/[\w.-]+)(?<subdir>[^#]+)?(?<ref>#[\w./@-]+)?/;
function parseGitURI(input) {
	const m = input.match(inputRegex)?.groups || {};
	return {
		repo: m.repo,
		subdir: m.subdir || "/",
		ref: m.ref ? m.ref.slice(1) : "main"
	};
}
function debug(...args) {
	if (process.env.DEBUG) console.debug("[giget]", ...args);
}
async function sendFetch(url, options = {}) {
	if (options.headers?.["sec-fetch-mode"]) options.mode = options.headers["sec-fetch-mode"];
	const res = await l$1(url, {
		...options,
		headers: normalizeHeaders(options.headers)
	}).catch((error) => {
		throw new Error(`Failed to download ${url}: ${error}`, { cause: error });
	});
	if (options.validateStatus && res.status >= 400) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	return res;
}
function cacheDirectory() {
	const cacheDir = process.env.XDG_CACHE_HOME ? resolve$2(process.env.XDG_CACHE_HOME, "giget") : resolve$2(homedir(), ".cache/giget");
	if (process.platform === "win32") {
		const windowsCacheDir = resolve$2(tmpdir(), "giget");
		if (!existsSync(windowsCacheDir) && existsSync(cacheDir)) try {
			renameSync(cacheDir, windowsCacheDir);
		} catch {}
		return windowsCacheDir;
	}
	return cacheDir;
}
function normalizeHeaders(headers = {}) {
	const normalized = {};
	for (const [key, value] of Object.entries(headers)) {
		if (!value) continue;
		normalized[key.toLowerCase()] = value;
	}
	return normalized;
}
const http = async (input, options) => {
	if (input.endsWith(".json")) return await _httpJSON(input, options);
	const url = new URL(input);
	let name = basename$2(url.pathname);
	try {
		const head = await sendFetch(url.href, {
			method: "HEAD",
			validateStatus: true,
			headers: { authorization: options.auth ? `Bearer ${options.auth}` : void 0 }
		});
		if ((head.headers.get("content-type") || "").includes("application/json")) return await _httpJSON(input, options);
		const filename = head.headers.get("content-disposition")?.match(/filename="?(.+)"?/)?.[1];
		if (filename) name = filename.split(".")[0];
	} catch (error) {
		debug(`Failed to fetch HEAD for ${url.href}:`, error);
	}
	return {
		name: `${name}-${url.href.slice(0, 8)}`,
		version: "",
		subdir: "",
		tar: url.href,
		defaultDir: name,
		headers: { Authorization: options.auth ? `Bearer ${options.auth}` : void 0 }
	};
};
const _httpJSON = async (input, options) => {
	const info = await (await sendFetch(input, {
		validateStatus: true,
		headers: { authorization: options.auth ? `Bearer ${options.auth}` : void 0 }
	})).json();
	if (!info.tar || !info.name) throw new Error(`Invalid template info from ${input}. name or tar fields are missing!`);
	return info;
};
const github = (input, options) => {
	const parsed = parseGitURI(input);
	const githubAPIURL = process.env.GIGET_GITHUB_URL || "https://api.github.com";
	return {
		name: parsed.repo.replace("/", "-"),
		version: parsed.ref,
		subdir: parsed.subdir,
		headers: {
			Authorization: options.auth ? `Bearer ${options.auth}` : void 0,
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28"
		},
		url: `${githubAPIURL.replace("api.github.com", "github.com")}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
		tar: `${githubAPIURL}/repos/${parsed.repo}/tarball/${parsed.ref}`
	};
};
const gitlab = (input, options) => {
	const parsed = parseGitURI(input);
	const gitlab2 = process.env.GIGET_GITLAB_URL || "https://gitlab.com";
	return {
		name: parsed.repo.replace("/", "-"),
		version: parsed.ref,
		subdir: parsed.subdir,
		headers: {
			authorization: options.auth ? `Bearer ${options.auth}` : void 0,
			"sec-fetch-mode": "same-origin"
		},
		url: `${gitlab2}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
		tar: `${gitlab2}/${parsed.repo}/-/archive/${parsed.ref}.tar.gz`
	};
};
const bitbucket = (input, options) => {
	const parsed = parseGitURI(input);
	return {
		name: parsed.repo.replace("/", "-"),
		version: parsed.ref,
		subdir: parsed.subdir,
		headers: { authorization: options.auth ? `Bearer ${options.auth}` : void 0 },
		url: `https://bitbucket.com/${parsed.repo}/src/${parsed.ref}${parsed.subdir}`,
		tar: `https://bitbucket.org/${parsed.repo}/get/${parsed.ref}.tar.gz`
	};
};
const sourcehut = (input, options) => {
	const parsed = parseGitURI(input);
	return {
		name: parsed.repo.replace("/", "-"),
		version: parsed.ref,
		subdir: parsed.subdir,
		headers: { authorization: options.auth ? `Bearer ${options.auth}` : void 0 },
		url: `https://git.sr.ht/~${parsed.repo}/tree/${parsed.ref}/item${parsed.subdir}`,
		tar: `https://git.sr.ht/~${parsed.repo}/archive/${parsed.ref}.tar.gz`
	};
};
const providers = {
	http,
	https: http,
	github,
	gh: github,
	gitlab,
	bitbucket,
	sourcehut
};
const DEFAULT_REGISTRY = "https://raw.githubusercontent.com/unjs/giget/main/templates";
const registryProvider = (registryEndpoint = DEFAULT_REGISTRY, options = {}) => {
	return async (input) => {
		const start = Date.now();
		const registryURL = `${registryEndpoint}/${input}.json`;
		const result = await sendFetch(registryURL, { headers: { authorization: options.auth ? `Bearer ${options.auth}` : void 0 } });
		if (result.status >= 400) throw new Error(`Failed to download ${input} template info from ${registryURL}: ${result.status} ${result.statusText}`);
		const info = await result.json();
		if (!info.tar || !info.name) throw new Error(`Invalid template info from ${registryURL}. name or tar fields are missing!`);
		debug(`Fetched ${input} template info from ${registryURL} in ${Date.now() - start}ms`);
		return info;
	};
};
const sourceProtoRe = /^([\w-.]+):/;
async function downloadTemplate(input, options = {}) {
	options = defu({
		registry: process.env.GIGET_REGISTRY,
		auth: process.env.GIGET_AUTH
	}, options);
	const registry = options.registry === false ? void 0 : registryProvider(options.registry, { auth: options.auth });
	let providerName = options.provider || (registry ? "registry" : "github");
	let source = input;
	const sourceProviderMatch = input.match(sourceProtoRe);
	if (sourceProviderMatch) {
		providerName = sourceProviderMatch[1];
		source = input.slice(sourceProviderMatch[0].length);
		if (providerName === "http" || providerName === "https") source = input;
	}
	const provider = options.providers?.[providerName] || providers[providerName] || registry;
	if (!provider) throw new Error(`Unsupported provider: ${providerName}`);
	const template = await Promise.resolve().then(() => provider(source, { auth: options.auth })).catch((error) => {
		throw new Error(`Failed to download template from ${providerName}: ${error.message}`);
	});
	if (!template) throw new Error(`Failed to resolve template from ${providerName}`);
	template.name = (template.name || "template").replace(/[^\da-z-]/gi, "-");
	template.defaultDir = (template.defaultDir || template.name).replace(/[^\da-z-]/gi, "-");
	const tarPath = resolve$2(resolve$2(cacheDirectory(), providerName, template.name), (template.version || template.name) + ".tar.gz");
	if (options.preferOffline && existsSync(tarPath)) options.offline = true;
	if (!options.offline) {
		await mkdir(dirname$2(tarPath), { recursive: true });
		const s2 = Date.now();
		await download(template.tar, tarPath, { headers: {
			Authorization: options.auth ? `Bearer ${options.auth}` : void 0,
			...normalizeHeaders(template.headers)
		} }).catch((error) => {
			if (!existsSync(tarPath)) throw error;
			debug("Download error. Using cached version:", error);
			options.offline = true;
		});
		debug(`Downloaded ${template.tar} to ${tarPath} in ${Date.now() - s2}ms`);
	}
	if (!existsSync(tarPath)) throw new Error(`Tarball not found: ${tarPath} (offline: ${options.offline})`);
	const extractPath = resolve$2(resolve$2(options.cwd || "."), options.dir || template.defaultDir);
	if (options.forceClean) await rm(extractPath, {
		recursive: true,
		force: true
	});
	if (!options.force && existsSync(extractPath) && readdirSync(extractPath).length > 0) throw new Error(`Destination ${extractPath} already exists.`);
	await mkdir(extractPath, { recursive: true });
	const s = Date.now();
	const subdir = template.subdir?.replace(/^\//, "") || "";
	await tarExtract({
		file: tarPath,
		cwd: extractPath,
		onentry(entry) {
			entry.path = entry.path.split("/").splice(1).join("/");
			if (subdir) if (entry.path.startsWith(subdir + "/")) entry.path = entry.path.slice(subdir.length);
			else entry.path = "";
		}
	});
	debug(`Extracted to ${extractPath} in ${Date.now() - s}ms`);
	if (options.install) {
		debug("Installing dependencies...");
		await installDependencies({
			cwd: extractPath,
			silent: options.silent
		});
	}
	return {
		...template,
		source,
		dir: extractPath
	};
}

//#endregion
//#region node_modules/.pnpm/giget@2.0.0/node_modules/giget/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({ downloadTemplate: () => downloadTemplate });

//#endregion
export { dist_exports$1 as n, dist_exports as t };