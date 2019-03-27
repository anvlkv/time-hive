import React, { Component } from 'react';
import './Sidebar.scss';
import { Link } from 'react-router-dom';

export const SidebarContext = React.createContext();

export default class Sidebar extends Component {
    state = {
        links: []
    };

    setLinks(links){
        this.setState({links});
    }

    componentDidMount() {
        this.context.setLinks = this.setLinks.bind(this);
    }

    render() {
        return (
            <aside className="Sidebar">
                {this.state.links.map((link, index) => (
                    <div key={`sidebar-link-${index}`}>
                        {link}
                    </div>
                ))}
            </aside>
        );
    }
}

Sidebar.contextType = SidebarContext;
