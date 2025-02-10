import express, { Express } from "express";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import routing from "./routes";

const app: Express = express();

// View engine setup
app.set("views", path.join(process.cwd(), "views")); // Use process.cwd() for compatibility
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public"))); // Use process.cwd() for compatibility

// Routing routes
routing(app);

export default app; // Use export default instead of module.exports
