import React, { Component } from 'react';
import cambridgeNeighborhoods from './cambridge_neighborhoods';
import * as d3 from 'd3';

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.setPathStyles = this.setPathStyles.bind(this);
  }

  setPathStyles(d) {
    if (d.properties.NAME === this.props.chosenNeighborhood) return '#8a89a6';
    return '#98abc5';
  }

  componentDidMount() {
    let json = cambridgeNeighborhoods,
        projection = d3.geoMercator()
                       .center([-71.1,42.36])
                       .translate([300, 275])
                       .scale([250000]),
        path = d3.geoPath().projection(projection),
        svg = d3.select('div#neighborhood-map')
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', '0 0 500 350'),
        g = svg.append('g')
               .style('stroke-width', '1.5px');

    g.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'map-path')
      .on('click', this.props.handleHoodClick)
      .style('stroke', '#fff')
      .style('stroke-width', '1')
      .style('cursor', 'pointer')
      .style('fill', this.setPathStyles);
  }

  componentDidUpdate() {
    d3.selectAll('path.map-path')
      .transition()
      .duration(400)
      .style('fill', this.setPathStyles);
  }

  render() {
    return (
      <div className='map-container'>
        <h3>{this.props.chosenNeighborhood}</h3>
        <div id='neighborhood-map' />
      </div>
    );
  };
}
