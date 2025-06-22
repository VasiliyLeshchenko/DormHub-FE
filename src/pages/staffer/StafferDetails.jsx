import React, {useEffect, useState} from 'react';
import StafferService from "../../api/StafferService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, FloatingLabel, Form, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import EnumUtil from "../../util/EnumUtil";
import Orders from "../order/Orders";
import ErrorUtil from "../../util/ErrorUtil";

const StafferDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [staffer, setStaffer] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchStaffer();
    }, [id])

    async function fetchStaffer() {
        try {
            const response = await StafferService.getById(id);
            setStaffer(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке сотрудника:", error);
            showAlert(`Произошла ошибка при загрузке сотрудника: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/staffers");
        }
    }

    async function callDelete() {
        try {
            await StafferService.deleteById(id);
            showAlert("Сотрудник был успешно удален");
            navigate("/staffers");
        } catch (error) {
            showAlert(`Произошла ошибка при удалении сотрудника: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate("/staffers" + `/${id}` + "/edit");
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
                <Tabs
                    defaultActiveKey="info"
                    className="mb-3"
                    fill
                    variant="tabs"
                >
                    <Tab eventKey="info" title="Информация">
                        <Container className="custom-card">
                            <Row>
                                <Col>
                                    <div className="custom-card-header">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h2 className="mb-0">{staffer.lastName} {staffer.firstName} {staffer.fatherName}</h2>
                                                {isAdmin && (
                                                    <Button variant="success" onClick={callEdit}>
                                                        Редактировать <Pencil />
                                                    </Button>
                                                )}
                                            </div>
                                    </div>
                                    <div className="custom-card-body">
                                        <ListGroup className="custom-list-group">
                                            <ListGroup.Item className="custom-list-group-item"><strong>Должность:</strong> {EnumUtil.getPosition(staffer.position)}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Общежитие:</strong> { staffer.dorm && (<Link to={`/dorms/${staffer.dorm.id}`} onClick={(e) => e.stopPropagation()}> {staffer.dorm.name}</Link>)} </ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Пол:</strong> {staffer.sex === 'M' ? 'Мужчина' : "Женщина" }</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Дата рождения:</strong> {staffer.birthdate}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Телефон:</strong> {staffer.phone}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Email:</strong> {staffer.email}</ListGroup.Item>
                                        </ListGroup>
                                        {isAdmin && (
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button variant="danger" className="ms-auto" onClick={() => setShowDeleteModal(true)}>Удалить</Button>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Tab>
                    <Tab eventKey="orders" title="Заявки">
                        <Orders stafferId={id}/>
                    </Tab>
                </Tabs>
            )}
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                title="Подтвердите удаление"
                message="Вы точно хотите удалить этого сотрудника?"
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

export default StafferDetails;