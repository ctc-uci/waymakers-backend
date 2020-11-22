import React from 'react';
import AddItem from './AddItem';
// import DisplayItem from './DisplayItem';

const Inventory = () => (
  <div className="inventory">
    <h1 className="text-center mt-5">Warehouse #1</h1>
    <AddItem />
    {/* <DisplayItem /> */}
  </div>
);

export default Inventory;