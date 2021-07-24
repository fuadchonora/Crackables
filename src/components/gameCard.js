import React from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBAnimation,
  MDBNavLink
} from 'mdbreact';

class GameCard extends React.Component {
    scrollToTop = () => window.scrollTo(0, 0);
  
    render() {
        return (
            <MDBCol md='12' className='mt-4'>
            <h2 className='text-left mt-5 font-weight-bold'>
                What would
            </h2>
            <h5 className='text-left mb-2'>
                you like to play?
            </h5>
            <MDBRow id='categories'>
                <MDBCol size='6' md='3'>
                <MDBAnimation reveal type='fadeInRight'>
                    <MDBNavLink
                        to='/games/puzzle'
                        onClick={this.scrollToTop}
                    >
                    </MDBNavLink>
                </MDBAnimation>
                </MDBCol>
            </MDBRow>
            </MDBCol>
        )
    }
}

export default GameCard;
