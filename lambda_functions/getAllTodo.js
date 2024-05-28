const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient();

const handler = async () => {
    try {
        const tasks = await getAllTasks();
        const result = tasks.map(item => ({
            Title: item.Title.S,
            ItemId: item.ItemId.S,
            IsComplete: item.IsComplete.BOOL,
            CreatedAt: item.CreatedAt.S
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message);
    }
};

async function getAllTasks() {
    const params = {
        TableName: 'todolist',
    };
    const command = new ScanCommand(params);
    const data = await ddbClient.send(command);
    return data.Items;
}

function errorResponse(errorMessage) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
}

module.exports = { handler };
