import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { studentInfo } from 'app/shared/types/student-info';
import { StudentSubject } from '../studentSubject/studentSubject';
import { StudentScore } from '../studentScore/studentScore';
import { StudentResult } from '../studentResult/studentResult';
import HomeComponent from 'app/home/home.component';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [NgIf, StudentSubject, StudentScore, StudentResult, HomeComponent],
  templateUrl: './studentInfo.html',
  styleUrl: './studentInfo.css',
})
export class StudentInfo implements OnInit {
  showSubject = false;
  handleShowSubject() {
    this.showSubject = !this.showSubject;
    this.showScore = false;
    this.showResult = false;
  }
  showScore = false;
  handleShowScore() {
    this.showScore = !this.showScore;
    this.showResult = false;
    this.showSubject = false;
  }
  showResult = false;
  handleShowResult() {
    this.showResult = !this.showResult;
    this.showScore = false;
    this.showSubject = false;
  }
  studentInfo: studentInfo | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any>(`api/student/${stuCode}`).subscribe({
      next: res => {
        this.studentInfo = {
          stuCode: res.stuCode,
          stuName: res.stuName,
          gender: res.gender,
          birth: res.birth,
          classR: res.classR,
          course: res.course,
        };
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }
}
