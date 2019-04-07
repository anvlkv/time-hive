import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Time from '../../../api/time';
import ManageTime from './ManageTime';



const ManageTimeContainer = withTracker(({match}) => {
    const timeHandler = Meteor.subscribe('time.my');
    const loading = !timeHandler.ready();
    const time = Time.find({}).fetch();
    let activeTime;
    if (match.params.spaceId) {
        activeTime = Time.findOne(match.params.spaceId);
    }

    return {
        loading,
        time,
        activeTime
    }
})(ManageTime);

export default ManageTimeContainer;