import { Router } from "express";
import { DocumentRouter } from "./modules/documents/documet.routes";
import { AuthRouter } from "./modules/auth/auth.route";
export default class Routes {
  public configure() {
    const router = Router();
    router.use("/auth", new AuthRouter().router);
    router.use("/docs", new DocumentRouter().router)
    router.all("/*", (req, res) =>
      res.status(404).json({
        error: ("ERR_URL_NOT_FOUND"),
      }),
    );
    return router;
  }
}
