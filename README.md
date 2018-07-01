# A Visualization of Flight Data in the United States, 2015
A Dorling Cartogram of Pie Charts over the US flights 2015 dataset aggregated at the state level. Viewable here : https://adityarj.neocities.org/us_flights/

## Running 
Simply run a HTTP server at this directory. For example, you could use, ```python -m http.server```, if you are using Python 3

## Creating the Visualization
The visualization uses Angular and D3. I first aggregated the data by state using a python script, included in the repo. The visualization itself was created using an angular directive with D3 being used to perform all the calculations. The Dorling cartogram code was adapted from Mike Bostock's block, https://bl.ocks.org/mbostock/4055892. Foundation was used for the buttons and checkboxes.

## Interpreting the Visualization
The visualization is a Dorling cartogram of pie charts, with the cartogram skewed according to the number of flights per state or originating to or from a particular state.
The pie charts are split according to airline to see the proportion of flights that an airline has from a particular state. <br>

The user is further able to use the toggle buttons to tick or untick the airlines considered in the visualization as well as switch between different parameters,
such as on time, delayed or cancelled flights as well as between arriving or departing flights.

Clicking on a particular state redraws the chart according to that state's incoming or outgoing traffic. 
Click on the background to switch back to Total flights.

## Insights
One is able to see in general, where airlines have certain strongholds, such as SouthWest in California or Delta in Georgia and how traffic from other states to these states is dominated by these airlines.
Also, most cancellations from New York were by American Eagle which is disproportianate to the traffic of ontime flights for New York. I think this might be due to the blizzard cancellations in 2015.

## Improvements
One possible thing I would do is find a better way to show labels and also the US as a landmass, with the current blue circles around the states seeming a bit gimmicky.
