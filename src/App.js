import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passw: '',
      login: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('Submitted!' + this.state.login + '  ' + this.state.passw);
    event.preventDefault();
  }

  handleChange(event) {
    const name = event.target.name;
    const vals = event.target.value;
    console.log({[name]:vals});
    this.setState({ [name]: vals });
  }

  render() {
    return (
      <form className="form-signin" onSubmit={this.handleSubmit}>
        <h2 className="form-signin-heading">Entre</h2>
        <input type="email" name="login" className="form-control" value={this.state.login} onChange={this.handleChange} placeholder="E-mail"/>
        <input type="password" name="passw" className="form-control" value={this.state.passw} onChange={this.handleChange} placeholder="Senha"/>
        <button className="btn btn-lg btn-success btn-block" type="submit">Entrar</button>
      </form>
    );
  }
}

export default App;
