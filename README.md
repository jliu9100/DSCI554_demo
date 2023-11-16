# DSCI554 Dashboard Version1


## Data Overview

You can find preprocessed wildfire data in `data/mtbs.json` (3.7MB) and `data/mtbs_incl_perimeters.geojson` (1.1GB). The two datasets are identical, except that the .geojson dataset includes geometric data for the region burned by each wildfire, i.e. the wildfire perimeters.

Schema:

 - mtbs_id (string) - Wildfire ID assigned by the Monitoring Trends in Burn Severity (MTBS) program
 - irwin_id (string) - Wildfire ID assigned by the Integrated Reporting of Wildland Fire Information (IRWIN) program. Introduced in 2014.
 - incident_name (string) - Colloquial name given to wildfire, such as Grizzly Creek Fire
- burned_acreage (float) - Number of acres burned by the fire
- latitude (float) - Latitude associated with the fire
- longitude (float) - Longitude associated with the fire
- ignition_year (YYYY) - Year in which the fire started
- ignition_date (YYYY-MM-DD) - Date on which the fire started
- geometry (GeoJSON polygon) - Region burned by the fire (only in `mtbs_incl_perimeters.geojson`)

Loading the data in Python (w/o perimeters):

```
import pandas as pd
df = pd.read_json('PATH_TO/mtbs.json')
```

Loading the data in Python (w/ perimeters):

```
import geopandas
df = geopandas.read_file('PATH_TO/mtbs_incl_perimeters.geojson')
```

Loading the data in JavaScript (w/o perimeters):
```
d3.json('PATH_TO/mtbs.json', data => {
  // data
})
```

Loading the data in JavaScript (w/ perimeters):
```
d3.json('PATH_TO/mtbs_incl_perimeters.geojson', data => {
  // data
})
```

The data with perimeters is too large to be loaded into d3. If you want to use perimeter data on the front end, you would need to first select a smaller subset of the wildfires in Python or Node.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


## Collaboration Guidelines

### GitHub Standard Practices
- Please base your work on the `develop` branch or create a new branch for development.
- After completing a page or feature, initiate a merge request to incorporate your changes.

### Commit format
- A brief description in all lowercase is fine. 
- Examples：
    - create BarChart component
    - upgrade router.js
    - delete old icon image

## To-Do List

- [ ] Data set selection
- [ ] Page development
- [ ] Design integration with theme colors & bug fixing
- [ ] More to come...

## Tips
### Dataset Path
The dataset is expected to be located in the `public/data` directory, which is currently an empty folder.

### Page Development
All pages to be developed are located in the `/src/views` folder. Route modifications should be coordinated and will preferably be handled by me to ensure consistency.

### Reusable Components
If you identify components that can be reused across different parts of the application, please factor them out into the `/src/components` directory for maintainability and easier code management.

### Technology Stack
- Vue 3.x
- ElementUI
