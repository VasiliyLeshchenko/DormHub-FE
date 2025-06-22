import React, {useEffect, useState} from 'react';

import TenantService from "../../api/TenantService";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import TenantForm from "../../components/form/TenantForm";
import ErrorUtil from "../../util/ErrorUtil";

const TenantEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});
    const [apartment, setApartment] = useState(null);

    useEffect(() => {
        TenantService.getInfoById(id)
            .then(data => {
                const transformed = {
                    ...data,
                    dormId: data.dorm?.id || '',
                    roleIds: data.roles?.map(role => role.id) || [],
                    apartmentId: data.apartment?.id || ''
                };
                setInitialData(transformed);
                console.log(data);
                if (data.apartment) {
                    setApartment(data.apartment)
                }
            })
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при получении жильца: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/tenants");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await TenantService.updateById(id, form);
            showAlert("Жилец был успешно обновлен");
            navigate(`/tenants/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении жильца: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/tenants/${id}`);
        }
    };

    return <TenantForm initialData={initialData} apartmentV={apartment} onSubmit={handleSubmit} title="Редактирование жильца" />;
};

export default TenantEdit;