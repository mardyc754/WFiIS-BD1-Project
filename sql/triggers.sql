CREATE OR REPLACE FUNCTION projekt.validate_data()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
	DECLARE
		phone_number_copy text := NEW.telefon;
    BEGIN
    IF LENGTH(TRIM(NEW.imie)) = 0 OR LENGTH(TRIM(NEW.nazwisko)) = 0 THEN
        RAISE EXCEPTION 'Nie podano imienia i/lub nazwiska';
    END IF;
    
    IF NEW.nazwisko ~ '^\s*([A-Z]|[a-z]|[ąęćśńźżłó]|[ĄĘĆŚŃŻŹŁÓ])+((-([A-Z]|[a-z]|[ąęćśńźżłó]|[ĄĘĆŚŃŻŹŁÓ])+)?)\s*$' 
    AND NEW.imie ~ '^\s*([A-Z]|[a-z]|[ąęćśńźżłó]|[ĄĘĆŚŃŻŹŁÓ])+\s*$' 
    AND NEW.telefon ~ '^\s*([0-9]){9}\s*$' THEN
        NEW.nazwisko := trim(NEW.nazwisko);
        NEW.imie := trim(NEW.imie);
		NEW.telefon := '';
		FOR i IN 1 .. 3
		LOOP
		IF i = 1 THEN
			NEW.telefon := substr(phone_number_copy, 1, 3);
		ELSE
			NEW.telefon := NEW.telefon || ' ' || substr(phone_number_copy, (i-1)*3+1, 3);
		END IF;
		END LOOP;
	
    ELSE
        RAISE EXCEPTION 'Niepoprawna wartość imienia, nazwiska i/lub nr telefonu';
    END IF;

    IF (length(trim(NEW.email)) > 30 or length(trim(NEW.email)) < 5) 
    OR (length(trim(NEW.haslo)) > 30 OR length(trim(NEW.haslo)) < 5) THEN
        RAISE EXCEPTION 'Adres email i haslo muszą posiadać od 5 do 30 znaków';
	END IF;

	IF TG_ARGV[0] = 'gosc' THEN
        IF (select max(id_gosc) from projekt.gosc)::int IS NOT NULL THEN
          NEW.id_gosc := (select max(id_gosc) from projekt.gosc)::int + 1;
        ELSE
          NEW.id_gosc := 1;
        END IF;
		IF NEW.email IN (SELECT email from projekt.gosc) 
        AND NEW.email IS NOT NULL THEN
			RAISE EXCEPTION 'Gość o podanym adresie email już istnieje';
		END IF;

	ELSIF TG_ARGV[0] = 'pracownik' THEN
      IF (select max(id_pracownik) from projekt.pracownik)::int IS NOT NULL THEN
        NEW.id_pracownik := (select max(id_pracownik) from projekt.pracownik)::int + 1;
      ELSE
        NEW.id_pracownik := 1;
      END IF;
		
    IF NEW.email IN (SELECT email from projekt.pracownik) 
        AND NEW.email IS NOT NULL THEN
			RAISE EXCEPTION 'Pracownik o podanym adresie email już istnieje';
		END IF;
	END IF;
    RETURN NEW;                         
   
   END;
$$;

CREATE TRIGGER guest_validator
    BEFORE INSERT ON projekt.gosc
    FOR EACH ROW EXECUTE PROCEDURE projekt.validate_data('gosc');

CREATE TRIGGER employee_validator
    BEFORE INSERT ON projekt.pracownik
    FOR EACH ROW EXECUTE PROCEDURE projekt.validate_data('pracownik');


CREATE OR REPLACE FUNCTION projekt.normalize_data()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    DECLARE 
      last_name text[];
    BEGIN
    
    NEW.imie := trim( UPPER( LEFT(NEW.imie, 1)) || LOWER(RIGHT(NEW.imie, LENGTH(NEW.imie) - 1) ) );
    
    IF NEW.nazwisko ~ '^\s*([A-Z]|[a-z]|[ąęćśńźżłó]|[ĄĘĆŚŃŻŹŁÓ])+-([A-Z]|[a-z]|[ąęćśńźżłó]|[ĄĘĆŚŃŻŹŁÓ])+\s*$' THEN
      last_name := regexp_split_to_array(NEW.nazwisko, '-');
      last_name[1] := trim(last_name[1]);
      last_name[2] := trim(last_name[2]);
      
      NEW.nazwisko := trim( 
      UPPER( LEFT(last_name[1], 1)) || LOWER(RIGHT(last_name[1], LENGTH(last_name[1]) - 1)) || '-' ||
                         UPPER( LEFT(last_name[2], 1)) || LOWER(RIGHT(last_name[2], LENGTH(last_name[2]) - 1)) );
    ELSE
      NEW.nazwisko := trim( UPPER( LEFT(NEW.nazwisko, 1)) || LOWER(RIGHT(NEW.nazwisko, LENGTH(NEW.nazwisko) - 1) ) );
    END IF;
	
    RETURN NEW;                                          
    END;
$$;

CREATE TRIGGER guest_normalizer 
    BEFORE INSERT OR UPDATE ON projekt.gosc
    FOR EACH ROW EXECUTE PROCEDURE projekt.normalize_data();

CREATE TRIGGER employee_normalizer 
    BEFORE INSERT OR UPDATE ON projekt.pracownik
    FOR EACH ROW EXECUTE PROCEDURE projekt.normalize_data(); 



CREATE OR REPLACE FUNCTION projekt.delete_employee() RETURNS TRIGGER AS $$
   BEGIN                                                                                                      
    IF OLD.wlasciciel = true AND (SELECT count(*) from projekt.wlasciciele_hoteli where id_hotel=OLD.id_hotel)::int = 1 THEN                                                                               
      RAISE EXCEPTION 'Jesteś jedynym właścicielem hotelu, dlatego nie możesz się zwolnić';                                                                    
    END IF;                                                             
      RETURN OLD;                                                                                                                                                                                                                                                                                 
  END; 
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER delete_employee_trigger 
    BEFORE DELETE ON projekt.pracownik_hotel
    FOR EACH ROW EXECUTE PROCEDURE projekt.delete_employee();



CREATE OR REPLACE FUNCTION projekt.change_manager_permissions() 
RETURNS TRIGGER AS $$
   BEGIN                                                                                                    
    IF NEW.wlasciciel = false 
    AND NEW.id_pracownik = ANY(select id_pracownik from projekt.pracownik_hotel where wlasciciel = true)
    AND (SELECT count(*) from projekt.wlasciciele_hoteli where id_hotel=OLD.id_hotel)::int = 1 THEN                                                                              
      RAISE EXCEPTION 'Jesteś jedynym właścicielem hotelu, dlatego nie możesz się pozbawić uprawnień właściciela';                                                                   
      RETURN OLD; 
    END IF;                                                             
      RETURN NEW;                                                                                                                                                                                                                                                                                 
  END; 
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_manager_permissions
    BEFORE UPDATE ON projekt.pracownik_hotel
    FOR EACH ROW EXECUTE PROCEDURE projekt.change_manager_permissions();



CREATE OR REPLACE FUNCTION projekt.validate_hotel_creation() 
RETURNS TRIGGER AS $$
   BEGIN                                                                                                      
      IF NEW.nazwa in (select nazwa from projekt.hotel) THEN
        RAISE EXCEPTION 'Hotel o podanej nazwie istnieje już w bazie';
    END IF; 
    IF length(NEW.nazwa) = 0 OR length(NEW.adres_www) = 0 OR length(NEW.miejscowosc) = 0 THEN
        RAISE EXCEPTION 'Nazwa hotelu, miejscowości oraz adresu www nie może być pusta';
    END IF; 

    IF length(NEW.nazwa) > 30 OR length(NEW.adres_www) > 30 OR length(NEW.miejscowosc) > 30 THEN
        RAISE EXCEPTION 'Nazwa hotelu, miejscowości oraz adresu www może się składać z maksymalnie 30 znaków';
    END IF; 
                                                          
    RETURN NEW;                                                                                                                                                                                                                
  END; 
$$ LANGUAGE 'plpgsql';

 
CREATE TRIGGER hotel_creation_validator
    BEFORE INSERT ON projekt.hotel
    FOR EACH ROW EXECUTE PROCEDURE projekt.validate_hotel_creation();


CREATE OR REPLACE FUNCTION projekt.validate_reservation() 
RETURNS TRIGGER AS $$
    DECLARE
   BEGIN                                                                                                      
      IF NEW.data_rozpoczecia > NEW.data_zakonczenia THEN
        RAISE EXCEPTION 'Data rozpoczęcia rezerwacji musi być późniejsza od daty jej zakończenia';
    END IF;  
    RETURN NEW;                                                                                                                                                                                                                                                                              
  END; 
$$ LANGUAGE 'plpgsql';
 
CREATE TRIGGER reservation_validator
    BEFORE INSERT OR UPDATE ON projekt.rezerwacja
    FOR EACH ROW EXECUTE PROCEDURE projekt.validate_reservation();


CREATE OR REPLACE FUNCTION projekt.delete_reservation() 
RETURNS TRIGGER AS $$
   BEGIN                                                                                                      
      DELETE from projekt.rezerwacja_pokoj where id_rezerwacja=OLD.id_rezerwacja;
    RETURN NULL;                                                                                                                                                                                                                                                                              
  END; 
$$ LANGUAGE 'plpgsql';
 
CREATE TRIGGER reservation_deletion
    BEFORE DELETE ON projekt.rezerwacja
    FOR EACH ROW EXECUTE PROCEDURE projekt.delete_reservation();

CREATE OR REPLACE FUNCTION projekt.room_insert() 
RETURNS TRIGGER AS $$
    DECLARE
    max_room_id int := (select max(id_pokoj) from projekt.pokoj)::int;
   BEGIN
      IF max_room_id IS NOT NULL THEN                                                                                                      
        NEW.id_pokoj := max_room_id + 1;
      ELSE
        NEW.id_pokoj := 1;
      END IF;
      RETURN NEW;                                                                                                                                                                                                                                                                             
  END; 
$$ LANGUAGE 'plpgsql';
 
CREATE TRIGGER room_insert_validator
    BEFORE INSERT ON projekt.pokoj
    FOR EACH ROW EXECUTE PROCEDURE projekt.room_insert();
 