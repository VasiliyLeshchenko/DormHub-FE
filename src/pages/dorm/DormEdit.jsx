import React, {useEffect, useState} from 'react';

import DormService from "../../api/DormService";
import {useNavigate, useParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import DormForm from "../../components/form/DormForm";
import ErrorUtil from "../../util/ErrorUtil";

const DormEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        DormService.getById(id)
            .then(setInitialData)
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загрузке общежития: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/dorms");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await DormService.updateById(id, form);
            showAlert("Общежитие было обновлено успешно");
            navigate(`/dorms/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении общежития: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/dorms/${id}`);
        }
    };

    return <DormForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование общежития" />;
};

export default DormEdit;