import { Meteor } from "meteor/meteor";
import Spaces from '../api/spaces';

Meteor.methods({
    DestroySpace: ({spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                if (space.maintainers.length === 1) {
                    return Spaces.remove(spaceId);
                }
                else {
                    throw new Meteor.Error(`not-permitted`, 'You have to be the only maintainer left to destroy the space')
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
    },
    LeaveSpace: ({spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                if (space.maintainers.length === 1) {
                    throw new Meteor.Error(`not-permitted`, 'Cannot leave space, you are the last maintainer. Please destroy space...')
                }
                else {
                    const maintainerIndex = space.maintainers.findIndex(m => m.id === userId);
                    if (maintainerIndex >= 0) {
                        space.maintainers.splice(maintainerIndex, 1);
                        Spaces.update(spaceId, {$set: {maintainers: space.maintainers}});
                    }
                    else {
                        throw new Meteor.Error(`not-found`, `User ${userId} is not a maintainer`);
                    }
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
    },
    JoinSpaceAsMaintainer: ({spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (!space.isUserMaintainer()) {
                return Spaces.update(spaceId, {$push: {maintainers: {
                    id: userId,
                    confirmed: false
                }}});
            }
            else {
                throw new Meteor.Error(`maintainer-already-added`, `Cannot add ${userId}, user already added`);
            }
        }
        else {
            throw new Meteor.Error(`maintainer-not-supplied`, `No user in current context...`);
        }
    },
    ConfirmMaintainer: ({maintainerId, spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                const maintainerIndex = space.maintainers.findIndex((m) => m.id === maintainerId);
                if (maintainerIndex >= 0) {
                    Spaces.update(spaceId, {$set: {[`maintainers.${maintainerIndex}.confirmed`]: true}});
                }
                else {
                    throw new Meteor.Error(`maintainer-already-confirmed`, `Cannot confirm ${userId}, user already added`);
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
        else {
            throw new Meteor.Error(`unauthorized`, `No user in current context...`);
        }
    },
    ConfirmContributor: ({contributorId, spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                const contributorIndex = space.contributors.findIndex((c) => c.id === contributorId);
                if (contributorIndex >= 0) {
                    Spaces.update(spaceId, {$set: {[`contributors.${contributorIndex}.confirmed`]: true}});
                }
                else {
                    throw new Meteor.Error(`contributor-already-confirmed`, `Cannot confirm ${userId}, user already added`);
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
        else {
            throw new Meteor.Error(`unauthorized`, `No user in current context...`);
        }
    },
    RemoveMaintainer: ({maintainerId, spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                const maintainerIndex = space.maintainers.findIndex((m) => m.id === maintainerId);
                if (maintainerIndex >= 0) {
                    const maintainer = space.maintainers[maintainerIndex];
                    if (maintainer.confirmed) {
                        Spaces.update(spaceId, {$push: {[`maintainers.${maintainerIndex}.deletionConfirmed`]: true}});
                    }
                    if (!maintainer.confirmed || maintainer.deletionConfirmed.length + 1 /* update above adds one */ >= space.maintainers.length / 2) {
                        space.maintainers.splice(maintainerIndex, 1);
                        Spaces.update(spaceId, {$set: {maintainers: space.maintainers}});
                    }
                }
                else {
                    throw new Meteor.Error(`maintainer-not-in-space`, `Cannot remove ${userId}`);
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
        else {
            throw new Meteor.Error(`unauthorized`, `No user in current context...`);
        }
    },
    RemoveContributor: ({contributorId, spaceId}) => {
        const userId = Meteor.userId();
        if (userId) {
            const space = Spaces.findOne(spaceId);
            if (space.isUserMaintainer()) {
                const contributorIndex = space.contributors.findIndex((c) => c.id === contributorId);
                if (contributorIndex >= 0) {
                    space.contributors.splice(contributorIndex, 1);
                    Spaces.update(spaceId, {$set: {contributors: space.contributors}});
                }
                else {
                    throw new Meteor.Error(`contributor-not-in-space`, `Cannot remove ${userId}`);
                }
            }
            else {
                throw new Meteor.Error(`not-permitted`, `User ${userId} is not a maintainer`);
            }
        }
        else {
            throw new Meteor.Error(`unauthorized`, `No user in current context...`);
        }
    },
});
