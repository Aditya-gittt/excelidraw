import express from "express";
import { middleware } from "./middleware";
import { CreateUserSchema } from "@repo/common/types";
import {prismaClient} from "@repo/db/client";

const app = express();


app.post("/signup", (req,res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.status(300).json({
            message: "incorrect data"
        });
        return;
    }

    try{
        prismaClient.user.create({
            data: {
                email: data.data.email,
                password: data.data.password ,
                username: data.data.username
            }
        })

        res.json({
            message: "success"
        });
    } catch(err) {

        res.status(411).json({
            message: "pirsma cant add it in database"
        });
    }

} )

app.post("/signin" , (req, res) => {

})

app.post("/room", middleware, (req, res) =>{

})

app.listen(3001);

