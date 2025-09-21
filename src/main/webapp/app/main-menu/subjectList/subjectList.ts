import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SubjectLists } from 'app/shared/types/subject-list';
import { SubjectEditComponent } from '../subjectEdit/subjectEdit';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './subjectList.html',
  styleUrl: './subjectList.css',
})
export class SubjectListComponent implements OnInit {
  editingSubject: SubjectLists | null = null;
  allSubjects: SubjectLists[] = [];
  subjects: SubjectLists[] = [];
  loading = true;
  error: string | null = null;

  isEdit = false;

  handleIsEdit(subject: SubjectLists): void {
    this.isEdit = true;
    this.editingSubject = { ...subject };
  }

  page = 1;
  size = 11;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubject();
  }

  loadSubject(): void {
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

  handleEditSubject(): void {
    if (!this.editingSubject) return;
    this.http.put<any>(`api/student/subject/${this.editingSubject.subCode}`, this.editingSubject).subscribe({
      next: res => {
        const updatedSubject = res.result;
        const index = this.allSubjects.findIndex(s => s.subCode === updatedSubject.subCode);
        if (index !== -1) {
          this.allSubjects[index] = updatedSubject;
        }
        this.loadSubject();
        this.isEdit = false;
        this.editingSubject = null;
        alert(res.message || 'Cập nhật môn học thành công');
      },
      error: err => {
        console.log('Lỗi cập nhật', err);
        alert('Cập nhật thất bại');
      },
    });
  }

  deleteSubject(subCode: string): void {
    if (confirm(`Bạn có chắc muốn xóa môn: ${subCode}?`)) {
      this.http.delete<{ message: string }>(`api/student/subject/${subCode}`).subscribe({
        next: res => {
          console.log('✅ Xóa thành công:', res.message);
          alert(res.message);
          this.loadSubject();
        },
        error: err => {
          console.error('❌ Lỗi xóa môn học:', err);
          alert('Xóa môn học thất bại!');
        },
      });
    }
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
