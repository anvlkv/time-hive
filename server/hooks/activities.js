import Activities from '../../imports/api/activities';
import Spaces from '../../imports/api/spaces';

// Mongo.Collection.

Activities.after.update((userId, doc, fieldNames, modifier) => {
    console.log(userId, doc, fieldNames, modifier);
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();

    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id = doc._id);
        const updated = Spaces.update({_id: space._id}, {$set: {[`activities.${activityIndex}`]: doc}});
        console.log(updated, Spaces.findOne({_id: space._id}));
    });
});


Activities.after.remove((userId, doc) => {
    console.log(userId, doc);
    console.log(Spaces.find({'activities._id':doc._id}).count());
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();

    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id === doc._id);
        const deleted = space.activities.splice(activityIndex, 1);
        console.log(deleted, doc._id, space.activities);
        // space.activities = space.activities.sort((a1, a2) => a1.name > a2.name ? -1 : 1);
        const updated = Spaces.update({_id: space._id}, {$set: {activities: space.activities}}, console.log);
        console.log(updated, Spaces.findOne({_id: space._id}));
    });
});

Spaces.before.update((userId, doc, fieldNames, modifier) => {
    console.log(doc, modifier);
});

