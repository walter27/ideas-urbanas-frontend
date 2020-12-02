(function(factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function(H) {

    console.log(H.seriesTypes);

    // H.seriesTypes.wordcloud.prototype.spirals.archimedean = archimedeanSpiral;

    H.wrap(
        H.seriesTypes.wordcloud.prototype.spirals.archimedean = archimedeanSpiral,
        // H.seriesTypes.wordcloud.prototype.placementStrategy.random = randomPlacement,

    );

    H.seriesTypes.wordcloud.prototype.deriveFontSize = function(
        relativeWeight
    ) {
        var maxFontSize = 300;
        // Will return a fontSize between 0px and 25px.
        return Math.floor(maxFontSize * relativeWeight);
    };




}));


function archimedeanSpiral(attempt, params) {
    var field = params.field,
        result = false,
        maxDelta = (field.width * field.width) + (field.height * field.height),
        t = attempt * 0.3; // 0.2 * 4 = 0.8. Enlarging the spiral.

    // Emergency brake. TODO make spiralling logic more foolproof.
    if (attempt <= 10000) {
        result = {
            x: t * Math.cos(t),
            y: t * Math.sin(t)
        };
        if (!(Math.min(Math.abs(result.x), Math.abs(result.y)) < maxDelta)) {
            result = false;
        }
    }
    return result;
}