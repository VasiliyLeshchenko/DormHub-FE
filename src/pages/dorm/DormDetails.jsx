import React, {useEffect, useState} from 'react';
import DormService from "../../api/DormService";
import {useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import Orders from "../order/Orders";
import Staffers from "../staffer/Staffers";
import Tenants from "../tenant/Tenants";
import Apartments from "../apartment/Apartments";
import Equipments from "../equipment/Equipments";
import {useAuth} from "../../AuthProvider";
import EnumUtil from "../../util/EnumUtil";
import ErrorUtil from "../../util/ErrorUtil";

const DormDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dorm, setDorm] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchDorm();
    }, [id])

    async function fetchDorm() {
        try {
            const response = await DormService.getById(id);
            setDorm(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке общежития:", error);
            showAlert(`Произошла ошибка при загрузке общежития: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/dorms");
        }
    }

    async function callDelete() {
        try {
            await DormService.deleteById(id);
            showAlert("Общежитие было успешно удалено");
            navigate("/dorms");
        } catch (error) {
            showAlert(`Произошла ошибка при уделении общежития: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate("/dorms" + `/${id}` + "/edit");
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
                                            <h2 className="mb-0">{dorm.name}</h2>
                                            {isAdmin && (
                                                <Button variant="success" onClick={callEdit}>
                                                    Редактировать <Pencil />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="custom-card-body">
                                        <ListGroup className="custom-list-group">
                                            <ListGroup.Item className="custom-list-group-item"><strong>Адрес:</strong> {dorm.address}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Почтовый индекс:</strong> {dorm.postalCode}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Телефон:</strong> {dorm.phone}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Тип:</strong> {EnumUtil.getDormType(dorm.type)}</ListGroup.Item>
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
                    <Tab eventKey="apartments" title="Помещения">
                        <Apartments dormId={dorm.id}/>
                    </Tab>
                    <Tab eventKey="staffers" title="Сотрудники">
                        <Staffers dormId={dorm.id}/>
                    </Tab>
                    <Tab eventKey="tenants" title="Жильцы">
                        <Tenants dormId={dorm.id}/>
                    </Tab>
                    <Tab eventKey="orders" title="Заявки">
                        <Orders dormId={dorm.id}/>
                    </Tab>
                    <Tab eventKey="equipments" title="Оборудование">
                        <Equipments dormId={dorm.id}/>
                    </Tab>
                </Tabs>
        )}
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                title="Подтвердите удаление"
                message="Вы точно хотите удалить это общежитие?"
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

export default DormDetails;