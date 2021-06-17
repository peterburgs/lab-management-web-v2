import axios from "axios";

export const nodeAPI = axios.create({
  baseURL:
    "https://us-central1-lab-management-315901.cloudfunctions.net/app/api/v2",
});

export const faceAPI = axios.create({
  baseURL: "https://face-id-server-mys4snc4mq-wl.a.run.app",
});

export function auth() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
