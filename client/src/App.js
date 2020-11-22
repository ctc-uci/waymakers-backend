import React, {Fragment} from "react";

import './App.css';

//components
import Inventory from "./components/inventory/inventory";

function App() {
  return (
    <Fragment>
      <div className="container">
        <Inventory />
      </div>
    </Fragment>
  );
}

export default App;
