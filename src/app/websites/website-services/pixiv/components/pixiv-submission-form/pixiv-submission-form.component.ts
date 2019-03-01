import { Component, OnInit, Injector, forwardRef } from '@angular/core';
import { TagConfig } from 'src/app/utils/components/tag-input/tag-input.component';
import { BaseWebsiteSubmissionForm } from 'src/app/websites/components/base-website-submission-form/base-website-submission-form.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pixiv-submission-form',
  templateUrl: './pixiv-submission-form.component.html',
  styleUrls: ['./pixiv-submission-form.component.css'],
  providers: [{ provide: BaseWebsiteSubmissionForm, useExisting: forwardRef(() => PixivSubmissionForm) }],
  host: {
    'class': 'submission-form'
  }
})
export class PixivSubmissionForm  extends BaseWebsiteSubmissionForm implements OnInit {

  public optionDefaults: any = {
      restrictSexual: ['0'],
      communityTags: [false],
      content: [],
      original: [false],
      sexual: [false],
      sexualTypes: []
    };

  public tagConfig: TagConfig = {
    minTags: 1,
    maxTags: 10,
    minTagLength: 1
  };

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.formGroup.get('tags')) this.formGroup.addControl('tags', new FormControl(null));
    if (!this.formGroup.get('description')) this.formGroup.addControl('description', new FormControl(null));
    if (!this.formGroup.get('options')) this.formGroup.addControl('options', this.formBuilder.group(this.optionDefaults));
  }

}
