CREATE TABLE item
( id SERIAL PRIMARY KEY,
  name varchar(255),
  quantity INT,
  needed INT,
  warehouse_num INT,
  category_id INT,
  last_edited TIMESTAMP,
  CONSTRAINT cat_id
	FOREIGN KEY (category_id)
	REFERENCES category (id)
 	ON UPDATE CASCADE
 	ON DELETE SET null,
  CONSTRAINT warehouse_id
    FOREIGN KEY (warehouse_num)
    REFERENCES warehouse (warehouse_num)
 	ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE division
(
    id SERIAL PRIMARY KEY,
    div_name varchar(255),
);

CREATE TABLE item_category
( id SERIAL PRIMARY KEY,
  label varchar(255)
);

CREATE TABLE warehouse
(
    id SERIAL PRIMARY KEY,
    warehouse_name varchar(255),
    div_num INT,
    CONSTRAINT div_id 
        FOREIGN KEY (div_num)
        REFERENCES division (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
