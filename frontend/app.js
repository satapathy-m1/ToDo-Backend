// app.js

// Add a todo
async function addTodo() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;

    // Get the JWT token from localStorage (after user login)
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add a todo');
        return;
    }

    const response = await fetch('http://localhost:4000/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            title,
            description,
            status: false,  // New todos will be created as not completed
            user: localStorage.getItem('userId'),  // Assuming you store the user's ID upon login
        }),
    });

    const result = await response.json();
    if (response.status === 201) {
        alert(result.message);
        fetchTodos();  // Refresh the list after adding a new todo
    } else {
        alert('Error adding todo: ' + result.error);
    }
}

// Fetch all todos
async function fetchTodos() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to view todos');
        return;
    }

    const response = await fetch('http://localhost:5000/api/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear current list

    if (result.todos && result.todos.length > 0) {
        result.todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${todo.title} - ${todo.completed ? 'Completed' : 'Pending'}</span>
                <button onclick="deleteTodo('${todo._id}')">Delete</button>
                <button onclick="updateTodoStatus('${todo._id}')">${todo.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
            `;
            todoList.appendChild(li);
        });
    } else {
        todoList.innerHTML = '<li>No todos available.</li>';
    }
}

// Update the completion status of a todo
async function updateTodoStatus(todoId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to update todos');
        return;
    }

    const response = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            status: true,  // Change the status to completed
        }),
    });

    const result = await response.json();
    if (response.status === 200) {
        alert(result.message);
        fetchTodos();  // Refresh the list after updating the todo
    } else {
        alert('Error updating todo: ' + result.error);
    }
}

// Delete a todo
async function deleteTodo(todoId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to delete todos');
        return;
    }

    const response = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (response.status === 200) {
        alert(result.message);
        fetchTodos();  // Refresh the list after deleting the todo
    } else {
        alert('Error deleting todo: ' + result.error);
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    document.getElementById('user-name').innerText = 'Welcome, Guest!';
    document.getElementById('logout-btn').style.display = 'none';
    alert('Logged out successfully');
}

// Handle login
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.status === 200) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user._id);
        document.getElementById('user-name').innerText = `Welcome, ${result.user.firstName}!`;
        document.getElementById('logout-btn').style.display = 'inline-block';
        alert('Login successful');
        fetchTodos();  // Fetch todos after successful login
    } else {
        alert('Login failed: ' + result.message);
    }
}

// Check if the user is logged in when the page loads
window.onload = () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Fetch and display todos if the user is logged in
        fetchTodos();
    }
};

// Add event listener for adding a todo
document.getElementById('add-todo-btn').addEventListener('click', addTodo);

// Add event listener for logout button
document.getElementById('logout-btn').addEventListener('click', logout);
