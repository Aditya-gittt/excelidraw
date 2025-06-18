import { JWT_SECRET } from "@repo/backend-common/index";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware (req: Request, res:Response, next:NextFunction) {
    const token = req.headers["authorization"]!;

    console.log(token)

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded);

    if(decoded){
        //@ts-ignore handle both later
        req.userId = decoded.id;
        next();
    } else{
        res.status(403).json({
            message: "unauthorized"
        })

        return;
    }
}