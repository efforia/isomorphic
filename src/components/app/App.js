import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../Login.jsx'
import Board from '../Board.jsx'
import './App.css';

const mapStateToProps = (state) => ({ token: state.session.token })

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { token: '' };
  }

  activate = token => this.setState({ token });

  render() {
    return (<app-root></app-root>);
    /*const url = 'http://fretefacil.efforia.io';
    if (this.state.token.length > 0) {
      return <Board/>;
    } else {
      return <Login api={url} authenticate={this.activate}/>;
    }*/
  }
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
