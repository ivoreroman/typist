const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

module.exports = {
  getDb,
};