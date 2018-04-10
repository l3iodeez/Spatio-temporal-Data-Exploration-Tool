var AdvancedD3Chart = React.createClass({
  getInitialState: function () {
    return {
      series: null,
      filters: {},
      nameEntry: '',
      filterStart: null,
      filterEnd: null,
    };
  },

  componentDidMount: function () {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  },

  sizes: function () {
    var $container = $('#' + this.props.className.split(' ').join(''));
    var margin = { top: 20, right: $container.width() / 4, bottom: 100, left: 50 };
    var margin2 = { top: 40, right: 10, bottom: 275, left: 40 };
    var width = $container.width() - margin.left - margin.right;

    var height = 330 - margin.top - margin.bottom;
    var height2 = 350 - margin2.top - margin2.bottom;
    return {
      container: $container,
      width: width,
      margin: margin,
      margin2: margin2,
      height: height,
      height2: height2,
      offset: 250,
    };
  },

  drawChart: function () {
    if (!this.state.series) {
      return;
    }

    var sizes = this.sizes();

    var parseDate = d3.time.format('%Y%m%d').parse;
    var bisectDate = d3.bisector(function (d) { return d.date; }).left;

    var xScale = d3.time.scale()
        .range([0, sizes.width]);

    var xScale2 = d3.time.scale()
        .range([0, sizes.width]); // Duplicate xScale for brushing ref later

    var yScale = d3.scale.linear()
        .range([sizes.height, 0]);

    // 40 Custom DDV colors
    var color = this.color();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var xAxis2 = d3.svg.axis() // xAxis for brush slider
        .scale(xScale2)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return xScale(d.measureDate); })
        .y(function (d) { return yScale(d.waterLevel); })
        .defined(function (d) { return d.waterLevel; });

    var extents = xScale.domain();

    this.setState({
      filterStart: new Date(Math.min.apply(null, extents)),
      filterEnd: new Date(Math.max.apply(null, extents)),
      xAxis: xAxis,
      yAxis: yAxis,
    });

    // Hiding line value defaults of 0 for missing data

    var maxY; // Defined later to update yAxis
    $('#visualisation'  + this.props.className.split(' ').join('')).empty();
    var svg = d3.select('#visualisation'  + this.props.className.split(' ').join('')).append('svg')
        .attr('width', sizes.width + sizes.margin.left + sizes.margin.right)
        .attr('height', sizes.height + sizes.margin.top + sizes.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + sizes.margin.left + ',' + sizes.margin.top + ')');

    // Create invisible rect for mouse tracking
    svg.append('rect')
        .attr('width', sizes.width)
        .attr('height', sizes.height)
        .attr('x', 0)
        .attr('y', 0)
        .attr('id', 'mouse-tracker')
        .style('fill', 'white');

    //for slider part

    var context = svg.append('g') // Brushing context box container
        .attr('transform', 'translate(' + 0 + ',' + sizes.offset + ')')
        .attr('class', 'context');

    //append clip path for lines plotted, hiding those part out of bounds
    svg.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', sizes.width)
        .attr('height', sizes.height);

    xScale.domain([this.findMinX(), this.findMaxX()]);

    yScale.domain([this.findMinY(), this.findMaxY()]);

    xScale2.domain(xScale.domain());

    //for slider part

    var brush = d3.svg.brush()//for slider bar at the bottom
       .x(xScale2)
       .on('brush', brushed.bind(this)());

    function brushed() {
      return (function () {
        xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
        var extents = brush.extent();
        this.setState({
          filterStart: new Date(Math.min.apply(null, extents)),
          filterEnd: new Date(Math.max.apply(null, extents)),
        });

        // If brush is empty then reset the Xscale domain to default,
        // if not then make it the brush extent

        svg.select('.x.axis') // replot xAxis with transition when brush used
              .transition()
              .call(xAxis);

        maxY = this.findMaxY();

        // Find max Y rating value categories data with 'visible'; true
        yScale.domain([0, maxY]);

        // Redefine yAxis domain based on highest y value of categories data with 'visible'; true

        svg.select('.y.axis') // Redraw yAxis
          .transition()
          .call(yAxis);

        issue.select('path') // Redraw lines based on brush xAxis scale and domain
          .transition()
          .attr('d', function (d) {
              return d.visible ? line(d.values) : null;

              // If d.visible is true then draw line for this d selection
            });

        this.drawAveragedTrendline(svg, xScale, yScale); //redraw trendline

      }.bind(this));
    }

    context.append('g') // Create brushing xAxis
        .attr('class', 'x axis1')
        .attr('transform', 'translate(0,' + sizes.height2 + ')')
        .call(xAxis2);

    var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
      .interpolate('monotone')
      .x(function (d) {
        return xScale2(d.measureDate);
      }) // x is scaled to xScale2
      .y0(sizes.height2) // Bottom line begins at height2 (area chart not inverted)
      .y1(0); // Top line of area, 0 (area chart not inverted)

    //plot the rect as the bar at the bottom
    // pass first categories data .values to area path generator
    context.append('path') // Path is created using svg.area details
      .attr('class', 'area')
      .attr('d', contextArea([
        { measureDate: this.findMinX(), siteId: 0, waterLevel: 0 },
        { measureDate: this.findMaxX(), siteId: 0, waterLevel: 0 },
      ]))
      .attr('fill', '#F1F1F2');

    //append the brush for the selection of subsection
    context.append('g')
      .attr('class', 'x brush')
      .call(brush)
      .selectAll('rect')
      .attr('height', sizes.height2) // Make brush rects same height
        .attr('fill', '#E6E7E8');

    //end slider part----------------------
    // draw line graph
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + sizes.height + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('x', -10)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Groundwater Level');
    var legend = svg.append('g')
       .attr('class', 'legend-container');
    var issue = legend.selectAll('.issue')
        .data(this.state.series) // Select nested data and append to new svg group elements
      .enter().append('g')
        .attr('class', 'issue');

    issue.append('path')
        .attr('class', 'line')
        .style('pointer-events', 'none') // Stop line interferring with cursor
        .attr('id', function (d) {
          return 'line-' + d.name.replace(new RegExp('\\.|\\\\|\/\|\\s|\\/', 'g'), '');

          // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
        })
        .attr('d', function (d) {
          return d.visible ? line(d.values) : null;

          // If array key "visible" = true then draw line, if not then don't
        })
        .attr('clip-path', 'url(#clip)')//use clip path to make irrelevant part invisible
        .style('stroke', function (d) { return color(d.name); });

    var legendSpace = Math.min(Math.max(350 / this.state.series.length, 5), 25);

    // 450/number of issues (ex. 40)

    issue.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', sizes.width + (sizes.margin.right / 3) - 15)
        .attr('y', function (d, i) { return (legendSpace) + i * (legendSpace) - 8; })  // spacing
        .attr('fill', function (d) {
          return d.visible ? color(d.name) : '#F1F1F2';

          // If array key "visible" = true then color rect, if not then make it grey
        })
        .attr('class', 'legend-box')

        .on('click', function (d) { // On click make d.visible
          d.visible = !d.visible;
          this.drawAveragedTrendline(svg, xScale, yScale);

          // If array key for this data selection is "visible" = true
          // then make it false, if false then make it true

          maxY = this.findMaxY();

          // Find max Y rating value categories data with "visible"; true
          yScale.domain([0, maxY]);
          svg.select('.y.axis')
            .transition()
            .call(yAxis);

          // Redefine yAxis domain based on highest y value of categories data with "visible"; true
          issue.select('path')
            .transition()
            .attr('d', function (d) {
              return d.visible ? line(d.values) : null;
            });

          // If d.visible is true then draw line for this d selection
          issue.select('rect')
            .transition()
            .attr('fill', function (d) {
            return d.visible ? color(d.name) : '#F1F1F2';
          });
        }.bind(this))

        .on('mouseover', function (d) {

          d3.select(this)
            .transition()
            .attr('fill', function (d) { return color(d.name); });

          d3.select('#line-' + d.name.replace(new RegExp('\\.|\\\\|\/\|\\s|\\/', 'g'), ''))
            .transition()
            .style('stroke-width', 5.5);
        })

        .on('mouseout', function (d) {

          d3.select(this)
            .transition()
            .attr('fill', function (d) {
            return d.visible ? color(d.name) : '#F1F1F2';});

          d3.select('#line-' + d.name.replace(new RegExp('\\.|\\\\|\/\|\\s|\\/', 'g'), ''))
            .transition()
            .style('stroke-width', 1.5);
        });

    issue.append('text')
        .attr('x', sizes.width + (sizes.margin.right / 3))
        .attr('y', function (d, i) { return (legendSpace) + i * (legendSpace); })

        // (return (11.25/2 =) 5.625) + i * (5.625)
        .text(function (d) { return d.name; });

    // Hover line
    var hoverLineGroup = svg.append('g')
              .attr('class', 'hover-line');

    var hoverLine = hoverLineGroup // Create line with basic attributes
          .append('line')
              .attr('id', 'hover-line')
              .attr('x1', 10).attr('x2', 10)
              .attr('y1', 0).attr('y2', sizes.height + 10)
              .style('pointer-events', 'none') // Stop line interferring with cursor
              .style('opacity', 1e-6); // Set opacity to zero

    var hoverDate = hoverLineGroup
          .append('text')
              .attr('class', 'hover-text')
              .attr('y', sizes.height - (sizes.height - 40)) // hover date text position
              .attr('x', sizes.width - 150) // hover date text position
              .style('fill', '#E6E7E8');

    var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                       //these are the same as your column names
                    .slice(1); //remove the first column name (`date`);
    // Draw overall trendline
    this.drawAveragedTrendline(svg, xScale, yScale);

    function mousemove() {
      var mouseX = d3.mouse(event.target)[0]; // Finding mouse x position on rect
      var graphX = xScale.invert(mouseX); //
      var data = this.state.series;

      //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
      //var graph_y = yScale.invert(mouse_y);
      //console.log(graphX);

      var format = d3.time.format('%b %Y');

      // Format hover date text to show three letter month and full year

      hoverDate.text(format(graphX));

      // scale mouse position to xScale date and format it to show month and year

      d3.select('#hover-line') // select hover-line and changing attributes to mouse position
          .attr('x1', mouseX)
          .attr('x2', mouseX)
          .style('opacity', 1); // Making line visible

      // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
      var x0 = xScale.invert(d3.mouse(event.target)[0]);
      /* d3.mouse(this)[0] returns the x position on the screen of the mouse.
       xScale.invert function is reversing the process that we use to map the domain
       (date) to range (position on screen). So it takes the position on the screen
        and converts it into an equivalent date! */
      var i = bisectDate(data, x0, 1);

      // use our bisectDate function that we declared earlier to find
      // the index of our data array that is close to the mouse cursor
      /*It takes our data array and the date corresponding to the position of or mouse cursor and
      returns the index number of the data array which has a date that is higher than the cursor
      position.*/
      var d0 = data[i - 1];
      var d1 = data[i];
      d1 =  d1 || d0;
      /*d0 is the combination of date and rating that is in the data array at the index
       to the left of the cursor and d1 is the combination of date and close that is in
       the data array at the index to the right of the cursor. In other words we now have
       two variables that know the value and date above and below the date that
       corresponds to the position of the cursor.*/
      var d = x0 - d0.measureDate > d1.measureDate - x0 ? d1 : d0;

      /*The final line in this segment declares a new array d that is represents the date and close
       combination that is closest to the cursor. It is using the magic JavaScript short hand for an
       if statement that is essentially saying if the distance between the mouse cursor
       and the date and close combination on the left is greater than the distance between
        the mouse cursor and the date and close combination on the right then d is an
        array of the date and close on the right of the cursor (d1). Otherwise d is an
         array of the date and close on the left of the cursor (d0).*/

      //d is now the data row for the date closest to the mouse position

      focus.select('text').text(function (columnName) {
        //because you didn't explictly set any data on the <text>
        //elements, each one inherits the data from the focus <g>

        return (d[columnName]);
      });
    };

    var focus = issue.select('g') // create group elements to house tooltip text
        .data(columnNames) // bind each column name date to each g element
      .enter().append('g') //create one <g> for each columnName
        .attr('class', 'focus');

    focus.append('text') // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
          .attr('class', 'tooltip')
          .attr('x', sizes.width + 20) // position tooltips
          .attr('y', function (d, i) { return (legendSpace) + i * (legendSpace); });

    // Add mouseover events for hover line.
    d3.select('#mouse-tracker') // select chart plot background rect #mouse-tracker
    .on('mousemove', mousemove.bind(this)) // on mousemove activate mousemove function defined below
    .on('mouseout', function () {
        hoverDate
            .text(null); // on mouseout remove text for hover date

        d3.select('#hover-line')
            .style('opacity', 1e-6); // On mouse out making line invisible
      });
  },

  requestData: function (e) {
    SiteDataStore.loadSeries(StateStore.selectedSites(), this.loadData);
  },

  color: function () {
    return (
      d3.scale.ordinal().range(
        [
          '#48A36D', '#56AE7C', '#64B98C', '#72C39B', '#80CEAA', '#80CCB3',
          '#7FC9BD', '#7FC7C6', '#7EC4CF', '#7FBBCF', '#7FB1CF', '#80A8CE',
          '#809ECE', '#8897CE', '#8F90CD', '#9788CD', '#9E81CC', '#AA81C5',
          '#B681BE', '#C280B7', '#CE80B0', '#D3779F', '#D76D8F', '#DC647E',
          '#E05A6D', '#E16167', '#E26962', '#E2705C', '#E37756', '#E38457',
          '#E39158', '#E29D58', '#E2AA59', '#E0B15B', '#DFB95C', '#DDC05E',
          '#DBC75F', '#E3CF6D', '#EAD67C', '#F2DE8A',
        ]
       )
    );
  },

  loadData: function (data) {
    var color = this.color();
    color.domain(d3.keys(data));
    var series = color.domain().map(function (siteId) {
      // Nest the data into an array of objects with new keys
      var siteMetaData = SiteDataStore.siteMetaData(siteId);
      return {
        name: siteMetaData.site_name.replace('VW_GWDP_GEOSERVER.', ''),
        id: siteMetaData.id,
        values: data[siteId],
        visible: true, // 'visible': all false except for economy which is true.
      };
    }.bind(this));
    this.setState({ series: series }, this.drawChart);
  },

  findMaxX: function () {
    var maxXValues = this.state.series.map(function (d) {
      if (d.visible) {
        return d3.max(d.values, function (dataPoint) { // Return max date value
          return dataPoint.measureDate; });
      }
    });

    return d3.max(maxXValues);
  },

  findMinX: function () {
    var minXValues = this.state.series.map(function (d) {
      if (d.visible) {
        return d3.min(d.values, function (dataPoint) { // Return min date value
          return dataPoint.measureDate; });
      }
    });

    return d3.min(minXValues);
  },

  findMaxY: function () {
    var maxYValues = this.state.series.map(function (d) {
      if (d.visible) {
        return d3.max(d.values, function (dataPoint) { // Return max level value
          return dataPoint.waterLevel; });
      }
    });

    return d3.max(maxYValues);
  },

  findMinY: function () {
    var minYValues = this.state.series.map(function (d) {
      if (d.visible) {
        return d3.min(d.values, function (dataPoint) { // Return min level value
          return dataPoint.waterLevel; });
      }
    });

    return d3.min(minYValues);
  },

  calculateTrendlines: function (svg, xScale, yScale) {
    svg.selectAll('.trendline').remove();
    svg.selectAll('.trendline-text-label').remove();
    var componentTrendlines = [];
    this.state.series.forEach(function (series) {
      if (series.visible) {
        var filterStart = this.state.filterStart || this.findMinX();
        var filterEnd = this.state.filterEnd || this.findMaxX();

        var xSeries = [].concat.apply([], series.values.map(function (d) {
          if (d.measureDate >= filterStart && d.measureDate <= filterEnd) {
            return d.measureDate;
          }
        }.bind(this))).filter(function (e) {if (e) {return true;} });

        var ySeries = [].concat.apply([], series.values.map(function (d) {
          if (d.measureDate >= filterStart && d.measureDate <= filterEnd) {
            return d.waterLevel;
          }
        }.bind(this))).filter(function (e) {if (e) {return true;} });

        if (xSeries.length === 0) {
          var firstPoint;
          var lastPoint;
          series.values.forEach(function (d) {
            if (d.measureDate <= this.state.filterEnd) {
              firstPoint = d.measureDate;
            }
          }.bind(this));

          series.values.forEach(function (d) {
            if (!lastPoint && d.measureDate >= this.state.filterStart) {
              lastPoint = d.measureDate;
            }
          }.bind(this));

          if (!firstPoint || !lastPoint) {
            return;
          }
        }

        componentTrendlines.push(
          this.leastSquares(xSeries.map(function (d) {
            return d.getTime() / 86400000;
          }), ySeries)
        );
      }
    }.bind(this));
    return componentTrendlines;
  },

  drawAveragedTrendline: function (svg, xScale, yScale) {
    var sizes = this.sizes();
    var trendlines = this.calculateTrendlines(svg, xScale, yScale);

    var decimalFormat = d3.format('0.2f');
    if (trendlines.length === 0) {
      return;
    }

    var averagedLine = trendlines.reduce(function (a, b) {
      return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }).map(function (value) {
      return value / trendlines.length;
    });

    if (isNaN(averagedLine[0])) {
      console.log('NAN');
      return;
    }

    svg.selectAll('.trendline').remove();
    svg.selectAll('.trendline-text-label').remove();
    var trendline = svg.selectAll('.trendline');
    var filterStart = this.state.filterStart || this.findMinX();
    var filterEnd = this.state.filterEnd || this.findMaxX();
    // var numberOfTicks = this.state.xAxis.ticks();
    // var tickSize = (this.state.xAxis.scale().domain()[1] - this.state.xAxis.scale().domain()[0]) / numberOfTicks;

    var run = (filterEnd - filterStart) / 31536000000;
    var rise = (run * averagedLine[0]);

    var midY = (this.state.yAxis.scale().domain()[1] - this.state.yAxis.scale().domain()[0]) / 2;

    svg.append('line')
      .attr('class', 'trendline')
      .attr('x1', xScale(this.state.filterStart))
      .attr('y1', yScale(midY - (rise / 2)))
      .attr('x2', xScale(this.state.filterEnd))
      .attr('y2', yScale(midY + (rise / 2)))
      .attr('stroke', 'black')
      .attr('stroke-width', 3);

    // display equation on the chart
    svg.append('text')
      .text('eq: ' + averagedLine[0].toExponential(3) + 'x + ' +
        decimalFormat(averagedLine[1]))
      .attr('class', 'trendline-text-label')
      .attr('x', (sizes.width / 2) - 100)
      .attr('y', 240);

    // display r-square on the chart
    svg.append('text')
      .text('r-sq: ' + decimalFormat(averagedLine[2]))
      .attr('class', 'trendline-text-label')
      .attr('x', (sizes.width / 2) + 50)
      .attr('y', 240);
  },

  drawCombinedTrendLine: function (svg, xScale, yScale) {

    svg.selectAll('.trendline').remove();
    svg.selectAll('.trendline-text-label').remove();

    var xLabels = [].concat.apply([], this.state.series.map(function (s) {
      if (s.visible) {
        return s.values.map(function (d) {
          if (d.measureDate >= xScale.domain()[0] && d.measureDate <= xScale.domain()[1]) {
            return d.measureDate;
          }
        });
      }
    })).filter(function (e) {if (e) {return true;} });

    var xSeries = d3.range(1, xLabels.length + 1);
    var ySeries = [].concat.apply([], this.state.series.map(function (s) {
      if (s.visible) {
        return s.values.map(function (d) {
          if (d.measureDate >= xScale.domain()[0] && d.measureDate <= xScale.domain()[1]) {
            return d.waterLevel;
          }
        });
      }
    })).filter(function (e) {if (e) {return true;} });

    if (xSeries.length === 0 || ySeries.length === 0) {
      return;
    }

    var leastSquaresCoeff = this.leastSquares(xSeries, ySeries);

    // apply the reults of the least squares regression
    var sizes = this.sizes();

    var x1 = xLabels[0];
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = xLabels[xLabels.length - 1];
    var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
    var trendData = [[x1, y1, x2, y2]];
    var decimalFormat = d3.format('0.2f');

    var trendline = svg.selectAll('.trendline')
      .data(trendData);

    trendline.enter()
      .append('line')
      .attr('class', 'trendline')
      .attr('x1', function (d) { return xScale(d[0]); })
      .attr('y1', function (d) { return yScale(d[1]); })
      .attr('x2', function (d) { return xScale(d[2]); })
      .attr('y2', function (d) { return yScale(d[3]); })
      .attr('stroke', 'black')
      .attr('stroke-width', 3);

    // display equation on the chart
    svg.append('text')
      .text('eq: ' + decimalFormat(leastSquaresCoeff[0]) + 'x + ' +
        decimalFormat(leastSquaresCoeff[1]))
      .attr('class', 'trendline-text-label')
      .attr('x', sizes.width / 2)
      .attr('y', 30);

    // display r-square on the chart
    svg.append('text')
      .text('r-sq: ' + decimalFormat(leastSquaresCoeff[2]))
      .attr('class', 'trendline-text-label')
      .attr('x', sizes.width / 2)
      .attr('y', 50);
  },

  leastSquares: function (xSeries, ySeries) {
    var reduceSumFunc = function (prev, cur) { return prev + cur; };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function (d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function (d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function (d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    return [slope, intercept, rSquare];
  },

  visibleSites: function () {
    if (!this.state.series) {
      return;
    }

    return this.state.series.filter(function (el) {
      return el.visible;
    }).map(function (el) {
      return el.id;
    });
  },

  saveDisplayed: function () {
    var usedNames = Object.keys(StateStore.savedSelections()) + [''];
    if (usedNames.includes(this.state.nameEntry)) {
      alert('You must use a unique name.');
      return;
    }

    StateStore.saveSelection(this.visibleSites(), this.state.nameEntry);
  },

  updateNameEntry: function (e) {
    this.setState({ nameEntry: e.target.value });
  },

  render: function () {
    return (
      <div id={'adv-d3-container' + this.props.className.split(' ').join('')} className='graph'>
        <div
          id={'visualisation' + this.props.className.split(' ').join('')}
          className='d3-visualisation'
          width='100%'
          height='100%'
         />
       <button onClick={this.requestData}>Load From Map</button>
       <button
         disabled={!this.state.series}
         onClick={this.saveDisplayed}>
         Save Displayed as:
       </button>
       <input type='text' onChange={this.updateNameEntry} value={this.state.nameEntry} />
      </div>
    );
  },
});
