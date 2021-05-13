import axios from "axios";

export const api = axios.create({
  baseURL: "https://759de6356bdb.ngrok.io/api/v2",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
