import React, { Fragment, useEffect, useState } from "react";
import AddItem from "./AddItem";
import Table from "./Table";
import ScrollMenu from "react-horizontal-scrolling-menu";

const DisplayItem = () => {
  /**STATE VARIABLES */
  //Current list of items to display
  const [items, setItems] = useState([]);
  //Current selected category of items to display
  const [selectedCategory, setSelectedCategory] = useState("");
  //Current list of categories (in scroll menu)
  const [categoryList, setCategoryList] = useState([
    { label: "Show All Categories" },
  ]);

  /********************** ALL SCROLL MENU ITEMS HERE********************/
  const MenuItem = ({ label, selected }) => {
    const onClickMenuItem = () => {
      setSelectedCategory(label);
      console.log(label);
    };
    return (
      <div className="menu-item" onClick={onClickMenuItem}>
        {label}
      </div>
    );
  };

  const Menu = (list) =>
    list.map((el) => {
      const { id, label } = el;

      return <MenuItem label={label} key={label} />;
    });

  const Arrow = ({ text, className }) => {
    return <div className={className}>{text}</div>;
  };

  const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
  const ArrowRight = Arrow({ text: ">", className: "arrow-next" });
  /********************** END SCROLL MENU ITEMS HERE********************/

  /********************** DISPLAY ITEMS HERE**************************/
  const getItems = async (selectedCategory) => {
    try {
      if (selectedCategory === "Show All Categories") setSelectedCategory("");
      const response = await fetch(
        `http://localhost:3000/inventory/${selectedCategory}`
      );
      const jsonData = await response.json();
      setItems(jsonData);
      console.log(items);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`http://localhost:3000/category/`);
      const jsonData = await response.json();
      setCategoryList(jsonData);
      setMenu(Menu(categoryList, 0));
      console.log(categoryList);
    } catch (err) {
      console.error(err.message);
    }
  };

  const [menu, setMenu] = useState(Menu(categoryList, 0));

  useEffect(() => {
    getItems(selectedCategory);
    getCategories();
  }, [selectedCategory]);

  return (
    <Fragment>
      <AddItem />
      <div className="App">
        <ScrollMenu
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={0}
        />
      </div>
      <Table items={items} />

{/* TODO: REMOVE old table */}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>In stock</th>
            <th>Number needed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.needed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default DisplayItem;
