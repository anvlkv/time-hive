import React from 'react';
import { BaseComponent } from '../base';
import PropTypes from 'prop-types';

class UserBadge extends BaseComponent {
    static propTypes = {
        user: PropTypes.object,
        loading: PropTypes.bool
    };

    render() {
        if (this.props.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }

        return(
            <div className={'UserBadge'}>
                {/*<img src={this.props.user.profile.userPic} alt={this.props.user.username}/>*/}
                <span>{this.props.user.username}</span>
            </div>
        )
    }
}

export default UserBadge;
