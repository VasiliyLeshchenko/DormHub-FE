import React, {useState} from 'react';
import {useAlert} from "../AlertProvider";
import {useAuth} from "../AuthProvider";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ErrorUtil from "../util/ErrorUtil";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const { login: loginUser } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8100/api/dormhub/v1/auth/sign-in", {
                login,
                password
            });
            const token = response.data.token;
            loginUser(token);
            navigate("/dorms");
        } catch (error) {
            showAlert(`Ошибка авторизации: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Container style={{ maxWidth: "400px" }}>
                <h1 className="text-center mb-4" bg="primary" data-bs-theme="dark" style={{ color: "rgb(13, 110, 253)" }}>DormHub</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <FloatingLabel label="Логин" className="mb-3">
                        <Form.Control required type="text" name="login" value={login} onChange={e => setLogin(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Пожалуйста введите логин
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel label="Пароль" className="mb-3">
                        <Form.Control required type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Пожалуйста введите пароль
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="d-flex justify-content-center">
                        <Button type="submit">Войти</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );

};

export default Login;