import * as React from 'react';
import { SPFI } from '@pnp/sp';
import { IDisplayListItemsProps } from './IDisplayListItemsProps';
import { getList } from '../../../pnpnjsConfig';
import { IEmployee } from '../../../interfaces';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import styles from './DisplayListItems.module.scss';

const ListItems = (props: IDisplayListItemsProps) => {
  const LIST_NAME = "EmployeeData";
  let _sp: SPFI = getList(props.context);

  const [listitems, setListItems] = React.useState<IEmployee[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const getListItems = async () => {
    try {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const items = _sp.web.lists.getByTitle(LIST_NAME).items();
      const data = await items;
      setListItems(data.map((item: any) => ({
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
      })));
    } catch (err) {
      setError('Failed to fetch list items');
      console.error('Failed to fetch list items:', err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getListItems()
      .then()
      .catch((error) => {
        console.error('Failed to fetch list items:', error);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.listitemscontainer}>
      {listitems.length > 0 ? (
        <table className={styles.employeetable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Address</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {listitems.map((item, index) => (
              <tr key={index}>
                <td data-label="Name">{item.EmployeeName}</td>
                <td data-label="Title">{item.EmployeeTitle}</td>
                <td data-label="Department">{item.EmployeeDepartment}</td>
                <td data-label="Salary">{item.EmployeeSalary}</td>
                <td data-label="Address">
                  {item.street}, {item.city}, {item.state} {item.postalCode}
                </td>
                <td data-label="Phone Number">{item.phoneNumber}</td>
              </tr>
            ))}
          </tbody>

        </table>
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
}

export default ListItems;
