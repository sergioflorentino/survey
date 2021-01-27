// ./lambda_functions/pokemon.js

const functions = require('./helpers');

module.exports.handler = async function (event, context) {
    // otherwise the connection will never complete, since
    // we keep the DB connection alive
    context.callbackWaitsForEmptyEventLoop = false;
    const MONGODB_URI = process.env.MONGODB_URI;
      
    const db = await functions.connectToDatabase(MONGODB_URI);
    const hash = event.headers['hash'] ? event.headers.hash : '';
    const limit = event.headers['limit'] ? event.headers.limit : 100 ;
    const collection = event.headers['collection'] ? event.headers.collection : '';
    const inputdata = event.headers['inputdata'] ? event.headers.inputdata : '';
  
    switch (event.httpMethod) {
      case "GET":
        return functions.queryDatabase(db, hash, limit);
      case "POST":
        return functions.pushToDatabase(db, JSON.parse(event.body), collection);
      case "PUT":
        return functions.editDatabase(db, inputdata);
      default:
        return { statusCode: 400 };
    }
};

