import axios from 'axios';

export default {
    //Adding an Issue
    addIssue: function(userName,data) {
		return axios.post('/api/add-issue', userName,data);
	},
	// Gets all books
	getAllIssue: function() {
		return axios.get('/api/list-issues');
	},
	// Gets the book with the given id
	getCloseIssue: function(id) {
		return axios.get('/api/books/' + id);
	},
	// Deletes the book with the given id
	deleteIssue: function(id) {
		return axios.delete('/api//delete-issue' + id);
	},
	// Saves a book to the database
	
};