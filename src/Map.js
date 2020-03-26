import React, { Component } from 'react';
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  InfoWindow,
  StandaloneSearchBox,
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
  textAlign: 'left',
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

  // setCurrentPosition() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       this.setState({
  //         center: {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         },
  //       });
  //     });
  //   }
  // }

  onLoad(autocomplete) {
    this.autocomplete = autocomplete;
  }

  onPlaceChanged() {
    if (this.autocomplete !== null) {
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
          onCloseClick={() => {
            this.setState({ isInfoWindowVisible: false });
          }}
        >
          <div style={infoWindowDivStyle}>
            {this.state.foundLocation.map(location => (
              <div key={location.id}>
                <strong>
                  {location.county}, {location.province}
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
          >
            <StandaloneSearchBox>
              <input
                type="text"
                placeholder="Search"
                // Clear search field on click
                onClick={event => {
                  event.target.value = '';
                }}
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
                  top: '3rem',
                  margin: '1rem 0 0 -120px',
                }}
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
