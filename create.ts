import uuid from "uuid";
import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler } from 'aws-lambda';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event, _context) => {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body)
    const params = {
      TableName: process.env.tableName,
      // 'Item' contains the attributes of the item to be created
      // - 'userId': user identities are federated through the
      //             Cognito Identity Pool, we will use the identity id
      //             as the user id of the authenticated user
      // - 'noteId': a unique uuid
      // - 'content': parsed from request body
      // - 'attachment': parsed from request body
      // - 'createdAt': current Unix timestamp
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: uuid.v1(),
        content: data.content,
        attachment: data.attachment,
        createdAt: Date.now()
      }
    }
    await dynamoDb.put(params).promise()
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
    // Return status code 200 and the newly created item
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    }
  } catch (e) {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
    // Return status code 500 on error
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ status: false })
    }

  }
}