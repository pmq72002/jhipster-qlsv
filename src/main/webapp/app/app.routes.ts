import { Routes } from '@angular/router';
import { StudentList } from './main-menu/studentList/studentList';
import { StudentInfo } from './main-menu/studentInfo/studentInfo';
import { LoginComponent } from './login/login';
import HomeComponent from './home/home';
import AuthLayoutComponent from './layout/authLayout/auth-layout.component';
import AppComponent from './app.component';
import MainLayoutComponent from './layout/mainLayout/main-layout.component';

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
    ],
  },
];

export default routes;
