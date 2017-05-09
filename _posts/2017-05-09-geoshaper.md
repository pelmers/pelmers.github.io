---
layout: post
title: Shape matching on road maps
---
[Geogrid](https://crates.io/crates/geogrid) is a rust library which
approximately quantizes map data into a two-dimensional grid. I suggest such a
representation has application for visualization or applying image processing
to local geographic data. In my case I developed the library to enable me to
match arbitrary shapes against a city's road map.

{% highlight rust %}
pub struct GeoGrid {
    bounds: Bounds,
    res_lat: f32,
    res_lon: f32,
    grid_height: usize,
    grid_width: usize,
    grid: Vec<u8>,
}
{% endhighlight %}

Given some input data (for example from GeoJSON), the grid computes the
latitude/longitude boundaries and calculates the size of each grid square by
dividing into the requested grid height/width dimensions. The data structure
stores the bounds along with the resolution in units of meters per row/column
to provide translation between real coordinates and grid coordinates. Since
OpenStreetMap data defines road data as a list of map nodes which should be
connected by line segments, the `from_roads` grid constructor also marks points
along the slope between consecutive road nodes. A future feature would be to
filter the roads used to optionally exclude types such as railroads and subway
tracks.

![Houston road grid](images/geogrid/houston.grid.png)

Having constructed such a grid, [Geoshaper](http://geoshaper.pelmers.com/)
finds closest matches to arbitrary shapes using Chamfer matching. First, I
compute the distance transform of the road grid, as illustrated in the
following figure.

![Houston distance transform](images/geogrid/houston.dt.png)

The distance transform computes at each location the distance to the closest
nonzero point (in the grid road pixels are 1 and the rest is 0). Chamfer
matching then
[filters](https://en.wikipedia.org/wiki/Kernel_(image_processing)) this
distance transform with a binary shape mask and finds the minimum point. This
minimum point corresponds to the location on the map which minimizes total
distance from the provided shape.

The reader may try out some cities in
[Geoshaper](http://geoshaper.pelmers.com/), which packages this algorithm in a
web interface that allows shape drawing and results display. While the server
is very slow, the code is available on
[github](https://github.com/pelmers/geoshaper), and it includes a
GPU-accelerated version which shows tremendous speedup with a capable
processor.

![Example usage](images/geogrid/geocool.png)
