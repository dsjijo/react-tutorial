import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1
  };
  componentDidMount() {
    const genres = [{ _id: -1, name: "All Generes" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres: genres });
  }
  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  };
  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handleGenreSelect = genre => {
    console.log("genre selected", genre);
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };
  handlePageChange = currentPage => {
    this.setState({ currentPage });
  };
  handleSort = path => {
    console.log(path);
  };
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre
    } = this.state;
    if (count === 0) return <p>There are no movies </p>;
    const filteredMovies =
      selectedGenre && selectedGenre._id !== -1
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;
    const movies = paginate(filteredMovies, currentPage, pageSize);
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            onItemSelect={this.handleGenreSelect}
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <p> Showing {filteredMovies.length} of movies</p>
          <MoviesTable
            movies={movies}
            onLike={this.handleDelete}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            onPageChange={this.handlePageChange}
            itemsCount={filteredMovies.length}
            pageSize={pageSize}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
