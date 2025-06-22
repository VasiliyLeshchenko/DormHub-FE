import React, {useEffect, useState} from 'react';

import {useNavigate, useParams} from "react-router-dom";
import EquipmentLocationForm from "../../../components/form/EquipmentLocationForm";
import EquipmentLocationService from "../../../api/EquipmentLocationService";
import {useAlert} from "../../../AlertProvider";
import ErrorUtil from "../../../util/ErrorUtil";

const EquipmentLocationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        EquipmentLocationService.getById(id)
            .then(setInitialData)
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при получении локации оборудования: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/equipment-locations");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await EquipmentLocationService.updateById(id, form);
            showAlert("Локация оборудования была обновлена успешно");
            navigate(`/equipment-locations/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении локация оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/equipment-locations/${id}`);
        }
    };

    return <EquipmentLocationForm initialData={initialData} onSubmit={handleSubmit} title="Редактирования локации оборудования" showSearch={false}/>;
};

export default EquipmentLocationEdit;