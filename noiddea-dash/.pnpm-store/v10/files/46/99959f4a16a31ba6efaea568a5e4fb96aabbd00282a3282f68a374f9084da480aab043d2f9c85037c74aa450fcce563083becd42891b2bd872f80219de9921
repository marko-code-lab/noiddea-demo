import { CompilerOptions, TypeAcquisition } from "typescript";

//#region node_modules/.pnpm/pkg-types@2.3.0/node_modules/pkg-types/dist/index.d.mts
type StripEnums<T extends Record<string, any>> = { [K in keyof T]: T[K] extends boolean ? T[K] : T[K] extends string ? T[K] : T[K] extends object ? T[K] : T[K] extends Array<any> ? T[K] : T[K] extends undefined ? undefined : any };
interface TSConfig {
  compilerOptions?: StripEnums<CompilerOptions>;
  exclude?: string[];
  compileOnSave?: boolean;
  extends?: string | string[];
  files?: string[];
  include?: string[];
  typeAcquisition?: TypeAcquisition;
  references?: {
    path: string;
  }[];
}
/**
 * Defines a TSConfig structure.
 * @param tsconfig - The contents of `tsconfig.json` as an object. See {@link TSConfig}.
 * @returns the same `tsconfig.json` object.
 */
//#endregion
export { TSConfig as t };