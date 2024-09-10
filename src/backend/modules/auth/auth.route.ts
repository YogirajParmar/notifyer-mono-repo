import { InjectCls, TRouter, Validator } from "../../helpers";
import { AuthMiddleware } from "../../middlewares";
import { CreateUserDto, SignInDto } from "./dto";
import { AuthController } from "./auth.controller";

export class AuthRouter extends TRouter {
  @InjectCls(AuthController)
  private userController: AuthController;

  @InjectCls(AuthMiddleware)
  private authMiddleware: AuthMiddleware;

  initRoutes(): void {
    this.router.post("/sign-up", Validator.validate(CreateUserDto), this.userController.create);
    this.router.post("/sign-in", Validator.validate(SignInDto), this.userController.signIn);
  }
}
