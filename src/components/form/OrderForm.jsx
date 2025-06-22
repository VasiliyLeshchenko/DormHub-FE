import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import StafferSearchInput from "../UI/StafferSearchInput";
import {useNavigate} from "react-router-dom";

const OrderForm = ({ initialData = {}, showStaffer, onSubmit, title = "Создание заявки" }) => {
    const [form, setForm] = useState({
        id: '',
        createdAt: '',
        title: '',
        description: '',
        status: '',
        creatorId: null,
        assignedId: null,
        ...initialData,
    });
    const [validated, setValidated] = useState(false);
    const [assigned, setAssigned] = useState({id: '', lastName: '', firstName: '', fatherName: ''});
    const navigate = useNavigate();

    useEffect(() => {
        const { creator, assigned, ...cleanedData } = initialData;
        setForm(prev => ({
            ...prev,
            ...cleanedData,
            assignedId: assigned?.id ?? '',
            creatorId: creator?.id ?? initialData.creatorId,
        }));
        if (assigned) setAssigned(assigned);
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

    const handleAssigned = (assigned) => {
        setForm(prev => ({
            ...prev,
            assignedId: assigned.id
        }));
        setAssigned(assigned);
    };

    return (
        <Container>
            <div className="text-center">
                <h1>{title}</h1>
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <FloatingLabel label="Тема" className="mb-3">
                    <Form.Control required type="text" name="title" value={form.title} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите тему заявки
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Form.Group className="mb-3" controlId="">
                    <FloatingLabel label="Описание" className="mb-3">
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={{ height: '100px' }}
                        />
                    </FloatingLabel>
                </Form.Group>
                { showStaffer && (
                    <div>
                        <StafferSearchInput onSelect={handleAssigned}/>
                        <FloatingLabel label="Assigned" className="mb-3">
                            <Form.Control required type="text" name="assignedId" value={[assigned?.lastName, assigned?.firstName, assigned?.fatherName]
                                .filter(Boolean)
                                .join(' ')} disabled={true} />
                            <Form.Control.Feedback type="invalid">
                                Пожалуйста введите исполнителя
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </div>
                )}
                <FloatingLabel label="Статус" className="mb-3">
                    <Form.Select required name="status" value={form.status} onChange={handleChange}>
                        <option value="">Выберите статус заявки</option>
                        <option value="NEW">Создана</option>
                        <option value="IN_PROGRESS">Исполняется</option>
                        <option value="DONE">Готово</option>
                        <option value="REJECTED">Отклонена</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите статус заяки
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default OrderForm;