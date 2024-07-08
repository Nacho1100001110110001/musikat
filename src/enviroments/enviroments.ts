const pathBase = "http://localhost:3000/api";
const pathBaseApi = "/api";
const pathStubs = "http://localhost:8882";

export const enviroments = {
    apiConnect: {
        login: pathBase + "/auth/login",
        logout: pathBase + "/auth/logout",
        logged: pathBase + "/auth/status",
        userProfile: pathBase + "/user/profile",
        register: pathBase + "/auth/register",
        photo: pathBase + "/user/profilepic",
        searchUser: pathBase + "/users",
    },

    musicApiConnet: {
        getSongById: pathBaseApi + "/track",
        getArtistById: pathBaseApi + "/artist",
        searchSongs: pathBaseApi + "search/track",
        searchArtists: pathBaseApi + "search/artist"
    }
}