import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
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
    'recurrence.dayOfTheWeek': {
        type: String,
        label: 'Day of the week',
        optional: true
    },
    'recurrence.startDate': {
        type: Date,
        label: 'Starting'
    },
    'recurrence.endDate': {
        type: Date,
        label: 'Until',
        optional: true
    },
});