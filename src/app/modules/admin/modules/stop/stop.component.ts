import { Component, OnInit } from '@angular/core';
import { TagService } from 'src/app/core/services/tag.service';
import { map } from 'rxjs/operators';
import { Word } from '../../../../core/models/word.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss']
})
export class StopComponent implements OnInit {

  stopWords: any;
  word: Word;
  wordSelected: Word;
  listWords: Word[];
  listWordServer: any[];
  newWord: boolean;
  cols: any;
  first = 0;
  rows = 10;
  displayDialog: boolean;
  submitted: boolean;
  listStopWordsId: string;
  typeNotifier: string;

  private readonly notifier: NotifierService;
  constructor(
    private tagService: TagService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.cols = [
      { field: 'word', header: 'text' },
      { field: 'action', header: 'actions' }

    ];
    this.getStopwords();

  }

  getStopwords() {

    this.listWords = [];
    this.tagService
      .getStopwords()
      .pipe(
        map((resp) => {
          return resp;
        })
      )
      .subscribe((resp: any) => {

        const { data } = resp;
        if (resp.data.length > 0) {
          this.stopWords = resp.data[0].stopwords;
          this.listStopWordsId = resp.data[0]._id;
        }
        for (let i = 0; i < resp.data[0].stopwords.length; i++) {

          this.listWords.push({
            id: `${this.createId()}`,
            word: this.stopWords[i]
          });


        }

      });
  }


  editWord(word: Word) {
    this.word = { ...word };
    this.displayDialog = true;
    this.typeNotifier = 'success';
  }


  saveWord() {

    if (this.word.id) {
      let word = {
        id: this.word.id,
        word: this.word.word.toUpperCase()
      };
      this.listWords[this.findIndexById(this.word.id)] = word;
    } else {
      this.listWords.push(
        {
          id: `${this.createId()}`,
          word: this.word.word.toUpperCase()
        }
      );

    }

    this.listWords = [...this.listWords];
    this.displayDialog = false;
    this.word = {
      id: '',
      word: ''
    };
    this.saveServer();


  }


  hideDialog() {
    this.displayDialog = false;
  }

  addWord() {
    this.word = {
      id: '',
      word: ''
    };
    this.displayDialog = true;
    this.typeNotifier = 'success';


  }


  deleteWord(word: Word) {
    this.word = word;
    this.typeNotifier = 'error';
    $('#confirmModal').modal('show');
  }

  onDelete() {
    this.listWords = this.listWords.filter(word => word.id !== this.word.id);
    //this.word = {};
    this.saveServer();
    $('#confirmModal').modal('hide');
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listWords.length; i++) {
      if (this.listWords[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }


  saveServer() {

    this.listWordServer = [];

    this.listWords.forEach(word => {

      this.listWordServer.push(word.word);

    });

    this.tagService.updateStopwords(this.listWordServer, this.listStopWordsId).subscribe(resp => {

      this.notifier.notify(this.typeNotifier, 'Lista de palabras prohibidas actualizadas correctamente.');

    });

  }


}
