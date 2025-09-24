import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subjectCreate.html',
  styleUrl: './subjectCreate.css',
})
export class SubjectCreateComponent {
  subject: any = {
    subCode: '',
    subName: '',
    subNum: '',
  };

  constructor(private http: HttpClient) {}

  createSubject(subject: any): void {
    this.http.post<{ message: string; result: any }>(`api/student/subject/create`, subject).subscribe({
      next: res => {
        console.log('Thêm môn học mới thành công: ', res.message);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: res.message || 'Thêm môn học mới thành công',
          confirmButtonText: 'OK',
        });
      },
      error: err => {
        console.error('❌ Lỗi thêm môn học:', err);

        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          html: `Thêm môn học thất bại:<br><b>${err.error?.message || ''}<b>`,
          confirmButtonText: 'Thử lại',
        });
      },
    });
  }
}
