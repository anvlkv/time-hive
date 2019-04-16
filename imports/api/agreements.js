import { Mongo } from "meteor/mongo";
import SimpleSchema from 'simpl-schema';
import { ActivitiesSchema } from './activities';
import BaseSchema from './base';

const Agreements = new Mongo.Collection('agreements');

export const AgreementSchema = new SimpleSchema({
    userId: {
        type: String
    },
    spaceId: {
        type: String
    },
    unit: {
        type: String
    },
    inAdvance: {
        type: Number
    },
    activities: {
        type: Array,
        defaultValue: []
    },
    'activities.$': {
        type: ActivitiesSchema
    }
});

AgreementSchema.extend(BaseSchema);

Agreements.attachSchema(AgreementSchema);

export default Agreements;

if (Meteor.isServer) {
    Meteor.publish('agreements.detail', function (spaceId) {
        if (!this.userId) throw new Meteor.Error('unauthorized');
        return Agreements.find({spaceId, userId: this.userId});
    });

    Meteor.publish('agreements.space', function (spaceId) {
        if (!this.userId) throw new Meteor.Error('unauthorized');
        return Agreements.find({spaceId, userId: this.userId});
    })
}
