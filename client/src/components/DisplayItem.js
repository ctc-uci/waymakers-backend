import React, {Fragment, useEffect, useState, Component} from "react";
import ScrollMenu from 'react-horizontal-scrolling-menu';



// const MenuItem = ({ label, selected }) => {

//     return(
//         <button onClick= {() => setCategory(label)}>{label}</button>
//     );
//   };

// const list = [ <MenuItem label="potato"/>
   
// ];


// const category =({label}) => {
//    label: {label}
//     }
// //   All items component
  
  
  
//   class App extends Component {
//     state = {
//       selected: 0
//     };
    
//     onSelect = key => {
//       this.setState({ selected: key });
//     }
  
    
//     render() {
//       const { selected } = this.state;
//       // Create menu from items
//       const menu = Menu(list, selected);
  
//       return (
//         <div className="App">
//           <ScrollMenu
//             data={menu}
//             arrowLeft={ArrowLeft}
//             arrowRight={ArrowRight}
//             selected={selected}
//             onSelect={this.onSelect}
//           />
//         </div>
//       );
//     }
//   }



const list = [ {label:"undefined"}, {label:"fruit"}

];

const allCategories = new Set(['undefined','fruit']);

const AddItem = () => {

    //name of item
    const [name, setName] = useState("");
    //quantity of item currently in stock
    const [quantity, setQuantity] = useState(0);
    //quantity of item currently needed
    const [needed, setNeeded] = useState(0);
    //category of item
    const [category, setCategory] = useState("");
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try{
            const body={name, quantity, needed, category};
            const response = await fetch("http://localhost:3000/inventory",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            if (!allCategories.has(category)){
                allCategories.add(category);
                list.push({label:category});
            };
            console.log(list);
            console.log(response);
        }catch(err){
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <h1 className="text-center mt-5">Warehouse #1</h1>
            <form className="d-flex flex-column" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)}/>
                <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                <input type="number" className="form-control" value={needed} onChange={e => setNeeded(e.target.value)}/>
                <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)}/>
                <button className="btn btn-success">Add</button>
            </form>
        </Fragment>
    )
}


const Displayitems = () => {

    const [items, setItems] = useState([])
    const[selectedCategory, setSelectedCategory] = useState('')
    const [numItems, setNumItems] = useState(0); 


    const MenuItem = ({ label, selected }) => {


        
    const onClickMenuItem = () => {

     setSelectedCategory(label);
        console.log(label); 
        // console.log(selectedCategory);
        
    }
        return(
            <div className="menu-item" onClick= {onClickMenuItem}>{label}</div>
            
        );
      };
    
    


    
    
    //   All items component
      
      
      
      class App extends Component {
        state = {
          selected: 0
        };
        
        onSelect = key => {
          this.setState({ selected: key });
        }
      
        
        render() {
          const { selected } = this.state;
          // Create menu from items
          const menu = Menu(list, selected);
      
          return (
            <div className="App">
              <ScrollMenu
                data={menu}
                arrowLeft={ArrowLeft}
                arrowRight={ArrowRight}
                selected={selected}
                onSelect={this.onSelect}
              />
            </div>
          );
        }
      }

    const Menu = (list) => list.map(el => {
    const { label } = el;
  
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
  
  const Menoo = () => {
      // Create menu from items
      const menu = [Menu(list, 0)];

      const setMenu = (list) => {
          menu[0] = Menu(list, 0);
      };

      useEffect(() => {
        setMenu(list);
    }, [list]);


      return (
        <div className="App">
          <ScrollMenu
            data={menu[0]}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={0}
  
          />
        </div>
      );
  }




    const getItems = async(category) => {
        try{
            const response = await fetch(`http://localhost:3000/inventory/${category}`)
            const jsonData = await response.json();
            console.log(jsonData);
            setItems(jsonData);
            setNumItems(items.length);
            console.log(list);
        }catch(err){
            console.error(err.message)
        }
    };

    useEffect(() => {
        getItems(selectedCategory);
    }, [selectedCategory, numItems]);

  

    return (
    <Fragment>
        <AddItem/>
        <Menoo/>
        <table className="table mt-5 text-center">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>In stock</th>
                    <th>Number needed</th>
                </tr>
            </thead>
            <tbody>
                {/** 
                <tr>
                    <td>John</td>
                    <td>Doe</td>
                    <td>john@example.com</td>
                </tr>
                */}
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




export default Displayitems;