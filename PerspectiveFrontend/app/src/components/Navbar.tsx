import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Nav, NavbarBrand, NavItem } from  'react-bootstrap'

export default class Navbar extends Component { 
    constructor(props: any){
        super(props);
    }

    render() {
        return <Nav>
            <NavbarBrand>
                <NavLink to="/" title="АН Перспектива" />
            </NavbarBrand>
            <NavItem>
                <NavLink to="/feed" title="Новости" />
            </NavItem>
            <NavItem>
                <NavLink to="/about" title="Об агентстве" />
            </NavItem>
            <NavItem>            
                <NavLink to="/account" title="Личный кабинет" />
            </NavItem>
        </Nav>
    }
}