/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, Link, ListInput, List } from 'framework7-react'

import { addDevice } from '../../../actions/device'

import deviceIcon from '../../../assets/vectors/device-enabled.svg'
import arrowIcon from '../../../assets/vectors/arrow.svg'

import tip01 from '../../../assets/vectors/sync-tip-01.svg'
import tip02 from '../../../assets/vectors/sync-tip-02.svg'
import tip03 from '../../../assets/vectors/sync-tip-03.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import Navbar from '../../../components/Navbar'
import Step from '../../../components/Step'

import './AddDevice.scss'
import auth from '../../../services/auth'

class AddDevice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.setState({
      device: {
        name: `Instant do ${auth.getName()}`
      }
    })
  }

  onSubmit() {
    const { device } = this.state
    this.setState({ isLoading: true })
    this.props
      .addDevice({ ...this.props.connected, ...device })
      .then(data => {
        console.log(data)
        this.$f7router.navigate({ name: 'ConfirmUserInfo' })
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
    const { device } = this.state
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
        <Step done />
      </div>
    )

    const tips = [
      {
        picture: tip01,
        text:
          'Para manter o seu device em pleno funcionamento, lembre-se de manter ativado o seu bluetooth e GPS.'
      },
      {
        picture: tip02,
        text:
          'Não retire o device do seu carro cadastrado para evitar problemas futuros com o seguro contratado.'
      },
      {
        picture: tip03,
        text:
          'Se o seu device apresentar qualquer sinal de mau funcionamento entre em contato conosco.'
      }
    ]

    return (
      <Page className="add-device-page">
        <Helmet title={pageTitle} />
        <Navbar className="add-device-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Device</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </Navbar>
        {device && (
          <div className="add-device-page__content">
            <img className="add-device-page__illustration" src={deviceIcon} alt="" />
            <List className="add-device-page__form">
              <ListInput
                value={this.state.device.name}
                onChange={e => {
                  this.setState({ device: { ...device, name: e.target.value } })
                }}
                className="add-device-page__form__input"
                name="Nome do device"
                type="text"
                floatingLabel
              />
            </List>
            <div className="add-device-page__tips">
              {tips.map(tip => (
                <div key={Math.random()} className="add-device-page__tip">
                  <img className="add-device-page__tip__picture" src={tip.picture} alt="" />
                  <div className="add-device-page__tip__label"> {tip.text} </div>
                </div>
              ))}
            </div>
            <PrimaryButton
              disabled={!device || !device.name}
              isLoading={this.state.isLoading}
              onClick={() => {
                this.onSubmit()
              }}>
              Concluir
            </PrimaryButton>
          </div>
        )}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  connected: state.device.connected
})

const mapDispatchToProps = dispatch => ({
  addDevice: device => dispatch(addDevice(device))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDevice)