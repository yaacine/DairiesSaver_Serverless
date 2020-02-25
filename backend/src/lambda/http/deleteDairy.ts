import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const dairyTable = process.env.DIARY_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const dairyId = event.pathParameters.dairyId

  var params = {
    TableName: dairyTable,
    Key: {
      dairyId: dairyId
    },
    ConditionExpression: 'dairyId= :val',
    ExpressionAttributeValues: {
      ':val': dairyId
    }
  }

  console.log('Attempting a conditional delete...')
  docClient.delete(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to delete item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    } else {
      console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2))
    }
  })


  return undefined
}
