/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (item) => {
        setFavorites(prev => {
            if (prev.some(fav => fav.id === item.id)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFromFavorites = (itemId) => {
        setFavorites(prev => prev.filter(fav => fav.id !== itemId));
    };

    const toggleFavorite = (item) => {
        if (favorites.some(fav => fav.id === item.id)) {
            removeFromFavorites(item.id);
        } else {
            addToFavorites(item);
        }
    };

    const isFavorite = (itemId) => {
        return favorites.some(fav => fav.id === itemId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            toggleFavorite,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
