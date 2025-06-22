import React, {useState} from 'react';

import ApartmentService from "../../api/ApartmentService";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import { useSearchParams } from 'react-router-dom';
import ApartmentForm from "../../components/form/ApartmentForm";
import ErrorUtil from "../../util/ErrorUtil";

const ApartmentNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const dormId = searchParams.get('dormId');
    const parentId = searchParams.get('parentId');
    const [initialData, setInitialData] = useState({dormId: dormId, parentId: parentId});

    const handleSubmit = async (form) => {
        try {
            const id = await ApartmentService.save(form);
            showAlert("Помещение было успешно добавлено");
            navigate(`/apartments/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при похранении помещения: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/dorms");
        }
    };

    return <ApartmentForm onSubmit={handleSubmit} title="Добавление помещения" initialData={initialData} />;
};

export default ApartmentNew;