CREATE TABLE items
( id SERIAL PRIMARY KEY,
  name varchar(255),
  quantity INT,
  needed INT,
  div_num INT,
  warehouse_num INT,
  category_id INT,
  last_edited TIMESTAMP,
  CONSTRAINT cat_id
	FOREIGN KEY (category_id)
	REFERENCES categories (id)
 	ON UPDATE CASCADE
 	ON DELETE SET null,
  CONSTRAINT div_id
    FOREIGN KEY (div_num)
    REFERENCES divisions (div_num)
 	ON UPDATE CASCADE
    ON DELETE CASCADE
)