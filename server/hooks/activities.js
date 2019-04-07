import Activities from '../../imports/api/activities';
import Events from '../../imports/api/events';
import Spaces from '../../imports/api/spaces';

Activities.after.update((userId, doc) => {
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();

    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id === doc._id);
        Spaces.update({_id: space._id}, {$set: {[`activities.${activityIndex}`]: doc}});
    });

    const events = Events.find({'activities._id':doc._id}).fetch();

    events.forEach(event => {
        const activityIndex = event.activities.findIndex((a) => a._id === doc._id);
        Spaces.update({_id: event._id}, {$set: {[`activities.${activityIndex}`]: doc}});
    });
});


Activities.after.remove((userId, doc) => {
    const spaces = Spaces.find({'activities._id':doc._id}).fetch();
    spaces.forEach(space => {
        const activityIndex = space.activities.findIndex((a) => a._id === doc._id);
        space.activities.splice(activityIndex, 1);
        Spaces.update({_id: space._id}, {$set: {activities: space.activities}});
    });

    const events = Events.find({
        'activities._id':doc._id,
        $or: [
            {
                startDate: {
                    $gt: new Date()
                }
            },
            {
                'recurrence.endDate': {
                    $gt: new Date()
                }
            },
            {
                'recurrence.startDate': {
                    $exists: true
                },
                'recurrence.endDate': {
                    $exists: false
                }
            }
        ]
    }).fetch();
    events.forEach(event => {
        const activityIndex = event.activities.findIndex((a) => a._id === doc._id);
        event.activities.splice(activityIndex, 1);
        Events.update({_id: event._id}, {$set: {activities: event.activities}});
    });
});

