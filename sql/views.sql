CREATE VIEW projekt.rezerwacje_pokoi AS
SELECT id_hotel, h.nazwa as nazwa_hotelu, p.id_pokoj, r.id_rezerwacja, data_rozpoczecia, data_zakonczenia, id_gosc, opis as status, s.id_status
from projekt.hotel h 
JOIN projekt.pokoj p using(id_hotel)
JOIN projekt.rezerwacja_pokoj using(id_pokoj)
JOIN projekt.rezerwacja r using(id_rezerwacja)
JOIN projekt.gosc using(id_gosc)
JOIN projekt.status_rezerwacji s using(id_status);

CREATE VIEW projekt.zajete_pokoje AS
SELECT DISTINCT id_pokoj FROM projekt.pokoj 
JOIN projekt.rezerwacja_pokoj using(id_pokoj)
JOIN projekt.rezerwacja using(id_rezerwacja)
JOIN projekt.gosc using (id_gosc)
WHERE id_status <= 3;

CREATE VIEW projekt.wolne_pokoje AS
with cte as (SELECT id_pokoj FROM projekt.pokoj
EXCEPT 
SELECT id_pokoj from projekt.zajete_pokoje)
SELECT * FROM cte ORDER BY 1;

CREATE VIEW projekt.opis_pokoi AS
SELECT id_pokoj, pietro, pok.id_hotel, nazwa as typ_standardu,
CASE 
    WHEN z_lazienka = true THEN 'Tak'
    ELSE 'Nie'
END AS z_lazienka,
CASE 
    WHEN dla_palacych = true THEN 'Tak'
    ELSE 'Nie' 
END AS dla_palacych,
ilosc_miejsc, cena
FROM projekt.pokoj pok JOIN projekt.standard using(id_standard)
JOIN projekt.cennik using(id_standard, id_hotel);

CREATE VIEW projekt.uslugi_w_hotelach AS
SELECT id_hotel, usl.id_usluga, usl.nazwa, cena from projekt.hotel
RIGHT JOIN projekt.hotel_usluga using(id_hotel)
RIGHT JOIN projekt.usluga usl using(id_usluga);

CREATE VIEW projekt.pracownicy_w_hotelach AS
SELECT id_hotel, nazwa as nazwa_hotelu, id_pracownik, imie, nazwisko, telefon, email, wynagrodzenie, wlasciciel
FROM projekt.hotel JOIN projekt.pracownik_hotel using(id_hotel)
JOIN projekt.pracownik using(id_pracownik);

CREATE VIEW projekt.goscie_w_pokojach AS
SELECT id_hotel, id_pokoj, g.id_gosc, imie, nazwisko, telefon, email
FROM projekt.pokoj JOIN projekt.rezerwacja_pokoj using(id_pokoj)
JOIN projekt.rezerwacja using(id_rezerwacja)
JOIN projekt.gosc g using(id_gosc);

CREATE VIEW projekt.wlasciciele_hoteli AS
SELECT pr.id_pracownik, imie, nazwisko, 
h.id_hotel, nazwa, miejscowosc from projekt.hotel h 
JOIN projekt.pracownik_hotel using(id_hotel) 
JOIN projekt.pracownik pr using(id_pracownik) 
WHERE wlasciciel = true;

CREATE VIEW projekt.opis_hotelu AS
SELECT h.id_hotel, nazwa, miejscowosc, 
CASE 
    WHEN posiada_winde = true THEN 'Tak'
    ELSE 'Nie'
END AS posiada_winde, adres_www, 
(imie || ' ' || nazwisko) as wlasciciel_hotelu,
pr.id_pracownik from projekt.hotel h join projekt.pracownik_hotel using(id_hotel)
join projekt.pracownik pr using(id_pracownik) where wlasciciel = true;


CREATE VIEW projekt.standardy_w_hotelach AS
SELECT h.id_hotel, st.id_standard, st.nazwa, cena
FROM projekt.standard st 
LEFT JOIN projekt.cennik using(id_standard)
JOIN projekt.hotel h using(id_hotel);
