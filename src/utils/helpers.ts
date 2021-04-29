import { useLocation } from "react-router-dom";
import { User } from "./types";

export const GRF_USER = "grf_user";
export const GRF_TOKEN = "grf_token";

export const isLoggedIn = () => !!sessionStorage.getItem(GRF_USER);

export const getCurrentUser = (): User | null => (isLoggedIn() ? JSON.parse(sessionStorage.getItem(GRF_USER)!) : null);

export const getAuthToken = (): string | null => sessionStorage.getItem(GRF_TOKEN)

// A custom hook that builds on useLocation to parse
// the query string for you.
export const useQueryString = () => {
    return new URLSearchParams(useLocation().search);
};
