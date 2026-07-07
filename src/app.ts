import express, { Application, Request, Response } from "express";
import cors from 'cors';
import config from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello,  world")
})

app.use("/api/auth", authRouter)

app.use(notFound)
app.use(globalErrorHandler)

export default app;