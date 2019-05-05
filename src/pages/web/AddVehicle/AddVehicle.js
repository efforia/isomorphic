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
import VMasker from 'vanilla-masker'
import isEmpty from 'validator/lib/isEmpty'

import { createVehicle } from '../../../actions/vehicle';

import arrowIcon from '../../../assets/vectors/arrow.svg'
import logo from '../../../assets/vectors/logo-blue.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import PrimaryInput from '../../../components/PrimaryInput'
import Navbar from '../../../components/Navbar'

import './AddVehicle.scss'



class AddVehicle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vehicle: {
        plate: '',
        brand: '',
        model: '',
        year: '',
        renavam: ''
      }
    }
  }

  componentDidMount() {}

  isFormValid() {
    const { vehicle } = this.state
    return (
      !isEmpty(vehicle.plate) &&
      !isEmpty(vehicle.brand) &&
      !isEmpty(vehicle.model) &&
      !isEmpty(vehicle.year) &&
      !isEmpty(vehicle.renavam)
    )
  }

  onSubmit() {
    this.setState({ isLoading: true })
    this.props
      .createVehicle({ ...this.state.vehicle })
      .then((data) => {
        console.log(data)
        this.$f7router.navigate({ name: 'SignupFeedback' })
      })
      .catch(() => {
        this.$f7.dialog.alert(
          'Por favor, verifique as informações preenchidas e tente novamente.',
          'Houve uma falha na operação'
        )
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
    this.$f7router.navigate({ name: 'SignupFeedback' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
    const { vehicle } = this.state
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
      <Page className="add-vehicle-page">
        <Helmet title={pageTitle} />
        <Navbar className="add-vehicle-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title" />
          <div className="app-navbar__right" />
        </Navbar>
        <div className="add-vehicle-page__content">
          <img className="add-vehicle-page__logo" alt="" src={logo} />
          <div className="add-vehicle-page__intro">
            <div className="add-vehicle-page__intro__title">Cadastro</div>
            <div className="add-vehicle-page__intro__content">
              Para finalizar o cadastro precisamos dos dados do seu carro.
            </div>
          </div>
          <List className="add-vehicle-page__form">
            <div className="add-vehicle-page__form__title">Dados do seu carro</div>
            <PrimaryInput
              value={vehicle.plate}
              onChange={e => {
                this.setState({
                  vehicle: {
                    ...vehicle,
                    plate: VMasker.toPattern(`${e.target.value}`, 'SSS-SSSS').toUpperCase()
                  }
                })
              }}
              label="Placa do Carro"
              type="text"
            />
            <PrimaryInput
              value={vehicle.brand}
              onChange={e => {
                this.setState({ vehicle: { ...vehicle, brand: e.target.value } })
              }}
              label="Marca do carro"
              type="text"
            />
            <PrimaryInput
              value={vehicle.model}
              onChange={e => {
                this.setState({ vehicle: { ...vehicle, model: e.target.value } })
              }}
              label="Modelo do carro"
              type="text"
            />
            <PrimaryInput
              value={vehicle.year}
              onChange={e => {
                this.setState({
                  vehicle: { ...vehicle, year: VMasker.toPattern(`${e.target.value}`, '9999') }
                })
              }}
              placeholder="9999"
              label="Ano do carro"
              type="tel"
            />
            <PrimaryInput
              value={vehicle.renavam}
              placeholder="99999999999"
              onChange={e => {
                this.setState({
                  vehicle: {
                    ...vehicle,
                    renavam: VMasker.toPattern(`${e.target.value}`, '99999999999')
                  }
                })
              }}
              label="Renavan"
              type="tel"
            />
            <PrimaryButton
              disabled={!this.isFormValid()}
              isLoading={this.state.isLoading}
              onClick={() => {
                this.onSubmit()
              }}>
              Finalizar
            </PrimaryButton>
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
  createVehicle: (data) => dispatch(createVehicle(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVehicle)
