import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemDropdown } from 'src/app/core/models/item-dropdown.model';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
declare var $: any; // ADD THIS
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ides-download',
  templateUrl: './ides-download.component.html',
  styleUrls: ['./ides-download.component.scss']
})
export class IdesDownloadComponent implements OnInit {

 /* exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementId: 'myTableElementId' // the id of html/table element
  };
*/

  @Input() div = 1.7;
  @Input() origins;
  @Input() idElement;
  @Input() titleExport = '';
  @Input() hiddenCSV;
  @Input() nameFile = 'download';
  @Input() height = 200;
  @Output() downloadCSV = new EventEmitter<string>();


  downloadOptions: ItemDropdown[] = [
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

  constructor(
    private exportAsService: ExportAsService
  ) { }

  ngOnInit() {
    if (this.hiddenCSV) {
      this.downloadOptions.map(value => {
        if (value.id === 'csv') {
          value.hidden = true;
        }
      });
    }
  }

  getOrigins() {
    let solve = '';
    if (this.origins) {
      this.origins.forEach((or, idx) => {
        if (idx !== 0) {
          solve += ', ';
        }
        solve += or.name;
      });
    }
    return solve;
  }

  async getURI(id, type) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    const newCanvas = canvas.cloneNode(true) as HTMLCanvasElement;
    newCanvas.height += 200;
    const ctx = newCanvas.getContext('2d');
    ctx.font = '20px Arial';
    if (type !== 'png') {
      ctx.fillStyle = '#FFF';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    }
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    ctx.drawImage(canvas, 0, 140, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillText(this.titleExport, (newCanvas.width / 2) - 60, 120);
    const img = new Image();
    img.src = '/assets/logos/logo.png';
    ctx.drawImage(img, 10, 10, 600 / this.div, 100 / this.div);
    const currentUrl = window.location.href;
    ctx.fillStyle = 'blue';
    ctx.font = '16px Arial';
    ctx.fillText(currentUrl, 10, newCanvas.height - 10);
    console.log("image:", newCanvas.width, newCanvas.height)
    return newCanvas.toDataURL('image/' + type, 1);
  }

  async downloadCanvas(event, typeDownload) {

    const anchor = event.target;
    const canvas = document.getElementById(this.idElement) as HTMLCanvasElement;
    const t = canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
   // this.exportAsConfig.elementId = this.idElement;
    const fileName = '[tipo_de_variable][periodo_tiempo][ideas_urbanas]'; // example poblacion_urbana_2000_2015_ideas_urbanas.pdf

    const pdf = new jsPDF({
      orientation: 'landscape'
    });

    switch (typeDownload) {
      case 'pdf': {
        const url = await this.getURI(this.idElement, 'png');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        console.log("pdf:", width, height)
        const im = new Image();
        im.src = url;
        im.onload = () => {
          if (window.innerWidth <= 768) {
            if (this.idElement == 'indexesGraph')
              pdf.addImage(url, 'png', 50, 20, 180, 180);
            else
              pdf.addImage(url, 'png', 20, 20, 240, 180);
          }
          else if (window.innerWidth > 768 && window.innerWidth < 1600) {
            if (this.idElement == 'indexesGraph')
              pdf.addImage(url, 'png', 40, 20, 200, 180);
            else
              pdf.addImage(url, 'png', 20, 20, 240, 180);
          }
          else {
            if (this.idElement == 'indexesGraph')
              pdf.addImage(url, 'png', 50, 20, 220, 180);
            else
              pdf.addImage(url, 'png', 20, 20, 240, 180);
          }
          // pdf.addImage(url, 'png', 0, 0, width, height);
          pdf.save(this.nameFile + '.pdf');
        };
        break;
      }
      case 'csv': {
        this.downloadCSV.emit(this.nameFile);
        break;
      }
      case 'png': {
        const url = await this.getURI(this.idElement, 'png');
        anchor.href = url;
        anchor.download = this.nameFile + '.png';
        break;
      }
      default: {
        // jpeg
        const url = await this.getURI(this.idElement, 'jpeg');
        anchor.href = url;
        anchor.download = this.nameFile + '.jpeg';
        break;
      }
    }
  }

}
