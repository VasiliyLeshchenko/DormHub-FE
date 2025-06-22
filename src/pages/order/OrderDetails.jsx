import React, {useEffect, useState} from 'react';
import OrderService from "../../api/OrderService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import EnumUtil from "../../util/EnumUtil";
import ErrorUtil from "../../util/ErrorUtil";

const OrderDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchOrder();
    }, [id])

    async function fetchOrder() {
        try {
            const response = await OrderService.getById(id);
            setOrder(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке заявки:", error);
            showAlert(`Произошла ошибка при загрузке заявки: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/orders");
        }
    }

    async function callDelete() {
        try {
            await OrderService.deleteById(id);
            showAlert("Заявка была успешно удалена");
            navigate("/orders");
        } catch (error) {
            showAlert(`Произошла ошибка при удалении заявки: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate("/orders" + `/${id}` + `/edit`);
    }

    return (
        <div
            className={`table-responsive ${loading ? "loading" : "loaded"}`}
        >
            {loading ? (
                <div className="spinner-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Container className="custom-card">
                    <Row>
                        <Col>
                            <div className="custom-card-header">

                            <div className="d-flex justify-content-end mt-3">
                                        <h2>{order.title}</h2>
                                        <Button variant="success" className="ms-auto" onClick={callEdit}>Редактировать {<Pencil/>}</Button>
                                    </div>
                            </div>
                            <div className="custom-card-body">
                                <ListGroup className="custom-list-group">
                                    <ListGroup.Item className="custom-list-group-item"><strong>Описание:</strong> {order.description}</ListGroup.Item>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Дата создания:</strong> {order.createdAt.split('T').join(" ").split('.')[0]}</ListGroup.Item>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Создатель:</strong> <Link to={`/tenants/${order.creator?.id}`} onClick={(e) => e.stopPropagation()}> {[order.creator?.lastName, order.creator?.firstName, order.creator?.fatherName]
                                        .filter(Boolean)
                                        .join(' ')}</Link> </ListGroup.Item>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Исполнитель:</strong> <Link to={`/staffers/${order.assigned?.id}`} onClick={(e) => e.stopPropagation()}> {[order.assigned?.lastName, order.assigned?.firstName, order.assigned?.fatherName]
                                        .filter(Boolean)
                                        .join(' ')}</Link> </ListGroup.Item>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Статус:</strong> {EnumUtil.getOrderStatus(order.status)}</ListGroup.Item>
                                </ListGroup>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button variant="danger" className="ms-auto" onClick={() => setShowDeleteModal(true)}>Удалить</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                title="Подтвердите удаление"
                message="Вы точно хотите удалить эту заявку?"
                callDelete={() => {
                    callDelete();
                    setShowDeleteModal(false);
                }}
                hide={() => setShowDeleteModal(false)}
            />
                )}
        </div>

    );
};

export default OrderDetails;