import axios from "axios";

export const api = axios.create({
  baseURL: "https://8c7bd70a38e6.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
