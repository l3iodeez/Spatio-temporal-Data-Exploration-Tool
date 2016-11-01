var SeriesGraph = React.createClass({
  getInitialState: function () {
    return {
      displayIds: [],
    };
  },

  componentDidMount: function () {
    SiteDataStore.addChangeListener(SiteConstants.EVENTS.SERIES_DATA_CHANGE, this.gotData);
  },

  gotData: function (data) {
    debugger;
  },

  loadSelectedSeries: function () {
    SiteDataStore.loadSeries(StateStore.selectedSites(), this.gotData);
  },

  render: function () {
    return (
      <div>
        Graph goes here
        <button onClick={this.loadSelectedSeries}>FetchSelected</button>
      </div>
    );
  },
});
