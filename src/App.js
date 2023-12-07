import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {ProjectsList: [], selectTab: 'ALL', apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getAllProjects()
  }

  onChangeSelectId = event => {
    this.setState({selectTab: event.target.value}, this.getAllProjects)
  }

  getAllProjects = async () => {
    const {selectTab} = this.state
    this.setState({apiStatus: apiConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${selectTab}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        ProjectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {ProjectsList} = this.state
    return (
      <ul className="list-container">
        {ProjectsList.map(eachItem => (
          <li className="item" key={eachItem.id}>
            <img
              src={eachItem.imageUrl}
              alt={eachItem.name}
              className="project"
            />
            <p className="project-name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="TailSpin" color="#328af2" height={80} width={100} />
    </div>
  )

  onClickRetry = () => {
    this.getAllProjects()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderAllProjectsShow = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {selectTab} = this.state
    return (
      <>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="bg-container">
          <div className="card-container">
            <select
              id="search"
              value={selectTab}
              onChange={this.onChangeSelectId}
            >
              {categoriesList.map(eachItem => (
                <option
                  key={eachItem.id}
                  value={eachItem.id}
                  className="options"
                >
                  {eachItem.displayText}
                </option>
              ))}
            </select>
            {this.renderAllProjectsShow()}
          </div>
        </div>
      </>
    )
  }
}

export default App
