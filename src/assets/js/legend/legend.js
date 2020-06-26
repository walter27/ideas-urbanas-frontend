(function(H) {
    H.Series.prototype.translateColors = function() {
        var series = this,
            points = this.data.length ? this.data : this.points,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        points.forEach(function(point) {
            var value = point[colorKey],
                color;

            color = point.options.color ||
                (
                    point.isNull ?
                    nullColor :
                    (colorAxis && typeof value !== 'undefined') ?
                    colorAxis.toColor(value, point) :
                    point.color || series.color
                );

            if (color && point.color !== color) {
                point.color = color;

                if (series.options.legendType === 'point') {
                    series.chart.legend.colorizeItem(point, point.visible);
                }
            }
        });
    }
}(Higharts));