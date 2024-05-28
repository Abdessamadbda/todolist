const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient();

exports.handler = async (event) => {
    let itemId;

    try {
        console.log(event, " xxxxxxxxxxxxxxxx ");

        // Extract itemId from path parameters
        itemId = event.pathParameters.id;

        // Check if itemId is defined after extraction
        if (!itemId) {
            throw new Error("itemId is required");
        }

        await deleteTaskById(itemId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Task with id ${itemId} deleted successfully`,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const deleteTaskById = async (itemId) => {
    const params = {
        TableName: 'todolist',
        Key: {
            ItemId: { S: itemId.toString() },
        },
    };
    const command = new DeleteItemCommand(params);
    await ddbClient.send(command);
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    };
};
