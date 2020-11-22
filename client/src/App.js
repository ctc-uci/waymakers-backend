import React, {Fragment, Component} from "react";
import './App.css';

//components
import AddItem from './components/AddItem';
import DisplayItem from './components/DisplayItem';
import Menoo from './components/Category';

class App extends Component {
  render() {
    return (
      <Fragment>
        <div className="container">
          <DisplayItem />
        </div>
      </Fragment>
    );
  }  
}

export default App;
