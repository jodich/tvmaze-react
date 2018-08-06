class Home extends React.Component {
    constructor (props) {
      super()
      this.onSubmitQuery = this.onSubmitQuery.bind(this);
      this.handleSearchInput = this.handleSearchInput.bind(this)
      this.onSearchAgain = this.onSearchAgain.bind(this)
    }

    state = {
        input: "",
        hasSearched: false
    }

    componentWillMount() {
        console.log('home is mounting')
    }

    componentDidMount() {
        console.log('home mounted')
    }

    handleSearchInput(event) {
        console.log("the input is:", event.target.value)
        this.setState( {input: event.target.value} )
    }
    
    onSubmitQuery(event) {
        // console.log("submitting input as:", this.state.input)
        // var userInput = this.state.input;
        // var searchResults = this.props.results.filter( movie => {
        //     var nameArr = movie.show.name.split(" ");
        //     for (let i = 0; i < nameArr.length; i++) {
        //         if (nameArr[i].toLowerCase() == userInput.toLowerCase()) {
        //             return true
        //         }
        //     }
        // });
        this.setState( {hasSearched: true} )
    }

    onSearchAgain(event) {
        this.setState( {hasSearched: false, input: ""} )
        // resets the input field upon pressing 'back'
    }

    render() {

        if (this.state.hasSearched) {
            var display = <Results input={this.state.input} onSearchAgain={this.onSearchAgain} />
        } else {
            var display = <Search input={this.state.input} handleSearchInput={this.handleSearchInput} onSubmitQuery={this.onSubmitQuery} />
        }

        return (
            <div className="ml-auto mr-auto home text-center">
                <h1 className="text-center">TVMaze React</h1>
                {display}
            </div>
        );
    }
}

class Search extends React.Component {

    constructor (props) {
        super();
    }

    componentWillMount() {
        console.log('search is mounting')
    }

    componentDidMount() {
        console.log('search mounted')
    }

    render() {
        return (
            <div className="text-center">
                <input onChange={this.props.handleSearchInput} value={this.props.input} className="form-control" placeholder="Enter A Movie Title" ></input>
                <button onClick={this.props.onSubmitQuery} type="submit" className="btn btn-primary" >Submit</button>
            </div>
        )
    }
}

class Results extends React.Component {

    constructor (props) {
        super()
    }

    state = {
        movies: []
    }

    componentDidMount() {

        console.log('results is mounted');
        console.log('results is sending an ajax request with the query of', this.props.input);

        var url = "http://api.tvmaze.com/search/shows?q=" + this.props.input;

        // fetch(url)
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //     console.log('ajax request received')
        //     this.setState({
        //         movies: result,
        //     });
        //     },
        //     (error) => {
        //         console.log(error)
        //     }
        // )

        var manipulateData = (data) => {
            this.setState( {movies: data} )
        }

        var responseHandler = function() {
            var data = JSON.parse(this.responseText);
            // Cannot use this.manipulateData, 'this' does not work...
            manipulateData(data);
        };
      
        var request = new XMLHttpRequest();
        var url = "http://api.tvmaze.com/search/shows?q=" + encodeURIComponent(this.props.input);
        request.addEventListener("load", responseHandler);
        request.open("GET", url);
        request.send();
    }

    componentDidUpdate() {
        console.log('results did an update')
    }

    componentWillUpdate() {
        console.log('results is going to update')
    }

    render() {

        var allShows = this.state.movies.map( (movie, index) => {
            return (
                <li key={index}>{movie.show.name}</li>
            )
        })

        return (
            <div>
                <button onClick={this.props.onSearchAgain} type="submit" className="btn btn-primary" >Go Back</button>
                <ul>{allShows}</ul>
            </div>
        )
    }
}

ReactDOM.render(
    <Home />,
    document.getElementById('root')
)