/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, Link, Button } from 'framework7-react'

import {
  clearNearbyDevices,
  findNearbyDevices,
  selectDevice,
  connectToDevice
} from '../../../actions/device'

import arrowIcon from '../../../assets/vectors/arrow.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton'
import Navbar from '../../../components/Navbar'
import Step from '../../../components/Step'

import './SelectDevice.scss'

class SelectDevice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.clearNearbyDevices()
    this.props.findNearbyDevices()
  }

  onSelect(device) {
    this.props.selectDevice(device)
    this.setState({})
  }

  onConfirm() {
    const { selected } = this.props
    this.setState({ isLoading: true })
    this.props
      .connectToDevice(selected)
      .then(() => {
        this.$f7router.navigate({ name: 'AddDevice' })
      })
      .catch(e => {
        console.log(e)
        this.$f7.dialog.alert(
          'Por favor, garanta que o bluetooth do smartphone está ativado e tente novamente.',
          'Falha na sincronização'
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
    const { devices, selected } = this.props
    console.log(devices)
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

    const renderSteps = () => (
      <div>
        <Step done />
        <Step done />
        <Step />
      </div>
    )

    return (
      <Page className="select-device-page">
        <Helmet title={pageTitle} />
        <Navbar className="select-device-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Device</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </Navbar>
        <div className="select-device-page__content">
          <div>
            <div className="select-device-page__intro__title">Sincronizar device</div>
            <div className="select-device-page__intro__content">
              Selecione o device que você deseja sincronizar com o Instant (não será possível
              alterar):
            </div>
            <div className="select-device-page__list">
              {devices &&
                devices.length > 0 &&
                devices.map(
                  device =>
                    device.name && (
                      <Button
                        className={`select-device-page__list__item ${
                          device.id === selected.id ? 'selected' : ''
                        }`}
                        key={device.id}
                        onClick={() => this.onSelect(device)}>
                        {device.name}
                      </Button>
                    )
                )}
            </div>
            <PrimaryButton
              disabled={!selected || !selected.id}
              isLoading={this.state.isLoading}
              onClick={() => {
                this.onConfirm()
              }}>
              Sincronizar
            </PrimaryButton>
            <SecondaryButton>Não estou encontrando meu device</SecondaryButton>
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  devices: state.device.nearby,
  selected: state.device.selected
})

const mapDispatchToProps = dispatch => ({
  findNearbyDevices: () => dispatch(findNearbyDevices()),
  clearNearbyDevices: () => dispatch(clearNearbyDevices()),
  selectDevice: device => dispatch(selectDevice(device)),
  connectToDevice: device => dispatch(connectToDevice(device))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDevice)
