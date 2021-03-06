import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Book from './Book';

class Search extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    changeShelf: PropTypes.func.isRequired
    // handleSearch: PropTypes.func.isRequired
  }

  state = {
    query: '',
    results: []
  }

  updateQuery = (query) => {
    this.setState({query: query});
    // Don't call the API if the query is empty
    // Also reset results
    if ('' === query) {
      this.setState({results: []});
      return;
    }
    this.fetchResults(query);
  }

  fetchResults(query) {

    BooksAPI.search(query.trim()).then((results) => {
      if (!results || 'error' in results) throw new Error('Invalid results');

      this.setState((state) => {
        // Filter out books that are already assigned
        // To shelves and get them from App state
        results = results.map((book) => (
          this.props.books.filter((b) => b.id === book.id).pop() ||
          book
        ));
        // Attempt to solve the 'holding backspace' bug.
        // Also need to solve an anologous bug when a user types ver fast
        // SOLVED: This is asynchronous so let's just
        // compare current state.query with our original query
        query !== state.query && (results = state.results);
        return {results};
      });
    }).catch(() => {
      this.setState({results: []});
    });
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={(e) => this.updateQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.results.map((book) => (
              <Book
                key={book.id}
                book={book}
                changeShelf={this.props.changeShelf}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;