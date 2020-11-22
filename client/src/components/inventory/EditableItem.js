import React, { useState, useEffect } from "react";

// Converts table rows into forms when in Edit mode
const EditableItem = (props) => {
  const [name, setName] = useState(props.item.name);
  const [quantity, setQuantity] = useState(props.item.quantity);
  const [needed, setNeeded] = useState(props.item.needed);
  const [category, setCategory] = useState(props.item.category);

  // Used to track edits, and get item ID
  const [itemState, setItemState] = useState(props);

  // Used to update css class of items that
  // have been modified, but not saved
  const [modified, setModified] = useState(props.modified);

  useEffect(() => {
    setItemState(props);
  }, [props]);

  // Adds item id to list of items to be deleted
  const deleteItem = () => {
    console.log("Deleting Item");
    itemState.edits["deleted"].push(props.item.id);
    console.log(itemState.edits);
  };

  const updateEdits = (e) => {
    setModified(true);
    itemState.edits["updated"][props.item.id] = {
      name: name,
      quantity: quantity,
      needed: needed,
      category: category,
    };
    console.log("Updates: ", itemState.edits);
  };

  // Row to display when not in Edit mode
  const staticItem = (
    <tr>
      <td>{name}</td>
      <td>{quantity}</td>
      <td>{needed}</td>
      <td>{category}</td>
    </tr>
  );

  // Form is created in first column of each row, then each
  // column has an input that uses that form
  const formItem = (
    // CSS class to indicate that value has been changed
    // TODO: Add a separate css class for deleted items
    <tr className={modified ? "modified" : null}>
      <td>
        <form id={itemState.item.id}></form>
        <input
          form={itemState.item.id}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateEdits();
          }}
        />
      </td>
      <td>
        <input
          form={itemState.item.id}
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            updateEdits();
          }}
        />
      </td>
      <td>
        <input
          form={itemState.item.id}
          type="number"
          value={needed}
          onChange={(e) => {
            setNeeded(e.target.value);
            updateEdits();
          }}
        />
      </td>
      <td>
        <input
          form={itemState.item.id}
          type="text"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            updateEdits();
          }}
        />
      </td>
      <td>
        <button onClick={deleteItem}>Delete</button>
      </td>
    </tr>
  );

  // Decides which table row to show, dependant on Edit mode
  return props.editable ? formItem : staticItem;
};

export default EditableItem;
