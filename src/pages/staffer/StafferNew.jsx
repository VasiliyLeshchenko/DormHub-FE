import React, {useState} from 'react';

import StafferService from "../../api/StafferService";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import StafferForm from "../../components/form/StafferForm";
import ErrorUtil from "../../util/ErrorUtil";

const StafferNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const dormId = searchParams.get('dormId');
    const [initialData, setInitialData] = useState({dormId: dormId});

    const handleSubmit = async (form) => {
        try {
            const id = await StafferService.save(form);
            showAlert("Сотрудник был успешно добавлен");
            navigate(`/staffers/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении содрудника: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/staffers");
        }
    };

    return <StafferForm onSubmit={handleSubmit} title="Добавлении сотрудника" initialData={initialData} />;
};

export default StafferNew;