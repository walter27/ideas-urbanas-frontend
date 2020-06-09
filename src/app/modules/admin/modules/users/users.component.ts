import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/core/models/filters.model';
import { Observable } from 'rxjs';
import { ResultList } from 'src/app/core/models/resultList.model';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { FieldsForm } from 'src/app/core/models/fileldsForm.model';
import { map } from 'rxjs/operators';
declare var $: any;
import * as jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  filters: Filters = {
    page: 0,
    limit: 10,
    ascending: true,
    sort: 'email'
  };
  result$: Observable<ResultList<User>>;
  columns = [
    { name: 'email', prop: 'email' },
    { name: 'name', prop: 'name' },
    { name: 'last_name', prop: 'last_name' }
  ];
  fields: FieldsForm[] = [
    {
      label: 'name',
      type: 'text',
      id: 'name',
      formControlName: 'name',
      required: true
    },
    {
      label: 'last_name',
      type: 'text',
      id: 'last_name',
      formControlName: 'last_name',
      required: false
    },
    {
      label: 'email',
      type: 'email',
      id: 'email',
      formControlName: 'email',
      required: true
    },
    {
      label: 'password',
      type: 'password',
      id: 'password',
      formControlName: 'password',
      required: true
    }
  ];

  // Forms
  addEditForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl(''),
    password: new FormControl('', [Validators.required])
  });

  private readonly notifier: NotifierService;

  constructor(
    private userService: UserService,
    notifierService: NotifierService,
    private authService: AuthService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    
    this.listUsers();
  }

  listUsers() {
    this.result$ = this.userService.listUsers(this.filters);
    // const emailUser = jwt_decode(sessionStorage.getItem('token')).user.email;
    // this.result$ = this.userService.listUsers(this.filters).pipe(
    //   map(resp => {
    //     resp.data.forEach(u => {
    //       if (u.email !== emailUser) {
    //         u.hideDelete = false;
    //       }
    //     });
    //     return resp;
    //   })
    // );
  }

  onSubmit(event) {
    if (this.addEditForm.valid) {
      if (event.action === 'add') {
        this.userService.addUser(this.addEditForm.value).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', 'Usuario adicionado correctamente');
          this.listUsers();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando adicionar al usuario.');
        });
      } else {
        this.userService.editUser(this.addEditForm.value, event.id).subscribe(data => {
          this.addEditForm.reset();
          this.filters.page = 0;
          this.notifier.notify('success', 'Usuario actualizado correctamente');
          this.listUsers();
        }, err => {
          this.notifier.notify('error', 'Ha ocurrido un error intentando actualizar al usuario.');
        });
      }
    }
  }

  onDelete(id) {
    const idUser = jwt_decode(sessionStorage.getItem('token')).user.id;
    this.userService.deleteUser(id).subscribe(data => {
      this.notifier.notify('success', 'Usuario eliminado correctamente');
      if (idUser == id) {
        this.authService.logout();
      }
      else {
        this.filters.page = 0;
        this.listUsers();
      }
    }, err => {
      this.notifier.notify('error', 'Ha ocurrido un error intentando eliminar el usuario.');
    });
  }

  onChangePage(page) {
    this.filters.page = page;
    this.listUsers();
  }

}
