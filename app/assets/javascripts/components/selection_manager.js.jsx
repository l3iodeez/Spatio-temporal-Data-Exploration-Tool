var SelectionManager = React.createClass({
  getInitialState: function () {
    return {
      savedSelections: {},
      currentSelection: [],
      nameEntry: '',
    };
  },

  componentDidMount: function () {
    StateStore.addChangeListener(
      StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE,
      this.updateList
    );
    StateStore.addChangeListener(
      StateConstants.EVENTS.LOGIN_STATE_CHANGE,
      this.mergeSavedSelections
    );
    this.updateList();
  },

  saveSelection: function () {
    var usedNames = Object.keys(StateStore.savedSelections()) + [''];
    if (usedNames.includes(this.state.nameEntry)) {
      alert('You must use a unique name.');
      return;
    }

    StateStore.saveSelection(StateStore.selectedSites().slice(0), this.state.nameEntry);
    this.setState({ nameEntry: '' });
  },

  mergeSavedSelections: function (data) {
    // send any existing un-persisted saved selections to the db
  },

  updateName: function (e) {
    this.setState({ nameEntry: e.target.value });
  },

  updateList: function (data) {
    this.setState({ savedSelections: StateStore.savedSelections() });
  },

  setCurrent: function (name) {
    return function () {
      this.setState({ currentSelection: name });

      StateStore.loadSelection(this.state.savedSelections[name]);
    }.bind(this);
  },

  render: function () {
    return (
      <div className='selection-manager'>
        <input type='text' value={this.state.nameEntry} onChange={this.updateName} />
        <button onClick={this.saveSelection}>Save Map Selection</button>
        <br />
        <h5>Saved Selections</h5>
        <ul className='saved-selection-list'>
          {Object.keys(StateStore.savedSelections()).map(function (name) {
            return (
              <li
                key={name}
                className={name === this.state.currentSelection ? 'selected' : ''}
                id={'saved-selection-' + name}
                onClick={this.setCurrent(name)}
                >{name}</li>
            );
          }.bind(this))}
        </ul>
      </div>
    );
  },
});
