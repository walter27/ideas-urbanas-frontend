declare var d3: any;
declare var $: any;
const XLSX = require('xlsx')



function exportCSV(variable, categories, series) {

    let column;
    let data = [];
    let optionsDate = { year: '2-digit', month: '2-digit', day: 'numeric' };
    let languajeDate = 'es-ES';

    let csv = `Nombre del Indicador: ${variable.name}\n`;
    csv += `Definición: ${variable.description}\n`;
    csv += `Unidad de medida: ${variable.measure_symbol}\n`;
    csv += `Fuente de datos: ${variable.origins[0].name}]\n`

    if (variable.periodicity === 'anual' || variable.periodicity === 'trimestral') {

        if (variable.chart_type === 'stacked bar chart') {
            column = 'Ciudad,';

        } else {
            column = 'Año,';

        }

    }

    if (variable.periodicity === 'mensual' || variable.periodicity === 'daily') {
        column = 'Fecha,';

    }


    for (let i = 0; i < series.length; i++) {

        if (i === series.length - 1) {
            column += `${series[i].name}`;

        } else {
            column += `${series[i].name},`;

        }

    }

    //console.log(column);
    if (variable.periodicity === 'anual' || variable.periodicity === 'trimestral') {

        for (let j = 0; j < categories.length; j++) {

            data.push([categories[j]])

        }

    }
    if (variable.periodicity === 'mensual' || variable.periodicity === 'daily') {


        let dateCity = [];



        for (let j = 0; j < categories.length; j++) {

            let date = new Date(categories[j]).toLocaleDateString(languajeDate, optionsDate);
            dateCity.push(date)

        }


        let dates = dateCity.filter((date, index) => {
            return dateCity.indexOf(date) === index;
        });

        for (let m = 0; m < dates.length; m++) {
            data.push([dates[m]])
        }

    }

    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < series.length; j++) {


            for (let k = 0; k < series[j].data.length; k++) {

                if (i === k) {
                    data[i] = [...data[i], series[j].data[k]];
                }

            }

        }

    }


    //console.log(data);






    csv += `${column}\n`;

    data.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });



    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `ideas_urbanas_${lowerCase(variable.name)}.csv`;
    hiddenElement.click();



}


function exportXLSX(variable, categories, series) {

    let optionsDate = { year: '2-digit', month: '2-digit', day: 'numeric' };
    let languajeDate = 'es-ES';
    let ws_data = [];
    let column = [];

    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: 'data',
        Subject: 'data',
        Author: 'IDEAS Urbanas',
        CreatedDate: new Date(Date.now())
    };
    wb.SheetNames.push('data');

    ws_data = [[`Nombre del Indicador: ${variable.name}`], [`Definición: ${variable.description}`],
    [`Unidad de medida: ${variable.measure_symbol}`], [`Fuente de datos: ${variable.origins[0].name}`]];

    if (variable.periodicity === 'anual' || variable.periodicity === 'trimestral') {

        if (variable.chart_type === 'stacked bar chart') {
            column.push('Ciudad');

        } else {
            column.push('Año');

        }

    }

    if (variable.periodicity === 'mensual' || variable.periodicity === 'daily') {

        column.push('Fecha')

    }

    for (let i = 0; i < series.length; i++) {

        column.push(series[i].name)
    }



    ws_data = [...ws_data, column];


    if (variable.periodicity === 'anual' || variable.periodicity === 'trimestral') {

        for (let j = 0; j < categories.length; j++) {

            ws_data = [...ws_data, [categories[j]]];

        }

    }

    if (variable.periodicity === 'mensual' || variable.periodicity === 'daily') {


        let datesCity = [];



        for (let j = 0; j < categories.length; j++) {

            let date = new Date(categories[j]).toLocaleDateString(languajeDate, optionsDate);
            datesCity.push(date);

        }

        let dates = datesCity.filter((data, index) => {
            return datesCity.indexOf(data) === index;
        });


        for (let l = 0; l < dates.length; l++) {
            ws_data = [...ws_data, [dates[l]]];

        }

    }


    for (let i = 4; i < ws_data.length; i++) {

        for (let j = 0; j < series.length; j++) {

            for (let k = 0; k < series[j].data.length; k++) {

                if (i - 5 === k) {
                    ws_data[i] = [...ws_data[i], series[j].data[k]];
                }

            }

        }

    }


    //Fconsole.log(ws_data);




    //var ws_data = [['hello', 'world'], ['data']];
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["data"] = ws;

    XLSX.writeFile(wb, `ideas_urbanas_${lowerCase(variable.name)}.xlsx`);




}


function exportTimeLineCSV(news) {

    let data = [];

    let csv = `Plataforma IDEAS Urbanas\n`;
    csv += `Línea de Tiempo\n`;
    csv += `Fecha,Noticia,Fuente\n`;

    for (let i = 0; i < news.length; i++) {

        data.push([news[i].date, news[i].news, news[i].origin]);


    }

    data.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });



    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `ideas_urbanas_timeLine.csv`;
    hiddenElement.click();

}


function exportTimeLineXLSX(news) {

    let ws_data = [];

    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: 'data',
        Subject: 'data',
        Author: 'IDEAS Urbanas',
        CreatedDate: new Date(Date.now())
    };
    wb.SheetNames.push('data');

    ws_data = [['IDEAS Urbanas'], ['Línea de Tiempo'], [`Fecha`, 'Noticia', 'Fuente']];


    for (let i = 0; i < news.length; i++) {

        ws_data = [...ws_data, [news[i].date, news[i].news, news[i].origin]]

    }

    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["data"] = ws;

    XLSX.writeFile(wb, `ideas_urbanas_timeline.xlsx`);



}


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

function lowerCase(text) {

    return text.toLowerCase().replace(/\s/g, '');
}

module.exports = {
    capitalizeFirst,
    formatLabel,
    tagCloud,
    titleCase,
    exportCSV,
    exportXLSX,
    exportTimeLineCSV,
    exportTimeLineXLSX,
    lowerCase
};

