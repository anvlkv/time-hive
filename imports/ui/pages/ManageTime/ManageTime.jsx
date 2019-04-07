import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SidebarContext } from '../../components/Sidebar/Sidebar';
import PropTypes from 'prop-types'
import TimeOverviewDashboardContainer from '../../components/TimeOverviewDashboard/TimeOverviewDashboardContainer';

export default class ManageTime extends React.Component {
    static contextType = SidebarContext;
    static propTypes = {
        loading: PropTypes.bool,
        time: PropTypes.array,
        activeTime: PropTypes.object
    };

    static routePrefix = '/time';

    componentDidMount() {
        this.setMenuLinks();
    }

    componentDidUpdate(prevProps) {
        // if (prevProps.loading !== this.props.loading ||
        //     this.props.match.params.spaceId !== prevProps.match.params.spaceId ||
        //     !_.isEqual(prevProps.activities, this.props.spaces)) {
        //     this.setMenuLinks();
        // }
    }


    render() {
        return (
            <div>
                <Switch>
                    <Route exact path={ManageTime.routePrefix} component={TimeOverviewDashboardContainer}/>
                    {/*<Route exact path={`${ManageTime.routePrefix}/:spaceId`} component={SpaceDetailContainer}/>*/}
                    {/*<Route exact path={`${ManageTime.routePrefix}/:spaceId/activities`} component={ActivitiesOverviewDashboardContainer}/>*/}
                    {/*<Route exact path={`${ManageTime.routePrefix}/:spaceId/events`} component={EventsOverviewDashboardContainer}/>*/}
                    {/*<Route exact path={`${ManageTime.routePrefix}/:spaceId/activities/:activityId`} component={ActivityDetailContainer}/>*/}
                    {/*<Route exact path={`${ManageTime.routePrefix}/:spaceId/events/:eventId`} component={EventDetailContainer}/>*/}
                </Switch>
            </div>
        );
    }

    setMenuLinks() {
        this.context.setLinks(this.props.time.reduce((links, time, at, all) => {

            return links;
        }, [
            {
                text: 'Past',
                to: `${ManageTime.routePrefix}/past`
            },
            {
                text: 'Future',
                children: [
                    {
                        text: 'Contributing',
                        to: `${ManageTime.routePrefix}/contributing`
                    },
                    {
                        text: 'Private',
                        to: `${ManageTime.routePrefix}/private`
                    }
                ]
            },
            {
                text: 'Agreement',
                to: `${ManageTime.routePrefix}/agreement`
            }
        ]));
        //     return {
        //         to: `${ManageTime.routePrefix}/${space._id}`,
        //         text: space.name,
        //         children: [
        //             {
        //                 to: 'activities',
        //                 text: 'Activities',
        //                 children: [
        //                     ...space.activities.map(activity => {
        //                         return {
        //                             to: activity._id,
        //                             text: activity.name
        //                         }
        //                     })
        //                 ]
        //             },
        //             {
        //                 to: 'events',
        //                 text: 'Events',
        //                 children: [
        //                     ...space.events.map(event => {
        //                         return {
        //                             to: event._id,
        //                             text: event.name
        //                         }
        //                     })
        //                 ]
        //             },
        //         ]
        //     }
        // }));
    }
}