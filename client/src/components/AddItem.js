import e from 'express';
import React, {Fragment, useState} from 'react';

const AddItem = () => {

    //name of item
    const [name, setName] = useState("");
    //quantity of item currently in stock
    const [quantity, setQuantity] = useState(0);
    //quantity of item currently needed
    const [needed, setNeeded] = useState(0);
    //category of item
    const [category, setCategory] = useState("");
    
    const onSubmitForm = async e => {
        e.preventDefault();
        try{
            const body={name, quantity, needed};
        }catch(err){
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <h1 className="text-center mt-5">Warehouse #1</h1>
            <form className="d-flex flex-column">
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)}/>
                <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                <input type="number" className="form-control" value={needed} onChange={e => setNeeded(e.target.value)}/>
                <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)}/>
                <button className="btn btn-success">Add</button>
            </form>
        </Fragment>
    )
}

export default AddItem;