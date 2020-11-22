import React, {Fragment, useEffect, useState} from "react";

const Displayitems = () => {

    const [items, setItems] = useState([])

    const getItems = async() => {
        try{
            const response = await fetch("http://localhost:3000/inventory")
            const jsonData = await response.json();
            console.log(jsonData);
            setItems(jsonData);
            console.log(items);
        }catch(err){
            console.error(err.message)
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
    <Fragment>
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

export default Displayitems;