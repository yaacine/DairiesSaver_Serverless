import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.DIARY_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  const newdairyId = event.pathParameters.dairyId

  const url = getUploadUrl(newdairyId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
 
  return undefined
}



function getUploadUrl(dairyId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: dairyId,
    Expires: urlExpiration
  })
}