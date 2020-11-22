import React, {Fragment, useEffect, useState} from "react";
import ScrollMenu from 'react-horizontal-scrolling-menu';

const DisplayItem = () => {

    /**STATE VARIABLES */

    //Current list of items to display
    const [items, setItems] = useState([])
    //Current selected category of items to display
    const[selectedCategory, setSelectedCategory] = useState('')
    //Current list of categories (in scroll menu)
    const [categoryList, setCategoryList] = useState([{label:"Show All Categories"}]);

  /************************ ALL ADDITEM ITEMS HERE********************/ 
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
  const [label, setLabel] = useState("")
  
  const onSubmitAddItem = async (e) => {
      //e.preventDefault();
      try{
          const body={name, quantity, needed, category};
          const response = await fetch("http://localhost:3000/inventory",{
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(body)
          });
          console.log(response);
      }catch(err){
          console.error(err.message);
      }
  }

  const onSubmitAddCategory = async (e) => {
    //e.preventDefault();
    try{
        const body={label};
        const response = await fetch("http://localhost:3000/category",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        console.log(response);
    }catch(err){
        console.error(err.message);
    }
}

  return (
      <Fragment>
          <h1 className="text-center mt-5">Warehouse #1</h1>
           {/**ADD ITEM BUTTON */}
          <form className="d-flex flex-column" onSubmit={onSubmitAddItem}>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)}/>
            <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)}/>
            <input type="number" className="form-control" value={needed} onChange={e => setNeeded(e.target.value)}/>
            <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)}/>
            <button className="btn btn-success">Add</button>
          </form>
          {/**ADD CATEGORY BUTTON */}
          <form className="d-flex flex-column" onSubmit={onSubmitAddCategory}>
            <input type="text" className="form-control" value={label} onChange={e => setLabel(e.target.value)}/>
            <button className="btn btn-success">Add Category</button>
          </form>
      </Fragment>
  )
}
 /************************ END ADDITEM ITEMS HERE********************/ 

   /********************** ALL SCROLL MENU ITEMS HERE********************/ 
    const MenuItem = ({ label, selected }) => {
      const onClickMenuItem = () => {
        setSelectedCategory(label);
        console.log(label); 
      }
      return(
          <div className="menu-item" onClick= {onClickMenuItem}>{label}</div>    
        );
      };

    const Menu = (list) => list.map(el => {
      const { id, label } = el;
  
      return (
        <MenuItem
          label={label}
          key = {label}
        />
      );
     });
  
  const Arrow = ({ text, className }) => {
    return (
      <div
        className={className}
      >{text}</div>
    );
  };
  

  const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
  const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });
  
  /**
  const Menoo = () => {
      // Create menu from items
      const menu = Menu(categoryList, 0);

      /**
      const setMenu = (list) => {
          menu[0] = Menu(list, 0);
      };

      useEffect(() => {
        setMenu(list);
    }, [list]);
    

      return (
        <div className="App">
          <ScrollMenu
            data={menu}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={0}
          />
        </div>
      );
  }
  */
 /********************** END SCROLL MENU ITEMS HERE********************/ 

  /********************** DISPLAY ITEMS HERE**************************/ 
    const getItems = async(selectedCategory) => {
        try{
            if (selectedCategory === "Show All Categories") setSelectedCategory("");
            const response = await fetch(`http://localhost:3000/inventory/${selectedCategory}`)
            const jsonData = await response.json();
            setItems(jsonData);
            console.log(items)
        }catch(err){
            console.error(err.message)
        }
    };

    const getCategories = async() => {
      try{
          const response = await fetch(`http://localhost:3000/category/`)
          const jsonData = await response.json();
          setCategoryList(jsonData);
          setMenu(Menu(categoryList, 0));
          console.log(categoryList);
      }catch(err){
          console.error(err.message)
      }
  };

  const [menu, setMenu] = useState(Menu(categoryList, 0));

    useEffect(() => {
        getItems(selectedCategory);
        getCategories();
    }, [selectedCategory]);


    return (
    <Fragment>
        <AddItem/>
        <div className="App">
          <ScrollMenu
            data={menu}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={0}
          />
        </div>
        <table className="table mt-5 text-center">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>In stock</th>
                    <th>Number needed</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.needed}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Fragment>
    )
};

export default DisplayItem;