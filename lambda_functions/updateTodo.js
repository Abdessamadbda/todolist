const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient();

const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

    let todoId, title;

    try {
        const requestBody = JSON.parse(event.body);
        todoId = requestBody.todoId;
        title = requestBody.title;

        if (!todoId || !title) {
            throw new Error("todoId and title are required");
        }

        await updateTaskStatus(todoId, title);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Task with id ${todoId} updated successfully`,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const updateTaskStatus = async (todoId, title) => {
    const params = {
        TableName: 'todolist',
        Key: {
            ItemId: { S: todoId.toString() },
        },
        UpdateExpression: 'SET #Title = :title',
        ExpressionAttributeNames: {
            '#Title': 'Title',  // Ensuring that the correct attribute name is used
        },
        ExpressionAttributeValues: {
            ':title': { S: title },
        },
        ReturnValues: 'UPDATED_NEW',
    };
    const command = new UpdateItemCommand(params);
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        },
    };
};

module.exports = { handler };
