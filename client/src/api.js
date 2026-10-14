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

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "The API returned an unexpected response. Check that VITE_API_URL points to your backend service.",
    );
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "The request could not be completed.");
  }
  return data;
}

export async function getTasks() {
  const tasks = await request("/tasks");
  if (!Array.isArray(tasks)) {
    throw new Error("The API did not return a task list. Check that VITE_API_URL points to your backend service.");
  }
  return tasks;
}

export const createTask = (task) =>
  request("/tasks", { method: "POST", body: JSON.stringify(task) });

export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: "DELETE" });
