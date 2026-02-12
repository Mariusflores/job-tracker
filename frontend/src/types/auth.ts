export type RegisterRequest = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}
export type AuthResponse = {
    token: string
}

export type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}