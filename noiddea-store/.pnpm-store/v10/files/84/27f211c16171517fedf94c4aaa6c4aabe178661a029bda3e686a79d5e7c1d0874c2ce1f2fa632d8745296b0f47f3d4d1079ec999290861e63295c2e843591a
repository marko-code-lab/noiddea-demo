import { FastResponse } from "srvx";

//#region src/parser.ts
function parseTemplate(template) {
	if (!template) return [];
	template = template.replace(/<script\s+server\s*>([\s\S]*?)<\/script>/gi, (_m, code) => `<?js${code}?>`);
	template = template.replace(/{{\s*(.+)\s*}}|{{{\s*(.+)\s*}}}/g, (_m, code) => {
		if (code[0] === "{") return `<?=${code.slice(1, -1).trim()}?>`;
		return `<?=htmlspecialchars(${code.trim()})?>`;
	});
	const tokens = [];
	const re = /<\?(?:js)?(?<equals>=)?(?<value>[\s\S]*?)\?>/g;
	let cursor = 0;
	let match;
	while (match = re.exec(template)) {
		const { equals, value } = match.groups || {};
		const matchStart = match.index;
		const matchEnd = matchStart + match[0].length;
		if (matchStart > cursor) {
			const textContent = template.slice(cursor, matchStart);
			if (textContent) tokens.push({
				type: "text",
				contents: textContent
			});
		}
		if (equals) tokens.push({
			type: "expr",
			contents: value || ""
		});
		else tokens.push({
			type: "code",
			contents: value || ""
		});
		cursor = matchEnd;
	}
	if (cursor < template.length) {
		const remainingText = template.slice(cursor);
		if (remainingText) tokens.push({
			type: "text",
			contents: remainingText
		});
	}
	return tokens;
}
/**
* Check if a template string contains template syntax.
*/
function hasTemplateSyntax(template) {
	return /(?:<script\s+server\s*>[\s\S]*?<\/script>)|(?:<\?(?:js)?=?[\s\S]*?\?>)|(?:\{\{[\s\S]*?\}\})/i.test(template);
}

//#endregion
//#region src/_runtime.ts
function runtimeStream(body) {
	return `const __chunks__ = [];const echo = (chunk) => { __chunks__.push(chunk); };${body};
function concatStreams(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      for (let chunk of chunks) {
        if (typeof chunk === 'function'){
          chunk = chunk();
        }
        if (chunk instanceof Promise) {
          chunk = await chunk;
          if (!chunk) continue;
          if (chunk instanceof Response){
              chunk = chunk.body;
          }
          if (!(chunk instanceof ReadableStream)) {
            controller.enqueue(chunk instanceof Uint8Array ? chunk : encoder.encode(chunk));
            continue;
          }
        }
        if (chunk instanceof ReadableStream) {
          const reader = chunk.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          reader.releaseLock();
        } else {
          controller.enqueue(chunk instanceof Uint8Array ? chunk : encoder.encode(chunk));
        }
      }
      controller.close();
    },
});
    }
    return concatStreams(__chunks__);
`;
}
function runtimeText(body) {
	return `const __chunks__ = [];const echo = (chunk) => { __chunks__.push(chunk); };${body};
let __out__ = "";
for(let chunk of __chunks__){
  if (typeof chunk === 'function'){
    chunk = chunk();
  }
  if (chunk instanceof Promise){
    chunk = await chunk;
  }
  if (chunk instanceof Response){
    chunk = chunk.body;
  }
  if (chunk instanceof ReadableStream){
    const reader = chunk.getReader();
    while(true){
      const {value, done} = await reader.read();
      if(done) break;
      __out__ += typeof value === "string" ? value : new TextDecoder().decode(value);
    }
    reader.releaseLock();
  } else {
    __out__ += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
  }
}
return __out__;
    `;
}

//#endregion
//#region src/compiler.ts
/**
* Compile a template string into a render function.
*
* @example
* ```ts
* import { compileTemplate } from "rendu";
*
* const template = `
*   <h1>{{ title }}</h1>
*   <ul>
*   <? for (const item of items) { ?>
*     <li>{{ item }}</li>
*   <? } ?>
*   </ul>
* `;
*
* const render = compileTemplate(template, { stream: false });
*
* const html = await render({ title: "My List", items: ["Item 1", "Item 2", "Item 3"] });
* console.log(html);
* // Output:
* // <h1>My List</h1>
* // <ul>
* //   <li>Item 1</li>
* //   <li>Item 2</li>
* //   <li>Item 3</li>
* // </ul>
* ```
*/
function compileTemplate(template, opts = {}) {
	const body = compileTemplateToString(template, opts, false);
	const sourcemaps = opts.filename ? `\n//# sourceURL=${opts.filename}` : "";
	try {
		const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
		return new AsyncFunction("__context__", body + sourcemaps);
	} catch (error) {
		throw new SyntaxError(`Template syntax error: ${error.message}`, {});
	}
}
/**
* Compile a template string into a render function code string.
*
* **Note:** This function is for advanced use cases where you need the generated code as a string.
*/
function compileTemplateToString(template, opts, asyncWrapper) {
	const parts = [];
	const tokens = parseTemplate(template);
	for (const token of tokens) switch (token.type) {
		case "text":
			if (opts.preserveLines) for (const line of token.contents.split("\n")) parts.push(`echo(${JSON.stringify(line + "\n")})\n`);
			else parts.push(`echo(${JSON.stringify(token.contents)})`);
			break;
		case "expr":
			parts.push(`echo(${token.contents})`);
			break;
		case "code":
			parts.push(token.contents);
			break;
	}
	let body = parts.join(opts.preserveLines ? ";" : "\n");
	body = opts.contextKeys ? `const {${opts.contextKeys.join(",")}}=__context__;${body}` : `with(__context__){${body}}`;
	body = opts.stream === false ? runtimeText(body) : runtimeStream(body);
	return asyncWrapper === false ? body : `(async (__context__) => {${body}})`;
}

//#endregion
//#region node_modules/.pnpm/cookie-es@2.0.0/node_modules/cookie-es/dist/index.mjs
function parse(str, options) {
	if (typeof str !== "string") throw new TypeError("argument str must be a string");
	const obj = {};
	const opt = options || {};
	const dec = opt.decode || decode;
	let index = 0;
	while (index < str.length) {
		const eqIdx = str.indexOf("=", index);
		if (eqIdx === -1) break;
		let endIdx = str.indexOf(";", index);
		if (endIdx === -1) endIdx = str.length;
		else if (endIdx < eqIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = str.slice(index, eqIdx).trim();
		if (opt?.filter && !opt?.filter(key)) {
			index = endIdx + 1;
			continue;
		}
		if (void 0 === obj[key]) {
			let val = str.slice(eqIdx + 1, endIdx).trim();
			if (val.codePointAt(0) === 34) val = val.slice(1, -1);
			obj[key] = tryDecode(val, dec);
		}
		index = endIdx + 1;
	}
	return obj;
}
function decode(str) {
	return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
	try {
		return decode2(str);
	} catch {
		return str;
	}
}
const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
	const opt = options || {};
	const enc = opt.encode || encodeURIComponent;
	if (typeof enc !== "function") throw new TypeError("option encode is invalid");
	if (!fieldContentRegExp.test(name)) throw new TypeError("argument name is invalid");
	const encodedValue = enc(value);
	if (encodedValue && !fieldContentRegExp.test(encodedValue)) throw new TypeError("argument val is invalid");
	let str = name + "=" + encodedValue;
	if (void 0 !== opt.maxAge && opt.maxAge !== null) {
		const maxAge = opt.maxAge - 0;
		if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) throw new TypeError("option maxAge is invalid");
		str += "; Max-Age=" + Math.floor(maxAge);
	}
	if (opt.domain) {
		if (!fieldContentRegExp.test(opt.domain)) throw new TypeError("option domain is invalid");
		str += "; Domain=" + opt.domain;
	}
	if (opt.path) {
		if (!fieldContentRegExp.test(opt.path)) throw new TypeError("option path is invalid");
		str += "; Path=" + opt.path;
	}
	if (opt.expires) {
		if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) throw new TypeError("option expires is invalid");
		str += "; Expires=" + opt.expires.toUTCString();
	}
	if (opt.httpOnly) str += "; HttpOnly";
	if (opt.secure) str += "; Secure";
	if (opt.priority) switch (typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority) {
		case "low":
			str += "; Priority=Low";
			break;
		case "medium":
			str += "; Priority=Medium";
			break;
		case "high":
			str += "; Priority=High";
			break;
		default: throw new TypeError("option priority is invalid");
	}
	if (opt.sameSite) switch (typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite) {
		case true:
			str += "; SameSite=Strict";
			break;
		case "lax":
			str += "; SameSite=Lax";
			break;
		case "strict":
			str += "; SameSite=Strict";
			break;
		case "none":
			str += "; SameSite=None";
			break;
		default: throw new TypeError("option sameSite is invalid");
	}
	if (opt.partitioned) str += "; Partitioned";
	return str;
}
function isDate(val) {
	return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

//#endregion
//#region src/render.ts
/**
* Renders an HTML template to a Response object.
*
* @example
* ```ts
* import { compileTemplate, renderToResponse } from "rendu";
*
* const render = compileTemplate(template, { stream: true });
*
* const response = await renderToResponse(render, { request });
* ```
* @param htmlTemplate The compiled HTML template.
* @param opts Options for rendering.
* @returns A Response object.
*/
async function renderToResponse(htmlTemplate, opts) {
	const ctx = createRenderContext(opts);
	const body = await htmlTemplate(ctx);
	if (body instanceof Response) return body;
	return new FastResponse(body, {
		status: ctx.$RESPONSE.status,
		statusText: ctx.$RESPONSE.statusText,
		headers: ctx.$RESPONSE.headers
	});
}
const RENDER_CONTEXT_KEYS = [
	"htmlspecialchars",
	"setCookie",
	"redirect",
	"$REQUEST",
	"$METHOD",
	"$URL",
	"$HEADERS",
	"$COOKIES",
	"$RESPONSE"
];
function createRenderContext(options) {
	const url = new URL(options.request?.url || "http://_");
	const response = {
		status: 200,
		statusText: "OK",
		headers: new Headers({ "Content-Type": "text/html ; charset=utf-8" })
	};
	const $COOKIES = lazyCookies(options.request);
	const setCookie = (name, value, sOpts = {}) => {
		response.headers.append("Set-Cookie", serialize(name, value, sOpts));
	};
	const redirect = (to, status = 302) => {
		response.status = status;
		response.headers.set("Location", to);
	};
	return {
		...options.context,
		htmlspecialchars,
		setCookie,
		redirect,
		$REQUEST: options.request,
		$METHOD: options.request?.method,
		$URL: url,
		$HEADERS: options.request?.headers,
		$COOKIES,
		$RESPONSE: response
	};
}
function lazyCookies(req) {
	if (!req) return {};
	let parsed;
	return new Proxy(Object.freeze(Object.create(null)), { get(_, prop) {
		if (typeof prop !== "string") return void 0;
		parsed ??= parse(req.headers.get("cookie") || "");
		return parsed[prop];
	} });
}
function htmlspecialchars(s) {
	const htmlSpecialCharsMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	};
	return String(s).replace(/[&<>"']/g, (c) => htmlSpecialCharsMap[c] || c);
}

//#endregion
export { RENDER_CONTEXT_KEYS, compileTemplate, compileTemplateToString, createRenderContext, hasTemplateSyntax, renderToResponse };