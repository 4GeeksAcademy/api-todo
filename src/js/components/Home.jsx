import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const API_URL = "https://playground.4geeks.com/todo/users/pedro";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const httpRequest = async (method, url, body = null) => {
        try {
            const options = {
                method,
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : null,
            };
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
        }
    };

    const updateTasksOnServer = async (tasks) => {
        const payload = {
            name: "pedro",
            todos: tasks,
        };

        try {
            await httpRequest("PUT", API_URL, payload);
            setTodos(tasks);
        } catch (error) {
            console.error("Error al actualizar tareas:", error);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await httpRequest("GET", API_URL);
                setTodos(data.todos || []);
            } catch (error) {
                console.error("Error al obtener tareas:", error);
            }
        };
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (inputValue.trim() === "") return;
        const newTask = { label: inputValue, done: false };
        const updatedTasks = [...todos, newTask];
        await updateTasksOnServer(updatedTasks);
        setInputValue("");
    };

    const deleteTask = async (index) => {
        const updatedTasks = todos.filter((_, i) => i !== index);
        await updateTasksOnServer(updatedTasks);
    };

    const clearTasks = async () => {
        await updateTasksOnServer([]);
    };

    return (
        <div className="container">
            <h1>Todos</h1>
            <ul>
                <li>
                    <input
                        type="text"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTask();
                        }}
                        placeholder="What do you need to do?"
                    />
                </li>
                {todos.length > 0 ? (
                    todos.map((item, index) => (
                        <li key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {item.label}
                            <Trash2
                                size={20}
                                color="red"
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteTask(index)}
                            />
                        </li>
                    ))
                ) : (
                    <li>No tasks available</li>
                )}
            </ul>
            <div>{todos.length} tasks</div>
            {todos.length > 0 && (
                <button onClick={clearTasks} style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}>
                    Delete All
                </button>
            )}
        </div>
    );
};

export default Home;
