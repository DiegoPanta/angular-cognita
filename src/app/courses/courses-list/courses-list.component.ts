import { Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService } from '../courses.service';
import { Course } from '../course';
import { Observable, empty, EMPTY } from 'rxjs';
import { catchError, take, switchMap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
  preserveWhitespaces: true
})
export class CoursesListComponent implements OnInit {

  deleteModalRef: BsModalRef;
  @ViewChild('deleteModal') deleteModal;

  courses$: Observable<Course[]>;

  selectedCourse: Course;

  constructor(
    private courseService: CoursesService,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh(){
    this.courses$ = this.courseService.list()
    .pipe(
      catchError(error => {
        console.error(error);
        this.handleError();
        return EMPTY;
      })
    );
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar curso. Tente mais tarde.');
  }

  onEdit(id) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(course){
    this.selectedCourse = course;
    const result$ = this.alertService.showConfirm('Confirmacao', 'Tem certeza que deseja remover esse curso?');
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.courseService.delete(course.id) : EMPTY)
    )
    .subscribe(
      success => {
        this.onRefresh();
      },
      error => {
        this.alertService.showAlertDanger('Erro ao remover curso. Tente mais tarde.');
      }
    );
    // this.deleteModalRef = this.modalService.show(this.deleteModal, {class: 'modal-sm'});
  }

  onConfirmDelete() {
    this.courseService.delete(this.selectedCourse.id)
    .subscribe(
      success => {
        this.onRefresh();
        this.deleteModalRef.hide();
      },
      error => {
        this.alertService.showAlertDanger('Erro ao remover curso. Tente mais tarde.');
        this.deleteModalRef.hide();
      }
    );
  }

  onDeclineDelete(){
    this.deleteModalRef.hide();
  }
}
