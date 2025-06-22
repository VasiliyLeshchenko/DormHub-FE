import React, {useState} from 'react';

import DutyService from "../../api/DutyService";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import DutyForm from "../../components/form/DutyForm";
import {useAuth} from "../../AuthProvider";
import ErrorUtil from "../../util/ErrorUtil";

const DutyNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const apartmentId = searchParams.get('apartmentId');
    const [initialData, setInitialData] = useState({apartmentId: apartmentId});
    const {user} = useAuth();

    const handleSubmit = async (form) => {
        try {
            const id = await DutyService.save(form);
            showAlert("Дежурство было добавлено успешно");
            navigate(`/duties/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении дежурства: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/duties");
        }
    };

    return <DutyForm onSubmit={handleSubmit} title="Добавление дежурства" initialData={initialData} />;
};

export default DutyNew;