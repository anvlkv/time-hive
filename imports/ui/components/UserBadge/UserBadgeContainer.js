import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import UserBadge from './UserBadge';





const UserBadgeContainer = withTracker(({userId}) => {
    const userHandler = Meteor.subscribe('users');
    const loading = !userHandler.ready();
    const user = Meteor.users.findOne(userId);
    return {
        loading,
        user
    }
})(UserBadge);

export default UserBadgeContainer;