import express from "express";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/index";

const app = express();
app.use(express.json());

app.post("/signup", async (req,res) => {

    const data = await CreateUserSchema.safeParse(req.body);
    if(!data.success){

        console.log(data);

        res.status(300).json({
            message: "incorrect data",
            data
        });
        return;
    }

    try{
        await prismaClient.user.create({
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

        console.log(err);
        res.status(411).json({
            message: "pirsma cant add it in database"
        });
    }

} )

app.post("/signin" , async (req, res) => {

    const payload = SigninSchema.safeParse(req.body);

    if(!payload.success){

        console.log(payload);

        res.status(300).json({
            message: "incorrect data"
        })
        return;
    }

    try{

        const found = await prismaClient.user.findFirst({
            where: {
                username: payload.data.username,
                password: payload.data.password
            }
        })

        if(!found){
            res.status(302).json({
                message: "user with thesedetails does not exists"
            });
            return;
        }

        const token = jwt.sign({
            username: found.username,
            id: found.id
        } , JWT_SECRET);

        res.json({
            token
        })

    } catch(err){

        console.log(err);

        res.status(301).json({
            message: "user cant be verified"
        })
    }
})

app.post("/room", middleware, async (req, res) =>{

    const parsedData = CreateRoomSchema.safeParse(req.body);

    if( ! parsedData.success ){

        console.log(parsedData);

        res.status(302).json({
             message: "body of request not complete"
        });
        return;
    }

    try{
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                //@ts-ignore    ---modify req later
                adminId: req.userId
            }
        });

        res.json({
            room    
        });

    } catch (err) {

        console.log(err);
        //@ts-ignore 
        console.log(req.userId);

        res.status(300).json({
            message: "error while created room"
        })
    }

})

app.listen(3001);

