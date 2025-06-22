import React, {useEffect, useState} from 'react';
import {Alert, Pagination, Table} from "react-bootstrap";
import DutyService from "../../api/DutyService";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import ErrorUtil from "../../util/ErrorUtil";

const Duties = ({apartmentId, tenantId, showAdd}) => {
    const [duties, setDuties] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const [tenant] = useState(tenantId);
    const [apartment] = useState(apartmentId);

    useEffect(() => {
        fetchDuties();
    }, [pagination.page, apartment, tenant])

    async function fetchDuties() {
        try {
            const response = await DutyService.search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "desc",
                    field: "date"
                }
            }, tenant, apartment);
            setDuties(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке дежурств:", error);
            showAlert(`Произошла ошибка при загрузке дежурств: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        console.log(`/duties/${id}`)
        navigate(`/duties/${id}`);
    };

    function handleAddClick() {
        navigate(`/duties/new?tenantId=${tenantId}&apartmentId=${apartmentId}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1>Дежурства</h1>
                </div>
                {showAdd && (
                    <Button onClick={handleAddClick}>Добавить</Button>
                )}
            </div>
            <div className="table-responsive">
                <Table bordered className="custom-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Помещение</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {duties.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <Link to={`/apartments/${el.apartment.id}`} onClick={(e) => e.stopPropagation()}>
                                    {EnumUtil.getApartmentType(el.apartment.type) + " " + el.apartment.number + (el.apartment.suffix? el.apartment.suffix : "")}
                                </Link>
                            </td>
                            <td>{el.date}</td>
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

export default Duties;