import Activities from '../../imports/api/activities';
import Spaces from '../../imports/api/spaces';

Activities.after.update((userId, doc) => {
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();

    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id = doc._id);
        Spaces.update({_id: space._id}, {$set: {[`activities.${activityIndex}`]: doc}});
    });
});


Activities.after.remove((userId, doc) => {
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();
    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id === doc._id);
        space.activities.splice(activityIndex, 1);
        Spaces.update({_id: space._id}, {$set: {activities: space.activities}}, console.log);
    });
});

