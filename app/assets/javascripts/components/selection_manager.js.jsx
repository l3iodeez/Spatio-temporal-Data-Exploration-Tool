var SelectionManager = React.createClass({
  getInitialState: function () {
    return {
      savedSelections: {},
      currentSelection: '',
      nameEntry: '',
      loggedIn: Boolean(WP.waterPortal.loggedInEmail),
    };
  },

  componentDidMount: function () {
    StateStore.addChangeListener(
      StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE,
      this.updateList
    );
    StateStore.addChangeListener(
      StateConstants.EVENTS.LOGIN_STATE_CHANGE,
      this.updateLoginState
    );
    StateStore.addChangeListener(
      StateConstants.EVENTS.SITE_SELECT_CHANGE,
      this.handleSelectionChange
    );
    if (this.state.loggedIn) {
      StateStore.updateSavedSelections();
    }

    this.updateList();
  },

  handleSelectionChange: function (data) {
    if (
      this.state.currentSelection != '' &&
      this.state.savedSelections[this.state.currentSelection].sort() !== StateStore.selectedSites().sort()
    ) {
      this.setState({ currentSelection: '' });
    }
  },

  saveSelection: function () {
    var usedNames = Object.keys(StateStore.savedSelections()) + [''];
    if (usedNames.includes(this.state.nameEntry)) {
      alert('You must use a unique name.');
      return;
    }

    StateStore.saveSelection(StateStore.selectedSites().slice(0), this.state.nameEntry);
    if (this.state.loggedIn) {
      ApiUtil.saveSelections([{ name: this.state.nameEntry, siteIds: StateStore.selectedSites().slice(0) }], StateStore.authToken());
    }

    this.setState({ nameEntry: '' });
  },

  updateLoginState: function (data) {
    if (data.sucesss) {
      this.setState({ loggedIn: data.loggedIn });
    }

    if (!data.loggedIn) {
      this.setState({
        savedSelections: {},
        currentSelection: '',
        nameEntry: '',
        loggedIn: false,
      });
    } else {
      ApiUtil.getSavedSelections(this.mergeSavedSelections);
    }

    this.updateList();
  },

  mergeSavedSelections: function (data) {
    // send what we've got to the server and merge it with existing selections
    ApiUtil.saveSelections(this.state.savedSelections, StateStore.authToken(), StateStore.updateSavedSelections.bind(StateStore));
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
