import React, {useEffect, useState} from 'react';
import {Alert, Pagination, Table} from "react-bootstrap";
import TenantService from "../../api/TenantService";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import TenantSearchInput from "../../components/UI/TenantSearchInput";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import EquipmentSearchInput from "../../components/UI/EquipmentSearchInput";
import ErrorUtil from "../../util/ErrorUtil";

const Tenants = ({dormId, apartmentId, showAdd=true}) => {
    const [tenants, setTenants] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const [dorm] = useState(dormId);
    const [apartment] = useState(apartmentId);
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchTenants();
    }, [pagination.page, dorm, apartment])

    async function fetchTenants() {
        try {
            const response = await TenantService.search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "asc",
                    field: "lastName"
                }
            }, dorm, apartment);
            setTenants(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке жильцов:", error);
            showAlert(`Произошла ошибка при загрузке жильцов: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        console.log(`/tenants/${id}`)
        navigate(`/tenants/${id}`);
    };

    function handleAddClick() {
        navigate(`/tenants/new?dormId=${dormId}&apartmentId=${apartmentId}`);
    }

    function handleSearchDetailsClick(tenant) {
        navigate(`/tenants/${tenant.id}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Жильцы</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className={isAdmin ? "flex-grow-1" : "w-100"}>
                        <TenantSearchInput onSelect={handleSearchDetailsClick} dormId={dormId}/>
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
                        <th>ФИО</th>
                        <th>Пол</th>
                        <th>Общежитие</th>
                        <th>Помещение</th>
                        <th>Факультет</th>
                        <th>Курс</th>
                        <th>Группа</th>
                        <th>Телефон</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {tenants.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{`${el.lastName} ${el.firstName} ${el.fatherName}`}</td>
                            <td className="text-center">{el.sex === 'M' ? 'Мужчина' : "Женщина"}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <Link to={`/dorms/${el.dorm.id}`} onClick={(e) => e.stopPropagation()}>
                                    {el.dorm.name}
                                </Link>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                                {el.apartment && (
                                    <Link to={`/apartments/${el.apartment.id}`} onClick={(e) => e.stopPropagation()}>
                                        {EnumUtil.getApartmentType(el.apartment.type) + " " + el.apartment.number + (el.apartment.suffix? el.apartment.suffix : "")}
                                    </Link>
                                )}
                            </td>
                            <td className="text-center">{EnumUtil.getFaculty(el.faculty)}</td>
                            <td className="text-center">{el.course}</td>
                            <td className="text-center">{el.group}</td>
                            <td className="text-center">{el.phone}</td>
                            <td className="text-center">{el.email}</td>
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

export default Tenants;