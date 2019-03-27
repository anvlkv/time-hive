import { Meteor } from 'meteor/meteor';
import Activities from '../imports/api/activities';
import Spaces from '../imports/api/spaces';
import Events from '../imports/api/events';

// function insertLink(title, url) {
//   Links.insert({ title, url, createdAt: new Date() });
// }

Meteor.startup(async () => {
  if (Spaces.find().count() === 0) {
    const activity = {
        name: 'test activity'
    };

    activity._id = await Activities.insert(activity);

    const event = {
        name: 'test event',
        startDate: new Date(),
        endDate: new Date(),

    };

    event._id = await Events.insert(event);

    const spaceId = await Spaces.insert({
        name: 'test space',
        description: 'this is test',
        activities: [activity],
        events: [event]
    });

    console.log(`added Space ${spaceId}, with Activity ${activity._id}`);
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
