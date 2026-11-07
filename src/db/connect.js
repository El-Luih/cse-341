import { MongoClient } from 'mongodb';
import { setServers } from 'node:dns';

const configuredDnsServers = process.env.MONGODB_DNS_SERVERS;
if (configuredDnsServers) {
  setServers(configuredDnsServers.split(',').map((server) => {
    return server.trim();
  }).filter(Boolean));
}

let database;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  const client = new MongoClient(connectionString);
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME);
  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

export { connectToDb, getDb };