import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth_provider";

const Login = () => {
    const auth = useAuth();
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Set loading state to true while awaiting response

        try {
            await auth.loginAction(input);
        } catch (error) {
            console.log(error);
            setError(error.message);
        } finally {
            setLoading(false); // Reset loading state after response is received
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Username"
                            name="username"
                            value={input.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}
                    {loading && (
                        <div className="text-center mt-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {!loading && (
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    )}
                    <p className="forgot-password text-right mt-2">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
