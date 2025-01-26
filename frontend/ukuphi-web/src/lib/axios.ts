import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.servor.tech/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
