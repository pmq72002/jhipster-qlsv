import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentSubjects } from 'app/shared/types/student-subject';

@Component({
  selector: 'app-student-subject',
  standalone: true,
  imports: [],
  templateUrl: './studentSubject.html',
  styleUrl: './studentSubject.css',
})
export class StudentSubject implements OnInit {
  studentSubject: StudentSubjects[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}
  stuName: string = '';
  ngOnInit(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any>(`api/student/${stuCode}/subject`).subscribe({
      next: res => {
        this.studentSubject = res.map((item: { subName: any; subNum: any }) => ({
          subName: item.subName,
          subNum: item.subNum,
        }));
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
}
