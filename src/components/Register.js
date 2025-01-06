import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
        first_name: "",
        email: "",
        phone_number: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "https://budget-management-system-1fqb.onrender.com/transaction/register/",
                formValues
            );
            setMessage("Account created successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Sign up error:", error.response?.data || error.message);
            setMessage("Sign up failed. Please check your input.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="text-center">Create Your Account</h1>
                <p className="text-center text-muted">Join us to manage your personal budget!</p>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formValues.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            placeholder="Enter your first name"
                            value={formValues.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone_number"
                            name="phone_number"
                            placeholder="Enter your phone number"
                            value={formValues.phone_number}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-4">
                        Register
                    </button>
                </form>
                {message && (
                    <div className="mt-3 text-center">
                        <p
                            className={
                                message.includes("successfully") ? "text-success" : "text-danger"
                            }
                        >
                            {message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;
