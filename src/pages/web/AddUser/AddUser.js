/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, List, Link } from 'framework7-react'
import moment from 'moment-mini'
import VMasker from 'vanilla-masker'
import isEmpty from 'validator/lib/isEmpty'
import { isValid as isValidCpf } from '@fnando/cpf' // import just one function
import { createProfile } from '../../../actions/user'

import arrowIcon from '../../../assets/vectors/arrow.svg'
import logo from '../../../assets/vectors/logo-blue.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import PrimaryInput from '../../../components/PrimaryInput'
import Navbar from '../../../components/Navbar'
import Form from '../../../components/Form'

import './AddUser.scss'



class AddUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        name: '',
        email: '',
        password: '',
        rg: '',
        cpf: '',
        displayCpf: '',
        birthdate: '',
        displayBirthdate: ''
      }
    }
  }

  componentDidMount() {}

  isValidBirthdate(date) {
    return (
      date.length > 9 &&
      moment(date, 'DD/MM/YYYY').isValid() &&
      moment().diff(moment(date, 'DD/MM/YYYY'), 'years') > 18
    )
  }

  isValidName(name) {
    return name.split(' ')[1]
  }

  isFormValid() {
    const { user } = this.state
    return (
      !isEmpty(user.name) &&
      !isEmpty(user.email) &&
      !isEmpty(user.password) &&
      !isEmpty(user.rg) &&
      !isEmpty(user.displayCpf) &&
      isValidCpf(user.displayCpf) &&
      this.isValidName(user.name) &&
      this.isValidBirthdate(user.displayBirthdate)
    )
  }

  onSubmit() {
    const { user } = this.state
    this.setState({ isLoading: true })
    this.props
      .createProfile({ ...user, birthdate: moment(user.displayBirthdate, 'DD/MM/YYYY').toDate() })
      .then(data => {
        console.log(data)
        this.$f7router.navigate({ name: 'AddVehicle' })
      })
      .catch((e) => {
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
      <Page className="add-user-page">
        <Helmet title={pageTitle} />
        <Navbar className="add-user-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title" />
          <div className="app-navbar__right" />
        </Navbar>
        <div className="add-user-page__content">
          <img className="add-user-page__logo" alt="" src={logo} />
          <div className="add-user-page__intro">
            <div className="add-user-page__intro__title">Cadastro</div>
            <div className="add-user-page__intro__content">
              Primeiramente precisamos algumas informações pessoais para o cadastro
            </div>
          </div>
          <List className="add-user-page__form">
            <div className="add-user-page__form__title">Dados Pessoais</div>
            <Form>
              <PrimaryInput
                value={user.email}
                onChange={e => {
                  this.setState({ user: { ...user, email: e.target.value } })
                }}
                required
                colorTheme="blue"
                label="E-mail"
                type="email"
              />
              <PrimaryInput
                value={user.password}
                onChange={e => {
                  this.setState({ user: { ...user, password: e.target.value } })
                }}
                colorTheme="blue"
                label="Senha"
                type="password"
              />
              <PrimaryInput
                value={user.name}
                onChange={e => {
                  this.setState({ user: { ...user, name: e.target.value } })
                }}
                label="Nome Completo"
                type="text"
              />
              <PrimaryInput
                value={user.rg}
                onChange={e => {
                  this.setState({
                    user: { ...user, rg: VMasker.toPattern(`${e.target.value}`, '9999999999') }
                  })
                }}
                maxlength={10}
                colorTheme="blue"
                placeholder="9999999999"
                label="RG"
                type="tel"
              />
              <PrimaryInput
                value={user.displayCpf}
                onChange={e => {
                  this.setState({
                    user: {
                      ...user,
                      cpf: VMasker.toNumber(e.target.value),
                      displayCpf: VMasker.toPattern(`${e.target.value}`, '999.999.999-99')
                    }
                  })
                }}
                maxlength={15}
                placeholder="999.999.999-99"
                label="CPF"
                type="tel"
              />
              <PrimaryInput
                value={user.displayBirthdate}
                type="tel"
                onChange={e => {
                  this.setState({
                    user: {
                      ...user,
                      birthdate: VMasker.toNumber(e.target.value),
                      displayBirthdate: VMasker.toPattern(`${e.target.value}`, '99/99/9999')
                    }
                  })
                }}
                maxlength={10}
                placeholder="99/99/9999"
                label="Data de nascimento"
              />
              <PrimaryButton
                disabled={!this.isFormValid()}
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.onSubmit()
                }}>
                Próximo
              </PrimaryButton>
            </Form>
          </List>
        </div>
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
)(AddUser)