import React, {useState} from 'react';

import DormService from "../../api/DormService";
import {useNavigate, useParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import DormForm from "../../components/form/DormForm";
import ErrorUtil from "../../util/ErrorUtil";

const DormNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const dormId = useParams("dormId");

    const handleSubmit = async (form) => {
        try {
            const id = await DormService.save(form);
            showAlert("Общежитие было добавлено успешно");
            navigate(`/dorms/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении общежития: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/dorms")
        }
    };

    return <DormForm onSubmit={handleSubmit} title="Добавление общежития" />;
};

export default DormNew;