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


    componentWillMount: function () {

    },

    _ensureLoggedIn: function () {

    },
    render: function () {

      return(
        <div className="app container group">
          <div className="map container"></div>
          <div className="selector container"><SiteSearch /></div>
          <div className="graph container top"></div>
          <div className="graph container bottom"></div>
        </div>
      );
    }

  });
  var router = (
    <Router>
      <Route path="/" component={App}>
      </Route>
    </Router>
  );
  ReactDOM.render(router, root);
});
