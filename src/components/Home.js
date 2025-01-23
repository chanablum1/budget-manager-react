import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Chart from "chart.js/auto"

function Home() {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  })
  const [chart, setChart] = useState(null)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const username = localStorage.getItem("username")
  const navigate = useNavigate()

  useEffect(() => {
    checkLoginStatus()
    loadMonthlySummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkLoginStatus = () => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      alert("Please log in first.")
      navigate("/login")
    }
  }

  const loadMonthlySummary = async () => {
    const authToken = localStorage.getItem("authToken")

    try {
      const response = await axios.get(
        `https://budget-management-system-1fqb.onrender.com/transaction/transactions/monthly-summary/?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      setSummary(response.data)
      renderChart(response.data)
    } catch (error) {
      console.error("Error loading summary:", error)
    }
  }

  const renderChart = (data) => {
    if (chart) chart.destroy()

    const ctx = document.getElementById("summaryChart").getContext("2d")
    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["הכנסות", "הוצאות", "יתרה"],
        datasets: [
          {
            label: "סכום",
            data: [data.total_income, data.total_expense, data.balance],
            backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      },
    })
    setChart(newChart)
  }
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>
          <span>{username}</span>, ברוכים הבאים לניהול התקציב של
        </h1>
      </header>
      <div className="action-buttons">
        <button
          className="btn btn-success"
          onClick={() => navigate("/incomes")}
        >
          <i className="fas fa-plus-circle"></i> הוסף הכנסה
        </button>
        <button
          className="btn btn-danger"
          onClick={() => navigate("/expenses")}
        >
          <i className="fas fa-minus-circle"></i> הוסף הוצאה
        </button>
      </div>
      <div className="home-content">
        <div className="summary-section">
          <h3>סיכום חודשי</h3>
          <div>💰 הכנסות: {summary.total_income.toLocaleString()} ש"ח</div>
          <div>💸 הוצאות: {summary.total_expense.toLocaleString()} ש"ח</div>
          <div>
            ⚖️ יתרה:{" "}
            <span
              style={{ color: summary.balance >= 0 ? "#ffc107" : "#dc3545" }}
            >
              {summary.balance.toLocaleString()}
            </span>{" "}
            ש"ח
          </div>
          <label htmlFor="monthSelect">בחר חודש:</label>
          <div>
            <input
              type="month"
              className="form-control"
              id="monthSelect"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <button className="btn btn-primary" onClick={loadMonthlySummary}>
              הצג סיכום
            </button>
          </div>
        </div>

        <div className="chart-section">
          <canvas id="summaryChart"></canvas>
        </div>
      </div>
      <footer className="home-footer">
        <div className="footer-content">
          <p>
            © {new Date().getFullYear()} מערכת ניהול התקציב האישי | כל הזכויות
            שמורות
          </p>
          <p>
            Developed by{" "}
            <a
              href="https://github.com/chanablum1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chana Blum
            </a>
          </p>

          {/* <div className="footer-links">
            <a href="/">אודות</a> | <a href="/contact">צור קשר</a> |{" "}
            <a href="/terms">תנאי שימוש</a>
          </div> */}
        </div>
      </footer>
    </div>
  )
}

export default Home
