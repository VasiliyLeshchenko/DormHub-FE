import React, {useEffect, useState} from 'react';

import OrderService from "../../api/OrderService";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import OrderForm from "../../components/form/OrderForm";
import ErrorUtil from "../../util/ErrorUtil";

const OrderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [initialData, setInitialData] = useState({id: id});

    useEffect(() => {
        OrderService.getById(id)
            .then(setInitialData)
            .catch(err => {
                console.error(err);
                showAlert(`Произошла ошибка при загрузке заявки:${ErrorUtil.getErrorMessage(err)}`, "danger");
            });
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            await OrderService.updateById(id, form);
            showAlert("Заявка обновлена успешно");
            navigate(`/orders/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при обновлении заявки: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/orders/${id}`);
        }
    };

    return <OrderForm initialData={initialData} onSubmit={handleSubmit} title="Редактирование заявки" showStaffer={true} />;
};

export default OrderEdit;