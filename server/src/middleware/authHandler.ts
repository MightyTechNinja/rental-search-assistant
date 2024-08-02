import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const authCheck: RequestHandler = (_req, res, next) => {
  const authorizationHeader = _req.headers["Authorization"];
  // if (!authorizationHeader || authorizationHeader !== `${API_TOKEN}`) {
  //   return res.status(401).json("Unauthorized");
  // }
  next();
};

export default authCheck;
