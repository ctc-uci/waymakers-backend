import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
//import './App.css';

// list of items
const list = [
  { name: 'Category1' },
  { name: 'Category2' },
  { name: 'Category3' },
  { name: 'Category4' },
  { name: 'Category5' },
  { name: 'Category6' },
  { name: 'Category7' },
  { name: 'Category8' },
  { name: 'Category9' }
];

// One item component
// selected prop will be passed
const MenuItem = ({ text, selected }) => {
  return (
    <div
      className="menu-item"
    >
      {text}
    </div>
  );
};

// All items component

export const Menu = (list) => list.map(el => {
  const { name } = el;

  return (
    <MenuItem
      text={name}
      key={name}
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
    const menu = Menu(list, 0);

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
export default Menoo;