var GoogleChart = React.createClass({
  getInitialState: function () {
    return {
      series: [],
    };
  },

  componentDidMount: function () {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  },

  drawChart: function () {
    var chart;
    if (!this.state.chart) {
      chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
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
      colors: ['black', 'blue', 'red', 'green', 'yellow', 'gray'],
      hAxis: {
        title: 'Measure Date',
        slantedText: false,
        slantedTextAngle: 45,
        textStyle: {
          fontSize: 10,
        },
        format: 'dd-MM-yyyy',
      },
      chartArea: {
        left: 50,
        top: 20,
      },
      trendlines: {},
      explorer: { keepInBounds: true },
    };
    if (this.state.series.cols) {
      for (var i = 0; i < this.state.series.cols.length; i++) {
        options.trendlines[i] = {};
      }
    }

    var dataTable = new google.visualization.DataTable(this.state.series);
    var measureDate = function (date) {
      return new Date(date.getYear(), date.getMonth(), date.getDate());
    };

    var noModifier = function (el) {
      return el;
    };

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
      <div className='graph-container'>
        <div id='chart_div' style={{ width: '100%', height: '100%' }}></div>
        <button onClick={this.requestData}>FetchSelected</button>
      </div>
    );
  },
});
