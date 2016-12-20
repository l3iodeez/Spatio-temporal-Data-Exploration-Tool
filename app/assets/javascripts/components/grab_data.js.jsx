var GrabData = React.createClass({

  render: function () {
    return (
      <div>
        Graph goes here
        <button onClick={this.loadSelectedSeries}>FetchSelected</button>
      </div>
    );
  },
});
