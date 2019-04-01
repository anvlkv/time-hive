import React from 'react';
import PropTypes from 'prop-types'
import Spaces from '../../../api/spaces';
import {
    withRouter
} from 'react-router-dom'

class SpacesOverviewDashboard extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        spaces: PropTypes.array,
        history: PropTypes.object
    };

    state = {
        newSpaceName: ''
    };

    render() {
        return (
            <div>
                <h3>
                    &larr; Please select a space...
                    <br/>
                    or
                    <br/>
                    Create a new one
                </h3>
                <form onSubmit={this.createSpace.bind(this)}>
                    <label>
                        What is it?
                        <input type="text"
                               name="newSpaceName"
                               value={this.state.newSpaceName}
                               onChange={this.handleInputChange.bind(this)} />
                    </label>
                    <button type="submit">Create new space</button>
                </form>
            </div>
        )
    }

    createSpace(event) {
        event.preventDefault();
        if (this.state.newSpaceName) {
            Spaces.insert({name: this.state.newSpaceName, events: [], activities: []}, (err, spaceId) => {
                if (!err) {
                    this.props.history.push(`${this.props.history.location.pathname}/${spaceId}`);
                }
            });
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
}

export default withRouter(SpacesOverviewDashboard)