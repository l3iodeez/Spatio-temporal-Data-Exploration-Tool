var SelectionManager = React.createClass({
  getInitialState: function () {
    return {
      savedSelections: [],
    };
  },

  componentDidMount: function () {

  },

  render: function () {
    return (
      <div className='selection-manager'>
        <label>Search:
          <input type='text' onChange={this.updateSearch}/>
        </label>
      </div>
    );
  },
});
