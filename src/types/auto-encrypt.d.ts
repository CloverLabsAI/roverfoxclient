declare module "@small-tech/auto-encrypt" {
  import { RequestListener } from "http";
  import { Server as HttpsServer } from "https";

  interface AutoEncryptOptions {
    domains: string[];
  }

  interface HttpsNamespace {
    createServer(
      options: AutoEncryptOptions,
      requestListener?: RequestListener,
    ): HttpsServer;
  }

  interface AutoEncrypt {
    https: HttpsNamespace;
  }

  const autoEncrypt: AutoEncrypt;
  export = autoEncrypt;
}
