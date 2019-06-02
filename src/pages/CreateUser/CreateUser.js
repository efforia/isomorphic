/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment-mini'
import VMasker from 'vanilla-masker'
import isEmpty from 'validator/lib/isEmpty'
import { Page, Link } from 'framework7-react'

import {
  AppPrimaryButton,
  AppPrimaryInput,
  AppNavbar,
  AppForm,
  AppContent,
  AppHeader,
  AppCard
} from '../../components'

import { createProfile } from '../../actions/user'

import arrowIcon from '../../assets/vectors/arrow.svg'

import authService from '../../services/auth'

import './CreateUser.scss'

class CreateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        name: '',
        email: '',
        password: '',
        phone: '',
        birthdate: '',
        displayBirthdate: ''
      }
    }
  }

  componentDidMount() {}

  isValidName(name) {
    return name.split(' ')[1]
  }

  isFormValid() {
    const { user } = this.state
    return (
      !isEmpty(user.name) &&
      !isEmpty(user.email) &&
      !isEmpty(user.password) &&
      !isEmpty(user.phone) &&
      this.isValidName(user.name)
    )
  }

  onSubmit() {
    const { user } = this.state
    this.setState({ isLoading: true })
    this.props
      .createProfile({ ...user, birthdate: moment(user.displayBirthdate, 'DD/MM/YYYY').toDate() })
      .then(data => {
        console.log(data)
        authService.setUserToken(data.token)
        this.$f7router.navigate({ name: 'UserHome' })
      })
      .catch(e => {
        console.log(e)
        this.$f7.dialog.alert(
          'Por favor, verifique as informações preenchidas e tente novamente.',
          'Houve uma falha na operação'
        )
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
    const { user } = this.state
    const renderBackButton = () =>
      this.canGoBack() && (
        <Link
          style={{ verticalAlign: 'middle' }}
          onClick={() => {
            this.$f7router.back()
          }}>
          <img src={arrowIcon} alt="Voltar" />
        </Link>
      )

    return (
      <Page className="create-user-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="create-user-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Dados pessoais</div>
          <div className="app-navbar__right" />
        </AppNavbar>
        <AppContent className="create-user-page__content">
          <AppHeader content={<div>Vamos precisar de algumas informações para o cadastro:</div>} />
          <AppCard className="create-user-page__form">
            <AppForm>
              <AppPrimaryInput
                value={user.email}
                onChange={e => {
                  this.setState({ user: { ...user, email: e.target.value } })
                }}
                required
                colorTheme="orange"
                label="E-mail"
                type="email"
              />
              <AppPrimaryInput
                value={user.password}
                onChange={e => {
                  this.setState({ user: { ...user, password: e.target.value } })
                }}
                colorTheme="orange"
                label="Senha"
                type="password"
              />
              <AppPrimaryInput
                value={user.name}
                onChange={e => {
                  this.setState({ user: { ...user, name: e.target.value } })
                }}
                label="Nome Completo"
                type="text"
              />
              <AppPrimaryInput
                value={user.phone}
                onChange={e => {
                  this.setState({
                    user: { ...user, phone: VMasker.toPattern(`${e.target.value}`, '999999999999') }
                  })
                }}
                maxlength={10}
                colorTheme="orange"
                placeholder="999999999999"
                label="Telefone"
                type="tel"
              />
              <AppPrimaryButton
                disabled={!this.isFormValid()}
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.onSubmit()
                }}>
                Próximo
              </AppPrimaryButton>
            </AppForm>
          </AppCard>
        </AppContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.profile
})

const mapDispatchToProps = dispatch => ({
  createProfile: data => dispatch(createProfile(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser)
