
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'formboiz';
let cachedDb = null;

export const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};