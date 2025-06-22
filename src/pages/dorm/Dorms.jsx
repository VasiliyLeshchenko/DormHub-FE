import React, {useEffect, useState} from 'react';
import {Table} from "react-bootstrap";
import DormService from "../../api/DormService";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../../AlertProvider";
import {useAuth} from "../../AuthProvider";
import EnumUtil from "../../util/EnumUtil";
import DormHubPagination from "../../components/UI/Pagination/DormHubPagination";
import DormSearchInput from "../../components/UI/DormSearchInput";
import ErrorUtil from "../../util/ErrorUtil";

const Dorms = ({dormId}) => {
    const [dorms, setDorms] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        total: 0
    });
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        fetchDorms();
    }, [pagination.page])

    async function fetchDorms() {
        try {
            const response = await DormService.search({
                page: pagination.page,
                size: pagination.size,
                order: {
                    direction: "asc",
                    field: "name"
                }
            });
            setDorms(response.items);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error("Ошибка при загрузке общежитий:", error);
            showAlert(`Произошла ошибка при загрузке общежитий: ${ErrorUtil.getErrorMessage(error)}`, "danger");
        }
    }

    const handleRowClick = (id) => {
        navigate(`/dorms/${id}`);
    };

    function handleAddClick() {
        navigate(`/dorms/new`);
    }

    function handlePageChange(pageNumber) {
        setPagination(prev => ({ ...prev, page: pageNumber }));
    }

    function handleSearchDetailsClick(dorm) {
        navigate(`/dorms/${dorm.id}`);
    }

    return (
        <div className="custom-table-container">
            <div className="ms-3 me-3 mt-3 mb-3 d-flex flex-column gap-3">
                <div className="text-center">
                    <h1 className="mb-0">Общежития</h1>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className={isAdmin ? "flex-grow-1" : "w-100"}>
                        <DormSearchInput onSelect={handleSearchDetailsClick} />
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
                        <th>Тип</th>
                        <th>Адрес</th>
                        <th>Почтовый индекс</th>
                        <th>Телефон</th>
                    </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                    {dorms.map((element, index) => (
                        <tr
                            key={element.id}
                            onClick={() => handleRowClick(element.id)}
                        >
                            <td className="text-center">{pagination.page * pagination.size + index + 1}</td>
                            <td>{element.name}</td>
                            <td className="text-center">{EnumUtil.getDormType(element.type)}</td>
                            <td className="text-center">{element.address}</td>
                            <td className="text-center">{element.postalCode}</td>
                            <td className="text-center">{element.phone}</td>
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

export default Dorms;