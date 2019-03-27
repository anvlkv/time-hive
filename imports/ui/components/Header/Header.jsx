import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AccountsUIWrapper from '../Login/AccountsUIWrapper';
import './Header.scss';

export default class Header extends Component {
    render() {
        return (
            <header className="Header">
                <nav>
                    <Link to="/my/space">Space</Link>
                    <Link to="/my/time">Time</Link>
                </nav>
                <AccountsUIWrapper/>
            </header>
        );
    }
}
