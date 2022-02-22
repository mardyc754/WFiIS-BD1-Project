CREATE SCHEMA projekt;

CREATE SEQUENCE projekt.status_rezerwacji_id_status_seq_1;

CREATE TABLE projekt.status_rezerwacji (
                id_status INTEGER NOT NULL DEFAULT nextval('projekt.status_rezerwacji_id_status_seq_1'),
                opis VARCHAR NOT NULL,
                CONSTRAINT status_rezerwacji_pk PRIMARY KEY (id_status)
);


ALTER SEQUENCE projekt.status_rezerwacji_id_status_seq_1 OWNED BY projekt.status_rezerwacji.id_status;

CREATE SEQUENCE projekt.usluga_id_usluga_seq;

CREATE TABLE projekt.usluga (
                id_usluga INTEGER NOT NULL DEFAULT nextval('projekt.usluga_id_usluga_seq'),
                nazwa VARCHAR NOT NULL,
                CONSTRAINT usluga_pk PRIMARY KEY (id_usluga)
);


ALTER SEQUENCE projekt.usluga_id_usluga_seq OWNED BY projekt.usluga.id_usluga;

CREATE SEQUENCE projekt.hotel_id_hotel_seq_2_1_1;

CREATE TABLE projekt.hotel (
                id_hotel INTEGER NOT NULL DEFAULT nextval('projekt.hotel_id_hotel_seq_2_1_1'),
                nazwa VARCHAR NOT NULL,
                miejscowosc VARCHAR NOT NULL,
                posiada_winde BOOLEAN NOT NULL,
                adres_www VARCHAR NOT NULL,
                CONSTRAINT hotel_pk PRIMARY KEY (id_hotel)
);


ALTER SEQUENCE projekt.hotel_id_hotel_seq_2_1_1 OWNED BY projekt.hotel.id_hotel;

CREATE SEQUENCE projekt.usluga_id_usluga_seq_1;

CREATE TABLE projekt.hotel_usluga (
                id_hotel INTEGER NOT NULL,
                id_usluga INTEGER NOT NULL DEFAULT nextval('projekt.usluga_id_usluga_seq_1'),
                cena NUMERIC(8,2) NOT NULL,
                CONSTRAINT hotel_usluga_pk PRIMARY KEY (id_hotel, id_usluga)
);


ALTER SEQUENCE projekt.usluga_id_usluga_seq_1 OWNED BY projekt.hotel_usluga.id_usluga;

CREATE SEQUENCE projekt.pracownik_id_pracownik_seq;

CREATE TABLE projekt.pracownik (
                id_pracownik INTEGER NOT NULL DEFAULT nextval('projekt.pracownik_id_pracownik_seq'),
                imie VARCHAR NOT NULL,
                nazwisko VARCHAR NOT NULL,
                telefon VARCHAR NOT NULL,
                email VARCHAR,
                haslo VARCHAR,
                CONSTRAINT pracownik_pk PRIMARY KEY (id_pracownik)
);


ALTER SEQUENCE projekt.pracownik_id_pracownik_seq OWNED BY projekt.pracownik.id_pracownik;

CREATE TABLE projekt.pracownik_hotel (
                id_pracownik INTEGER NOT NULL,
                wynagrodzenie NUMERIC(8,2) NOT NULL,
                wlasciciel BOOLEAN DEFAULT FALSE NOT NULL,
                id_hotel INTEGER NOT NULL
);


CREATE SEQUENCE projekt.standard_id_standard_seq_1;

CREATE TABLE projekt.standard (
                id_standard INTEGER NOT NULL DEFAULT nextval('projekt.standard_id_standard_seq_1'),
                nazwa VARCHAR NOT NULL,
                z_lazienka BOOLEAN NOT NULL,
                dla_palacych BOOLEAN NOT NULL,
                ilosc_miejsc INTEGER NOT NULL,
                CONSTRAINT standard_pk PRIMARY KEY (id_standard)
);


ALTER SEQUENCE projekt.standard_id_standard_seq_1 OWNED BY projekt.standard.id_standard;

CREATE TABLE projekt.cennik (
                id_hotel INTEGER NOT NULL,
                id_standard INTEGER NOT NULL,
                cena NUMERIC(8,2) NOT NULL,
                CONSTRAINT cennik_pk PRIMARY KEY (id_hotel, id_standard)
);


CREATE SEQUENCE projekt.gosc_id_gosc_seq_1;

CREATE TABLE projekt.gosc (
                id_gosc INTEGER NOT NULL DEFAULT nextval('projekt.gosc_id_gosc_seq_1'),
                imie VARCHAR NOT NULL,
                nazwisko VARCHAR NOT NULL,
                telefon VARCHAR NOT NULL,
                email VARCHAR,
                haslo VARCHAR,
                pieniadze NUMERIC(8,2) DEFAULT 0.00 NOT NULL,
                CONSTRAINT gosc_pk PRIMARY KEY (id_gosc)
);


ALTER SEQUENCE projekt.gosc_id_gosc_seq_1 OWNED BY projekt.gosc.id_gosc;

CREATE SEQUENCE projekt.rezerwacja_id_rezerwacja_seq;

CREATE TABLE projekt.rezerwacja (
                id_rezerwacja INTEGER NOT NULL DEFAULT nextval('projekt.rezerwacja_id_rezerwacja_seq'),
                data_rozpoczecia DATE NOT NULL,
                data_zakonczenia DATE NOT NULL,
                id_status INTEGER NOT NULL,
                id_gosc INTEGER NOT NULL,
                CONSTRAINT rezerwacja_pk PRIMARY KEY (id_rezerwacja)
);


ALTER SEQUENCE projekt.rezerwacja_id_rezerwacja_seq OWNED BY projekt.rezerwacja.id_rezerwacja;

CREATE SEQUENCE projekt.pokoj_id_pokoj_seq;

CREATE TABLE projekt.pokoj (
                id_pokoj INTEGER NOT NULL DEFAULT nextval('projekt.pokoj_id_pokoj_seq'),
                id_hotel INTEGER NOT NULL,
                pietro INTEGER NOT NULL,
                id_standard INTEGER NOT NULL,
                CONSTRAINT pokoj_pk PRIMARY KEY (id_pokoj)
);


ALTER SEQUENCE projekt.pokoj_id_pokoj_seq OWNED BY projekt.pokoj.id_pokoj;

CREATE TABLE projekt.rezerwacja_pokoj (
                id_rezerwacja INTEGER NOT NULL,
                id_pokoj INTEGER NOT NULL,
                CONSTRAINT rezerwacja_pokoj_pk PRIMARY KEY (id_rezerwacja)
);


ALTER TABLE projekt.rezerwacja ADD CONSTRAINT status_rezerwacji_rezerwacja_fk
FOREIGN KEY (id_status)
REFERENCES projekt.status_rezerwacji (id_status)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.hotel_usluga ADD CONSTRAINT us_uga_hotel_usluga_fk
FOREIGN KEY (id_usluga)
REFERENCES projekt.usluga (id_usluga)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.cennik ADD CONSTRAINT hotel_cennik_fk
FOREIGN KEY (id_hotel)
REFERENCES projekt.hotel (id_hotel)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.hotel_usluga ADD CONSTRAINT hotel_hotel_usluga_fk
FOREIGN KEY (id_hotel)
REFERENCES projekt.hotel (id_hotel)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.pracownik_hotel ADD CONSTRAINT hotel_pracownik_hotel_fk
FOREIGN KEY (id_hotel)
REFERENCES projekt.hotel (id_hotel)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.pokoj ADD CONSTRAINT hotel_pokoj_fk
FOREIGN KEY (id_hotel)
REFERENCES projekt.hotel (id_hotel)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.pracownik_hotel ADD CONSTRAINT pracownik_pracownik_hotel_fk
FOREIGN KEY (id_pracownik)
REFERENCES projekt.pracownik (id_pracownik)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.pokoj ADD CONSTRAINT standard_pokoj_fk
FOREIGN KEY (id_standard)
REFERENCES projekt.standard (id_standard)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.cennik ADD CONSTRAINT standard_cennik_fk
FOREIGN KEY (id_standard)
REFERENCES projekt.standard (id_standard)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja ADD CONSTRAINT gosc_rezerwacja_fk
FOREIGN KEY (id_gosc)
REFERENCES projekt.gosc (id_gosc)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja_pokoj ADD CONSTRAINT rezerwacja_rezerwacja_pokoj_fk
FOREIGN KEY (id_rezerwacja)
REFERENCES projekt.rezerwacja (id_rezerwacja)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE projekt.rezerwacja_pokoj ADD CONSTRAINT pokoj_rezerwacja_pokoj_fk
FOREIGN KEY (id_pokoj)
REFERENCES projekt.pokoj (id_pokoj)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;
