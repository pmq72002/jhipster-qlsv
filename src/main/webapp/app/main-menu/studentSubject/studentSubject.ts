import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentSubjects } from 'app/shared/types/student-subject';
import { SubjectListComponent } from '../subjectList/subjectList';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-student-subject',
  standalone: true,
  imports: [SubjectListComponent, NgIf],
  templateUrl: './studentSubject.html',
  styleUrl: './studentSubject.css',
})
export class StudentSubject implements OnInit {
  page = 1;
  size = 9;
  isRegister = false;
  handleIsRegister(): void {
    this.isRegister = true;
  }

  allStudentSubjects: StudentSubjects[] = [];
  studentSubjects: StudentSubjects[] = [];
  loading = true;
  error: string | null = null;
  stuCode: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}
  stuName: string = '';
  ngOnInit(): void {
    this.stuCode = localStorage.getItem('stuCode') || '';
    this.loadRegisteredSubject();
  }
  loadRegisteredSubject(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any>(`api/student/${stuCode}/subject`).subscribe({
      next: res => {
        this.allStudentSubjects = res.map((item: { subCode: any; subName: any; subNum: any }) => ({
          subCode: item.subCode,
          subName: item.subName,
          subNum: item.subNum,
        }));
        this.updatePage();
        this.isRegister = false;
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
    this.http.get<any>(`api/student/${stuCode}`).subscribe({
      next: res => {
        this.stuName = res.stuName;
      },
      error: err => {
        console.error('❌ Lỗi tải tên sinh viên:', err);
      },
    });
  }
  updatePage(): void {
    const start = (this.page - 1) * this.size;
    this.studentSubjects = this.allStudentSubjects.slice(start, start + this.size);
  }

  goTo(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.updatePage();
    }
  }
  prev(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  next(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.allStudentSubjects.length / this.size);
  }
  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
