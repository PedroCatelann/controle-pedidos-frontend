import { apiBackEnd } from "./api";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function login(data: LoginRequest) {
  const response = await apiBackEnd.post("/auth/signin", data);
  return response.data.body;
}
