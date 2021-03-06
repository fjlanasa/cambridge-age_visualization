import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Histogram extends Component {
  componentDidUpdate() {
    let keys = ['City of Cambridge', this.props.chosenNeighborhood];

    d3.select('g.legend').selectAll('text')
      .data(keys.slice())
      .text((d) => {return d; });

    d3.selectAll('g.age-bin')
      .data(this.data)
    .selectAll('rect.bar')
      .data((d) => { return keys.map((key) => { return {key: key, value: d[key]}; }); })
      .transition()
      .duration(400)
        .attr("y", (d) => { return this.y(d.value); })
        .attr('height', (d) => { return this.height - this.y(d.value); })
  }

  componentDidMount() {
    let svg = d3.select("svg#hist");
    this.margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    svg.attr('viewBox', '0 0 960 500')
    this.x0 = d3.scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.1);

    this.x1 = d3.scaleBand()
        .padding(0.05);

    this.y = d3.scaleLinear()
        .rangeRound([this.height, 0]);

    this.z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6"]);

      d3.csv("cambridge_neighborhood_data.csv", (d, i, columns) => {
        for (let i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
      }, (error, data) => {
        if (error) throw error;
          this.data = data;

          let keys = ['City of Cambridge', this.props.chosenNeighborhood];

          this.x0.domain(data.map((d) => { return d.attr; }));
          this.x1.domain(keys).rangeRound([0, this.x0.bandwidth()]);
          this.y.domain([0, 70]).nice();

          g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
              .attr('class', 'age-bin')
              .attr("transform", (d) => { return "translate(" + this.x0(d.attr) + ",0)"; })
            .selectAll("rect")
            .data((d) => { return keys.map((key) => { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
              .attr('class', 'bar')
              .attr("x", (d) => { return this.x1(d.key); })
              .attr("width", this.x1.bandwidth())
              .attr("y", (d) => { return this.y(d.value); })
              .attr("height", (d) => { return this.height - this.y(d.value); })
              .attr("fill", (d) => { return this.z(d.key); });


          g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x0));

          g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(this.y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", this.y(this.y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("% of Population");

          let legend = g.append("g")
            .attr("class", "legend")
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice())
          .enter().append("g")
            .attr("transform", (d, i) => { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
            .attr("x", this.width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", this.z);

          legend.append("text")
            .attr("x", this.width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text((d) => { return d; });
      });
    }

  render() {
    return (
      <div className='histogram-container'>
        <h3>Age Distribution by Neighborhood</h3>
        <div id='histogram'>
          <svg id='hist'/>
        </div>
      </div>
    );
  };
}
