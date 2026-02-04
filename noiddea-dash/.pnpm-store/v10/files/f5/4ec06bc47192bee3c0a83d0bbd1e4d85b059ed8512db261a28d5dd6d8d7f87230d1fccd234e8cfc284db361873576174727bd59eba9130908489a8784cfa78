import { t as NitroDevApp } from "./_dev.mjs";
import { IncomingMessage, OutgoingMessage } from "node:http";
import { Duplex } from "node:stream";
import { Server, ServerOptions } from "srvx";
import { LoadConfigOptions, Nitro, NitroBuildInfo, NitroConfig, NitroOptions, RunnerMessageListener, RunnerRPCHooks, TaskEvent, TaskRunnerOptions } from "nitro/types";

//#region src/nitro.d.ts
declare function createNitro(config?: NitroConfig, opts?: LoadConfigOptions): Promise<Nitro>;
//#endregion
//#region src/config/loader.d.ts
declare function loadOptions(configOverrides?: NitroConfig, opts?: LoadConfigOptions): Promise<NitroOptions>;
//#endregion
//#region src/build/build.d.ts
declare function build(nitro: Nitro): Promise<void>;
//#endregion
//#region src/build/assets.d.ts
declare function copyPublicAssets(nitro: Nitro): Promise<void>;
//#endregion
//#region src/build/prepare.d.ts
declare function prepare(nitro: Nitro): Promise<void>;
//#endregion
//#region src/build/types.d.ts
declare function writeTypes(nitro: Nitro): Promise<void>;
//#endregion
//#region src/build/info.d.ts
declare function getBuildInfo(root: string): Promise<{
  outputDir?: undefined;
  buildInfo?: undefined;
} | {
  outputDir: string;
  buildInfo?: NitroBuildInfo;
}>;
//#endregion
//#region src/dev/server.d.ts
declare function createDevServer(nitro: Nitro): NitroDevServer;
declare class NitroDevServer extends NitroDevApp implements RunnerRPCHooks {
  #private;
  constructor(nitro: Nitro);
  upgrade(req: IncomingMessage, socket: OutgoingMessage<IncomingMessage> | Duplex, head: any): Promise<any>;
  listen(opts?: Partial<Omit<ServerOptions, "fetch">>): Server;
  close(): Promise<void>;
  reload(): void;
  sendMessage(message: unknown): void;
  onMessage(listener: RunnerMessageListener): void;
  offMessage(listener: RunnerMessageListener): void;
}
//#endregion
//#region src/prerender/prerender.d.ts
declare function prerender(nitro: Nitro): Promise<void>;
//#endregion
//#region src/task.d.ts
/** @experimental */
declare function runTask(taskEvent: TaskEvent, opts?: TaskRunnerOptions): Promise<{
  result: unknown;
}>;
/** @experimental */
declare function listTasks(opts?: TaskRunnerOptions): Promise<Record<string, {
  meta: {
    description: string;
  };
}>>;
//#endregion
export { build, copyPublicAssets, createDevServer, createNitro, getBuildInfo, listTasks, loadOptions, prepare, prerender, runTask, writeTypes };