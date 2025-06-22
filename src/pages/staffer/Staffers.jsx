import React, {useEffect, useState} from 'react';
import {Alert, Pagination, Table} from "react-bootstrap";
import StafferService from "../../api/StafferService";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import StafferSearchInput from "../../components/UI/StafferSearchInput";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import ErrorUtil from "../../util/ErrorUtil";

const Staffers = ({dormId}) => {
    const [staffers, setStaffers] = useState([]);
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
        fetchStaffers();
    }, [pagination.page, dorm])

    async function fetchStaffers() {
        try {
            const response = await StafferService.search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "asc",
                    field: "lastName"
                }
            }, dorm);
            setStaffers(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке сотрудников:", error);
            showAlert(`Произошла ошибка при загрузке содрудников: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        navigate(`/staffers/${id}`);
    };

    function handleAddClick() {
        navigate(`/staffers/new?dormId=${dormId}`);
    }

    function handleSearchDetailsClick(staffer) {
        navigate(`/staffers/${staffer.id}`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    };

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Сотрудники</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className={isAdmin ? "flex-grow-1" : "w-100"}>
                        <StafferSearchInput onSelect={handleSearchDetailsClick} dormId={dormId}/>
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
                        <th>Должность</th>
                        <th>Пол</th>
                        <th>Общежитие</th>
                        <th>Телефон</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {staffers.map((el, index) => (
                        <tr
                            key={el.id}
                            onClick={() => handleRowClick(el.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{`${el.lastName} ${el.firstName} ${el.fatherName}`}</td>
                            <td>{EnumUtil.getPosition(el.position)}</td>
                            <td className="text-center">{el.sex === 'M' ? 'Мужчина' : "Женщина"}</td>
                            <td onClick={(e) => e.stopPropagation()} className="text-center">
                                { el.dorm && (
                                    <Link to={`/dorms/${el.dorm.id}`} onClick={(e) => e.stopPropagation()}>
                                        {el.dorm.name}
                                    </Link>
                                )}
                            </td>
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

export default Staffers;