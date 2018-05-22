var LoginBar = React.createClass({

  getInitialState: function () {
    var loginData =  StateStore.loginData()
    return {
      email: WP.waterPortal.loggedInEmail || loginData.email,
      password: '',
      signedIn: Boolean(WP.waterPortal.loggedInEmail),
    }
  },

  componentDidMount(){
    StateStore.addChangeListener(StateConstants.EVENTS.LOGIN_STATE_CHANGE, this.updateLogin);
  },

  updateField(fieldName) {
    return function (event) {
      var newState = {};
      newState[fieldName] = event.target.value
      this.setState(newState)
    }.bind(this);

  },

  signIn(event) {
    ApiUtil.signIn(this.state.email, this.state.password, this.handleSignIn);
  },

  signOut(event) {
    ApiUtil.signOut(this.handleSignOut);
  },

  updateLogin(){
    debugger;
  },

  render: function () {
    if (this.state.signedIn) {
      return (
        <div className='login-bar'>
          <span>Logged in as: {this.state.email}</span>
          <a onClick={this.signOut}>Sign out</a>
        </div>
      );
    } else {
      return (
        <div className='login-bar'>
          <input
            type='text'
            value={this.state.email}
            onChange={this.updateField('email')}
            placeholder='Email'
            />
          <input
            type='password'
            value={this.state.password}
            onChange={this.updateField('password')}
            placeholder='Password'
            />
          <a onClick={this.signIn}>Sign In</a> |
          <a href='/users/sign_up'>Sign up</a>
        </div>
      );
    }

  },
});
