import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const mongoUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


async function useMongo(req, res, next) {
  try {
    if (!client.isConnected()) await client.connect();
    req.dbClient = client;
    req.db = client.db(dbName);
  } catch (e) {
    console.log('error connecting ->');
    console.log(e);
  }

  return next();
}

const middleware = nextConnect();

middleware.use(useMongo);

export default middleware;
