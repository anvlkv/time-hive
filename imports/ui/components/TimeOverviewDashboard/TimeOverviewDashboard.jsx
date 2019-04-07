import React from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { BaseComponent } from '../base';

class TimeOverviewDashboard extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        time: PropTypes.array,
        history: PropTypes.object
    };

    state = {

    };

    render() {
        return (
            <div>
                <h3>
                    you own time
                </h3>
                {this.props.time.map((t, i) => {
                    return (
                        <div key={i}>
                            {JSON.stringify(t)}
                        </div>
                    )
                })}
                {/*<form onSubmit={this.createSpace.bind(this)}>*/}
                    {/*<label>*/}
                        {/*What is it?*/}
                        {/*<input type="text"*/}
                               {/*name="newSpaceName"*/}
                               {/*value={this.state.newSpaceName}*/}
                               {/*onChange={this.handleInputChange.bind(this)} />*/}
                    {/*</label>*/}
                    {/*<button type="submit">Create new space</button>*/}
                {/*</form>*/}
            </div>
        )
    }

    createSpace(event) {
        event.preventDefault();
        Time.insert();
        // if (this.state.newSpaceName) {
        // }
    }
}

export default withRouter(TimeOverviewDashboard)