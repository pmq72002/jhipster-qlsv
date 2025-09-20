import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
        alert(res.message);
      },
      error: err => {
        console.error('❌ Lỗi thêm môn học:', err);

        const msg = err.error?.message || 'Thêm môn học thất bại!';
        alert('❌ ' + msg);
      },
    });
  }
}
