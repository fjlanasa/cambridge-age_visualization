import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Histogram extends Component {
  constructor(props) {
    super(props);

    this.initGraph = this.initGraph.bind(this);
  }

  componentDidMount() {
    this.initGraph();
  }

  componentDidUpdate() {
    let svg = d3.select("svg#hist"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.attr('viewBox', '0 0 960 500')
    let x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    let x1 = d3.scaleBand()
        .padding(0.05);

    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

    let z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6"]);

      d3.csv("cambridge_neighborhood_data.csv", (d, i, columns) => {
        for (let i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
      }, (error, data) => {
        if (error) throw error;

          let keys = ['City of Cambridge', this.props.chosenNeighborhood];

          x0.domain(data.map((d) => { return d.attr; }));
          x1.domain(keys).rangeRound([0, x0.bandwidth()]);
          y.domain([0, 70]).nice();

          d3.select('g.legend').selectAll('text')
            .data(keys.slice())
            .text((d) => {return d; });

          d3.selectAll('g.age-bin')
            .data(data)
          .selectAll('rect.bar')
            .data((d) => { return keys.map((key) => { return {key: key, value: d[key]}; }); })
            .attr("x", (d) => { return x1(d.key); })
            .transition()
            .duration(400)
              .attr("y", (d) => { return y(d.value); })
              .attr('height', (d) => { return height - y(d.value); })
      });
  }

  initGraph() {
    let svg = d3.select("svg#hist"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.attr('viewBox', '0 0 960 500')
    let x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    let x1 = d3.scaleBand()
        .padding(0.05);

    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

    let z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6"]);

      d3.csv("cambridge_neighborhood_data.csv", (d, i, columns) => {
        for (let i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
      }, (error, data) => {
        if (error) throw error;

          let keys = ['City of Cambridge', this.props.chosenNeighborhood];

          x0.domain(data.map((d) => { return d.attr; }));
          x1.domain(keys).rangeRound([0, x0.bandwidth()]);
          y.domain([0, 70]).nice();
          g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
              .attr('class', 'age-bin')
              .attr("transform", (d) => { return "translate(" + x0(d.attr) + ",0)"; })
            .selectAll("rect")
            .data((d) => { return keys.map((key) => { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
              .attr('class', 'bar')
              .attr("x", (d) => { return x1(d.key); })
              .attr("y", (d) => { return y(d.value); })
              .attr("width", x1.bandwidth())
              .attr("height", (d) => { return height - y(d.value); })
              .attr("fill", (d) => { return z(d.key); });


          g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

          g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("% of Population");

          let legend = g.append("g")
            .attr("class", "legend")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice())
          .enter().append("g")
            .attr("transform", (d, i) => { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

          legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text((d) => { return d; });
      });
    }

  render() {
    return (
      <div className='histogram-container'>
        <h3>Histogram!</h3>
        <div id='histogram' style={{minHeight: 500}}>
          <svg id='hist' width='100%' height='100%'/>
        </div>
      </div>
    );
  };
}
