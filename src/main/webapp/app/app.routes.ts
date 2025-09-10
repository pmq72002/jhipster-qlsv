import { Routes } from '@angular/router';
import { StudentList } from './main-menu/studentList/studentList';
import { StudentInfo } from './main-menu/studentInfo/studentInfo';

const routes: Routes = [
  {
    path: 'studentList',
    component: StudentList,
  },
  {
    path: 'studentInfo/:stuCode',
    component: StudentInfo,
  },
];

export default routes;
