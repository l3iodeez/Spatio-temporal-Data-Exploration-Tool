var d3Charts = window.d3Charts = window.d3Charts || {};

d3Charts.LineChart = function (opt) {
  this.el = opt.el;
  this.parseDate = d3.time.format('%Y-%m-%d').parse;
  this.dateFormat = d3.time.format('%x');
  this.selection = opt.selection;
  this._valueLines = [];
  this.margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50,
      };
  this.width = opt.width; //- this.margin.left - this.margin.right;
  this.height = opt.height; //- this.margin.top - this.margin.bottom;
  this.svg = d3.select(this.el).append('svg')
      .attr('class', 'd3')
      .attr('width', this.width)
      .attr('height', this.height);
  this.svg.append('g')
      .attr('class', 'd3-lines')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
};

d3Charts.LineChart.prototype.requestData = function (state) {
  SiteDataStore.loadSeries(state.selection, this.receiveData.bind(this));
};

d3Charts.LineChart.prototype.receiveData = function (data) {
    // Set the ranges
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.color = d3.scale.category20();

    // Define the axes
    this.xAxis = d3.svg.axis().scale(this.x)
        .orient('bottom').ticks(5);

    this.yAxis = d3.svg.axis().scale(this.y)
        .orient('left').ticks(5);

    this.nestedData = d3.nest()
        .key(function (d) {
        return d.site_id;
      })
        .key(function (d) {
        return dateFormat(new Date(d.measure_date));
      })
        .entries(data);
    this.min = d3.min(nestedData, function (datum) {
      return d3.min(datum.values, function (d) {
          return d.values.length;
        });
    });

    this.max = d3.max(nestedData, function (datum) {
      return d3.max(datum.values, function (d) {
          return d.values.length;
        });
    });

    this._drawLines(this.el, data);

  };

d3Charts.LineChart.prototype.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

d3Charts.LineChart.prototype._drawLines = function (el, data) {
  debugger;
  Object.keys(data).forEach(function (key) {
    series = data[key];
    this.x.domain(d3.extent(data, function (d) { return d.measure_date; }));

    this.y.domain([0, d3.max(data, function (d) { return d.water_level; })]);

    debugger;
    d3.json(series, function (data) {
      return data.measure_date;
    });
  }.bind(this));
};

d3Charts.LineChart.prototype._valueLine = function () {
  return d3.svg.line()
      .x(function (d) { return x(d.measure_date); })
      .y(function (d) { return y(d.water_level); });
};

