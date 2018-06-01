'use strict';

var React = require('react');

var Select = React.createClass({
    propTypes: {
      name: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      options: React.PropTypes.array.isRequired,
      onChange: React.PropTypes.func.isRequired,
      placeholder: React.PropTypes.string.isRequired,
      value: React.PropTypes.string,
      error: React.PropTypes.string,
    },

    render: function() {
        var wrapperClass = 'form-group';
        if (this.props.error && this.props.error.length > 0) {
            wrapperClass += ' ' + 'has-error';
        }

        var createOption = function(author) {
            return (
                <option key={author.id} value={author.id}>{author.firstName} {author.lastName}</option>
            );
        };

        return (
            <div className={wrapperClass}>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <div className="field">
                    <select type="text"
                        value={this.props.value}
                        name={this.props.name}
                        className="form-control"
                        ref={this.props.name}
                        onChange={this.props.onChange}>
                        <option value="">{this.props.placeholder}</option>
                        {this.props.options.map(createOption, this)}
                    </select>
                    <div className="input">{this.props.error}</div>
                </div>
            </div>
        );
    },
});

module.exports = Select;
