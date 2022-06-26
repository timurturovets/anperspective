import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Container, NavbarBrand, NavItem } from "react-bootstrap";
import { AuthContextConsumer} from "../AuthContext";

export default class NavigationHeader extends Component { 
    constructor(props: any){
        super(props);
    }

    render() {
        return <AuthContextConsumer>
            {({isAuthenticated, role}) =>
                <Navbar expand="lg">
                    <Container>
                        <Navbar.Brand>
                            <Nav.Link as={Link} to="/" style={{width: "100%", height: "100%"}}>
                                АН Перспектива 
                            </Nav.Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/about">Об агентстве</Nav.Link>
                        <Nav.Link as={Link} to="/login">Личный кабинет</Nav.Link>
                        {isAuthenticated && (role==="Editor" || role==="Admin") 
                            ? <Nav.Link as={Link} to="/edit">Редактировать посты</Nav.Link>
                            : null }
                    </Nav>
                    </Container>
                </Navbar>
            }
        </AuthContextConsumer>
    }
}