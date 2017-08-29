var SeriesGraph = React.createClass({
  getInitialState: function () {
    return {
      series: {},
    };
  },

  componentDidMount: function () {

  },

  requestData: function () {
    SiteDataStore.loadSeries(StateStore.selectedSites(), this.loadData);
  },

  loadData: function (data) {
    this.setState({ series: data });
  },

  render: function () {
    return (
      <div className='graph'>
        <div >
          <LineChart data={this.state.series} />
        </div>
        <button onClick={this.requestData}>FetchSelected</button>
      </div>
    );
  },
});
