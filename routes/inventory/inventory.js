// Routes relating to inventory here
const express = require("express");
const app = express();
const pool = require("./db");
const port = 3000;

app.use(express.json())

//ROUTES//

//get all inventories

app.get("/inventories", async(req,res) => {
    try {
        const allInventories = await pool.query("SELECT * FROM inventory");
        res.json(allInventories.rows);
    } catch (err) {
        console.error(err.message);
        
    }

});

//get an inventory based on inventory id

app.get("/inventory/:id",async(req,res) => {
    const { id } = req.params;
    try {
        const inventory = await pool.query("SELECT * FROM inventory WHERE inventory_id = $1", [id]);
        res.json(inventory.rows[0]);
    } catch (err) {
        console.error(err.message);
        
    }
});


//creates an inventory

app.post("/inventories", async(req, res) => {
    try {
       const{ description } = req.body;
       const newInventory = await pool.query(
           "INSERT INTO inventory (description) VALUES ($1) RETURNING *",[description]);

       res.json(newInventory.rows[0]);
    } catch (err) {
        console.error(err.message);
        
    }

});    

//updates an inventory based on id

app.put("/inventories/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const{ description } = req.body;
        const updateInventory = await pool.query("UPDATE inventory SET description = $1 WHERE inventory_id = $2", [description, id]);
        res.json("Inventory was updated!");
    } catch (err) {
        console.error(err.message);
        
    }

});
    
//deletes an inventory based on id

app.delete("/inventories/:id", async (req,res)=>{
    try {
        const{id} = req.params;
        const deleteInventory = await pool.query("DELETE FROM inventory WHERE inventory_id = $1", [id]);
        res.json("Inventory was successfully deleted!");
    } catch (err) {
        console.error(err.message);
        
    }
})


  
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});