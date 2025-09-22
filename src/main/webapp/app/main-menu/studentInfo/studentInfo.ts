import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { studentInfo } from 'app/shared/types/student-info';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  roles: string[] = [];
  stuCode: string = '';

  ngOnInit(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    if (stuCode) {
      this.loadStudent(stuCode);
    }
  }

  loadStudent(stuCode: string): void {
    this.http.get<any>(`api/student/${stuCode}`).subscribe({
      next: res => {
        this.studentInfo = {
          stuCode: res.stuCode,
          stuName: res.stuName,
          gender: res.gender,
          birth: res.birth,
          classR: res.classR,
          course: res.course,
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
    this.http.put<any>(`api/student/${this.studentInfo.stuCode}`, this.studentInfo).subscribe({
      next: res => {
        this.studentInfo = res.result;
        this.editMode = false;
        alert(res.message || 'Cập nhật thông tin thành công');
      },
      error: err => {
        console.log('Lỗi cập nhật', err);
        alert('Cập nhật thất bại');
      },
    });
  }

  changePassStudent(): void {
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };
    if (confirm(`Bạn có chắc muốn đổi mật khẩu?`)) {
      this.http.put<any>(`api/student/${this.studentInfo?.stuCode}/password`, payload).subscribe({
        next: res => {
          this.studentInfo = res.result;
          this.changePassMode = false;
          alert(res.message || 'Đổi mật khẩu thành công');
          this.router.navigate(['/studentList']);
        },
        error: err => {
          console.log('Lỗi đổi mật khẩu', err);
          alert('Đổi mật khẩu thất bại: ' + err.error?.message);
        },
      });
    }
  }
  deleteStudent(stuCode: string): void {
    if (confirm(`Bạn có chắc muốn xóa sinh viên ${stuCode}?`)) {
      this.http.delete<{ message: string }>(`api/student/${stuCode}`).subscribe({
        next: res => {
          console.log('✅ Xóa thành công:', res.message);
          this.router.navigate(['/studentList']);
          alert(res.message);
        },
        error: err => {
          console.error('❌ Lỗi xóa sinh viên:', err);
          alert('Xóa sinh viên thất bại!');
        },
      });
    }
  }
}
