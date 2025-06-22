import React, {useEffect, useState} from 'react';

import ApartmentService from "../../api/ApartmentService";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import ApartmentForm from "../../components/form/ApartmentForm";
import ErrorUtil from "../../util/ErrorUtil";

const ApartmentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams();
    const dormId = searchParams.get('dormId');
    const parentId = searchParams.get('parentId');
    const [initialData, setInitialData] = useState({id: id, dormId: dormId, parentId: parentId});

    useEffect(() => {
        ApartmentService.getById(id)
            .then(setInitialData)
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загруке помещения: ${ErrorUtil.getErrorMessage(err)}`, "danger");
                navigate("/dorms")
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await ApartmentService.updateById(id, form);
            showAlert("Помещение успешно обновлено");
            navigate(`/apartments/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Ошибка при обновлении помещения: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/apartments/${id}`)
        }
    };

    return <ApartmentForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование помещения" />;
};

export default ApartmentEdit;