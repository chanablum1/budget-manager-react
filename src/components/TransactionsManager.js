import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function TransactionsManager({ transactionType }) {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [formValues, setFormValues] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
    payment_method: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    loadTransactions();
    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionType]);

  const loadTransactions = async () => {
    try {
      const response = await axios.get(
        `https://budget-management-system-1fqb.onrender.com/transaction/transactions/?type=${transactionType}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(
        `https://budget-management-system-1fqb.onrender.com/transaction/categories/?type=${transactionType}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (key === "category") {
        return direction === "asc"
          ? a.category.name.localeCompare(b.category.name)
          : b.category.name.localeCompare(a.category.name);
      }
      if (key === "date") {
        return direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (key === "amount") {
        return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentItem
        ? `https://budget-management-system-1fqb.onrender.com/transaction/transactions/${currentItem.id}/`
        : `https://budget-management-system-1fqb.onrender.com/transaction/transactions/`;

      const method = currentItem ? "put" : "post";

      await axios[method](
        url,
        { ...formValues, category: parseInt(formValues.category) },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setFormValues({
        date: "",
        category: "",
        amount: "",
        description: "",
        payment_method: "",
      });
      setCurrentItem(null);
      setShowModal(false);
      loadTransactions();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://budget-management-system-1fqb.onrender.com/transaction/transactions/${id}/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      loadTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4">{transactionType === "income" ? "ניהול הכנסות" : "ניהול הוצאות"}</h1>
      <Button
        // className="mb-3"
        className={transactionType === "income" ? "btn btn-success mr-2" : "btn btn-danger"}

        onClick={() => {
          setCurrentItem(null);
          setFormValues({
            date: "",
            category: "",
            amount: "",
            description: "",
            payment_method: "",
          });
          setShowModal(true);
        }}
      >
        {transactionType === "income" ? "הוסף הכנסה" : "הוסף הוצאה"}
      </Button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>
              תאריך {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "⬆" : "⬇") : ""}
            </th>
            <th onClick={() => handleSort("amount")}>
              סכום {sortConfig.key === "amount" ? (sortConfig.direction === "asc" ? "⬆" : "⬇") : ""}
            </th>
            <th onClick={() => handleSort("category")}>
              קטגוריה {sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "⬆" : "⬇") : ""}
            </th>
            <th>תיאור</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>{item.category?.name || "לא זוהתה קטגוריה"}</td>
              <td>{item.description}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => {
                    setCurrentItem(item);
                    setFormValues({
                      date: item.date,
                      category: item.category.id,
                      amount: item.amount,
                      description: item.description,
                      payment_method: item.payment_method,
                    });
                    setShowModal(true);
                  }}
                >
                  עדכן
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  מחק
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? "עדכון פריט" : transactionType === "income" ? "הוסף הכנסה" : "הוסף הוצאה"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="date">תאריך</label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formValues.date}
                onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">קטגוריה</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formValues.category}
                onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                required
              >
                <option value="" disabled>
                  בחר קטגוריה
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">סכום</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formValues.amount}
                onChange={(e) => setFormValues({ ...formValues, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">תיאור</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="payment_method">אמצעי תשלום</label>
              <select
                className="form-control"
                id="payment_method"
                name="payment_method"
                value={formValues.payment_method}
                onChange={(e) => setFormValues({ ...formValues, payment_method: e.target.value })}
                required
              >
                <option value="" disabled>
                  בחר אמצעי תשלום
                </option>
                <option value="cash">מזומן</option>
                <option value="credit_card">כרטיס אשראי</option>
                <option value="bank_transfer">העברה בנקאית</option>
                <option value="check">צ'ק</option>
              </select>
            </div>
            <Button type="submit" variant="primary">
              {currentItem ? "עדכן" : "שמור"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TransactionsManager;
