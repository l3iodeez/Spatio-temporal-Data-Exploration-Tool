$(document).on('ready', function () {
  var Router = ReactRouter.Router;
  var Route =  ReactRouter.Route;
  var IndexRoute = ReactRouter.IndexRoute;
  var root = document.getElementById('root');

  var App = React.createClass({
    mixins: [ReactRouter.History],

    getInitialState: function () {
      return {
        configuration: {
          topLeft: 'selectMap',
          topBottomRight: 'selectManager',
          bottomLeft: 'graph',
        },
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

    renderComponentByType: function (type, className) {
      switch (type) {
        case 'selectMap':
          return (<SiteSelectMap className={className} />);
          break;
        case 'graph':
          return (<GoogleChart className={className} />);
          break;
        case 'selectManager':
          return (<SelectionManager className={className} />);
          break;
        default:

      }
    },

    render: function () {

      return (
        <div id='app' className='app group'>
          {Object.keys(this.state.configuration).map(function (key) {
            var className = 'container ' + key.split(/(?=[A-Z])/).join(' ').toLowerCase();
            return (
              <div key={className} className={ className }>
                {this.renderComponentByType(this.state.configuration[key], className)}
              </div>
            );
          }.bind(this))}
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
