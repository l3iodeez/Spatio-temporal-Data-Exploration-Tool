var GoogleChart = React.createClass({
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
      chart = new google.visualization.LineChart(
        document.getElementById('chart_div-' + this.props.className.split(' ').join(''))
      );
      this.setState({
        chart: chart,
      }, this.drawChart);
      return;
    } else {
      chart = this.state.chart;
    }

    var options = {
      title: 'Water Levels',
      tooltip: {
        isHtml: true,
      },
      title: 'Water Levels',
      trendlines: {},
      pointShape: 'circle',
      lineWidth: 1,
      pointSize: 1,
      explorer: {},
    };
    if (this.state.series.cols) {
      for (var i = 0; i < this.state.series.cols.length; i++) {
        options.trendlines[i] = {};
      }
    }

    var dataTable = new google.visualization.DataTable(this.state.series);

    chart.draw(dataTable, options);

  },

  requestData: function () {
    SiteDataStore.loadSeries(StateStore.selectedSites(), this.loadData);
  },

  loadData: function (data) {
    this.setState({ series: data }, this.drawChart);
  },

  render: function () {
    return (
      <div className='graph'>
        <div
          id={'chart_div-' + this.props.className.split(' ').join('')}
          style={{ width: '100%', height: '100%' }}>
        </div>
        <button onClick={this.requestData}>FetchSelected</button>
      </div>
    );
  },
});
