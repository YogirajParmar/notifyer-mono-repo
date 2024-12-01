import { InjectCls, TRouter, Validator } from "../../helpers";
import { AuthMiddleware } from "../../middlewares";
import { CreateUserDto, SignInDto, ResetPasswordDto } from "./dto";
import { AuthController } from "./auth.controller";

export class AuthRouter extends TRouter {
  @InjectCls(AuthController)
  private authController: AuthController;

  @InjectCls(AuthMiddleware)
  private authMiddleware: AuthMiddleware;

  initRoutes(): void {
    this.router.post("/sign-up", Validator.validate(CreateUserDto), this.authController.create);
    this.router.post("/sign-in", Validator.validate(SignInDto), this.authController.signIn);
    this.router.put("/reset-password", Validator.validate(ResetPasswordDto), this.authController.resetPassword);
  }
}
