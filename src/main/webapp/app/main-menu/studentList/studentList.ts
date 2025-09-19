import { NgSwitch, NgSwitchCase } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentLists } from 'app/shared/types/student-list';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, NgSwitch, NgSwitchCase],
  templateUrl: './studentList.html',
  styleUrl: './studentList.css',
})
export class StudentList implements OnInit {
  viewMode: 'info' | 'subject' | 'score' = 'info';
  allStudents: StudentLists[] = [];
  students: StudentLists[] = [];
  loading = true;
  error: string | null = null;

  page = 1;
  size = 11;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.viewMode = params['view'] || 'info';
    });

    this.http.get<any>('api/student/list').subscribe({
      next: res => {
        this.allStudents = res.map((item: { stuCode: any; stuName: any }) => ({
          stuCode: item.stuCode,
          stuName: item.stuName,
        }));
        this.updatePage();
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }

  updatePage(): void {
    const start = (this.page - 1) * this.size;
    this.students = this.allStudents.slice(start, start + this.size);
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
    return Math.ceil(this.allStudents.length / this.size);
  }
  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
