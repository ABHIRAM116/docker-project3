const API_URL = "http://13.204.62.76:5000";

async function loadTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();

    if (!title) {
        return;
    }

    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    input.value = "";
    loadTasks();
}

loadTasks();
