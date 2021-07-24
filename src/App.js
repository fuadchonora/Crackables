import React, { Component } from 'react';
import NavBar from './components/navBar';
import { MDBFooter, } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

class App extends Component {
  state = {
    navCollapsed: false
  };

  toggleCollapse = () => () =>
  this.setState(prevState => ({
    navCollapsed: prevState.navCollapsed? false : true
  }));

  componentDidMount = () => {
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
      } else {
        document.getElementById("navbar").style.top = "-90px";
      }
      prevScrollpos = currentScrollPos;
    }
  }

  render() {

    return (
      <Router>
        <div className='flyout'>
          <NavBar userName='fuadchonora'/>
          <main style={{ marginTop: '4rem' }}>
            <Routes />
          </main>
          <MDBFooter color='white'>
            <p className='footer-copyright mb-0 py-3 text-center'>
              &copy; 2020 <a href='https://www.fuadchonora.github.io'> Fuad Chonora </a>
            </p>
          </MDBFooter>
        </div>
      </Router>
    );
  }
}

export default App;
