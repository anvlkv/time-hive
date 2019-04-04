import { Meteor } from 'meteor/meteor';
import Events from '../api/events';
import Spaces from '../api/spaces'

Meteor.methods({
    AddEventToSpace: ({eventId, spaceId}) => {
        const space = Spaces.findOne(spaceId);
        if (!space.events.find(a => a._id === eventId)) {
            const event = Events.findOne({_id: eventId});
            return Spaces.update({_id: spaceId}, {$set: {events: [...space.events, event]}});
        }
        else {
            throw new Meteor.Error(`event-already-added`, `Cannot add ${event.name}, activity already exists`);
        }
    },
});
