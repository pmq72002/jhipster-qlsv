import { Routes } from '@angular/router';
import { StudentList } from './main-menu/studentList/studentList';
import { StudentInfo } from './main-menu/studentInfo/studentInfo';
import { LoginComponent } from './login/login';
import HomeComponent from './home/home';
import AuthLayoutComponent from './layout/authLayout/auth-layout.component';
import MainLayoutComponent from './layout/mainLayout/main-layout.component';
import { StudentCreateComponent } from './main-menu/studentCreate/studentCreat';
import { StudentSubject } from './main-menu/studentSubject/studentSubject';
import { StudentResult } from './main-menu/studentResult/studentResult';
import { StudentScore } from './main-menu/studentScore/studentScore';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'create',
        component: StudentCreateComponent,
      },
      {
        path: ':stuCode/subject',
        component: StudentSubject,
      },
      {
        path: ':stuCode/score',
        component: StudentScore,
      },
      {
        path: ':stuCode/result',
        component: StudentResult,
      },
    ],
  },
];

export default routes;
