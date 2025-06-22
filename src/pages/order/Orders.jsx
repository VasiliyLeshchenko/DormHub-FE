import React, {useEffect, useState} from 'react';
import {Pagination, Table} from "react-bootstrap";
import OrderService from "../../api/OrderService";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import ErrorUtil from "../../util/ErrorUtil";

const Orders = ({dormId, stafferId, tenantId}) => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const [dorm] = useState(dormId)
    const {user} = useAuth();
    const isTenant = user?.roles?.includes("TENANT");

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, dorm])

    async function fetchOrders() {
        try {
            const response = await OrderService.
            search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "desc",
                    field: "createdAt"
                }
            }, dorm, tenantId, stafferId);
            setOrders(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке заявок:", error);
            showAlert(`Произошла ошибка при загрузке заявок: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        console.log(`/orders/${id}`)
        navigate(`/orders/${id}`);
    };

    function handleAddClick() {
        navigate(`/orders/new?dormId=${dormId}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Заявки</h1>
                </div>
                {isTenant && (
                    <Button onClick={handleAddClick}>Добавить</Button>
                )}
            </div>
            <div className="table-responsive">
                <Table bordered className="custom-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Тема</th>
                        <th>Дата создания</th>
                        <th>Создатель</th>
                        <th>Исполнитель</th>
                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {orders.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{el.title}</td>
                            <td className="text-center">{el.createdAt.split('T').join(" ").split('.')[0]}</td>
                            <td className="text-center"><Link to={`/tenants/${el.creator?.id}`} onClick={(e) => e.stopPropagation()}> {el.creator != null? `${el.creator.lastName} ${el.creator.firstName} ${el.creator.fatherName}` : null}</Link></td>
                            <td className="text-center"><Link to={`/staffers/${el.assigned?.id}`} onClick={(e) => e.stopPropagation()}>{el.assigned != null? `${el.assigned.lastName} ${el.assigned.firstName} ${el.assigned.fatherName}` : null}</Link></td>
                            <td className="text-center">{EnumUtil.getOrderStatus(el.status)}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-end mt-3 mb-3 me-3">
                <DormHubPagination onPageChange={handlePageChange} currentPage={pagination.page} pageSize={pagination.size} total={pagination.total}/>
            </div>
        </div>
    );
};

export default Orders;