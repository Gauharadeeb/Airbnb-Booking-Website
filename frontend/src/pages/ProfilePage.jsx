import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from '../pages/PlacesPage.jsx'
import AccountNav from "../component/AccountNav.jsx";
import { notify } from "../utils/notifications";
import { useFavorites } from "../FavoritesContext.jsx";
import UserAvatar from "../component/UserAvatar.jsx";
import BookingDates from "../component/BookingDates.jsx";

const ProfilePage = () => {
    const { ready, user, logoutUser, setUser } = useContext(UserContext);
    const { favorites } = useFavorites();
    let { subpage } = useParams();
    const [redirect, setRedirect] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [places, setPlaces] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [profileFile, setProfileFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    useEffect(() => {
        if (!user) return;

        setProfileName(user.name || '');
        setProfileImage(user.profileImage || '');
    }, [user]);

    useEffect(() => {
        if (!user) return;

        Promise.allSettled([
            axios.get('/api/bookings'),
            axios.get('/api/places'),
        ]).then(([bookingsResult, placesResult]) => {
            if (bookingsResult.status === 'fulfilled') {
                setBookings(bookingsResult.value.data.data || []);
            }
            if (placesResult.status === 'fulfilled') {
                setPlaces(placesResult.value.data || []);
            }
        });
    }, [user]);

    async function logout() {
        try {
            await axios.post('/api/logout');
        } finally {
            logoutUser();
            notify.success('Logged out successfully');
            navigate('/login', { replace: true });
        }
    }

    function handleProfileImageChange(ev) {
        const file = ev.target.files?.[0];
        if (!file) return;

        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    }

    async function uploadProfileImage() {
        if (!profileFile) return profileImage;

        const formData = new FormData();
        formData.append('photos', profileFile);
        const { data } = await axios.post('/api/upload-image', formData, {
            headers: { 'Content-type': 'multipart/form-data' },
        });

        return data.cloudinaryResponses?.[0] || profileImage;
    }

    async function saveProfile() {
        try {
            setIsSaving(true);
            const uploadedProfileImage = await uploadProfileImage();
            const { data } = await axios.put('/api/profile', {
                name: profileName,
                profileImage: uploadedProfileImage,
            });

            setUser(data.data);
            setProfileImage(data.data.profileImage || '');
            setProfilePreview('');
            setProfileFile(null);
            setIsEditing(false);
            notify.success('Profile updated');
        } catch (error) {
            notify.error(error.response?.data?.message || 'Profile update failed');
        } finally {
            setIsSaving(false);
        }
    }

    if (!ready) {
        return <div className="mx-auto mt-10 h-40 max-w-lg animate-pulse rounded-3xl bg-slate-200"></div>;
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav />

            {subpage === 'profile' && (
                <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10">
                    <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 ring-1 ring-slate-200">
                        <div className="h-36 bg-gradient-to-r from-[#222222] via-slate-800 to-[#FF385C]"></div>
                        <div className="grid gap-6 px-6 pb-8 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-8">
                            <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
                                <UserAvatar
                                    user={user}
                                    src={profileImage}
                                    preview={profilePreview}
                                    className="h-28 w-28 shrink-0"
                                    textClassName="text-4xl"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF385C]">Welcome back</p>
                                    <h1 className="mt-1 break-words text-3xl font-black leading-tight text-[#222222]">{user.name}</h1>
                                    <p className="mt-2 break-words font-semibold text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing((value) => !value)}
                                    className="rounded-full bg-[#222222] px-5 py-3 text-sm font-black text-white transition hover:bg-black"
                                >
                                    {isEditing ? 'Close editor' : 'Edit profile'}
                                </button>
                                <button onClick={logout} className="rounded-full bg-[#FF385C] px-5 py-3 text-sm font-black text-white transition hover:bg-[#e93051]">Logout</button>
                            </div>
                        </div>
                    </section>

                    {isEditing && (
                        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-2xl font-black text-[#222222]">Edit profile</h2>
                            <div className="mt-5 grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-end">
                                <UserAvatar
                                    user={{ ...user, name: profileName, profileImage }}
                                    preview={profilePreview}
                                    className="h-24 w-24"
                                    textClassName="text-3xl"
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="space-y-2">
                                        <span className="text-sm font-black text-[#222222]">Name</span>
                                        <input
                                            value={profileName}
                                            onChange={(ev) => setProfileName(ev.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold outline-none transition focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
                                        />
                                    </label>
                                    <label className="space-y-2">
                                        <span className="text-sm font-black text-[#222222]">Profile image</span>
                                        <span className="flex min-h-[58px] cursor-pointer items-center rounded-2xl border border-dashed border-slate-300 bg-[#F7F7F7] px-4 text-sm font-black text-slate-600 transition hover:border-[#FF385C] hover:bg-white">
                                            Choose image
                                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                                        </span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={saveProfile}
                                    disabled={isSaving}
                                    className="rounded-2xl bg-[#FF385C] px-6 py-4 font-black text-white transition hover:bg-[#e93051] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSaving ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </section>
                    )}

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            ['Total bookings', bookings.length],
                            ['Favorite listings', favorites.length],
                            ['Accommodations created', places.length],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="text-3xl font-black text-[#222222]">{value}</div>
                                <div className="mt-1 text-sm font-bold text-slate-500">{label}</div>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-5 lg:grid-cols-2">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-2xl font-black text-[#222222]">Recent bookings</h2>
                            {bookings.length > 0 ? (
                                <div className="mt-5 space-y-4">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <div key={booking._id} className="rounded-3xl bg-[#F7F7F7] p-4">
                                            <h3 className="font-black text-[#222222]">{booking.place?.title || 'Booked stay'}</h3>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">{booking.place?.address}</p>
                                            <BookingDates booking={booking} className="mt-2 flex-wrap text-sm text-slate-600" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 font-semibold text-slate-500">No bookings yet. Your future trips will appear here.</p>
                            )}
                        </div>

                        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-2xl font-black text-[#222222]">Your accommodations</h2>
                            {places.length > 0 ? (
                                <div className="mt-5 space-y-4">
                                    {places.slice(0, 3).map((place) => (
                                        <div key={place._id} className="rounded-3xl bg-[#F7F7F7] p-4">
                                            <h3 className="font-black text-[#222222]">{place.title}</h3>
                                            <p className="mt-1 text-sm font-semibold text-slate-500">{place.address}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 font-semibold text-slate-500">No accommodations created yet.</p>
                            )}
                        </div>
                    </section>
                </div>
            )}
            {subpage === 'places' && (

                <PlacesPage />

            )}
        </div>
    );
};

export default ProfilePage;
