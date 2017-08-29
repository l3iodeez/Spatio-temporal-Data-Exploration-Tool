$(document).on('ready', function () {
  var Router = ReactRouter.Router;
  var Route =  ReactRouter.Route;
  var IndexRoute = ReactRouter.IndexRoute;
  var root = document.getElementById('root');

  var App = React.createClass({
    mixins: [ReactRouter.History],

    getInitialState: function () {
      return {

      };
    },

    componentDidMount: function () {
      window.addEventListener(StateConstants.EVENTS.KEYDOWN, this.keyDown);
      window.addEventListener(StateConstants.EVENTS.KEYUP, this.keyUp);
    },

    keyDown: function (evt) {
      StateStore.keyDown(evt.which);
    },

    keyUp: function (evt) {
      StateStore.keyUp(evt.which);
    },

    _ensureLoggedIn: function () {

    },

    render: function () {

      return (
        <div id='app' className='app group'>
          <div className='map container top left'><SiteSelectMap /></div>
          <div className='selector container top right'></div>
          <div className='graph container bottom'><GoogleChart /></div>
        </div>
      );
    },

  });
  var router = (
    <Router>
      <Route path='/' component={App}>
      </Route>
    </Router>
  );
  ReactDOM.render(router, root);
});
