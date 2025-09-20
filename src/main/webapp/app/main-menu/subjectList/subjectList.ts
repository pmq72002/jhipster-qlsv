import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SubjectLists } from 'app/shared/types/subject-list';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [],
  templateUrl: './subjectList.html',
  styleUrl: './subjectList.css',
})
export class SubjectListComponent implements OnInit {
  allSubjects: SubjectLists[] = [];
  subjects: SubjectLists[] = [];
  loading = true;
  error: string | null = null;

  page = 1;
  size = 11;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('api/student/subject/list').subscribe({
      next: res => {
        this.allSubjects = res.map((item: { subCode: any; subName: any; subNum: any }) => ({
          subCode: item.subCode,
          subName: item.subName,
          subNum: item.subNum,
        }));
        this.updatePage();
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu môn học';
        this.loading = false;
      },
    });
  }
  updatePage(): void {
    const start = (this.page - 1) * this.size;
    this.subjects = this.allSubjects.slice(start, start + this.size);
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
    return Math.ceil(this.allSubjects.length / this.size);
  }
  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
