// ./lambda_functions/pokemon.js

import {connectToDatabase} from './helpers';

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

  
//module.exports.handler = async (event, context) => {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
//    context.callbackWaitsForEmptyEventLoop = false;
  
//    const db = await connectToDatabase(MONGODB_URI);
//    return queryDatabase(db);
//};

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


export default function Main(event, context) {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;
  
    const db = await connectToDatabase(MONGODB_URI);
    const hash = event.headers['hash'] ? event.headers.hash : '';
    const limit = event.headers['limit'] ? event.headers.limit : 100 ;
    const collection = event.headers['collection'] ? event.headers.collection : '';
    const inputdata = event.headers['inputdata'] ? event.headers.inputdata : '';
  
    switch (event.httpMethod) {
      case "GET":
        return queryDatabase(db, hash, limit);
      case "POST":
        return pushToDatabase(db, JSON.parse(event.body), collection);
      case "PUT":
        return editDatabase(db, inputdata);
      default:
        return { statusCode: 400 };
    }
};