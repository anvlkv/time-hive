import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Activities from '../../../api/activities';
import ActivitiesOverviewDashboard from './ActivitiesOverviewDashboard';




const ActivitiesOverviewDashboardContainer = withTracker(() => {
    const spacesHandler = Meteor.subscribe('activities.dashboard');
    const loading = !spacesHandler.ready();
    const activities = Activities.find({}).fetch();

    return {
        loading,
        activities
    }
})(ActivitiesOverviewDashboard);

export default ActivitiesOverviewDashboardContainer;