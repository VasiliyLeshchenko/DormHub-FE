import React, {useEffect, useState} from 'react';
import EquipmentService from "../../api/EquipmentService";
import {useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import ErrorUtil from "../../util/ErrorUtil";

const EquipmentDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [equipment, setEquipment] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchEquipment();
    }, [id])

    async function fetchEquipment() {
        try {
            const response = await EquipmentService.getById(id);
            setEquipment(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке оборудования:", error);
            showAlert(`Произошла ошибка при загрузке оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/equipments");
        }
    }

    async function callDelete() {
        try {
            await EquipmentService.deleteById(id);
            showAlert("Оборудование было успешно удалено");
            navigate("/equipments");
        } catch (error) {
            showAlert(`Произошла ошибка при удалении оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    async function callEdit() {
        navigate(`/equipments/${id}/edit`);
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
                                    <h2>{equipment.name}</h2>
                                    <Button variant="success" className="ms-auto" onClick={callEdit}>Редактировать {<Pencil/>}</Button>
                                </div>
                            </div>
                            <div className="custom-card-body">
                                <ListGroup className="custom-list-group">
                                    <ListGroup.Item className="custom-list-group-item"><strong>Инвентарный номер:</strong> {equipment.inventoryNumber}</ListGroup.Item>
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
                message="Вы точно хотите удалить это оборудование?"
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

export default EquipmentDetails;