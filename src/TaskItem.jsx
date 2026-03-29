export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ffffff",
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        onClick={() => onToggle(task.id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          flex: 1,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: task.done ? "#22c55e" : "#e5e7eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {task.done ? "✓" : ""}
        </div>

        <div>
          <div
            style={{
              fontWeight: "600",
              textDecoration: task.done ? "line-through" : "none",
            }}
          >
            {task.name}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{task.time}</div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        style={{
          border: "none",
          background: "#fee2e2",
          color: "#dc2626",
          width: 30,
          height: 30,
          borderRadius: "50%",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}
