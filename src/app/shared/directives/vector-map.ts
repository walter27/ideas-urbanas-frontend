import { OnInit, Directive, Input, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
declare var $: any;
@Directive({
    selector: '[vectormap]'
})
export class VectormapDirective implements OnInit, OnDestroy {
    @Input() mapHeight: number;
    @Input() mapName: any;
    @Input() mapOptions: any;
    @Input() seriesData: any;
    @Input() markersData: any;
    $element: any;
    @Output() markerClick = new EventEmitter<any>();

    constructor(public element: ElementRef) { }

    ngOnInit() {


        this.$element = $(this.element.nativeElement);
        this.$element.css('height', this.mapHeight);

        if (!this.$element.length || !this.$element.vectorMap) {
            return;
        }

        this.$element.vectorMap({
            map: this.mapName,
            backgroundColor: this.mapOptions.bgColor,
            zoomMin: 1,
            zoomMax: 8,
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    'fill': this.mapOptions.regionFill,
                    'fill-opacity': 1,
                    'stroke': '#0068ff',
                    'stroke-width': 1.5,
                    'stroke-opacity': 1
                },
                hover: {
                    'fill-opacity': 0.8
                },
                selected: {
                    fill: 'blue'
                },
                selectedHover: {
                }
            },
            focusOn: { x: 0.4, y: 0.6, scale: this.mapOptions.scale },
            markerStyle: {
                initial: {
                    fill: this.mapOptions.markerColor,
                    stroke: "#076CCB",
                    "fill-opacity": 1,
                    "stroke-width": 5,
                    "stroke-opacity": 1
                },
                hover: {
                    stroke: '#F8A901',
                    "stroke-width": 5,
                    cursor: 'pointer',
                    "stroke-opacity": 1
                }
            },
            onRegionLabelShow: (e, el, code) => {
                if (this.seriesData && this.seriesData[code]) {
                    $('.jvectormap-label').css('background', 'transparent');
                    $('.jvectormap-label').css('border', 'transparent');
                    el.html('');
                }
            },
            onMarkerLabelShow: (e, el, code) => {
                $('.jvectormap-label').css('background', '#313232');
                $('.jvectormap-label').css('border', '#515253');
            },
            onMarkerClick: (e, code) => {
                this.markerClick.emit(code);
            },
            markers: this.markersData,
            series: {
                regions: [{
                    values: this.seriesData,
                    scale: this.mapOptions.scaleColors,
                    normalizeFunction: 'polynomial'
                }]
            },
        });
    }

    ngOnDestroy() {
        this.$element.vectorMap('get', 'mapObject').remove();
    }
}