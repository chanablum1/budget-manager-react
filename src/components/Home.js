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
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)) // ברירת מחדל: החודש הנוכחי
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
      // קריאה לפונקציה של שליחת האימייל אם התנאים מתקיימים
      if (response.data.balance < -0) {
        await sendMonthlyEmail(authToken, month)
      }
    } catch (error) {
      console.error("Error loading summary:", error)
    }
  }

  // פונקציה לשליחת האימייל
  const sendMonthlyEmail = async (authToken, selectedMonth) => {
    try {
      await axios.get(
        `https://budget-management-system-1fqb.onrender.com/transaction/transactions/monthly_summary_email/?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      console.log("Email sent successfully")
    } catch (error) {
      console.error(
        "Error loading summary:",
        error.response ? error.response.data : error.message
      )
    }
  }

  const renderChart = (data) => {
    if (chart) {
      chart.destroy()
    }

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
            borderColor: ["#28a745", "#dc3545", "#ffc107"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    setChart(newChart)
  }

  const navigateTo = (path) => {
    navigate(path)
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between">
        <div id="user-info">
          <span>Hello, {username}</span>
        </div>
      </div>

      <h1 className="mt-4">סיכום חודשי</h1>

      <div className="mb-3">
        <button
          className="btn btn-success mr-2"
          onClick={() => navigateTo("/incomes")}
        >
          <i className="fas fa-plus-circle"></i> הוסף הכנסה
        </button>
        <button
          className="btn btn-danger"
          onClick={() => navigateTo("/expenses")}
        >
          <i className="fas fa-minus-circle"></i> הוסף הוצאה
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="monthSelect">בחר חודש:</label>
        <input
          type="month"
          className="form-control"
          id="monthSelect"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={loadMonthlySummary}>
          הצג סיכום
        </button>
      </div>

      <div id="summary" className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <h3>:הכנסות</h3>
            <p id="totalIncome">{summary.total_income.toLocaleString()}</p>
          </div>
          <div className="col-md-4">
            <h3>:הוצאות</h3>
            <p id="totalExpense">{summary.total_expense.toLocaleString()}</p>
          </div>
          <div className="col-md-4">
            <h3>:יתרה</h3>
            <p id="balance">{summary.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <canvas id="summaryChart" width="400" height="200"></canvas>
    </div>
  )
}

export default Home
