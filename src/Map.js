import React, { Component } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px',
};

// Set default coordinates
const center = {
  lat: 38.685,
  lng: -115.234,
};

// Set default zoom level
const zoom = 2.5;

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
              placeholder="Place"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: 'absolute',
                left: '50%',
                marginLeft: '-120px',
              }}
            />
          </Autocomplete>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
