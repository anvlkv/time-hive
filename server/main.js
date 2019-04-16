import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Activities from '../imports/api/activities';
import Spaces from '../imports/api/spaces';
import Events from '../imports/api/events';
import Time from '../imports/api/time';
import { Accounts } from 'meteor/accounts-base'
import '../imports/api/agreements';
import '../imports/methods/agreements';
import '../imports/methods/activities';
import '../imports/methods/events';
import '../imports/methods/spaces';
import './hooks/activities';
import './hooks/events';
import '../imports/api/user';

// function insertLink(title, url) {
//   Links.insert({ title, url, createdAt: new Date() });
// }

Meteor.startup(async () => {
    let contributor, maintainer;
    if(Meteor.users.find().count() === 0) {
        maintainer = Accounts.createUser({username: 'maintainer', password: 'maintainer'});
        contributor = Accounts.createUser({username: 'contributor', password: 'contributor'});
        let i = 0;
        const now = new Date();

        while(i < 3) {
            const activity = {
                name: `test activity ${i}`
            };

            activity._id = await Activities.insert(activity);

            const event = {
                name: `test event ${i}`,
                startDate: new Date(),
                endDate: new Date(),
            };

            event._id = await Events.insert(event);

            const space = {
                name: `test space ${i}`,
                description: `this is test ${i}`,
                activities: [activity],
                events: [event],
                maintainers: [{id: maintainer, confirmed: true}],
                contributors: [{id: contributor, confirmed: true}],
                createdAt: now,
                updatedAt: now
            };

            await Spaces.insert(space, {getAutoValues: false});
            i ++;
        }
        Time.insert({
            startDate: now,
            endDate: moment(now).add(1, 'd').toDate(),
            recurrence: {
                every: 1,
                unit: 'Days',
                startDate: now
            },
            isUserDefault: true,
            contributor,
            createdAt: now,
            updatedAt: now
        }, {getAutoValues: false});

        console.warn('fixed you a fixture');
    }
});
