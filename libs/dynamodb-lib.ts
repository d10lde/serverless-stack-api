import * as AWS from "aws-sdk";

// TODO: make parameter able to be used with all dynamodb Input types (Udemy Typescript course) 
// without extending the function definition all the time
export function call(action: string, params: AWS.DynamoDB.DocumentClient.PutItemInput | AWS.DynamoDB.DocumentClient.GetItemInput | AWS.DynamoDB.DocumentClient.QueryInput) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}