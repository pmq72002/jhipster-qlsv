import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubjectLists } from 'app/shared/types/subject-list';
import { SubjectEditComponent } from '../subjectEdit/subjectEdit';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { studentInfo } from 'app/shared/types/student-info';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './subjectList.html',
  styleUrl: './subjectList.css',
})
export class SubjectListComponent implements OnInit {
  editingSubject: SubjectLists | null = null;
  registerSubject: SubjectLists | null = null;
  allSubjects: SubjectLists[] = [];
  subjects: SubjectLists[] = [];
  studentInfo: studentInfo | null = null;
  loading = true;
  error: string | null = null;
  searchTerm: string = '';
  totalFiltered: number = 0;
  isEdit = false;
  roles: string[] = [];

  sortField: keyof SubjectLists | null = null;
  sortAsc: boolean = true;

  @Input() stuCode!: string;
  @Input() isRegister: boolean = false;
  @Output() registered = new EventEmitter<void>();

  //sort
  sortSubject(field: keyof SubjectLists): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.allSubjects.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortAsc ? valA.localeCompare(valB, 'vi', { numeric: true }) : valB.localeCompare(valA, 'vi', { numeric: true });
      }
      if (field === 'isRegistered') {
        valA = a.isRegistered ? 1 : 0;
        valB = b.isRegistered ? 1 : 0;
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortAsc ? valA - valB : valB - valA;
      }

      return 0;
    });
    this.updatePage();
  }
  handleIsEdit(subject: SubjectLists): void {
    this.isEdit = true;
    this.editingSubject = { ...subject };
  }
  handleIsRegister(): void {
    this.registered.emit();
  }
  page = 1;
  size = 10;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
    }
    this.loadSubject();
  }

  //load
  loadSubject(): void {
    this.http.get<any>('api/student/subject/list').subscribe({
      next: res => {
        this.allSubjects = res.result.map((item: { subCode: any; subName: any; subNum: any }) => ({
          subCode: item.subCode,
          subName: item.subName,
          subNum: item.subNum,
          isRegistered: false,
        }));

        this.http.get<any>(`api/student/${this.stuCode}/subject`).subscribe({
          next: registered => {
            const registeredCodes = registered.result.map((r: any) => r.subCode);

            this.allSubjects = this.allSubjects.map(s => ({
              ...s,
              isRegistered: registeredCodes.includes(s.subCode),
            }));
            this.applyFilter();
            this.sortSubject('subCode');
            this.loading = false;
          },
          error: err => {
            console.error('❌ Lỗi lấy danh sách môn đã đăng ký:', err);
          },
        });
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu môn học';
        this.loading = false;
      },
    });
  }

  //register
  handleRegisterSubject(subCode: string, subName: string): void {
    Swal.fire({
      title: 'Xác nhận đăng ký',
      html: `Bạn có chắc muốn đăng ký môn: <b>${subCode}<b> - <b>${subName}<b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đăng ký',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(result => {
      if (result.isConfirmed) {
        this.http.post<any>(`api/student/${this.stuCode}/register/${subCode}`, {}).subscribe({
          next: res => {
            this.loadSubject();
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: res.message || 'Đăng ký môn học thành công',
              confirmButtonText: 'OK',
            });
            this.registered.emit();
          },
          error: err => {
            console.error('❌ Lỗi đăng ký môn học', err);
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              html: `Đăng ký môn học thất bại:<br><b>${err.error?.message || ''}<b>`,
              confirmButtonText: 'Thử lại',
            });
          },
        });
      }
    });
  }
  //edit
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
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: res.message || 'Cập nhật môn học thành công',
          confirmButtonText: 'OK',
        });
      },
      error: err => {
        console.log('Lỗi cập nhật', err);
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          html: `Cập nhật môn học thất bại:<br><b>${err.error?.message || ''}<b>`,
          confirmButtonText: 'Thử lại',
        });
      },
    });
  }

  //delete
  deleteSubject(subCode: string, subName: string): void {
    Swal.fire({
      title: 'Xác nhận xóa',
      html: `Bạn có chắc muốn xóa môn: <b>${subCode}<b> - <b>${subName}<b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(result => {
      if (result.isConfirmed)
        this.http.delete<{ message: string }>(`api/student/subject/${subCode}`).subscribe({
          next: res => {
            console.log('✅ Xóa thành công:', res.message);
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              html: `${res.message} <b>${subCode}<b> - <b>${subName}<b>` || 'Xóa môn học thành công',
              confirmButtonText: 'OK',
            });
            this.loadSubject();
          },
          error: err => {
            console.error('❌ Lỗi xóa môn học:', err);
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              html: `Xóa môn học thất bại:<br><b>${err.error?.message || ''}<b>`,
              confirmButtonText: 'Thử lại',
            });
          },
        });
    });
  }

  //search
  applyFilter(): void {
    let filtered = this.allSubjects;
    if (this.searchTerm.trim() != '') {
      const term = this.searchTerm.toLowerCase();
      filtered = this.allSubjects.filter(sub => sub.subCode.toLowerCase().includes(term) || sub.subName.toLowerCase().includes(term));
    }

    this.totalFiltered = filtered.length;
    const start = (this.page - 1) * this.size;
    this.subjects = filtered.slice(start, start + this.size);
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
}
