import React, { Fragment, useState } from "react";

// Add item menu here
const AddItem = () => {
  //name of item
  const [name, setName] = useState("");
  //quantity of item currently in stock
  const [quantity, setQuantity] = useState(0);
  //quantity of item currently needed
  const [needed, setNeeded] = useState(0);
  //category of item
  const [category, setCategory] = useState("");

  //name of category to add
  const [label, setLabel] = useState("");

  const onSubmitAddItem = async (e) => {
    //e.preventDefault();
    try {
      const body = { name, quantity, needed, category };
      const response = await fetch("http://localhost:3000/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onSubmitAddCategory = async (e) => {
    //e.preventDefault();
    try {
      const body = { label };
      const response = await fetch("http://localhost:3000/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      {/**ADD ITEM BUTTON */}
      <form className="d-flex flex-column" onSubmit={onSubmitAddItem}>
        <input
          type="text"
          className="form-control"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          value={needed}
          onChange={(e) => setNeeded(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Item Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>
      {/**ADD CATEGORY BUTTON */}
      <form className="d-flex flex-column" onSubmit={onSubmitAddCategory}>
        <input
          type="text"
          className="form-control"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button className="btn btn-success">Add Category</button>
      </form>
    </Fragment>
  );
};

export default AddItem;
