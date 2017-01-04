var SeriesGraph = React.createClass({
  getInitialState: function () {
    return {
      selection: [],
      series: [],
    };
  },

  componentDidMount: function () {
    var el = ReactDOM.findDOMNode(this).firstChild;
    var chart = new d3Charts.LineChart({
      width: '100%',
      height: '100%',
      el: el,
      selection: this.state.selection,
    });

    StateStore.addChangeListener(
        StateConstants.EVENTS.SITE_SELECT_CHANGE,
        this.updateSelection
      );

    this.setState({
        chart: chart,
      });
  },

  updateSelection: function () {
    this.setState({
      selection: StateStore.selectedSites(),
    });
  },

  loadData: function () {
    debugger;
    this.setState({ series: SiteDataStore.loadSeries(this.state.selection, this.chart.receiveData.bind(this.chart)) });
  },

  render: function () {
    return (
      <div>
        <div className='graph-container'>
          <LineChart data={this.state.series} />
        </div>
      </div>
    );
  },
});
