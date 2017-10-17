# WaterLevel Portal
Application for displaying, analysing and retreiving water level data or any other spatial time series data. 
[Live Link](https://waterlevelportal.herokuapp.com/)


### Usage Instructions
1. Select sites using the map in the top left panel. You can click a site or hold shift and drag to select an area. To deselect, click a site again or hold shift-cmd/ctrl while dragging to deselect an area.
2. With some sites selected, click the 'load from map' link on either of the bottom panes to graph data from the selected sites on that panel. 
3. Enter a name and click 'Save map selection' on the top right panel to save the current selection. 
4. Click a legend entry on a graph to show/hide a line, this also controls its inclusion in the trendline. 
5. Click the area below a graph to show data for a particular time period. This also controls the inclusion of data in the trendline. 
5. Enter a name and click 'Save displayed as' on a graph to save the currently visible sites as a new selection. 


### Technology Stack
- Ruby on Rails
- React
- Postgres
- D3
- Google Charts API


This application is designed to display data obtained from the USGS National Water level Information System in a user friendly manner. 

Created for MS Thesis project in Environmental Science by H. Dotson
