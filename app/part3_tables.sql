create table suppliers (
    id int primary key auto_increment,
    suppliersName text NOT NULL,
    contactNumber text
);

create table products (
    id int primary key auto_increment,
    productName text NOT NULL,
    price DECIMAL(10, 2),
    stockQuantity int DEFAULT 0,
    supplierID int,
    foreign key (supplierID) references suppliers (id) on delete CASCADE
);

create table sales (
    id int primary key auto_increment,
    productID int,
    quantitySold int NOT NULL,
    saleDate date NOT NULL,
    foreign key (productID) references products (id) on delete CASCADE
);