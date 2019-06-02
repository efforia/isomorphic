/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User authentication page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import isEmpty from 'validator/lib/isEmpty'
import { Page, PageContent, Link } from 'framework7-react'

import { AppContent, AppForm, AppPrimaryInput, AppPrimaryButton, AppCard } from '../../components'

import authService from '../../services/auth'
import { authenticate } from '../../actions/auth'

import logo from '../../assets/vectors/icon.svg'

import './Login.scss'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { email: '', password: '' },
      isLoading: false
    }
  }

  componentWillMount() {}

  componentDidMount() {}

  isValidForm() {
    const { user } = this.state
    return !isEmpty(user.email) && !isEmpty(user.password)
  }

  onSubmit() {
    this.setState({ isLoading: true })
    const { user } = this.state
    this.props
      .authenticate({ email: user.email, password: user.password })
      .then(data => {
        console.log(data)
        authService.setUserToken(data)
        this.$f7router.navigate({ name: 'UserHome' })
      })
      .catch(e => {
        console.log(e)
        this.$f7.dialog.alert(
          'Por favor, verifique suas credenciais e tente novamente.',
          'Houve uma falha na operação'
        )
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    const pageTitle = 'Frete Fácil: Entrar'
    const { user } = this.state
    return (
      <Page className="login-page">
        <Helmet title={pageTitle} />
        <PageContent>
          <AppContent className="login-page__content">
            <AppCard>
              <AppForm className="login-page__form">
                {/*  <h2 className="login-page__app-title">Frete Fácil</h2>   */}
                <img src={logo} alt="Frete Fácil" className="login-page__logo" />
                <AppPrimaryInput
                  value={user.email}
                  onChange={e => {
                    this.setState({ user: { ...user, email: e.target.value } })
                  }}
                  required
                  label="E-mail"
                  type="email"
                />
                <AppPrimaryInput
                  value={user.password}
                  onChange={e => {
                    this.setState({ user: { ...user, password: e.target.value } })
                  }}
                  label="Senha"
                  type="password"
                />
                <AppPrimaryButton
                  fill
                  color="primary"
                  disabled={!this.isValidForm()}
                  isLoading={this.state.isLoading}
                  onClick={() => {
                    this.onSubmit()
                  }}>
                  Entrar
                </AppPrimaryButton>
                <p className="login-page__paragraph">
                  Esqueceu a senha?&nbsp;
                  <Link className="login-page__link" onClick={() => {}}>
                    Clique aqui
                  </Link>
                </p>
              </AppForm>
            </AppCard>
          </AppContent>
        </PageContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  authenticate: user => dispatch(authenticate(user))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
