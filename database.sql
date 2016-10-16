-- created table with id, task, and complete columns
CREATE TABLE tasks(
id SERIAL PRIMARY KEY,
task varchar(300),
complete boolean
);

-- altered complete so false would be default value on added tasks
ALTER TABLE tasks
ALTER complete SET DEFAULT FALSE;
