import React, {useEffect, useState} from 'react';
import {Alert, Pagination, Table} from "react-bootstrap";
import ApartmentService from "../../api/ApartmentService";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import DormSearchInput from "../../components/UI/DormSearchInput";
import ApartmentSearchInput from "../../components/UI/ApartmentSearchInput";
import {useAuth} from "../../AuthProvider";
import ErrorUtil from "../../util/ErrorUtil";

const Apartments = ({dormId}) => {
    const [apartments, setApartments] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const [dorm] = useState(dormId)
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchApartments();
    }, [pagination.page, dorm])

    async function fetchApartments() {
        try {
            const response = await ApartmentService.
            search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "asc",
                    field: "number"
                }
            }, dorm);
            setApartments(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке помещений:", error);
            showAlert(`Произошла ошибка при загрузке помещений: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        console.log(`/apartments/${id}`)
        navigate(`/apartments/${id}`);
    };

    function handleAddClick() {
        navigate(`/apartments/new?dormId=${dormId}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    }

    function handleSearchDetailsClick(apartment) {
        navigate(`/aprtments/${apartment.id}`);
    }

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Помещения</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className={isAdmin ? "flex-grow-1" : "w-100"}>
                        <ApartmentSearchInput onSelect={handleSearchDetailsClick} dormId={dormId}/>
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
                        <th>Тип</th>
                        <th>Номер</th>
                        <th>Общежитие</th>
                        <th>Этаж</th>
                        <th>Вместимость</th>
                        <th>Комнаты</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {apartments.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td className="text-center">{EnumUtil.getApartmentType(el.type)}</td>
                            <td className="text-center">{el.number + el.suffix}</td>
                            <td onClick={(e) => e.stopPropagation()} className="text-center">
                                <Link to={`/dorms/${el.dorm.id}`} onClick={(e) => e.stopPropagation()}>
                                    {el.dorm.name}
                                </Link>
                            </td>
                            <td className="text-center">{el.floor}</td>
                            <td className="text-center">{el.size}</td>
                            <td className="text-center">{el.children?.length || 0}</td>
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

export default Apartments;