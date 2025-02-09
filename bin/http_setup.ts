import debug from "debug";
import { Server } from "http";
import { ServerConfig } from ".";

const debugLog = debug("express-ts:server");

function startServer(server: Server, config: ServerConfig): void {
    const { port } = config;

    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    server.on("error", (error) => onError(error, port));
    server.on("listening", () => onListening(server));
}

function onError(error: NodeJS.ErrnoException, port: number): void {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(server: Server): void {
    const addr = server.address() || "127.0.0.1";
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    debugLog(`Listening on ${bind}`);
}

export { startServer };
