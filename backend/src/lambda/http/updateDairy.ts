import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateDairyRequest } from '../../requests/UpdateDairyRequest'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const dairyTable = process.env.DIARY_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  

  const dairyId = event.pathParameters.dairyId
  const updatedDairy: UpdateDairyRequest = JSON.parse(event.body)

  var params = {
    TableName:dairyTable,
    Key:{
        "dairyId": dairyId,
    },
    UpdateExpression: "set name = :r, dueDate=:p, done=:a",
    ExpressionAttributeValues:{
        ":r":updatedDairy.name,
        ":p":updatedDairy.dueDate,
        ":a":updatedDairy.done
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
