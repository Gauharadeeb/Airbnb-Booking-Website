import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../FavoritesContext.jsx';

const ExperiencesPage = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchLocation, setSearchLocation] = useState('');
    const [searchDate, setSearchDate] = useState('');
    
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

    const experiences = [
        {
            id: 1,
            title: 'Sunset Yoga Session',
            host: 'by Priya',
            price: '₹1,200',
            rating: '4.92',
            image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
            category: 'wellness',
            duration: '2 hours',
            groupSize: 'Small group'
        },
        {
            id: 2,
            title: 'Street Food Tour',
            host: 'by Amit',
            price: '₹2,500',
            rating: '4.88',
            image: 'https://images.unsplash.com/photo-1504638729212-9601b4c4eb77?w=400',
            category: 'food',
            duration: '3 hours',
            groupSize: 'Small group'
        },
        {
            id: 3,
            title: 'Heritage Walk',
            host: 'by Sarah',
            price: '₹800',
            rating: '4.95',
            image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
            category: 'cultural',
            duration: '2.5 hours',
            groupSize: 'Small group'
        },
        {
            id: 4,
            title: 'Photography Workshop',
            host: 'by Raj',
            price: '₹3,000',
            rating: '4.97',
            image: 'https://images.unsplash.com/photo-1492633423870-43d1bcd2751c?w=400',
            category: 'creative',
            duration: '4 hours',
            groupSize: 'Small group'
        },
        {
            id: 5,
            title: 'Cooking Masterclass',
            host: 'by Maria',
            price: '₹2,800',
            rating: '4.90',
            image: 'https://images.unsplash.com/photo-1556910102-9646e4e1f727?w=400',
            category: 'food',
            duration: '3 hours',
            groupSize: 'Small group'
        },
        {
            id: 6,
            title: 'Mountain Hiking',
            host: 'by Mike',
            price: '₹1,500',
            rating: '4.93',
            image: 'https://images.unsplash.com/photo-1551698618-1dcef66a5d95?w=400',
            category: 'adventure',
            duration: '5 hours',
            groupSize: 'Small group'
        },
        {
            id: 7,
            title: 'Art Gallery Tour',
            host: 'by Lisa',
            price: '₹1,000',
            rating: '4.85',
            image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
            category: 'cultural',
            duration: '2 hours',
            groupSize: 'Small group'
        },
        {
            id: 8,
            title: 'Sunrise Meditation',
            host: 'by David',
            price: '₹900',
            rating: '4.91',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            category: 'wellness',
            duration: '1.5 hours',
            groupSize: 'Small group'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Experiences' },
        { id: 'wellness', name: 'Wellness' },
        { id: 'food', name: 'Food & Drink' },
        { id: 'cultural', name: 'Cultural' },
        { id: 'creative', name: 'Creative' },
        { id: 'adventure', name: 'Adventure' }
    ];

    const filteredExperiences = experiences.filter(experience => {
        const matchesCategory = selectedCategory === 'all' || experience.category === selectedCategory;
        return matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Experiences</h1>
                <p className="text-lg text-slate-600">Find unforgettable activities hosted by local experts</p>
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

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExperiences.map(experience => (
                    <div key={experience.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-2xl mb-3">
                            <img
                                src={experience.image}
                                alt={experience.title}
                                className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                            />
                            <button 
                                onClick={() => toggleFavorite({ 
                                    id: `experience-${experience.id}`, 
                                    title: experience.title, 
                                    price: experience.price, 
                                    image: experience.image,
                                    type: 'experience'
                                })}
                                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite(`experience-${experience.id}`) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`h-4 w-4 ${isFavorite(`experience-${experience.id}`) ? 'text-rose-600' : 'text-slate-700'}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </button>
                            <div className="absolute bottom-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-semibold">
                                {experience.duration}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600 uppercase">{experience.host}</span>
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-rose-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                                    </svg>
                                    <span className="text-sm font-semibold">{experience.rating}</span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-slate-900 line-clamp-2">{experience.title}</h3>
                            <p className="text-sm text-slate-600">{experience.groupSize}</p>
                            <p className="font-semibold text-slate-900">From {experience.price}<span className="font-normal text-slate-600"> per person</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperiencesPage;
