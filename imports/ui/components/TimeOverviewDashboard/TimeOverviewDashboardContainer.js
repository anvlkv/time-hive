import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import TimeOverviewDashboard from './TimeOverviewDashboard';
import Time from '../../../api/time';



const TimeOverviewDashboardContainer = withTracker(() => {
    const timeHandler = Meteor.subscribe('time.dashboard');
    const loading = !timeHandler.ready();
    const time = Time.find({}).fetch();

    return {
        loading,
        time
    }
})(TimeOverviewDashboard);

export default TimeOverviewDashboardContainer;