import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import DeliveryPartnerRegister from '../pages/auth/DeliveryPartnerRegister';
import DeliveryPartnerLogin from '../pages/auth/DeliveryPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import CartPage from '../pages/user/CartPage';
import OrderTrackingPage from '../pages/user/OrderTrackingPage';
import OrdersPage from '../pages/user/OrdersPage';
import PartnerOrdersPage from '../pages/food-partner/PartnerOrdersPage';
import DeliveryDashboard from '../pages/delivery-partner/DeliveryDashboard';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/delivery-partner/register" element={<DeliveryPartnerRegister />} />
                <Route path="/delivery-partner/login" element={<DeliveryPartnerLogin />} />
                <Route path="/" element={<><Home /><BottomNav /></>} />
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/tracking/:id" element={<OrderTrackingPage />} />
                <Route path="/create-food" element={<CreateFood />} />
                <Route path="/food-partner/orders" element={<PartnerOrdersPage />} />
                <Route path="/delivery-partner/dashboard" element={<DeliveryDashboard />} />
                <Route path="/food-partner/:id" element={<Profile />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes