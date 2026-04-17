import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL; // gateway

export const getUserHistory = async () => {
  const token = getToken();

  const response = await axios.get(`${BASE_URL}/history/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
