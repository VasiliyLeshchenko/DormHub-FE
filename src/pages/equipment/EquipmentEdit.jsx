import React, {useEffect, useState} from 'react';

import EquipmentService from "../../api/EquipmentService";
import {useNavigate, useParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import EquipmentForm from "../../components/form/EquipmentForm";
import ErrorUtil from "../../util/ErrorUtil";

const EquipmentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        EquipmentService.getById(id)
            .then(setInitialData)
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загрузке оборудования: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/equipments");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await EquipmentService.updateById(id, form);
            showAlert("Оборудование было успешно обновлено");
            navigate(`/equipments/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обнолении оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/equipments/${id}`);
        }
    };

    return <EquipmentForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование оборудования" />;
};

export default EquipmentEdit;