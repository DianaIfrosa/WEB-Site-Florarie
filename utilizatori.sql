
CREATE TABLE IF NOT EXISTS utilizatori (
   id serial PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   nume VARCHAR(100) NOT NULL,
   prenume VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   parola VARCHAR(100) NOT NULL,
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   rol VARCHAR(100) DEFAULT 'comun',
   imagine VARCHAR(200) 
 
);

CREATE TABLE IF NOT EXISTS accesari (
   id serial PRIMARY KEY,
   ip VARCHAR(100) NOT NULL,
   user_id INT NULL REFERENCES utilizatori(id),
   pagina VARCHAR(100) NOT NULL,
   data_accesare TIMESTAMP DEFAULT current_timestamp
);