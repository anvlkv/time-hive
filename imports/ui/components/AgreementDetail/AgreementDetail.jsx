import { noop } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types'
import { BaseComponent } from '../base';


export default class AgreementDetail extends BaseComponent {
    static propTypes = {
        loading: PropTypes.bool,
        agreement: PropTypes.object,
        space: PropTypes.object,
        onAgreementSubmitted: PropTypes.func
    };

    static getDerivedStateFromProps(props, state) {
        if (!state.inAdvance && !state.unit) {
            state = {
                ...state,
                inAdvance: props.agreement ? this.props.agreement.inAdvance : 2,
                unit: props.agreement ? this.props.agreement.unit : 'Days'
            }
        }
        return state;
    }

    state = {
        inAdvance: '',
        unit: '',
    };

    render() {
        if (this.props.loading) {
            return (
                <h3>loading</h3>
            )
        }
        else {
            return (
                <form className={'AgreementDetail'} onSubmit={this.saveAgreement.bind(this)}>
                    <p>
                        Notify me <strong>{Meteor.user().username}</strong> about matching contribution opportunities at <strong>{this.props.space.name}</strong> not earlier than <strong>{this.state.inAdvance} {this.state.unit}</strong> in advance, then I will provide reliable response about my attendance.
                    </p>
                    <div>
                        <input type="number"
                               name="inAdvance"
                               id="daysInAdvanceInput"
                               value={this.state.inAdvance}
                               onChange={this.handleInputChange.bind(this)}/>
                        <select value={this.state.unit}
                                name="unit"
                                onChange={this.handleInputChange.bind(this)}>
                            <option>Hours</option>
                            <option>Days</option>
                            <option>Weeks</option>
                        </select>
                        <label htmlFor="daysInAdvanceInput">
                            in advance
                        </label>
                    </div>
                    <button type="submit">Confirm</button>
                </form>
            )
        }
    }

    saveAgreement(e) {
        e.preventDefault();
        Meteor.call('SetContributorAgreement', {spaceId: this.props.space._id, agreement: {
                ...this.props.agreement,
                ...this.state
            }}, (err) => {
            if (err) {
                this.handleError(err)
            }
            else {
                (this.props.onAgreementSubmitted || noop)();
            }
        })
    }
}