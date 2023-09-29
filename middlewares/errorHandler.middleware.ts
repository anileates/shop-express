import { Request, Response, NextFunction } from "express";
import CustomError from "../helpers/customError";

const customErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        })
    }

    console.log(err)
  
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  };
  
export default customErrorHandler;