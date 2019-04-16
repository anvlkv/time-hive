import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitiesSchema } from './activities';
import { EventsSchema } from './events';
import BaseSchema from './base';

const Spaces = new Mongo.Collection('spaces');

const SpaceSchema = new SimpleSchema({
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
        label: 'Events',
        defaultValue: []
    },
    'events.$': {
        type: EventsSchema
    },
    activities: {
        type: Array,
        label: 'Activities',
        defaultValue: []
    },
    'activities.$': {
        type: ActivitiesSchema
    },
    maintainers: {
        type: Array,
        autoValue() {
            if (this.isInsert) {
                return [{
                    id: this.userId,
                    confirmed: true
                }];
            }
            else if (this.isUpsert) {
                return {$setOnInsert: [{
                    id: this.userId,
                    confirmed: true
                }]};
            }
        }
    },
    'maintainers.$': {
        type: Object
    },
    'maintainers.$.id': {
        type: String
    },
    'maintainers.$.confirmed': {
        type: Boolean
    },
    'maintainers.$.deletionConfirmed': {
        type: Array,
        defaultValue: [],
        optional: true
    },
    'maintainers.$.deletionConfirmed.$': {
        type: Boolean
    },
    contributors: {
        type: Array,
        defaultValue: []
    },
    'contributors.$': {
        type: Object
    },
    'contributors.$.id': {
        type: String
    },
    'contributors.$.confirmed': {
        type: Boolean
    },
});

SpaceSchema.extend(BaseSchema);

Spaces.attachSchema(SpaceSchema);

Spaces.helpers({
    isUserMaintainer(isConfirmed = true) {
        const currentUserId = Meteor.userId();
        return currentUserId && !!this.maintainers.find(({id, confirmed}) => confirmed === isConfirmed && currentUserId === id);
    },
    isUserContributor(isConfirmed = true) {
        const currentUserId = Meteor.userId();
        return currentUserId && !!this.contributors.find(({id, confirmed}) => confirmed === isConfirmed && currentUserId === id);
    }
});

export default Spaces;

if (Meteor.isServer) {
    Meteor.publish('spaces.my', function pubSpacesMy() {
        return Spaces.find(
            {
                $or: [
                    {'maintainers.id': this.userId},
                    {'contributors.id': this.userId}
                ]
            },
            {
                fields: {
                    name: 1,
                    'activities.name': 1,
                    'activities.colorCode': 1,
                    'events.name': 1,
                    'activities._id': 1,
                    'events._id': 1
                },
                sort: {
                    name: 1
                }
            }
        );
    });

    Meteor.publish('spaces.dashboard', function pubSpacesDashboard() {
        return Spaces.find({}, {
            fields: {
                name: 1,
                description: 1,
                maintainers: 1,
                contributors: 1,
                activities: 1,
                events: 1
            },
            limit: 20
        });
    });

    Meteor.publish('spaces.detail', function pubSpaceDetail(spaceId) {
        return Spaces.find({_id: spaceId});
    });
}
