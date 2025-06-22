import React, {useEffect, useState} from 'react';
import ApartmentService from "../../api/ApartmentService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Card, Col, ListGroup, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Pencil} from "react-bootstrap-icons";
import DeleteModal from "../../components/UI/DeleteModal";
import {useAlert} from "../../AlertProvider";
import Tenants from "../tenant/Tenants";
import Duties from "../duty/Duties";
import EquipmentLocations from "../equipment/location/EquipmentLocations";
import EnumUtil from "../../util/EnumUtil";
import ErrorUtil from "../../util/ErrorUtil";

const ApartmentDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [apartment, setApartment] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchApartment();
    }, [id])

    async function fetchApartment() {
        try {
            const response = await ApartmentService.getById(id);
            setApartment(response);
            setLoading(false)
        } catch (error) {
            console.error("Ошибка при загрузке помещения:", error);
            showAlert(`Произошла ошика при загрузке помещения: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            setLoading(false);
            navigate("/dorms");
        }
    }

    async function callDelete() {
        try {
            await ApartmentService.deleteById(id);
            showAlert("Помещение было успешно удалено");
            if (apartment?.parent?.id) {
                showAlert("Помещение успешно удалено");
                navigate(`/apartments/${apartment.parent.id}`)
            } else {
                showAlert("Помещение успешно удалено");
                navigate(`/dorms/${apartment.dorm.id}`);
            }
        } catch (error) {
            showAlert(`Произошла ошибка при удалении помещения: ${ErrorUtil.getErrorMessage(error)}`, "danger");
            navigate(`/apartments/${id}`);
        }
    }

    function handleAddClick() {
        navigate(`/apartments/new?dormId=${apartment.dorm.id}&parentId=${id}`);
    }

    async function callEdit() {
        navigate("/apartments" + `/${id}` + `/edit?dormId=${apartment.dorm.id}${apartment.parent? `&parentId=${apartment.parent.id}`: ``}`);
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
                                        <div className="d-flex justify-content-end mt-3">
                                            <h2>{EnumUtil.getApartmentType(apartment.type)} {apartment.number + apartment.suffix}</h2>
                                            <Button variant="success" className="ms-auto" onClick={callEdit}>Редактировать {<Pencil/>}</Button>
                                        </div>
                                    </div>
                                    <div className="custom-card-body">
                                        <ListGroup className="custom-list-group">
                                            <ListGroup.Item className="custom-list-group-item"><strong>Тип:</strong> {EnumUtil.getApartmentType(apartment.type)}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Общежитие:</strong> <Link to={`/dorms/${apartment.dorm.id}`} onClick={(e) => e.stopPropagation()}> {apartment.dorm.name}, {EnumUtil.getDormType(apartment.dorm.type)}, {apartment.dorm.address}</Link> </ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Этаж:</strong> {apartment.floor}</ListGroup.Item>
                                            <ListGroup.Item className="custom-list-group-item"><strong>Вместимость:</strong> {EnumUtil.getApartmentType(apartment.size)}</ListGroup.Item>

                                            {apartment.parent? (<ListGroup.Item className="custom-list-group-item" ><strong>Корневое помещение:</strong> <Link to={`/apartments/${apartment.parent.id}`} onClick={(e) => e.stopPropagation()}> {apartment.parent.number}{apartment.parent.suffix}</Link> </ListGroup.Item>) : (null)}


                                            <div className="custom-card">
                                            <ListGroup className="custom-list-group"><strong>Помещения:</strong> {apartment.children.map(ch => (
                                                <ListGroup.Item className="custom-list-group-item" key={ch.id}>
                                                    <Link className="custom-link" to={`/apartments/${ch.id}`} onClick={(e) => e.stopPropagation()}>
                                                        {EnumUtil.getApartmentType(ch.type)} {ch.number}{ch.suffix}
                                                    </Link>
                                                </ListGroup.Item>))}
                                                <Button onClick={handleAddClick}>Добавить</Button>
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
                    </Tab>
                    <Tab eventKey="tenants" title="Жильцы">
                        <Tenants apartmentId={id} showAdd={false}/>
                    </Tab>
                    <Tab eventKey="duties" title="Дежурства">
                        <Duties apartmentId={id} showAdd={true}/>
                    </Tab>
                    <Tab eventKey="equipments" title="Оборудование">
                        <EquipmentLocations apartmentId={id}/>
                    </Tab>
                </Tabs>
            )}
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                title="Подвердите удаление"
                message="Вы точно хотите удалить это помещение?"
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

export default ApartmentDetails;