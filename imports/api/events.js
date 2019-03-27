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
        label: 'Start'
    },
    endDate: {
        type: Date,
        label: 'End'
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
    },
    occurrences: {
        type: Array,
        optional: true
    },
    'occurrences.$': {
        type: Object
    },
    'occurrences.$.startDate': {
        type: Date,
        label: 'Starts'
    },
    'occurrences.$.endDate': {
        type: Date,
        label: 'Ends'
    },
    'occurrences.$.activities': {
        type: ActivitiesSchema,
        label: 'Selected activities'
    }
});

Events.attachSchema(EventsSchema);

export default Events;