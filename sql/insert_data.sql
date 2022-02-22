
insert into projekt.hotel(id_hotel, nazwa, miejscowosc, posiada_winde, adres_www) values
(1,'Varsovia',    'Warszawa', true,   'www.varsovia.com'),
(2,'Pod bukiem',  'Kraków', true,     'www.hotelpodbukiem.pl'),
(3,'Sokół',       'Poznań', false,    'www.hotelsokol.pl'),
(4,'Tricity',     'Gdańsk', true,     'www.tricityhotel.com');

insert into projekt.pracownik(id_pracownik, imie, nazwisko, telefon, email, haslo) values
(1,	'Janusz',   'Cebula',   '648972515', 'cebula@xyz.com',   'qwerty'),
(2,	'Barbara',  'Pasek',    '936252548', 'pasek@xyz.com',    'qwerty'),
(3,	'Mariusz',  'Pieczarka','101530544', 'pieczarka@xyz.com','qwerty'),
(4,	'Józefa',   'Janowska', '657483921', 'jozjan@xyz.com',   'qwerty'),
(5,	'Bogumiła', 'Ptaszek',  '764283638', 'bptaszek@xyz.com', 'qwerty'),
(6,	'Henryk',   'Dąb',      '298437517', 'hdab@xyz.com',     'qwerty'),
(7,	'Kacper',   'Kamyk',    '434653278', 'kamyk@xyz.com',    'qwerty'),
(8,	'Stanisław','Leśniak',  '453657876', 'stanles@xyz.com',  'qwerty'),
(9,	'Patryk',   'Jastrząb', '234256819', 'patjas@xyz.com',   'qwerty'),
(10,'Edward',  'Bielik',   '987234254', 'ebielik@xyz.com',  'qwerty'),
(11,'Andrzej', 'Orzeł',    '546472724', 'aorzel@xyz.com',   'qwerty'),
(12,'Karolina','Kawka',    '325346363', 'kawka@xyz.com',    'qwerty'),
(13,'Piotr',   'Czosnek',  '765448456', 'czosnek@xyz.com',  'qwerty'),
(14,'Natalia', 'Mostek',   '865856854', 'nmostek@xyz.com',  'qwerty'),
(15,'Grzegorz','Kop',      '977644667', 'gkop@xyz.com',     'qwerty'),
(16,'Zyta',    'Nadmorska','529456335', 'nadmorska@xyz.com','qwerty');

insert into projekt.pracownik_hotel (id_pracownik, wynagrodzenie, wlasciciel, id_hotel ) values
(1, 13000, true, 1),
(2, 3000, false, 1),
(3, 4000, false, 1),
(4, 5000, false, 1),
(5, 23000, true, 2),
(6, 6000, false, 2),
(7, 4000, false, 2),
(8, 4000, false, 2),
(9, 13000, true, 3),
(10, 4000, false, 3),
(11, 2000, false, 3),
(12, 5000, false, 3),
(13, 65000, true, 4),
(14, 4000, false, 4),
(15, 6000, false, 4),
(16, 6000, false, 4);

-- pozmieniać opisy
insert into projekt.standard (id_standard, nazwa, z_lazienka, dla_palacych, ilosc_miejsc) values
(1,'Standard', true, false, 3),
(2,'Standard mini', true, false, 2),
(3,'Economy', false, false, 4),
(4,'Extra', true, false, 3),
(5,'Solo', false, false, 1),
(6,'Premium', true, false, 2),
(7,'Rodzinny', true, false, 5),
(8,'B&B', false, false, 2),
(9,'Dla nowożeńców', true, true, 2),
(10,'Dla dzieci', true, false, 3),
(11,'Business', true, false, 1),
(12,'Standard dla palących', false, true, 3),
(13,'Economy dla palących', false, true, 4),
(14,'Extra dla palących', true, true, 3),
(15,'Premium dla palących', true, false, 2),
(16,'Business dla palących', true, true, 1);

insert into projekt.cennik (id_hotel, id_standard, cena) values
(1,1,50.00),    (1,2,40.00),    (1,3,35.00),    (1,4,70.00),
(1,12,55.00),   (1,13,40.00),   (1,14,75.00),
(2,1,60.00),    (2,3,50.00),    (2,4,70.00),    (2,5,65.00),    
(2,6,90.00),    (2,7,40.00),    (2,8,35.00),    (2,9,70.00),    
(3,1,40.00),    (3,3,25.00),    (3,4,55.00),    (3,8,20.00),
(4,1,80.00),    (4,2,75.00),    (4,5,85.00),    (4,6,120.00),    
(4,7,80.00),    (4,8,50.00),    (4,9,100.00),   (4,10,50.00),   
(4,11,130.00),  (4,12,90.00),   (4,15,130.00),  (4,16,140.00);

insert into projekt.pokoj (id_pokoj, id_hotel, pietro, id_standard) values
(1, 1,1,12),    (2, 1,1,12),    (3, 1,1,13),    (4, 1,1,13),    (5, 1,1,14),
(6, 1,2,1),     (7, 1,2,1),     (8, 1,2,2),     (9, 1,2,3),     (10, 1,2,3),
(11, 1,3,4),    (12, 1,3,4),    (13, 1,3,2),    (14, 1,3,1),    (15, 1,3,1),
(16, 2,1,1),    (17, 2,1,1),    (18, 2,1,3),    (19, 2,1,3),    (20, 2,1,8),
(21, 2,2,8),    (22, 2,2,5),    (23, 2,2,5),    (24, 2,2,7),    (25, 2,2,7),
(26, 2,3,6),    (27, 2,3,4),    (28, 2,3,4),    (29, 2,3,9),    (30, 2,3,9),
(31, 3,1,8),    (32, 3,1,8),    (33, 3,1,1),    (34, 3,1,1),    (35, 3,1,3),
(36, 3,2,3),    (37, 3,2,4),    (38, 3,2,4),    (39, 3,2,1),    (40, 3,2,1),
(41, 4,1,12),   (42, 4,1,15),   (43, 4,1,16),   (44, 4,1,1),    (45, 4,1,1),
(46, 4,2,2),    (47, 4,2,2),    (48, 4,2,8),    (49, 4,2,8),    (50, 4,2,7),
(51, 4,3,7),    (52, 4,3,10),   (53, 4,3,5),    (54, 4,3,5),    (55, 4,3,7),
(56, 4,4,6),    (57, 4,4,6),    (58, 4,4,11),   (59, 4,4,9),    (60, 4,4,9);

insert into projekt.usluga values
(1,'Sprzątanie'),
(2,'Telewizja dodatkowe kanały'),
(3,'Żelazko'),
(4,'Odkurzacz'),
(5,'Dostawa jedzenia'),
(6,'Serwis'),
(7,'Salon gier'),
(8,'Basen'),
(9,'Kręgielnia'),
(10,'Sala kinowa');

insert into projekt.hotel_usluga values
(1,1,20),(1,2,15),(1,3,10),(1,4,10),
(2,1,25),(2,2,18),(2,3,12),(2,4,10),(1,6,20),(1,9,25),(1,10,22),
(3,2,8), (3,3,8),
(4,1,30),(4,2,20),(4,3,15),(4,4,15),(4,5,20),(4,6,30),(4,7,25),(4,8,40),(4,9,35),(4,10,30);
 
insert into projekt.status_rezerwacji values
(1,'w toku'),
(2,'wykupiona'),
(3,'zaakceptowana'),
(4,'odrzucona'),
(5,'anulowano'),
(6,'zakończona');

insert into projekt.gosc values
(1,  'Janusz',    'Nowak',       '243598762', 'jnw@xyz.com',         'haslo', 20000),
(2,  'Piotr',     'Nowak',       '124235362', 'pn@xyz.com',          'haslo', 5000),
(3,  'Grażyna',   'Nowak',       '744272457', 'gn@xyz.com',          'haslo', 5000),
(4,  'Janina',    'Sarnin',      '457275725', 'jansar@xyz.com',      'haslo', 30000),
(5,  'Bogdan',    'Strzała',     '876476835', 'bogstr@xyz.com',      'haslo', 20000),
(6,  'Leszek',    'Orzechowski', '753683685', 'orzechowski@xyz.com', 'haslo', 10000),
(7,  'Ursyn',     'Niedźwiedź',  '575567838', 'niedzwiedz@xyz.com',  'haslo', 10000),
(8,  'Agata',     'Dębowicz',    '836836835', 'adebowicz@xyz.com',   'haslo', 10000),
(9,  'Feliks',    'Kot',         '876864869', 'felkot@xyz.com',      'haslo', 4000),
(10, 'Bonifacy',  'Kot',         '973556736', 'bonkot@xyz.com',      'haslo', 4000),
(11, 'Filemon',   'Kot',         '836585365', 'filkot@xyz.com',      'haslo', 4000),
(12, 'Sabina',    'Szybka',      '835863866', 'szybka@xyz.com',      'haslo', 10000),
(13, 'Sławomir',  'Szybki',      '865388568', 'szybki@xyz.com',      'haslo', 10000),
(14, 'Leszek',    'Szary',       '936583568', 'lszary@xyz.com',      'haslo', 50000),
(15, 'Daniel',    'Jeleń',       '636538336', 'jelen@xyz.com',       'haslo', 60000),
(16, 'Mikołaj',   'Mikołajczyk', '856856536', 'mikmik@xyz.com',      'haslo', 50000),
(17, 'Bogumiła',  'Cegła',       '835356836', 'bcegla@xyz.com',      'haslo', 20000),
(18, 'Mścisław',  'Cegła',       '985253256', 'mcegla@xyz.com',      'haslo', 20000),
(19, 'Arkadiusz', 'Robotny',     '785865923', 'robotny@xyz.com',     'haslo', 27050),
(20, 'Aneta',     'Lisek',       '986519625', 'lisek@xyz.com',       'haslo', 32000),
(21, 'Zofia',     'Perłowicz',   '672457474', 'zperlowicz@xyz.com',  'haslo', 100000),
(22, 'Konrad',    'Perłowicz',   '754574727', 'kperlowicz@xyz.com',  'haslo', 100000),
(23, 'Oskar',     'Perłowicz',   '724574524', 'operlowicz@xyz.com',  'haslo', 20000),
(24, 'Amelia',    'Perłowicz',   '823579875', 'aperlowicz@xyz.com',  'haslo', 20000),
(25, 'Igor',      'Kowalewski',  '839763452', 'kowalewski@xyz.com',  'haslo', 100000),
(26, 'Dariusz',   'Pień',        '984362932', 'dpien@xyz.com',       'haslo', 50000),
(27, 'Mariusz',   'Pień',        '903511854', 'mpien@xyz.com',       'haslo', 50000),
(28, 'Miron',     'Masło',       '572052052', 'mirmas@xyz.com',      'haslo', 30000),
(29, 'Kornelia',  'Kaplica',     '745245745', 'kaplica@xyz.com',     'haslo', 20000),
(30, 'Natalia',   'Ząb',         '754274752', 'natzab@xyz.com',      'haslo', 50000);

insert into projekt.rezerwacja values
(1, '2022-01-01', '2022-01-31', 1,1),
(2, '2022-01-02', '2022-01-30', 2,2),
(3, '2022-01-03', '2022-01-12', 3,3),
(4, '2022-01-04', '2022-01-13', 1,4),
(5, '2022-01-05', '2022-01-15', 5,5),
(6, '2022-01-06', '2022-01-08', 1,6),
(7, '2022-01-07', '2022-01-13', 1,7),
(8, '2022-01-08', '2022-01-16', 2,8),
(9, '2022-01-09', '2022-01-19', 2,9),
(10,'2022-01-10', '2022-01-24', 2,10),
(11,'2022-01-11', '2022-01-15', 3,11),
(12,'2022-01-12', '2022-01-18', 3,12),
(13,'2022-01-13', '2022-01-17', 3,13),
(14,'2022-01-14', '2022-01-18', 3,14),
(15,'2022-01-15', '2022-01-21', 3,15),
(16,'2022-01-16', '2022-01-18', 5,16),
(17,'2022-01-17', '2022-01-18', 5,17),
(18,'2022-01-18', '2022-01-31', 3,18);

insert into projekt.rezerwacja_pokoj(id_rezerwacja, id_pokoj) values
(1,1),(2,2),(3,4),(4,6),(5,7),(6,9),(7,8),(8,12),(9,9),(10,11),(11,16),
(12,17),(13,28),(14,29),(15,37),(16,43),(17,44),(18,56);
