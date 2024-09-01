import axios, { Method } from "axios";
import { getSession } from "./secretStorage";

async function getAccessToken() {
  const session = await getSession("session");
  const token = session ? JSON.parse(session).accessToken : null;
  return token;
}

async function api(url: string, method: Method, data?: any) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  const axiosInstance = axios.create({
    baseURL: "https://41e6q57s0l.execute-api.eu-west-2.amazonaws.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  try {
    const response = await axiosInstance.request({ url, method, data });
    return response.data;
  } catch (error) {
    throw new Error(`Network response was not ok: ${error}`);
  }
}

export default api;
