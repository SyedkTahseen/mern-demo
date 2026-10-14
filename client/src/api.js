const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Could not reach the API. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "The request could not be completed.");
  }
  return data;
}

export const getTasks = () => request("/tasks");

export const createTask = (task) =>
  request("/tasks", { method: "POST", body: JSON.stringify(task) });

export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: "DELETE" });

