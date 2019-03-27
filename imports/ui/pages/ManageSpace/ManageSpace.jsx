import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SidebarContext } from '../../components/Sidebar/Sidebar';

export default class ManageSpace extends Component {
    state = {
        counter: 0,
    };

    componentDidMount() {
        /* perform a side-effect at mount using the value of SidebarContext */
        this.context.setLinks([
            <Link to="space/activities">Activities</Link>,
            <Link to="space/events">Events</Link>
        ]);
    }

    render() {
        return (
            <div>
                <h2>ManageSpace</h2>
            </div>
        );
    }
}

ManageSpace.contextType = SidebarContext;
