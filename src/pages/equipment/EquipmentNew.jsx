import React, {useState} from 'react';

import EquipmentService from "../../api/EquipmentService";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import EquipmentForm from "../../components/form/EquipmentForm";
import ErrorUtil from "../../util/ErrorUtil";

const EquipmentNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState(null);

    const handleSubmit = async (form) => {
        try {
            const id = await EquipmentService.save(form);
            showAlert("Оборудование было добавлено успешно");
            navigate(`/equipments/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/equipments");
        }
    };

    return <EquipmentForm onSubmit={handleSubmit} title="Добавление оборудования" initialData={initialData} />;
};

export default EquipmentNew;