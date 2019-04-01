import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import EventsOverviewDashboard from './EventsOverviewDashboard';
import Events from '../../../api/events';



const EventsOverviewDashboardContainer = withTracker(() => {
    const spacesHandler = Meteor.subscribe('events.dashboard');
    const loading = !spacesHandler.ready();
    const events = Events.find({}).fetch();

    return {
        loading,
        events
    }
})(EventsOverviewDashboard);

export default EventsOverviewDashboardContainer;