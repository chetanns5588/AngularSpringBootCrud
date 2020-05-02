import { EmployeeDetailsComponent } from './../employee-details/employee-details.component';
import { Observable } from "rxjs";
import { EmployeeService } from "./../employee.service";
import { Employee } from "./../employee";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"]
})
export class EmployeeListComponent implements OnInit {
  
  employees: Employee[];

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);
          this.refreshDataSource();
        },
        error => console.log(error));
  }

  updateEmployee(employee:Employee) {
    this.employeeService.updateEmployee(employee.id, employee)
      .subscribe(data => console.log(data), error => console.log(error));
  }

  employeeDetails(id: number){
    this.router.navigate(['details', id]);
  }

  displayedColumns: string[] = ['id','firstName', 'lastName', 'emailId', 'edit', 'delete', 'details'];
  dataSource;
  editable: boolean[] = [];
  addEmployeeForm: FormGroup;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router){
    this.addEmployeeForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.email]),
    });
   }

  ngOnInit() {
    this.employeeService.getEmployeesList().subscribe(
      (value) => {
        if (value) {
          const employees = [];
          for (var key in value) {
            employees.push(value[key])
          }
          this.employees = employees;
          console.log("employees", this.employees)
          this.refreshDataSource();
        }
      },
      (error) => {
        console.log("Error", error)
      });
  }

  refreshDataSource(){
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  addEmployee(content){
    this.modalService.open(content, { centered: true });
  }

  onSubmitEmployeeForm(){
    this.dataSource.data.push(this.addEmployeeForm.value);
    this.refreshDataSource();
    this.modalService.dismissAll();
  }
}
