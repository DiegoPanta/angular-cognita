import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from './course';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = `${environment.API}courses`;

  constructor(
    private http: HttpClient
  ) { }

  list()
  {
    return this.http.get<Course[]>(this.API);
  }

  loadById(id){
    return this.http.get<Course>(`${this.API}/${id}`).pipe(take(1));
  }

  private insert(course) {
    return this.http.post(this.API, course).pipe(take(1));
  }

  private update(course){
    return this.http.put(`${this.API}/${course.id}`, course).pipe(take(1));
  }

  save(course){
    if(course.id){
      return this.update(course);
    }

    return this.insert(course);
  }

  delete(id){
    return this.http.delete(`${this.API}/${id}`).pipe(take(1));
  }
}
