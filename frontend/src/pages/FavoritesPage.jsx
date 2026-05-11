import { useFavorites } from '../FavoritesContext.jsx';
import { Link } from 'react-router-dom';

const formatPrice = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(value || 0);

const FavoritesPage = () => {
    const { favorites, removeFromFavorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-16 w-16 text-slate-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No favorites yet</h2>
                <p className="text-slate-600 mb-6">Start exploring and save your favorite places, services, and experiences!</p>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-white font-semibold hover:bg-rose-700 transition"
                >
                    Start exploring
                </Link>
            </div>
        );
    }

    const groupedFavorites = favorites.reduce((acc, item) => {
        const type = item.type || 'place';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Your Favorites</h1>
                <p className="text-lg text-slate-600">All your saved places, services, and experiences in one place</p>
            </div>

            {groupedFavorites.place && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Places ({groupedFavorites.place.length})</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {groupedFavorites.place.map(item => (
                            <div key={item.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative">
                                    <Link to={`/place/${item.id}`}>
                                        {item.photo && (
                                            <img className="h-72 w-full object-cover" src={item.photo} alt={item.title} />
                                        )}
                                    </Link>
                                    <button
                                        onClick={() => removeFromFavorites(item.id)}
                                        className="absolute top-4 right-4 rounded-full bg-white/95 p-2 shadow-sm hover:bg-white transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-rose-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-3 p-4">
                                    <div>
                                        <h2 className="truncate text-lg font-black">{item.title}</h2>
                                    </div>
                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <span className="text-xl font-black">{formatPrice(item.price)}</span>
                                            <span className="text-sm font-semibold text-slate-500"> night</span>
                                        </div>
                                        <Link 
                                            to={`/place/${item.id}`}
                                            className="rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-rose-700 hover:bg-rose-100 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {groupedFavorites.service && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Services ({groupedFavorites.service.length})</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {groupedFavorites.service.map(item => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl mb-3">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <button 
                                        onClick={() => removeFromFavorites(item.id)}
                                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-rose-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                                    <p className="font-semibold text-slate-900">{item.price}<span className="font-normal text-slate-600"> per person</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {groupedFavorites.experience && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Experiences ({groupedFavorites.experience.length})</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedFavorites.experience.map(item => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl mb-3">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <button 
                                        onClick={() => removeFromFavorites(item.id)}
                                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-rose-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
                                    <p className="font-semibold text-slate-900">From {item.price}<span className="font-normal text-slate-600"> per person</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default FavoritesPage;
