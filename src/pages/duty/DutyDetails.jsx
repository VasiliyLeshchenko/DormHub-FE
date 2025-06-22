import React, {useEffect, useState} from 'react';
import DutyService from "../../api/DutyService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import ErrorUtil from "../../util/ErrorUtil";
import EnumUtil from "../../util/EnumUtil";

const DutyDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [duty, setDuty] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchDuty();
    }, [id])

    async function fetchDuty() {
        try {
            const response = await DutyService.getById(id);
            setDuty(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке дежурства: ", error);
            showAlert(`Произошла ошибка при загрузке дежурства: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/duties")
        }
    }

    async function callDelete() {
        try {
            await DutyService.deleteById(id);
            showAlert("Дежурство было успешно удалено");
            navigate("/duties");
        } catch (error) {
            showAlert(`При удаление дежурства произошла ошибка: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate("/duties" + `/${id}` + "/edit");
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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2>Дежурство</h2>
                                        <Button variant="success" onClick={callEdit}>
                                            Редактировать <Pencil />
                                        </Button>
                                    </div>
                            </div>
                            <div className="custom-card-body">
                                <ListGroup>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Помещение:</strong> <Link  to={`/apartments/${duty.apartment.id}`} onClick={(e) => e.stopPropagation()}> {EnumUtil.getApartmentType(duty.apartment.type)} {duty.apartment.number + duty.apartment.suffix}</Link> </ListGroup.Item>
                                    <ListGroup.Item className="custom-list-group-item"><strong>Дата:</strong> {duty.date}</ListGroup.Item>
                                    <div className="custom-card">
                                    <ListGroup className="custom-list-group"><strong>Дежурные:</strong> {duty.tenants.map(te => (
                                        <ListGroup.Item className="custom-list-group-item" key={te.id}>
                                            <Link className="custom-link" to={`/tenants/${te.id}`} onClick={(e) => e.stopPropagation()}>
                                                {te.lastName} {te.firstName} {te.fatherName}
                                            </Link>
                                        </ListGroup.Item>))}
                                    </ListGroup>
                                    </div>
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
                title="Подтвердите уделение"
                message="Вы точно хотите удалить это дежурство?"
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

export default DutyDetails;