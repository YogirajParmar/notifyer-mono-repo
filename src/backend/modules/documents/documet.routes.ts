import { DocumentController } from "./documents.controller";
import { InjectCls, TRouter } from "../../helpers";
import { AuthMiddleware } from "../../middlewares";
import { Validator } from "../../helpers";
import { CreatePUCDto } from "./dto";

export class DocumentRouter extends TRouter{
  @InjectCls(DocumentController)
  private documentController: DocumentController;

  @InjectCls(AuthMiddleware)
  private authMiddleware: AuthMiddleware;

  initRoutes(): void {
    this.router.get("/puc",this.authMiddleware.auth, this.documentController.getDocument);
    this.router.post("/puc",Validator.validate(CreatePUCDto), this.authMiddleware.auth, this.documentController.addDocument);
  }
}
