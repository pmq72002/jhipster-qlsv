import { Routes } from '@angular/router';
import { StudentList } from './main-menu/studentList/studentList';
import { StudentInfo } from './main-menu/studentInfo/studentInfo';
import HomeComponent from './home/home.component';
import { LoginComponent } from './login/login';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'studentList',
    component: StudentList,
  },
  {
    path: 'studentInfo/:stuCode',
    component: StudentInfo,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

export default routes;
