import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Time = new Mongo.Collection('time');

export const TimeSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    isAvailable: {
        type: Boolean,
        optional: true
    },
    isUserDefault: {
        type: Boolean,
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
    'recurrence.startDate': {
        type: Date,
        label: 'Starting'
    },
    'recurrence.endDate': {
        type: Date,
        label: 'Until',
        optional: true
    }
});

Time.attachSchema(TimeSchema);

export default Time;

if (Meteor.isServer) {
    Meteor.publish('time.my', function pubTimeMy() {
        return Time.find();
    });

    Meteor.publish('time.dashboard', function pubTimeDashboard() {
        return Time.find();
    });

    Meteor.publish('time.detail', function pubTimeDetail(timeId) {
        return Time.find({_id: timeId});
    });
}