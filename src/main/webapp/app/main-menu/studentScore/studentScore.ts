import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentScores } from 'app/shared/types/student-score';

@Component({
  selector: 'app-student-score',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './studentScore.html',
  styleUrl: './studentScore.css',
})
export class StudentScore implements OnInit {
  selectedSubCode: string | null = null;
  selectedScore: any = null;
  showEditScore = false;
  sortField: keyof StudentScores | null = null;
  sortAsc: boolean = true;
  searchTerm: string = '';
  totalFiltered: number = 0;

  handleShowEditScore(score: any): void {
    this.showEditScore = true;
    this.selectedSubCode = score.subCode;
    this.selectedScore = score;
    this.processPoint = score.processPoint;
    this.componentPoint = score.componentPoint;
    console.log('subCode', this.selectedSubCode);
    console.log();
  }

  subCode = '';

  processPoint: number = 0;
  componentPoint: number = 0;

  allStudentScore: StudentScores[] = [];
  studentScore: StudentScores[] = [];
  loading = true;
  error: string | null = null;
  page = 1;
  size = 10;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  handleBackList(): void {
    this.router.navigate(['/studentList'], {
      queryParams: { view: 'score' },
    });
  }

  onUpdateScore(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    console.log('stuCode', stuCode);
    const newScore = {
      processPoint: this.processPoint,
      componentPoint: this.componentPoint,
    };

    this.http.put(`api/student/${stuCode}/score/${this.selectedSubCode}`, newScore).subscribe({
      next: res => {
        console.log('✅ Điểm đã cập nhật:', res);
        alert('Cập nhật điểm thành công!');
        this.showEditScore = false;
        this.loadStudentScores();
      },
      error: err => {
        console.error('❌ Lỗi cập nhật điểm:', err);
        alert('Cập nhật điểm thất bại!');
      },
    });
  }
  stuName: string = '';
  loadStudentScores(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any[]>(`api/student/${stuCode}/subject/summary`).subscribe({
      next: res => {
        this.allStudentScore = res.map(item => ({
          subCode: item.subCode,
          subName: item.subName,
          processPoint: item.processPoint,
          componentPoint: item.componentPoint,
          summaryScore: item.summaryScore,
          passSub: item.passSub,
        }));
        console.log('✅ studentScore:', this.allStudentScore);
        this.applyFilter();
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
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
  roles: string[] = [];
  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
    }
    this.loadStudentScores();
  }

  applyFilter(): void {
    let filtered = this.allStudentScore;
    if (this.searchTerm.trim() != '') {
      const term = this.searchTerm.toLowerCase();
      filtered = this.allStudentScore.filter(sub => sub.subCode.toLowerCase().includes(term) || sub.subName.toLowerCase().includes(term));
    }
    this.totalFiltered = filtered.length;
    const start = (this.page - 1) * this.size;
    this.studentScore = filtered.slice(start, start + this.size);
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
  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  sortScore(field: keyof StudentScores): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.allStudentScore.sort((a, b) => {
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
}
