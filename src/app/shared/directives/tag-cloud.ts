import { OnInit, Directive, Input, ElementRef, OnDestroy } from '@angular/core';
declare var $: any;
declare var d3: any;

@Directive({
    selector: '[tagcloud]'
})
export class TagcloudDirective implements OnInit, OnDestroy {

    @Input() data: any[];
    @Input() idElement: string;
    @Input() width: number;
    @Input() height: number;
    @Input() maxFont: number;


    constructor(public element: ElementRef) { }

    ngOnInit() {
        this.newTagCloud();
    }

    newTagCloud() {

        const data = [];

        this.data.forEach(el => {
            data.push({
                text: el.text,
                size: el.weight
            });
        });

        data.forEach(function (d) {
            d.size = +d.size;
        });

        //sorts the array by the most repeated word
        var w = 550, h = 270,
            maxFont = 96,
            maxSize = 1,
            sizeOffset = maxFont / maxSize / 10;

        var layout = d3.layout.cloud()
            .size([w, h])
            .words(data)
            .spiral("rectangular") // rectangular | archimedean
            .rotate(0)
            .font("Noto Sans TC")
            .fontSize(function (d) {
                return Math.max(20, Math.min(d.size * sizeOffset, maxFont));
            })
            .on("end", onDraw);
        layout.start();

        //callback fired when all words have been placed
        function onDraw() {
            var svg = d3.select("#tag-cloud-wrapper").append("svg").attr({ width: w, height: h, "id": "svg-node" }),
                vis = svg.append("g").attr("transform", "translate(" + [w >> 1, (h >> 1) - 10] + ")scale(2)");

            var text = vis.selectAll("text").data(data);

            text.enter().append("text")
                .style("font-family", function (d) { return d.font; })
                .style("font-size", function (d) { return d.size + "px"; })
                .style("fill", 'black')
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

    ngOnDestroy() {

    }
}