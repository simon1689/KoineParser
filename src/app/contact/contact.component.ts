import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KoineParserService} from '../koine-parser.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  messageSent: boolean;

  constructor(private service: KoineParserService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required),
    });
  }

  submit(): void {
    if (this.contactForm.valid) {
      this.service.sendErrorMessageMail({
        emailFrom: this.contactForm.value.email,
        name: this.contactForm.value.name,
        message: this.contactForm.value.message
      }).subscribe(
        result => {
          console.log(result);
          this.messageSent = true;
          this.contactForm.disable();
        });
    }
  }
}
