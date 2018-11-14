# Level Data Portal
Application for displaying, analyzing and retrieving spatial time series data.
[Live Link](https://waterlevelportal.herokuapp.com/)


### Data import instructions
1. Load site data to the Sites Model. Additional data fields may be added to the model for reporting or other purposes.
      Site Data Fields:
      a. id: integer - Unique ID, generated automatically on insert
      b. site_name: string - A human readable name for this site
      c. well_reference: string - External Reference ID
      d. latitude: float - Latitude at site
      e. longitude: float - Longitude at site
      i. city: string - City nearest site
      j. state: string - US State
      k. zip: string - US Zip
      l. address: string - US address

2. Load time series to the Measurements Model.
      Measurement Fields:
      a. id: integer - Unique ID, generated automatically on insert
      b. site_id: integer - Reference to corresponding Site's ID
      c. measure_date: date - Date of Measurement
      d. level: decimal - Measurement Value
      e. units: string - Measurement Units
      d. measure_type:  - Type of Measurement ()
      e. data_provider: string - Source of Data

3. Data import is most easily accomplished by constructing a SQL insert. An example insert file is provided.  

4. If you lack specific coordinates, they can be geocoded from the addresses. Simply run `Site.geocode_all` after loading your sites with address data.

### Usage Instructions
1. Select sites using the map in the top left panel. You can click a site or hold shift and drag to select an area. To deselect, click a site again or hold shift-cmd/ctrl while dragging to deselect an area.
2. With some sites selected, click the 'load from map' link on either of the bottom panes to graph data from the selected sites on that panel.
3. Enter a name and click 'Save map selection' on the top right panel to save the current selection.
4. Click a legend entry on a graph to show/hide a line, this also controls its inclusion in the trendline.
5. Click the area below a graph to show data for a particular time period. This also controls the inclusion of data in the trendline.
5. Enter a name and click 'Save displayed as' on a graph to save the currently visible sites as a new selection.
6. Use the form at the top right to create an account, this will allow you to save your selections for later retrieval.


### Technology Stack
- Ruby on Rails
- React
- Postgres
- D3
- Google Charts API


This application is designed to display data obtained from the USGS National Water level Information System in a user friendly manner.

Created for MS Thesis project in Environmental Science by H. Dotson
