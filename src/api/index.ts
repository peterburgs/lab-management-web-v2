import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
