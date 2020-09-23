import { createServer } from "http";
import getApp from "./app";
import { log } from "../../src";
import reinit from "./reinit";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// CSP-Header to pretect xss-attacks
// TODO: for inline script (and style) add a nonce to script-tag and script-src (or style-tag/style-src)
const CSPHeader = { 
  'Content-Security-Policy': `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self' https://fonts.googleapis.com; frame-src 'self'; frame-ancestors 'none'; report-uri 'self'; require-trusted-types-for 'script';`
}

const contentSecurityPolicyConfig = {
  rest: {
    drafts: CSPHeader,
    published: CSPHeader
  }
}

let appP = getApp({responseHeaders: contentSecurityPolicyConfig});

createServer(async (req, res) => {
  try {
    if (
      process.env.NODE_ENV === "test" &&
      req.method === "POST" &&
      req.url === "/admin/__reinit"
    ) {
      appP = reinit(req, appP).then(getApp);
      res.statusCode = 204;
      res.end();
    } else {
      (await appP).app(req, res);
    }
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}).listen(port, () => log.info(`Server ready at http://localhost:${port}`));
