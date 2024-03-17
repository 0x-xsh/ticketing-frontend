import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./auth_provider";


const Signup = () => {
    const auth = useAuth();
    let navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);

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
        
        

        const body = {
            'first_name': input.firstName,
            'last_name': input.lastName,
            'username': input.username,
            'password': input.password,
            'is_fr': input.country === "FR",
            'is_dz': input.country === "DZ",
        }
        setLoading(true);
        try {

            
           await auth.signup(body);
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
                    <h3 className="Auth-form-title">Créer un compte</h3>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Prénom"
                            name="firstName"
                            value={input.firstName}
                            onChange={handleInputChange}
                        />
                        {errors.names && (
                            <p className="text-danger">Prénom/Nom sont obligatoires</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder="Nom"
                            name="lastName"
                            value={input.lastName}
                            onChange={handleInputChange}
                        />
                        {errors.names && (
                            <p className="text-danger">Prénom/Nom sont obligatoires</p>
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
                            <p className="text-danger">l'identifiant doit contenir que des alphabets</p>
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
                            <p className="text-danger">le mot de passe doit contenir au moin un majiscule</p>
                        )}
                        {errors.number && (
                            <p className="text-danger">le mot de passe doit contenir au moin un nombre</p>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Confirmer le mot de passe"
                            name="confirmPassword"
                            value={input.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.passwordMatch && (
                            <p className="text-danger">Les mots de passe ne correspondent pas</p>
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
                            <p className="text-danger">Vous Devez choisir entre DZ ou FR</p>
                        )}
                    </div>
                    
                    {loading && (
                        <div className="text-center mt-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    )}
                    {!loading && (
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Creer le Compte
                            </button>
                        </div>
                    )}
                     {ApiError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {ApiError}
                    </div>
                )}
                    
                    <p className="forgot-password text-right mt-2">
                    Vous avez déjà un compte? <Link to="/login">Se Connecter</Link>
                    </p>
                </div>
               
            </form>
        </div>
    );
};

export default Signup;

