import TaskItem from "./TaskItem";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [newTaskName, setNewTaskName] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, name: "Morning routine", time: "8:00 AM", done: false },
    { id: 2, name: "Study block", time: "10:00 AM", done: false },
    { id: 3, name: "Workout", time: "4:00 PM", done: false },
  ]);

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  function addTask() {
    if (!newTaskName.trim()) return;

    const newTask = {
      id: Date.now(),
      name: newTaskName,
      time: "New",
      done: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setNewTaskName("");
  }

  const completedCount = tasks.filter((task) => task.done).length;
  const remainingCount = tasks.length - completedCount;
  const progressPercent =
    Math.round((completedCount / tasks.length) * 100) || 0;

  function renderMainContent() {
    if (activeTab === "Home") {
      return (
        <>
          <div style={welcomeCard}>
            <div>
              <p style={welcomeLabel}>Today’s focus</p>
              <h3 style={welcomeTitle}>Stay consistent</h3>
              <p style={welcomeText}>
                Little wins every day build strong routines.
              </p>
            </div>
          </div>

          <div style={statsRow}>
            <div style={statCard}>
              <p style={statLabel}>Completed</p>
              <h3 style={statValue}>{completedCount}</h3>
            </div>
            <div style={statCard}>
              <p style={statLabel}>Remaining</p>
              <h3 style={statValue}>{remainingCount}</h3>
            </div>
            <div style={statCard}>
              <p style={statLabel}>Progress</p>
              <h3 style={statValue}>{progressPercent}%</h3>
            </div>
          </div>

          <div style={sectionCard}>
            <div style={sectionHeader}>
              <div>
                <p style={sectionLabel}>Daily progress</p>
                <h3 style={sectionTitle}>
                  {completedCount} of {tasks.length} tasks done
                </h3>
              </div>
              <div style={progressCircle}>{progressPercent}%</div>
            </div>

            <div style={progressBarBg}>
              <div
                style={{
                  ...progressBarFill,
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>

          <div style={sectionCard}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Add task</h3>
            <div style={inputRow}>
              <input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter a new task"
                style={inputStyle}
              />
              <button onClick={addTask} style={primaryButton}>
                Add
              </button>
            </div>
          </div>

          <div>
            <div style={listHeader}>
              <h3 style={{ margin: 0 }}>Today</h3>
              <span style={smallMuted}>{tasks.length} tasks</span>
            </div>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              >
                <div onClick={() => toggleTask(task.id)} style={taskLeft}>
                  <div
                    style={{
                      ...checkCircle,
                      background: task.done ? "#22c55e" : "#e5e7eb",
                      boxShadow: task.done
                        ? "0 6px 14px rgba(34,197,94,0.25)"
                        : "none",
                    }}
                  >
                    {task.done ? "✓" : ""}
                  </div>

                  <div>
                    <div
                      style={{
                        ...taskName,
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                    >
                      {task.name}
                    </div>
                    <div style={taskTime}>{task.time}</div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={deleteButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (activeTab === "Plan") {
      return (
        <div style={sectionCard}>
          <h3 style={{ marginTop: 0 }}>Plan</h3>
          <div style={miniCard}>8:00 AM — Morning routine</div>
          <div style={miniCard}>10:00 AM — Study block</div>
          <div style={miniCard}>4:00 PM — Workout</div>
        </div>
      );
    }

    if (activeTab === "Progress") {
      return (
        <div style={sectionCard}>
          <h3 style={{ marginTop: 0 }}>Progress</h3>
          <div style={miniCard}>Completed: {completedCount}</div>
          <div style={miniCard}>Remaining: {remainingCount}</div>
          <div style={miniCard}>Completion: {progressPercent}%</div>
        </div>
      );
    }

    return (
      <div style={sectionCard}>
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        <div style={miniCard}>Name: Emily</div>
        <div style={miniCard}>Goal: Better routines</div>
        <div style={miniCard}>Theme: Soft purple</div>
      </div>
    );
  }

  return (
    <div style={outerStyle}>
      <div style={phoneShell}>
        <div style={notch} />

        <div style={headerRow}>
          <div>
            <p style={greeting}>Good morning</p>
            <h1 style={nameStyle}>Emily</h1>
          </div>

          <div style={avatarStyle}>E</div>
        </div>

        <div style={heroCard}>
          <p style={heroLabel}>Current tab</p>
          <h2 style={heroTitle}>{activeTab}</h2>
          <p style={heroText}>
            {activeTab === "Home" && "Keep your day clear and simple."}
            {activeTab === "Plan" && "Organize what matters first."}
            {activeTab === "Progress" && "Watch your consistency grow."}
            {activeTab === "Profile" && "Your space and settings."}
          </p>
        </div>

        <div style={contentArea}>{renderMainContent()}</div>

        <div style={navBar}>
          {["Home", "Plan", "Progress", "Profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...navButton,
                background: activeTab === tab ? "#4f46e5" : "transparent",
                color: activeTab === tab ? "white" : "#64748b",
                boxShadow:
                  activeTab === tab
                    ? "0 10px 20px rgba(79,70,229,0.22)"
                    : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const outerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #e0e7ff 0%, #f5f7ff 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  fontFamily: "Arial, sans-serif",
};

const phoneShell = {
  width: 360,
  minHeight: 740,
  background: "#ffffff",
  borderRadius: 36,
  padding: 18,
  boxShadow: "0 30px 70px rgba(37, 45, 85, 0.18)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  boxSizing: "border-box",
};

const notch = {
  width: 110,
  height: 24,
  background: "#111827",
  borderRadius: 20,
  alignSelf: "center",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const greeting = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const nameStyle = {
  margin: "6px 0 0 0",
  fontSize: 30,
};

const avatarStyle = {
  width: 46,
  height: 46,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: 18,
};

const heroCard = {
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  borderRadius: 26,
  padding: 20,
};

const heroLabel = {
  margin: 0,
  opacity: 0.85,
  fontSize: 13,
};

const heroTitle = {
  margin: "8px 0",
  fontSize: 28,
};

const heroText = {
  margin: 0,
  opacity: 0.92,
  lineHeight: 1.4,
};

const contentArea = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const welcomeCard = {
  background: "linear-gradient(135deg, #ede9fe, #eef2ff)",
  borderRadius: 22,
  padding: 16,
};

const welcomeLabel = {
  margin: 0,
  fontSize: 13,
  color: "#6b7280",
};

const welcomeTitle = {
  margin: "8px 0 6px 0",
  fontSize: 22,
};

const welcomeText = {
  margin: 0,
  color: "#4b5563",
  lineHeight: 1.4,
};

const statsRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 10,
};

const statCard = {
  background: "#f8faff",
  borderRadius: 18,
  padding: 14,
  textAlign: "center",
};

const statLabel = {
  margin: 0,
  fontSize: 12,
  color: "#6b7280",
};

const statValue = {
  margin: "8px 0 0 0",
  fontSize: 20,
};

const sectionCard = {
  background: "#f8faff",
  borderRadius: 22,
  padding: 16,
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
};

const sectionLabel = {
  margin: 0,
  fontSize: 13,
  color: "#6b7280",
};

const sectionTitle = {
  margin: "6px 0 0 0",
  fontSize: 20,
};

const progressCircle = {
  width: 62,
  height: 62,
  borderRadius: "50%",
  background: "#ede9fe",
  color: "#4f46e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: 14,
};

const progressBarBg = {
  width: "100%",
  height: 10,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg, #4f46e5, #8b5cf6)",
  borderRadius: 999,
  transition: "width 0.25s ease",
};

const inputRow = {
  display: "flex",
  gap: 10,
};

const inputStyle = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const primaryButton = {
  border: "none",
  borderRadius: 14,
  padding: "12px 16px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

const listHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const smallMuted = {
  fontSize: 13,
  color: "#6b7280",
};

const taskCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ffffff",
  borderRadius: 18,
  padding: 14,
  marginBottom: 10,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
  transition: "all 0.2s ease",
};

const taskLeft = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  flex: 1,
};

const checkCircle = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: "bold",
};

const taskName = {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
};

const taskTime = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 4,
};

const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  width: 30,
  height: 30,
  borderRadius: "50%",
  cursor: "pointer",
  fontWeight: "bold",
};

const miniCard = {
  background: "white",
  borderRadius: 16,
  padding: 14,
  marginBottom: 10,
  fontWeight: "600",
};

const navBar = {
  display: "flex",
  gap: 8,
  background: "#f8fafc",
  borderRadius: 22,
  padding: 8,
  marginTop: "auto",
};

const navButton = {
  flex: 1,
  border: "none",
  borderRadius: 16,
  padding: "12px 8px",
  fontWeight: "600",
  fontSize: 14,
  cursor: "pointer",
};
// final update
