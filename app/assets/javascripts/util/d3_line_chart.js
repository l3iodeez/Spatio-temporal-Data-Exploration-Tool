var d3Charts = window.d3Charts = window.d3Charts || {};

d3Charts.LineChart = function (opt) {
  this.el = opt.el;
  this.width = opt.width;
  this.height = opt.height;
  this.parseDate = d3.time.format('%Y-%m-%d').parse;

  this.svg = d3.select(this.el).append('svg')
      .attr('class', 'd3')
      .attr('width', this.width)
      .attr('height', this.height);
  this.svg.append('g')
      .attr('class', 'd3-lines');
  this.selection = opt.selection;
  this._valueLines = [];
};

d3Charts.LineChart.prototype.requestData = function (state) {
  SiteDataStore.loadSeries(state.selection, this.receiveData.bind(this));
};

d3Charts.LineChart.prototype.receiveData = function (data) {
    // Set the ranges
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    // Define the axes
    this.xAxis = d3.svg.axis().scale(this.x)
        .orient('bottom').ticks(5);

    this.yAxis = d3.svg.axis().scale(this.y)
        .orient('left').ticks(5);
    debugger;

  };

d3Charts.LineChart.prototype.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

d3Charts.LineChart.prototype._drawLines = function (el, scales, data) {
  var g = d3.select(el).selectAll('.d3-lines');
  data.forEach(function (series) {
    x.domain(d3.extent(data, function (d) { return d.measure_date; }));

    y.domain([0, d3.max(data, function (d) { return d.water_level; })]);

    d3.json(series, function (data) {

    });
  });
};

d3Charts.LineChart.prototype._valueLine = function () {
  return d3.svg.line()
      .x(function (d) { return x(d.measure_date); })
      .y(function (d) { return y(d.water_level); });
};

