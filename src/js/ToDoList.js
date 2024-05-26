async function newTask() {
    const inputElement = document.getElementById('myInput');
    const title = inputElement.value.trim();

    if (!title) {
        alert('Please enter a task title!');
        return;
    }

    const task = {
        title: title
    };

    try {
        const response = await fetch(window._config.api.invokeUrl + '/todoItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const result = await response.json();
        addTaskToUI(result);

        inputElement.value = '';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the task.');
    }
}

function addTaskToUI(task) {
    const ulElement = document.getElementById('myUL');
    const liElement = document.createElement('li');
    const spanElement = document.createElement('span');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');

    spanElement.textContent = task.Title;
    liElement.appendChild(spanElement);

    deleteButton.textContent = 'Delete';
    deleteButton.className = 'close';
    deleteButton.addEventListener('click', async function () {
        try {
            const response = await fetch(`${window._config.api.invokeUrl}/todoItem/${task.ItemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            liElement.remove();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the task.');
        }
    });

    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.addEventListener('click', async function () {
        const newText = prompt('Edit task:', spanElement.textContent);
        if (newText !== null && newText.trim() !== '') {
            try {
                const response = await fetch(`${window._config.api.invokeUrl}/todoItem`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ todoId: task.ItemId, title: newText.trim() })
                });

                if (!response.ok) {
                    throw new Error('Failed to update task');
                }

                spanElement.textContent = newText.trim();
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the task.');
            }
        }
    });

    liElement.appendChild(deleteButton);
    liElement.appendChild(editButton);

    ulElement.appendChild(liElement);

    liElement.addEventListener('click', function () {
        liElement.classList.toggle('checked');
    });
}

async function getAllTodoItems() {
    try {
        const response = await fetch(window._config.api.invokeUrl + '/todoItems');
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const tasks = await response.json();
        tasks.forEach(addTaskToUI);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the tasks.');
    }
}

document.addEventListener('DOMContentLoaded', getAllTodoItems);
