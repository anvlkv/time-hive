import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import './MainLayout.scss';
import Sidebar, { SidebarContext } from '../../components/Sidebar/Sidebar';

export default class MainLayout extends Component {
    render() {
        return (
            <div className="MainLayout">
                <Header/>
                <div className="layout-main">
                    <SidebarContext.Provider value={{}}>
                        <Sidebar/>
                        <main>
                            {this.props.children}
                        </main>
                    </SidebarContext.Provider>
                </div>
                <footer>

                </footer>
            </div>
        );
    }
}
