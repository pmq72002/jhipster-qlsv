import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StudentScores } from 'app/shared/types/student-score';

@Component({
  selector: 'app-student-score',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './studentScore.html',
  styleUrl: './studentScore.css',
})
export class StudentScore implements OnInit {
  selectedSubCode: string | null = null;
  showEditScore = false;
  handleShowEditScore(score: any): void {
    this.showEditScore = true;
    this.selectedSubCode = score.subCode;
    this.processPoint = score.processPoint;
    this.componentPoint = score.componentPoint;
    console.log('subCode', this.selectedSubCode);
    console.log();
  }

  subCode = '';

  processPoint: number = 0;
  componentPoint: number = 0;

  studentScore: StudentScores[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

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
  loadStudentScores(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any>(`api/student/${stuCode}/score`).subscribe({
      next: res => {
        this.studentScore = res.map((item: { subCode: any; subName: any; processPoint: any; componentPoint: any }) => ({
          subCode: item.subCode,
          subName: item.subName,
          processPoint: item.processPoint,
          componentPoint: item.componentPoint,
        }));
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }
  ngOnInit(): void {
    this.loadStudentScores();
  }
}
