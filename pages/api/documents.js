const {getDb} = require('../../lib/db');

export default async (req, res) => {
  if (req.method === 'POST') {
    //receive text y save to db
    const id = '123-3922';
    // find that
    // append to the text property
    const db = await getDb();
    const collection = db.collection('documents');
    const foundDocument = await collection.updateOne({id}, [
      {$set: {text: {$concat: ['$text', req.body.text]}}},
    ]);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        foundDocument,
      }),
    );
  }

  if (req.method === 'GET') {
    //retrieve a single doc all the doc
    //return that file
    const db = await getDb();
    const collection = db.collection('documents');
    const foundDocument = await collection.findOne({id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({foundDocument}));
  }
};
