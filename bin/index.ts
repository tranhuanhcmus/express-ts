import { startServer } from "./http_setup";
import app from "../app";
import http, { Server } from "http";
import dotenv from 'dotenv';
import connectMysql from "./mysql_connection";
import { connectMongoDB } from "./mongodb_connection";

dotenv.config();

export interface ServerConfig {
  port: number;
  mysql_url: string,
  mongodb_url: string,
}

const CONFIG: ServerConfig = {
  port: normalizePort(process.env.PORT),
  mysql_url:  process.env.MYSQL_URL || "mysql_url",
  mongodb_url:  process.env.MONGODB_URL || "mongodb_url",
};

app.set("port", CONFIG.port);

const server: Server = http.createServer(app);

startApp()

async function startApp(){
  await connectMysql(CONFIG)
  await connectMongoDB(CONFIG)
  startServer(server, CONFIG);
}

function normalizePort(val?: string): number {
  const DEFAULT_PORT = 3000;

  if (val === undefined) {
    return DEFAULT_PORT;
  }

  const port = parseInt(val, 10);

  return !isNaN(port) && port >= 0 ? port : DEFAULT_PORT;
}