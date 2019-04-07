import Events from '../../imports/api/events';
import Spaces from '../../imports/api/spaces';

Events.after.update((userId, doc) => {
    const spaces = Spaces.find({'events._id':doc._id}).fetch();

    spaces.forEach(space => {
        const eventIndex = space.events.findIndex((a) => a._id === doc._id);
        Spaces.update({_id: space._id}, {$set: {[`events.${eventIndex}`]: doc}});
    });
});


Events.after.remove((userId, doc) => {
    const spaces = Spaces.find({'events._id':doc._id}).fetch();

    spaces.forEach(space => {
        const eventIndex = space.events.findIndex((a) => a._id === doc._id);
        space.events.splice(eventIndex, 1);
        Spaces.update({_id: space._id}, {$set: {events: space.events}});
    });
});

