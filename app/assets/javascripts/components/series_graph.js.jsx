var SeriesGraph = React.createClass({
  getInitialState: function () {
    return {
      selection: [],
    };
  },

  componentDidMount: function () {
    var el = ReactDOM.findDOMNode(this).firstChild;
    var chart = new d3Charts.LineChart({
      width: '100%',
      height: '200px',
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
    this.state.chart.requestData(this.state);
  },

  render: function () {
    return (
      <div className='graph-container'>
        <div className='graph'></div>
        <button onClick={this.loadData}>ReloadReloadReloadReloadReload</button>
      </div>
    );
  },
});
