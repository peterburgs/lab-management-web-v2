import axios from "axios";

export const api = axios.create({
  baseURL: "https://76f1639e6493.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
