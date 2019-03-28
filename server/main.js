import { Meteor } from 'meteor/meteor';
import Activities from '../imports/api/activities';
import Spaces from '../imports/api/spaces';
import Events from '../imports/api/events';

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
  }
  // // If the Links collection is empty, add some data.
  // if (Links.find().count() === 0) {
  //   insertLink(
  //     'Do the Tutorial',
  //     'https://www.meteor.com/tutorials/react/creating-an-app'
  //   );
  //
  //   insertLink(
  //     'Follow the Guide',
  //     'http://guide.meteor.com'
  //   );
  //
  //   insertLink(
  //     'Read the Docs',
  //     'https://docs.meteor.com'
  //   );
  //
  //   insertLink(
  //     'Discussions',
  //     'https://forums.meteor.com'
  //   );
  // }
});
