import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  //colocou vazio para não aumentar o caminho da rota,
  // porque ja tem a rota no app-routing.module.ts
  { path:'', component: CategoryListComponent }, //categories/
  { path:'new', component: CategoryFormComponent }, //categories/new  
  { path:':id/edit', component: CategoryFormComponent } //categories/id/edit
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
