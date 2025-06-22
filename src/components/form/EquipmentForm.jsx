import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useAlert} from "../../AlertProvider";
import {useNavigate} from "react-router-dom";

const EquipmentForm = ({ initialData = {}, onSubmit, title = "Добавление оборудования" }) => {
    const [form, setForm] = useState({
        id: '',
        name: '',
        inventoryNumber: '',
        ...initialData,
    });
    const { showAlert } = useAlert();
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

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
        if (formElement.checkValidity() === false) {
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
                        Пожалуйста введите название оборудования
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Инвентарный номер" className="mb-3">
                    <Form.Control required type="number" name="inventoryNumber" value={form.inventoryNumber} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите инвентарный номер оборудования
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default EquipmentForm;