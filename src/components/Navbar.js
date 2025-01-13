import React from "react"
import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ניהול תקציב
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                ראשי
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/incomes">
                הכנסות
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expenses">
                הוצאות
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                אודות
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/postmanager">
                פורום משתמשים
              </Link>
            </li>
          </ul>
          <button
            id="logout-btn"
            className="btn btn-danger logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
