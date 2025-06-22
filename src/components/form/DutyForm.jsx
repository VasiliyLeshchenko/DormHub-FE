import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DormService from "../../api/DormService";
import {useAlert} from "../../AlertProvider";
import ApartmentService from "../../api/ApartmentService";
import TenantService from "../../api/TenantService";
import {useNavigate} from "react-router-dom";
import ErrorUtil from "../../util/ErrorUtil";

const DutyForm = ({ initialData = {}, onSubmit, title = "Добавление дежурства" }) => {
    const [form, setForm] = useState({
        tenantIds: [],
        ...initialData,
    });

    const { showAlert } = useAlert();
    const [dorms, setDorms] = useState([])
    const [tenants, setTenants] = useState([])
    const [apartments, setApartments] = useState([])
    const [validated, setValidated] = useState(false);
    const isEmptyApartment = !initialData.apartmentId || initialData.apartmentId === "undefined";
    const navigate = useNavigate();

    useEffect(() => {
        setForm(prev => ({ ...prev, ...initialData }));
    }, [initialData]);


    useEffect(() => {
        fetchDorms();
    }, [])

    useEffect(() => {
        if (form.dormId && form.dormId !== "undefined") {
            fetchApartments();
        }
    }, [form.dormId])

    useEffect(() => {
        if (form.apartmentId && form.apartmentId !== "undefined") {
            fetchTenants();
        }
    }, [form.apartmentId])

    async function fetchDorms() {
        try {
            const response = await DormService.getBriefAll();
            setDorms(response);
        } catch (error) {
            console.error("Ошибка при загрузке общежитий:", error);
            showAlert(`Ошибка при загрузке общежитий: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/duties");
        }
    }

    async function fetchApartments() {
        try {
            const response = await ApartmentService.search(
                {
                    page: 0,
                    size: 20,
                    order: {
                        direction: "asc",
                        field: "number"
                    }
                }, form.dormId
            );
            setApartments(response.items);
        } catch (error) {
            console.error("Ошибка при загрузке помещений:", error);
            showAlert(`Произошла ошибка при загрузке помещений: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/duties");
        }
    }

    async function fetchTenants() {
        try {
            const response = await TenantService.search(
                {
                    page: 0,
                    size: 20,
                    order: {
                        direction: "asc",
                        field: "name"
                    }
                }, null, form.apartmentId
            );
            setTenants(response.items);
        } catch (error) {
            console.error("Ошибка при загрузке жильцов:", error);
            showAlert(`Произошла ошибка при загрузке жильцов: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/duties");
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTenant = (e) => {
        const selectedTenant = e.target.value;
        if (selectedTenant && !form.tenantIds.includes(selectedTenant)) {
            setForm(prev => ({
                ...prev,
                tenantIds: [...prev.tenantIds, selectedTenant]
            }));
        }
    };

    const handleRemoveTenant = (tenantId) => {
        setForm(prev => ({
            ...prev,
            tenantIds: prev.tenantIds.filter(t => t !== tenantId)
        }));
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
                <FloatingLabel label="Дата" className="mb-3">
                    <Form.Control required type="date" name="date" value={form.date} onChange={handleFormChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйта введите дату дежурства
                    </Form.Control.Feedback>
                </FloatingLabel>
                {isEmptyApartment && (
                    <div>
                        <FloatingLabel label="Общежитие" className="mb-3">
                            <Form.Select required name="dormId" value={form.dormId} onChange={handleFormChange}>
                                <option value="">Выберите общежитие</option>
                                {dorms.map((dorm) => (<option key={dorm.id} value={dorm.id}>{dorm.name}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Пожалуйста выберите общежитие
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel label="Помещение" className="mb-3">
                        <Form.Select required name="apartmentId" value={form.apartmentId} onChange={handleFormChange}>
                        <option value="">Выберите помещение</option>
                    {apartments.map((apartment) => (<option key={apartment.id} value={apartment.id}>{apartment.number + apartment.suffix}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Пожалуйста введите помещение для дежурства
                        </Form.Control.Feedback>
                        </FloatingLabel>
                    </div>
                )}
                <FloatingLabel label="Жильцы" className="mb-3">
                    <Form.Select required={form.tenantIds.length === 0} name="tenantIds" onChange={handleAddTenant}>
                        <option value="">Выберите жильца</option>
                        {tenants.map((tenant) => (<option key={tenant.id} value={tenant.id}>{`${tenant.lastName} ${tenant.firstName} ${tenant.fatherName}`}</option>))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите жильца
                    </Form.Control.Feedback>
                </FloatingLabel>
                <div className="mb-3">
                    {form.tenantIds.map((tenantId) => (
                        <span key={tenantId} className="badge bg-primary me-2">
                            {(() => {
                                const tenant = tenants.find(t => t.id === tenantId);
                                return tenant
                                    ? `${tenant.lastName} ${tenant.firstName} ${tenant.fatherName}`
                                    : "Неизвестный жилец";
                            })()}
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remove"
                                onClick={() => handleRemoveTenant(tenantId)}
                                style={{ fontSize: "0.6rem", marginLeft: "6px" }}
                            />
                        </span>
                    ))}
                </div>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default DutyForm;