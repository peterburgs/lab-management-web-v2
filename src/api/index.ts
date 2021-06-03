import axios from "axios";

export const api = axios.create({
  baseURL: "https://e6b5c94a9e60.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
