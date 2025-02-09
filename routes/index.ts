import { Express } from "express";
import userRouter from "./userRouter";

const routing = (app: Express) => {
    app.use("/user", userRouter);

    app.all("*", (req, res) => {
        res.status(404).send({ error: "Not Found" });
    });
};

export default routing;
