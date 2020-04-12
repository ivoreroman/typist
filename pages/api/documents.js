const {getDb} = require('../../lib/db');

export default async (req, res) => {
  if (req.method === 'POST') {
    //receive text y save to db
    const id = '123-3922';
    // find that
    // append to the text property
    const theBody = JSON.parse(req.body);
    const updated = '' + theBody.text + '\n';
    console.log(typeof text);
    const db = await getDb();
    const collection = db.collection('documents');
    const foundDocument = await collection.update({id}, [
      {$set: {text: {$concat: ['$text', updated]}}},
    ]);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        modified: foundDocument.modified,
      }),
    );
  }

  if (req.method === 'GET') {
    //retrieve a single doc all the doc
    //return that file
    const db = await getDb();
    const id = '123-3922';
    const collection = db.collection('documents');
    const foundDocument = await collection.findOne({id});
    console.log(foundDocument);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({foundDocument}));
  }
};
