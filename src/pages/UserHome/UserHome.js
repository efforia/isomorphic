/**
 * @license MIT
 * @version 1.1.0
 * @author Trinca
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import moment from 'moment-mini'
import { connect } from 'react-redux'
import { Page, Card, CardContent } from 'framework7-react'
import { AppPrimaryButton, AppContent } from '../../components/index'

import icon from '../../assets/img/profile-pic.jpg'

import './UserHome.scss'

const months = [
  {
    label: 'Jan'
  },
  {
    label: 'Fev'
  },
  {
    label: 'Mar'
  },
  {
    label: 'Abr'
  },
  {
    label: 'Mai'
  },
  {
    label: 'Jun'
  },
  {
    label: 'Jul'
  },
  {
    label: 'Ago'
  },
  {
    label: 'Set'
  },
  {
    label: 'Out'
  },
  {
    label: 'Nov'
  },
  {
    label: 'Dez'
  }
]

class UserHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dates: []
    }
  }

  componentWillMount() {
    this.fetchDates()
  }

  componentDidMount() {}

  fetchDates() {
    const dates = [
      { label: 'Avenida Presidente Vargas, 2332', timestamp: '2019-05-15T01:26:43.574Z' },
      { label: 'Avenida Presidente Vargas, 2332', timestamp: '2019-05-14T01:26:43.574Z' },
      { label: 'Avenida Presidente Vargas, 2332', timestamp: '2019-05-13T01:26:43.574Z' },
      { label: 'Avenida Presidente Vargas, 2332', timestamp: '2019-05-12T01:26:43.574Z' },
      { label: 'Avenida Presidente Vargas, 2332', timestamp: '2019-05-11T01:26:43.574Z' }
    ]
    this.setState({ dates: this.parseDates(dates) })
  }

  parseDates(dates) {
    return dates
      ? dates.map(date => {
          const parsed = moment(date.timestamp).toDate()
          date.month = (months[parsed.getMonth()] || {}).label
          date.day = parsed.getDate()
          return date
        })
      : []
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil'
    const { dates } = this.state
    const { user } = this.props
    return (
      <Page className="user-home-page">
        <Helmet title={pageTitle} />
        <AppContent className="user-home-page__content">
          <img src={icon} alt="" className="user-home-page__avatar" />
          <h1 className="user-home-page__title">Olá, {user.name.split(' ')[0]}</h1>
          <AppPrimaryButton
            onClick={() => {
              this.$f7router.navigate({ name: 'CreateRide' })
            }}>
            Precisando de um frete?
          </AppPrimaryButton>
          <div className="user-home-page__dates">
            {dates &&
              dates.map(date => (
                <Card className="user-home-page__date" key={date.timestamp}>
                  <CardContent className="user-home-page__date__content">
                    <div className="user-home-page__date__time">
                      <div className="user-home-page__date__day">{date.day}</div>
                      <div className="user-home-page__date__month">{date.month}</div>
                    </div>
                    <div className="user-home-page__date__label">{date.label}</div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </AppContent>
      </Page>
    )
  }
}

/* eslint-disable-next-line */
const mapStateToProps = state => ({
  user: state.user.profile
})

/* eslint-disable-next-line */
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHome)
