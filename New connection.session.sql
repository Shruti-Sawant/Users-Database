show databases;
use delta_app;
create TABLE student
(
    id VARCHAR(50) primary key,
    username VARCHAR(50) unique,
    email VARCHAR(50) unique not null,
    password VARCHAR(50) not null 
);
show tables;
select * from student;
drop table user;
select count(*) from student;

