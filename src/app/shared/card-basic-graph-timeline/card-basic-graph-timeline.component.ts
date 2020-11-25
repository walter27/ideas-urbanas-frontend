import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import TimeLine from 'highcharts/modules/timeline';
import { TranslateService } from '@ngx-translate/core';

const { exportTimeLineCSV, exportTimeLineXLSX }: any = require('../../core/utils/utils');




@Component({
  selector: 'app-card-basic-graph-timeline',
  templateUrl: './card-basic-graph-timeline.component.html',
  styleUrls: ['./card-basic-graph-timeline.component.scss']
})
export class CardBasicGraphTimelineComponent implements OnInit {

  updateDemo: boolean;
  highcharts: any;
  chartOptions: any;
  title: string;
  subtitle: string;
  @Input("minScroll") minScroll: number;
  @Input("maxScroll") maxScroll: number;

  timeLine = [{

    date: '12/03/2020',
    news: 'Declaración de emergencia sanitaria en el sistema nacional de salud pública. Guayaquil y Santa Elena son las primeras ciudades en declararse en emergencia',
    origin: 'https://www.salud.gob.ec/wp-content/uploads/2020/03/SRO160_2020_03_12.pdf'
  },
  {
    date: '16/03/2020',
    news: 'El 50% de las municipalidades de las ciudades intermedias de Ecuador se declara en emergenia.',
    origin: ''
  },
  {
    date: '17/03/2020',
    news: 'Se declara estado de emergencia en todo el territorio ecuatoriano',
    origin: 'https://www.primicias.ec/noticias/sociedad/ecuador-declara-emergencia-sanitaria-por-propagacion-del-coronavirus/'
  }, {
    date: '20/03/2020',
    news: 'Municipalidades como Machala realizan tareas de desinfección de espacios públicos usando productos como amonio',
    origin: 'https://www.diariocorreo.com.ec/40321/ciudad/municipalidad-de-machala-desinfecta-hospital-y-centros-de-salud-de-la-ciudad'
  }, {
    date: '23/03/2020',
    news: 'Se realizan controles para acceso a mercados. Algunos municipios establecen horarios de ingresos por número de cédula',
    origin: 'https://www.primicias.ec/noticias/lo-ultimo/mercados-quito-coronavirus-cedula/'
  }, {
    date: '26/03/2020',
    news: 'Las municipalidades reprograman sus deudas, hasta por 90 días con la banca pública',
    origin: ''
  }, {
    date: '27/03/2020',
    news: 'Se organizan campañas para donación de alimentos y mascarillas',
    origin: ''
  }, {
    date: '28/03/2020',
    news: 'AME anuncia que 8 alcaldes del país dieron positivo al virus',
    origin: 'https://www.eluniverso.com/noticias/2020/03/28/nota/7798026/alcaldes-coronavirus-guayas-otras-ciudades?hootPostID=791ecf60af386d813619dd190d0358c1'
  }, {
    date: '29/03/2020',
    news: 'No existe capacidad instalada en las ciudades para realizar cremaciones de cadáveres de las víctimas del Covid-19',
    origin: 'https://www.eluniverso.com/noticias/2020/03/30/nota/7798989/crematorios-no-se-dan-abasto-guayaquil'
  }, {
    date: '30/03/2020',
    news: 'Ciudades como Santo Domingo cierran sus fronteras terrestres, impidiendo la entrada y salida del territorio.',
    origin: ''
  }, {
    date: '03/04/2020',
    news: 'Ciudades como Quevedo cierran los mercados durante el fin de semana.Guayaquil se vuelve el centro de la pandemia en Ecuador por el alto número de fallecimientos.',
    origin: 'https://www.bbc.com/mundo/noticias-america-latina-52116100'
  }, {
    date: '04/04/2020',
    news: 'Quito anuncia el cierre de mercados en Calderón debido a la proliferación del virus en ese sector de la ciudad. Milagro solicita al COE Nacional ampliar el toque de queda por incremento de casos.',
    origin: ''
  }, {
    date: '06/04/2020',
    news: 'COE Nacional solicita a las municipalidades regular el uso de mascarillas',
    origin: 'https://www.expreso.ec/actualidad/coronavirus-municipios-deberan-exigir-mascarillas-8664.htmll'
  }, {
    date: '08/04/2020',
    news: 'Riobamba y Santo Domingo son las primeras ciudades capitales en aprobar ordenanzas para regular el uso de mascarillas',
    origin: 'https://elespectadorchimborazo.com/ordenanza-establece-uso-obligatorio-de-mascarilla-en-espacios-publicos-de-riobamba/'
  }, {
    date: '09/04/2020',
    news: 'Se registran aglomeraciones y disturbios en mercados mayoristas de Loja y Ambato',
    origin: 'https://www.diariocorreo.com.ec/40848/ciudad/con-cerco-de-seguridad-cabildo-controla-que-los-vendedores-no-vuelvan-a-las-calles'
  }, {
    date: '10/04/2020',
    news: 'El COE nacional restringe el uso de amonio para desinfección de espacios públicos',
    origin: 'https://amchamgye.org.ec/agye/wp-content/uploads/Resoluciones-COE-Nacional-10-de-abril-2020-1.pdf'
  }, {
    date: '13/04/2020',
    news: 'Guayaquil empieza una campaña para realizar pruebas rápidas en forma aleatoria en todo el cantón',
    origin: 'https://www.primicias.ec/noticias/lo-ultimo/pruebas-rapidas-coronavirus-puerta-puerta-manana-guayaquil/'
  }, {
    date: '20/04/2020',
    news: 'Municipios como el de Quito e Ibarra, anuncian la realización de pruebas PCR para detectar Covid',
    origin: 'https://www.elcomercio.com/actualidad/ibarra-pruebas-covid19-cerco-epidemiologico.html'
  }, {
    date: '26/04/2020',
    news: 'El Gobierno Nacional anuncia el paso del aislamiento al distanciamiento social. Cada COE cantonal decidirá su sistema de semaforización',
    origin: 'https://www.eluniverso.com/noticias/2020/04/24/nota/7822044/ecuador-pasara-partir-4-mayo-aislamiento-distanciamiento-social'
  }, {
    date: '29/04/2020',
    news: 'Alcaldes del país, a través de AME, deciden mantener sus semáforos en rojo hasta el 17 de mayo',
    origin: 'https://www.eluniverso.com/noticias/2020/04/29/nota/7826946/ame-solicita-mantener-semaforo-rojo-hasta-17-mayo'
  }, {
    date: '01/05/2020',
    news: 'Alcaldes empiezan a recibir estadísticas de contagios en sus cantones por parte del MSP',
    origin: 'https://www.elcomercio.com/actualidad/alcaldes-datos-coronavirus-contagio-coe.html'
  }, {
    date: '03/05/2020',
    news: '115 funcionarios municipales fallecidos y 19 alcaldes contagiados por  COVID-19 a nivel nacional, según AME',
    origin: 'https://www.eluniverso.com/noticias/2020/05/02/nota/7830372/115-funcionarios-municipales-fallecidos-18-alcaldes-contagiados'
  }, {
    date: '04/05/2020',
    news: 'El país empieza a volver gradualmente a una nueva normalidad',
    origin: 'https://www.elcomercio.com/actualidad/consejos-prevencion-covid19-salida-casa.html'
  }, {
    date: '07/05/2020',
    news: 'El Presidente de la República hace un llamado a los alcaldes a cambiar de color de semáforos para reactivar la economía',
    origin: 'https://www.elcomercio.com/actualidad/moreno-alcades-economia-coronavirus-ecuador.html'
  }, {
    date: '12/05/2020',
    news: '50 cantones anuncia que pasarán de rojo a amarillo',
    origin: 'https://www.aeade.net/estado-de-la-semaforizacion-local/'
  }, {
    date: '15/05/2020',
    news: 'Babahoyo investiga 15 posibles contagios por celebrar el Día de la Madre',
    origin: 'https://www.elcomercio.com/actualidad/babahoyo-investiga-contagio-familia-coronavirus.html'
  }, {
    date: '20/05/2020',
    news: 'Guayaquil cambia a semáforo amarillo, con menores restricciones de movilidad ',
    origin: 'https://www.elcomercio.com/actualidad/guayaquil-semaforo-amarillo-confinamiento-coronavirus.html'
  }, {
    date: '24/05/2020',
    news: 'Aguarico es el único cantón de Ecuador con semáforo en verde',
    origin: 'https://www.eluniverso.com/noticias/2020/05/23/nota/7850337/este-domingo-24-mayo-solo-aguarico-semaforo-verde-se-permite'
  }, {
    date: '27/05/2020',
    news: 'COE nacional modifica las restricciones de la semaforización',
    origin: ' https://www.eluniverso.com/noticias/2020/05/27/nota/7853670/coe-n-modifica-reglas-tres-semaforos-1-junio'
  }, {
    date: '01/06/2020',
    news: 'Ecuador empieza una nueva etapa de desconfinamiento con flexibilización en los semáforos epidemiológicos para fomentar la producción. 32% de los cantones se encuentran en amarillo. Fiscalía anuncia creación de unidad especial para investigaciones por contrataciones de emergencia en municipios. ',
    origin: 'https://www.sandiegouniontribune.com/en-espanol/noticias/story/2020-06-01/fiscalia-de-ecuador-crea-equipo-anticorrupcion-en-pandemia'
  }, {
    date: '02/06/2020',
    news: 'Daule es el segundo cantón en cambiar su semáforo a verde. Con el cambio de semáforo, el toque de queda inicia a la media noche.',
    origin: 'https://www.eltelegrafo.com.ec/noticias/politica/3/moreno-alcalde-daule-cambio-semaforo'
  }, {
    date: '03/06/2020',
    news: 'Quito cambia sus regulaciones pasando de semáforo rojo a amarillo',
    origin: 'https://www.elcomercio.com/actualidad/quito-reactivacion-semaforo-amarillo-coronavirus.html'
  }, {
    date: '12/06/2020',
    news: 'El 60% de los cantones del país cambian su semáforo a amarillo',
    origin: 'https://as.com/diarioas/2020/06/09/actualidad/1591719948_494148.html'
  }, {
    date: '27/06/2020',
    news: 'El alcade de Quito anuncia que los servicios sanitarios "Ya no dan más" y pide al COE Nacional ampliar el horario de toque de queda e implementar la ley seca ',
    origin: 'http://www.pichinchacomunicaciones.com.ec/yunda-asegura-que-los-servicios-sanitarios-en-quito-ya-no-dan-mas/'
  }, {
    date: '29/06/2020',
    news: 'El COE Nacional autoriza que los funcionarios públicos de la administración central de gobierno regresen a trabajar de forma presencial. La ministra de Gobierno, María Paula Romo, descartó implementar una ley seca en Quito y ampliar el horario del toque de queda',
    origin: 'http://www.pichinchacomunicaciones.com.ec/servidores-publicos-aun-no-retomaran-el-trabajo-presencial-en-quito-segun-disposicion-del-coe/'
  }, {
    date: '03/07/2020',
    news: 'Milagro reinicia circulación de buses de transporte urbano con el 50% del aforo',
    origin: 'https://www.facebook.com/AlcaldiaDeMilagro/photos/a.337046780324460/555367568492379/?type=3&theater'
  }, {
    date: '10/07/2020',
    news: 'Manta promociona estrategia de turismo bioseguro',
    origin: 'https://www.facebook.com/MunicipioManta/photos/a.1496282243937656/2762940260605175/?type=3&theater'
  }, {
    date: '12/07/2020',
    news: 'Alcalde de Ambato da positivo para Covid-19',
    origin: 'https://www.elcomercio.com/actualidad/alcalde-ambato-altamirano-contagiado-covid.html'
  }, {
    date: '15/07/2020',
    news: 'Alcaldesa de Ibarra da positivo para Covid-19',
    origin: 'https://www.elcomercio.com/actualidad/alcaldes-sierra-norte-ecuador-coronavirus.html'
  }, {
    date: '18/07/2020',
    news: 'Alcaldes de Lago Agrio y Francisco de Orellana coordinan para gestionar mancomunadamente medicina al gobierno de Rusia',
    origin: ''
  }, {
    date: '23/07/2020',
    news: 'Quito se convierte en la ciudad con mayor número de personas contagiadas en Ecuador',
    origin: 'https://ww2.elmercurio.com.ec/2020/07/23/quito-se-convierte-en-la-ciudad-mas-contagiada-por-coronavirus-en-ecuador/'
  }, {
    date: '24/07/2020',
    news: 'Latacunga organiza datathón para medir la cantidad de aire en los espacios públicos',
    origin: ''
  }, {
    date: '24/07/2020',
    news: 'El alcade de Pastaza, Oswaldo Zúñiga, informó que dio positivo para COVID-19',
    origin: 'https://www.eluniverso.com/noticias/2020/07/27/nota/7920885/alcalde-pastaza-confirmo-que-dio-positivo-covid-19'
  }, {
    date: '25/07/2020',
    news: 'COE de Esmeraldas, Cuenca, Tulcán y Portoviejo solicitan al COE nacional ampliar los toques de queda, restringir el consumo de alcohol, prohibir reuniones de más de 25 personas y dotar de insumos a hospitales públicos',
    origin: 'https://esmeraldas.gob.ec/dircom/noticias/item/1255-coe-cantonal-insiste-ante-coe-nacional-dote-de-insumos-para-tratamiento-del-covid?fbclid=IwAR2Fx2xIltSJYQ0Pa488IeoX_y5ePoOTjhTnwaT1WlR9ZJfLakKNqJ5SrOI'
  }, {
    date: '31/07/2020',
    news: 'A partir del 31 de julio rige ley seca durante los fines de semana y ampliación del toque de queda de 19:00 a 05:00, de viernes a domingo para 18 provincias del país, por disposición del COE Nacional',
    origin: 'https://www.elcomercio.com/actualidad/refuerzo-controles-licor-emergencia-sanitaria.html'
  }, {
    date: '01/08/2020',
    news: 'La alcaldesa de Guayaquil reaccionó en torno al anuncio de la ministra de educación Monserrat Creamer sobre un operativo para el regreso a clases presenciales ',
    origin: 'https://www.eluniverso.com/guayaquil/2020/08/01/nota/7926000/clases-casa-todo-2020-pide-viteri-halla-apoyo-medicos-coe-nacional'
  }, {
    date: '01/08/2020',
    news: '40.000 mascarillas antifluídos serán confeccionadas localmente en Tulcán con la participación de la Asociación de Sastres del cantón. El proyecto cuenta con el financiamiento de la Embajada de Australia en Perú y la coordinación del GAD municipal',
    origin: 'https://www.elcomercio.com/actualidad/sastres-tulcan-produccion-mascarillas-covid19.html'
  }, {
    date: '01/08/2020',
    news: 'Cerca de 3.000 comercios han cerrado en Loja, según el presidente de la Cámara de Comercio de esa ciudad',
    origin: 'https://cronica.com.ec/2020/07/03/3000-comercios-cerraron-en-loja/'
  }, {
    date: '04/08/2020',
    news: 'Se abren 40 playas como medida de promoción del turismo interno. Portoviejo y Manta deciden mantener cerradas sus playas hasta el 19 de agosto. Santa Elena hasta el 25 de agosto',
    origin: 'https://www.elcomercio.com/actualidad/coe-portoviejo-postergo-apertura-playa.html'
  }, {
    date: '05/08/2020',
    news: 'Portoviejo usa drones y plataformas tecnológicas para controlar el aforo en sitios públicos',
    origin: 'https://www.eluniverso.com/noticias/2020/08/03/nota/7929255/ecuador-reapertura-playas-5-agosto-medidas-anti-covid-19-oro'
  }, {
    date: '13/08/2020',
    news: 'Las instituciones públicas de Azogues cierran sus puertas y se acogen al teletrabajo durante una semana, para evitar un potencial rebrote del COVID-19.',
    origin: 'https://www.elcomercio.com/actualidad/instituciones-publicas-azogues-cerradas-covid.html'
  }, {
    date: '15/08/2020',
    news: ' Rige la prohibición de reuniones sociales, de venta de bebidas alcohólicas y la ampliación del horario del toque de queda para todos los cantones de Carchi, Imbabura, Pichincha, Cotopaxi, Tungurahua, Bolívar, Chimborazo, Cañar, Azuay, Loja, Esmeraldas, Santo Domingo de los Tsáchilas, Sucumbíos, Napo, Orellana, Pastaza, Morona Santiago, Zamora Chinchipe.',
    origin: 'https://www.primicias.ec/noticias/sociedad/restricciones-pichincha-provincias-toque-de-queda/'
  }, {
    date: '21/08/2020',
    news: 'Quito, Latacunga, Ambato, Riobamba y Cuenca se unen para promocionar el corredor turístico Camino de Los Andes, para promover el turismo seguro postpandemia',
    origin: 'https://www.vistazo.com/seccion/actualidad-nacional/camino-de-los-andes-el-primer-corredor-turistico-por-los-andes-que-busca'
  }, {
    date: '23/08/2020',
    news: 'Loja y Cuenca registran incremento en el uso de la bicicleta, monopatines y scooters como transportes alternativos a los buses',
    origin: 'https://www.elcomercio.com/actualidad/escuteres-bicicletas-cuenca-loja-pandemia.html'
  }, {
    date: '24/08/2020',
    news: 'Restaurantes Unidos de Riobamba presentó la campaña Un mes de comida gratis para incentivar el consumo alimenticio en sus restaurantes',
    origin: 'https://www.elcomercio.com/actualidad/restaurantes-comida-gratis-riobamba-emergencia.html'
  }, {
    date: '27/08/2020',
    news: 'Ambato lanza la campaña Un Pacto para Vivir que busca reducir los contagios del COVID-19',
    origin: 'https://www.elcomercio.com/actualidad/municipio-ambato-campana-evitar-coronavirus.html'
  }, {
    date: '31/08/2020',
    news: 'Guayaquil envía brigadas médicas a Latacunga , antes lo hizo a Portoviejo y Quito',
    origin: 'https://www.eluniverso.com/guayaquil/2020/08/30/nota/7960996/personal-sanitario-acude-latacunga'
  }, {
    date: '08/09/2020',
    news: 'Ambato aprueba ordenanza con restricciones para controlar la pandemia',
    origin: 'https://www.lahora.com.ec/tungurahua/noticia/1102327218/municipio-de-ambato-plantea-varias-restricciones-para-enfrentar-la-pandemia'
  }, {
    date: '10/09/2020',
    news: 'Presidente de AME Esmeraldas anuncia que los municipios no pueden funcionar por los atrasos en las transferencias gubernamentales',
    origin: 'https://www.eluniverso.com/noticias/2020/09/10/nota/7972174/alcaldes-esmeraldas-anuncian-marcha-quito-si-gobierno-central-no'
  }, {
    date: '10/09/2020',
    news: 'El Gremio de Maestros, Sastres y Modistas de Carchi entregó 40 mil mascarillas confeccionadas por sus asociados que podrán ser utilizadas por funcionarios de cinco instituciones públicas',
    origin: 'https://www.eltelegrafo.com.ec/noticias/sociedad/6/mascarillas-carchi-instituciones-publicas'
  }, {
    date: '11/09/2020',
    news: 'Santo Domingo retoma las ferias artesanales presenciales para reactivar la economía local',
    origin: 'https://lahora.com.ec/santodomingo/noticia/1102327453/vuelven-ferias-artesanales-presenciales-'
  }, {
    date: '13/09/2020',
    news: 'A partir de esta fecha termina el estado de excepción por el COVID-19 a nivel nacional. Los GAD que tienen competencia de tránsito, se encargarán de regular la movilización de la ciudadanía en transporte público y vehículos particulares',
    origin: 'https://www.eluniverso.com/guayaquil/2020/09/11/nota/7973407/asi-sera-movilizacion-guayaquil-samborondon-daule-duran-partir-14. '
  }, {
    date: '14/09/2020',
    news: 'Guayaquil, Cuenca, Azogues, Loja y Morona anunciaron que mantendrán durante septiembre la restricción de circulación vehicular por el último dígito de la placa, par e impar',
    origin: 'https://www.elcomercio.com/actualidad/movilidad-coe-vehiculos-emergencia-coronavirus.html. '
  },]





  constructor(private translateService: TranslateService) {

    this.updateDemo = false;
    this.highcharts = Highcharts;
    TimeLine(this.highcharts);

  }

  ngOnInit() {
    this.translate();

  }


  createTimeLine() {

    let news = this.timeLine;

    this.chartOptions = {

      chart: {
        type: 'timeline',
        inverted: false,
        scrollablePlotArea: {
          minWidth: 10000,
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
        text: this.title,
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
          fontSize: '30px',
        }
      },

      subtitle: {
        text: this.subtitle,
        style: {
          color: '#243554',
          fontWeight: 'bold',
          font: 'Roboto, sans-serif',
          fontSize: '15px'
        }
      },

      exporting: {
        filename: `LineaTiempo`,
        buttons: {
          contextButton: {
            enabled: true,
            menuItems: [
              {
                text: 'Descargar CSV', onclick() {
                  exportTimeLineCSV(news);
                }
              },
              {
                text: 'Descargar XLSX', onclick() {
                  exportTimeLineXLSX(news);
                }
              },
            ]
          }
        },
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
          name: ' <strong style="position: absolute; top:118px;left:10px;">12 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-7px;right:-25px;"><img src = "assets/covid/marzo/10.png" width="60px" height="60px " /></div><p style="max-width:500px;position: absolute;left: 10px; top:57px;">Declaración de emergencia </br> sanitaria en el sistema </br> nacional de salud pública</p> </br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.salud.gob.ec/wp-content/uploads/2020/03/SRO160_2020_03_12.pdf" target="_blank">[Fuente]</a>',
          description: '<p>Declaración de emergencia sanitaria en el sistema nacional de salud pública,Guayaquil y Santa Elena son las primeras ciudades en declararse en emergencia.</p>'
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">16-17 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px"><img src = "assets/covid/marzo/9.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">El 50% de las </br>  municipalidades de las ciudades intermedias </br> de Ecuador se declara en emergenia</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "El 50% de las municipalidades de las ciudades intermedias de Ecuador se declara en emergenia."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">17 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Se declara en emergencia </br> en todo el territorio </br> ecuatoriano.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.primicias.ec/noticias/sociedad/ecuador-declara-emergencia-sanitaria-por-propagacion-del-coronavirus/" target="_blank">[Fuente]</a>',
          description: "Se declara en emergencia en todo el territorio ecuatoriano."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">20 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px"><img src = "assets/covid/marzo/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Las municipalidades </br> realizan tareas de </br> desinfección de espacios públicos..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.diariocorreo.com.ec/40321/ciudad/municipalidad-de-machala-desinfecta-hospital-y-centros-de-salud-de-la-ciudad" target="_blank">[Fuente]</a>',
          description: "Las municipalidades realizan tareas de desinfección de espacios públicos usando productos como amonio."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">23 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Se realizan controles </br> para acceso a mercados.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.primicias.ec/noticias/lo-ultimo/mercados-quito-coronavirus-cedula/" target="_blank">[Fuente]</a>',
          description: "Se realizan controles para acceso a mercados. Algunos municipios establecen horarios de ingresos por número de cédula."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">26 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Las municipalidades </br> reprograman sus deudas, </br> hasta por 90 días  con la banca pública.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "Las municipalidades reprograman sus deudas, hasta por 90 días con la banca pública."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">27 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Se organizan campañas </br> para  donación de alimentos </br> y mascarillas.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="" target="_blank">[Fuente]</a>',
          description: "Se organizan campañas para donación de alimentos y mascarillas."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">28 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">AME anuncia que 8 </br> alcaldes del país dieron </br> positivo al virus.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/03/28/nota/7798026/alcaldes-coronavirus-guayas-otras-ciudades?hootPostID=791ecf60af386d813619dd190d0358c1" target="_blank">[Fuente]</a>',
          description: "AME anuncia que 8 alcaldes del país dieron positivo al virus."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE MARZO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/marzo/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">No existe capacidad instalada en las ciudades </br> para realizar cremaciones  de cadáveres de las </br> víctimas del Covid-19.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eluniverso.com/noticias/2020/03/30/nota/7798989/crematorios-no-se-dan-abasto-guayaquil" target="_blank">[Fuente]</a>',
          description: "No existe capacidad instalada en las ciudades para realizar cremaciones de cadáveres de las víctimas del Covid-19."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">31 DE MARZO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/marzo/11.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">AME anuncia que 8 </br> alcaldes del país dieron </br> positivo al virus.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "AME anuncia que 8 alcaldes del país dieron positivo al virus."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">3 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Guayaquil se vuelve </br> el centro de la pandemia.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.bbc.com/mundo/noticias-america-latina-52116100" target="_blank">[Fuente]</a>',
          description: "Guayaquil se vuelve el centro de la pandemia. Ciudades como Quevedo cierran los mercados durante el fin de semana."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">4 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/2.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Milagro solicita al </br> COE Nacional ampliar </br> el toque de queda por  incrementos de casos</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "Quito anuncia el cierre de mercados en Calderón debido a la proliferación del virus en ese sector de la ciudad. Milagro solicita al COE Nacional ampliar el toque de queda por incrementos de casos."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">6 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Coe Nacional solicita </br> a las municipalidades regular </br> el uso de mascarilla.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.expreso.ec/actualidad/coronavirus-municipios-deberan-exigir-mascarillas-8664.html" target="_blank">[Fuente]</a>',
          description: "Coe Nacional solicita a las municipalidades regular el uso de mascarilla."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">8 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Riobamba y Santo Domingo </br>  son las primeras ciudades capitales </br>  en aprobar ordenanzas..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://elespectadorchimborazo.com/ordenanza-establece-uso-obligatorio-de-mascarilla-en-espacios-publicos-de-riobamba/" target="_blank">[Fuente]</a>',
          description: "Riobamba y Santo Domingo son las primeras ciudades capitales en aprobar ordenanzas para regular el uso de mascarilla."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">9 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Se registran anglomeraciones y disturbios </br> en mercados  mayoristas </br> de Loja y Ambato.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.diariocorreo.com.ec/40848/ciudad/con-cerco-de-seguridad-cabildo-controla-que-los-vendedores-no-vuelvan-a-las-calles" target="_blank">[Fuente]</a>',
          description: "Se registran anglomeraciones y disturbios en mercados mayoristas de Loja y Ambato."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">10 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;cursor: pointer;"><img src = "assets/covid/abril/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">COE Nacional restringe </br> el uso de amonio </br> para desinfección de espacio públicos.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://amchamgye.org.ec/agye/wp-content/uploads/Resoluciones-COE-Nacional-10-de-abril-2020-1.pdf" target="_blank">[Fuente]</a>',
          description: "COE Nacional restringe el uso de amonio para desinfección de espacio públicos. "
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">13 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Guayaquil empieza una campaña para </br>  realizar pruebas  rápidas </br> en forma aleatoria..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.primicias.ec/noticias/lo-ultimo/pruebas-rapidas-coronavirus-puerta-puerta-manana-guayaquil/" target="_blank">[Fuente]</a>',
          description: "Guayaquil empieza una campaña para realizar pruebas rápidas en forma aleatoria en todo el cantón."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">20 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Municipios como el de Quito, </br> Ibarra, anuncian la realización </br> de pruebas PCR para el Covid.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/ibarra-pruebas-covid19-cerco-epidemiologico.html" target="_blank">[Fuente]</a>',
          description: "Municipios como el de Quito, Ibarra, anuncian la realización de pruebas PCR para el Covid."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">26 DE ABRIL</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/abril/9.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">El Gobierno anuncia el </br> paso del aislamiento al </br> distanciamiento social.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eluniverso.com/noticias/2020/04/24/nota/7822044/ecuador-pasara-partir-4-mayo-aislamiento-distanciamiento-social" target="_blank">[Fuente]</a>',
          description: "El Gobierno anuncia el paso del aislamiento al distanciamiento social. Cada COE cantonal decidirá su sistema de semaforización."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">29 DE ABRIL</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/abril/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Alcaldes del país, </br> a través de AME, deciden mantener </br> sus semáforos en rojo hasta el 17 de mayo.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/04/29/nota/7826946/ame-solicita-mantener-semaforo-rojo-hasta-17-mayo" target="_blank">[Fuente]</a>',
          description: "Alcaldes del país, a través de AME, deciden mantener sus semáforos en rojo hasta el 17 de mayo."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">1 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Alcaldes empiezan a recibir estadísticas de </br> contagios  en sus cantones </br> por parte del MSP.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/alcaldes-datos-coronavirus-contagio-coe.html" target="_blank">[Fuente]</a>',
          description: "Alcaldes empiezan a recibir estadísticas de contagios en sus cantones por parte del MSP."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/2.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">115 funcionarios </br> municipales fallecidos   y 19 alcaldes </br> contagiados por COVID-19..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/05/02/nota/7830372/115-funcionarios-municipales-fallecidos-18-alcaldes-contagiados" target="_blank">[Fuente]</a>',
          description: "115 funcionarios municipales fallecidos y 19 alcaldes contagiados por COVID-19 a nivel nacional, según AME."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">4 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">El país empieza a </br> volver gradualmente a </br> una nueva normalidad.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/consejos-prevencion-covid19-salida-casa.html" target="_blank">[Fuente]</a>',
          description: "El país empieza a volver gradualmente a una nueva normalidad."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">7 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">El Presidente de la</br>  República hace un llamado </br>  a los alcaldes a cambiar  de color de semáforos..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/moreno-alcades-economia-coronavirus-ecuador.html" target="_blank">[Fuente]</a>',
          description: "El Presidente de la República hace un llamado a los alcaldes a cambiar de color de semáforos para reactivar la economía."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">12 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">50 cantones anuncia </br>que pasarán de </br> rojo a amarillo.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.aeade.net/estado-de-la-semaforizacion-local/" target="_blank">[Fuente]</a>',
          description: "50 cantones anuncia que pasarán de rojo a amarillo."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">15 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Babahoyo investiga 15 </br> posibles contagios por </br> celebrar el Día de la Madre.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/babahoyo-investiga-contagio-familia-coronavirus.html" target="_blank">[Fuente]</a>',
          description: "Babahoyo investiga 15 posibles contagios por celebrar el Día de la Madre."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">20 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/7.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Guayaquil cambia a semáforo amarillo, </br> con menores restricciones de </br> movilidad.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/guayaquil-semaforo-amarillo-confinamiento-coronavirus.html" target="_blank">[Fuente]</a>',
          description: "Guayaquil cambia a semáforo amarillo, con menores restricciones de movilidad."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">24 DE MAYO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/mayo/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Aguarico es el único </br> cantón de Ecuador </br> con semáforo en verde.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/05/23/nota/7850337/este-domingo-24-mayo-solo-aguarico-semaforo-verde-se-permite" target="_blank">[Fuente]</a>',
          description: "Aguarico es el único cantón de Ecuador con semáforo en verde."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">27 DE MAYO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/mayo/9.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">COE nacional modifica </br> las restricciones de </br> la semaforización.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eluniverso.com/noticias/2020/05/27/nota/7853670/coe-n-modifica-reglas-tres-semaforos-1-junio" target="_blank">[Fuente]</a>',
          description: "COE nacional modifica las restricciones de la semaforización."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">1 DE JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Fiscalía anuncia creación </br> de unidad especial para investigaciones </br> por contrataciones de emergencia en municipios.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.sandiegouniontribune.com/en-espanol/noticias/story/2020-06-01/fiscalia-de-ecuador-crea-equipo-anticorrupcion-en-pandemia" target="_blank">[Fuente]</a>',
          description: "Ecuador empieza una nueva etapa de desconfinamiento con flexibilización en los semáforos epidemiológicos para fomentar la producción, 32% de los cantones se encuentran en amarillo. Fiscalía anuncia creación de unidad especial para investigaciones por contrataciones de emergencia en municipios."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">2 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/2.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Daule es el segundo </br> cantón en cambiar </br> su semáforo a verde.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eltelegrafo.com.ec/noticias/politica/3/moreno-alcalde-daule-cambio-semaforo" target="_blank">[Fuente]</a>',
          description: "Daule es el segundo cantón en cambiar su semáforo a verde."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Quito cambia sus </br> regulaciones pasando de </br> semáforo rojo a amarillo.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "Quito cambia sus regulaciones pasando de semáforo rojo a amarillo."
        }, {
          name: ' <strong style="position: absolute; top:118px;left:10px;">12 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/4.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">El 60% de los cantones </br> del país cambian su </br> semáforo a amarillo.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://as.com/diarioas/2020/06/09/actualidad/1591719948_494148.html" target="_blank">[Fuente]</a>',
          description: "El 60% de los cantones del país cambian su semáforo a amarillo."
        }, {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">27 DE JUNIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/junio/5.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">"El alcade de </br> Quito  anuncia que los </br> servicios sanitarios "Ya no dan más"..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="http://www.pichinchacomunicaciones.com.ec/yunda-asegura-que-los-servicios-sanitarios-en-quito-ya-no-dan-mas/" target="_blank">[Fuente]</a>',
          description: "El alcade de Quito anuncia que los servicios sanitarios 'Ya no dan más' y pide al COE Nacional ampliar el horario de toque de queda e implementar la ley seca."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">29 DE JUNIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/junio/6.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">El COE Nacional autoriza </br> a que los funcionarios públicos </br> de la administración..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="http://www.pichinchacomunicaciones.com.ec/servidores-publicos-aun-no-retomaran-el-trabajo-presencial-en-quito-segun-disposicion-del-coe/" target="_blank">[Fuente]</a>',
          description: "El COE Nacional autoriza a que los funcionarios públicos de la administración central de gobierno regresen a trabajar de forma presencial."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">3 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/3.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Milagro reinicia circulación </br> de buses de transporte </br> urbano con el 50% del aforo.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.facebook.com/AlcaldiaDeMilagro/photos/a.337046780324460/555367568492379/?type=3&theater" target="_blank">[Fuente]</a>',
          description: "Milagro reinicia circulación de buses de transporte urbano con el 50% del aforo."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">10 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Manta promociona </br> estrategia de turismo </br> bioseguro.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="" target="_blank">[Fuente]</a>',
          description: "Manta promociona estrategia de turismo bioseguro."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">12 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/12.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Alcalde de Ambato </br> da positivo para </br> Covid-19.</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/alcalde-ambato-altamirano-contagiado-covid.html" target="_blank">[Fuente]</a>',
          description: "Alcalde de Ambato da positivo para Covid-19."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">15 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/15.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Alcaldesa de Ibarra </br> da positivo para </br> Covid-19.</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/alcaldes-sierra-norte-ecuador-coronavirus.html" target="_blank">[Fuente]</a>',
          description: "Alcaldesa de Ibarra da positivo para Covid-19."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">18 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/18.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Alcaldes de Lago Agrio </br> y Francisco de Orellana </br> coordinan..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="" target="_blank">[Fuente]</a>',
          description: "Alcaldes de Lago Agrio y Francisco de Orellana coordinan para gestionar mancomunadamente medicina al gobierno de Rusia."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">23 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/23.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Quito se convierte </br> en la ciudad con </br> mayor número..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://ww2.elmercurio.com.ec/2020/07/23/quito-se-convierte-en-la-ciudad-mas-contagiada-por-coronavirus-en-ecuador/" target="_blank">[Fuente]</a>',
          description: "Quito se convierte en la ciudad con mayor número de personas contagiadas en Ecuador."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">24 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/24.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Latacunga </br>  organiza datathón para </br> medir la cantidad  de aire..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/07/27/nota/7920885/alcalde-pastaza-confirmo-que-dio-positivo-covid-19" target="_blank">[Fuente]</a>',
          description: "Latacunga organiza datathón para medir la cantidad de aire en los espacios públicos."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">25 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/25.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">COE de Esmeraldas, Cuenca, Tulcán </br> y Portoviejo  solicitan al COE nacional </br> ampliar los toques..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://esmeraldas.gob.ec/dircom/noticias/item/1255-coe-cantonal-insiste-ante-coe-nacional-dote-de-insumos-para-tratamiento-del-covid?fbclid=IwAR2Fx2xIltSJYQ0Pa488IeoX_y5ePoOTjhTnwaT1WlR9ZJfLakKNqJ5SrOI" target="_blank">[Fuente]</a>',
          description: "COE de Esmeraldas, Cuenca, Tulcán y Portoviejo solicitan al COE nacional ampliar los toques de queda, restringir el consumo de alcohol, prohibir reuniones de más de 25 personas y dotar de insumos a hospitales públicos"
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">27 DE JULIO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/julio/27.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">El alcade de  </br> Pastaza,  Oswaldo Zúñiga, </br> informó que dio positivo..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/07/27/nota/7920885/alcalde-pastaza-confirmo-que-dio-positivo-covid-19" target="_blank">[Fuente]</a>',
          description: "El alcade de Pastaza, Oswaldo Zúñiga, informó que dio positivo para COVID-19."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">31 DE JULIO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/julio/31.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">A partir del </br> 31 de julio </br> rige ley seca..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/refuerzo-controles-licor-emergencia-sanitaria.html" target="_blank">[Fuente]</a>',
          description: "A partir del 31 de julio rige ley seca durante los fines de semana y ampliación del toque de queda de 19:00 a 05:00, de viernes a domingo para 18 provincias del país, por disposición del COE Nacional"
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">1 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/1-ago-a.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">La alcaldesa de Guayaquil </br> reaccionó en torno al </br> anuncio de la ministra de educación..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/guayaquil/2020/08/01/nota/7926000/clases-casa-todo-2020-pide-viteri-halla-apoyo-medicos-coe-nacional" target="_blank">[Fuente]</a>',
          description: "La alcaldesa de Guayaquil reaccionó en torno al anuncio de la ministra de educación Monserrat Creamer sobre un operativo para el regreso a clases presenciales."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">1 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/1-ago-c.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">40.000 mascarillas antifluídos </br> serán confeccionadas </br>localmente en Tulcán</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/sastres-tulcan-produccion-mascarillas-covid19.html" target="_blank">[Fuente]</a>',
          description: "40.000 mascarillas antifluídos serán confeccionadas localmente en Tulcán con la participación de la Asociación de Sastres del cantón. El proyecto cuenta con el financiamiento de la Embajada de Australia en Perú y la coordinación del GAD municipal."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">1 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/1-ago-a.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Cerca de 3.000 comercios </br> han cerrado en Loja, según el presidente </br> de la Cámara de Comercio..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://cronica.com.ec/2020/07/03/3000-comercios-cerraron-en-loja/" target="_blank">[Fuente]</a>',
          description: "Cerca de 3.000 comercios han cerrado en Loja, según el presidente de la Cámara de Comercio de esa ciudad."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">4 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/4-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Se abren 40 playas </br> como medida de promoción </br> del turismo interno. </p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/coe-portoviejo-postergo-apertura-playa.html" target="_blank">[Fuente]</a>',
          description: "Se abren 40 playas como medida de promoción del turismo interno. Portoviejo y Manta deciden mantener cerradas sus playas hasta el 19 de agosto. Santa Elena hasta el 25 de agosto."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">5 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/5-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Portoviejo usa drones </br> y plataformas tecnológicas para </br> controlar el aforo  en sitios públicos</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/noticias/2020/08/03/nota/7929255/ecuador-reapertura-playas-5-agosto-medidas-anti-covid-19-oro" target="_blank">[Fuente]</a>',
          description: "Portoviejo usa drones y plataformas tecnológicas para controlar el aforo en sitios públicos."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">13 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/13-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Las instituciones públicas </br> de Azogues cierran </br> sus puertas..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/instituciones-publicas-azogues-cerradas-covid.html" target="_blank">[Fuente]</a>',
          description: "Las instituciones públicas de Azogues cierran sus puertas y se acogen al teletrabajo durante una semana, para evitar un potencial rebrote del COVID-19."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">15 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/15-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Rige la prohibición </br>  de reuniones sociales,</br>  de venta de bebidas alcohólicas..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.primicias.ec/noticias/sociedad/restricciones-pichincha-provincias-toque-de-queda/" target="_blank">[Fuente]</a>',
          description: "Rige la prohibición de reuniones sociales, de venta de bebidas alcohólicas y la ampliación del horario del toque de queda para todos los cantones de Carchi, Imbabura, Pichincha, Cotopaxi, Tungurahua, Bolívar, Chimborazo, Cañar, Azuay, Loja, Esmeraldas, Santo Domingo de los Tsáchilas, Sucumbíos, Napo, Orellana, Pastaza, Morona Santiago, Zamora Chinchipe."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">21 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/21-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Quito, Latacunga, Ambato, </br> Riobamba y Cuenca </br> se unen para promocionar</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.vistazo.com/seccion/actualidad-nacional/camino-de-los-andes-el-primer-corredor-turistico-por-los-andes-que-busca" target="_blank">[Fuente]</a>',
          description: "Quito, Latacunga, Ambato, Riobamba y Cuenca se unen para promocionar el corredor turístico Camino de Los Andes, para promover el turismo seguro postpandemia."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">23 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/23-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Loja y Cuenca </br> registran incremento en  </br> el uso de la bicicleta,..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/escuteres-bicicletas-cuenca-loja-pandemia.html" target="_blank">[Fuente]</a>',
          description: "Loja y Cuenca registran incremento en el uso de la bicicleta, monopatines y scooters como transportes alternativos a los buses"
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">24 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/24-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Restaurantes Unidos  </br> de Riobamba presentó..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/restaurantes-comida-gratis-riobamba-emergencia.html" target="_blank">[Fuente]</a>',
          description: "Restaurantes Unidos de Riobamba presentó la campaña Un mes de comida gratis para incentivar el consumo alimenticio en sus restaurantes."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">27 DE AGOSTO</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/agosto/27-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Ambato lanza la campaña </br> Un Pacto para Vivir </br> que busca reducir..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.elcomercio.com/actualidad/municipio-ambato-campana-evitar-coronavirus.html" target="_blank">[Fuente]</a>',
          description: "Ambato lanza la campaña Un Pacto para Vivir que busca reducir los contagios del COVID-19."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">31 DE AGOSTO</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/agosto/31-ago.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Guayaquil envía brigadas médicas  </br> a Latacunga, antes lo hizo </br> a Portoviejo y Quito</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eluniverso.com/guayaquil/2020/08/30/nota/7960996/personal-sanitario-acude-latacunga" target="_blank">[Fuente]</a>',
          description: "Guayaquil envía brigadas médicas a Latacunga , antes lo hizo a Portoviejo y Quito."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">8 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/septiembre/8.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">Ambato aprueba ordenanza </br> con restricciones para </br> controlar la pandemia</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.lahora.com.ec/tungurahua/noticia/1102327218/municipio-de-ambato-plantea-varias-restricciones-para-enfrentar-la-pandemia" target="_blank">[Fuente]</a>',
          description: "Ambato aprueba ordenanza con restricciones para controlar la pandemia."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">10 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/septiembre/10.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Presidente de AME Esmeraldas </br> anuncia que los municipios..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://www.eluniverso.com/noticias/2020/09/10/nota/7972174/alcaldes-esmeraldas-anuncian-marcha-quito-si-gobierno-central-no" target="_blank">[Fuente]</a>',
          description: "Presidente de AME Esmeraldas anuncia que los municipios no pueden funcionar por los atrasos en las transferencias gubernamentales."
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">10 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/septiembre/10-1.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">El Gremio de Maestros, </br>  Sastres y Modistas de </br>  Carchi entregó 40 mil mascarillas..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eltelegrafo.com.ec/noticias/sociedad/6/mascarillas-carchi-instituciones-publicas" target="_blank">[Fuente]</a>',
          description: "El Gremio de Maestros, Sastres y Modistas de Carchi entregó 40 mil mascarillas confeccionadas por sus asociados que podrán ser utilizadas por funcionarios de cinco instituciones públicas."
        },
        {
          name: ' <strong style="position: absolute; top:118px;left:10px;">11 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; bottom:-8px;right:-25px;"><img src = "assets/covid/septiembre/11.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; top:57px;">Santo Domingo retoma </br> las ferias artesanales..</p></br><a style="max-width:500px;position: absolute;left: 10px; top:38px;" href="https://lahora.com.ec/santodomingo/noticia/1102327453/vuelven-ferias-artesanales-presenciales-" target="_blank">[Fuente]</a>',
          description: "Santo Domingo retoma las ferias artesanales presenciales para reactivar la economía local"
        },
        {
          name: ' <strong style="position: absolute; bottom:118px;left:10px;">13 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; top:-8px;right:-25px;"><img src = "assets/covid/septiembre/13.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute;left: 10px; bottom:40px;">A partir de esta </br>fecha termina el estado..</p></br><a style="max-width:500px;position: absolute;left: 10px; bottom:40px;" href="https://www.eluniverso.com/guayaquil/2020/09/11/nota/7973407/asi-sera-movilizacion-guayaquil-samborondon-daule-duran-partir-14" target="_blank">[Fuente]</a>',
          description: "A partir de esta fecha termina el estado de excepción por el COVID-19 a nivel nacional. Los GAD que tienen competencia de tránsito, se encargarán de regular la movilización de la ciudadanía en transporte público y vehículos particulares. "
        },
        {
          name: ' <strong style="position: absolute; top:118px; right:10px;">14 DE SEPTIEMBRE</strong>',
          label: '<div style="position: absolute; bottom:-8px; right:-25px;"><img src = "assets/covid/septiembre/14.png" width="60px" height="60px " /></div> <p style="max-width:500px;position: absolute; right: 10px; top:57px;">Guayaquil, Cuenca, </br>  Azogues, Loja y Morona..</p></br><a style="max-width:500px;position: absolute;right: 10px; top:38px;" href="https://www.elcomercio.com/actualidad/movilidad-coe-vehiculos-emergencia-coronavirus.html" target="_blank">[Fuente]</a>',
          description: "Guayaquil, Cuenca, Azogues, Loja y Morona anunciaron que mantendrán durante septiembre la restricción de circulación vehicular por el último dígito de la placa, par e impar"
        }]
      }]
    };
    this.updateDemo = true;

  }


  translate() {

    this.translateService.stream(['covid_milestones', 'timeline']).subscribe(values => {


      Object.keys(values).forEach((key) => {

        if (key === 'covid_milestones') {
          this.title = values[key]
        }

        if (key === 'timeline') {
          this.subtitle = values[key]
        }
      });
      this.createTimeLine();

    });

  }

}
