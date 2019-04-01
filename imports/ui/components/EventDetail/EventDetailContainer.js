import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import EventDetail from './EventDetail';
import Events from '../../../api/events';




const EventDetailContainer = withTracker(({match}) => {
    const spacesHandler = Meteor.subscribe('events.detail', match.params.eventId);
    const loading = !spacesHandler.ready();
    const event = Events.findOne(match.params.eventId);

    return {
        loading,
        event
    }
})(EventDetail);

export default EventDetailContainer;