import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import BaseSchema from './base';
import TimeSpanBase from './time-span-base';

const Time = new Mongo.Collection('time');

export const TimeSchema = new SimpleSchema({
    contributor: {
        type: String,
        autoValue() {
            return this.userId;
        }
    },
    isAvailable: {
        type: Boolean,
        optional: true
    },
    isUserDefault: {
        type: Boolean,
        optional: true
    }
});

TimeSchema.extend(BaseSchema);
TimeSchema.extend(TimeSpanBase);

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