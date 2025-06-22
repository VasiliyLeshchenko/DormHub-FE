import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DormService from "../../api/DormService";
import {useAlert} from "../../AlertProvider";
import ErrorUtil from "../../util/ErrorUtil";
import {useNavigate} from "react-router-dom";
import EnumUtil from "../../util/EnumUtil";

const ApartmentForm = ({ initialData = {}, onSubmit, title = "Добавление помещения" }) => {
    const [form, setForm] = useState({
        id: '',
        number: '',
        parentId: '',
        suffix: null,
        flor: '',
        dormId: '',
        children: [],
        ...initialData,
    });
    const [dorms, setDorms] = useState([])
    const { showAlert } = useAlert();
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setForm(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

    useEffect(() => {
        fetchDorms();
    }, [])

    async function fetchDorms() {
        try {
            const response = await DormService.getBriefAll();
            setDorms(response);
        } catch (error) {
            console.error("Не удалось загрузить общежития:", error);
            showAlert(`Произошла ошибка при загрузке общежитий: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/apartments");
        }
    }

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
                <FloatingLabel label="Номер" className="mb-3">
                    <Form.Control required type="number" min={1} name="number" value={form.number} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите номер помещения
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Суффикс" className="mb-3">
                    <Form.Control type="text" name="suffix" value={form.suffix} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel label="Общежитие" className="mb-3">
                    <Form.Select
                        required
                        name="dormId"
                        value={form.dormId}
                        onChange={handleChange}
                        disabled={form.parentId}
                    >
                        <option value="">Выберите общежитие</option>
                        {dorms.map((dorm) => (<option key={dorm.id} value={dorm.id}>{dorm.name}, {EnumUtil.getDormType(dorm.type)}, {dorm.address}</option>))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите общежиние
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Этаж" className="mb-3">
                    <Form.Control required type="number" min={0} name="floor" value={form.floor} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите этаж помещения
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Тип" className="mb-3">
                    <Form.Select required name="type" value={form.type} onChange={handleChange}>
                        <option value="">Выберите тип помещения</option>
                        <option value="ROOM">Комната</option>
                        <option value="BLOCK">Блок</option>
                        <option value="KITCHEN">Кухня</option>
                        <option value="OFFICE">Кабинет</option>
                        <option value="TECHNICAL_ROOM">Техническое помещение</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите тип помещения
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Вместимость" className="mb-3">
                    <Form.Control required type="size" name="size" min={0} value={form.size} onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите вместимость
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default ApartmentForm;