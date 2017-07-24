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

    this.handleHoodClick = this.handleHoodClick.bind(this);
  }

  handleHoodClick(d) {
    this.setState({chosenNeighborhood: d.properties.NAME});
  }

  render() {
    return (
      <div className="App">
        <Map {...this.state} handleHoodClick={this.handleHoodClick}/>
        <Histogram {...this.state}/>
      </div>
    );
  }
}

export default App;
