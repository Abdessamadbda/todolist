const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { randomUUID } = require('crypto');

const ddbClient = new DynamoDBClient();

const handler = async (event) => {
    let itemId;
    let title;

    try {
        itemId = generateNumericUUID();
        console.log('Received event (', itemId.toString(), '): ', event);

        // Parse the event body to extract the title
        const requestBody = JSON.parse(event.body);
        title = requestBody.title;

        if (!title) {
            throw new Error("Title is required");
        }

        await recordTodo(itemId, title, false);

        return {
            statusCode: 201,
            body: JSON.stringify({
                ItemId: itemId.toString(),
                Title: title,
                CreatedAt: new Date().toISOString(),
                IsComplete: false,  
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const recordTodo = async (itemId, title, isComplete) => {
    const params = {
        TableName: 'todolist',
        Item: {
            ItemId: { S: itemId.toString() },
            Title: { S: title },
            CreatedAt: { S: new Date().toISOString() },
            IsComplete: { BOOL: isComplete },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
};

const generateNumericUUID = () => {
    const uuid = randomUUID().replace(/-/g, '');
    const numericUuid = parseInt(uuid.slice(0, 12), 16);
    return numericUuid;
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
        },
    };
};

module.exports = { handler };
