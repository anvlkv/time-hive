import React from 'react';
import { SidebarContext } from '../../components/Sidebar/Sidebar';
import PropTypes from 'prop-types'
import _ from 'lodash';

export default class ManageSpace extends React.Component {
    static contextType = SidebarContext;
    static propTypes = {
        loading: PropTypes.bool,
        spaces: PropTypes.array,
        activeSpace: PropTypes.object
    };

    static routePrefix = '/space';

    componentDidMount() {
        this.setMenuLinks();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.loading !== this.props.loading ||
            this.props.match.params.spaceId !== prevProps.match.params.spaceId ||
            !_.isEqual(prevProps.spaces, this.props.spaces)) {
            this.setMenuLinks();
        }
    }


    render() {
        if (!this.props.activeSpace) {
            return (
                <div>
                    Select a space
                </div>
            )
        }

        return (
            <div>
                <h2>ManageSpace {this.props.activeSpace.name}</h2>
            </div>
        );
    }

    setMenuLinks() {
        this.context.setLinks(this.props.spaces.map(space => {
            return {
                to: space._id,
                text: space.name,
                children: [
                    {
                        to: 'activities',
                        text: 'Activities',
                        children: [
                            ...space.activities.map(activity => {
                                return {
                                    to: activity._id,
                                    text: activity.name
                                }
                            })
                        ]
                    },
                    {
                        to: 'events',
                        text: 'Events',
                        children: [
                            ...space.events.map(event => {
                                return {
                                    to: event._id,
                                    text: event.name
                                }
                            })
                        ]
                    },
                ]
            }
        }), ManageSpace.routePrefix);
    }
}