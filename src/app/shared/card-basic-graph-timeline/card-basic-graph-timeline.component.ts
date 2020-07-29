import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import TimeLine from 'highcharts/modules/timeline';



@Component({
  selector: 'app-card-basic-graph-timeline',
  templateUrl: './card-basic-graph-timeline.component.html',
  styleUrls: ['./card-basic-graph-timeline.component.scss']
})
export class CardBasicGraphTimelineComponent implements OnInit {

  updateDemo: boolean;
  highcharts: any;
  chartOptions: any;
  @Input("minScroll") minScroll: number;
  @Input("maxScroll") maxScroll: number;





  constructor() {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    TimeLine(this.highcharts);

  }

  ngOnInit() {
    this.createTimeLine();

  }


  createTimeLine() {

    this.chartOptions = {

      chart: {
        type: 'timeline',
        inverted: false,
        scrollablePlotArea: {
          minWidth: 7000,
          scrollPositionX: 0,
          marginLeft: 150
        },
        backgroundColor: 'rgba(0,0,0,0)',
        animation: true
      },
      xAxis: {
        type: 'datetime',
        visible: false,
        //min: this.minScroll,
        //max: this.maxScroll
      },

      yAxis: {
        gridLineWidth: 1,
        title: null,
        labels: {
          enabled: false
        }
      },

      legend: {
        enabled: false
      },

      title: {
        text: 'Hitos del COVID-19',
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
          fontSize: '30px',
        }
      },

      subtitle: {
        text: 'Cronología de las respuestas urbanas al COVID-19',
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
          fontSize: '15px'
        }
      },
      exporting: {
        enabled: false,
        //filename: `casos_${this.variable.name}_covid19_hitos`
      },

      series: [{
        dataLabels: {
          allowOverlap: true,
          connectorColor: 'silver',
          connectorWidth: 2,
          useHTML: true,
          borderWidth: 0
        },
        marker: {
          symbol: 'circle'
        },
        data: [{
          name: ' <strong style="position: absolute; top:118px;left:0px;">17 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-30px;"><img src = "assets/covid/marzo/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:35px;">Se declara en emergencia </br> en todo el territorio </br> ecuatoriano.</p>',
          description: "Se declara en emergencia en todo el territorio ecuatoriano."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">20 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Las municipalidades realizan </br> tareas de desinfección de espacios </br> públicos usando productos </br> como amonio.</p>',
          description: "Las municipalidades realizan tareas de desinfección de espacios públicos usando productos como amonio."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">23 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Se realizan controles </br> para acceso a mercados.</p>',
          description: "Se realizan controles para acceso a mercados. Algunos municipios establecen horarios de ingresos por número de cédula."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">26 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Las municipalidades reprograman </br> sus deudas, hasta por 90 días </br> con la banca pública.</p>',
          description: "Las municipalidades reprograman sus deudas, hasta por 90 días con la banca pública."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">27 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Se organizan campañas </br> para  donación de alimentos </br> y mascarillas.</p>',
          description: "Se organizan campañas para donación de alimentos y mascarillas."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">28 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">AME anuncia que 8 </br> alcaldes del país dieron </br> positivo al virus.</p>',
          description: "AME anuncia que 8 alcaldes del país dieron positivo al virus."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">No existe capacidad instalada en las ciudades </br> para realizar cremaciones </br> de cadáveres de las </br> víctimas del Covid-19.</p>',
          description: "No existe capacidad instalada en las ciudades para realizar cremaciones de cadáveres de las víctimas del Covid-19."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:4px;">Guayaquil se vuelve </br> el centro de la pandemia.</p>',
          description: "Guayaquil se vuelve el centro de la pandemia. Ciudades como Quevedo cierran los mercados durante el fin de semana."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">4 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Milagro solicita al </br> COE Nacional ampliar </br> el toque de queda por </br> incrementos de casos</p>',
          description: "Quito anuncia el cierre de mercados en Calderón debido a la proliferación del virus en ese sector de la ciudad. Milagro solicita al COE Nacional ampliar el toque de queda por incrementos de casos."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">6 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Coe Nacional solicita </br> a las municipalidades regular </br> el uso de mascarilla.</p>',
          description: "Coe Nacional solicita a las municipalidades regular el uso de mascarilla."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">8 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Riobamba y Santo Domingo son las primeras ciudades </br> capitales en aprovar ordenanzas </br> para regular el uso de mascarilla.</p>',
          description: "Riobamba y Santo Domingo son las primeras ciudades capitales en aprovar ordenanzas para regular el uso de mascarilla."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">9 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Se registran anglomeraciones </br> y disturbios en mercados </br> mayoristas de Loja y Ambato.</p>',
          description: "Se registran anglomeraciones y disturbios en mercados mayoristas de Loja y Ambato."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">10 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">COE Nacional restringe </br> el uso de amonio </br> para desinfección de espacio públicos.</p>',
          description: "COE Nacional restringe el uso de amonio para desinfección de espacio públicos. "
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">13 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Guayaquil empieza una </br> campaña para realizar pruebas </br> rápidas en forma aleatoria </br> en todo el cantón.</p>',
          description: "Guayaquil empieza una campaña para realizar pruebas rápidas en forma aleatoria en todo el cantón."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">20 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Municipios como el de Quito, </br> Ibarra, anuncian la realización </br> de pruebas PCR para el Covid.</p>',
          description: "Municipios como el de Quito, Ibarra, anuncian la realización de pruebas PCR para el Covid."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">26 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/9.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">El Gobierno anuncia el </br> paso del aislamiento al </br> distanciamiento social.</p>',
          description: "El Gobierno anuncia el paso del aislamiento al distanciamiento social. Cada COE cantonal decidirá su sistema de semaforización."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Alcaldes del país, </br> a través de AME, </br> deciden mantener sus semáforos </br> en rojo hasta el 17 de mayo.</p>',
          description: "Alcaldes del país, a través de AME, deciden mantener sus semáforos en rojo hasta el 17 de mayo."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">1 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Alcaldes empiezan a recibir </br> estadísticas de contagios </br> en sus cantones por </br> parte del MSP.</p>',
          description: "Alcaldes empiezan a recibir estadísticas de contagios en sus cantones por parte del MSP."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">3 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/2.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">115 funcionarios municipales </br> fallecidos  y 19 alcaldes contagiados </br> por COVID-19 a nivel </br> nacional, según AME.</p>',
          description: "115 funcionarios municipales fallecidos y 19 alcaldes contagiados por COVID-19 a nivel nacional, según AME."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">4 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">El país empieza a </br> volver gradualmente a </br> una nueva normalidad.</p>',
          description: "El país empieza a volver gradualmente a una nueva normalidad."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">7 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">El Presidente de la República hace un llamado </br> a los alcaldes a cambiar </br> de color de semáforos </br>  para reactivar la economía.</p>',
          description: "El Presidente de la República hace un llamado a los alcaldes a cambiar de color de semáforos para reactivar la economía."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">12 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:0px;">50 cantones anuncia </br>que pasarán de </br> rojo a amarillo.</p>',
          description: "50 cantones anuncia que pasarán de rojo a amarillo."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">15 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Babahoyo investiga 15 </br> posibles contagios por </br> celebrar el Día de la Madre.</p>',
          description: "Babahoyo investiga 15 posibles contagios por celebrar el Día de la Madre."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">20 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Guayaquil cambia a  </br>semáforo amarillo, con </br> menores restricciones de </br> movilidad.</p>',
          description: "Guayaquil cambia a semáforo amarillo, con menores restricciones de movilidad."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">24 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Aguarico es el único </br> cantón de Ecuador </br> con semáforo en verde.</p>',
          description: "Aguarico es el único cantón de Ecuador con semáforo en verde."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">27 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/9.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">COE nacional modifica </br> las restricciones de </br> la semaforización.</p>',
          description: "COE nacional modifica las restricciones de la semaforización."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Durante el mes,</br> Fiscalía allana municipios.</p>',
          description: "Durante el mes, Fiscalía ha allanado municipios de Machala, Colta, Quito para investigaciones por adquisiciones en emergencia."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">1 de JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Fiscalía anuncia cración </br> de unidad especial para investigaciones </br> por contrataciones de emergencia </br> en municipios.</p>',
          description: "Ecuador empieza una nueva etapa de desconfinamiento con flexibilización en los semáforos epidemiológicos para fomentar la producción, 32% de los cantones se encuentran en amarillo. Fiscalía anuncia cración de unidad especial para investigaciones por contrataciones de emergencia en municipios."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">2 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/2.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Daule es el segundo </br> cantón en cambiar </br> su semáforo a verde.</p>',
          description: "Daule es el segundo cantón en cambiar su semáforo a verde."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Quito cambia sus </br> regulaciones pasando de </br> semáforo rojo a amarillo.</p>',
          description: "Quito cambia sus regulaciones pasando de semáforo rojo a amarillo."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">12 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">El 60% de los cantones </br> del país cambian su </br> semáforo a amarillo.</p>',
          description: "El 60% de los cantones del país cambian su semáforo a amarillo."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">27 DE JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">"El alcade de </br> Quito  anuncia que los </br> servicios sanitarios </br> "Ya no dan más"..</p>',
          description: "El alcade de Quito anuncia que los servicios sanitarios 'Ya no dan más' y pide al COE Nacional ampliar el horario de toque de queda e implementar la ley seca."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">El COE Nacional autoriza </br> a que los funcionarios </br> públicos de la administración..</p>',
          description: "El COE Nacional autoriza a que los funcionarios públicos de la administración central de gobierno regresen a trabajar de forma presencial."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Milagro reinicia circulación </br> de buses de transporte </br> urbano con el 50% del aforo.</p>',
          description: "Milagro reinicia circulación de buses de transporte urbano con el 50% del aforo."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">10 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Manta promociona </br> estrategia de turismo </br> bioseguro.</p>',
          description: "Manta promociona estrategia de turismo bioseguro."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">12 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/12.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Alcalde de Ambato </br> da positivo para </br> Covid-19.</p>',
          description: "Alcalde de Ambato da positivo para Covid-19."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">15 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/15.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Alcaldesa de Ibarra </br> da positivo para </br> Covid-19.</p>',
          description: "Alcaldesa de Ibarra da positivo para Covid-19."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">18 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/18.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Alcaldes de Lago Agrio </br> y Francisco de Orellana </br> coordinan..</p>',
          description: "Alcaldes de Lago Agrio y Francisco de Orellana coordinan para gestionar mancomunadamente medicina al gobierno de Rusia."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">23 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/24.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:30px;">Quito se convierte </br> en la ciudad con </br> mayor número..</p>',
          description: "Quito se convierte en la ciudad con mayor número de personas contagiadas en Ecuador."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">24 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/24.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:10px;">Latacunga </br>  organiza datathón para </br> medir la cantidad  de aire en los </br> espacios públicos</p>',
          description: "Latacunga organiza datathón para medir la cantidad de aire en los espacios públicos."
        },
        {
          name: ' <strong style="position: absolute; top:118px; right:10px;">25 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px; right:-25px;"><img src = "assets/covid/julio/25.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute; right: 10px; top:30px;">COE de Esmeraldas, Cuenca, Tulcán </br> y Portoviejo  solicitan al COE nacional </br> ampliar los toques de queda..</p>',
          description: "COE de Esmeraldas, Cuenca, Tulcán y Portoviejo solicitan al COE nacional ampliar los toques de queda, restringir el consumo de alcohol, prohibir reuniones de más de 25 personas y dotar de insumos a hospitales públicos."
        }]
      }]
    };
    this.updateDemo = true;

  }

}
