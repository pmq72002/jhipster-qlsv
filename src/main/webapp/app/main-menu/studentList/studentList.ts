import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentLists } from 'app/shared/types/student-list';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './studentList.html',
  styleUrl: './studentList.css',
})
export class StudentList implements OnInit {
  students: StudentLists[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('api/student/').subscribe({
      next: res => {
        this.students = res.map((item: { stuCode: any; stuName: any }) => ({
          stuCode: item.stuCode,
          stuName: item.stuName,
        }));
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }
}
