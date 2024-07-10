const pathBase = "https://redesserver.duckdns.org:3000/api";
const pathBaseApi = "/api";

export const enviroments = {
    apiConnect: {
        login: pathBase + "/auth/login",
        logout: pathBase + "/auth/logout",
        logged: pathBase + "/auth/status",
        userProfile: pathBase + "/user/profile",
        register: pathBase + "/auth/register",
        photo: pathBase + "/user/profilepic",
        searchUser: pathBase + "/users",
        publication: pathBase + "/pub",
        feed: pathBase + "/feed",
        likeSong: pathBase + "/song/like",
        likeArtist: pathBase + "/artist/like",
        preferences: pathBase + "/preferences",
        likePub: pathBase + "/pub/like",
        commentPub: pathBase + "/pub/comment",
        userPublications: pathBase + "/user/pub",
        addFriend: pathBase + "/user/friends/solicitude",
        removeFriend: pathBase + "/user/friend",
        acceptRequest: pathBase + "/user/friends/accept",
        rejectRequest: pathBase + "/user/friends/decline",
        notifications: pathBase + "/notifications"
    },

    musicApiConnet: {
        getSongById: pathBaseApi + "/track",
        getArtistById: pathBaseApi + "/artist",
        searchSongs: pathBaseApi + "search/track",
        searchArtists: pathBaseApi + "search/artist"
    }
}