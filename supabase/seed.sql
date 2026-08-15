-- ==========================================================
-- Kod Coffee — Seed Data
-- ==========================================================

-- Insert Tables 01 to 12
INSERT INTO public.tables (id, table_number, qr_token, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Table 01', 'kod_tbl_01_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000002', 'Table 02', 'kod_tbl_02_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000003', 'Table 03', 'kod_tbl_03_tok', 'occupied'),
    ('a0000000-0000-0000-0000-000000000004', 'Table 04', 'kod_tbl_04_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000005', 'Table 05', 'kod_tbl_05_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000006', 'Table 06', 'kod_tbl_06_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000007', 'Table 07', 'kod_tbl_07_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000008', 'Table 08', 'kod_tbl_08_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000009', 'Table 09', 'kod_tbl_09_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000010', 'Table 10', 'kod_tbl_10_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000011', 'Table 11', 'kod_tbl_11_tok', 'available'),
    ('a0000000-0000-0000-0000-000000000012', 'Table 12', 'kod_tbl_12_tok', 'available')
ON CONFLICT (table_number) DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, display_order)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Signature Coffee', 'signature-coffee', 1),
    ('c0000000-0000-0000-0000-000000000002', 'Manual Brew & Espresso', 'manual-brew', 2),
    ('c0000000-0000-0000-0000-000000000003', 'Non-Coffee', 'non-coffee', 3),
    ('c0000000-0000-0000-0000-000000000004', 'Artisanal Bakery & Toast', 'bakery-toast', 4),
    ('c0000000-0000-0000-0000-000000000005', 'Hearty Meals', 'hearty-meals', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert Menus
INSERT INTO public.menus (id, category_id, name, slug, description, price, is_available, is_signature, taste_notes, display_order)
VALUES
    ('m0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Kod Palm Cream Latte', 'kod-palm-cream-latte', 'Signature espresso with organic Aren palm sugar, fresh Hokkaido milk, and slow-whipped salted crema.', 32000, true, true, 'Caramel, Butterscotch, Smoky Aren', 1),
    ('m0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Smoked Cinnamon Flat White', 'smoked-cinnamon-flat-white', 'Double ristretto espresso, velvety microfoam milk, infused with torched Ceylon cinnamon quill.', 34000, true, true, 'Dark Chocolate, Warm Spice, Orange Zest', 2),
    ('m0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Specialty V60 Single Origin (Gayo Anaerobic)', 'specialty-v60-gayo', 'Hand-poured single origin filter coffee with natural fermentation notes and crystal clear clarity.', 36000, true, false, 'Jasmine, Yellow Peach, Bergamot, Honey', 3),
    ('m0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Iced Long Black (House Blend)', 'iced-long-black', 'Classic double shot espresso poured over chilled mountain spring water and clear ice cubes.', 26000, true, false, 'Roasted Hazelnut, Dried Fig, Cocoa', 4),
    ('m0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Ceremonial Uji Iced Matcha', 'ceremonial-uji-iced-matcha', 'First-harvest stone-ground Japanese Uji matcha paired with creamy oat milk and light Madagascar vanilla.', 36000, true, true, 'Earthy Umami, Sweet Cream, White Chocolate', 5),
    ('m0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'Botanical Yuzu Berry Fizz', 'botanical-yuzu-berry-fizz', 'Japanese yuzu citrus puree, wild crushed blackberries, rosemary sprig, and sparkling soda.', 32000, true, false, 'Crisp Citrus, Sparkling Berry, Herbaceous', 6),
    ('m0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000004', 'Flaky Almond Butter Croissant', 'flaky-almond-butter-croissant', 'Slow-fermented French pastry layered with Normandy butter, filled with rich frangipane and toasted almonds.', 28000, true, false, 'Flaky, Roasted Almonds, French Butter', 7),
    ('m0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000004', 'Sourdough Truffle Scrambled Egg Toast', 'sourdough-truffle-scrambled-toast', 'Toasted rustic sourdough topped with creamy soft scrambled eggs, white truffle oil, and chives.', 42000, true, false, 'Earthy Truffle, Creamy Eggs, Crusty Sourdough', 8),
    ('m0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000005', 'Kod Slow-Braised Beef Donburi', 'kod-slow-braised-beef-donburi', 'Tender shortplate beef slow-braised in sweet shoyu mirin, onsen egg, and fragrant jasmine rice.', 52000, true, false, 'Savory Sweet, Onsen Egg, Crispy Garlic', 9)
ON CONFLICT (slug) DO NOTHING;
