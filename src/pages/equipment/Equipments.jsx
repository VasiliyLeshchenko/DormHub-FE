import React, {useEffect, useState} from 'react';
import {Pagination, Table} from "react-bootstrap";
import EquipmentService from "../../api/EquipmentService";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import ApartmentService from "../../api/ApartmentService";
import EquipmentSearchInput from "../../components/UI/EquipmentSearchInput";
import {useAuth} from "../../AuthProvider";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import ErrorUtil from "../../util/ErrorUtil";

const Equipments = ({dormId, apartmentId}) => {
    const [equipments, setEquipments] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        total: 0
    });
    const [dorm] = useState(dormId)
    const [apartment] = useState(apartmentId)
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchEquipments();
    }, [pagination.page, dorm, apartment])

    async function fetchEquipments() {
        try {
            const response = apartmentId == null
            ? await EquipmentService.
                search({
                    page: pagination.page,
                    size: pagination.size,
                    order: {
                        direction: "asc",
                        field: "name"
                    }
                }, dorm)
            : await ApartmentService.getEquipments(
                {
                    page: pagination.page,
                    size: pagination.size,
                    order: {
                        direction: "asc",
                        field: "name"
                    }
                }, apartment)
            setEquipments(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке оборудования:", error);
            showAlert(`Произошла ошибка при загрузке оборудования: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        navigate(`/equipments/${id}`);
    };

    function handleAddClick() {
        navigate(`/equipments/new`);
    }

    function handleSearchDetailsClick(equipment) {
        navigate(`/equipments/${equipment.id}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Оборудование</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className={isAdmin ? "flex-grow-1" : "w-100"}>
                        <EquipmentSearchInput onSelect={handleSearchDetailsClick} dormId={dormId}/>
                    </div>
                    {isAdmin && (
                        <Button onClick={handleAddClick}>Добавить</Button>
                    )}
                </div>
            </div>
            <div className="table-responsive">
                <Table bordered className="custom-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Инвентарный номер</th>
                        <th>Общее количество</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {equipments.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{el.name}</td>
                            <td className="text-center">{el.inventoryNumber}</td>
                            <td className="text-center">{el.total}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <Pagination/>
            <div className="d-flex justify-content-end mt-3 mb-3 me-3">
                <DormHubPagination onPageChange={handlePageChange} currentPage={pagination.page} pageSize={pagination.size} total={pagination.total}/>
            </div>
        </div>
    );
};

export default Equipments;