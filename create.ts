import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { APIGatewayProxyHandler } from 'aws-lambda';

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
    await dynamoDbLib.call("put", params)
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    return success(params.Item)
  } catch (e) {
    return failure({ status: false })

  }
}