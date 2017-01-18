var SeriesGraph = React.createClass({
  getInitialState: function () {
    return {
      series: [],
    };
  },

  componentDidMount: function () {

  },

  loadData: function () {
    this.setState({ series: SiteDataStore.loadSeries(StateStore.selectedSites()) });
  },

  render: function () {
    debugger;
    return (
      <div className='graph-container'>
        <div >
          {/* <LineChart data={this.state.series} /> */}
          <LineChart data={{ '2013-02-10 00:00:00 -0800': 11, '2013-02-11 00:00:00 -0800': 6 }} />
        </div>
        <button onClick={this.loadData}>FetchSelected</button>
      </div>
    );
  },
});
