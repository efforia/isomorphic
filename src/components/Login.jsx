import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
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
    axios.post(this.props.api + '/api/auth/token/', {
      username: this.state.login,
      password: this.state.passw
    })
    .then((result) => this.props.authenticate(result.data.token))
    .catch((error) => {
      if (error.response.status === 401) alert('Unauthorized');
    });
    event.preventDefault();
  }

  handleChange(event) {
    const name = event.target.name;
    const vals = event.target.value;
    this.setState({ [name]: vals });
  }

  render() {
    return (
      <ion-app>
        <ion-header>
            <ion-navbar color="secondary">
                <ion-title>
                    Frete Fácil
                </ion-title>
            </ion-navbar>
        </ion-header>

        <ion-content padding text-center>
            <article max-width-container>

                <article project-logo></article>
                <form>

                    <ion-item>
                        <ion-label text-color="secondary" inline>
                            <ion-icon name="contact"></ion-icon>
                        </ion-label>
                        <ion-input type="email" name="email" required></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label text-color="secondary" inline>
                            <ion-icon name="lock"></ion-icon>
                        </ion-label>
                        <ion-input name="password" type="password" required></ion-input>
                    </ion-item>

                    <button ion-button color="balanced" block rounded margin-top>
                        <mars-translatable content="sign_in"></mars-translatable>
                    </button>
                </form>

                <button ion-button color="facebook" block rounded icon-left margin-top>
                    <ion-icon name="logo-facebook"></ion-icon>
                    <mars-translatable content="access_with_facebook"></mars-translatable>
                </button>

                <ion-label text-color="dark">
                    <mars-translatable content="dont_have_an_account"></mars-translatable>?
                    <a>
                        <mars-translatable content="sign_up_now"></mars-translatable>
                    </a>
                </ion-label>

                <ion-label text-color="dark">
                    <mars-translatable content="forgot_your_password"></mars-translatable>
                    <a>
                        <mars-translatable content="click_here"></mars-translatable>
                    </a>
                </ion-label>
            </article>
        </ion-content>
        {/*<form className="form-signin" onSubmit={this.handleSubmit}>
          <h2 className="form-signin-heading">Faça o login</h2>
          <input type="text" name="login" className="form-control" value={this.state.login} onChange={this.handleChange} placeholder="E-mail"/>
          <input type="password" name="passw" className="form-control" value={this.state.passw} onChange={this.handleChange} placeholder="Senha"/>
          <button className="btn btn-lg btn-success btn-block" onSubmit={this.handleSubmit} type="submit">Entrar</button>
        </form>*/}
      </ion-app>
    );
  }
}

export default Login;
