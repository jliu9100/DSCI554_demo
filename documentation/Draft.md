## Page Design and Implementation

Professor asks us to include design documentation.
He said it's okay if we don't implement in the way totally consistent with the design, 
but we do need to make ideal design layout.

### Project Data

- around 80k data items
- has location data
- not very clean, a lot of null values
- already projected, NAD83 State Plane, epsg code 10001

### Home Page

We want to display the data by breaking down into years.
And for each column in the dataset, we then diplay the details in other pages.

Design: 
- A clickable Calendar choosing each month and display it on the map. (According to Professor's advice)
- A Horizontal Bar Chart showing the fire severity for each year. (According to Professor's advice)
- A map showing all the wildfire locations.

Implementation:
- A clickable Calendar is hard to implement. (compromise)
- A horizontal bar chart would overlap with the map and make the page too complicated.

### Choropleth Map Page

We use the python script to calculate the wildfire occurrence and severity in the county level.

Design:
- Just maps.
Implementation:
- We found if we just use the maps it would be hard to provide enough information to the users.
- Add a county selector and display the indicator value

### Pie Chart page

We want to use pie chart to further break down the information.

For example, which cause most likely would lead to fire, in which year it caused most occurrence of fires and 
what severity we can expect if fire is caused by this reason.

### Heat Map Page

Prediction for risky locations.

County level cholopleth map is not sufficient for us to make prediction.
- if data is concentrated on the border of the county,
  it would mislead the user that the whole county has a high risk level

One map using all data from 2005-2015, another using 2015.
we choose 2015 because it is the latest year, 
and the latest data would have more advantages with predicting future wildfire.

From the final result, the map using all data shows a more even pattern.

## Development Strategies (Optional)

- why using python scripts for pre-processing?
  - static JSON file is much easier for web server to render then using javascript to process it on server, 
  - which largely decrease performance and waste too much computation resource