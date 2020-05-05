import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../courses.service';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-courses-form',
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CoursesService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // ResolveGuard substitui o codigo comentado abaixo
    //--------------
    // this.route.params
    // .pipe(
    //   map((params: any) => params['id']),
    //   switchMap(id => this.courseService.loadById(id))
    // )
    // .subscribe(course => this.updateForm(course));
    //--------------------------------------------------
    // concatMap => ordem da requisição
    // mergeMap => ordem não importa
    // exhaustMap => casos de login

    const course = this.route.snapshot.data['course'];
    //com o resolveGuard substitui o null por course.id,nome etc...
    this.form = this.fb.group({
      id: [course.id],
      name: [course.name, [Validators.required, Validators.maxLength(100)]],
      description: [course.description, [Validators.required, Validators.maxLength(200)]],
      credit: [course.credit, [Validators.required]],
      frequency: [course.frequency, [Validators.required]],
      shift: [course.shift, [Validators.required]],
      hour: [course.hour, [Validators.required]],
      place: [course.place, [Validators.required]],
      startDate: [course.startDate, [Validators.required]],
      amount: [course.amount, [Validators.required]],
      advantage: [course.advantage, [Validators.required]]
    });
  }

  //com o ResolveGuard não precisa mais do codigo abaixo
  //----------------------
  // updateForm(course) {
  //   this.form.patchValue({
  //     id: course.id,
  //     name: course.name
  //   });
  // }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      console.log('submit');
      
      let msgSuccess = 'Curso criado com sucesso!';
      let msgError = 'Erro ao criar curso, tente novamente!';

      if(this.form.value.id){
        msgSuccess = 'Curso atualizado com sucesso!';
        msgError = 'Erro ao atualizado curso, tente novamente!';
      }

      this.courseService.save(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess(msgSuccess);
          this.location.back();
        },
        error => this.modal.showAlertDanger(msgError)
      );
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
    console.log('onCancel');
  }

}
