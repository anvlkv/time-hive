import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AccountsUIWrapper from '../Login/AccountsUIWrapper';
import './Header.scss';

export default class Header extends Component {
    render() {
        return (
            <header className="Header">
                <nav>
                    <NavLink to="/space">Space</NavLink>
                    <NavLink to="/time">Time</NavLink>
                </nav>
                <AccountsUIWrapper/>
            </header>
        );
    }
}
