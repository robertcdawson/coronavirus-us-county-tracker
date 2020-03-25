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

const infoWindowPosition = { lat: 33.772, lng: -117.214 };

const infoWindowDivStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

const infoWindowOnLoad = infoWindow => {
  console.log('infoWindow: ', infoWindow);
};

// Set default zoom level
const zoom = 4;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: center,
      zoom: zoom,
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
      console.log(this.autocomplete.getPlace());
      this.setState({
        center: {
          lat: this.autocomplete.getPlace().geometry.location.lat(),
          lng: this.autocomplete.getPlace().geometry.location.lng(),
        },
        zoom: 5,
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  render() {
    return (
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyAH-q6sCWB5FSS2iDGbXXdm6EhpnyF_118"
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
          <InfoWindow onLoad={infoWindowOnLoad} position={infoWindowPosition}>
            <div style={infoWindowDivStyle}>
              <h1>InfoWindow</h1>
            </div>
          </InfoWindow>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
