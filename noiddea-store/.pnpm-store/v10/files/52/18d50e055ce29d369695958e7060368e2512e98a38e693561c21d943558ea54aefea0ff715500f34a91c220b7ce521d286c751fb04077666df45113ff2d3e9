import "vite/client";
import "nitro/vite/types";
import "./_dev.mjs";
import "unenv";
import { Plugin } from "vite";
import { Nitro, NitroConfig, NitroModule } from "nitro/types";

//#region src/build/vite/types.d.ts
declare module "vite" {
  interface UserConfig {
    /**
     * Nitro Vite Plugin options.
     */
    nitro?: NitroConfig;
  }
  interface Plugin {
    nitro?: NitroModule;
  }
}
interface NitroPluginConfig extends NitroConfig {
  /**
   * @internal Use preinitialized Nitro instance for the plugin.
   */
  _nitro?: Nitro;
  experimental?: NitroConfig["experimental"] & {
    vite: {
      /**
       * @experimental Enable `?assets` import proposed by https://github.com/vitejs/vite/discussions/20913
       * @default true
       */
      assetsImport?: boolean;
      /**
       * Reload the page when a server module is updated.
       *
       * @default true
       */
      serverReload?: boolean;
      /**
       * Additional Vite environment services to register.
       */
      services?: Record<string, ServiceConfig>;
    };
  };
}
interface ServiceConfig {
  entry: string;
}
//#endregion
//#region src/build/vite/plugin.d.ts
declare function nitro(pluginConfig?: NitroPluginConfig): Plugin[];
//#endregion
export { type NitroPluginConfig, type ServiceConfig, nitro };