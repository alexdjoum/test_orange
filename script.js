document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Fetch existing tasks from the API
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                if (task.userId === 1) {  // Filter to limit the number of tasks for simplicity
                    addTaskToDOM(task.id, task.title, task.completed ? 'Completed' : 'Pending', 'N/A');
                }
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));

    // Add task to the DOM
    function addTaskToDOM(id, name, description, date) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-id', id);

        taskCard.innerHTML = `
            <h3>${name}</h3>
            <p>${description}</p>
            <p class="task-date">Date limite : ${date}</p>
            <button class="delete-task">Supprimer</button>
        `;

        taskList.appendChild(taskCard);
    }

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDate = document.getElementById('task-date').value;

        // Send new task to the API
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: taskName,
                completed: false,
                userId: 1
            })
        })
        .then(response => response.json())
        .then(task => {
            // Add the new task to the DOM
            addTaskToDOM(task.id, task.title, taskDesc, taskDate);
        })
        .catch(error => console.error('Error adding task:', error));

        // Clear form fields
        taskForm.reset();
    });

    // Handle task deletion
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-task')) {
            const taskCard = e.target.parentElement;
            const taskId = taskCard.getAttribute('data-id');

            // Send delete request to the API
            fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Remove task from the DOM
                    taskList.removeChild(taskCard);
                } else {
                    console.error('Error deleting task:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting task:', error));
        }
    });
});
