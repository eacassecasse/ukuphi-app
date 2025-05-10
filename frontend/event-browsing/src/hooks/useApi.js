import { api } from "../lib/axios"
import axios from "axios";

export default function useApi() {
    const fetchWithAuth = async (url, options = {}) => {
        try {
            const { data } = await api({
                url,
                method: "GET",
                ...options
            });

            return data;
        } catch (error) {
            console.error("Failed to authenticate", error);
            throw error;
        }
    };

    const fetch = async (url, options = {}) => {
        try {
            const axiosInstance = await axios.create({
                baseURL: "https://api.servor.tech/api/v1",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                }
            });

            const { data } = await axiosInstance({
                url,
                method: options.method || "GET",
                data: options.data || undefined,
                ...options
            });

            return data;
        } catch (error) {
            console.error("Failed to fetch data", error);
            throw error;
        }
    }

    return { fetchWithAuth, fetch }
}