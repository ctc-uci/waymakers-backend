import React, {Fragment} from "react";

import './App.css';

//components
import AddItem from './components/AddItem';
import DisplayItem from './components/DisplayItem';

function App() {
  return (
    <Fragment>
      <div className="container">
        <AddItem />
        <DisplayItem />
      </div>
    </Fragment>
  );
}

export default App;
