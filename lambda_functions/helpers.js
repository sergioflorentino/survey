
const MongoClient = require("mongodb").MongoClient;
//const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'formboiz';
let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const queryDatabase = async (db , hash, limit) => {

   // se não enviar hash  retorna todos os registros
 
   const surveys = await db.collection("surveys").find( hash?{hash}:'').limit( parseInt(limit) ).toArray();
 
   return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveys),
    };
 };
 
   
 const pushToDatabase = async (db, data, collection) => {
 
     if (collection == "surveys") {
       const collect = {
             content: data.questions,
             hash: data.hash,
           };
     }
     else if (collection == "responses") {
       const collect = {
             content: data.responses,
             hash: data.hash,
           };    
         }
 
   
     if (collect.content && collect.hash) {
       await db.collection(collection).insertMany([data]);
       return { statusCode: 201 };
     } else {
       return { statusCode: 422 };
     }
 };
   
 const editDatabase = async (db, param) => {
 
    if (param.updated) {
      await db.collection("surveys").updateOne(
        { hash: param.hash },
        { $set: { "questions.$" : param.questions } }
     )
      return { statusCode: 201 };
    } else {
      return { statusCode: 422 };
    }
 };

exports.connectToDatabase = connectToDatabase;
exports.queryDatabase = queryDatabase;
exports.pushToDatabase = pushToDatabase;
exports.editDatabase = editDatabase;
