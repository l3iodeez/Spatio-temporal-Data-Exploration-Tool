var D3Chart = React.createClass({
  getInitialState: function () {
    return {
      series: [],
      filters: {},
    };
  },

  componentDidMount: function () {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  },

  drawChart: function () {
    var chart;
    if (!this.state.chart) {
      chart = d3.select('#visualisation'  + this.props.className.split(' ').join(''));
      this.setState({
        chart: chart,
      }, this.drawChart);
      return;
    } else {
      chart = this.state.chart;
    }

    var container = $('#d3-container' + this.props.className.split(' ').join(''));
    var WIDTH = container.width();
    var HEIGHT = container.height();
    var MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50,
      };
    var xScale = d3.time.scale()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([new Date('1900-01-01'), new Date('2018-01-01')]);
    var yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 150]);
    var xAxis = d3.svg.axis().scale(xScale).ticks(10);
    var yAxis = d3.svg.axis().scale(yScale).orient('left');;
    chart.append('svg:g')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
      .call(xAxis);
    chart.append('svg:g')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

    var lineGen = d3.svg.line()
      .x(function (d) {
        return xScale(new Date(d.measureDate));
      })
      .y(function (d) {
        return yScale(parseFloat(d.waterLevel, 10));
      }).interpolate('basis');;

    var lineGen2 = d3.svg.line()
    .x(function (d) {
        return xScale(d.year);
      })
    .y(function (d) {
        return yScale(d.sale);
      })
    .interpolate('basis');

    var colors = ['blue', 'red', 'green', 'yellow', 'orange', 'black'];
    Object.keys(this.state.series).forEach(function (siteId, idx) {
      chart.append('svg:path')
      .attr('d', lineGen(this.state.series[siteId]))
      .attr('stroke', 'green')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .style('stroke', colors[idx % colors.length]);
    }.bind(this));

  },

  requestData: function () {
    SiteDataStore.loadSeries(StateStore.selectedSites(), this.loadData);
  },

  loadData: function (data) {
    this.setState({ series: data }, this.drawChart);
  },

  render: function () {
    return (
      <div id={'d3-container' + this.props.className.split(' ').join('')} className='graph'>
        <svg
          id={'visualisation' + this.props.className.split(' ').join('')}
          width='100%'
          height='100%'
         />
        <button onClick={this.requestData}>FetchSelected</button>
      </div>
    );
  },
});
