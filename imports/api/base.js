import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date()
            }
            else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            }
            else {
                this.unset()
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            return new Date()
        }
    }
})