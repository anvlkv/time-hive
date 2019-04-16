import { Meteor } from 'meteor/meteor';
import Activities from '../api/activities';
import Spaces from '../api/spaces'

Meteor.methods({
    AddActivityToSpace: ({activityId, spaceId}) => {
        const space = Spaces.findOne(spaceId);
        if (space)
        if (!space.activities.find(a => a._id === activityId)) {
            const activity = Activities.findOne({_id: activityId});
            return Spaces.update({_id: spaceId}, {$set: {activities: [...space.activities, activity]}});
        }
        else {
            throw new Meteor.Error(`activity-already-added`, `Cannot add ${activity.name}, activity already exists`);
        }
    },
});
