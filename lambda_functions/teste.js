// ./lambda_functions/what_is_the_time.js

// This `handler` is what is called when your Lambda
// function is triggered. For more full specs on it see
// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
module.exports.handler = async (event, context) => {
   
   //const MONGODB_URI = process.env.MONGODB_URI;
   const MONGODB_URI = '';
   return {
     statusCode: 200,
     body: `MONGODB_URI is ${MONGODB_URI}`,
   };
 };