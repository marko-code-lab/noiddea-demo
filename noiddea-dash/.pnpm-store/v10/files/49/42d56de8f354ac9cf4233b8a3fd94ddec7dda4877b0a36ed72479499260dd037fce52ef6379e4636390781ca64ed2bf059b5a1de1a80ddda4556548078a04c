import { HTTPHandler } from "h3";
import { Nitro } from "nitro/types";

//#region src/dev/app.d.ts
declare class NitroDevApp {
  #private;
  nitro: Nitro;
  fetch: (req: Request) => Response | Promise<Response>;
  constructor(nitro: Nitro, catchAllHandler?: HTTPHandler);
}
//#endregion
export { NitroDevApp as t };