//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/index.mjs
const NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
/**
* Create a new router context.
*/
function createRouter() {
	return {
		root: { key: "" },
		static: new NullProtoObj()
	};
}
function splitPath(path) {
	const [_, ...s] = path.split("/");
	return s[s.length - 1] === "" ? s.slice(0, -1) : s;
}
function getMatchParams(segments, paramsMap) {
	const params = new NullProtoObj();
	for (const [index, name] of paramsMap) {
		const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
		if (typeof name === "string") params[name] = segment;
		else {
			const match = segment.match(name);
			if (match) for (const key in match.groups) params[key] = match.groups[key];
		}
	}
	return params;
}
/**
* Add a route to the router context.
*/
function addRoute(ctx, method = "", path, data) {
	method = method.toUpperCase();
	if (path.charCodeAt(0) !== 47) path = `/${path}`;
	path = path.replace(/\\:/g, "%3A");
	const segments = splitPath(path);
	let node = ctx.root;
	let _unnamedParamIndex = 0;
	const paramsMap = [];
	const paramsRegexp = [];
	for (let i = 0; i < segments.length; i++) {
		let segment = segments[i];
		if (segment.startsWith("**")) {
			if (!node.wildcard) node.wildcard = { key: "**" };
			node = node.wildcard;
			paramsMap.push([
				-(i + 1),
				segment.split(":")[1] || "_",
				segment.length === 2
			]);
			break;
		}
		if (segment === "*" || segment.includes(":")) {
			if (!node.param) node.param = { key: "*" };
			node = node.param;
			if (segment === "*") paramsMap.push([
				i,
				`_${_unnamedParamIndex++}`,
				true
			]);
			else if (segment.includes(":", 1)) {
				const regexp = getParamRegexp(segment);
				paramsRegexp[i] = regexp;
				node.hasRegexParam = true;
				paramsMap.push([
					i,
					regexp,
					false
				]);
			} else paramsMap.push([
				i,
				segment.slice(1),
				false
			]);
			continue;
		}
		if (segment === "\\*") segment = segments[i] = "*";
		else if (segment === "\\*\\*") segment = segments[i] = "**";
		const child = node.static?.[segment];
		if (child) node = child;
		else {
			const staticNode = { key: segment };
			if (!node.static) node.static = new NullProtoObj();
			node.static[segment] = staticNode;
			node = staticNode;
		}
	}
	const hasParams = paramsMap.length > 0;
	if (!node.methods) node.methods = new NullProtoObj();
	node.methods[method] ??= [];
	node.methods[method].push({
		data: data || null,
		paramsRegexp,
		paramsMap: hasParams ? paramsMap : void 0
	});
	if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment) {
	const regex = segment.replace(/:(\w+)/g, (_, id) => `(?<${id}>[^/]+)`).replace(/\./g, "\\.");
	return /* @__PURE__ */ new RegExp(`^${regex}$`);
}
/**
* Find a route by path.
*/
function findRoute(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const staticNode = ctx.static[path];
	if (staticNode && staticNode.methods) {
		const staticMatch = staticNode.methods[method] || staticNode.methods[""];
		if (staticMatch !== void 0) return staticMatch[0];
	}
	const segments = splitPath(path);
	const match = _lookupTree(ctx, ctx.root, method, segments, 0)?.[0];
	if (match === void 0) return;
	if (opts?.params === false) return match;
	return {
		data: match.data,
		params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
	};
}
function _lookupTree(ctx, node, method, segments, index) {
	if (index === segments.length) {
		if (node.methods) {
			const match = node.methods[method] || node.methods[""];
			if (match) return match;
		}
		if (node.param && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		if (node.wildcard && node.wildcard.methods) {
			const match = node.wildcard.methods[method] || node.wildcard.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		return;
	}
	const segment = segments[index];
	if (node.static) {
		const staticChild = node.static[segment];
		if (staticChild) {
			const match = _lookupTree(ctx, staticChild, method, segments, index + 1);
			if (match) return match;
		}
	}
	if (node.param) {
		const match = _lookupTree(ctx, node.param, method, segments, index + 1);
		if (match) {
			if (node.param.hasRegexParam) {
				const exactMatch = match.find((m) => m.paramsRegexp[index]?.test(segment)) || match.find((m) => !m.paramsRegexp[index]);
				return exactMatch ? [exactMatch] : void 0;
			}
			return match;
		}
	}
	if (node.wildcard && node.wildcard.methods) return node.wildcard.methods[method] || node.wildcard.methods[""];
}
/**
* Find all route patterns that match the given path.
*/
function findAllRoutes(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const segments = splitPath(path);
	const matches = _findAll(ctx, ctx.root, method, segments, 0);
	if (opts?.params === false) return matches;
	return matches.map((m) => {
		return {
			data: m.data,
			params: m.paramsMap ? getMatchParams(segments, m.paramsMap) : void 0
		};
	});
}
function _findAll(ctx, node, method, segments, index, matches = []) {
	const segment = segments[index];
	if (node.wildcard && node.wildcard.methods) {
		const match = node.wildcard.methods[method] || node.wildcard.methods[""];
		if (match) matches.push(...match);
	}
	if (node.param) {
		_findAll(ctx, node.param, method, segments, index + 1, matches);
		if (index === segments.length && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) matches.push(...match);
			}
		}
	}
	const staticChild = node.static?.[segment];
	if (staticChild) _findAll(ctx, staticChild, method, segments, index + 1, matches);
	if (index === segments.length && node.methods) {
		const match = node.methods[method] || node.methods[""];
		if (match) matches.push(...match);
	}
	return matches;
}

//#endregion
//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/compiler.mjs
/**
* Compile the router instance into a compact runnable code.
*
* **IMPORTANT:** Route data must be serializable to JSON (i.e., no functions or classes) or implement the `toJSON()` method to render custom code or you can pass custom `serialize` function in options.
*
* @example
* import { createRouter, addRoute } from "rou3";
* import { compileRouterToString } from "rou3/compiler";
* const router = createRouter();
* // [add some routes with serializable data]
* const compilerCode = compileRouterToString(router, "findRoute");
* // "const findRoute=(m, p) => {}"
*/
function compileRouterToString(router, functionName, opts) {
	const ctx = {
		opts: opts || {},
		router,
		data: [],
		compileToString: true
	};
	let compiled = `(m,p)=>{${compileRouteMatch(ctx)}}`;
	if (ctx.data.length > 0) compiled = `/* @__PURE__ */ (() => { ${`const ${ctx.data.map((v, i) => `$${i}=${v}`).join(",")};`}; return ${compiled}})()`;
	return functionName ? `const ${functionName}=${compiled};` : compiled;
}
function compileRouteMatch(ctx) {
	let code = "";
	const staticNodes = /* @__PURE__ */ new Set();
	for (const key in ctx.router.static) {
		const node = ctx.router.static[key];
		if (node?.methods) {
			staticNodes.add(node);
			code += `if(p===${JSON.stringify(key.replace(/\/$/, "") || "/")}){${compileMethodMatch(ctx, node.methods, [], -1)}}`;
		}
	}
	const match = compileNode(ctx, ctx.router.root, [], 0, staticNodes);
	if (match) code += `let s=p.split("/"),l=s.length-1;${match}`;
	if (!code) return ctx.opts?.matchAll ? `return [];` : "";
	return `${ctx.opts?.matchAll ? `let r=[];` : ""}if(p.charCodeAt(p.length-1)===47)p=p.slice(0,-1)||"/";${code}${ctx.opts?.matchAll ? "return r;" : ""}`;
}
function compileMethodMatch(ctx, methods, params, currentIdx) {
	let code = "";
	for (const key in methods) {
		const matchers = methods[key];
		if (matchers && matchers?.length > 0) {
			if (key !== "") code += `if(m==="${key}")${matchers.length > 1 ? "{" : ""}`;
			const _matchers = matchers.map((m) => compileFinalMatch(ctx, m, currentIdx, params)).sort((a, b) => b.weight - a.weight);
			for (const matcher of _matchers) code += matcher.code;
			if (key !== "") code += matchers.length > 1 ? "}" : "";
		}
	}
	return code;
}
function compileFinalMatch(ctx, data, currentIdx, params) {
	let ret = `{data:${serializeData(ctx, data.data)}`;
	const conditions = [];
	const { paramsMap, paramsRegexp } = data;
	if (paramsMap && paramsMap.length > 0) {
		if (!paramsMap[paramsMap.length - 1][2] && currentIdx !== -1) conditions.push(`l>=${currentIdx}`);
		for (let i = 0; i < paramsRegexp.length; i++) {
			const regexp = paramsRegexp[i];
			if (!regexp) continue;
			conditions.push(`${regexp.toString()}.test(s[${i + 1}])`);
		}
		ret += ",params:{";
		for (let i = 0; i < paramsMap.length; i++) {
			const map = paramsMap[i];
			ret += typeof map[1] === "string" ? `${JSON.stringify(map[1])}:${params[i]},` : `...(${map[1].toString()}.exec(${params[i]}))?.groups,`;
		}
		ret += "}";
	}
	return {
		code: (conditions.length > 0 ? `if(${conditions.join("&&")})` : "") + (ctx.opts?.matchAll ? `r.unshift(${ret}});` : `return ${ret}};`),
		weight: conditions.length
	};
}
function compileNode(ctx, node, params, startIdx, staticNodes) {
	let code = "";
	if (node.methods && !staticNodes.has(node)) {
		const match = compileMethodMatch(ctx, node.methods, params, node.key === "*" ? startIdx : -1);
		if (match) {
			const hasLastOptionalParam = node.key === "*";
			code += `if(l===${startIdx}${hasLastOptionalParam ? `||l===${startIdx - 1}` : ""}){${match}}`;
		}
	}
	if (node.static) for (const key in node.static) {
		const match = compileNode(ctx, node.static[key], params, startIdx + 1, staticNodes);
		if (match) code += `if(s[${startIdx + 1}]===${JSON.stringify(key)}){${match}}`;
	}
	if (node.param) {
		const match = compileNode(ctx, node.param, [...params, `s[${startIdx + 1}]`], startIdx + 1, staticNodes);
		if (match) code += match;
	}
	if (node.wildcard) {
		const { wildcard } = node;
		if (wildcard.static || wildcard.param || wildcard.wildcard) throw new Error("Compiler mode does not support patterns after wildcard");
		if (wildcard.methods) {
			const match = compileMethodMatch(ctx, wildcard.methods, [...params, `s.slice(${startIdx + 1}).join('/')`], startIdx);
			if (match) code += match;
		}
	}
	return code;
}
function serializeData(ctx, value) {
	if (ctx.compileToString) if (ctx.opts?.serialize) value = ctx.opts.serialize(value);
	else if (typeof value?.toJSON === "function") value = value.toJSON();
	else value = JSON.stringify(value);
	let index = ctx.data.indexOf(value);
	if (index === -1) {
		ctx.data.push(value);
		index = ctx.data.length - 1;
	}
	return `$${index}`;
}

//#endregion
export { findRoute as a, findAllRoutes as i, addRoute as n, createRouter as r, compileRouterToString as t };