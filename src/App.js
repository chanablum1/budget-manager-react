import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar'; 
import TransactionsManager from './components/TransactionsManager'; // ייבוא הקומפוננטה הכללית לניהול טרנזקציות
import Register from './components/Register';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ניהול מצב ההתחברות

    return (
        <Router>
            {/* הצגת Navbar בכל המסכים */}
            <Navbar />
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route
                    path="/home"
                    element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/incomes"
                    element={
                        isLoggedIn ? (
                            <TransactionsManager transactionType="income" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/expenses"
                    element={
                        isLoggedIn ? (
                            <TransactionsManager transactionType="expense" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
