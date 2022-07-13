import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container } from "react-bootstrap"
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { AuthContextConsumer } from "../../AuthContext"
import '../../styles.css'

export default class NavigationHeader extends Component { 
    constructor(props: any){
        super(props);
    }

    render() {
        return <AuthContextConsumer>
            {({isAuthenticated, role}) =>
                <Navbar>
                    <Container>
                        <Navbar.Brand>
                            <Nav.Link as={Link} to="/">
                                <div className="logo">
                                    <img src="/logo.png" alt="" className="img-fluid" />
                                </div>
                            </Nav.Link>
                        </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/about">Об агентстве</Nav.Link>
                        {isAuthenticated 
                            ? <>
                                { role.toLowerCase() === "editor" || role.toLowerCase() === "admin"
                                    ? <Nav.Link as={Link} to="/edit">Редактировать посты</Nav.Link>
                                    : null}
                                <Nav.Link as={Link} to="/account">Личный кабинет</Nav.Link>
                            </>
                            : <Nav.Link as={Link} to="/login">Войти</Nav.Link> }
                    </Nav>
                    </Container>
                    <hr />
                </Navbar>
            }
        </AuthContextConsumer>
    }
}