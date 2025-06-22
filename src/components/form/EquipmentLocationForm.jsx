import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useAlert} from "../../AlertProvider";
import EquipmentSearchInput from "../UI/EquipmentSearchInput";
import {useNavigate} from "react-router-dom";

const EquipmentLocationForm = ({ initialData = {}, onSubmit, showSearch, title = "Добавление локации оборудования" }) => {
    const [form, setForm] = useState({
        id: '',
        equipmentId: '',
        apartmentId: '',
        quantity: '',
        ...initialData,
    });
    const { showAlert } = useAlert();
    const [validated, setValidated] = useState(false);
    const [equipment, setEquipment] = useState({id: '', name: ''});
    const navigate = useNavigate();

    useEffect(() => {
        const { equipment, apartment, ...cleanedData } = initialData;
        setForm(prev => ({
            ...prev,
            ...cleanedData,
            equipmentId: equipment?.id ?? '',
            apartmentId: apartment?.id ?? initialData.apartmentId,
        }));
        if (equipment) setEquipment(equipment);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEquipment = (equipment) => {
        setForm(prev => ({
            ...prev,
            equipmentId: equipment.id
        }));
        setEquipment(equipment);
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
                { showSearch && (
                    <EquipmentSearchInput onSelect={handleEquipment}/>
                )}
                <FloatingLabel label="Оборудование" className="mb-3">
                    <Form.Control required type="text" name="name" value={equipment.name} disabled={true} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите оборудование
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Количество" className="mb-3">
                    <Form.Control required type="number" name="quantity" min={1} value={form.quantity} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите количество оборудования (минимум 1)
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default EquipmentLocationForm;