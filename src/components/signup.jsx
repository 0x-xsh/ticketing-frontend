import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        country: "",
    });
    const [errors, setErrors] = useState({
        passwordMatch: false,
        uppercaseLetter: false,
        number: false,
        englishUsername: false,
        usernameLength: false,
        passwordLength: false,
        country: false,
        names: false,
    });
    const [ApiError, setApiError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setInput((prev) => ({
                ...prev,
                country: name,
            }));
        } else {
            setInput((prev) => ({
                ...prev,
                country: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setErrors({
            passwordMatch: input.password !== input.confirmPassword,
            uppercaseLetter: !/(?=.*[A-Z])/.test(input.password),
            number: !/(?=.*[0-9])/.test(input.password),
            usernameLength: input.username.length > 30,
            passwordLength: input.password.length > 30,
            englishUsername: !/^[a-zA-Z0-9.]+$/.test(input.username),
            country: input.country === "",
            names: input.lastName === "" || input.firstName === "",
        });

        if (
            input.password !== input.confirmPassword ||
            !/(?=.*[A-Z])/.test(input.password) ||
            !/(?=.*[0-9])/.test(input.password) ||
            input.username.length > 30 ||
            input.password.length > 30 ||
            !/^[a-zA-Z0-9.]+$/.test(input.username) ||
            input.country === ""
        ) {
            return;
        }

        setLoading(true);

        const body = {
            'first_name': input.firstName,
            'last_name': input.lastName,
            'username': input.username,
            'password': input.password,
            'is_fr': input.country === "FR",
            'is_dz': input.country === "DZ",
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const responseData = await response.json();
            console.log(responseData);
            if (!response.ok) {
                throw Error(responseData.error)
            } else {
               alert('Your account has been created successfully')
                navigate('/login', { replace: true });
            }
        } catch (error) {
            setApiError(error.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="First Name"
                            name="firstName"
                            value={input.firstName}
                            onChange={handleInputChange}
                        />
                        {errors.names && (
                            <p className="text-danger">First and last name are mandatory</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Last Name"
                            name="lastName"
                            value={input.lastName}
                            onChange={handleInputChange}
                        />
                        {errors.names && (
                            <p className="text-danger">First and last name are mandatory</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Username (English only)"
                            name="username"
                            value={input.username}
                            onChange={handleInputChange}
                        />
                        {errors.englishUsername && (
                            <p className="text-danger">Username can only contain Latin letters</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={handleInputChange}
                        />
                        {errors.uppercaseLetter && (
                            <p className="text-danger">Password must contain at least one uppercase letter</p>
                        )}
                        {errors.number && (
                            <p className="text-danger">Password must contain at least one number</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={input.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.passwordMatch && (
                            <p className="text-danger">Passwords do not match</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <div className="form-check form-check-inline">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="frCheckbox"
                                name="FR"
                                checked={input.country === "FR"}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="frCheckbox">
                                FR
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="dzCheckbox"
                                name="DZ"
                                checked={input.country === "DZ"}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="dzCheckbox">
                                DZ
                            </label>
                        </div>
                        {errors.country && (
                            <p className="text-danger">You must choose a country</p>
                        )}
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        {loading ? (
                            <button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        )}
                    </div>
                    <ToastContainer
                        transition={Bounce}
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <p className="forgot-password text-right mt-2">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
                {ApiError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {ApiError}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Signup;

