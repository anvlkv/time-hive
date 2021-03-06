import React, { Component } from 'react';
import './Sidebar.scss';
import { NavLink, Route } from 'react-router-dom';

export const SidebarContext = React.createContext();

export default class Sidebar extends Component {
    state = {
        links: [],
    };

    setLinks(links){
        this.setState({links});
    }

    componentDidMount() {
        this.context.setLinks = this.setLinks.bind(this);
    }

    renderLink(link, index, lvl = '') {
        if (link.children && link.to) {
            return (
                <div key={`sidebar-link-${lvl}-${index}`}>
                    <NavLink to={`${lvl}${link.to}`}>{link.text}</NavLink>
                    <Route path={`${lvl}${link.to}`} render={() => {
                        return (
                            <nav key={`sidebar-nav-${lvl}`}>
                                {link.children.map((l, i) => this.renderLink(l, i, `${lvl}${link.to}/`))}
                            </nav>
                        )
                    }}/>
                </div>
            )
        }
        else if (link.children) {
            return (
                <div key={`sidebar-link-${lvl}-${index}`}>
                    {/*<NavLink to={`${lvl}${link.to}`}>{link.text}</NavLink>*/}
                    <h6>{link.text}</h6>
                    <nav>
                        {link.children.map((l, i) => this.renderLink(l, i, lvl))}
                    </nav>
                </div>
            )
        }
        else {
            return (
                <div key={`sidebar-link-${lvl}-${index}`}>
                    <NavLink to={`${lvl}${link.to}`}>{link.text}</NavLink>
                </div>
            )
        }
    }

    render() {
        return (
            <aside className="Sidebar">
                <nav>
                    {this.state.links.map((l, i) => this.renderLink(l, i))}
                </nav>
            </aside>
        );
    }
}

Sidebar.contextType = SidebarContext;
