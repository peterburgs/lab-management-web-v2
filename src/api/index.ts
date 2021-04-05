import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export function auth() {
  const token = localStorage.get("token");
  return { Authorization: `Bearer ${token}` };
}
