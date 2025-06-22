import React from 'react';
import {Pagination} from "react-bootstrap";

const DormHubPagination = ({ currentPage, pageSize, total, onPageChange }) => {
    const totalPages = Math.ceil(total / pageSize);

    const getPaginationItems = () => {
        let items = [];

        const addPage = (page) => {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </Pagination.Item>
            );
        };

        if (totalPages <= 5) {
            for (let i = 0; i < totalPages; i++) addPage(i);
        } else {
            addPage(0);
            if (currentPage > 2) items.push(<Pagination.Ellipsis key="start-ellipsis"/>);

            for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                addPage(i);
            }

            if (currentPage < totalPages - 3) items.push(<Pagination.Ellipsis key="end-ellipsis"/>);
            addPage(totalPages - 1);
        }

        return items;
    };

    return (
        <Pagination>
            <Pagination.First onClick={() => onPageChange(0)} disabled={currentPage === 0}/>
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}/>

            {getPaginationItems()}

            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}/>
            <Pagination.Last onClick={() => onPageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}/>
        </Pagination>
    );
}
export default DormHubPagination;