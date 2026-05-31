import {useState } from 'react';
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import { notify } from "../utils/notifications";
import UserAvatar from "../component/UserAvatar";
import Image from "../component/Image";

function normalizeName(value = '') {
    return value.trim().replace(/\s+/g, ' ');
}

function normalizeEmail(value = '') {
    return value.trim().toLowerCase();
}

function isValidEmail(value = '') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validateRegisterForm({ name, email, password }) {
    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);
    const errors = {};

    if (!normalizedName) {
        errors.name = 'Name is required.';
    } else if (normalizedName.length < 3) {
        errors.name = 'Name must be at least 3 characters.';
    } else if (normalizedName.length > 40) {
        errors.name = 'Name must not be more than 40 characters.';
    } else if (!/^[A-Za-z\s]+$/.test(normalizedName)) {
        errors.name = 'Name can contain only letters and spaces.';
    }

    if (!normalizedEmail) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(normalizedEmail)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
        errors.password = 'Password is required.';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    } else if (password.length > 32) {
        errors.password = 'Password must not be more than 32 characters.';
    } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/\d/.test(password)) {
        errors.password = 'Password must contain at least one number.';
    } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = 'Password must contain at least one special character.';
    } else if (password.toLowerCase() === normalizedName.toLowerCase() || password.toLowerCase() === normalizedEmail.toLowerCase()) {
        errors.password = 'Password should not be the same as your name or email.';
    }

    return { errors, normalizedName, normalizedEmail };
}



const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [profileFile, setProfileFile] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
   
    const handleProfileImageChange = (ev) => {
        const file = ev.target.files?.[0];
        if (!file) return;

        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const uploadProfileImage = async () => {
        if (!profileFile) return profileImage;

        const formData = new FormData();
        formData.append('photos', profileFile);
        const { data } = await axios.post('/api/upload-image', formData, {
            headers: { 'Content-type': 'multipart/form-data' },
        });

        return data.cloudinaryResponses?.[0] || '';
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        const { errors, normalizedName, normalizedEmail } = validateRegisterForm({ name, email, password });
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            const message = Object.values(errors)[0];
            setErrorMessage(message);
            notify.warning(message);
            return;
        }

        setIsSubmitting(true);
        try{
           const uploadedProfileImage = await uploadProfileImage();
           await axios.post('/api/register',{
                name: normalizedName,
                email: normalizedEmail,
                password,
                profileImage: uploadedProfileImage
            })
            const message = "Registration successful. Please login.";
            setSuccessMessage(message);
            notify.success(message)
            setEmail('');
            setName('');
            setPassword('');
            setFieldErrors({});
            setProfileFile(null);
            setProfileImage('');
            setProfilePreview('');
            setRedirect(true);
            
        }catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || "Registration failed";
            setErrorMessage(message);
            notify.error(message);
        } finally {
            setIsSubmitting(false);
        }
     

    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="grow bg-[#F7F7F7] px-3 py-6 sm:px-4 sm:py-12">
            <div className="mx-auto grid min-h-[36rem] max-w-6xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:rounded-[2rem] lg:grid-cols-[0.95fr_1.05fr]">
                <section className="flex min-w-0 items-center px-4 py-8 sm:px-10 sm:py-10">
                    <div className="w-full">
                <h1 className="mb-2 text-center text-3xl font-black text-[#222222] sm:text-4xl">Register</h1>
                <p className="mb-8 text-center font-medium text-slate-500">Create your StayFinder account</p>
                {errorMessage && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
                        {successMessage}
                    </div>
                )}
                <form className="w-full flex flex-col gap-5"
                      onSubmit={handleRegisterSubmit}>
                    <div className="flex flex-col gap-4 rounded-3xl bg-[#F7F7F7] p-4 min-[480px]:flex-row min-[480px]:items-center">
                        <UserAvatar
                            user={{ name, email, profileImage }}
                            preview={profilePreview}
                            className="h-20 w-20"
                            textClassName="text-2xl"
                        />
                        <div>
                            <p className="text-sm font-black text-[#222222]">Profile photo</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Optional. You can add or change it later.</p>
                            <label className="mt-3 inline-flex cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-black text-[#222222] ring-1 ring-slate-200 transition hover:bg-slate-100">
                                Upload image
                                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                            </label>
                        </div>
                    </div>

                    <label className="space-y-2">
                        <span className="text-sm font-black text-[#222222]">Name</span>
                    <input className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold text-[#222222] outline-none transition hover:border-slate-300 focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
                           type="text" required
                           placeholder="Enter your name"
                           value={name}
                           onChange={ev => setName(ev.target.value)}
                    />
                    {fieldErrors.name && <p className="text-sm font-bold text-red-600">{fieldErrors.name}</p>}
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-black text-[#222222]">Email</span>
                    <input className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold text-[#222222] outline-none transition hover:border-slate-300 focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
                           type="email" required
                           placeholder="Enter your email"
                           value={email}
                           onChange={ev => setEmail(ev.target.value)}
                    />
                    {fieldErrors.email && <p className="text-sm font-bold text-red-600">{fieldErrors.email}</p>}
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-black text-[#222222]">Password</span>
                    <input className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold text-[#222222] outline-none transition hover:border-slate-300 focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
                           type="password" required
                           placeholder="Enter your password"
                           value={password}
                           onChange={ev => setPassword(ev.target.value)}
                    />
                    {fieldErrors.password && <p className="text-sm font-bold text-red-600">{fieldErrors.password}</p>}
                    <p className="text-xs font-semibold text-slate-500">Use 8-32 characters with uppercase, lowercase, number, and special character.</p>
                    </label>
                    <button
                        disabled={isSubmitting}
                        className="mt-3 rounded-2xl bg-[#FF385C] p-4 text-lg font-black text-white shadow-lg shadow-[#FF385C]/25 transition hover:-translate-y-0.5 hover:bg-[#e93051] hover:shadow-xl hover:shadow-[#FF385C]/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                    >
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                    <div className="text-center py-2 font-medium text-slate-500">
                        Already have an account? <Link className="font-black text-[#FF385C] underline-offset-4 hover:underline" to={'/login'}>Login
                        now</Link>
                    </div>
                </form>
                    </div>
                </section>
                <section className="relative hidden min-h-[36rem] overflow-hidden bg-[#222222] lg:block">
                    <Image
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80"
                        alt="Bright apartment bedroom"
                        loading="eager"
                        className="absolute inset-0 h-full w-full rounded-none opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-[#222222]/35 to-transparent" />
                    <div className="absolute bottom-0 p-10 text-white">
                        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">Start your next stay</p>
                        <h1 className="max-w-md text-5xl font-black leading-tight">Create an account for homes worth remembering.</h1>
                        <p className="mt-4 max-w-sm text-base font-semibold text-white/80">Save places, book trips, and host with a clean, modern experience.</p>
                    </div>
                </section>
            </div>
        </div>);
};

export default RegisterPage;
