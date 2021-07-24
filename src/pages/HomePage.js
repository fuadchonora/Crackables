import React from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBAnimation,
  MDBNavLink
} from 'mdbreact';
import GameCard from '../components/gameCard';
import './HomePage.css';

class HomePage extends React.Component {
  scrollToTop = () => window.scrollTo(0, 0);

  render() {
    return (
      <>
        <div className='mt-3 mb-5'>
          <MDBContainer className="px-4">
            <MDBRow>
              {/* <GameCard /> */}
            </MDBRow>
          </MDBContainer>
        </div>
      </>
    );
  }
}

export default HomePage;
