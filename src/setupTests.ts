import { app } from "./server/app";
import { rest } from "msw";
import { setupServer } from "msw/node";
import request from "supertest";

const server = setupServer(
  rest.all("/api/*", async (req, res, ctx) => {
    try {
      // TODO: Decide whether or not to determine if there is a request body before trying to use it
      const body = (await req.json().catch(() => null)) || {};

      // @ts-expect-error request method downcased will be one of the valid request methods
      const result = await request(app)
        [req.method.toLowerCase()](req.url.pathname + req.url.search)
        .set(req.headers.all())
        .send(body);

      return res(ctx.json(result.body));
    } catch (error) {
      console.log("ERROR", error);
    }
  }),
);

server.listen();

// Not calling server.close, because vitest appears to terminate the process
// between test runs, so manual cleanup is not necessary.
// (Collin feels 50% confident this is true)
// server.close()
