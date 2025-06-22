import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DormService from "../../api/DormService";
import {useAlert} from "../../AlertProvider";
import RoleService from "../../api/RoleService";
import EnumUtil from "../../util/EnumUtil";
import {useNavigate} from "react-router-dom";
import ErrorUtil from "../../util/ErrorUtil";
import InputMask from "@mona-health/react-input-mask";

const StafferForm = ({ initialData = {}, onSubmit, title = "Добавление сотрудника" }) => {
    const [form, setForm] = useState({
        id: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        sex: '',
        birthdate: '',
        phone: '',
        email: '',
        dormId: '',
        position: '',
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
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [touched, setTouched] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [wasSend, setWasSend] = useState(false);
    const [isInvalidNumber, setIsInvalidNumber] = useState(false);

    useEffect(() => {
        setForm(prev => ({ ...prev, ...initialData }));
    }, [initialData]);

    useEffect(() => {
        fetchRoles();
        fetchDorms();
    }, [])

    async function fetchRoles() {
        try {
            const response = await RoleService.getAll();
            const roles = response.filter((role) => (role.name !== "TENANT"));
            setRoles(roles);
        } catch (error) {
            console.error("Ошибка при загрузке ролей:", error);
            showAlert(`Произошла ошибка при загрузре ролей: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/staffers");
        }
    }

    async function fetchDorms() {
        try {
            const response = await DormService.getBriefAll();
            setDorms(response);
        } catch (error) {
            console.error("Ошибка при загрузке общежитий:", error);
            showAlert(`Произошла ошибка при загрузке общежитий: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/staffers");
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
        setWasSend(true);
        const formElement = e.currentTarget;

        const isPhoneValid = form.phone.includes('-') && !form.phone.includes('_');
        setIsInvalidNumber(!isPhoneValid);
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
                        <option value="M">Мущина</option>
                        <option value="F">Женщина</option>
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
                        alwaysShowMask={true}
                        className={`form-control ${wasSend && isInvalidNumber ? "is-invalid" : wasSend ? "is-valid" : ""}`}
                    />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста введите номер телефонаx`
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Email" className="mb-3">
                    <Form.Control type="text" name="email" value={form.email} onChange={handleFormChange} placeholder="" />
                </FloatingLabel>
                <FloatingLabel label="Должность" className="mb-3">
                    <Form.Select required name="position" value={form.position} onChange={handleFormChange}>
                        <option value="">Выберите должность сотрудника</option>
                        <option value="DIRECTOR">Заведующий</option>
                        <option value="TECHNICAL_SPECIALIST">Технический сотрудник</option>
                        <option value="MENTOR">Воспитатель</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста выберите позицию
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel label="Общежитие" className="mb-3">
                    <Form.Select name="dormId" value={form.dormId} onChange={handleFormChange}>
                        <option value="">Выберите общежитие</option>
                        {dorms.map((dorm) => (<option key={dorm.id} value={dorm.id}>{dorm.name}, {EnumUtil.getDormType(dorm.type)}, {dorm.address}</option>))}
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
                <Button type="submit" className="mb-3">Сохранить</Button>
            </Form>
        </Container>
    );
};

export default StafferForm;