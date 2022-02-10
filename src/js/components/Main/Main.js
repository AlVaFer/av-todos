import React from "react";
import { Router, Route } from "react-router-dom";

import { history } from "../../../_helpers";
import { authenticationService } from "../../../_services";
import PrivateRoute from "../PrivateRoute";
import Tasks from "../Tasks/Tasks";
import Login from "../Login/Login";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe((x) =>
      this.setState({ currentUser: x })
    );
  }

  logout() {
    authenticationService.logout();
    history.push("/login");
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Router history={history}>
        <div>
          {currentUser && (
            <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
              <div id="username" className="text-warning text-uppercase">{currentUser.firstName}</div>
              <div className="text-light">PRUEBA TÉCNICA ::: Alvaro Vallejos</div>
              <div className="navbar-nav">
                <a onClick={this.logout} className="nav-item nav-link text-light">
                  Salir
                </a>
              </div>
            </nav>
          )}
          <div className="jumbotron">
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <PrivateRoute exact path="/" component={Tasks} />
                  <Route path="/login" component={Login} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Main;
