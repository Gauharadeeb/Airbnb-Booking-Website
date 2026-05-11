import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUserState] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("/api/profile");
                setUserState(data.data);
            } catch (error) {
                setUserState(null);
            } finally {
                setReady(true);
            }
        };

        fetchProfile();
    }, []);

    const setUser = (userData) => {
        setUserState(userData);
        setReady(true);
    };

    const logoutUser = () => {
        setUserState(null);
        setReady(true);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logoutUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
