import React, {Fragment, Component} from "react";
import './App.css';

//components
import DisplayItem from './components/DisplayItem';

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
