import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import RoleService from "../../api/RoleService";
import DormService from "../../api/DormService";
import {useAlert} from "../../AlertProvider";
import ApartmentService from "../../api/ApartmentService";
import EnumUtil from "../../util/EnumUtil";
import {useNavigate} from "react-router-dom";
import ErrorUtil from "../../util/ErrorUtil";
import InputMask from "@mona-health/react-input-mask";

const TenantForm = ({ initialData = {}, apartmentV, onSubmit, title = "Добавление жильца" }) => {
    const [form, setForm] = useState({
        id: '',
        roleIds: [],
        credential: {
            login: '',
            password: ''
        },
        ...initialData,
    });

    const { showAlert } = useAlert();
    const [roles, setRoles] = useState([])
    const [dorms, setDorms] = useState([])
    const [apartments, setApartments] = useState([])
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [changedDorm, setChangedDorm] = useState(false)

    useEffect(() => {
        setForm(prev => ({ ...prev, ...initialData }));
    }, [initialData]);


    useEffect(() => {
        fetchRoles();
        fetchDorms();
    }, [])

    useEffect(() => {
        if (form.dormId !== "undefined") {
            fetchApartments();
            setForm(prevState => ({...prevState, apartmentId: ''}));
        }
    }, [form.dormId])

    async function fetchRoles() {
        try {
            const response = await RoleService.getAll();
            const roles = response.filter((role) => (role.name !== "STAFFER" && role.name !== "ADMIN"));
            setRoles(roles);
        } catch (error) {
            console.error("Ошибка при загрузке ролей:", error);
            showAlert(`Произошла ошибка при загрузре ролей: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/tenatns");
        }
    }

    async function fetchDorms() {
        try {
            const response = await DormService.getBriefAll();
            setDorms(response);
        } catch (error) {
            console.error("Ошибка при загрузке общежитий:", error);
            showAlert(`Произошла ошибка при загрузке общежитий: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/tenants");
        }
    }

    async function fetchApartments() {
        try {
            const response = await ApartmentService.search(
                {
                    page: 0,
                    size: 10,
                    order: {
                        direction: "asc",
                        field: "number"
                    }
                }, form.dormId, true
            );
            let apartmentsList = response.items || [];

            console.log(changedDorm)
            if (apartmentV && !changedDorm) {
                const exists = apartmentsList.some(a => a.id === apartmentV.id);
                if (!exists) {
                    apartmentsList = [...apartmentsList, apartmentV];
                    setChangedDorm(true)
                }
            }
            const uniqueApartments = Array.from(new Map(apartmentsList.map(a => [a.id, a])).values());

            setApartments(uniqueApartments);
        } catch (error) {
            console.error("Ошибка при загрузке помещений:", error);
            showAlert(`Произошла ошибка при загрузке помещений: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/tenants");
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("credential.")) {
            const field = name.split(".")[1];
            setForm(prev => ({
                ...prev,
                credential: {
                    ...prev.credential,
                    [field]: value
                }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddRole = (e) => {
        const selectedRole = e.target.value;
        if (selectedRole && !form.roleIds.includes(selectedRole)) {
            setForm(prev => ({
                ...prev,
                roleIds: [...prev.roleIds, selectedRole]
            }));
        }
    };

    const handleRemoveRole = (roleId) => {
        setForm(prev => ({
            ...prev,
            roleIds: prev.roleIds.filter(r => r !== roleId)
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
                <FloatingLabel label="Фамилия" className="mb-3">
                    <Form.Control required type="text" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder=""/>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите фамилию
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Имя" className="mb-3">
                    <Form.Control required type="text" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder=""/>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите имя
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Отчество" className="mb-3">
                    <Form.Control type="text" name="fatherName" value={form.fatherName} onChange={handleFormChange} placeholder=""/>
                </FloatingLabel>
                <FloatingLabel label="Пол" className="mb-3">
                    <Form.Select required name="sex" value={form.sex} onChange={handleFormChange}>
                        <option value="">Выберите пол</option>
                        <option value="M">Мужчина</option>
                        <option value="F">Женщана</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите пол
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Дата рождения" className="mb-3">
                    <Form.Control required type="date" name="birthdate" value={form.birthdate} onChange={handleFormChange} />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите дату рождения
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Телефон" className="mb-3">
                    <InputMask
                        mask="8 (99) 999-99-99"
                        maskPlaceholder="_"
                        value={form.phone}
                        onChange={handleFormChange}
                        name="phone"
                        className="form-control"
                        alwaysShowMask={true}
                    />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите номер телефона
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Email" className="mb-3">
                    <Form.Control type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="" />
                </FloatingLabel>
                <FloatingLabel label="Общежитие" className="mb-3">
                    <Form.Select required name="dormId" value={form.dormId} onChange={handleFormChange}>
                        <option value="">Выберите общежитие</option>
                        {dorms.map((dorm) => (<option key={dorm.id} value={dorm.id}>{dorm.name}, {EnumUtil.getDormType(dorm.type)}, {dorm.address}</option>))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите общежитие
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Помещение" className="mb-3">
                    <Form.Select name="apartmentId" value={form.apartmentId} onChange={handleFormChange}>
                        <option value="">Выберите помещение</option>
                        {(apartments).map((apartment) =>  apartment ? (
                            <option key={apartment.id} value={apartment.id}>
                                {apartment.number + apartment.suffix}
                            </option>
                        ) : null)}
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel label="Роли" className="mb-3">
                    <Form.Select required={form.roleIds.length === 0} onChange={handleAddRole}>
                        <option value="">Выберите роль</option>
                        {roles.map((role) => (<option key={role.id} value={role.id}>{EnumUtil.getRole(role.name)}</option>))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите роль
                    </Form.Control.Feedback>
                </FloatingLabel>
                <div className="mb-3">
                    {form.roleIds.map((roleId) => (
                        <span key={roleId} className="badge bg-primary me-2">
                            {EnumUtil.getRole(roles.find(r => r.id === roleId).name)}
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remove"
                                onClick={() => handleRemoveRole(roleId)}
                                style={{ fontSize: "0.6rem", marginLeft: "6px" }}
                            />
                        </span>
                    ))}
                </div>
                <FloatingLabel label="Факультет" className="mb-3">
                    <Form.Select name="faculty" value={form.faculty} onChange={handleFormChange}>
                        <option value="">Выберите факультет</option>
                        <option value="FAMY">ФаМИ</option>
                        <option value="PSY">ПСИ</option>
                        <option value="TECH">ТЕХ</option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel label="Курс" className="mb-3">
                    <Form.Control type="text" name="course" value={form.course} onChange={handleFormChange} placeholder="" />
                </FloatingLabel>
                <FloatingLabel label="Группа" className="mb-3">
                    <Form.Control type="text" name="group" value={form.group} onChange={handleFormChange} placeholder="" />
                </FloatingLabel>
                <FloatingLabel label="Логин" className="mb-3">
                    <Form.Control required type="text" name="credential.login" value={form.credential.login} onChange={handleFormChange} placeholder="" />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите логин
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Пароль" className="mb-3">
                    <Form.Control required type="text" name="credential.password" value={form.credential.password} onChange={handleFormChange} placeholder="" />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите пароль
                    </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default TenantForm;