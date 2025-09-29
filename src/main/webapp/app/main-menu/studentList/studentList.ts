import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentLists } from 'app/shared/types/student-list';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, NgSwitch, NgSwitchCase, FormsModule, NgIf, NgFor],
  templateUrl: './studentList.html',
  styleUrl: './studentList.css',
})
export class StudentList implements OnInit {
  viewMode: 'info' | 'subject' | 'score' = 'info';
  allStudents: StudentLists[] = [];
  students: StudentLists[] = [];
  loading = true;
  error: string | null = null;
  searchTerm: string = '';
  totalFiltered: number = 0;
  sortField: keyof StudentLists | null = null;
  sortAsc: boolean = true;

  page = 1;
  size = 5;

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
        this.allStudents = res.result.map((item: { stuCode: any; stuName: any }) => ({
          stuCode: item.stuCode,
          stuName: item.stuName,
        }));
        this.applyFilter();
        this.sortStudent('stuCode');
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    let filtered = this.allStudents;
    if (this.searchTerm.trim() != '') {
      const term = this.searchTerm.toLowerCase();
      filtered = this.allStudents.filter(sub => sub.stuCode.toLowerCase().includes(term) || sub.stuName.toLowerCase().includes(term));
    }

    this.totalFiltered = filtered.length;
    const start = (this.page - 1) * this.size;
    this.students = filtered.slice(start, start + this.size);
  }

  updatePage(): void {
    this.applyFilter();
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
    return Math.ceil(this.totalFiltered / this.size);
  }
  pages(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.page;
    const delta = 1;
    const range: (number | '...')[] = [];

    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (current > 3) {
        range.push('...');
      }

      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
      }

      if (current < total - 2) {
        range.push('...');
      }

      range.push(total);
    }

    return range;
  }

  sortStudent(field: keyof StudentLists): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.allStudents.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortAsc ? valA.localeCompare(valB, 'vi', { numeric: true }) : valB.localeCompare(valA, 'vi', { numeric: true });
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortAsc ? valA - valB : valB - valA;
      }

      return 0;
    });
    this.updatePage();
  }

  exportPdf(): void {
    this.http.get(`api/student/report/pdf/studentList`, { responseType: 'blob' }).subscribe({
      next: (res: Blob) => {
        const url = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'studentList.pdf';
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Lỗi khi tải PDF:', err);
      },
    });
  }
}
