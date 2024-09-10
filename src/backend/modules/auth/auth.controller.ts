import { TRequest, TResponse } from "../../types";
import { User } from "../../entities";
import { JwtHelper, Bcrypt} from "../../helpers";
import { Constants } from "../../configs";
import { CreateUserDto, SignInDto } from "./dto";

export class AuthController {

  public create = async (req: TRequest<CreateUserDto>, res: TResponse) => {
    try {
      req.dto.password = await Bcrypt.hash(req.dto.password);
      const user = await User.create({
        firstName: req.dto.firstName,
        lastName: req.dto.lastName,
        email: req.dto.email,
        password: req.dto.password,
      });
      console.log(user.dataValues);
      const token = JwtHelper.encode({ id: user.dataValues.id });
      return res.status(200).json({ msg: "User created", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to create user" });
    }
  };

  public signIn = async (req: TRequest<SignInDto>, res: TResponse) => {
    try {
      const { email, password } = req.dto;

      const user = await User.findOne({
        where: { email },
        attributes: ["email", "id", "firstName", "lastName", "password"]
      });

      if (!user) {
        return res.status(400).json({ error: "Please verify email account!" });
      }

      const compare = await Bcrypt.verify(password, user.dataValues.password);

      if (!compare) {
        return res.status(400).json({ error: "Please check your password!" });
      }

      const token = JwtHelper.encode({ id: user.dataValues.id });
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "Sign-in failed" });
    }
  };
}
