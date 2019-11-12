import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { APIGatewayProxyHandler } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const data = JSON.parse(event.body)
    const params = {
      TableName: process.env.tableName,
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: uuid.v1(),
        content: data.content,
        attachment: data.attachment,
        createdAt: Date.now()
      }
    }
    await dynamoDbLib.call("put", params)
    return success(params.Item)
  } catch (e) {
    return failure({ status: false })

  }
}