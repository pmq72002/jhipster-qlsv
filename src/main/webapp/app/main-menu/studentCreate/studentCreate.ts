import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './studentCreate.html',
  styleUrl: './studentCreate.css',
})
export class StudentCreateComponent {
  student: any = {
    stuCode: '',
    stuName: '',
    gender: '',
    birth: '',
    classR: '',
    course: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

  createStudent(student: any): void {
    this.http.post<{ message: string; result: any }>(`api/student/create`, student).subscribe({
      next: res => {
        console.log('Tạo sinh viên thành công: ', res.message);
        alert(res.message);
      },
      error: err => {
        console.error('❌ Lỗi tạo sinh viên:', err);

        const msg = err.error?.message || 'Tạo sinh viên thất bại!';
        alert('❌ ' + msg);
      },
    });
  }
}
