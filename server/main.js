import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Activities from '../imports/api/activities';
import Spaces from '../imports/api/spaces';
import Events from '../imports/api/events';
import Time from '../imports/api/time';
import '../imports/methods/activities';
import '../imports/methods/events';
import './hooks/activities';
import './hooks/events';

// function insertLink(title, url) {
//   Links.insert({ title, url, createdAt: new Date() });
// }

Meteor.startup(async () => {
  if (Spaces.find().count() === 0) {
    let i = 0;
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

        await Spaces.insert({
            name: `test space ${i}`,
            description: `this is test ${i}`,
            activities: [activity],
            events: [event]
        });
        i ++;
    }

    console.log('fixed you a fixture');
    console.table(Spaces.find().fetch());
  }

  if (Time.find().count() === 0) {
      const now = new Date();
      Time.insert({
          startDate: now,
          endDate: moment(now).add(1, 'd').toDate(),
          recurrence: {
              every: 1,
              unit: 'Days',
              startDate: now
          },
          isUserDefault: true
      });
  }
});
