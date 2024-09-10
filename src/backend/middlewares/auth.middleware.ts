import { TRequest, TResponse } from "../types";
import { JwtHelper } from "../helpers";
import { User } from "../entities";

export class AuthMiddleware {

  constructor() {}

  public auth = async (req: TRequest, res: TResponse, next: () => void) => {
    if (req.headers && req.headers.authorization) {
      const tokenInfo: any = JwtHelper.decode(req.headers.authorization.toString().replace("Bearer ", ""));

      if (tokenInfo) {
        const user: any = await User.findOne({
          where: { id: tokenInfo.id },
        });
        if (user) {
          req.me = user;
          next();
        } else {
          res.status(401).json({ error: "Unauthorized", code: 401 });
        }
      } else {
        res.status(401).json({ error: "Unauthorized", code: 401 });
      }
    } else {
      res.status(401).json({ error: "Unauthorized", code: 401 });
    }
  };
}
