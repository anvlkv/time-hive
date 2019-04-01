import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Spaces from '../../../api/spaces';
import ManageSpace from './ManageSpace';



const ManageSpaceContainer = withTracker(({match}) => {
    const spacesHandler = Meteor.subscribe('spaces.my');
    const loading = !spacesHandler.ready();
    const spaces = Spaces.find({}).fetch();
    let activeSpace;
    if (match.params.spaceId) {
        activeSpace = Spaces.findOne(match.params.spaceId);
    }

    return {
        loading,
        spaces,
        activeSpace
    }
})(ManageSpace);

export default ManageSpaceContainer;