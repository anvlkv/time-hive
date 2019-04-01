import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Activities = new Mongo.Collection('activities');

export const ActivitiesSchema = new SimpleSchema({
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
    colorCode: {
        type: String,
        label: 'color',
        autoValue: function() {
            if (this.isInsert) {
                return  getRandomColor()
            }
            else if (this.isUpsert) {
                return {$setOnInsert: getRandomColor()};
            }
        }
    }
});


Activities.attachSchema(ActivitiesSchema);

export default Activities;


if (Meteor.isServer) {
    Meteor.publish('activities.my', function pubActivitiesMy() {
        return Activities.find();
    });

    Meteor.publish('activities.dashboard', function pubActivitiesDashboard() {
        return Activities.find();
    });

    Meteor.publish('activities.detail', function pubActivityDetail(activityId) {
        return Activities.find({_id: activityId});
    });
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}