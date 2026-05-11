import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../FavoritesContext.jsx';

const ServicesPage = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchLocation, setSearchLocation] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchType, setSearchType] = useState('');
    
    // Search functionality states
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showWhoDropdown, setShowWhoDropdown] = useState(false);
    const [guests, setGuests] = useState({
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
    });

    const suggestions = [
        { name: "Delhi", description: "Capital city" },
        { name: "Mumbai", description: "Financial hub" },
        { name: "Bangalore", description: "Tech city" },
        { name: "Goa", description: "Beach destination" },
        { name: "Jaipur", description: "Pink city" },
        { name: "Kerala", description: "Backwaters" }
    ];

    const updateGuests = (type, increment) => {
        setGuests(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
        }));
    };

    const getTotalGuests = () => {
        return guests.adults + guests.children + guests.infants;
    };

    const getGuestsText = () => {
        const total = getTotalGuests();
        if (total === 0) return 'Add guests';
        if (total === 1) return '1 guest';
        return `${total} guests`;
    };

    const services = [
        {
            id: 1,
            title: 'Photography',
            image: 'https://images.unsplash.com/photo-1492633423870-43d1bcd2751c?w=400',
            status: '4 available',
            category: 'creative'
        },
        {
            id: 2,
            title: 'Chefs',
            image: 'https://images.unsplash.com/photo-1556910102-9646e4e1f727?w=400',
            status: 'Coming soon',
            category: 'culinary'
        },
        {
            id: 3,
            title: 'Massage',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
            status: 'Coming soon',
            category: 'wellness'
        },
        {
            id: 4,
            title: 'Prepared meals',
            image: 'https://images.unsplash.com/photo-1504638729212-9601b4c4eb77?w=400',
            status: 'Coming soon',
            category: 'culinary'
        },
        {
            id: 5,
            title: 'Training',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            status: 'Coming soon',
            category: 'fitness'
        },
        {
            id: 6,
            title: 'Make-up',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
            status: 'Coming soon',
            category: 'beauty'
        },
        {
            id: 7,
            title: 'Hair',
            image: 'https://images.unsplash.com/photo-1560066984-76a23a2a86c3?w=400',
            status: 'Coming soon',
            category: 'beauty'
        },
        {
            id: 8,
            title: 'Spa',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
            status: 'Coming soon',
            category: 'wellness'
        }
    ];

    const chefServices = [
        {
            id: 9,
            title: 'Private Dinner Party Chef',
            host: 'by Maria',
            price: '₹2,500',
            rating: '4.95',
            image: 'https://images.unsplash.com/photo-1556910102-9646e4e1f727?w=400',
            tags: ['Private dining', 'Italian cuisine']
        },
        {
            id: 10,
            title: 'Cooking Class - Indian Cuisine',
            host: 'by Raj',
            price: '₹1,800',
            rating: '4.88',
            image: 'https://images.unsplash.com/photo-1504638729212-9601b4c4eb77?w=400',
            tags: ['Cooking class', 'Indian food']
        },
        {
            id: 11,
            title: 'Weekend Brunch Service',
            host: 'by Sophie',
            price: '₹3,200',
            rating: '4.92',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
            tags: ['Brunch', 'Continental']
        },
        {
            id: 12,
            title: 'BBQ & Grilling Experience',
            host: 'by Mike',
            price: '₹2,800',
            rating: '4.97',
            image: 'https://images.unsplash.com/photo-1529692236672-8f072b07d23a?w=400',
            tags: ['BBQ', 'Outdoor dining']
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services' },
        { id: 'creative', name: 'Creative' },
        { id: 'culinary', name: 'Culinary' },
        { id: 'wellness', name: 'Wellness' },
        { id: 'fitness', name: 'Fitness' },
        { id: 'beauty', name: 'Beauty' }
    ];

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Discover services on Airbnb</h1>
                <p className="text-lg text-slate-600">Find unique services and experiences for your next trip</p>
            </div>

            {/* Dynamic Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="rounded-full border border-slate-300 bg-white p-2 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 px-4 py-2">
                            <input
                                type="text"
                                placeholder="Nearby"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex-1 px-4 py-2 border-l border-slate-300">
                            <input
                                type="text"
                                placeholder="Add dates"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex-1 px-4 py-2 border-l border-slate-300">
                            <input
                                type="text"
                                placeholder="Add guests"
                                value={getTotalGuests() > 0 ? getGuestsText() : ''}
                                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                            />
                        </div>
                        <button className="rounded-full bg-rose-600 px-6 py-3 text-white font-semibold hover:bg-rose-700">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                            selectedCategory === category.id
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredServices.map(service => (
                    <div key={service.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-2xl mb-3">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                            />
                            {service.status === 'Coming soon' && (
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                                        Coming soon
                                    </span>
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-slate-900">{service.title}</h3>
                        <p className="text-sm text-slate-600">{service.status}</p>
                    </div>
                ))}
            </div>

            {/* Chefs Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Chefs</h2>
                    <Link to="/services/chefs" className="text-rose-600 font-semibold hover:underline">
                        Show all
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {chefServices.map(service => (
                        <div key={service.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-2xl mb-3">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <button 
                                    onClick={() => toggleFavorite({ 
                                        id: `service-${service.id}`, 
                                        title: service.title, 
                                        price: service.price, 
                                        image: service.image,
                                        type: 'service'
                                    })}
                                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite(`service-${service.id}`) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`h-4 w-4 ${isFavorite(`service-${service.id}`) ? 'text-rose-600' : 'text-slate-700'}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 uppercase">{service.host}</span>
                                    <div className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-rose-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                                        </svg>
                                        <span className="text-sm font-semibold">{service.rating}</span>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-slate-900 line-clamp-2">{service.title}</h3>
                                <div className="flex flex-wrap gap-1">
                                    {service.tags.map((tag, index) => (
                                        <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="font-semibold text-slate-900">{service.price}<span className="font-normal text-slate-600"> per person</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
