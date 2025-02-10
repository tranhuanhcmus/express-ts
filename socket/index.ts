import { RedisClientSingleton } from "../redis";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

export class SocketService {
    private static instance: SocketService;
    private io!: SocketIOServer;

    private constructor() {} // Private constructor to enforce singleton pattern

    /**
     * Initializes the Socket.IO server
     * @param server - The HTTP server instance
     */
    public static init(server: HttpServer): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
            SocketService.instance.io = new SocketIOServer(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                },
            });

            SocketService.instance.setupListeners();
        }
        return SocketService.instance;
    }

    /**
     * Sets up event listeners for WebSocket connections
     */
    private setupListeners(): void {
        this.io.on("connection", async (socket: Socket) => {
            console.log("A user connected:", socket.id);

            // Handle room registration
            socket.on("registerSocket", async (commanduuid: string) => {
                if (!commanduuid) return;

                socket.join(commanduuid);
                let redis = await RedisClientSingleton.getInstance();
                let redis_data = await redis.redisClient.get("test");

                let processId = process.pid;
                let room = `${processId}`;

                console.log(`Socket joined room: ${room}`);

                this.io.to(commanduuid).emit("message", {
                    id: commanduuid,
                    text: "connect success",
                    index: -1,
                    redis_data,
                    room,
                });
            });

            // Handle message broadcasting
            socket.on("pushWebsocket", (jsonData: { id: string; [key: string]: any }) => {
                if (!jsonData.id) return;

                this.io.to(jsonData.id).emit("message", jsonData);
            });

            // Handle disconnection
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    /**
     * Returns the Socket.IO server instance
     */
    public getIO(): SocketIOServer {
        return this.io;
    }
}
