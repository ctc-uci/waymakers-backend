import React, {Fragment, Component} from "react";
import './App.css';

//components
import Inventory from './components/inventory/inventory';

class App extends Component {
  render() {
    return (
      <Fragment>
        <div className="container">
          <Inventory/>
        </div>
      </Fragment>
    );
  }  
}

export default App;
