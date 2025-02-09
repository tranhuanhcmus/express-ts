import express, { Request, Response, NextFunction } from "express";
import DatabaseClient from "../prisma";

const router = express.Router();

/* GET home page. */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const users = await DatabaseClient.mysqlClient?.user.findMany();
    res.json(users);
});

export default router;
