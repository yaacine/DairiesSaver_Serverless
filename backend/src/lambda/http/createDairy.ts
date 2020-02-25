import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

//import { createDairyRequest } from '../../requests/createDairyRequest'


const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const dairyTable = process.env.DIARY_TABLE
const bucketName = process.env.DIARY_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const newTodo: createDairyRequest = JSON.parse(event.body)

  const newDairyId = uuid.v4()
  const newItem = await createDairy( newDairyId, event)
  const url = getUploadUrl(newDairyId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
  // TODO: Implement creating a new TODO item
  return undefined
}


async function createDairy(newtodoId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newDairy = JSON.parse(event.body)

  const newItem = {
    newtodoId,
    timestamp,
    ...newDairy,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${newtodoId}`
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: dairyTable,
      Item: newItem
    })
    .promise()

  return newItem
}



function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}