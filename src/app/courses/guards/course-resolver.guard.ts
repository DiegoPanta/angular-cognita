import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Course } from '../course';
import { CoursesService } from '../courses.service';

@Injectable({
  providedIn: 'root'
})
export class CourseResolverGuard implements Resolve<Course> {

  constructor(
    private courseService: CoursesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Course | Observable<Course> | Promise<Course> {
    if (route.params && route.params['id']) {
      return this.courseService.loadById(route.params['id']);
    }

    return of({
      id: null,
      name: null,
      description: null,
      credit: null,
      frequency: null,
      shift: null,
      hour: null,
      place: null,
      startDate: null,
      amount: null,
      advantage: null
    });
  }


}
