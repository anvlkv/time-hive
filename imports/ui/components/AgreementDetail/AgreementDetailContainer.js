import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Agreements from '../../../api/agreements';
import AgreementDetail from './AgreementDetail';




const AgreementDetailContainer = withTracker((props) => {
    const agreementsHandler = Meteor.subscribe('agreements.detail', {spaceId: props.space._id});
    const loading = !agreementsHandler.ready();
    const agreement = Agreements.findOne({});

    return {
        loading,
        agreement,
        ...props
    }
})(AgreementDetail);

export default AgreementDetailContainer;