CREATE DATABASE site_db ENCODING 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

CREATE USER  diana WITH ENCRYPTED PASSWORD 'diana';
GRANT ALL PRIVILEGES ON DATABASE site_db TO diana;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO diana;

DROP TYPE IF EXISTS categorie_mare;
DROP TYPE IF EXISTS categorie_mica;
DROP TYPE IF EXISTS culori;

CREATE TYPE categorie_mica AS ENUM( 'margarete', 'trandafiri','crini', 'lalele', 'orhidee', 'crizanteme', 'bujori', 'floarea-soarelui');
CREATE TYPE categorie_mare AS ENUM( 'buchet', 'criogenat', 'cutie');
CREATE TYPE culori AS ENUM( 'roz','rosu', 'albastru', 'galben', 'mov', 'alb', 'multicolor');

CREATE TABLE IF NOT EXISTS flori(

   id serial PRIMARY KEY, --a
   nume VARCHAR(50) NOT NULL, --b
   descriere TEXT,  --c
   imagine VARCHAR(300), --calea imaginii, d
   tip categorie_mare DEFAULT 'buchet', --e
   flori_predominante categorie_mica DEFAULT 'trandafiri',--f
   pret NUMERIC(8) NOT NULL,--g
   nr_fire NUMERIC(8) NOT NULL,--h
   data_adaugare TIMESTAMP DEFAULT current_timestamp,--i
   culoare culori DEFAULT 'multicolor',--j
   recomandare VARCHAR[], --k, recomandare anotimp
   la_promotie BOOLEAN NOT NULL DEFAULT FALSE --l
   
);

INSERT into flori (nume, descriere, tip, flori_predominante, pret, nr_fire, culoare, recomandare, la_promotie, imagine) VALUES 
('Buchet orhidee', 'Un minunat buchet de orhidee creat de echipa noastra','buchet', 'orhidee', 300, 9, 'alb', '{"vara", "primavara"}', False, 'buchetorhidee.jpg'),

('Floarea-soarelui', 'Floarea-soarelui in cupola de sticla ','criogenat', 'floarea-soarelui', 60, 1, 'galben', '{"vara", "primavara", "toamna"}', False, 'fsoareluicriog.jpg'),

('Buchet mireasa', 'Flori pentru o ocazie speciala','buchet', 'crini', 250, 13, 'alb', '{"vara", "primavara", "toamna"}', False, 'buchetmireasa.jpg'),
('Buchet roz', 'Buchet roz de diverse flori','buchet', 'trandafiri', 150, 11, 'rosu', '{"vara"}', True, 'buchetmixt2.jpg'),
('Trandafiri', 'Trandafirii roz sunt nelipsiti!','buchet', 'trandafiri', 400, 17, 'roz', '{"vara", "primavara", "toamna", "iarna"}', False, 'buchettrandafiri.jpg'),
('Flori mov', 'Un buchet de flori mov asigura succesul unui cadou','buchet', 'margarete', 150, 5, 'mov', '{"iarna", "toamna"}', False, 'florimov.jpg'),
('RosesBox', 'O minunata cutie de tradafiri creata de echipa noastra','cutie', 'trandafiri', 350,21, 'alb', '{"vara", "primavara", "toamna", "iarna"}', True, 'cutietrandafiri.jpg'),
('Bujori', 'Bujori roz','buchet', 'bujori', 165, 7, 'roz', '{"vara", "primavara"}', True, 'bujori.jpg'),
('Floarea-soarelui', 'Floarea-soarelui in vaza','buchet', 'floarea-soarelui', 120, 5, 'galben', '{"toamna"}', False, 'floareasoarelui.jpg'),
('Trandafir criogenat', 'Surprinde-i pe cei din jur cu un tradafir criogenat!','criogenat', 'trandafiri', 90, 1, 'rosu', '{"vara", "primavara", "toamna", "iarna"}', True, 'criog1.jpg'),
('Trandafir criogenat', 'Trandafir etern, criogenat','criogenat', 'trandafiri', 100, 1, 'mov', '{"vara", "primavara", "toamna", "iarna"}', False, 'criog2.jpg'),
('Trandafir criogenat', 'Trandafir care nu se ofileste','criogenat', 'trandafiri', 95, 1, 'albastru', '{"vara", "primavara", "toamna", "iarna"}', False, 'criog3.jpg'),

('Cutie mixta', 'Cutie eleganta de flori','cutie', 'crizanteme', 265, 15, 'galben', '{"vara", "toamna"}', True, 'cutie1.jpg'),
('Cutie lalele', 'Cutie vibranta de lalele','cutie', 'lalele', 185, 13, 'galben', '{"primavara"}', False, 'cutielalele.jpg'),
('Cutie colorata', 'Cutie de flori eleganta','cutie', 'trandafiri', 160, 19, 'multicolor', '{"vara", "primavara","toamna"}', True, 'cutie2.jpg'),
('Lalele colorate', 'Buchet de lalele colorate prin hidratare','buchet', 'lalele', 200, 15, 'albastru', '{"toamna", "iarna"}', True, 'lalelecolorate.jpg');

--16 produse: 
-- criogenat: 4
-- cutie: 4
-- buchet:8
