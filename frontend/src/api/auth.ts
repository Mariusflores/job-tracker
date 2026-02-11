import {api} from "./client.ts";
import type {AxiosResponse} from "axios";

type AuthResponse = {
    token: string
}


type RegisterRequest = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

export async function loginApi(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", {
        email, password
    });

    return setToken(response)

}

export async function registerApi(request: RegisterRequest) {
    console.log(request)
    const response = await api.post<AuthResponse>("/auth/register", request)

    return setToken(response)
}

function setToken(response: AxiosResponse<AuthResponse>) {
    const {token} = response.data;

    localStorage.setItem("token", token)

    return token;
}