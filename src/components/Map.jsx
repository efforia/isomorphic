import React, { Component } from 'react';
// import axios from 'axios';

class Board extends Component {
  render() {
    const mapStyle = { border: '0px' };
    return (
      <iframe
      title="Google" width="100%" height="100%" frameBorder="0" style={mapStyle} allowFullScreen
      src="https://www.google.com/maps/embed/v1/search?q=Fretes%20em%20Porto%20Alegre&key=AIzaSyCm-0E5l1wGQRqyO0Lm3FO8YEUZMu11sds">
      </iframe>
    );
  }
}

export default Board;
