'use strict';

var React = require('react');
var Router = require('react-router');
var CourseForm = require('./courseForm');
var CourseActions = require('../../actions/courseActions');
var CourseStore = require('../../stores/courseStore');
var AuthorStore = require('../../stores/authorStore');
var toastr = require('toastr');

var ManageCoursePage = React.createClass({
    mixins: [
        Router.Navigation,
    ],
    statics: {
        willTransitionFrom: function(transition, component) {
            if (component.state.dirty && !confirm('Leave without saving?')) {
                transition.abort();
            }
        },
    },
    getInitialState: function() {
        return {
            course: {
                id: '',
                title: '',
                author: '',
                category: '',
                length: '',
                watchHref: '',
            },
            authors: AuthorStore.getAllAuthors(),
            errors: {},
            dirty: false,
        };
    },
    componentWillMount: function() {
        var courseId = this.props.params.id; // from the path '/course/:id'

        if (courseId) {
            this.setState({ course: CourseStore.getCourseById(courseId) });
        }
    },
    setCourseState: function(event) {
        this.setState({ dirty: true });
        var field = event.target.name;
        var value = event.target.value;
        this.state.course[field] = value;
        return this.setState({ course: this.state.course });
    },
    courseFormIsValid: function() {
        var formIsValid = true;
        this.state.errors = []; // clear any previous errors

        if (this.state.course.title.length < 3) {
            this.state.errors.title = 'Name must be at least 3 characters.';
            formIsValid = false;
        }
        if (this.state.course.author.length < 1) {
            this.state.errors.author = 'An author must be selected.';
            formIsValid = false;
        }
        if (this.state.course.category < 3) {
            this.state.errors.category = 'Category must be at least 3 characters.';
            formIsValid = false;
        }
        if (this.state.course.length.length < 1) {
            this.state.errors.courseLength = 'Length must be of format h:mm.';
            formIsValid = false;
        }
        if (this.state.course.watchHref < 1) {
            this.state.errors.watchHref = 'Href must be entered.';
            formIsValid = false;
        }

        this.setState({ errors: this.state.errors });
        return formIsValid;
    },
    saveCourse: function(event) {
        event.preventDefault();

        if (!this.courseFormIsValid()) {
            return;
        }

        if (this.state.course.id) {
            CourseActions.updateCourse(this.state.course);
        } else {
            CourseActions.createCourse(this.state.course);
        }
        this.setState({ dirty: false });
        toastr.success('Course saved.');
        this.transitionTo('courses');
    },
    render: function() {
        return (
            <CourseForm
                course={this.state.course}
                authors={this.state.authors}
                errors={this.state.errors}
                onChange={this.setCourseState}
                onSave={this.saveCourse} />
        );
    },
});

module.exports = ManageCoursePage;
