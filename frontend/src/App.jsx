import "./App.css";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./Layout.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ExperiencesPage from "./pages/ExperiencesPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import {UserContextProvider} from "./UserContext.jsx";
import {FavoritesProvider} from "./FavoritesContext.jsx";
import axios from "axios";


import {Bounce, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlacesForm from "./pages/PlacesForm.jsx";
import HomePlacePage from "./pages/HomePlacePage.jsx";
import MyBookingPage from "./pages/MyBookingPage.jsx";
import SingleBookingPage from "./pages/SingleBookingPage.jsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
axios.defaults.withCredentials = true;

function App() {

    return (
            <UserContextProvider>
                <FavoritesProvider>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<IndexPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>
                            <Route path="/services" element={<ServicesPage/>}/>
                            <Route path="/experiences" element={<ExperiencesPage/>}/>
                            <Route path="/favorites" element={<FavoritesPage/>}/>
                            <Route path="/account/" element={<ProfilePage/>}/>
                            <Route path="/account/places" element={<PlacesPage/>}/>
                            <Route path="/account/places/new" element={<PlacesForm/>}/>
                            <Route path="/account/places/:id" element={<PlacesForm/>}/>
                            <Route path="/place/:id" element={<HomePlacePage/>}/>
                            <Route path="/account/bookings" element={<MyBookingPage/>}/>
                            <Route path="/account/bookings/:id" element={<SingleBookingPage/>}/>
                        </Route>
                    </Routes>
                    <ToastContainer
                        position="top-right"
                        limit={1}
                        newestOnTop
                        autoClose={2500}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnFocusLoss={false}
                        pauseOnHover
                        draggable
                        transition={Bounce}
                        toastClassName={() => "stayfinder-toast"}
                        progressClassName="stayfinder-toast-progress"
                    />
                </FavoritesProvider>
            </UserContextProvider>

    );
}

export default App;
