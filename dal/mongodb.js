const { MongoClient, ServerApiVersion } = require('mongodb');
const user = process.env.DB_USER;
const password = process.env.DB_PASS;

let dbObject = {
  db: null,
  hasDbError: false,
  error: null
}

let uri = `mongodb+srv://${user}:${password}@cluster0.dcpop.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  if (err) {
    console.log(err);
    dbObject.error = err
    dbObject.dbError = true
  } else {
    dbObject.db = client.db('test');
  }
})

module.exports = dbObject