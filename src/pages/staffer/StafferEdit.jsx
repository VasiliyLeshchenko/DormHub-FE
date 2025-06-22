import React, {useEffect, useState} from 'react';

import StafferService from "../../api/StafferService";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import StafferForm from "../../components/form/StafferForm";
import ErrorUtil from "../../util/ErrorUtil";

const StafferEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        StafferService.getInfoById(id)
            .then(data => {
                const transformed = {
                    ...data,
                    dormId: data.dorm?.id || '',
                    roleIds: data.roles?.map(role => role.id) || [],
                };
                setInitialData(transformed);
            })
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загрузке содрудника: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/staffers");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await StafferService.updateById(id, form);
            showAlert("Сотрудник был успешно обновлен");
            navigate(`/staffers/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении содрудника: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/staffers/${id}`);
        }
    };

    return <StafferForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование сотрудника" />;
};

export default StafferEdit;