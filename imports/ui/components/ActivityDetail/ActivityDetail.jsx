import React from 'react';
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable';
import Activities from '../../../api/activities';


export default class ActivityDetail extends React.Component {
    static propTypes = {
        loading: PropTypes.bool,
        activity: PropTypes.object
    };

    render() {
        if (this.props.loading) {
            return (
                <h3>loading</h3>
            )
        }
        else {
            return (
                <div>
                    <div className={'dot'} style={{backgroundColor: this.props.activity.colorCode}}/>
                    <ContentEditable html={this.props.activity.name}
                                     disabled={false}
                                     className={'activity-name-editor'}
                                     tagName="h2"
                                     onBlur={this.onDoneEditing.bind(this)}/>
                    <ContentEditable html={this.props.activity.description || '<p class="placeholder">describe it...</p>'}
                                     innerRef={this.descriptionContentEditable}
                                     disabled={false}
                                     className={'activity-description-editor'}
                                     onBlur={this.onDoneEditing.bind(this)}/>
                </div>
            )
        }
    }

    onDoneEditing(event) {
        switch (event.target.className) {
            case 'activity-name-editor':
                if (!event.target.innerText) {
                    event.preventDefault();
                }
                else {
                    Activities.update(this.props.activity._id, {$set:{name: event.target.innerText}}, {}, (err) => {
                        if (err) {
                            this.setState({});
                        }
                    });

                }
                break;
            case 'activity-description-editor':
                Activities.update(this.props.activity._id, {$set:{description: event.target.innerHTML}}, {}, (err) => {
                    if (err) {
                        this.setState({});
                    }
                });
                break;
        }
    }
}