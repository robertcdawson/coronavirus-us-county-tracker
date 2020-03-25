import React, { Component } from 'react';
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  InfoWindow,
} from '@react-google-maps/api';

const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
};

// Set default coordinates
const center = {
  lat: 35,
  lng: -101,
};

const infoWindowDivStyle = {
  background: `white`,
  border: `1px solid #ddd`,
  padding: 15,
  fontSize: '16px',
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
    console.log('autocomplete: ', autocomplete);
    this.autocomplete = autocomplete;
  }

  onPlaceChanged() {
    if (this.autocomplete !== null) {
      countyName = this.autocomplete
        .getPlace()
        .address_components.filter(component => {
          return (
            component.types[0] === 'administrative_area_level_2'
            // component.long_name.includes('Westchester') === true
          );
        })[0].long_name;
      stateName = this.autocomplete
        .getPlace()
        .address_components.filter(component => {
          return (
            component.types[0] === 'administrative_area_level_1'
            // component.long_name.includes('New York') === true
          );
        })[0].long_name;
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

    if (isInfoWindowVisible) {
      infoWindowComponent = (
        <InfoWindow
          onLoad={infoWindowOnLoad}
          position={this.state.infoWindowPosition}
        >
          <div style={infoWindowDivStyle}>
            {this.state.foundLocation.map(location => (
              <div key={location.id}>
                <strong>
                  {location.province} - {location.county}
                </strong>
                <br />
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
                {/* <br />
                recovered: {location.latest.recovered.toLocaleString('en')} */}
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
        <GoogleMap
          id="searchbox-example"
          mapContainerStyle={mapContainerStyle}
          zoom={this.state.zoom}
          center={this.state.center}
        >
          <Autocomplete
            onLoad={this.onLoad}
            onPlaceChanged={this.onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 8px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `20px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: 'absolute',
                left: '50%',
                margin: '1rem 0 0 -120px',
              }}
            />
          </Autocomplete>
          {infoWindowComponent}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
