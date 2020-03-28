import React, { Component } from 'react';
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  InfoWindow,
  StandaloneSearchBox,
} from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100vw',
  height: '60vh',
};

// Set default coordinates
const center = {
  lat: 35,
  lng: -101,
};

const infoWindowOnLoad = infoWindow => {
  console.log('infoWindow: ', infoWindow);
};

// Set default zoom level
const zoom = 4;

// Initialize county name
let countyName;

// Initialize state name
let stateName;

// Initialize found location data
let foundLocation;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: center,
      zoom: zoom,
      infoWindowPosition: { lat: 33.772, lng: -117.214 },
      isInfoWindowVisible: false,
      foundLocation: '',
    };

    this.autocomplete = null;

    this.onLoad = this.onLoad.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  onLoad(autocomplete) {
    this.autocomplete = autocomplete;
  }

  onPlaceChanged() {
    const searchTerm = document.querySelector('.searchField').value;
    console.log('search term', searchTerm);
    if (this.autocomplete !== null) {
      if (
        searchTerm.includes('New York') ||
        searchTerm.includes('NYC') ||
        searchTerm.includes('Bronx') ||
        searchTerm.includes('Brooklyn') ||
        searchTerm.includes('Queens')
      ) {
        countyName = 'New York';
        stateName = 'New York';
      } else {
        countyName = this.autocomplete
          .getPlace()
          .address_components.filter(component => {
            return component.types[0] === 'administrative_area_level_2';
          })[0].long_name;
        stateName = this.autocomplete
          .getPlace()
          .address_components.filter(component => {
            return component.types[0] === 'administrative_area_level_1';
          })[0].long_name;
      }
      foundLocation = this.props.locations.filter(location => {
        return (
          countyName.includes(location.county) === true &&
          stateName.includes(location.province) === true
        );
      });
      console.log('county: ', countyName);
      console.log('state: ', stateName);
      console.log('this.props.locations', this.props.locations);
      console.log(this.autocomplete.getPlace());
      this.setState({
        center: {
          lat: this.autocomplete.getPlace().geometry.location.lat(),
          lng: this.autocomplete.getPlace().geometry.location.lng(),
        },
        infoWindowPosition: {
          lat: this.autocomplete.getPlace().geometry.location.lat(),
          lng: this.autocomplete.getPlace().geometry.location.lng(),
        },
        zoom: 8,
        isInfoWindowVisible: true,
        foundLocation: foundLocation,
      });
      console.log('found location: ', this.state.foundLocation);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  render() {
    const isInfoWindowVisible = this.state.isInfoWindowVisible;
    let infoWindowComponent;

    function formatDate(givenDate) {
      const date = new Date(givenDate);
      // If argument is valid date, return formatted date
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-US').format(date);
      }
      // Else, return empty string
      return '';
    }

    if (isInfoWindowVisible) {
      infoWindowComponent = (
        <InfoWindow
          onLoad={infoWindowOnLoad}
          position={this.state.infoWindowPosition}
          onCloseClick={() => {
            this.setState({ isInfoWindowVisible: false });
          }}
        >
          <div className="infoWindow">
            {this.state.foundLocation.map(location => (
              <div key={location.id}>
                <strong>
                  {location.county}, {location.province}
                </strong>
                <br />
                <br />
                Confirmed: {location.latest.confirmed.toLocaleString('en')}
                <br />
                Deaths: {location.latest.deaths.toLocaleString('en')}
                <br />
                Death Rate:{' '}
                {((location.latest.deaths / location.latest.confirmed) * 100)
                  .toFixed(2)
                  .toLocaleString('en')}
                %
                <br />
                <p className="lastUpdated">
                  <em>Updated: {formatDate(location.last_updated)}</em>
                </p>
              </div>
            ))}
          </div>
        </InfoWindow>
      );
    } else {
      infoWindowComponent = null;
    }

    return (
      <LoadScript
        id="script-loader"
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        {/* Ref: https://developers.google.com/maps/documentation/javascript/reference#Map */}
        <GoogleMap
          id="searchbox-example"
          mapContainerStyle={mapContainerStyle}
          options={{ mapTypeControl: false, fullscreenControl: false }}
          zoom={this.state.zoom}
          center={this.state.center}
        >
          <Autocomplete
            onLoad={this.onLoad}
            onPlaceChanged={this.onPlaceChanged}
            restrictions={{ country: 'US' }}
          >
            <StandaloneSearchBox>
              <input
                type="text"
                placeholder="Search US Counties"
                // Clear search field on click
                onClick={event => {
                  event.target.value = '';
                }}
                className="searchField"
              />
            </StandaloneSearchBox>
          </Autocomplete>
          {infoWindowComponent}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
