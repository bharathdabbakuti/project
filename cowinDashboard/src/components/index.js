// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const componentValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CoWinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: componentValues.initial,
  }

  componentDidMount() {
    this.fetchedDataApi()
  }

  fetchedDataApi = async () => {
    this.setState({displayStatus: componentValues.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }

      this.setState({
        fetchedData: convertData,
        displayStatus: componentValues.success,
      })
    } else {
      this.setState({displayStatus: componentValues.failure})
    }
  }

  renderPyCharts = () => {
    const {fetchedData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = fetchedData
    return (
      <>
        <VaccinationCoverage vaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testId="loader">
      <Loader type="ThreeDots" colors="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  switchCaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case componentValues.success:
        return this.renderPyCharts()
      case componentValues.pending:
        return this.loadingView()
      case componentValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-logo-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="page-heading">CoWin Vaccination in India</h1>
        <div className="chats-container">{this.switchCaseCheck()}</div>
      </div>
    )
  }
}

export default CoWinDashboard
