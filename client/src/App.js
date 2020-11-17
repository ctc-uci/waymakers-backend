import React, {Fragment} from "react";

import './App.css';

//components
import AddItem from './components/AddItem';

function App() {
  return (
    <Fragment>
      <div className="container">
        <AddItem />
      </div>
    </Fragment>
  );
}

export default App;
