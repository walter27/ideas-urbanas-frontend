import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ides-authors',
  templateUrl: './ides-authors.component.html',
  styleUrls: ['./ides-authors.component.scss']
})
export class IdesAuthorsComponent implements OnInit {

  listAuthors: any[];
  responsiveOptions: any[];

  constructor() {


    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.listAuthors = [
      {

        image: 'assets/authors/gisela.png',
        name: 'Gisela Montalvo',
        work: 'Directora de la Escuela de Gobierno IDE-Universidad de Los Hemisferios',
        description: 'Gisela es Licenciada en Ciencias Políticas y Relaciones Internacionales, Diplomada en Comunicación Política y Máster en Políticas Públicas. Ha llevado a cabo 2 cursos de formación especializa en el IDE Business School: Programa Gobernanza y Liderazgo Político y Programa de Formación de Mujeres para Gobierno Corporativo y Alta Dirección. Durante varios años, trabajó en el sector público de Ecuador. Fue funcionaria de la Embajada de Ecuador en Estados Unidos, asesora en el Ministerio Coordinador de la Producción Empleo y Competitividad, y Directora de Comunicación Nacional y de Relaciones Internacionales en el Registro Civil del Ecuador. Además, fue directora de la Corporación Líderes para Gobernar.'


      },
      {

        image: 'assets/authors/vanessa.png',
        name: 'Vanessa Rodríguez',
        work: 'Directora del Laboratorio de Ideas Urbanas',
        description: 'Vanessa es Licenciada en Periodismo por la Universidad Vicente Rocafuerte de Guayaquil, Maestra en Políticas Públicas por Flacso-Ecuador y Máster en Gestión y Desarrollo Urbano por la Universidad Erasmus de Rotterdam-Países Bajos. Tiene más de quince años de experiencia en diseño, implementación y seguimiento de proyectos de desarrollo local en organismos internacionales, organizaciones de sociedad civil, gobierno central y gobiernos subnacionales.  Sus principales temas de interés son la gestión urbana, el fortalecimiento de las capacidades locales, la gestión del conocimiento, las finanzas subnacionales y la articulación multinivel. Ha sido docente en la UTPL, UASB y de la Escuela de Gobierno IDE-Universidad de Los Hemisferios.'


      },
      {

        image: 'assets/authors/erick.png',
        name: 'Erick Cuenca',
        work: 'Investigador en gestión y visualización de datos',
        description: 'Erick tiene un Ph.D. en Ciencias de la Computación de la Universidad de Montpellier y ha realizado un Postdoctorado en la Universidad UCLouvain, Bélgica. Se interesa principalmente en el análisis visual de los datos dinámicos presentes en las series temporales, así como también los datos complejos que pueden ser modelados en grafos. Actualmente, Erick propone varios enfoques basados en técnicas de Visualización de Información y Data-Mining para comprender los aspectos temporales y espaciales de los datos. Es investigador de la Escuela de Matemáticas de la Universidad Yachay Tech.'


      },
      {

        image: 'assets/authors/wendy.png',
        name: 'Wendy Chávez',
        work: 'Investigadora en análisis multivariable',
        description: 'Wendy es economista de la Escuela Superior Politécnica del Litoral. Tiene una Maestría en Administración Pública del John Jay College of Criminal Justice de New York, y una Maestría en Asentamientos Humanos de la Katholieke Universiteit de Leuven en Bélgica. Conoce de cerca a los gobiernos municipales pues ha sido funcionaria en varios de ellos y además les ha brindado asistencia técnica desde entidades como el Banco de Desarrollo de Ecuador. Es fundadora del Observatorio de Políticas Públicas de Guayaquil, al cual representa en el Hub de Ordenamiento Territorial y Planes de Uso y Gestión del Suelo del Ministerio de Desarrollo Urbano y Vivienda. Realiza trabajo voluntario con comunidades del Golfo de Guayaquil a las que brinda asistencia técnica sobre el manejo sostenible de sus territorios.'


      },
      {

        image: 'assets/authors/isabel.png',
        name: 'Isabella López Barreto',
        work: 'Comunicadora',
        description: 'Isabella es Licenciada en Comunicación por la Universidad de Los Hemisferios. Es especialista en las áreas de marketing digital, estrategia de comunicación, comunicación corporativa y diseño creativo. Además tiene competencias en investigación aplicada, periodismo y producción de contenido audiovisual. Actualmente, es la encargada del Área de Comunicación y Marketing de la Escuela de Gobierno IDE-Universidad de Los Hemisferios.'


      },
    ]


  }

  ngOnInit() {
  }

}
