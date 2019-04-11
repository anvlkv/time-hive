import React from 'react';

export class BaseComponent extends React.Component {
    handleInputChange(event, name) {
        let value;
        if (!name) {
            const target = event.target;
            value = target.type === 'checkbox' ? target.checked : target.value;
            name = target.name;
        }
        else {
            value = event;
        }

        this.setState({
            [name]: value
        });
    }

    handleError(err) {
        console.error(err);
    }
}