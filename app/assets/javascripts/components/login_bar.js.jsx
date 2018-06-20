var LoginBar = React.createClass({

  getInitialState: function () {
    var loginData =  StateStore.loginData();
    return {
      email: WP.waterPortal.loggedInEmail || loginData.email,
      password: '',
      signedIn: Boolean(WP.waterPortal.loggedInEmail),
      error: false,
    };
  },

  updateField(fieldName) {
    return function (event) {
      var newState = { error: false };
      newState[fieldName] = event.target.value;
      this.setState(newState);
    }.bind(this);

  },

  signIn() {
    ApiUtil.signIn(this.state.email, this.state.password, this.handleSignIn);
  },

  signOut() {
    ApiUtil.signOut(this.handleSignOut);
  },

  handleSignIn(response) {
    if (response.success) {
      this.setState({
        password: '',
        signedIn: true,
      });
    } else {
      this.setState({
        error: true,
        password: '',
      });
    }
  },

  handleSignOut() {
    this.setState({
      email: '',
      password: '',
      signedIn: false,
    });
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
          <span className='error'>{this.state.error ? 'Invalid login' : null }</span>
          <input
            type='text'
            id='user_email'
            name='user[email]'
            value={this.state.email}
            onChange={this.updateField('email')}
            placeholder='Email'
            />
          <input
            type='password'
            id='user_password'
            name='user[password]'
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
