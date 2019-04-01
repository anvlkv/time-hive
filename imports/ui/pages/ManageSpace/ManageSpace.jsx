import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ActivityDetailContainer from '../../components/ActivityDetail/ActivityDetailContainer';
import ActivitiesOverviewDashboardContainer
    from '../../components/ActvitiesOverviewDashboard/ActivitiesOverviewDashboardContainer';
import EventDetailContainer from '../../components/EventDetail/EventDetailContainer';
import EventsOverviewDashboardContainer
    from '../../components/EventsOverviewDashboard/EventsOverviewDashboardContainer';
import { SidebarContext } from '../../components/Sidebar/Sidebar';
import PropTypes from 'prop-types'
import _ from 'lodash';
import SpaceDetailContainer from '../../components/SpaceDetail/SpaceDetailContainer';
import SpacesOverviewDashboardContainer
    from '../../components/SpacesOverviewDashboard/SpacesOverviewDashboardContainer';

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
            !_.isEqual(prevProps.activities, this.props.spaces)) {
            this.setMenuLinks();
        }
    }


    render() {
        return (
            <>
                <Switch>
                    <Route exact path={ManageSpace.routePrefix} component={SpacesOverviewDashboardContainer}/>
                    <Route exact path={`${ManageSpace.routePrefix}/:spaceId`} component={SpaceDetailContainer}/>
                    <Route exact path={`${ManageSpace.routePrefix}/:spaceId/activities`} component={ActivitiesOverviewDashboardContainer}/>
                    <Route exact path={`${ManageSpace.routePrefix}/:spaceId/events`} component={EventsOverviewDashboardContainer}/>
                    <Route exact path={`${ManageSpace.routePrefix}/:spaceId/activities/:activityId`} component={ActivityDetailContainer}/>
                    <Route exact path={`${ManageSpace.routePrefix}/:spaceId/events/:eventId`} component={EventDetailContainer}/>
                </Switch>
            </>
        );
    }

    setMenuLinks() {
        this.context.setLinks(this.props.spaces.map(space => {
            return {
                to: `${ManageSpace.routePrefix}/${space._id}`,
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
        }));
    }
}