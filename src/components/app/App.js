import React, { Component } from 'react';
import Login from '../Login.jsx'
import Board from '../Board.jsx'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { token: '' };
  }

  activate = token => this.setState({ token });

  render() {
    const url = process.env.API || 'http://127.0.0.1:8000';
    if (this.state.token.length > 0) {
      return <Board/>;
    } else {
      return <Login api={url} authenticate={this.activate}/>;
    }
  }
}

export default App;
