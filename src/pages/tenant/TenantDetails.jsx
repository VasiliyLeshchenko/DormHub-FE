import React, {useEffect, useState} from 'react';
import TenantService from "../../api/TenantService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import Duties from "../duty/Duties";
import EnumUtil from "../../util/EnumUtil";
import ErrorUtil from "../../util/ErrorUtil";
import Orders from "../order/Orders";

const TenantDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tenant, setTenant] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchTenant();
    }, [id])

    async function fetchTenant() {
        try {
            const response = await TenantService.getById(id);
            setTenant(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке жильца:", error);
            showAlert(`Произошла ошибка при загрузке жильца: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/tenants");
        }
    }

    async function callDelete() {
        try {
            await TenantService.deleteById(id);
            showAlert("Жилец был успешно удален");
            navigate("/tenants");
        } catch (error) {
            showAlert(`Произошла ошибка при удалении жильца: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate("/tenants" + `/${id}` + "/edit");
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
                                                <h2 className="mb-0">{tenant.lastName} {tenant.firstName} {tenant.fatherName}</h2>
                                                {isAdmin && (
                                                    <Button variant="success" onClick={callEdit}>
                                                        Редактировать <Pencil />
                                                    </Button>
                                                )}
                                            </div>
                                    </div>
                                    <div className="custom-card-body">
                                        <ListGroup className="custom-list-group">
                                            <ListGroup.Item className="custom-list-group-item"><strong>Общежитие:</strong> <Link to={`/dorms/${tenant.dorm.id}`} onClick={(e) => e.stopPropagation()}> {tenant.dorm.name}</Link> </ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Помещение:</strong> {tenant.apartment && (<Link to={`/apartments/${tenant.apartment.id}`} onClick={(e) => e.stopPropagation()}> {EnumUtil.getApartmentType(tenant.apartment.type) + " " +  tenant.apartment.number + (tenant.apartment.suffix === null ? "" : tenant.apartment.suffix)}</Link>)} </ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Пол:</strong> {tenant.sex === 'M' ? 'Мужчина' : "Женщина" }</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Дата рождения:</strong> {tenant.birthdate}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Телефон:</strong> {tenant.phone}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Email:</strong> {tenant.email}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Факультет:</strong> {EnumUtil.getFaculty(tenant.faculty)}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Курс:</strong> {tenant.course}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Группа:</strong> {tenant.group}</ListGroup.Item>
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
                        <Orders tenantId={id}/>
                    </Tab>
                    <Tab eventKey="duties" title="Дежурства">
                        <Duties tenantId={id}/>
                    </Tab>
                </Tabs>
            )}
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                title="Подтвердите удаление"
                message="Вы точно хотите удалить этого жильца?"
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

export default TenantDetails;