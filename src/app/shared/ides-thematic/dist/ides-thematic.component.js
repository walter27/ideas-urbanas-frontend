"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.IdesThematicComponent = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var ng2_charts_1 = require("ng2-charts");
var years = require('src/app/core/const/years.data');
var pluginAnnotations = require("chartjs-plugin-annotation");
var jsPDF = require("jspdf");
var _a = require('../../core/utils/utils'), formatLabel = _a.formatLabel, capitalizeFirst = _a.capitalizeFirst;
var CharType;
(function (CharType) {
    CharType["lineal"] = "line";
    CharType["bar"] = "bar";
    CharType["stacked"] = "bar";
    CharType["pie"] = "pie";
})(CharType || (CharType = {}));
var IdesThematicComponent = /** @class */ (function () {
    function IdesThematicComponent(clasificationService, variableService, dataService, regionService, chartService, utilsService, router) {
        this.clasificationService = clasificationService;
        this.variableService = variableService;
        this.dataService = dataService;
        this.regionService = regionService;
        this.chartService = chartService;
        this.utilsService = utilsService;
        this.router = router;
        this.loading = false;
        this.spinner1 = 'spinner';
        this.value = 20;
        this.highValue = 40;
        this.options = {
            ceil: 100,
            floor: 0
        };
        this.filters = {
            page: 0,
            limit: 100,
            ascending: true,
            sort: 'name'
        };
        this.years = [];
        this.cities = [];
        this.yearSelected = '';
        this.downloadOptions = [
            {
                id: 'pdf',
                name: 'PDF',
                check: false
            },
            {
                id: 'csv',
                name: 'CSV',
                check: false
            },
            {
                id: 'jpeg',
                name: 'JPEG',
                check: false
            },
            {
                id: 'png',
                name: 'PNG',
                check: false
            }
        ];
        this.lineChartData = [];
        this.lineChartLabels = [];
        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                onLeave: function (event, legendItem) {
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    ci.data.datasets[index].borderWidth = sessionStorage.getItem('borderWidth');
                    ci.data.datasets[index].pointBorderColor = ci.data.datasets[index].hoverBorderColor;
                    ci.data.datasets[index].pointRadius = window.innerWidth < 575 ? 3 : 7;
                    ci.data.datasets[index].pointBackgroundColor = 'white';
                    ci.data.datasets[index].pointBorderWidth = 1;
                    ci.data.datasets[index].backgroundColor = sessionStorage.getItem('backgroundColor');
                    // We hid a dataset ... rerender the chart
                    ci.update();
                },
                onHover: function (event, legendItem) {
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    sessionStorage.setItem('borderWidth', ci.data.datasets[index].borderWidth);
                    sessionStorage.setItem('backgroundColor', ci.data.datasets[index].backgroundColor);
                    ci.data.datasets[index].borderWidth = ci.data.datasets[index].hoverBorderWidth;
                    ci.data.datasets[index].borderColor = ci.data.datasets[index].hoverBorderColor;
                    ci.data.datasets[index].pointBorderColor = ci.data.datasets[index].pointHoverBorderColor;
                    ci.data.datasets[index].pointRadius = 5;
                    ci.data.datasets[index].pointBackgroundColor = ci.data.datasets[index].pointHoverBackgroundColor;
                    ci.data.datasets[index].pointBorderWidth = 1;
                    ci.data.datasets[index].backgroundColor = ci.data.datasets[index].hoverBackgroundColor;
                    // We hid a dataset ... rerender the chart
                    ci.update();
                },
                onClick: function (event, legendItem) {
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    var meta = ci.getDatasetMeta(index);
                    var t = [];
                    if (sessionStorage.getItem('citiesHidden')) {
                        t = JSON.parse(sessionStorage.getItem('citiesHidden'));
                        if (ci.data.datasets.length - 1 === JSON.parse(sessionStorage.getItem('citiesHidden')).length && t.indexOf(legendItem.text) === -1) {
                            return;
                        }
                    }
                    // See controller.isDatasetVisible comment
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                    if (meta.hidden) {
                        t.push(legendItem.text);
                    }
                    else {
                        var idx = t.indexOf(legendItem.text);
                        t.splice(idx, 1);
                    }
                    sessionStorage.setItem('citiesHidden', JSON.stringify(t));
                    // We hid a dataset ... rerender the chart
                    ci.update();
                },
                labels: {
                    fontFamily: '"Noto Sans TC", sans-serif',
                    fontSize: 10,
                    fontColor: 'black'
                }
            },
            // 'point' | 'nearest' | 'single' | 'label' | 'index' | 'x-axis' | 'dataset' | 'x' | 'y';
            hover: { mode: 'dataset' },
            tooltips: {
                bodyFontSize: 14,
                titleFontSize: 14,
                bodyFontFamily: '"Noto Sans TC", sans-serif',
                titleFontFamily: '"Noto Sans TC", sans-serif',
                backgroundColor: 'white',
                bodyFontColor: 'black',
                titleFontColor: '#076DCD',
                enabled: false,
                bodySpacing: 10,
                custom: function (tooltip) {
                    // Tooltip Element
                    var t = document.getElementById('chartjs-tooltip');
                    if (t) {
                        t.remove();
                    }
                    var tooltipEl = document.getElementById('chartjs-tooltip');
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table></table>';
                        this._chart.canvas.parentNode.appendChild(tooltipEl);
                    }
                    // Hide if no tooltip
                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltip.yAlign) {
                        tooltipEl.classList.add(tooltip.yAlign);
                    }
                    else {
                        tooltipEl.classList.add('no-transform');
                    }
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
                    // Set Text
                    if (tooltip.body) {
                        // tslint:disable-next-line:no-string-literal
                        var description = tooltip['afterBody'];
                        var title = sessionStorage.getItem('variableSelectedName') + ' ' + tooltip.dataPoints[0].label;
                        var titleLines = [title];
                        var bodyLines = tooltip.body.map(getBody);
                        var measure_symbol_1 = ' ' + sessionStorage.getItem('variableSelectedMeasureSymbol');
                        var innerHtml_1 = '<thead style="color: rgba(7, 109, 205, 1)">';
                        titleLines.forEach(function (title) {
                            innerHtml_1 += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml_1 += '</thead><tbody>';
                        bodyLines.forEach(function (body, i) {
                            var color = sessionStorage.getItem(body[0].split(':')[0].toLocaleLowerCase());
                            var colors = { backgroundColor: color, borderColor: 'white' }; // tooltip.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                            var span1 = '<span class="chartjs-tooltip-key1"></span>';
                            innerHtml_1 += '<tr><td>' + span + body[0].split(':')[0] + '</td></tr>';
                            innerHtml_1 +=
                                '<tr><td style="color: #8F8F8F; font: Regular 16px/30px Noto Sans TC;">' + span1 + body[0].split(':')[1] + measure_symbol_1 + '</td></tr>';
                        });
                        if (description.length > 0) {
                            innerHtml_1 += '<tr><td>' + description + '</td></tr>';
                        }
                        innerHtml_1 += '</tbody>';
                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml_1;
                    }
                    var positionY = this._chart.canvas.offsetTop;
                    var positionX = this._chart.canvas.offsetLeft;
                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
                },
                callbacks: {
                    title: function (item, data) {
                        var vsn = sessionStorage.getItem('variableSelectedName');
                        return vsn + ' ' + item[0].xLabel.toString();
                    },
                    label: function (tooltipItem, data) {
                        var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        var value = tooltipItem.yLabel.toString();
                        // tslint:disable-next-line:radix
                        if (parseInt(value) >= 1000) {
                            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                        return datasetLabel + ': ' + value;
                    },
                    afterBody: function (tooltipItem, data) {
                        // tslint:disable-next-line:no-string-literal
                        return data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]['x'];
                    }
                }
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'A??o',
                            fontFamily: '"Noto Sans TC", sans-serif',
                            fontSize: window.innerWidth < 575 ? 10 : 16
                        },
                        gridLines: {
                            lineWidth: 0
                        }
                    }
                ],
                yAxes: [
                    {
                        id: 'y-axis-0',
                        position: 'left',
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                // tslint:disable-next-line:radix
                                if (Number(value) >= 1000) {
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                }
                                else {
                                    return value;
                                }
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Cantidad',
                            fontFamily: '"Noto Sans TC", sans-serif',
                            fontSize: window.innerWidth < 575 ? 10 : 16
                        }
                    }
                ]
            },
            annotation: {}
        };
        this.lineChartColors = [];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.lineChartPlugins = [pluginAnnotations];
        this.loadCity = false;
    }
    IdesThematicComponent.prototype.ngOnInit = function () {
        sessionStorage.clear();
        if (this.router.url != '/home')
            this.getCities();
    };
    IdesThematicComponent.prototype.onWindowScroll = function ($event) {
        if (!this.loadCity && this.router.url == '/home' && $event.srcElement.scrollingElement.scrollTop > 100) {
            this.loadCity = true;
            this.getCities();
        }
    };
    IdesThematicComponent.prototype.getCities = function () {
        var _this = this;
        this.regionService.listRegionsPublic({ page: 0, limit: 1000, ascending: true, sort: '_id' }, 'Canton').subscribe(function (resp) {
            _this.cities = [];
            var setCities = new Set();
            resp.data.forEach(function (c) {
                if (!setCities.has(c._id) && c.active) {
                    _this.cities.push({ id: c._id, name: c.name, check: true, color: c.color });
                    setCities.add(c._id);
                }
            });
            _this.getClasifications();
        });
    };
    IdesThematicComponent.prototype.getClasifications = function () {
        var _this = this;
        this.resultClasification$ = this.clasificationService.listClasification(this.filters).pipe(operators_1.map(function (resp) {
            _this.clasificationSelected = resp.data[0];
            _this.getVariables();
            return resp;
        }));
    };
    IdesThematicComponent.prototype.getVariables = function () {
        var _this = this;
        this.resultVariables$ = this.variableService.getVariablesByClasification(this.clasificationSelected._id).pipe(operators_1.map(function (resp) {
            _this.variableSelected = resp.data[0];
            sessionStorage.setItem('variableSelectedName', _this.variableSelected.name);
            sessionStorage.setItem('variableSelectedLabel', _this.variableSelected.label);
            sessionStorage.setItem('variableSelectedMeasureSymbol', _this.variableSelected.measure_symbol);
            _this.getData();
            return resp;
        }));
    };
    IdesThematicComponent.prototype.getYearsAndCities = function () {
        this.years = [];
        var setYears = new Set();
        this.resultData.forEach(function (resp) {
            setYears.add(resp.year);
        });
        var yearsSorted = Array.from(setYears.values()).sort();
        var newOptions = Object.assign({}, this.options);
        newOptions.floor = +yearsSorted[0];
        newOptions.ceil = +yearsSorted[yearsSorted.length - 1];
        this.options = newOptions;
        this.highValue = +yearsSorted[0];
        this.value = +yearsSorted[yearsSorted.length - 1];
        for (var i = this.highValue; i <= this.value; i++) {
            this.yearSelected = i.toString();
            this.years.push({ id: i.toString(), name: i.toString(), check: true });
        }
    };
    IdesThematicComponent.prototype.loadData = function () {
        var _this = this;
        this.lineChartData = [];
        this.lineChartLabels = [];
        this.lineChartLabels = this.years.filter(function (y) { if (y.check) {
            return true;
        } return false; }).map(function (y) { return y.name; });
        if (this.lineChartType === CharType.lineal || this.lineChartType === CharType.bar) {
            if (this.variableSelected.chart_type.split(' ')[0] === 'stacked') {
                this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Ciudades';
                this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString = sessionStorage.getItem('variableSelectedLabel') == '' ? 'Cantidad' : sessionStorage.getItem('variableSelectedLabel');
                this.lineChartOptions.scales.xAxes[0].stacked = true;
                this.lineChartOptions.scales.yAxes[0].stacked = true;
                this.lineChartOptions.hover = { mode: "label" };
                this.lineChartLabels = [];
                this.lineChartColors = [{ backgroundColor: '#004587' }, { backgroundColor: '#076DCD' }, { backgroundColor: '#FFDA20' },
                    { backgroundColor: '#F8A901' }, { backgroundColor: '#1BD4D4' }, { backgroundColor: '#AAD6FF' },
                    { backgroundColor: '#8F8F8F' }, { backgroundColor: '#BFBFBF' }, { backgroundColor: '#E3E3E3' }];
                Object.keys(this.resultData[0].value).forEach(function (k) {
                    _this.lineChartData.push({
                        label: capitalizeFirst(k),
                        data: Array(),
                        stack: 'a'
                    });
                });
                this.resultData.forEach(function (d) {
                    if (d.year.toString() === _this.yearSelected) {
                        _this.lineChartLabels.push(formatLabel(d.obj_Canton.name));
                        Object.keys(d.value).forEach(function (k, idx) {
                            _this.lineChartData[idx].data.push(d.value[k]);
                        });
                    }
                });
            }
            else {
                this.lineChartOptions.scales.xAxes[0].stacked = false;
                this.lineChartOptions.scales.yAxes[0].stacked = false;
                this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = 'A??o';
                this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString = sessionStorage.getItem('variableSelectedLabel') == '' ? 'Cantidad' : sessionStorage.getItem('variableSelectedLabel');
                this.lineChartOptions.hover = { mode: "dataset" };
                // lineal
                this.cities.forEach(function (c, idx) {
                    var ch = JSON.parse(sessionStorage.getItem('citiesHidden'));
                    if (c.check) {
                        var color = c.color || '';
                        var colorStrong = _this.getColorStrong(c.color) || '';
                        _this.lineChartColors.push({
                            backgroundColor: color
                        });
                        sessionStorage.setItem(c.name.toLowerCase(), color);
                        var hidden = false;
                        if (ch && ch.indexOf(c.name) !== -1) {
                            hidden = true;
                        }
                        _this.lineChartData.push({
                            label: formatLabel(c.name),
                            data: Array(),
                            fill: false,
                            borderColor: colorStrong,
                            pointBorderColor: color,
                            pointBackgroundColor: 'white',
                            pointRadius: 2,
                            borderWidth: 2,
                            pointHoverRadius: 4,
                            pointHoverBackgroundColor: colorStrong,
                            pointHoverBorderWidth: 1,
                            hoverRadius: 8,
                            pointHoverBorderColor: 'white',
                            hoverBorderColor: colorStrong,
                            hoverBorderWidth: 4,
                            hoverBackgroundColor: colorStrong,
                            backgroundColor: color,
                            hidden: hidden
                        });
                        _this.lineChartLabels.forEach(function (y) {
                            _this.lineChartData[_this.lineChartData.length - 1].data.push(null);
                            _this.resultData.forEach(function (d) {
                                if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                                    _this.lineChartData[_this.lineChartData.length - 1].data[_this.lineChartData[_this.lineChartData.length - 1].data.length - 1]
                                        = { x: d.description, y: d.value };
                                }
                            });
                        });
                    }
                });
            }
        }
        else {
            this.cities.forEach(function (c) {
                if (c.check) {
                    _this.lineChartData.push({
                        label: formatLabel(c.name),
                        data: [],
                        fill: false
                    });
                    _this.lineChartLabels.forEach(function (y) {
                        _this.lineChartData[_this.lineChartData.length - 1].data.push(null);
                        _this.resultData.forEach(function (d) {
                            if (d.obj_Canton._id === c.id && d.year.toString() === y) {
                                _this.lineChartData[_this.lineChartData.length - 1].data[_this.lineChartData[_this.lineChartData.length - 1].data.length - 1]
                                    = d.value.electricidad;
                            }
                        });
                    });
                }
            });
        }
    };
    IdesThematicComponent.prototype.getData = function () {
        var _this = this;
        this.loading = true;
        var idVariable = null;
        if (this.variableSelected) {
            idVariable = this.variableSelected._id;
            this.lineChartType = CharType[this.variableSelected.chart_type.split(' ')[0]];
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.dataService.listDatasPublic({ page: 0, limit: 1000, ascending: true, sort: 'obj_Canton.name' }, idVariable).subscribe(function (data) {
            _this.loading = false;
            _this.resultData = data.data;
            _this.getYearsAndCities();
            _this.loadData();
        }, function (err) {
            _this.loading = false;
        });
    };
    IdesThematicComponent.prototype.onSelectClasification = function (clasification) {
        this.clasificationSelected = clasification;
        sessionStorage.removeItem('citiesHidden');
        this.getVariables();
    };
    IdesThematicComponent.prototype.onSelectVariable = function (variable) {
        this.variableSelected = variable;
        sessionStorage.setItem('variableSelectedName', this.variableSelected.name);
        sessionStorage.setItem('variableSelectedLabel', this.variableSelected.label);
        sessionStorage.setItem('variableSelectedMeasureSymbol', this.variableSelected.measure_symbol);
        sessionStorage.removeItem('citiesHidden');
        this.getData();
    };
    IdesThematicComponent.prototype.onCheckItemCity = function (e) {
        var idx = this.cities.findIndex(function (c) { return c.id === e; });
        this.cities[idx].check = !this.cities[idx].check;
        this.loadData();
    };
    IdesThematicComponent.prototype.onCheckItemYear = function (e) {
        var idx = this.years.findIndex(function (c) { return c.id === e; });
        this.years[idx].check = !this.years[idx].check;
        this.loadData();
    };
    IdesThematicComponent.prototype.downloadCanvas = function (event, typeDownload) {
        var anchor = event.target;
        var canvas = document.getElementById(this.variableSelected._id);
        var pdf = new jsPDF();
        switch (typeDownload) {
            case 'pdf': {
                var url = canvas.toDataURL();
                pdf.addImage(url, 'JPEG', 0, 0);
                pdf.save('download.pdf');
                break;
            }
            case 'csv': {
                // console.log('csv');
                break;
            }
            case 'png': {
                var url = canvas.toDataURL();
                anchor.href = url;
                anchor.download = 'download.png';
                break;
            }
            default: {
                // jpeg
                var url = canvas.toDataURL('image/jpeg');
                anchor.href = url;
                anchor.download = 'download.jpeg';
                break;
            }
        }
    };
    IdesThematicComponent.prototype.sliderChange = function (e) {
        var _loop_1 = function (i) {
            if (i < e.value || i > e.highValue) {
                var idx = this_1.years.findIndex(function (c) { return +c.id === i; });
                this_1.years[idx].check = false;
            }
            else {
                var idx = this_1.years.findIndex(function (c) { return +c.id === i; });
                this_1.years[idx].check = true;
            }
        };
        var this_1 = this;
        for (var i = this.options.floor; i <= this.options.ceil; i++) {
            _loop_1(i);
        }
        this.loadData();
    };
    IdesThematicComponent.prototype.onDownloadCSV = function (event) {
        var _this = this;
        var idVariable = null;
        if (this.variableSelected) {
            idVariable = this.variableSelected._id;
            this.lineChartType = CharType[this.variableSelected.chart_type.split(' ')[0]];
        }
        var date = new Date();
        this.dataService.downloadCSV({ page: 0, limit: 10000, ascending: true, sort: 'obj_Canton.name' }, idVariable, this.cities, this.years).subscribe(function (data) {
            var parsedResponse = data;
            var blob = new Blob([parsedResponse], { type: 'text/csv' });
            var url = window.URL.createObjectURL(blob);
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, event + '.csv');
            }
            else {
                var a = document.createElement('a');
                a.href = url;
                a.download = 'data-' + _this.utilsService.getStringFromDateNow() + '.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            window.URL.revokeObjectURL(url);
        });
    };
    IdesThematicComponent.prototype.onCheckYear = function (e) {
        this.yearSelected = e;
        this.loadData();
    };
    IdesThematicComponent.prototype.ngOnDestroy = function () {
        sessionStorage.clear();
    };
    IdesThematicComponent.prototype.getColorStrong = function (color) {
        return (color != undefined && color != '') ? color.replace(')', ', 08)') : '';
    };
    __decorate([
        core_1.ViewChild(ng2_charts_1.BaseChartDirective, { static: true })
    ], IdesThematicComponent.prototype, "chart");
    __decorate([
        core_1.HostListener('window:scroll', ['$event'])
    ], IdesThematicComponent.prototype, "onWindowScroll");
    IdesThematicComponent = __decorate([
        core_1.Component({
            selector: 'app-ides-thematic',
            templateUrl: './ides-thematic.component.html',
            styleUrls: ['./ides-thematic.component.scss']
        })
    ], IdesThematicComponent);
    return IdesThematicComponent;
}());
exports.IdesThematicComponent = IdesThematicComponent;
