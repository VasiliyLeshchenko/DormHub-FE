import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useAuth} from "../../AuthProvider";
import {useNavigate} from "react-router-dom";
import InputMask from "@mona-health/react-input-mask";

const DormForm = ({ initialData = {}, onSubmit, title = "Добавление общежития" }) => {
    const [form, setForm] = useState({
        id: '',
        name: '',
        type: '',
        address: '',
        postalCode: '',
        phone: '',
        ...initialData,
    });
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [phoneError, setPhoneError] = useState(false);
    const [touched, setTouched] = useState(false);


    useEffect(() => {
        setForm(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formElement = e.currentTarget;

        const isPhoneValid = form.phone.includes('-') && !form.phone.includes('_');

        if (formElement.checkValidity() === false || !isPhoneValid) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        onSubmit(form);
    };

    return (
        <Container>
            <div className="text-center">
                <h1>{title}</h1>
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <FloatingLabel label="Название" className="mb-3">
                    <Form.Control required type="text" name="name" value={form.name} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите название общежития
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Тип" className="mb-3">
                    <Form.Select required name="type" value={form.type} onChange={handleChange}>
                        <option value="">Выберите тип общежития</option>
                        <option value="CORRIDOR">Корридорное</option>
                        <option value="BLOCK">Блочное</option>
                        <option value="FLAT">Квартирное</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите тип общежития
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Адрес" className="mb-3">
                    <Form.Control required type="text" name="address" value={form.address} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите адрес общежития
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Почтовый индекс" className="mb-3">
                    <Form.Control required minLength={6} maxLength={6} pattern="\d{6}" inputMode="numeric" name="postalCode" value={form.postalCode} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите почтовый индекс общежития
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Телефон" className="mb-3">
                    <InputMask
                        mask="8 (9999) 99-99-99"
                        maskPlaceholder="_"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={() => setTouched(true)}
                        name="phone"
                        alwaysShowMask={true}
                        className={`form-control ${touched && (!form.phone.includes("-") || form.phone.includes("_")) ? "is-invalid" : touched ? "is-valid" : ""}`}
                    />
                    <Form.Control.Feedback type="invalid">
                        Пожалуста введите номер телефона общежития
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default DormForm;