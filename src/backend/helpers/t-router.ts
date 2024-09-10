import { Router } from "express";

export class TRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  protected initRoutes() {
    console.error("`initRoutes` is not implemented!");
  }
}
