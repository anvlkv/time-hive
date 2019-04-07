import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitiesSchema } from './activities';

const Events = new Mongo.Collection('events');

export const EventsSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
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
    startDate: {
        type: Date,
        label: 'Start',
        optional: true
    },
    endDate: {
        type: Date,
        label: 'End',
        optional: true
    },
    recurrence: {
        type: Object,
        label: 'Recurring event',
        optional: true
    },
    'recurrence.unit': {
        type: String,
        label: 'Time unit'
    },
    'recurrence.every': {
        type: Number,
        label: 'Every'
    },
    'recurrence.dayOfTheWeek': {
        type: String,
        label: 'Day of the week',
        optional: true
    },
    'recurrence.startDate': {
        type: Date,
        label: 'Starting'
    },
    'recurrence.endDate': {
        type: Date,
        label: 'Until',
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