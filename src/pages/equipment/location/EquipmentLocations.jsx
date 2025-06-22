import React, {useEffect, useState} from 'react';
import {Pagination, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../../AlertProvider";
import {useAuth} from "../../../AuthProvider";
import ApartmentService from "../../../api/ApartmentService";
import EquipmentLocationService from "../../../api/EquipmentLocationService";
import DormHubPagination from "../../../components/UI/Pagination/DormHubPagination";
import ErrorUtil from "../../../util/ErrorUtil";

const EquipmentLocations = ({apartmentId}) => {
    const [equipmentLocations, setEquipmentLocations] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const [apartment] = useState(apartmentId)
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchEquipments();
    }, [pagination.page, apartment])

    async function fetchEquipments() {
        try {
            const response = apartmentId == null
            ? await EquipmentLocationService.
                search({
                    page: pagination.page,
                    size: pagination.size,
                    order: {
                        direction: "asc",
                        field: "name"
                    }
                }, apartment)
            : await ApartmentService.getEquipments(
                {
                    page: pagination.page,
                    size: pagination.size,
                    order: {
                        direction: "asc",
                        field: "name"
                    }
                }, apartment)
            setEquipmentLocations(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке локаций оборудования:", error);
            showAlert(`Произошла ошибка при загрузке локаций оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        navigate(`/equipment-locations/${id}`);
    };

    function handleAddClick() {
        navigate(`/equipment-locations/new?apartmentId=${apartment}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="d-flex justify-content-between align-items-center ms-3 mt-3 mb-3 me-3">
                <h1>Оборудование</h1>
                {isAdmin && (
                    <Button onClick={handleAddClick}>Добавить</Button>
                )}
            </div>
            <div className="table-responsive">
                <Table bordered className="custom-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Инвентарный номер</th>
                        <th>Количество</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {equipmentLocations.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{el.equipment.name}</td>
                            <td className="text-center">{el.equipment.inventoryNumber}</td>
                            <td className="text-center">{el.quantity}</td>
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

export default EquipmentLocations;