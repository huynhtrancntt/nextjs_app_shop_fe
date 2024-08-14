import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from "src/configs/auth";


interface TPops {
    userData: string;
    accessToken: string;
    refreshToken: string;
}

export const setLocalStorage = ({ userData, accessToken, refreshToken }: TPops) => {
    return {
        userData: window.localStorage.setItem(USER_DATA, userData),
        accessToken: window.localStorage.setItem(ACCESS_TOKEN, accessToken),
        refreshToken: window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
    };
};
export const getLocalStorage = () => {
    return {
        userData: window.localStorage.getItem(USER_DATA),
        accessToken: window.localStorage.getItem(ACCESS_TOKEN),
        refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    };
}
export const clearLocalStorage = () => {
    return {
        userData: window.localStorage.removeItem(USER_DATA),
        accessToken: window.localStorage.removeItem(ACCESS_TOKEN),
        refreshToken: window.localStorage.removeItem(REFRESH_TOKEN)
    };
}