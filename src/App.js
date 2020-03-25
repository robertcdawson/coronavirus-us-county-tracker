import React from 'react';
import Map from './Map';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: '',
      error: null,
      isLoaded: false,
      locations: [],
    };
  }

  componentDidMount() {
    // fetch(
    //   'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs',
    // )
    fetch('api/locations.json')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            locations: result.locations,
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
  }

  render() {
    const { error, isLoaded, locations } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>Search Coronavirus Cases</h1>
          <header>
            <p>
              Instructions: Enter a location in the search field below to see
              county-level data related to{' '}
              <a
                href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
                target="_blank"
              >
                coronavirus disease (COVID-19)
              </a>
              .
            </p>
          </header>
          <Map locations={locations} />
          {/* <h2>All Stats</h2> */}
          {/* <ul>
            {locations.map(location => (
              <li key={location.id}>
                <strong>
                  {location.province} - {location.county}
                </strong>
                <br />
                confirmed: {location.latest.confirmed.toLocaleString('en')}
                <br />
                deaths: {location.latest.deaths.toLocaleString('en')}
                <br />
                death rate:{' '}
                {((location.latest.deaths / location.latest.confirmed) * 100)
                  .toFixed(2)
                  .toLocaleString('en')}
                %
                <br />
                <br />
              </li>
            ))}
          </ul> */}
          <footer>
            <p>
              <strong>Sources</strong>
            </p>
            <ul>
              <li>
                <a
                  href="https://github.com/ExpDev07/coronavirus-tracker-api"
                  target="_blank"
                >
                  Coronavirus Tracker API
                </a>
              </li>
            </ul>
          </footer>
        </div>
      );
    }
  }
}

export default App;
