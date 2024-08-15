import * as React from 'react';
import type { IEmployeeDataWebPartProps } from './IEmployeeDataWebPartProps';
import { SPFI } from '@pnp/sp';
import { getList } from '../../../pnpnjsConfig';
import { IEmployee } from '../../../interfaces';

import "@pnp/sp/webs"
import "@pnp/sp/lists"
import "@pnp/sp/items"
import "@pnp/sp/batching"
import styles from './EmployeeDataWebPart.module.scss';

const EmployeeData = (props:IEmployeeDataWebPartProps) => {

  //const LOG_SOURCE = "EmployeeDataWebPart";
  const LIST_NAME = "EmployeeData";
  let _sp:SPFI = getList(props.context);

  const [,setListItems] = React.useState<IEmployee[]>([])
  const [newEmployee, setNewEmployee] = React.useState<IEmployee>({
    street: '',
    state: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    EmployeeName: '',
    EmployeeTitle: '',
    EmployeeDepartment: '',
    EmployeeSalary: undefined,
  });
  
  const getListItems = async () => {
    const items = _sp.web.lists.getByTitle(LIST_NAME).items();
    setListItems((await items).map((item:any) =>{
      return {
        street: item.EmployeeAddress_x003a_Street,
        state: item.EmployeeAddress_x003a_State,
        city: item.EmployeeAddress_x003a_City,
        postalCode: item.EmployeeAddress_x003a_PostalCode,
        phoneNumber: item.EmployeePhoneNumber,
        EmployeeName: item.EmployeeName,
        EmployeeTitle: item.EmployeeTitle,
        ID: item.ID,
        EmployeeDepartment: item.EmployeeDepartment,
        EmployeeSalary: item.EmployeeSalary
      }
    }));
  }
  const createListItem = async () => {
    try {
      await _sp.web.lists.getByTitle(LIST_NAME).items.add({
        EmployeeAddress_x003a_Street: newEmployee.street,
        EmployeeAddress_x003a_State: newEmployee.state,
        EmployeeAddress_x003a_City: newEmployee.city,
        EmployeeAddress_x003a_PostalCode: newEmployee.postalCode,
        EmployeePhoneNumber: newEmployee.phoneNumber,
        EmployeeName: newEmployee.EmployeeName,
        EmployeeTitle: newEmployee.EmployeeTitle,
        EmployeeDepartment: newEmployee.EmployeeDepartment,
        EmployeeSalary: newEmployee.EmployeeSalary
      });
      await getListItems();
        
    } catch (error) {
      console.error('Failed to create list item:', error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({ ...prevState, [name]: value }));
  };

  React.useEffect(() => {
    getListItems()    
    .then()
    .catch((error) => {
      console.error('Failed to fetch list items:', error);
    });
  }, [])
  return (
    <div className={styles.employeeForm}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createListItem();
        } catch (error) {
          console.error('Failed to create list item:', error);
        }
      }}>
        <div className={styles.formGroup}>
          <label>Please enter First and Last Name</label>
          <input className={styles.employeeInput} name="EmployeeName" placeholder="Name" required value={newEmployee.EmployeeName} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter full Living Address</label>
          <input className={styles.employeeInput} name="street" placeholder="Street" required value={newEmployee.street} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter City</label>
          <input className={styles.employeeInput} name="city" placeholder="City" required value={newEmployee.city} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter State</label>
          <input className={styles.employeeInput} name="state" placeholder="State" required value={newEmployee.state} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter Postal Code</label>
          <input className={styles.employeeInput} name="postalCode" placeholder="Postal Code" required value={newEmployee.postalCode} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter Personal Phone Number</label>
          <input className={styles.employeeInput} name="phoneNumber" placeholder="Phone Number" required value={newEmployee.phoneNumber} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter Employee Department</label>
          <input className={styles.employeeInput} name="EmployeeDepartment" placeholder="Department" required value={newEmployee.EmployeeDepartment} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter Employee Title</label>
          <input className={styles.employeeInput} name="EmployeeTitle" placeholder="Title" required value={newEmployee.EmployeeTitle} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Please enter Employee Salary</label>
          <input className={styles.employeeInput} name="EmployeeSalary" placeholder="Salary" required value={newEmployee.EmployeeSalary} onChange={handleChange} />
        </div>

        <button className={styles.submitButton} type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeData