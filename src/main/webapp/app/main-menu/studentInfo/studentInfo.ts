import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { studentInfo } from 'app/shared/types/student-info';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Student {
  stuCode: string;
  stuName: string;
  gender: string;
  birth: string;
  classR: string;
  course: string;
}
@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './studentInfo.html',
  styleUrl: './studentInfo.css',
})
export class StudentInfo implements OnInit {
  studentInfo: studentInfo | null = null;
  loading = true;
  error: string | null = null;
  editMode: boolean = false;
  changePassMode: boolean = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  roles: string[] = [];
  stuCode: string = '';

  ngOnInit(): void {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
    }
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    if (stuCode) {
      this.loadStudent(stuCode);
    }
  }

  loadStudent(stuCode: string): void {
    this.http.get<any>(`api/student/${stuCode}`).subscribe({
      next: res => {
        const student = res.result;

        let birthFormatted = '';
        if (student.birth) {
          const [day, month, year] = student.birth.split('/');
          birthFormatted = `${year}-${month}-${day}`;
        }
        this.studentInfo = {
          stuCode: student.stuCode,
          stuName: student.stuName,
          gender: student.gender,
          birth: birthFormatted,
          classR: student.classR,
          course: student.course,
        };
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }

  handleBackList(): void {
    this.router.navigate(['/studentList']);
  }

  handleSaveStudent(): void {
    if (!this.studentInfo) return;
    const student = { ...this.studentInfo };
    if (student.birth) {
      const [year, month, day] = student.birth.split('-');
      student.birth = `${day}/${month}/${year}`;
    }
    this.http.put<any>(`api/student/${this.studentInfo.stuCode}`, student).subscribe({
      next: res => {
        this.studentInfo = {
          ...res.result,
          birth: res.result.birth ? res.result.birth.split('/').reverse().join('-') : '',
        };
        this.editMode = false;
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: res.message || 'Cập nhật thông tin thành công',
          confirmButtonText: 'OK',
        });
      },
      error: err => {
        console.log('Lỗi cập nhật', err);
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: `Cập nhật thất bại ${err.error?.message || ''}<b>`,
          confirmButtonText: 'Thử lại',
        });
      },
    });
  }

  changePassStudent(): void {
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };
    Swal.fire({
      title: 'Xác nhận đổi mật khẩu',
      html: `Bạn có chắc muốn đổi mật khẩu?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(result => {
      if (result.isConfirmed) {
        this.http.put<any>(`api/student/${this.studentInfo?.stuCode}/password`, payload).subscribe({
          next: res => {
            this.studentInfo = res.result;
            this.changePassMode = false;
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: res.message || 'Đổi mật khẩu thành công',
              confirmButtonText: 'OK',
            });
            const stuCode = this.route.snapshot.paramMap.get('stuCode');
            if (stuCode) {
              this.loadStudent(stuCode);
            }
          },
          error: err => {
            console.log('Lỗi đổi mật khẩu', err);
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              html: `Đổi mật khẩu thất bại:<br><b>${err.error?.message || ''}<b>`,
              confirmButtonText: 'Thử lại',
            });
          },
        });
      }
    });
  }

  deleteStudent(stuCode: string, stuName: string): void {
    Swal.fire({
      title: 'Xác nhận xóa',
      html: `Bạn có chắc muốn xóa sinh viên <b>${stuCode}</b> - <b>${stuName}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete<{ message: string }>(`api/student/${stuCode}`).subscribe({
          next: res => {
            console.log('✅ Xóa thành công:', res.message);
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              html: `${res.message}<b>${stuCode}<b> - <b>${stuName}<b>` || 'Xóa sinh viên thành công',
              confirmButtonText: 'OK',
            });
            this.router.navigate(['/studentList']);
          },
          error: err => {
            console.error('❌ Lỗi xóa sinh viên:', err);
            console.log('Lỗi đổi mật khẩu', err);
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              html: `Xóa sinh viên thất bại:<br><b>${err.error?.message || ''}<b>`,
              confirmButtonText: 'Thử lại',
            });
          },
        });
      }
    });
  }
}
