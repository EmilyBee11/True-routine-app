import { useState } from "react";
import TaskItem from "./TaskItem";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Morning routine", time: "8:00 AM", done: false },
    { id: 2, name: "Study block", time: "10:00 AM", done: false },
  ]);

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Routine</h1>

      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
