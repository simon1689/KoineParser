import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ParseComponent} from '../parse/parse.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {KoineParserService} from '../koine-parser.service';
import {StateService} from '../state.service';

@Component({
  selector: 'app-report-error-on-page-dialog',
  templateUrl: './report-error-on-page-dialog.component.html',
  styleUrls: ['./report-error-on-page-dialog.component.css']
})
export class ReportErrorOnPageDialogComponent implements OnInit {
  reportForm: FormGroup;
  component: ParseComponent = null;

  constructor(private dialogRef: MatDialogRef<ReportErrorOnPageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: KoineParserService,
              private state: StateService) {

    this.component = data.component;
  }

  ngOnInit(): void {
    this.reportForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });
  }

  sendTheReport(): void {
    if (this.reportForm.valid) {
      const emailContent = {
        emailFrom: this.reportForm.controls.email.value,
        message: this.reportForm.controls.message.value,
        component: {
          currentWord: this.component.word,
          givenAnswer: this.component.answer,
          range: this.state.getBibleRange(),
          words: this.component.words,
          wordIndex: this.component.wordIndex
        }
      };

      this.service.sendErrorMessageMail(emailContent).subscribe();
      this.dialogRef.close();
    }
  }
}
