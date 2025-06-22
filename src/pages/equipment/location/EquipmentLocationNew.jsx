import React, {useState} from 'react';

import {useNavigate, useSearchParams} from "react-router-dom";
import EquipmentLocationForm from "../../../components/form/EquipmentLocationForm";
import EquipmentLocationService from "../../../api/EquipmentLocationService";
import {useAlert} from "../../../AlertProvider";
import ErrorUtil from "../../../util/ErrorUtil";

const EquipmentLocationNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const apartmentId = searchParams.get('apartmentId');
    const [initialData, setInitialData] = useState({apartmentId: apartmentId});

    const handleSubmit = async (form) => {
        try {
            console.log(form)
            const id = await EquipmentLocationService.save(form);
            showAlert("Локация оборудования была добавлена успешно");
            navigate(`/equipment-locations/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении локация оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/equipment-locations`);
        }
    };

    return <EquipmentLocationForm onSubmit={handleSubmit} title="Добавление локации оборудования" initialData={initialData} showSearch={true}/>;
};

export default EquipmentLocationNew;