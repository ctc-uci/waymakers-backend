import React, { useEffect, useState } from "react";
import EditableItem from "./EditableItem";

const Table = (props) => {
  const [items, setItems] = useState(props.items);
  const [editing, setEditing] = useState(false);

  // Object to store edits made to table
  // Passed to each row, and appended to when a change is made
  const [edits, setEdits] = useState({ updated: {}, deleted: [] });

  useEffect(() => {
    setItems(props.items);
  }, [props]);

  // Sends edits once saved
  const saveEdits = async (e) => {
    // Updating edited values
    for (const id in edits["updated"]) {
      console.log(id, edits["updated"][id]);
      try {
        const response = await fetch(`http://localhost:3000/inventory/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(edits["updated"][id]),
        });
      } catch (err) {
        console.log(err.message);
      }
    }
    
    // Deleting items
    edits["deleted"].forEach( async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/inventory/${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" }
            });
          } catch (err) {
            console.log(err.message);
          }
    })

    console.log("Edits saved");
  };
  // Reset items to original state
  const cancelEdits = () => {
    console.log("Edits Canceled");
  };

  // Handles button presses
  const handleClick = (e) => {
    console.log("Button Clicked: ", e.target.id);
    if (e.target.id === "save-edit") {
      console.log("Saving edit");
      saveEdits();
    } else if (e.target.id === "cancel-edit") {
      console.log("Canceling edit");
      cancelEdits();
    }
    setEditing(!editing);
  };

  // TODO REMOVE
  const testFunc = (e) => {
    console.log("Printing props.items: ", edits);
  };

  // Splits "Edit" button into "Cancel" and "Save" buttons
  const EditButton = () => {
    const editButtonPair = (
      <div>
        <button id="cancel-edit" onClick={handleClick}>
          Cancel
        </button>
        <button id="save-edit" onClick={handleClick}>
          Save
        </button>
      </div>
    );
    const editButton = (
      <button id="start-edit" onClick={handleClick}>
        Edit
      </button>
    );
    return editing ? editButtonPair : editButton;
  };

  return (
    <div className="table">
      <EditButton />
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>In stock</th>
            <th>Number needed</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <EditableItem
              key={item.id}
              item={item}
              edits={edits}
              editable={editing}
              modified={false}
            />
          ))}
        </tbody>
      </table>
      <button id="testButton" onClick={testFunc}>
        Testing Button
      </button>
    </div>
  );
};

export default Table;
