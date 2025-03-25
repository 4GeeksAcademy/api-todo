import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const API_URL = "https://playground.4geeks.com/todo/todos/yourusername";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    const updateTasksOnServer = (updatedTasks) => {
        fetch(API_URL, {
            method: "PUT",
            body: JSON.stringify(updatedTasks),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error updating tasks:", error));
    };

    const addTask = () => {
        if (inputValue.trim() === "") return;
        const updatedTasks = [...todos, { label: inputValue, done: false }];
        updateTasksOnServer(updatedTasks);
        setInputValue("");
    };

    const deleteTask = (index) => {
        const updatedTasks = todos.filter((_, i) => i !== index);
        updateTasksOnServer(updatedTasks);
    };

    const clearTasks = () => {
        updateTasksOnServer([]);
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
                {todos.map((item, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {item.label}
                        <Trash2
                            size={20}
                            color="red"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteTask(index)}
                        />
                    </li>
                ))}
            </ul>

            <div>{todos.length} tasks</div>

            {todos.length > 0 && (
                <button 
                    onClick={clearTasks} 
                    style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
                >
                    Delete All
                </button>
            )}
        </div>
    );
};

export default Home;
