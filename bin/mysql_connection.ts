import mysql from "mysql2/promise"; 
import { ServerConfig } from ".";

const connectMysql = async (config: ServerConfig) => {
  const URL_CONNECTION: string = config.mysql_url;

  console.log(`Connecting to MySQL at ${URL_CONNECTION}`);

  try {
    const connection = await mysql.createConnection(URL_CONNECTION);
    console.log("Connected to the database as id " + connection.threadId);

    return connection; 
  } catch (err: any) {
    console.error("Error connecting to the database:", err.stack);
    throw err; 
  }
};

export default connectMysql;
