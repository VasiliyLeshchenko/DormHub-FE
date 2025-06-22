import React, {useState} from 'react';

import OrderService from "../../api/OrderService";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import OrderForm from "../../components/form/OrderForm";
import {useAuth} from "../../AuthProvider";
import ErrorUtil from "../../util/ErrorUtil";

const OrderNew = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {user} = useAuth()
    const [initialData, setInitialData] = useState({creatorId: user.sub, createdAt: new Date().toISOString()});

    const handleSubmit = async (form) => {
        try {
            const id = await OrderService.save(form);
            showAlert("Заявка была добавлена успешна");
            navigate(`/orders/${id}`);
        } catch (error) {
            console.error(error);
            showAlert(`Произошла ошибка при добавлении заявки: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate("/orders");
        }
    };

    return <OrderForm onSubmit={handleSubmit} title="Создание заявки" initialData={initialData} />;
};

export default OrderNew;