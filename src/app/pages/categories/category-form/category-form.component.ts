import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";

//npm install ngx-toastr — save https://medium.com/better-programming/ngx-toastr-in-angular-7-185ac435011e

import { ObjectUnsubscribedError } from 'rxjs';
import { JsonpInterceptor } from '@angular/common/http';
// https://www.npmjs.com/package/ngx-toastr

// https://www.c-sharpcorner.com/article/implement-toastr-notification-in-angular-7/


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuider: FormBuilder,
    private toastrService: ToastrService    
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
  
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
  }

  //private methods
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") // categories/new
      this.currentAction = "new";
    else
      this.currentAction = "edit";
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuider.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(this.category) // binds loaded category data to CategoryForm          
          },
          (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
        )
    }
  }

  private setPageTitle() {
    // if (this.currentAction == "new"){
    //   this.pageTitle = "Cadastro de Nova Categoria";
    // }
    // else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName;
    // }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionForSuccess(category),
        error => this.actionForError(error)
      )

  }


  private actionForSuccess(category: Category) {
    this.toastrService.success("Solicitação processada com Sucesso!", )

    // nomedosite.com/categories/new  ==>>desse para o de baixo
    // nomedosite.com/categories ==>> depois para o de abaixo
    // nomedosite.com/categories/:id/edit
    // skipLocationChange: false para não armazenar no history do navegador para não voltar
    // não é navegação natural , foi só pra forçar

    // é um redirect componente page
    this.router.navigateByUrl("categories", { skipLocationChange: false }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionForError(error) {
    this.toastrService.error("Ocorreu um erro ao Processar sua Solicitação!");
    
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na Comunicação com o Servidor, tente mais tarde!"]
    }
  }

  private updateCategory() {

  }

}
