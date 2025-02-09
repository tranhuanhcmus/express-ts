import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { ServerConfig } from '.';

dotenv.config();

let mongoClient: MongoClient;

const connectMongoDB = async (config: ServerConfig) => {
  const URL_CONNECTION: string = config.mongodb_url

  console.log(`Connecting to MongoDB at ${URL_CONNECTION}`);

  try {
    mongoClient = new MongoClient(URL_CONNECTION);
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    return mongoClient;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Re-throw the error
  }
};

export { connectMongoDB, mongoClient };