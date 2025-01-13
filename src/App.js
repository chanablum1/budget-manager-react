import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import About from "./components/About"
import Login from "./components/Login"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import TransactionsManager from "./components/TransactionsManager"
import Register from "./components/Register"
import PostManager from "./components/PostManager"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
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
        <Route path="/postmanager" element={<PostManager />} />
      </Routes>
    </Router>
  )
}

export default App
