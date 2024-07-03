const pathBase = "http://localhost:3000/api";

export const enviroments = {
    apiConnect: {
        login: pathBase + "/auth/login",
        logout: pathBase + "/auth/logout",
        logged: pathBase + "/auth/status",
        userProfile: pathBase + "/user/profile",
        register: pathBase + "/auth/register",
    }
}