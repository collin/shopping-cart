import { rest } from "msw";
import { setupServer } from "msw/node";
import request from "supertest";
import { app } from "./server/app";

// TODO: consider this a unit for testing
const server = setupServer(
  rest.all("/api/*", async (req, res, ctx) => {
    try {
      // TODO: Decide whether or not to determine if there is a request body before trying to use it
      const body = (await req.json().catch(() => null)) || {};

      // TODO: implement log level system
      // console.log(req.method, req.url.pathname + req.url.search, body);
      // @ts-expect-error request method downcased will be one of the valid request methods
      const result = await request(app)
        [req.method.toLowerCase()](req.url.pathname + req.url.search)
        .set(req.headers.all())
        .send(body);

      // TODO: implement log level system
      // console.log(result.status, result.headers, result.body);
      return res(
        ctx.status(result.status),
        ctx.set(result.headers),
        ctx.json(result.body),
      );
    } catch (error) {
      console.log("ERROR", error);
    }
  }),
);
server.listen({
  onUnhandledRequest: "bypass",
});

// Not calling server.close, because vitest appears to terminate the process
// between test runs, so manual cleanup is not necessary.
// (Collin feels 50% confident this is true)
// server.close()
