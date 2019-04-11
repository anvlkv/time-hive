import SimpleSchema from 'simpl-schema';

// const UserProfileSchema = new SimpleSchema({
//
// });

const UserSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        optional: true
    },
    emails: {
        type: Array,
        // this must be optional if you also use other login services like facebook,
        // but if you use only accounts-password, then it can be required
        optional: true
    },
    'emails.$': {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Object,
        optional: true,
        blackbox: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    }/*,

    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    }

    */
});

// NOTE: Meteor.users is a collection of objects matching the Schema.user schema, so you need to use this schema.
Meteor.users.attachSchema(UserSchema);

Meteor.users.allow({
    /* NOTE: The client should not be allowed to add users directly!
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        console.log("doc: " + doc + " userId: " + userId);
        return !! userId;
    },
    */
    update: function(userId, doc, fieldNames) {
        // only allow updating if you are logged in
        // NOTE: a user can only update his own user doc and only the 'userProfile' field
        return !! userId && userId === doc._id && _.isEmpty(_.difference(fieldNames, ['userProfile']));
    },
    /* NOTE: The client should not generally be able to remove users
    remove: function(userID, doc) {
        //only allow deleting if you are owner
        return doc.submittedById === Meteor.userId();
    }
    */
});