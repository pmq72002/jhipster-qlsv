import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
    if (student.birth) {
      const [year, month, day] = student.birth.split('-');
      student.birth = `${day}/${month}/${year}`;
    }
    this.http.post<{ message: string; result: any }>(`api/student/create`, student).subscribe({
      next: res => {
        console.log('Tạo sinh viên thành công: ', res.message);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: res.message || 'Tạo sinh viên thành công',
          confirmButtonText: 'OK',
        });
      },
      error: err => {
        console.error('❌ Lỗi tạo sinh viên:', err);
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          html: `Tạo sinh viên thất bại:<br><b>${err.error?.message || ''}<b>`,
          confirmButtonText: 'Thử lại',
        });
      },
    });
  }
}
