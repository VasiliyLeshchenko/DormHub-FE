import React, {useEffect, useState} from 'react';

import DutyService from "../../api/DutyService";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import DutyForm from "../../components/form/DutyForm";
import ErrorUtil from "../../util/ErrorUtil";

const DutyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        DutyService.getById(id)
            .then(data => {
                const transformed = {
                    ...data,
                    tenantIds: data.tenants?.map(tenant => tenant.id) || [],
                    apartmentId: data.apartment?.id || ''
                };
                setInitialData(transformed);
            })
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загрузке дежурства: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate(`/duties/${id}`);
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await DutyService.updateById(id, form);
            showAlert("Дежурство было успешно обновлено");
            navigate(`/duties/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении дежурства: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/duties/${id}`);
        }
    };

    return <DutyForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование дежурства" />;
};

export default DutyEdit;