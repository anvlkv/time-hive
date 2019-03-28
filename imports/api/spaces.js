import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitiesSchema } from './activities';
import { EventsSchema } from './events';

const Spaces = new Mongo.Collection('spaces');

const SpaceSchema = new SimpleSchema({
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
    events: {
        type: Array,
        label: 'Events'
    },
    'events.$': {
        type: EventsSchema
    },
    activities: {
        type: Array,
        label: 'Activities'
    },
    'activities.$': {
        type: ActivitiesSchema
    }
});

Spaces.attachSchema(SpaceSchema);

export default Spaces;

if (Meteor.isServer) {
    Meteor.publish('spaces.my', function tasksPublication() {
        return Spaces.find();
    });
}
