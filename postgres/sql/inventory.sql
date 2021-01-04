CREATE DATABASE inventory;

DROP TABLE items;

CREATE TABLE items
( id SERIAL PRIMARY KEY,
  name varchar(255),
  quantity INT,
  needed INT,
  div_num INT,
  category_id INT,
  CONSTRAINT cat_id
	FOREIGN KEY (category_id)
	REFERENCES categories (id)
 	ON UPDATE CASCADE
 	ON DELETE SET NULL,
  CONSTRAINT div_id
    FOREIGN KEY (div_num)
    REFERENCES divisions (div_num)
 	ON UPDATE CASCADE
    ON DELETE CASCADE
)