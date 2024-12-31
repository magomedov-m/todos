import { useEffect, useState } from 'react'
import supabase from './supabase-client';


function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodo()
  }, [])

  const fetchTodo = async () => {
    const {data, error} = await supabase.from('todo').select('*');

    if (error) {
      console.log('error fetching:', error)
    } else {
      setTodoList(data)
    }
  }

  const completed = async (id, isCompleted) => {
    const {data, error} = await supabase.from('todo').update({isCompleted: !isCompleted}).eq('id', id)

    if (error) {
      console.log('error update:', error)
    } else {
      const update = todoList.map((todo) => todo.id === id ? {...todo, isCompleted: !isCompleted} : todo)
      setTodoList(update)
    }
  }

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    }
    const {data, error} = await supabase.from('todo').insert([newTodoData]).single()

    if (error) {
      console.log('error, adding todo:', error)
    } else {
      setTodoList((prev) => [...prev, data])
      setNewTodo('')
    }
  }

  const deleteTask = async (id) => {
    const {data, error} = await supabase.from('todo').delete().eq('id', id)

    if (error) {
      console.log('error delete:', error)
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id))
    }
  }

  return (
    <>
      <h1>todo list</h1>
      <div>
        <input type='text' placeholder='новая задача...' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button onClick={addTodo}>Добавить задачу</button>
      </div>

      <ul>
        {
          todoList.map((todo) => (
            <li key={todo.id}>
              <p>{todo.name}</p>
              <button onClick={() => completed(todo.id, todo.isCompleted)}>{todo.isCompleted ? 'Выполнено' : 'Выполнить'}</button>
              <button onClick={() => deleteTask(todo.id)}>Удалить задачу</button>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default App
