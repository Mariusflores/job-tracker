import {api} from "./client.ts"

export async function deleteUserApi() {
    await api.delete("/users/me");
}