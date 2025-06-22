import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {useAuth} from "../../../AuthProvider";

const CustomNavbar = () => {

    const { user, logout } = useAuth();

    return (
        <Navbar className="fw-bold" expand="lg" bg="primary" data-bs-theme="dark" hidden={user == null}>
            <Container fluid>
                <LinkContainer to="/home"><Navbar.Brand>DormHub</Navbar.Brand></LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/dorms"><Nav.Link>Общежития</Nav.Link></LinkContainer>
                        <NavDropdown title="Пользователи" id="basic-nav-dropdown" data-bs-theme="light">
                            <LinkContainer to="/staffers"><NavDropdown.Item>Сотрудники</NavDropdown.Item></LinkContainer>
                            <LinkContainer to="/tenants"><NavDropdown.Item>Жильцы</NavDropdown.Item></LinkContainer>
                        </NavDropdown>
                        <LinkContainer to="/orders"><Nav.Link>Заявки</Nav.Link></LinkContainer>
                        <LinkContainer to="/equipments"><Nav.Link>Оборудование</Nav.Link></LinkContainer>
                        {/*<LinkContainer to="/chats"><Nav.Link>Chats</Nav.Link></LinkContainer>*/}
                    </Nav>
                    <Nav className="ms-auto align-items-center gap-2">
                        <LinkContainer to={
                            user?.roles?.includes("STAFFER")
                            ? `/staffers/${user?.sub}`
                            : `/tenants/${user?.sub}`
                        }>
                            <Nav.Link>{user?.lastName + " " +user?.firstName}</Nav.Link>
                        </LinkContainer>
                        <Button variant="outline-light" size="sm" className="fw-bold" onClick={logout}>Выйти</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;