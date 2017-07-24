import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import Histogram from './Histogram';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenNeighborhood: 'East Cambridge'
    }

    this.resetHood = this.resetHood.bind(this);
    this.handleHoodClick = this.handleHoodClick.bind(this);
  }

  resetHood() {
    this.setState({chosenNeighborhood: null});
  }

  handleHoodClick(d) {
    this.setState({chosenNeighborhood: d.properties.NAME});
  }

  render() {
    return (
      <div className="App">
        <Map {...this.state} handleHoodClick={this.handleHoodClick}/>
        <Histogram resetHood={this.resetHood} {...this.state}/>
      </div>
    );
  }
}

export default App;
