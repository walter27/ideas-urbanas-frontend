"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.IdesDownloadComponent = void 0;
var core_1 = require("@angular/core");
var jspdf_1 = require("jspdf");
var IdesDownloadComponent = /** @class */ (function () {
    function IdesDownloadComponent(exportAsService) {
        this.exportAsService = exportAsService;
        /* exportAsConfig: ExportAsConfig = {
           type: 'png', // the type you want to download
           elementId: 'myTableElementId' // the id of html/table element
         };
       */
        this.div = 1.7;
        this.titleExport = '';
        this.nameFile = 'download';
        this.height = 200;
        this.downloadCSV = new core_1.EventEmitter();
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
    }
    IdesDownloadComponent.prototype.ngOnInit = function () {
        if (this.hiddenCSV) {
            this.downloadOptions.map(function (value) {
                if (value.id === 'csv') {
                    value.hidden = true;
                }
            });
        }
    };
    IdesDownloadComponent.prototype.getOrigins = function () {
        var solve = '';
        if (this.origins) {
            this.origins.forEach(function (or, idx) {
                if (idx !== 0) {
                    solve += ', ';
                }
                solve += or.name;
            });
        }
        return solve;
    };
    IdesDownloadComponent.prototype.getURI = function (id, type) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, newCanvas, ctx, img, currentUrl;
            return __generator(this, function (_a) {
                canvas = document.getElementById(id);
                newCanvas = canvas.cloneNode(true);
                newCanvas.height += 200;
                ctx = newCanvas.getContext('2d');
                ctx.font = '20px Arial';
                if (type !== 'png') {
                    ctx.fillStyle = '#FFF';
                }
                else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                }
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, 0, 140, canvas.width, canvas.height);
                ctx.fillStyle = 'blue';
                ctx.fillText(this.titleExport, (newCanvas.width / 2) - 60, 120);
                img = new Image();
                img.src = '/assets/logos/logo.png';
                ctx.drawImage(img, 10, 10, 600 / this.div, 100 / this.div);
                currentUrl = window.location.href;
                ctx.fillStyle = 'blue';
                ctx.font = '16px Arial';
                ctx.fillText(currentUrl, 10, newCanvas.height - 10);
                console.log("image:", newCanvas.width, newCanvas.height);
                return [2 /*return*/, newCanvas.toDataURL('image/' + type, 1)];
            });
        });
    };
    IdesDownloadComponent.prototype.downloadCanvas = function (event, typeDownload) {
        return __awaiter(this, void 0, void 0, function () {
            var anchor, canvas, t, ctx, fileName, pdf, _a, url_1, width, height, im, url, url;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        anchor = event.target;
                        canvas = document.getElementById(this.idElement);
                        t = canvas;
                        ctx = canvas.getContext('2d');
                        fileName = '[tipo_de_variable][periodo_tiempo][ideas_urbanas]';
                        pdf = new jspdf_1["default"]({
                            orientation: 'landscape'
                        });
                        _a = typeDownload;
                        switch (_a) {
                            case 'pdf': return [3 /*break*/, 1];
                            case 'csv': return [3 /*break*/, 3];
                            case 'png': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, this.getURI(this.idElement, 'png')];
                    case 2:
                        url_1 = _b.sent();
                        width = pdf.internal.pageSize.getWidth();
                        height = pdf.internal.pageSize.getHeight();
                        console.log("pdf:", width, height);
                        im = new Image();
                        im.src = url_1;
                        im.onload = function () {
                            if (window.innerWidth <= 768) {
                                if (_this.idElement == 'indexesGraph')
                                    pdf.addImage(url_1, 'png', 50, 20, 180, 180);
                                else
                                    pdf.addImage(url_1, 'png', 20, 20, 240, 180);
                            }
                            else if (window.innerWidth > 768 && window.innerWidth < 1600) {
                                if (_this.idElement == 'indexesGraph')
                                    pdf.addImage(url_1, 'png', 40, 20, 200, 180);
                                else
                                    pdf.addImage(url_1, 'png', 20, 20, 240, 180);
                            }
                            else {
                                if (_this.idElement == 'indexesGraph')
                                    pdf.addImage(url_1, 'png', 50, 20, 220, 180);
                                else
                                    pdf.addImage(url_1, 'png', 20, 20, 240, 180);
                            }
                            // pdf.addImage(url, 'png', 0, 0, width, height);
                            pdf.save(_this.nameFile + '.pdf');
                        };
                        return [3 /*break*/, 8];
                    case 3:
                        {
                            this.downloadCSV.emit(this.nameFile);
                            return [3 /*break*/, 8];
                        }
                        _b.label = 4;
                    case 4: return [4 /*yield*/, this.getURI(this.idElement, 'png')];
                    case 5:
                        url = _b.sent();
                        anchor.href = url;
                        anchor.download = this.nameFile + '.png';
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.getURI(this.idElement, 'jpeg')];
                    case 7:
                        url = _b.sent();
                        anchor.href = url;
                        anchor.download = this.nameFile + '.jpeg';
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "div");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "origins");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "idElement");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "titleExport");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "hiddenCSV");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "nameFile");
    __decorate([
        core_1.Input()
    ], IdesDownloadComponent.prototype, "height");
    __decorate([
        core_1.Output()
    ], IdesDownloadComponent.prototype, "downloadCSV");
    IdesDownloadComponent = __decorate([
        core_1.Component({
            selector: 'app-ides-download',
            templateUrl: './ides-download.component.html',
            styleUrls: ['./ides-download.component.scss']
        })
    ], IdesDownloadComponent);
    return IdesDownloadComponent;
}());
exports.IdesDownloadComponent = IdesDownloadComponent;
