import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spaces from '../../../api/spaces';
import SpacesOverviewDashboard from './SpacesOverviewDashboard';




const SpacesOverviewDashboardContainer = withTracker(() => {
    const spacesHandler = Meteor.subscribe('spaces.dashboard');
    const loading = !spacesHandler.ready();
    const spaces = Spaces.find({}).fetch();

    return {
        loading,
        spaces
    }
})(SpacesOverviewDashboard);

export default SpacesOverviewDashboardContainer;