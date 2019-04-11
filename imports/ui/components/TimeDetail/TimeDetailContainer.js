import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import TimeDetail from './TimeDetail';
import Time from '../../../api/time';



const TimeDetailContainer = withTracker(({match}) => {
    const timeHandler = Meteor.subscribe('time.detail', match.params.eventId);
    const loading = !timeHandler.ready();
    const time = Time.findOne(match.params.eventId);

    return {
        loading,
        time
    }
})(TimeDetail);

export default TimeDetailContainer;