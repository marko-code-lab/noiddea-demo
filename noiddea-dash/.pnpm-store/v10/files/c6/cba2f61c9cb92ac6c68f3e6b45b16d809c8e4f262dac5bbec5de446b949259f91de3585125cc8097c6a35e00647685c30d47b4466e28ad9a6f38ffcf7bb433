import { ChokidarOptions } from "chokidar";
import "@azure/app-configuration";
import "@azure/cosmos";
import { SecretClientOptions } from "@azure/keyvault-secrets";
import "@azure/storage-blob";
import "@azure/data-tables";
import "@capacitor/preferences";
import { Database } from "db0";
import { Kv, openKv } from "@deno/kv";
import { LRUCache } from "lru-cache";
import { MongoClientOptions } from "mongodb";
import { GetDeployStoreOptions, GetStoreOptions } from "@netlify/blobs";
import "@planetscale/database";
import { ClusterNode, ClusterOptions, RedisOptions } from "ioredis";
import { UTApi } from "uploadthing/server";
import { RedisConfigNodejs } from "@upstash/redis";
import "@vercel/kv";
import "@vercel/functions";

//#region src/types.d.ts
type StorageValue = null | string | number | boolean | object;
type WatchEvent = "update" | "remove";
type WatchCallback = (event: WatchEvent, key: string) => any;
type MaybePromise<T> = T | Promise<T>;
type MaybeDefined<T> = T extends any ? T : any;
type Unwatch = () => MaybePromise<void>;
interface StorageMeta {
  atime?: Date;
  mtime?: Date;
  ttl?: number;
  [key: string]: StorageValue | Date | undefined;
}
type TransactionOptions = Record<string, any>;
type GetKeysOptions = TransactionOptions & {
  maxDepth?: number;
};
interface DriverFlags {
  maxDepth?: boolean;
  ttl?: boolean;
}
interface Driver<OptionsT = any, InstanceT = any> {
  name?: string;
  flags?: DriverFlags;
  options?: OptionsT;
  getInstance?: () => InstanceT;
  hasItem: (key: string, opts: TransactionOptions) => MaybePromise<boolean>;
  getItem: (key: string, opts?: TransactionOptions) => MaybePromise<StorageValue>;
  /** @experimental */
  getItems?: (items: {
    key: string;
    options?: TransactionOptions;
  }[], commonOptions?: TransactionOptions) => MaybePromise<{
    key: string;
    value: StorageValue;
  }[]>;
  /** @experimental */
  getItemRaw?: (key: string, opts: TransactionOptions) => MaybePromise<unknown>;
  setItem?: (key: string, value: string, opts: TransactionOptions) => MaybePromise<void>;
  /** @experimental */
  setItems?: (items: {
    key: string;
    value: string;
    options?: TransactionOptions;
  }[], commonOptions?: TransactionOptions) => MaybePromise<void>;
  /** @experimental */
  setItemRaw?: (key: string, value: any, opts: TransactionOptions) => MaybePromise<void>;
  removeItem?: (key: string, opts: TransactionOptions) => MaybePromise<void>;
  getMeta?: (key: string, opts: TransactionOptions) => MaybePromise<StorageMeta | null>;
  getKeys: (base: string, opts: GetKeysOptions) => MaybePromise<string[]>;
  clear?: (base: string, opts: TransactionOptions) => MaybePromise<void>;
  dispose?: () => MaybePromise<void>;
  watch?: (callback: WatchCallback) => MaybePromise<Unwatch>;
}
type StorageDefinition = {
  items: unknown;
  [key: string]: unknown;
};
type StorageItemMap<T> = T extends StorageDefinition ? T["items"] : T;
type StorageItemType<T, K> = K extends keyof StorageItemMap<T> ? StorageItemMap<T>[K] : T extends StorageDefinition ? StorageValue : T;
interface Storage$1<T extends StorageValue = StorageValue> {
  hasItem<U extends Extract<T, StorageDefinition>, K extends keyof StorageItemMap<U>>(key: K, opts?: TransactionOptions): Promise<boolean>;
  hasItem(key: string, opts?: TransactionOptions): Promise<boolean>;
  getItem<U extends Extract<T, StorageDefinition>, K extends string & keyof StorageItemMap<U>>(key: K, ops?: TransactionOptions): Promise<StorageItemType<T, K> | null>;
  getItem<R = StorageItemType<T, string>>(key: string, opts?: TransactionOptions): Promise<R | null>;
  /** @experimental */
  getItems: <U extends T>(items: (string | {
    key: string;
    options?: TransactionOptions;
  })[], commonOptions?: TransactionOptions) => Promise<{
    key: string;
    value: U;
  }[]>;
  /** @experimental See https://github.com/unjs/unstorage/issues/142 */
  getItemRaw: <T = any>(key: string, opts?: TransactionOptions) => Promise<MaybeDefined<T> | null>;
  setItem<U extends Extract<T, StorageDefinition>, K extends keyof StorageItemMap<U>>(key: K, value: StorageItemType<T, K>, opts?: TransactionOptions): Promise<void>;
  setItem<U extends T>(key: string, value: U, opts?: TransactionOptions): Promise<void>;
  /** @experimental */
  setItems: <U extends T>(items: {
    key: string;
    value: U;
    options?: TransactionOptions;
  }[], commonOptions?: TransactionOptions) => Promise<void>;
  /** @experimental See https://github.com/unjs/unstorage/issues/142 */
  setItemRaw: <T = any>(key: string, value: MaybeDefined<T>, opts?: TransactionOptions) => Promise<void>;
  removeItem<U extends Extract<T, StorageDefinition>, K extends keyof StorageItemMap<U>>(key: K, opts?: (TransactionOptions & {
    removeMeta?: boolean;
  }) | boolean): Promise<void>;
  removeItem(key: string, opts?: (TransactionOptions & {
    removeMeta?: boolean;
  }) | boolean): Promise<void>;
  getMeta: (key: string, opts?: (TransactionOptions & {
    nativeOnly?: boolean;
  }) | boolean) => MaybePromise<StorageMeta>;
  setMeta: (key: string, value: StorageMeta, opts?: TransactionOptions) => Promise<void>;
  removeMeta: (key: string, opts?: TransactionOptions) => Promise<void>;
  getKeys: (base?: string, opts?: GetKeysOptions) => Promise<string[]>;
  clear: (base?: string, opts?: TransactionOptions) => Promise<void>;
  dispose: () => Promise<void>;
  watch: (callback: WatchCallback) => Promise<Unwatch>;
  unwatch: () => Promise<void>;
  mount: (base: string, driver: Driver) => Storage$1;
  unmount: (base: string, dispose?: boolean) => Promise<void>;
  getMount: (key?: string) => {
    base: string;
    driver: Driver;
  };
  getMounts: (base?: string, options?: {
    parents?: boolean;
  }) => {
    base: string;
    driver: Driver;
  }[];
  keys: Storage$1["getKeys"];
  get: Storage$1<T>["getItem"];
  set: Storage$1<T>["setItem"];
  has: Storage$1<T>["hasItem"];
  del: Storage$1<T>["removeItem"];
  remove: Storage$1<T>["removeItem"];
}
//#endregion
//#region src/storage.d.ts
interface CreateStorageOptions {
  driver?: Driver;
}
declare function createStorage<T extends StorageValue>(options?: CreateStorageOptions): Storage$1<T>;
type Snapshot<T = string> = Record<string, T>;
declare function snapshot(storage: Storage$1, base: string): Promise<Snapshot<string>>;
declare function restoreSnapshot(driver: Storage$1, snapshot: Snapshot<StorageValue>, base?: string): Promise<void>;
//#endregion
//#region src/utils.d.ts
declare function prefixStorage<T extends StorageValue>(storage: Storage$1<T> | Storage$1<any>, base: string): Storage$1<T>;
declare function normalizeKey(key?: string): string;
declare function joinKeys(...keys: string[]): string;
declare function normalizeBaseKey(base?: string): string;
declare function filterKeyByDepth(key: string, depth: number | undefined): boolean;
declare function filterKeyByBase(key: string, base: string | undefined): boolean;
//#endregion
//#region src/drivers/utils/index.d.ts
type DriverFactory<OptionsT, InstanceT> = (opts: OptionsT) => Driver<OptionsT, InstanceT>;
declare function defineDriver<OptionsT = any, InstanceT = never>(factory: DriverFactory<OptionsT, InstanceT>): DriverFactory<OptionsT, InstanceT>;
//#endregion
//#region src/drivers/azure-app-configuration.d.ts
interface AzureAppConfigurationOptions {
  /**
   * Optional prefix for keys. This can be used to isolate keys from different applications in the same Azure App Configuration instance. E.g. "app01" results in keys like "app01:foo" and "app01:bar".
   * @default null
   */
  prefix?: string;
  /**
   * Optional label for keys. If not provided, all keys will be created and listed without labels. This can be used to isolate keys from different environments in the same Azure App Configuration instance. E.g. "dev" results in keys like "foo" and "bar" with the label "dev".
   * @default '\0'
   */
  label?: string;
  /**
   * Optional endpoint to use when connecting to Azure App Configuration. If not provided, the appConfigName option must be provided. If both are provided, the endpoint option takes precedence.
   * @default null
   */
  endpoint?: string;
  /**
   * Optional name of the Azure App Configuration instance to connect to. If not provided, the endpoint option must be provided. If both are provided, the endpoint option takes precedence.
   * @default null
   */
  appConfigName?: string;
  /**
   * Optional connection string to use when connecting to Azure App Configuration. If not provided, the endpoint option must be provided. If both are provided, the endpoint option takes precedence.
   * @default null
   */
  connectionString?: string;
}
//#endregion
//#region src/drivers/azure-cosmos.d.ts
interface AzureCosmosOptions {
  /**
   * CosmosDB endpoint in the format of https://<account>.documents.azure.com:443/.
   */
  endpoint: string;
  /**
   * CosmosDB account key. If not provided, the driver will use the DefaultAzureCredential (recommended).
   */
  accountKey?: string;
  /**
   * The name of the database to use. Defaults to `unstorage`.
   * @default "unstorage"
   */
  databaseName?: string;
  /**
   * The name of the container to use. Defaults to `unstorage`.
   * @default "unstorage"
   */
  containerName?: string;
}
//#endregion
//#region src/drivers/azure-key-vault.d.ts
interface AzureKeyVaultOptions {
  /**
   * The name of the key vault to use.
   */
  vaultName: string;
  /**
   * Version of the Azure Key Vault service to use. Defaults to 7.3.
   * @default '7.3'
   */
  serviceVersion?: SecretClientOptions["serviceVersion"];
  /**
   * The number of entries to retrieve per request. Impacts getKeys() and clear() performance. Maximum value is 25.
   * @default 25
   */
  pageSize?: number;
}
//#endregion
//#region src/drivers/azure-storage-blob.d.ts
interface AzureStorageBlobOptions {
  /**
   * The name of the Azure Storage account.
   */
  accountName?: string;
  /**
   * The name of the storage container. All entities will be stored in the same container. Will be created if it doesn't exist.
   * @default "unstorage"
   */
  containerName?: string;
  /**
   * The account key. If provided, the SAS key will be ignored. Only available in Node.js runtime.
   */
  accountKey?: string;
  /**
   * The SAS token. If provided, the account key will be ignored. Include at least read, list and write permissions to be able to list keys.
   */
  sasKey?: string;
  /**
   * The SAS URL. If provided, the account key, SAS key and container name will be ignored.
   */
  sasUrl?: string;
  /**
   * The connection string. If provided, the account key and SAS key will be ignored. Only available in Node.js runtime.
   */
  connectionString?: string;
  /**
   * Storage account endpoint suffix. Need to be changed for Microsoft Azure operated by 21Vianet, Azure Government or Azurite.
   * @default ".blob.core.windows.net"
   */
  endpointSuffix?: string;
}
//#endregion
//#region src/drivers/azure-storage-table.d.ts
interface AzureStorageTableOptions {
  /**
   * The name of the Azure Storage account.
   */
  accountName: string;
  /**
   * The name of the table. All entities will be stored in the same table.
   * @default 'unstorage'
   */
  tableName?: string;
  /**
   * The partition key. All entities will be stored in the same partition.
   * @default 'unstorage'
   */
  partitionKey?: string;
  /**
   * The account key. If provided, the SAS key will be ignored. Only available in Node.js runtime.
   */
  accountKey?: string;
  /**
   * The SAS key. If provided, the account key will be ignored.
   */
  sasKey?: string;
  /**
   * The connection string. If provided, the account key and SAS key will be ignored. Only available in Node.js runtime.
   */
  connectionString?: string;
  /**
   * The number of entries to retrive per request. Impacts getKeys() and clear() performance. Maximum value is 1000.
   * @default 1000
   */
  pageSize?: number;
}
//#endregion
//#region src/drivers/capacitor-preferences.d.ts
interface CapacitorPreferencesOptions {
  base?: string;
}
//#endregion
//#region src/drivers/cloudflare-kv-binding.d.ts
interface KVOptions {
  binding?: string | KVNamespace;
  /** Adds prefix to all stored keys */
  base?: string;
  /**
   * The minimum time-to-live (ttl) for setItem in seconds.
   * The default is 60 seconds as per Cloudflare's [documentation](https://developers.cloudflare.com/kv/api/write-key-value-pairs/).
   */
  minTTL?: number;
}
//#endregion
//#region src/drivers/cloudflare-kv-http.d.ts
interface KVAuthAPIToken {
  /**
   * API Token generated from the [User Profile 'API Tokens' page](https://dash.cloudflare.com/profile/api-tokens)
   * of the Cloudflare console.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  apiToken: string;
}
interface KVAuthServiceKey {
  /**
   * A special Cloudflare API key good for a restricted set of endpoints.
   * Always begins with "v1.0-", may vary in length.
   * May be used to authenticate in place of `apiToken` or `apiKey` and `email`.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  userServiceKey: string;
}
interface KVAuthEmailKey {
  /**
   * Email address associated with your account.
   * Should be used along with `apiKey` to authenticate in place of `apiToken`.
   */
  email: string;
  /**
   * API key generated on the "My Account" page of the Cloudflare console.
   * Should be used along with `email` to authenticate in place of `apiToken`.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  apiKey: string;
}
type KVHTTPOptions = {
  /**
   * Cloudflare account ID (required)
   */
  accountId: string;
  /**
   * The ID of the KV namespace to target (required)
   */
  namespaceId: string;
  /**
   * The URL of the Cloudflare API.
   * @default https://api.cloudflare.com
   */
  apiURL?: string;
  /**
   * Adds prefix to all stored keys
   */
  base?: string;
  /**
   * The minimum time-to-live (ttl) for setItem in seconds.
   * The default is 60 seconds as per Cloudflare's [documentation](https://developers.cloudflare.com/kv/api/write-key-value-pairs/).
   */
  minTTL?: number;
} & (KVAuthServiceKey | KVAuthAPIToken | KVAuthEmailKey);
//#endregion
//#region src/drivers/cloudflare-r2-binding.d.ts
interface CloudflareR2Options {
  binding?: string | R2Bucket;
  base?: string;
}
//#endregion
//#region src/drivers/db0.d.ts
interface DB0DriverOptions {
  database: Database;
  tableName?: string;
}
//#endregion
//#region src/drivers/deno-kv-node.d.ts
interface DenoKvNodeOptions {
  base?: string;
  path?: string;
  openKvOptions?: Parameters<typeof openKv>[1];
}
//#endregion
//#region src/drivers/deno-kv.d.ts
interface DenoKvOptions {
  base?: string;
  path?: string;
  openKv?: () => Promise<Deno.Kv | Kv>;
  /**
   * Default TTL for all items in seconds.
   */
  ttl?: number;
}
//#endregion
//#region src/drivers/fs-lite.d.ts
interface FSStorageOptions$1 {
  base?: string;
  ignore?: (path: string) => boolean;
  readOnly?: boolean;
  noClear?: boolean;
}
//#endregion
//#region src/drivers/fs.d.ts
interface FSStorageOptions {
  base?: string;
  ignore?: string[];
  readOnly?: boolean;
  noClear?: boolean;
  watchOptions?: ChokidarOptions;
}
//#endregion
//#region src/drivers/github.d.ts
interface GithubOptions {
  /**
   * The name of the repository. (e.g. `username/my-repo`)
   * Required
   */
  repo: string;
  /**
   * The branch to fetch. (e.g. `dev`)
   * @default "main"
   */
  branch?: string;
  /**
   * @default ""
   */
  dir?: string;
  /**
   * @default 600
   */
  ttl?: number;
  /**
   * Github API token (recommended)
   */
  token?: string;
  /**
   * @default "https://api.github.com"
   */
  apiURL?: string;
  /**
   * @default "https://raw.githubusercontent.com"
   */
  cdnURL?: string;
}
//#endregion
//#region src/drivers/http.d.ts
interface HTTPOptions {
  base: string;
  headers?: Record<string, string>;
}
//#endregion
//#region src/drivers/indexedb.d.ts
interface IDBKeyvalOptions {
  base?: string;
  dbName?: string;
  storeName?: string;
}
//#endregion
//#region src/drivers/localstorage.d.ts
interface LocalStorageOptions {
  base?: string;
  window?: typeof window;
  windowKey?: "localStorage" | "sessionStorage";
  storage?: typeof window.localStorage | typeof window.sessionStorage;
  /** @deprecated use `storage` option */
  sessionStorage?: typeof window.sessionStorage;
  /** @deprecated use `storage` option */
  localStorage?: typeof window.localStorage;
}
//#endregion
//#region src/drivers/lru-cache.d.ts
type LRUCacheOptions = LRUCache.OptionsBase<string, any, any> & Partial<LRUCache.OptionsMaxLimit<string, any, any>> & Partial<LRUCache.OptionsSizeLimit<string, any, any>> & Partial<LRUCache.OptionsTTLLimit<string, any, any>>;
interface LRUDriverOptions extends LRUCacheOptions {}
//#endregion
//#region src/drivers/mongodb.d.ts
interface MongoDbOptions {
  /**
   * The MongoDB connection string.
   */
  connectionString: string;
  /**
   * Optional configuration settings for the MongoClient instance.
   */
  clientOptions?: MongoClientOptions;
  /**
   * The name of the database to use.
   * @default "unstorage"
   */
  databaseName?: string;
  /**
   * The name of the collection to use.
   * @default "unstorage"
   */
  collectionName?: string;
}
//#endregion
//#region src/drivers/netlify-blobs.d.ts
type NetlifyStoreOptions = NetlifyDeployStoreLegacyOptions | NetlifyDeployStoreOptions | NetlifyNamedStoreOptions;
interface ExtraOptions {
  /** If set to `true`, the store is scoped to the deploy. This means that it is only available from that deploy, and will be deleted or rolled-back alongside it. */
  deployScoped?: boolean;
}
interface NetlifyDeployStoreOptions extends GetDeployStoreOptions, ExtraOptions {
  name?: never;
  deployScoped: true;
}
interface NetlifyDeployStoreLegacyOptions extends NetlifyDeployStoreOptions {
  region?: never;
}
interface NetlifyNamedStoreOptions extends GetStoreOptions, ExtraOptions {
  name: string;
  deployScoped?: false;
}
//#endregion
//#region src/drivers/overlay.d.ts
interface OverlayStorageOptions {
  layers: Driver[];
}
//#endregion
//#region src/drivers/planetscale.d.ts
interface PlanetscaleDriverOptions {
  url?: string;
  table?: string;
  boostCache?: boolean;
}
//#endregion
//#region src/drivers/redis.d.ts
interface RedisOptions$1 extends RedisOptions {
  /**
   * Optional prefix to use for all keys. Can be used for namespacing.
   */
  base?: string;
  /**
   * Url to use for connecting to redis. Takes precedence over `host` option. Has the format `redis://<REDIS_USER>:<REDIS_PASSWORD>@<REDIS_HOST>:<REDIS_PORT>`
   */
  url?: string;
  /**
   * List of redis nodes to use for cluster mode. Takes precedence over `url` and `host` options.
   */
  cluster?: ClusterNode[];
  /**
   * Options to use for cluster mode.
   */
  clusterOptions?: ClusterOptions;
  /**
   * Default TTL for all items in seconds.
   */
  ttl?: number;
  /**
   * How many keys to scan at once.
   *
   * [redis documentation](https://redis.io/docs/latest/commands/scan/#the-count-option)
   */
  scanCount?: number;
  /**
   * Whether to initialize the redis instance immediately.
   * Otherwise, it will be initialized on the first read/write call.
   * @default false
   */
  preConnect?: boolean;
}
//#endregion
//#region src/drivers/s3.d.ts
interface S3DriverOptions {
  /**
   * Access Key ID
   */
  accessKeyId: string;
  /**
   * Secret Access Key
   */
  secretAccessKey: string;
  /**
   * The endpoint URL of the S3 service.
   *
   * - For AWS S3: "https://s3.[region].amazonaws.com/"
   * - For cloudflare R2: "https://[uid].r2.cloudflarestorage.com/"
   */
  endpoint: string;
  /**
   * The region of the S3 bucket.
   *
   * - For AWS S3, this is the region of the bucket.
   * - For cloudflare, this is can be set to `auto`.
   */
  region: string;
  /**
   * The name of the bucket.
   */
  bucket: string;
  /**
   * Enabled by default to speedup `clear()` operation. Set to `false` if provider is not implementing [DeleteObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html).
   */
  bulkDelete?: boolean;
}
//#endregion
//#region src/drivers/session-storage.d.ts
interface SessionStorageOptions extends LocalStorageOptions {}
//#endregion
//#region src/drivers/uploadthing.d.ts
type UTApiOptions = Omit<Exclude<ConstructorParameters<typeof UTApi>[0], undefined>, "defaultKeyType">;
interface UploadThingOptions extends UTApiOptions {
  /** base key to add to keys */
  base?: string;
}
//#endregion
//#region src/drivers/upstash.d.ts
interface UpstashOptions extends Partial<RedisConfigNodejs> {
  /**
   * Optional prefix to use for all keys. Can be used for namespacing.
   */
  base?: string;
  /**
   * Default TTL for all items in seconds.
   */
  ttl?: number;
  /**
   * How many keys to scan at once.
   *
   * [redis documentation](https://redis.io/docs/latest/commands/scan/#the-count-option)
   */
  scanCount?: number;
}
//#endregion
//#region src/drivers/vercel-blob.d.ts
interface VercelBlobOptions {
  /**
   * Whether the blob should be publicly accessible. (required, must be "public")
   */
  access: "public";
  /**
   * Prefix to prepend to all keys. Can be used for namespacing.
   */
  base?: string;
  /**
   * Rest API Token to use for connecting to your Vercel Blob store.
   * If not provided, it will be read from the environment variable `BLOB_READ_WRITE_TOKEN`.
   */
  token?: string;
  /**
   * Prefix to use for token environment variable name.
   * Default is `BLOB` (env name = `BLOB_READ_WRITE_TOKEN`).
   */
  envPrefix?: string;
}
//#endregion
//#region src/drivers/vercel-kv.d.ts
interface VercelKVOptions extends Partial<RedisConfigNodejs> {
  /**
   * Optional prefix to use for all keys. Can be used for namespacing.
   */
  base?: string;
  /**
   * Optional flag to customize environment variable prefix (Default is `KV`). Set to `false` to disable env inference for `url` and `token` options
   */
  env?: false | string;
  /**
   * Default TTL for all items in seconds.
   */
  ttl?: number;
  /**
   * How many keys to scan at once.
   *
   * [redis documentation](https://redis.io/docs/latest/commands/scan/#the-count-option)
   */
  scanCount?: number;
}
//#endregion
//#region src/drivers/vercel-runtime-cache.d.ts
interface VercelCacheOptions {
  /**
   * Optional prefix to use for all keys. Can be used for namespacing.
   */
  base?: string;
  /**
   * Default TTL for all items in seconds.
   */
  ttl?: number;
  /**
   * Default tags to apply to all cache entries.
   */
  tags?: string[];
}
//#endregion
//#region src/_drivers.d.ts
type BuiltinDriverName = "azure-app-configuration" | "azureAppConfiguration" | "azure-cosmos" | "azureCosmos" | "azure-key-vault" | "azureKeyVault" | "azure-storage-blob" | "azureStorageBlob" | "azure-storage-table" | "azureStorageTable" | "capacitor-preferences" | "capacitorPreferences" | "cloudflare-kv-binding" | "cloudflareKVBinding" | "cloudflare-kv-http" | "cloudflareKVHttp" | "cloudflare-r2-binding" | "cloudflareR2Binding" | "db0" | "deno-kv-node" | "denoKVNode" | "deno-kv" | "denoKV" | "fs-lite" | "fsLite" | "fs" | "github" | "http" | "indexedb" | "localstorage" | "lru-cache" | "lruCache" | "memory" | "mongodb" | "netlify-blobs" | "netlifyBlobs" | "null" | "overlay" | "planetscale" | "redis" | "s3" | "session-storage" | "sessionStorage" | "uploadthing" | "upstash" | "vercel-blob" | "vercelBlob" | "vercel-kv" | "vercelKV" | "vercel-runtime-cache" | "vercelRuntimeCache";
type BuiltinDriverOptions = {
  "azure-app-configuration": AzureAppConfigurationOptions;
  "azureAppConfiguration": AzureAppConfigurationOptions;
  "azure-cosmos": AzureCosmosOptions;
  "azureCosmos": AzureCosmosOptions;
  "azure-key-vault": AzureKeyVaultOptions;
  "azureKeyVault": AzureKeyVaultOptions;
  "azure-storage-blob": AzureStorageBlobOptions;
  "azureStorageBlob": AzureStorageBlobOptions;
  "azure-storage-table": AzureStorageTableOptions;
  "azureStorageTable": AzureStorageTableOptions;
  "capacitor-preferences": CapacitorPreferencesOptions;
  "capacitorPreferences": CapacitorPreferencesOptions;
  "cloudflare-kv-binding": KVOptions;
  "cloudflareKVBinding": KVOptions;
  "cloudflare-kv-http": KVHTTPOptions;
  "cloudflareKVHttp": KVHTTPOptions;
  "cloudflare-r2-binding": CloudflareR2Options;
  "cloudflareR2Binding": CloudflareR2Options;
  "db0": DB0DriverOptions;
  "deno-kv-node": DenoKvNodeOptions;
  "denoKVNode": DenoKvNodeOptions;
  "deno-kv": DenoKvOptions;
  "denoKV": DenoKvOptions;
  "fs-lite": FSStorageOptions$1;
  "fsLite": FSStorageOptions$1;
  "fs": FSStorageOptions;
  "github": GithubOptions;
  "http": HTTPOptions;
  "indexedb": IDBKeyvalOptions;
  "localstorage": LocalStorageOptions;
  "lru-cache": LRUDriverOptions;
  "lruCache": LRUDriverOptions;
  "mongodb": MongoDbOptions;
  "netlify-blobs": NetlifyStoreOptions;
  "netlifyBlobs": NetlifyStoreOptions;
  "overlay": OverlayStorageOptions;
  "planetscale": PlanetscaleDriverOptions;
  "redis": RedisOptions$1;
  "s3": S3DriverOptions;
  "session-storage": SessionStorageOptions;
  "sessionStorage": SessionStorageOptions;
  "uploadthing": UploadThingOptions;
  "upstash": UpstashOptions;
  "vercel-blob": VercelBlobOptions;
  "vercelBlob": VercelBlobOptions;
  "vercel-kv": VercelKVOptions;
  "vercelKV": VercelKVOptions;
  "vercel-runtime-cache": VercelCacheOptions;
  "vercelRuntimeCache": VercelCacheOptions;
};
declare const builtinDrivers: {
  readonly "azure-app-configuration": "unstorage/drivers/azure-app-configuration";
  readonly azureAppConfiguration: "unstorage/drivers/azure-app-configuration";
  readonly "azure-cosmos": "unstorage/drivers/azure-cosmos";
  readonly azureCosmos: "unstorage/drivers/azure-cosmos";
  readonly "azure-key-vault": "unstorage/drivers/azure-key-vault";
  readonly azureKeyVault: "unstorage/drivers/azure-key-vault";
  readonly "azure-storage-blob": "unstorage/drivers/azure-storage-blob";
  readonly azureStorageBlob: "unstorage/drivers/azure-storage-blob";
  readonly "azure-storage-table": "unstorage/drivers/azure-storage-table";
  readonly azureStorageTable: "unstorage/drivers/azure-storage-table";
  readonly "capacitor-preferences": "unstorage/drivers/capacitor-preferences";
  readonly capacitorPreferences: "unstorage/drivers/capacitor-preferences";
  readonly "cloudflare-kv-binding": "unstorage/drivers/cloudflare-kv-binding";
  readonly cloudflareKVBinding: "unstorage/drivers/cloudflare-kv-binding";
  readonly "cloudflare-kv-http": "unstorage/drivers/cloudflare-kv-http";
  readonly cloudflareKVHttp: "unstorage/drivers/cloudflare-kv-http";
  readonly "cloudflare-r2-binding": "unstorage/drivers/cloudflare-r2-binding";
  readonly cloudflareR2Binding: "unstorage/drivers/cloudflare-r2-binding";
  readonly db0: "unstorage/drivers/db0";
  readonly "deno-kv-node": "unstorage/drivers/deno-kv-node";
  readonly denoKVNode: "unstorage/drivers/deno-kv-node";
  readonly "deno-kv": "unstorage/drivers/deno-kv";
  readonly denoKV: "unstorage/drivers/deno-kv";
  readonly "fs-lite": "unstorage/drivers/fs-lite";
  readonly fsLite: "unstorage/drivers/fs-lite";
  readonly fs: "unstorage/drivers/fs";
  readonly github: "unstorage/drivers/github";
  readonly http: "unstorage/drivers/http";
  readonly indexedb: "unstorage/drivers/indexedb";
  readonly localstorage: "unstorage/drivers/localstorage";
  readonly "lru-cache": "unstorage/drivers/lru-cache";
  readonly lruCache: "unstorage/drivers/lru-cache";
  readonly memory: "unstorage/drivers/memory";
  readonly mongodb: "unstorage/drivers/mongodb";
  readonly "netlify-blobs": "unstorage/drivers/netlify-blobs";
  readonly netlifyBlobs: "unstorage/drivers/netlify-blobs";
  readonly null: "unstorage/drivers/null";
  readonly overlay: "unstorage/drivers/overlay";
  readonly planetscale: "unstorage/drivers/planetscale";
  readonly redis: "unstorage/drivers/redis";
  readonly s3: "unstorage/drivers/s3";
  readonly "session-storage": "unstorage/drivers/session-storage";
  readonly sessionStorage: "unstorage/drivers/session-storage";
  readonly uploadthing: "unstorage/drivers/uploadthing";
  readonly upstash: "unstorage/drivers/upstash";
  readonly "vercel-blob": "unstorage/drivers/vercel-blob";
  readonly vercelBlob: "unstorage/drivers/vercel-blob";
  readonly "vercel-kv": "unstorage/drivers/vercel-kv";
  readonly vercelKV: "unstorage/drivers/vercel-kv";
  readonly "vercel-runtime-cache": "unstorage/drivers/vercel-runtime-cache";
  readonly vercelRuntimeCache: "unstorage/drivers/vercel-runtime-cache";
};
//#endregion
export { type BuiltinDriverName, type BuiltinDriverOptions, CreateStorageOptions, Driver, DriverFlags, GetKeysOptions, Snapshot, Storage$1 as Storage, StorageMeta, StorageValue, TransactionOptions, Unwatch, WatchCallback, WatchEvent, builtinDrivers, createStorage, defineDriver, filterKeyByBase, filterKeyByDepth, joinKeys, normalizeBaseKey, normalizeKey, prefixStorage, restoreSnapshot, snapshot };