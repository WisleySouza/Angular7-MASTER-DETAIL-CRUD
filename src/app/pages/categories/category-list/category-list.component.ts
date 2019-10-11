import { Category } from './../shared/category.model';

import { element } from 'protractor';

import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];


  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteCategory(category: any) {
    const resp = confirm('Deseja realmente Excluir este item? ' + category.name);

    if (resp) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

}
