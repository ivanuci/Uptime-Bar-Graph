# Uptime-Bar-Graph
Bar graph for monitoring uptime. Includes Tooltip on mouseover. Slider added for history insight. Code is in pure javascript and is using svg elements to draw graph.

![uptime.png](https://github.com/ivanuci/Uptime-Bar-Graph/blob/main/uptime.png?raw=true)

### Include in html (follow the order):
 * <script type="text/javascript" src="algorithms.js"></script>
 * <script type="text/javascript" src="svg-tools.js"></script>
 * <script type="text/javascript" src="graph-tools.js"></script>
 * <script type="text/javascript" src="tooltip.js"></script> <!-- optional -->
 * <script type="text/javascript" src="slider.js"></script> <!-- optional -->

### DATA example (time and uptime measured in seconds using UTC):
 * const sistemAData = [
    { time: 1604488863, uptime: 18144290 },
    { time: 1604596863, uptime: 80000 },
 ];

### Basic call:
 * let sistemABar = graphTools.uptimeBar("sistemADiv", 450, 40, 2, sistemAData, null)
 * sistemABar.draw(new Date(), 28, 0)

### Example of usage:
 * uptime.html


