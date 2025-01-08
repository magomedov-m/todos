import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import "./App.css"; // Импортируйте ваш CSS файл

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");

    if (error) {
      console.log("error fetching:", error);
    } else {
      setTodoList(data);
    }
  };

  const completed = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("error update:", error);
    } else {
      const update = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(update);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

    if (error) {
      console.log("error, adding todo:", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error delete:", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="новая задача..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="add-button" onClick={addTodo}>
          Добавить задачу
        </button>
      </div>

      <ul className="todo-list">
        {todoList.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.isCompleted ? "completed" : ""}`}
          >
            <p
              className={`todo-checkbox ${todo.isCompleted ? "completed" : ""}`}
            >
              <div className="container_text">{todo.name}</div>
            </p>
            <div className="container_btn">
              <button
                className="add-button btn"
                onClick={() => completed(todo.id, todo.isCompleted)}
              >
                {todo.isCompleted ? "Выполнено" : "Выполнить"}
              </button>
              <button
                className="delete-button btn"
                onClick={() => deleteTask(todo.id)}
              >
                Удалить задачу
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
