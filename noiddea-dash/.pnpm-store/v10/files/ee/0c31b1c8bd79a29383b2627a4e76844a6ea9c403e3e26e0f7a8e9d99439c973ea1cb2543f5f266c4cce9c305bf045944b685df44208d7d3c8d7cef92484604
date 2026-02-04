//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/index.d.mts
interface RouterContext<T = unknown> {
  root: Node<T>;
  static: Record<string, Node<T> | undefined>;
}
type ParamsIndexMap = Array<[Index: number, name: string | RegExp, optional: boolean]>;
type MethodData<T = unknown> = {
  data: T;
  paramsMap?: ParamsIndexMap;
  paramsRegexp: RegExp[];
};
interface Node<T = unknown> {
  key: string;
  static?: Record<string, Node<T>>;
  param?: Node<T>;
  wildcard?: Node<T>;
  hasRegexParam?: boolean;
  methods?: Record<string, MethodData<T>[] | undefined>;
}
//#endregion
//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/compiler.d.mts
interface RouterCompilerOptions<T = any> {
  matchAll?: boolean;
  serialize?: (data: T) => string;
}
/**
* Compiles the router instance into a faster route-matching function.
*
* **IMPORTANT:** `compileRouter` requires eval support with `new Function()` in the runtime for JIT compilation.
*
* @example
* import { createRouter, addRoute } from "rou3";
* import { compileRouter } from "rou3/compiler";
* const router = createRouter();
* // [add some routes]
* const findRoute = compileRouter(router);
* const matchAll = compileRouter(router, { matchAll: true });
* findRoute("GET", "/path/foo/bar");
*
* @param router - The router context to compile.
*/
//#endregion
export { RouterContext as n, RouterCompilerOptions as t };