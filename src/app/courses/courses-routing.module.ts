import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { CoursesFormComponent } from './courses-form/courses-form.component';
import { CourseResolverGuard } from './guards/course-resolver.guard';


const routes: Routes = [
  { path: '', component: CoursesListComponent },
  {
    path: 'novo', component: CoursesFormComponent,
    resolve: {
      course: CourseResolverGuard
    }
  },
  {
    path: 'editar/:id', component: CoursesFormComponent,
    resolve: {
      course: CourseResolverGuard
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
