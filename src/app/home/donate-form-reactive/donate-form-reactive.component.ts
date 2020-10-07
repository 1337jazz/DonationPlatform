import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DonationService } from '../../_services/donation.service';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import {
  faImages,
  faPlusCircle,
  faCheckCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FormPostedService } from 'src/app/_services/form-posted.service';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-donate-form-reactive',
  templateUrl: './donate-form-reactive.component.html',
  styleUrls: ['./donate-form-reactive.component.css'],
})
export class DonateFormReactiveComponent implements OnInit {
  donateForm: FormGroup;
  categories: any = [];
  selectedCategory: any;
  items: FormArray;
  numItems = 0;
  submitDisabledAfterPost = false;
  submitButtonText = 'Submit';
  loading = false;
  catSelect: any;

  // Picture backup array - to address pictures going missing when description is changed
  picBackup: any = [];

  // Icons
  faImages = faImages;
  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faTrashAlt = faTrashAlt;

  constructor(
    private formBuilder: FormBuilder,
    private donationService: DonationService,
    private postService: FormPostedService,
    private router: Router,
    private catService: CategoryService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;

    // Create the form
    this.donateForm = this.formBuilder.group({
      submissionDate: [''],
      name: [''],
      address: [''],
      phone: [''],
      email: [''],
      mailingList: [false],
      smokeFree: [''],
      petFree: [''],
      status: [''],
      items: this.formBuilder.array([this.createItem()]),
    });

    // Get categories
    this.catService.getCategories().subscribe(
      (next) => {
        this.categories = next;
        this.categories.unshift('test');
        this.loading = false;
      },
      (error) => {
        alertify.error('Unexpected error!');
        this.loading = false;
      }
    );
  }

  createItem() {
    this.numItems++;
    return this.formBuilder.group({
      description: [''],
      category: [''],
      fireLabels: [''],
      pictures: this.formBuilder.array([]),
    });
  }

  onAddItem() {
    this.items = this.donateForm.get('items') as FormArray;
    this.items.push(this.createItem());
    this.cd.detectChanges();
  }

  onDeleteItem(id: number) {
    if (this.numItems > 1) {
      this.numItems--;
      this.items.removeAt(id);
    }
  }

  getControls() {
    return (this.donateForm.get('items') as FormArray).controls;
  }

  onFilePicked(event: Event, index: number) {
    const files = (event.target as HTMLInputElement).files;
    this.donateForm.value.items[index].pictures = files;

    // Back up the chosen files
    this.picBackup[index] = files;
  }

  onSubmit() {
    const model: any = this.donateForm.value;

    let failed = false;

    // Apply backup to ensure files are present on each item
    for (let i = 0; i < model.items.length; i++) {
      const item = model.items[i];
      item.pictures = this.picBackup[i];
    }

    // Check at least one picture for each item
    for (const item of model.items) {
      if (item.pictures === undefined) {
        failed = true;
        break;
      }
      if (item.pictures.length === 0) {
        failed = true;
      }
    }

    // Return if failed above check
    if (failed) {
      alertify.error(
        'Sorry! You must upload at least one picture for every item!'
      );
      return;
    }

    const picsTooLarge = [];
    const invalidPics = [];
    const MIME_TYPE_MAP = ['image/png', 'image/jpeg', 'image/jpg'];

    // Check files ----------------------------------------------
    for (let j = 0; j < model.items.length; j++) {
      const item = model.items[j];
      for (let i = 0; i < item.pictures.length; i++) {
        // Check file size is under 10mb
        const picture = item.pictures[i];
        if (picture.size > 10000000) {
          picsTooLarge.push(`"${picture.name}"`);
        }
        // Check file type is valid
        if (!MIME_TYPE_MAP.includes(picture.type)) {
          invalidPics.push(`"${picture.name}"`);
        }
      }
    }

    if (picsTooLarge.length > 0) {
      const pics = picsTooLarge.join(', ');
      alertify.error(
        'Sorry! One or more pictures are too big: ' + pics + '\n Pictures must be less than 10mb.'
      );
      return;
    }

    if (invalidPics.length > 0) {
      const pics = invalidPics.join(', ');
      alertify.error(
        'Sorry! One or more pictures are invalid format(s): ' + pics + '\n Pictures must be png or jpg.'
      );
      return;
    }
    // ---------------------------------------------------------

    // Passed validation
    this.submitDisabledAfterPost = true;
    this.submitButtonText = 'Please wait...';

    // Redirect user
    setTimeout(() => {
      this.postService.setPosted();
      this.router.navigate(['success']);
    }, 1000);

    this.donationService.addDonation(model).subscribe(
      (next) => {
      },
      (error) => {
      }
    );
  }

  onChange(select: any) {
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.donateForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
