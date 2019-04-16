import { Meteor } from "meteor/meteor";
import Agreements from '../api/agreements';
import Spaces from '../api/spaces';

Meteor.methods({
    SetContributorAgreement: function ({spaceId, agreement}) {
        const userId = Meteor.userId();
        const space = Spaces.findOne(spaceId);
        if (!userId) throw new Meteor.Error('unauthorized');
        if (space.isUserMaintainer()) throw new Meteor.Error('not-permitted', 'maintainer cant be added as contributor');

        const result = Agreements.upsert(agreement._id, {$set: {...agreement, spaceId, userId}});

        if (!space.isUserContributor(false)) {
            Spaces.update(spaceId, {$push: {contributors: {
                id: userId,
                confirmed: false
            }}});
        }

        return result;
    },
    AddActivitiesToAgreement: function ({selectedActivitiesIds, spaceId}) {
        const userId = Meteor.userId();
        if (!userId) throw new Meteor.Error('unauthorized');
        const space = Spaces.findOne(spaceId);
        const agreement = Agreements.findOne({spaceId, userId});
        if (!space.isUserContributor() || !agreement) throw new Meteor.Error('not-permitted', 'must have an agreement to select activities');
        const activities = space.activities.filter(a => selectedActivitiesIds.indexOf(a._id) >= 0);
        return Agreements.update(agreement._id, {$set:{activities}}, {getAutoValues: false});
    }
});
