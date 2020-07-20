declare var d3: any;
declare var $: any;

function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : '';
}

function formatLabel(str) {
    let result = capitalizeFirst(str);
    if (result.length > 11)
        result = result.substring(0, 11) + '...';
    return result;
}

function tagCloud(data, width, height, maxFont, color) {

    data.forEach(function (d) {
        d.size = +d.size;
    });

    data.sort(function (a, b) { return b.size - a.size });

    //sorts the array by the most repeated word
    var w = width, h = height,
        maxSize = data[0].size || 1,
        sizeOffset = maxFont / maxSize / 2;

    var layout = d3.layout.cloud()
        .size([w, h])
        .words(data)
        .spiral("archimedean") // rectangular | archimedean
        .rotate(0)
        .font("Noto Sans TC")
        .fontSize(function (d) {
            return Math.max(20, Math.min(d.size * sizeOffset, maxFont));
        })
        .on("end", onDraw);
    layout.start();

    //callback fired when all words have been placed
    function onDraw() {
        $('#svg-node').remove();
        var svg = d3.select("#tag-cloud-wrapper").append("svg").attr({ width: w, height: h, "id": "svg-node" }),
            vis = svg.append("g").attr("transform", "translate(" + [w >> 1, (h >> 1) - 10] + ")scale(2)");

        var text = vis.selectAll("text").data(data);

        text.enter().append("text")
            .style("font-family", function (d) { return d.font; })
            .style("font-size", function (d) { return d.size + "px"; })
            .style("fill", color)
            .style({ cursor: "pointer", opacity: 1e-6 })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; })
            .transition()
            .duration(1000)
            .style("opacity", 1);

        vis.transition()
            .delay(450)
            .duration(750)
            .attr("transform", "translate(" + [w >> 1, (h >> 1) + 10] + ")scale(1)");
    }//end onDraw

}

function titleCase(text) {
    if (!text) return text;
    if (typeof text !== 'string') throw "invalid argument";
    return text.toLowerCase().split(' ').map(value => {
        return value.charAt(0).toUpperCase() + value.substring(1);
    }).join(' ');
}

module.exports = {
    capitalizeFirst,
    formatLabel,
    tagCloud,
    titleCase
};

