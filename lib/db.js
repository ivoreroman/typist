const MongoClient = require('mongodb').MongoClient;

const url =
  'mongodb+srv://typist:typist@cluster0-y0cqx.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'typist';

let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

module.exports = {
  getDb,
};
