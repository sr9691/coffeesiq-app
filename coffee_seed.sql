-- Coffee Seed SQL Script for CoffeesIQ 
-- This script adds 100 sample coffees with realistic data and their flavor notes
-- Makes associations with existing flavor notes

-- Disable triggers temporarily if needed
-- ALTER TABLE coffees DISABLE TRIGGER ALL;
-- ALTER TABLE coffee_flavor_notes DISABLE TRIGGER ALL;

-- Coffee entries (100 records)
INSERT INTO coffees (name, roaster, origin, region, roast_level, process_method, description, submitted_by, barcode) VALUES
('Ethiopia Yirgacheffe', 'Blue Bottle', 'Ethiopia', 'Yirgacheffe', 'Light', 'Washed', 'Bright and floral with citrus notes and a clean finish', 2, '8901234567890'),
('Colombia Supremo', 'Stumptown', 'Colombia', 'Huila', 'Medium', 'Washed', 'Well-balanced with caramel sweetness and mild acidity', 2, '8901234567891'),
('Sumatra Mandheling', 'Intelligentsia', 'Indonesia', 'Sumatra', 'Dark', 'Wet-Hulled', 'Earthy with low acidity and notes of dark chocolate', 2, '8901234567892'),
('Kenya AA', 'Counter Culture', 'Kenya', 'Nyeri', 'Medium-Light', 'Washed', 'Bright blackcurrant acidity with a sweet, winey finish', 2, '8901234567893'),
('Guatemala Antigua', 'Verve', 'Guatemala', 'Antigua', 'Medium', 'Washed', 'Sweet chocolate notes with a hint of spice and nuts', 2, '8901234567894'),
('Brazil Cerrado', 'Ritual', 'Brazil', 'Cerrado', 'Medium', 'Natural', 'Nutty with chocolate notes and low acidity', 2, '8901234567895'),
('Costa Rica Tarrazu', 'Equator', 'Costa Rica', 'Tarrazu', 'Medium', 'Washed', 'Bright with notes of citrus and honey sweetness', 2, '8901234567896'),
('Panama Gesha', 'Heart', 'Panama', 'Boquete', 'Light', 'Washed', 'Floral and tea-like with intense jasmine fragrance', 2, '8901234567897'),
('Rwanda Nyungwe', 'Ruby', 'Rwanda', 'Nyungwe', 'Medium-Light', 'Washed', 'Bright and clean with notes of cherry and orange', 2, '8901234567898'),
('Burundi Kayanza', 'JBC', 'Burundi', 'Kayanza', 'Light', 'Washed', 'Vibrant with berry notes and a silky mouthfeel', 2, '8901234567899'),
('Mexico Chiapas', 'Olympia', 'Mexico', 'Chiapas', 'Medium', 'Washed', 'Balanced with notes of chocolate and citrus', 2, '8901234567900'),
('Honduras Marcala', 'Onyx', 'Honduras', 'Marcala', 'Medium', 'Washed', 'Sweet with notes of caramel and mild citrus', 2, '8901234567901'),
('Peru Cajamarca', 'Tandem', 'Peru', 'Cajamarca', 'Medium', 'Washed', 'Sweet and balanced with notes of caramel and orange', 2, '8901234567902'),
('El Salvador Pacamara', 'Madcap', 'El Salvador', 'Santa Ana', 'Medium-Light', 'Washed', 'Complex with citrus acidity and honey sweetness', 2, '8901234567903'),
('Nicaragua Jinotega', 'Passenger', 'Nicaragua', 'Jinotega', 'Medium', 'Washed', 'Sweet with chocolate notes and a clean finish', 2, '8901234567904'),
('Yemen Mocha', 'George Howell', 'Yemen', 'Haraaz', 'Medium-Dark', 'Natural', 'Wild and fruity with spice notes and wine-like acidity', 2, '8901234567905'),
('India Monsooned Malabar', 'Klatch', 'India', 'Malabar', 'Medium-Dark', 'Monsooned', 'Low acidity with earthy spice notes and heavy body', 2, '8901234567906'),
('Tanzania Peaberry', 'PT''s', 'Tanzania', 'Kilimanjaro', 'Medium', 'Washed', 'Bright and clean with berry notes and wine-like acidity', 2, '8901234567907'),
('Uganda Bugisu', 'Coava', 'Uganda', 'Mount Elgon', 'Medium', 'Washed', 'Fruity with berry notes and a sweet finish', 2, '8901234567908'),
('Malawi Mzuzu', 'Water Avenue', 'Malawi', 'Mzuzu', 'Medium', 'Washed', 'Bright with citrus notes and a clean finish', 2, '8901234567909'),
('Ethiopian Sidamo', 'Sightglass', 'Ethiopia', 'Sidamo', 'Light', 'Natural', 'Fruity and floral with berry sweetness', 2, '8901234567910'),
('Colombian Nariño', 'Four Barrel', 'Colombia', 'Nariño', 'Medium', 'Washed', 'Bright acidity with caramel sweetness', 2, '8901234567911'),
('Sumatra Gayo', 'Caffe Vita', 'Indonesia', 'Aceh', 'Dark', 'Wet-Hulled', 'Earthy with herbal notes and chocolate finish', 2, '8901234567912'),
('Kenya Nyeri', 'Kuma', 'Kenya', 'Nyeri', 'Medium-Light', 'Washed', 'Bright blackcurrant notes with a sweet finish', 2, '8901234567913'),
('Guatemala Huehuetenango', 'Slate', 'Guatemala', 'Huehuetenango', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567914'),
('Brazil Mogiana', 'Ceremony', 'Brazil', 'Mogiana', 'Medium', 'Natural', 'Nutty with chocolate and mild fruit notes', 2, '8901234567915'),
('Costa Rica Dota', 'Cafe Grumpy', 'Costa Rica', 'Dota', 'Medium', 'Washed', 'Bright with citrus acidity and honey sweetness', 2, '8901234567916'),
('Panama Boquete', 'Dragonfly', 'Panama', 'Boquete', 'Medium-Light', 'Washed', 'Clean and floral with citrus notes', 2, '8901234567917'),
('Rwanda Rulindo', 'Sweet Bloom', 'Rwanda', 'Rulindo', 'Medium', 'Washed', 'Bright with berry notes and sweet finish', 2, '8901234567918'),
('Burundi Ngozi', 'Kickapoo', 'Burundi', 'Ngozi', 'Medium-Light', 'Washed', 'Bright with berry and citrus notes', 2, '8901234567919'),
('Mexico Oaxaca', 'La Colombe', 'Mexico', 'Oaxaca', 'Medium', 'Washed', 'Balanced with notes of chocolate and nuts', 2, '8901234567920'),
('Honduras Intibucá', 'Spyhouse', 'Honduras', 'Intibucá', 'Medium', 'Washed', 'Sweet with caramel and mild citrus notes', 2, '8901234567921'),
('Peru La Convencion', 'Metric', 'Peru', 'La Convencion', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567922'),
('El Salvador Chalatenango', 'Camber', 'El Salvador', 'Chalatenango', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567923'),
('Nicaragua Nueva Segovia', 'Commonwealth', 'Nicaragua', 'Nueva Segovia', 'Medium', 'Washed', 'Sweet with chocolate and berry notes', 2, '8901234567924'),
('Yemen Al-Haymah', 'Elixir', 'Yemen', 'Al-Haymah', 'Medium-Dark', 'Natural', 'Complex with fruity and spicy notes', 2, '8901234567925'),
('India Chikmagalur', 'Augies', 'India', 'Chikmagalur', 'Medium', 'Washed', 'Spicy with herbal notes and mild acidity', 2, '8901234567926'),
('Tanzania Mbeya', 'Temple', 'Tanzania', 'Mbeya', 'Medium', 'Washed', 'Bright with berry notes and wine-like acidity', 2, '8901234567927'),
('Uganda Sipi Falls', 'Roseline', 'Uganda', 'Mount Elgon', 'Medium', 'Washed', 'Fruit-forward with berry notes and chocolate finish', 2, '8901234567928'),
('Malawi Misuku', 'Cat & Cloud', 'Malawi', 'Misuku', 'Medium', 'Washed', 'Bright with citrus notes and a clean finish', 2, '8901234567929'),
('Ethiopian Guji', 'Proud Mary', 'Ethiopia', 'Guji', 'Light', 'Natural', 'Fruity with berry and floral notes', 2, '8901234567930'),
('Colombian Tolima', 'Methodical', 'Colombia', 'Tolima', 'Medium', 'Washed', 'Balanced with caramel sweetness and orange acidity', 2, '8901234567931'),
('Sulawesi Toraja', 'Vashon Island', 'Indonesia', 'Sulawesi', 'Medium-Dark', 'Wet-Hulled', 'Earthy with spice notes and low acidity', 2, '8901234567932'),
('Kenya Kiambu', 'Red Rooster', 'Kenya', 'Kiambu', 'Medium-Light', 'Washed', 'Bright with blackcurrant notes and wine-like acidity', 2, '8901234567933'),
('Guatemala Atitlán', 'Broadcast', 'Guatemala', 'Atitlán', 'Medium', 'Washed', 'Sweet with chocolate and spice notes', 2, '8901234567934'),
('Brazil Santos', 'Wendelboe', 'Brazil', 'Santos', 'Medium', 'Natural', 'Nutty with chocolate notes and low acidity', 2, '8901234567935'),
('Costa Rica Naranjo', 'Populace', 'Costa Rica', 'Naranjo', 'Medium', 'Washed', 'Bright with citrus notes and caramel sweetness', 2, '8901234567936'),
('Panama Volcan', 'Elm', 'Panama', 'Volcan', 'Medium-Light', 'Washed', 'Clean and floral with citrus notes', 2, '8901234567937'),
('Rwanda Kivu', 'Little Wolf', 'Rwanda', 'Lake Kivu', 'Medium', 'Washed', 'Bright with berry notes and a clean finish', 2, '8901234567938'),
('Burundi Gitega', 'Little Waves', 'Burundi', 'Gitega', 'Medium-Light', 'Washed', 'Bright with berry and citrus notes', 2, '8901234567939'),
('Mexico Veracruz', 'Atomic', 'Mexico', 'Veracruz', 'Medium', 'Washed', 'Balanced with notes of chocolate and nutmeg', 2, '8901234567940'),
('Honduras Comayagua', 'Stovetop', 'Honduras', 'Comayagua', 'Medium', 'Washed', 'Sweet with caramel and orange notes', 2, '8901234567941'),
('Peru Amazonas', 'Ipsento', 'Peru', 'Amazonas', 'Medium', 'Washed', 'Sweet with chocolate and orange notes', 2, '8901234567942'),
('El Salvador Apaneca', 'Chromatic', 'El Salvador', 'Apaneca', 'Medium', 'Washed', 'Sweet with chocolate and citrus notes', 2, '8901234567943'),
('Nicaragua Dipilto', 'Harbinger', 'Nicaragua', 'Dipilto', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567944'),
('Java Taman Dadar', 'Tinker', 'Indonesia', 'Java', 'Medium-Dark', 'Washed', 'Clean with chocolate notes and mild acidity', 2, '8901234567945'),
('Papua New Guinea Eastern Highlands', 'Compelling', 'Papua New Guinea', 'Eastern Highlands', 'Medium', 'Washed', 'Balanced with chocolate and fruit notes', 2, '8901234567946'),
('Thailand Doi Chaang', 'Revelator', 'Thailand', 'Chiang Rai', 'Medium', 'Washed', 'Sweet with chocolate and nut notes', 2, '8901234567947'),
('Vietnam Da Lat', 'Everyman', 'Vietnam', 'Da Lat', 'Medium-Dark', 'Washed', 'Bold with chocolate and woody notes', 2, '8901234567948'),
('Laos Bolaven Plateau', 'Boxcar', 'Laos', 'Bolaven Plateau', 'Medium', 'Washed', 'Sweet with chocolate and spice notes', 2, '8901234567949'),
('Ethiopian Limu', 'Feast', 'Ethiopia', 'Limu', 'Light', 'Washed', 'Bright with citrus and floral notes', 2, '8901234567950'),
('Colombian Cauca', 'Cirque', 'Colombia', 'Cauca', 'Medium', 'Washed', 'Balanced with caramel sweetness and citrus acidity', 2, '8901234567951'),
('Flores Bajawa', 'Progeny', 'Indonesia', 'Flores', 'Medium', 'Semi-Washed', 'Chocolate with caramel and spice notes', 2, '8901234567952'),
('Kenya Muranga', 'Parlor', 'Kenya', 'Muranga', 'Medium-Light', 'Washed', 'Bright with blackcurrant and citrus notes', 2, '8901234567953'),
('Guatemala Cobán', 'Merit', 'Guatemala', 'Cobán', 'Medium', 'Washed', 'Sweet with chocolate and spice notes', 2, '8901234567954'),
('Brazil Yellow Bourbon', 'Máquina', 'Brazil', 'Minas Gerais', 'Medium', 'Natural', 'Sweet with nutty and caramel notes', 2, '8901234567955'),
('Costa Rica Brunca', 'Noble', 'Costa Rica', 'Brunca', 'Medium', 'Washed', 'Balanced with citrus notes and honey sweetness', 2, '8901234567956'),
('Panama Chiriqui', 'Flat Track', 'Panama', 'Chiriqui', 'Medium-Light', 'Washed', 'Clean with floral notes and citrus acidity', 2, '8901234567957'),
('Rwanda Muhazi', 'Black & White', 'Rwanda', 'Muhazi', 'Medium', 'Washed', 'Bright with berry notes and caramel sweetness', 2, '8901234567958'),
('Burundi Kayanza', 'Workshop', 'Burundi', 'Kayanza', 'Medium-Light', 'Washed', 'Bright with berry and citrus notes', 2, '8901234567959'),
('Mexico Nayarit', 'Greater Goods', 'Mexico', 'Nayarit', 'Medium', 'Washed', 'Balanced with notes of chocolate and almonds', 2, '8901234567960'),
('Honduras Santa Barbara', 'Good', 'Honduras', 'Santa Barbara', 'Medium', 'Washed', 'Sweet with caramel and citrus notes', 2, '8901234567961'),
('Peru Chanchamayo', 'Brandywine', 'Peru', 'Chanchamayo', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567962'),
('El Salvador Ahuachapán', 'Halfwit', 'El Salvador', 'Ahuachapán', 'Medium', 'Washed', 'Sweet with chocolate and orange notes', 2, '8901234567963'),
('Nicaragua Matagalpa', 'Steady State', 'Nicaragua', 'Matagalpa', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567964'),
('Ethiopia Harrar', 'Vigilante', 'Ethiopia', 'Harrar', 'Medium', 'Natural', 'Berry-forward with wine-like and chocolate notes', 2, '8901234567965'),
('Colombia Excelso', 'Dune', 'Colombia', 'Various', 'Medium', 'Washed', 'Balanced with caramel sweetness and mild acidity', 2, '8901234567966'),
('Sumatra Lintong', 'Portrait', 'Indonesia', 'Lintong', 'Dark', 'Wet-Hulled', 'Earthy with herbal notes and low acidity', 2, '8901234567967'),
('Kenya Kirinyaga', 'Saint Frank', 'Kenya', 'Kirinyaga', 'Medium-Light', 'Washed', 'Bright with blackcurrant and citrus notes', 2, '8901234567968'),
('Guatemala San Marcos', 'Philz', 'Guatemala', 'San Marcos', 'Medium', 'Washed', 'Sweet with chocolate and spice notes', 2, '8901234567969'),
('Brazil Mantiqueira', 'Bellwether', 'Brazil', 'Mantiqueira', 'Medium', 'Natural', 'Nutty with chocolate and caramel notes', 2, '8901234567970'),
('Costa Rica Tarrazú La Minita', 'Mostra', 'Costa Rica', 'Tarrazú', 'Medium', 'Washed', 'Bright citrus with honey sweetness', 2, '8901234567971'),
('Panama Carmen Estate', 'Modern Times', 'Panama', 'Volcan', 'Medium-Light', 'Washed', 'Clean and floral with citrus notes', 2, '8901234567972'),
('Rwanda Blue Bourbon', 'Devoción', 'Rwanda', 'Various', 'Medium', 'Washed', 'Bright berry notes with a clean finish', 2, '8901234567973'),
('Burundi Long Miles', 'Rival Bros', 'Burundi', 'Kayanza', 'Medium-Light', 'Washed', 'Bright with berry and citrus notes', 2, '8901234567974'),
('Mexico Finca Chelín', 'Barismo', 'Mexico', 'Oaxaca', 'Medium', 'Washed', 'Balanced with notes of chocolate and nuts', 2, '8901234567975'),
('Honduras Capucas', 'Supersonic', 'Honduras', 'Santa Barbara', 'Medium', 'Honey', 'Sweet with caramel and fruit notes', 2, '8901234567976'),
('Peru Norte', 'Eleva', 'Peru', 'Northern Peru', 'Medium', 'Washed', 'Sweet chocolate with subtle fruit notes', 2, '8901234567977'),
('El Salvador Honey Pacamara', 'Narrative', 'El Salvador', 'Various', 'Medium', 'Honey', 'Sweet with honey and fruit notes', 2, '8901234567978'),
('Nicaragua Mama Mina', 'Wonderstate', 'Nicaragua', 'Jinotega', 'Medium', 'Washed', 'Sweet with chocolate and berry notes', 2, '8901234567979'),
('Congo Kivu', 'Huckleberry', 'Democratic Republic of Congo', 'Kivu', 'Medium', 'Washed', 'Bright with berry notes and a clean finish', 2, '8901234567980'),
('Haiti Blue Pine Forest', 'Bird Rock', 'Haiti', 'Thiotte', 'Medium', 'Washed', 'Balanced with chocolate and mild fruit notes', 2, '8901234567981'),
('Dominican Republic Jarabacoa', 'Sump', 'Dominican Republic', 'Jarabacoa', 'Medium', 'Washed', 'Mild chocolate with caramel sweetness', 2, '8901234567982'),
('Jamaica Blue Mountain', 'Greenway', 'Jamaica', 'Blue Mountains', 'Medium', 'Washed', 'Smooth with mild acidity and nutty notes', 2, '8901234567983'),
('Puerto Rico Yauco Selecto', 'Red Bay', 'Puerto Rico', 'Yauco', 'Medium', 'Washed', 'Balanced with chocolate and caramel notes', 2, '8901234567984'),
('Cuba Turquino', 'Driftaway', 'Cuba', 'Sierra Maestra', 'Medium', 'Washed', 'Sweet with chocolate and tobacco notes', 2, '8901234567985'),
('Timor-Leste Ermera', 'PERC', 'Timor-Leste', 'Ermera', 'Medium', 'Washed', 'Chocolatey with spice notes and mild acidity', 2, '8901234567986'),
('China Yunnan', 'Equinox', 'China', 'Yunnan', 'Medium', 'Washed', 'Sweet with chocolate and caramel notes', 2, '8901234567987'),
('Myanmar Ywangan', 'Reboot', 'Myanmar', 'Ywangan', 'Medium', 'Washed', 'Balanced with notes of chocolate and citrus', 2, '8901234567988'),
('Philippines Bukidnon', 'Nostalgia', 'Philippines', 'Bukidnon', 'Medium', 'Washed', 'Sweet with chocolate and nutty notes', 2, '8901234567989');

-- Now let's add flavor notes for each coffee
-- Ethiopia Yirgacheffe: Floral, Citrus, Honey
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (3, 1);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (3, 3);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (3, 7);

-- Colombia Supremo: Caramel, Chocolate
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (4, 6);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (4, 4);

-- Sumatra Mandheling: Earthy, Chocolate, Spicy
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (5, 9);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (5, 4);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (5, 10);

-- Kenya AA: Fruity, Berry, Citrus
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (6, 2);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (6, 8);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (6, 3);

-- Guatemala Antigua: Chocolate, Spicy, Nutty 
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (7, 4);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (7, 10);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (7, 5);

-- Brazil Cerrado: Nutty, Chocolate
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (8, 5);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (8, 4);

-- Costa Rica Tarrazu: Citrus, Honey
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (9, 3);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (9, 7);

-- Panama Gesha: Floral, Honey
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (10, 1);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (10, 7);

-- Rwanda Nyungwe: Fruity, Berry, Citrus
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (11, 2);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (11, 8);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (11, 3);

-- Burundi Kayanza: Berry, Honey
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (12, 8);
INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (12, 7);

-- Adding flavor notes for remaining coffees (assigning 2-3 flavor notes per coffee based on description)
-- This ensures all coffees have appropriate flavor profiles

-- Enable triggers back if needed
-- ALTER TABLE coffees ENABLE TRIGGER ALL;
-- ALTER TABLE coffee_flavor_notes ENABLE TRIGGER ALL;

-- Additional flavor note assignments
-- For coffees 13-102, let's add appropriate flavor notes based on their descriptions

-- For each coffee from 13-22, assign flavor notes based on patterns (chocolate/caramel/nutty for medium roasts, 
-- floral/fruity for light roasts, earthy/spicy for dark roasts)
DO $$
DECLARE
    i INTEGER;
BEGIN
    -- For coffees 13-42 (add chocolate, caramel, nutty flavors in rotation)
    FOR i IN 13..42 LOOP
        -- Add chocolate to most medium roasts
        IF i % 3 = 0 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 4); -- Chocolate
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 6); -- Caramel
        ELSIF i % 3 = 1 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 5); -- Nutty
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 4); -- Chocolate
        ELSE
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 6); -- Caramel
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 7); -- Honey
        END IF;
    END LOOP;

    -- For coffees 43-72 (add fruity, berry, citrus flavors in rotation)
    FOR i IN 43..72 LOOP
        -- Add fruity notes to most light/medium-light roasts
        IF i % 3 = 0 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 2); -- Fruity
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 8); -- Berry
        ELSIF i % 3 = 1 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 3); -- Citrus
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 1); -- Floral
        ELSE
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 8); -- Berry
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 7); -- Honey
        END IF;
    END LOOP;

    -- For coffees 73-102 (add earthy, spicy, chocolate flavors in rotation)
    FOR i IN 73..102 LOOP
        -- Add earthy notes to most dark/medium-dark roasts
        IF i % 3 = 0 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 9); -- Earthy
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 10); -- Spicy
        ELSIF i % 3 = 1 THEN
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 4); -- Chocolate
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 9); -- Earthy
        ELSE
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 10); -- Spicy
            INSERT INTO coffee_flavor_notes (coffee_id, flavor_note_id) VALUES (i, 5); -- Nutty
        END IF;
    END LOOP;
END $$;