import React, { useEffect, useState } from "react";
import { Form, ListGroup, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import DormService from "../../api/DormService";
import EnumUtil from "../../util/EnumUtil";
import {useAlert} from "../../AlertProvider";

const DormSearchInput = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const pageSize = 10;

    useEffect(() => {
        if (query.trim()) {
            setPage(0);
            setResults([]);
            fetchData(query, 0);
        } else {
            setResults([]);
            setHasMore(false);
        }
    }, [query]);

    const fetchData = async (searchText, pageNum) => {
        setLoading(true);
        try {
            const response = await DormService.search({
                page: pageNum,
                size: pageSize,
                query: searchText,
                order: {
                    direction: "asc",
                    field: "name"
                }
            });

            const newItems = response.items || [];
            setResults(prev => pageNum === 0 ? newItems : [...prev, ...newItems]);
            setHasMore(newItems.length === pageSize);
            setPage(pageNum + 1);
        } catch (err) {
            console.error("Ошибка поиска", err);
            showAlert(`Произошла ошибка при загрузке общежитий: ${err.message}`, "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div style={{ position: "relative" }}>
            <Form.Control
                type="text"
                placeholder="Поиск общежитий..."
                value={query}
                onChange={handleInputChange}
                style={{ width: "100%" }}
            />
            {query && (
                <div
                    style={{
                        maxHeight: "200px",
                        overflow: "auto",
                        position: "absolute",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        zIndex: 1050,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                    }}
                >
                    <InfiniteScroll
                        dataLength={results.length}
                        next={() => fetchData(query, page)}
                        hasMore={hasMore}
                        loader={<div className="text-center"><Spinner size="sm" animation="border" /></div>}
                        scrollableTarget="scrollableDiv"
                    >
                        <ListGroup>
                            {results.map((dorm) => (
                                <ListGroup.Item
                                    key={dorm.id}
                                    action
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onSelect(dorm);
                                        setResults([]);
                                        setQuery('');
                                    }}
                                >
                                    {dorm.name}, {EnumUtil.getDormType(dorm.type)}, {dorm.address})
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </InfiniteScroll>
                </div>
            )}
        </div>
    );
};

export default DormSearchInput;