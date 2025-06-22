import React, {useState} from 'react';

import TenantService from "../../api/TenantService";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import TenantForm from "../../components/form/TenantForm";
import {useAuth} from "../../AuthProvider";
import ErrorUtil from "../../util/ErrorUtil";

const TenantNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const dormId = searchParams.get('dormId');
    const [initialData, setInitialData] = useState({dormId: dormId});
    const {user} = useAuth();

    const handleSubmit = async (form) => {
        try {
            const id = await TenantService.save(form);
            showAlert("Жилец был добавлен успешно");
            navigate(`/tenants/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении жильца: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/tenants");
        }
    };

    return <TenantForm onSubmit={handleSubmit} title="Добавление жильца" initialData={initialData} />;
};

export default TenantNew;