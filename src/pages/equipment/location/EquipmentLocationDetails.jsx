import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import EquipmentLocationService from "../../../api/EquipmentLocationService";
import {useAlert} from "../../../AlertProvider";
import DeleteModal from "../../../components/UI/DeleteModal";
import ErrorUtil from "../../../util/ErrorUtil";
import EnumUtil from "../../../util/EnumUtil";

const EquipmentLocationDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [equipmentLocation, setEquipmentLocation] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchEquipmentLocation();
    }, [id])

    async function fetchEquipmentLocation() {
        try {
            const response = await EquipmentLocationService.getById(id);
            setEquipmentLocation(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке локации оборудования", error);
            showAlert(`Произошла ошибка при загрузке локации оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/equipment-locations")
        }
    }

    async function callDelete() {
        try {
            await EquipmentLocationService.deleteById(id);
            showAlert("Локация оборудования была успешна удалена");
            navigate(`/apartments/${equipmentLocation.apartment.id}`);
        } catch (error) {
            showAlert(`Произошла ошибка при удалении локации оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/equipment-locations/${id}`);
        }
    }

    async function callEdit() {
        navigate(`/equipment-locations/${id}/edit`);
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
                                    <h2>Локация оборудования</h2>
                                    <Button variant="success" className="ms-auto" onClick={callEdit}>Редактировать {<Pencil/>}</Button>
                                </div>
                            </div>
                            <div className="custom-card-body">
                                    <ListGroup className="custom-list-group">
                                        <ListGroup.Item className="custom-list-group-item"><strong>Оборудования:</strong><Link to={`/equipments/${equipmentLocation.equipment.id}`} onClick={(e) => e.stopPropagation()}> {equipmentLocation.equipment.name}({equipmentLocation.equipment.inventoryNumber})</Link></ListGroup.Item>
                                        <ListGroup.Item className="custom-list-group-item"><strong>Помещение:</strong><Link to={`/apartments/${equipmentLocation.apartment.id}`} onClick={(e) => e.stopPropagation()}> {`${EnumUtil.getApartmentType(equipmentLocation.apartment.type)} ${equipmentLocation.apartment.number}${equipmentLocation.apartment.suffix === null ? '' : equipmentLocation.apartment.suffix}`}</Link></ListGroup.Item>
                                        <ListGroup.Item className="custom-list-group-item"><strong>Количество:</strong> {equipmentLocation.quantity}</ListGroup.Item>
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
                title="Подтвердите удаления"
                message="Вы точно хотите удалить эту локацию оборудования?"
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

export default EquipmentLocationDetails;