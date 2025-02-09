import { PrismaClient as MySQLClient } from "./generated/mysql-client";
import { PrismaClient as MongoDBClient } from "./generated/mongodb-client"; // Adjust based on your generated client names

class DatabaseClient {
    public static mysqlClient: MySQLClient | null = null;
    public static mongoClient: MongoDBClient | null = null;

    private constructor() {}

    public static init() {
        console.log("Initializing Global Database Client...");
        console.log("Database Client now can access with DatabaseClient.{client}");
        console.log("----------------------------------------------------------------");

        if (!this.mysqlClient) {
            try {
                this.mysqlClient = new MySQLClient();
            } catch (error) {
                console.error("Error initializing MySQLClient:", error);
                throw error;
            }
        }

        if (!this.mongoClient) {
            try {
                this.mongoClient = new MongoDBClient();
            } catch (error) {
                console.error("Error initializing MongoDBClient:", error);
                throw error;
            }
        }
    }

    public static async disconnect() {
        try {
            if (this.mysqlClient) {
                await this.mysqlClient.$disconnect();
                this.mysqlClient = null;
            }
            if (this.mongoClient) {
                await this.mongoClient.$disconnect();
                this.mongoClient = null;
            }
        } catch (error) {
            console.error("Error disconnecting database clients:", error);
        }
    }
}

export default DatabaseClient;
