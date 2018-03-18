import React, { Component } from 'react';
import './App.css';
import Highlighter from 'react-highlight-words';
import Autosuggest from 'react-bootstrap-autosuggest';

export class App extends Component {

      constructor() {
          super();
          this.state = {
            name : null,
            movieAutoCompleteList :[],
            fliteredMovieList:[],
            selectedOption : 'movieName',
            movies:{
              resultCount:null,
              results:[]
            },
            currentPage: 1,
            moviesPerPage: 9,
            isDisabled : 'true'
          };
          this.handleClick = this.handleClick.bind(this);
      }

// function call for onchange of radio button
      handleOptionChange(event){
          this.setState({
            selectedOption: event.target.value,
            movies:{
                resultCount:null,
                results:[]
            }
          });
      }

// function call when there ia any value change in the input textbox to fetch autosuggest list from api
      nameChange(enteredName){
          this.setState({
            name: enteredName,
            movies:{
              resultCount:null,
              results:[]
            }
          });

          if(enteredName){
            this.setState({
              isDisabled: false,
            });
          }
          else{
            this.setState({
              isDisabled: true,
            });
          }

          if(enteredName.length >= "3"){
              let movieSearchAttr = null;
              let url = null;
              if(this.state.selectedOption === 'movieName'){
                  movieSearchAttr = "movieTerm";
                  url = "https://itunes.apple.com/search?term="+enteredName+"&media=movie&entity=movie&attribute="+movieSearchAttr;
                
                  fetch(url).then(res=>res.json()).then(res => {
                      this.setState({
                        movieAutoCompleteList:res.results
                      });

                      let arr = [];
                      this.state.movieAutoCompleteList.map(movie => {
                          arr.push(movie.trackCensoredName)
                      });
                      this.setState({
                          fliteredMovieList: arr,
                      });
                  })
              }
              else{
                movieSearchAttr = "artistTerm";
                url = "https://itunes.apple.com/search?term="+enteredName+"&media=movie&entity=movieArtist&attribute="+movieSearchAttr;
                
                fetch(url).then(res=>res.json()).then(res => {
                    this.setState({
                      movieAutoCompleteList:res.results
                    });

                    let arr = [];
                    this.state.movieAutoCompleteList.map(movie => {
                        arr.push(movie.artistName)
                    });
                    this.setState({
                        fliteredMovieList: arr,
                    });

                })

              }

          }
          else{
            this.setState({
                fliteredMovieList: [],
            });
          }
      }

      handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
      }

      loadMoviesFromAppleApi() {
        
          let movieSearchAttr = null;
          let url = null;

          if(this.state.selectedOption === 'movieName'){
              movieSearchAttr = "movieTerm";
              url = "https://itunes.apple.com/search?term="+this.state.name+"&media=movie&entity=movie&attribute="+movieSearchAttr;
          }
          else{
            movieSearchAttr = "actorTerm";
            url = "https://itunes.apple.com/search?term="+this.state.name+"&media=movie&entity=movie&attribute="+movieSearchAttr;
          }

          fetch(url).then(res=>res.json()).then(res => {
            this.setState({
              movies:res
            });
          })
          .catch(error => {
            console.log(error)
          });
      }

      render() {
        const movies = this.state.movies;
        const currentPage = this.state.currentPage;
        const moviesPerPage = this.state.moviesPerPage;
        // Logic for displaying current movies
        const indexOfLastMovie = currentPage * moviesPerPage;
        const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
        const currentMovies = movies.results.slice(indexOfFirstMovie, indexOfLastMovie);

        const renderMovies = currentMovies.map((movie, index) => {
          return (

              <div>
                  <div className="col-md-4">
                    <div className="panel panel-success">
                      <div className="panel-heading text-center"><b>
                        <Highlighter
                            highlightClassName='YourHighlightClass'
                            searchWords={[this.state.name]}
                            autoEscape={true}
                            textToHighlight={movie.trackCensoredName}/></b>
                      </div>
                      <div className="panel-body">
                        <img src={movie.artworkUrl100} className="img-responsive col-md-4" alt="Pic not available"/>
                        <div className="col-md-8"><b>
                          <div>Director : {movie.artistName}</div>
                          <div>Genre : {movie.primaryGenreName}</div>
                          <div>Rating : {movie.contentAdvisoryRating}</div></b>
                        </div>
                        </div>
                      <div className="panel-footer text-center">
                        <a className="btn btn-info" target="_blank" href={movie.previewUrl}>View Trailer</a>
                      </div>
                    </div>
                  </div>
                </div>
            );
          });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(movies.results.length / moviesPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
          return (
            <li>
            <a key={number} id={number} onClick={this.handleClick}>{number}</a>
            </li>
          );
        });



        return (
          <div>
            
              <div className="App-header">
                <div className="container text-center">
                  <h1>iMovie Search Store</h1>    
                </div>
              </div>

              <div className="container">    
                
                <div className="row col-md-12 text-center">
                  <div className="radio">
                      <label><input type="radio" name="movie" value="movieName" checked={this.state.selectedOption === 'movieName'} onChange={this.handleOptionChange.bind(this)}></input>Movie Name</label>&nbsp;&nbsp;
                      <label><input type="radio" name="movie" value="actorName" checked={this.state.selectedOption === 'actorName'} onChange={this.handleOptionChange.bind(this)}></input>Actor Name</label>
                  </div>
                </div>

                <div className ="row col-md-12 form-inline text-center">
                  <div className = "form-group">
                    <Autosuggest ref="myTextInput" className="form-control"
                        datalist={this.state.fliteredMovieList}
                        placeholder="Enter Name"
                        onChange={this.nameChange.bind(this)}
                    />
                    </div>
                    <div className = "form-group">
                    <button className="btn btn-success" onClick={this.loadMoviesFromAppleApi.bind(this)} disabled={this.state.isDisabled}>Search</button>
                  </div><br/><br/>
                </div>

                <div className="row col-md-12">
                  {renderMovies}
                </div>

                <div className="row col-md-12 text-center">
                  <ul className="pagination pagination-lg">
                  {renderPageNumbers}
                  </ul>
                </div>

              </div>
            
          </div>
        );
      }
}

export default App;
