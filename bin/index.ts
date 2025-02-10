import { startServer } from "./http_setup";
import app from "../app";
import http, { Server } from "http";
import dotenv from "dotenv";
import DatabaseClient from "../prisma";
import { initRedis } from "../redis";
import { SocketService } from "../socket";

dotenv.config();

export interface ServerConfig {
    port: number;
}

const CONFIG: ServerConfig = {
    port: normalizePort(process.env.PORT),
};

app.set("port", CONFIG.port);

const server: Server = http.createServer(app);

startApp();

async function startApp() {
    // Initialize database connections
    DatabaseClient.init();
    await initRedis(app); // ✅ Initialize Redis first
    await SocketService.init(server);
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
