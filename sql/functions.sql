CREATE OR REPLACE FUNCTION projekt.make_reservation(data_roz date, data_zak date, id_pok int, id_g int)
    RETURNS int
    LANGUAGE plpgsql
    AS $$
    DECLARE
        max_number_of_residents_in_room int := (select ilosc_miejsc 
        from projekt.pokoj join projekt.standard using(id_standard) where id_pokoj = id_pok)::int;
        
        new_id_rezerwacja int := (select max(id_rezerwacja) 
        from projekt.rezerwacja)::int + 1;
        cost_of_reservation numeric := (select cena from projekt.opis_pokoi where id_pokoj=id_pok)::numeric*((data_zak-data_roz)::numeric+1.0);
	BEGIN
        IF data_roz > data_zak THEN 
            RAISE EXCEPTION 'Data rozpoczęcia musi być późniejsza od daty zakończenia';
            RETURN 0;
        END IF;

		CREATE TEMP TABLE colliding_reservations ON COMMIT DROP AS
		SELECT data_rozpoczecia, data_zakonczenia FROM projekt.rezerwacje_pokoi 
        WHERE ((data_roz >= data_rozpoczecia AND data_roz <= data_zakonczenia) 
			OR (data_zak >= data_rozpoczecia AND data_zak <= data_zakonczenia)) AND id_pokoj = id_pok
        UNION SELECT data_rozpoczecia, data_zakonczenia FROM projekt.rezerwacje_pokoi 
        WHERE (data_roz <= data_rozpoczecia AND data_zak >= data_zakonczenia) AND id_pokoj = id_pok;
		
		CREATE TEMP TABLE guest_colliding_reservations ON COMMIT DROP AS
		SELECT data_rozpoczecia, data_zakonczenia FROM projekt.rezerwacje_pokoi 
        WHERE ((data_roz >= data_rozpoczecia AND data_roz < data_zakonczenia) 
			OR (data_zak >= data_rozpoczecia AND data_zak <= data_zakonczenia)) AND id_gosc = id_g
        UNION SELECT data_rozpoczecia, data_zakonczenia FROM projekt.rezerwacje_pokoi 
        WHERE (data_roz <= data_rozpoczecia AND data_zak >= data_zakonczenia) AND id_gosc = id_g;
		

        IF (SELECT count(*) FROM (SELECT 1 from colliding_reservations limit 1) as t) > 0 THEN
            RAISE EXCEPTION 'Podany pokój jest zajęty w podanym terminie';
            RETURN 0;
        END IF;

        IF (SELECT count(*) FROM (SELECT 1 from guest_colliding_reservations limit 1) as t) > 0 THEN
            RAISE EXCEPTION 'Twoja rezerwacja koliduje z inną twoją rezerwacją';
            RETURN 0;
        END IF;

        IF cost_of_reservation > (select pieniadze from projekt.gosc where id_gosc=id_g) THEN
            RAISE EXCEPTION 'Masz za mało pieniędzy na podaną rezerwację';
            RETURN 0;
        END IF;


        INSERT INTO projekt.rezerwacja values 
            (new_id_rezerwacja, data_roz, data_zak, 1, id_g);

        INSERT INTO projekt.rezerwacja_pokoj values (new_id_rezerwacja, id_pok);
		
		RAISE NOTICE 'Koszt rezerwacji: %', cost_of_reservation;
		
        UPDATE projekt.gosc set pieniadze = pieniadze-cost_of_reservation where id_gosc = id_g;
		RETURN 1;
    END;
$$;


CREATE OR REPLACE FUNCTION projekt.change_standard(id_st int, id_p int, id_h int)
    RETURNS int
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF id_p not in (SELECT id_pokoj FROM projekt.pokoj 
            WHERE id_hotel = id_h
            EXCEPT SELECT id_pokoj FROM projekt.zajete_pokoje) THEN
			RAISE EXCEPTION 'Nie można zmienić standardu, ponieważ pokoje o podanym standardzie są zajęte';
		END IF;
		UPDATE projekt.pokoj SET id_standard = id_st WHERE id_pokoj = id_p;
        RETURN 1;
    END;
$$;
	
	
CREATE OR REPLACE FUNCTION projekt.is_employee_hotel_manager(id_pr int, id_h int)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    AS $$
	DECLARE
		q BOOLEAN;
    BEGIN
   		q := (SELECT wlasciciel from projekt.pracownik_hotel 
		WHERE id_pracownik = id_pr AND id_hotel = id_h)::boolean;
		IF q is NULL THEN
			RETURN false;
		END IF;
		RETURN q;
    END;
$$;


CREATE OR REPLACE FUNCTION projekt.create_new_hotel(new_name varchar, new_location varchar, is_elevator boolean, website varchar, id_pr int) 
RETURNS int AS $$
    DECLARE
    new_hotel_id int := (select max(id_hotel) from projekt.hotel)::int + 1;
   BEGIN                                                                                                      
      INSERT INTO projekt.hotel values (new_hotel_id, new_name, new_location, is_elevator, website);
      INSERT INTO projekt.pracownik_hotel values (id_pr, 20000, true, new_hotel_id);                                                          
    RETURN 1;                                                                                                                                                                                                                
  END; 
$$ LANGUAGE 'plpgsql';

