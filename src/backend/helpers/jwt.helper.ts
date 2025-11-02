import jwt from "jsonwebtoken";
import { Constants } from "../configs";

export class JwtHelper {
  public static encode<T extends object>(data: T) {
    const secret = process.env.JWT_SECRET || "default-secret-key-for-development";
    return jwt.sign(data, `${secret}_${Constants.JWT_TOKEN_VERSION}`);
  }

  public static decode<ResT>(token: string) {
    if (token) {
      try {
        const secret = process.env.JWT_SECRET || "default-secret-key-for-development";
        return jwt.verify(token, `${secret}_${Constants.JWT_TOKEN_VERSION}`) as ResT;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  public static justDecode(token: string) {
    if (token) {
      try {
        return jwt.decode(token);
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
