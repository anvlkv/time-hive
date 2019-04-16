import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitiesSchema } from './activities';
import BaseSchema from './base';
import TimeSpanBase from './time-span-base';

const Events = new Mongo.Collection('events');

export const EventsSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        max: 200
    },
    description: {
        type: String,
        label: 'Description',
        max: 20000,
        optional: true
    },
    activities: {
        type: Array,
        label: 'Activities',
        optional: true
    },
    'activities.$': {
        type: ActivitiesSchema
    }
});

EventsSchema.extend(BaseSchema);
EventsSchema.extend(TimeSpanBase);

Events.attachSchema(EventsSchema);

export default Events;

if (Meteor.isServer) {
    Meteor.publish('events.my', function pubSpacesMy() {
        return Events.find();
    });

    Meteor.publish('events.dashboard', function pubSpacesDashboard() {
        return Events.find();
    });

    Meteor.publish('events.detail', function pubSpaceDetail(eventId) {
        return Events.find({_id: eventId});
    });
}