/* ===================================================
   Calorie Correct — Application v1.0.1
   =================================================== */

(function () {
'use strict';

/* ===================================================
   FOOD DATABASE
   ~150 common foods with calorie estimates.
   Aliases ordered most-specific first so "turkey
   sandwich" matches before bare "turkey".
   =================================================== */
const FOOD_DB = [
  // Composite meals / sandwiches (must come first)
  { name: 'Turkey sandwich', aliases: ['turkey sandwich', 'turkey sub'], cal: 420 },
  { name: 'Ham sandwich', aliases: ['ham sandwich', 'ham sub'], cal: 380 },
  { name: 'BLT sandwich', aliases: ['blt', 'b.l.t.'], cal: 480 },
  { name: 'Grilled cheese', aliases: ['grilled cheese'], cal: 380 },
  { name: 'PB&J sandwich', aliases: ['pb&j', 'pbj', 'peanut butter and jelly', 'peanut butter sandwich'], cal: 380 },
  { name: 'Tuna sandwich', aliases: ['tuna sandwich', 'tuna salad sandwich'], cal: 440 },
  { name: 'Chicken sandwich', aliases: ['chicken sandwich'], cal: 480 },
  { name: 'Chicken caesar salad', aliases: ['chicken caesar salad', 'chicken caesar'], cal: 520 },
  { name: 'Caesar salad', aliases: ['caesar salad'], cal: 380 },
  { name: 'Cobb salad', aliases: ['cobb salad'], cal: 540 },
  { name: 'House salad', aliases: ['house salad', 'side salad', 'mixed salad'], cal: 180 },
  { name: 'Cheeseburger', aliases: ['cheeseburger'], cal: 540 },
  { name: 'Hamburger', aliases: ['hamburger', 'burger'], cal: 460 },
  { name: 'Slice of pizza', aliases: ['slice of pizza', 'pizza slice', 'pizza'], cal: 285 },
  { name: 'French fries', aliases: ['french fries', 'fries'], cal: 365 },
  { name: 'Tacos', aliases: ['tacos', 'taco'], cal: 230 },
  { name: 'Burrito', aliases: ['burrito'], cal: 620 },
  { name: 'Sushi roll', aliases: ['sushi roll', 'sushi'], cal: 320 },
  { name: 'Pad Thai', aliases: ['pad thai'], cal: 560 },
  { name: 'Fried rice', aliases: ['fried rice'], cal: 390 },
  { name: 'Lo mein', aliases: ['lo mein'], cal: 480 },
  { name: 'Soup', aliases: ['soup', 'bowl of soup'], cal: 220 },
  { name: 'Chili', aliases: ['chili', 'bowl of chili'], cal: 320 },
  { name: 'Mac and cheese', aliases: ['mac and cheese', 'macaroni and cheese'], cal: 440 },

  // Breakfast
  { name: 'Greek yogurt with berries', aliases: ['greek yogurt with berries', 'yogurt with berries'], cal: 220 },
  { name: 'Greek yogurt', aliases: ['greek yogurt'], cal: 130 },
  { name: 'Yogurt', aliases: ['yogurt'], cal: 150 },
  { name: 'Oatmeal', aliases: ['oatmeal', 'bowl of oatmeal'], cal: 180 },
  { name: 'Cereal with milk', aliases: ['cereal with milk', 'bowl of cereal'], cal: 220 },
  { name: 'Cereal', aliases: ['cereal'], cal: 140 },
  { name: 'Pancakes', aliases: ['pancakes'], cal: 350 },
  { name: 'Waffles', aliases: ['waffles', 'waffle'], cal: 290 },
  { name: 'French toast', aliases: ['french toast'], cal: 320 },
  { name: 'Scrambled eggs', aliases: ['scrambled eggs', 'eggs scrambled'], cal: 220 },
  { name: 'Fried eggs', aliases: ['fried eggs', 'eggs fried'], cal: 180 },
  { name: 'Omelet', aliases: ['omelet', 'omelette'], cal: 320 },
  { name: 'Eggs', aliases: ['egg', 'eggs'], cal: 78 },
  { name: 'Bagel with cream cheese', aliases: ['bagel with cream cheese'], cal: 380 },
  { name: 'Bagel', aliases: ['bagel'], cal: 280 },
  { name: 'Croissant', aliases: ['croissant'], cal: 270 },
  { name: 'Muffin', aliases: ['muffin', 'blueberry muffin'], cal: 340 },
  { name: 'Donut', aliases: ['donut', 'doughnut'], cal: 270 },
  { name: 'Toast with butter', aliases: ['toast with butter', 'buttered toast'], cal: 130 },
  { name: 'Toast', aliases: ['toast', 'piece of toast'], cal: 80 },
  { name: 'Bacon', aliases: ['bacon', 'strip of bacon', 'strips of bacon'], cal: 45 },
  { name: 'Sausage link', aliases: ['sausage', 'sausage link'], cal: 90 },
  { name: 'Granola bar', aliases: ['granola bar'], cal: 190 },
  { name: 'Protein bar', aliases: ['protein bar'], cal: 220 },
  { name: 'Smoothie', aliases: ['smoothie'], cal: 280 },

  // Proteins
  { name: 'Chicken breast', aliases: ['chicken breast', 'grilled chicken'], cal: 280 },
  { name: 'Chicken thigh', aliases: ['chicken thigh'], cal: 260 },
  { name: 'Chicken wings', aliases: ['chicken wings', 'wings'], cal: 100 },
  { name: 'Chicken nuggets', aliases: ['chicken nuggets', 'nuggets'], cal: 50 },
  { name: 'Chicken', aliases: ['chicken'], cal: 250 },
  { name: 'Steak', aliases: ['steak', 'ribeye', 'sirloin'], cal: 480 },
  { name: 'Ground beef', aliases: ['ground beef'], cal: 280 },
  { name: 'Pork chop', aliases: ['pork chop'], cal: 320 },
  { name: 'Salmon', aliases: ['salmon'], cal: 360 },
  { name: 'Tuna', aliases: ['tuna'], cal: 200 },
  { name: 'Shrimp', aliases: ['shrimp'], cal: 220 },
  { name: 'Turkey', aliases: ['turkey', 'turkey breast'], cal: 220 },
  { name: 'Ham', aliases: ['ham', 'slice of ham'], cal: 60 },

  // Sides / starches
  { name: 'White rice', aliases: ['white rice', 'rice'], cal: 200 },
  { name: 'Brown rice', aliases: ['brown rice'], cal: 220 },
  { name: 'Pasta', aliases: ['pasta', 'spaghetti', 'penne'], cal: 320 },
  { name: 'Sweet potato', aliases: ['sweet potato'], cal: 180 },
  { name: 'Baked potato', aliases: ['baked potato', 'potato'], cal: 160 },
  { name: 'Mashed potatoes', aliases: ['mashed potatoes'], cal: 240 },
  { name: 'Bread', aliases: ['bread', 'slice of bread'], cal: 80 },
  { name: 'Tortilla', aliases: ['tortilla'], cal: 130 },

  // Vegetables
  { name: 'Broccoli', aliases: ['broccoli'], cal: 55 },
  { name: 'Carrots', aliases: ['carrots', 'carrot'], cal: 30 },
  { name: 'Spinach', aliases: ['spinach'], cal: 20 },
  { name: 'Mixed vegetables', aliases: ['mixed vegetables', 'veggies', 'vegetables'], cal: 70 },
  { name: 'Salad', aliases: ['salad'], cal: 150 },
  { name: 'Corn', aliases: ['corn'], cal: 120 },

  // Fruits
  { name: 'Apple', aliases: ['apple'], cal: 95 },
  { name: 'Banana', aliases: ['banana'], cal: 105 },
  { name: 'Orange', aliases: ['orange'], cal: 65 },
  { name: 'Grapes', aliases: ['grapes'], cal: 60 },
  { name: 'Strawberries', aliases: ['strawberries'], cal: 50 },
  { name: 'Blueberries', aliases: ['blueberries'], cal: 80 },
  { name: 'Watermelon', aliases: ['watermelon'], cal: 90 },
  { name: 'Pear', aliases: ['pear'], cal: 100 },
  { name: 'Peach', aliases: ['peach'], cal: 60 },
  { name: 'Pineapple', aliases: ['pineapple'], cal: 80 },

  // Dairy
  { name: 'Milk', aliases: ['glass of milk', 'cup of milk', 'milk'], cal: 150 },
  { name: 'Cheese', aliases: ['cheese', 'slice of cheese'], cal: 110 },
  { name: 'Cottage cheese', aliases: ['cottage cheese'], cal: 220 },
  { name: 'Cream cheese', aliases: ['cream cheese'], cal: 100 },
  { name: 'Butter', aliases: ['butter', 'pat of butter'], cal: 35 },

  // Snacks / treats
  { name: 'Chips', aliases: ['chips', 'potato chips', 'bag of chips'], cal: 240 },
  { name: 'Pretzels', aliases: ['pretzels'], cal: 110 },
  { name: 'Almonds', aliases: ['almonds'], cal: 160 },
  { name: 'Mixed nuts', aliases: ['mixed nuts', 'nuts', 'handful of nuts'], cal: 180 },
  { name: 'Peanut butter', aliases: ['peanut butter', 'spoonful of peanut butter'], cal: 190 },
  { name: 'Cookie', aliases: ['cookie'], cal: 150 },
  { name: 'Brownie', aliases: ['brownie'], cal: 250 },
  { name: 'Ice cream', aliases: ['ice cream', 'scoop of ice cream'], cal: 200 },
  { name: 'Chocolate', aliases: ['chocolate', 'square of chocolate', 'piece of chocolate'], cal: 50 },
  { name: 'Popcorn', aliases: ['popcorn', 'bowl of popcorn'], cal: 110 },

  // Drinks
  { name: 'Coffee with cream', aliases: ['coffee with cream'], cal: 80 },
  { name: 'Coffee with milk', aliases: ['coffee with milk', 'latte'], cal: 120 },
  { name: 'Black coffee', aliases: ['black coffee', 'coffee'], cal: 5 },
  { name: 'Tea', aliases: ['tea', 'cup of tea'], cal: 5 },
  { name: 'Diet soda', aliases: ['diet coke', 'diet pepsi', 'diet soda'], cal: 0 },
  { name: 'Soda', aliases: ['coke', 'pepsi', 'soda', 'pop'], cal: 140 },
  { name: 'Beer', aliases: ['beer'], cal: 150 },
  { name: 'Glass of wine', aliases: ['glass of wine', 'wine'], cal: 125 },
  { name: 'Cocktail', aliases: ['cocktail', 'margarita', 'martini'], cal: 200 },
  { name: 'Orange juice', aliases: ['orange juice', 'oj'], cal: 110 },
  { name: 'Apple juice', aliases: ['apple juice'], cal: 115 },
  { name: 'Water', aliases: ['water', 'glass of water'], cal: 0 },

  // === Expanded vocabulary ===
  // More breakfast
  { name: 'Avocado toast', aliases: ['avocado toast'], cal: 290 },
  { name: 'Breakfast burrito', aliases: ['breakfast burrito'], cal: 480 },
  { name: 'Breakfast sandwich', aliases: ['breakfast sandwich', 'egg sandwich'], cal: 380 },
  { name: 'Egg McMuffin', aliases: ['egg mcmuffin', 'mcmuffin'], cal: 310 },
  { name: 'Sausage McMuffin', aliases: ['sausage mcmuffin'], cal: 480 },
  { name: 'Hash browns', aliases: ['hash browns', 'hashbrowns'], cal: 145 },
  { name: 'Bacon, egg, and cheese', aliases: ['bacon egg and cheese', 'bec'], cal: 440 },
  { name: 'Steel-cut oats', aliases: ['steel-cut oats', 'steel cut oats'], cal: 200 },
  { name: 'Overnight oats', aliases: ['overnight oats'], cal: 320 },
  { name: 'Acai bowl', aliases: ['acai bowl'], cal: 420 },
  { name: 'Granola', aliases: ['granola'], cal: 220 },
  { name: 'Yogurt parfait', aliases: ['yogurt parfait'], cal: 280 },
  { name: 'Chia pudding', aliases: ['chia pudding'], cal: 240 },
  { name: 'English muffin', aliases: ['english muffin'], cal: 130 },
  { name: 'Belgian waffle', aliases: ['belgian waffle'], cal: 320 },
  { name: 'Stack of pancakes', aliases: ['stack of pancakes', 'pancake stack'], cal: 540 },
  { name: 'Breakfast bowl', aliases: ['breakfast bowl'], cal: 460 },
  { name: 'Cinnamon roll', aliases: ['cinnamon roll'], cal: 420 },
  { name: 'Scone', aliases: ['scone'], cal: 280 },
  { name: 'Danish', aliases: ['danish', 'pastry'], cal: 290 },

  // More lunch / sandwiches / wraps
  { name: 'Italian sub', aliases: ['italian sub', 'italian sandwich'], cal: 540 },
  { name: 'Reuben sandwich', aliases: ['reuben'], cal: 580 },
  { name: 'Club sandwich', aliases: ['club sandwich'], cal: 540 },
  { name: 'Chicken wrap', aliases: ['chicken wrap'], cal: 460 },
  { name: 'Veggie wrap', aliases: ['veggie wrap'], cal: 380 },
  { name: 'Burrito bowl', aliases: ['burrito bowl', 'chipotle bowl'], cal: 660 },
  { name: 'Quesadilla', aliases: ['quesadilla'], cal: 520 },
  { name: 'Chicken quesadilla', aliases: ['chicken quesadilla'], cal: 620 },
  { name: 'Buddha bowl', aliases: ['buddha bowl', 'grain bowl'], cal: 520 },
  { name: 'Poke bowl', aliases: ['poke bowl', 'poke'], cal: 540 },
  { name: 'Ramen', aliases: ['ramen', 'bowl of ramen'], cal: 480 },
  { name: 'Pho', aliases: ['pho', 'bowl of pho'], cal: 420 },
  { name: 'Banh mi', aliases: ['banh mi'], cal: 480 },
  { name: 'Falafel wrap', aliases: ['falafel wrap', 'falafel'], cal: 520 },
  { name: 'Gyro', aliases: ['gyro'], cal: 560 },
  { name: 'Hummus and pita', aliases: ['hummus and pita', 'hummus'], cal: 320 },
  { name: 'Avocado roll', aliases: ['avocado roll'], cal: 230 },
  { name: 'Spicy tuna roll', aliases: ['spicy tuna roll'], cal: 290 },
  { name: 'California roll', aliases: ['california roll'], cal: 255 },
  { name: 'Edamame', aliases: ['edamame'], cal: 120 },

  // Pasta / Italian
  { name: 'Spaghetti and meatballs', aliases: ['spaghetti and meatballs', 'spaghetti with meatballs'], cal: 620 },
  { name: 'Lasagna', aliases: ['lasagna'], cal: 550 },
  { name: 'Fettuccine alfredo', aliases: ['fettuccine alfredo', 'alfredo'], cal: 720 },
  { name: 'Pasta carbonara', aliases: ['carbonara', 'pasta carbonara'], cal: 680 },
  { name: 'Pesto pasta', aliases: ['pesto pasta'], cal: 540 },
  { name: 'Marinara pasta', aliases: ['marinara pasta', 'pasta with marinara'], cal: 420 },
  { name: 'Ravioli', aliases: ['ravioli'], cal: 490 },
  { name: 'Gnocchi', aliases: ['gnocchi'], cal: 440 },
  { name: 'Risotto', aliases: ['risotto'], cal: 480 },
  { name: 'Garlic bread', aliases: ['garlic bread'], cal: 200 },
  { name: 'Caprese salad', aliases: ['caprese', 'caprese salad'], cal: 320 },

  // Mexican
  { name: 'Chicken burrito', aliases: ['chicken burrito'], cal: 720 },
  { name: 'Beef burrito', aliases: ['beef burrito'], cal: 780 },
  { name: 'Chicken taco', aliases: ['chicken taco'], cal: 220 },
  { name: 'Beef taco', aliases: ['beef taco'], cal: 240 },
  { name: 'Carnitas tacos', aliases: ['carnitas', 'carnitas tacos'], cal: 280 },
  { name: 'Fish taco', aliases: ['fish taco'], cal: 220 },
  { name: 'Enchiladas', aliases: ['enchiladas'], cal: 540 },
  { name: 'Fajitas', aliases: ['fajitas'], cal: 580 },
  { name: 'Nachos', aliases: ['nachos'], cal: 720 },
  { name: 'Guacamole', aliases: ['guacamole', 'guac'], cal: 230 },
  { name: 'Salsa and chips', aliases: ['salsa and chips', 'chips and salsa'], cal: 340 },
  { name: 'Refried beans', aliases: ['refried beans'], cal: 220 },
  { name: 'Spanish rice', aliases: ['spanish rice', 'mexican rice'], cal: 210 },

  // Asian
  { name: 'Sweet and sour chicken', aliases: ['sweet and sour chicken'], cal: 580 },
  { name: 'Orange chicken', aliases: ['orange chicken'], cal: 620 },
  { name: 'General Tso chicken', aliases: ['general tso', 'general tsos chicken'], cal: 660 },
  { name: 'Kung Pao chicken', aliases: ['kung pao', 'kung pao chicken'], cal: 540 },
  { name: 'Beef and broccoli', aliases: ['beef and broccoli'], cal: 480 },
  { name: 'Chow mein', aliases: ['chow mein'], cal: 510 },
  { name: 'Spring roll', aliases: ['spring roll'], cal: 100 },
  { name: 'Egg roll', aliases: ['egg roll'], cal: 200 },
  { name: 'Dumplings', aliases: ['dumplings', 'potstickers'], cal: 60 },
  { name: 'Wontons', aliases: ['wonton', 'wontons'], cal: 50 },
  { name: 'Bibimbap', aliases: ['bibimbap'], cal: 580 },
  { name: 'Bulgogi', aliases: ['bulgogi'], cal: 480 },
  { name: 'Kimchi', aliases: ['kimchi'], cal: 25 },
  { name: 'Miso soup', aliases: ['miso soup'], cal: 80 },
  { name: 'Tempura', aliases: ['tempura'], cal: 320 },

  // Indian
  { name: 'Chicken tikka masala', aliases: ['tikka masala', 'chicken tikka masala'], cal: 580 },
  { name: 'Butter chicken', aliases: ['butter chicken'], cal: 620 },
  { name: 'Saag paneer', aliases: ['saag paneer', 'palak paneer'], cal: 480 },
  { name: 'Chana masala', aliases: ['chana masala', 'chickpea curry'], cal: 380 },
  { name: 'Naan', aliases: ['naan'], cal: 260 },
  { name: 'Samosa', aliases: ['samosa'], cal: 260 },
  { name: 'Biryani', aliases: ['biryani'], cal: 600 },
  { name: 'Curry', aliases: ['curry'], cal: 480 },
  { name: 'Dal', aliases: ['dal', 'dahl'], cal: 280 },

  // More dinners / proteins
  { name: 'Meatloaf', aliases: ['meatloaf'], cal: 380 },
  { name: 'Pot roast', aliases: ['pot roast'], cal: 430 },
  { name: 'Roast chicken', aliases: ['roast chicken'], cal: 380 },
  { name: 'Rotisserie chicken', aliases: ['rotisserie chicken'], cal: 320 },
  { name: 'Fried chicken', aliases: ['fried chicken'], cal: 480 },
  { name: 'BBQ ribs', aliases: ['bbq ribs', 'barbecue ribs'], cal: 620 },
  { name: 'Pulled pork', aliases: ['pulled pork'], cal: 380 },
  { name: 'Brisket', aliases: ['brisket'], cal: 420 },
  { name: 'Sausage', aliases: ['sausage'], cal: 220 },
  { name: 'Hot dog', aliases: ['hot dog', 'hotdog'], cal: 290 },
  { name: 'Bratwurst', aliases: ['bratwurst', 'brat'], cal: 340 },
  { name: 'Cod', aliases: ['cod'], cal: 240 },
  { name: 'Tilapia', aliases: ['tilapia'], cal: 240 },
  { name: 'Sea bass', aliases: ['sea bass'], cal: 280 },
  { name: 'Halibut', aliases: ['halibut'], cal: 290 },
  { name: 'Lobster', aliases: ['lobster'], cal: 280 },
  { name: 'Crab', aliases: ['crab'], cal: 220 },
  { name: 'Scallops', aliases: ['scallops'], cal: 240 },
  { name: 'Tofu', aliases: ['tofu'], cal: 180 },
  { name: 'Tempeh', aliases: ['tempeh'], cal: 220 },
  { name: 'Lentils', aliases: ['lentils'], cal: 230 },
  { name: 'Chickpeas', aliases: ['chickpeas', 'garbanzo beans'], cal: 270 },
  { name: 'Black beans', aliases: ['black beans'], cal: 220 },
  { name: 'Kidney beans', aliases: ['kidney beans'], cal: 220 },

  // More sides / starches / vegetables
  { name: 'Quinoa', aliases: ['quinoa'], cal: 220 },
  { name: 'Couscous', aliases: ['couscous'], cal: 200 },
  { name: 'Polenta', aliases: ['polenta'], cal: 180 },
  { name: 'Roasted potatoes', aliases: ['roasted potatoes'], cal: 220 },
  { name: 'French fries large', aliases: ['large fries'], cal: 510 },
  { name: 'French fries small', aliases: ['small fries'], cal: 230 },
  { name: 'Tater tots', aliases: ['tater tots'], cal: 180 },
  { name: 'Onion rings', aliases: ['onion rings'], cal: 280 },
  { name: 'Coleslaw', aliases: ['coleslaw'], cal: 180 },
  { name: 'Mashed cauliflower', aliases: ['mashed cauliflower'], cal: 90 },
  { name: 'Roasted vegetables', aliases: ['roasted vegetables', 'roasted veggies'], cal: 130 },
  { name: 'Asparagus', aliases: ['asparagus'], cal: 40 },
  { name: 'Brussels sprouts', aliases: ['brussels sprouts'], cal: 80 },
  { name: 'Zucchini', aliases: ['zucchini'], cal: 30 },
  { name: 'Cauliflower', aliases: ['cauliflower'], cal: 30 },
  { name: 'Green beans', aliases: ['green beans'], cal: 45 },
  { name: 'Cucumber', aliases: ['cucumber'], cal: 16 },
  { name: 'Tomato', aliases: ['tomato'], cal: 22 },
  { name: 'Bell pepper', aliases: ['bell pepper', 'pepper'], cal: 30 },
  { name: 'Sauteed mushrooms', aliases: ['mushrooms', 'sauteed mushrooms'], cal: 80 },
  { name: 'Kale', aliases: ['kale'], cal: 35 },
  { name: 'Arugula', aliases: ['arugula'], cal: 10 },
  { name: 'Mixed greens', aliases: ['mixed greens', 'salad greens'], cal: 15 },

  // More fruits
  { name: 'Mango', aliases: ['mango'], cal: 100 },
  { name: 'Cantaloupe', aliases: ['cantaloupe'], cal: 60 },
  { name: 'Honeydew', aliases: ['honeydew'], cal: 65 },
  { name: 'Kiwi', aliases: ['kiwi'], cal: 45 },
  { name: 'Plum', aliases: ['plum'], cal: 30 },
  { name: 'Apricot', aliases: ['apricot'], cal: 17 },
  { name: 'Cherries', aliases: ['cherries'], cal: 90 },
  { name: 'Raspberries', aliases: ['raspberries'], cal: 60 },
  { name: 'Blackberries', aliases: ['blackberries'], cal: 60 },
  { name: 'Pomegranate', aliases: ['pomegranate'], cal: 120 },
  { name: 'Grapefruit', aliases: ['grapefruit'], cal: 50 },
  { name: 'Coconut', aliases: ['coconut'], cal: 280 },
  { name: 'Avocado', aliases: ['avocado'], cal: 240 },
  { name: 'Olives', aliases: ['olives'], cal: 60 },

  // More dairy
  { name: 'Mozzarella', aliases: ['mozzarella'], cal: 80 },
  { name: 'Cheddar cheese', aliases: ['cheddar', 'cheddar cheese'], cal: 115 },
  { name: 'Parmesan', aliases: ['parmesan'], cal: 110 },
  { name: 'Feta', aliases: ['feta'], cal: 75 },
  { name: 'String cheese', aliases: ['string cheese'], cal: 80 },
  { name: 'Sour cream', aliases: ['sour cream'], cal: 60 },
  { name: 'Heavy cream', aliases: ['heavy cream'], cal: 100 },
  { name: 'Half and half', aliases: ['half and half'], cal: 40 },
  { name: 'Almond milk', aliases: ['almond milk'], cal: 40 },
  { name: 'Oat milk', aliases: ['oat milk'], cal: 120 },
  { name: 'Soy milk', aliases: ['soy milk'], cal: 100 },
  { name: 'Skim milk', aliases: ['skim milk', 'fat-free milk'], cal: 90 },
  { name: 'Whole milk', aliases: ['whole milk'], cal: 150 },

  // More snacks
  { name: 'Trail mix', aliases: ['trail mix'], cal: 290 },
  { name: 'Beef jerky', aliases: ['beef jerky', 'jerky'], cal: 110 },
  { name: 'Hummus and crackers', aliases: ['hummus and crackers'], cal: 280 },
  { name: 'Crackers', aliases: ['crackers'], cal: 130 },
  { name: 'Goldfish', aliases: ['goldfish'], cal: 140 },
  { name: 'Pita chips', aliases: ['pita chips'], cal: 140 },
  { name: 'Tortilla chips', aliases: ['tortilla chips'], cal: 200 },
  { name: 'Veggie chips', aliases: ['veggie chips'], cal: 130 },
  { name: 'Rice cakes', aliases: ['rice cake', 'rice cakes'], cal: 35 },
  { name: 'Pickle', aliases: ['pickle', 'pickles'], cal: 5 },
  { name: 'Hard-boiled egg', aliases: ['hard boiled egg', 'hard-boiled egg'], cal: 78 },
  { name: 'Mixed berries', aliases: ['mixed berries'], cal: 70 },
  { name: 'Cashews', aliases: ['cashews'], cal: 160 },
  { name: 'Pistachios', aliases: ['pistachios'], cal: 160 },
  { name: 'Walnuts', aliases: ['walnuts'], cal: 185 },
  { name: 'Pecans', aliases: ['pecans'], cal: 195 },
  { name: 'Sunflower seeds', aliases: ['sunflower seeds'], cal: 165 },
  { name: 'Pumpkin seeds', aliases: ['pumpkin seeds'], cal: 150 },
  { name: 'Dark chocolate', aliases: ['dark chocolate'], cal: 70 },
  { name: 'Milk chocolate', aliases: ['milk chocolate'], cal: 80 },
  { name: 'M&Ms', aliases: ['m&ms', 'mms', 'm and ms'], cal: 240 },
  { name: 'Snickers', aliases: ['snickers'], cal: 250 },
  { name: 'Reeses', aliases: ['reeses', "reese's"], cal: 220 },
  { name: 'Kit Kat', aliases: ['kit kat', 'kitkat'], cal: 210 },

  // Desserts
  { name: 'Cheesecake', aliases: ['cheesecake'], cal: 400 },
  { name: 'Apple pie', aliases: ['apple pie'], cal: 320 },
  { name: 'Pumpkin pie', aliases: ['pumpkin pie'], cal: 320 },
  { name: 'Brownie sundae', aliases: ['brownie sundae'], cal: 580 },
  { name: 'Cupcake', aliases: ['cupcake'], cal: 290 },
  { name: 'Slice of cake', aliases: ['slice of cake', 'piece of cake'], cal: 400 },
  { name: 'Tiramisu', aliases: ['tiramisu'], cal: 380 },
  { name: 'Creme brulee', aliases: ['creme brulee'], cal: 320 },
  { name: 'Macaron', aliases: ['macaron'], cal: 90 },
  { name: 'Frozen yogurt', aliases: ['frozen yogurt', 'froyo'], cal: 160 },
  { name: 'Ice cream sandwich', aliases: ['ice cream sandwich'], cal: 250 },
  { name: 'Milkshake', aliases: ['milkshake', 'shake'], cal: 540 },

  // Restaurant chains - common items
  { name: 'Big Mac', aliases: ['big mac'], cal: 590 },
  { name: 'Quarter Pounder', aliases: ['quarter pounder'], cal: 520 },
  { name: 'McChicken', aliases: ['mcchicken'], cal: 400 },
  { name: 'Whopper', aliases: ['whopper'], cal: 660 },
  { name: 'Chick-fil-A sandwich', aliases: ['chick fil a sandwich', 'chick-fil-a'], cal: 440 },
  { name: 'Subway 6-inch turkey', aliases: ['subway turkey', 'turkey sub'], cal: 280 },
  { name: 'Subway 6-inch Italian BMT', aliases: ['italian bmt', 'subway italian'], cal: 410 },
  { name: 'Starbucks latte grande', aliases: ['starbucks latte', 'grande latte'], cal: 190 },
  { name: 'Starbucks frappuccino', aliases: ['frappuccino', 'frap'], cal: 380 },
  { name: 'Starbucks cold brew', aliases: ['cold brew'], cal: 5 },
  { name: 'Cappuccino', aliases: ['cappuccino'], cal: 120 },
  { name: 'Macchiato', aliases: ['macchiato'], cal: 130 },
  { name: 'Iced coffee', aliases: ['iced coffee'], cal: 80 },
  { name: 'Chipotle bowl', aliases: ['chipotle bowl'], cal: 700 },
  { name: 'Domino pizza slice', aliases: ['dominos pizza slice'], cal: 290 },

  // More drinks
  { name: 'Sparkling water', aliases: ['sparkling water', 'lacroix', 'la croix'], cal: 0 },
  { name: 'Lemonade', aliases: ['lemonade'], cal: 130 },
  { name: 'Iced tea', aliases: ['iced tea'], cal: 70 },
  { name: 'Sweet tea', aliases: ['sweet tea'], cal: 130 },
  { name: 'Energy drink', aliases: ['energy drink', 'red bull', 'monster'], cal: 160 },
  { name: 'Sports drink', aliases: ['sports drink', 'gatorade', 'powerade'], cal: 130 },
  { name: 'Kombucha', aliases: ['kombucha'], cal: 60 },
  { name: 'Hot chocolate', aliases: ['hot chocolate', 'cocoa'], cal: 240 },
  { name: 'Chai latte', aliases: ['chai latte', 'chai'], cal: 240 },
  { name: 'Matcha latte', aliases: ['matcha latte', 'matcha'], cal: 200 },
  { name: 'Vodka soda', aliases: ['vodka soda'], cal: 100 },
  { name: 'Whiskey', aliases: ['whiskey', 'bourbon', 'scotch'], cal: 100 },
  { name: 'Tequila shot', aliases: ['tequila shot', 'shot of tequila'], cal: 100 },
  { name: 'Champagne', aliases: ['champagne', 'glass of champagne'], cal: 90 },
  { name: 'Mimosa', aliases: ['mimosa'], cal: 130 },
  { name: 'Hard seltzer', aliases: ['hard seltzer', 'white claw', 'truly'], cal: 100 },
  { name: 'IPA', aliases: ['ipa'], cal: 200 },
  { name: 'Light beer', aliases: ['light beer'], cal: 100 },

  // Condiments / sauces / oils
  { name: 'Mayo', aliases: ['mayo', 'mayonnaise'], cal: 100 },
  { name: 'Ketchup', aliases: ['ketchup'], cal: 20 },
  { name: 'Mustard', aliases: ['mustard'], cal: 5 },
  { name: 'Ranch', aliases: ['ranch', 'ranch dressing'], cal: 130 },
  { name: 'Honey mustard', aliases: ['honey mustard'], cal: 110 },
  { name: 'Italian dressing', aliases: ['italian dressing'], cal: 80 },
  { name: 'Caesar dressing', aliases: ['caesar dressing'], cal: 150 },
  { name: 'Olive oil', aliases: ['olive oil'], cal: 120 },
  { name: 'Butter pat', aliases: ['butter pat'], cal: 35 },
  { name: 'Honey', aliases: ['honey'], cal: 60 },
  { name: 'Maple syrup', aliases: ['maple syrup'], cal: 100 },
  { name: 'Soy sauce', aliases: ['soy sauce'], cal: 10 },
  { name: 'Hot sauce', aliases: ['hot sauce', 'sriracha'], cal: 5 },
  { name: 'Salsa', aliases: ['salsa'], cal: 10 },
];

/* ===================================================
   EXERCISE TYPES
   Calorie burn rates are rough estimates per minute for
   a ~180-lb person at moderate intensity. We scale by
   weight when estimating, but the user can always override.
   These are intentionally CONSERVATIVE — most fitness
   trackers overestimate by 30-50%.
   =================================================== */
const EXERCISE_TYPES = [
  { id: 'walking',  name: 'Walking',           calPerMin: 4,  emoji: '🚶' },
  { id: 'running',  name: 'Running',           calPerMin: 11, emoji: '🏃' },
  { id: 'cycling',  name: 'Cycling',           calPerMin: 8,  emoji: '🚴' },
  { id: 'swimming', name: 'Swimming',          calPerMin: 9,  emoji: '🏊' },
  { id: 'strength', name: 'Strength training', calPerMin: 5,  emoji: '🏋️' },
  { id: 'hiit',     name: 'HIIT / cardio',     calPerMin: 10, emoji: '⚡' },
  { id: 'yoga',     name: 'Yoga / stretching', calPerMin: 3,  emoji: '🧘' },
  { id: 'sport',    name: 'Sports / pickup',   calPerMin: 7,  emoji: '⚽' },
  { id: 'other',    name: 'Other activity',    calPerMin: 5,  emoji: '💪' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', name: 'Sedentary',          mult: 1.20, detail: 'desk job, no exercise' },
  { id: 'light',     name: 'Lightly active',     mult: 1.375, detail: 'light exercise 1-3 days/wk' },
  { id: 'moderate',  name: 'Moderately active',  mult: 1.55,  detail: 'moderate exercise 3-5 days/wk' },
  { id: 'very',      name: 'Very active',        mult: 1.725, detail: 'hard exercise 6-7 days/wk' },
  { id: 'extra',     name: 'Extra active',       mult: 1.90,  detail: 'very hard exercise + physical job' },
];

function getActivityMultiplier(level) {
  const a = ACTIVITY_LEVELS.find(x => x.id === level);
  return a ? a.mult : 1.375;
}

function getExerciseTypeById(id) {
  return EXERCISE_TYPES.find(t => t.id === id) || EXERCISE_TYPES[EXERCISE_TYPES.length - 1];
}

// Estimate calories burned for a given exercise, scaled by user weight
function estimateExerciseCalories(typeId, durationMin, userWeightLb) {
  const t = getExerciseTypeById(typeId);
  const baseRate = t.calPerMin; // for ~180 lb
  const scaleFactor = (userWeightLb || 180) / 180;
  return Math.round(baseRate * durationMin * scaleFactor);
}

/* ===================================================
   STATE & PERSISTENCE
   =================================================== */
const STORAGE_KEY = 'realcal_state_v1';
const STORAGE_BACKUP_KEY = 'realcal_state_v1_backup';
const STORAGE_BACKUP_TIME_KEY = 'realcal_state_v1_backup_time';
const STORAGE_LAST_EXPORT_KEY = 'realcal_last_export';
const STORAGE_CHAT_KEY = 'realcal_chat_v1'; // last conversation turn — persists across reloads so the Coach bubble doesn't vanish

/* Cloudflare Worker that proxies chat to Claude. Set to null to fall back to
 * the local placeholder responses (offline mode / Worker down). */
const WORKER_URL = 'https://calorie-correct-coach.calorie-correct.workers.dev';

/* Mobile tab — persists which tab the user last had active so reloads land
 * on the same tab. Desktop ignores this. */
const STORAGE_MOBILE_TAB_KEY = 'realcal_mobile_tab';
const MOBILE_BREAKPOINT = 900;
/* Two mobile tabs: Diary (default) and Results.
 * Coach chat is pinned at the bottom of the viewport on both tabs — so the
 * user can always log a meal or ask a question without switching views. */
const VALID_MOBILE_TABS = ['diary', 'results'];

function getMobileTab() {
  try {
    const t = localStorage.getItem(STORAGE_MOBILE_TAB_KEY);
    return VALID_MOBILE_TABS.includes(t) ? t : 'diary';
  } catch (e) { return 'diary'; }
}
function setMobileTab(tab) {
  if (!VALID_MOBILE_TABS.includes(tab)) tab = 'diary';
  try { localStorage.setItem(STORAGE_MOBILE_TAB_KEY, tab); } catch (e) {}
  applyMobileTab(tab);
}
function applyMobileTab(tab) {
  // Drive everything off body classes — CSS does the show/hide
  const cls = document.body.classList;
  // Clear any old coach class that might be lingering from previous versions
  cls.remove('mtab-coach');
  VALID_MOBILE_TABS.forEach(t => cls.remove('mtab-' + t));
  cls.add('mtab-' + tab);
  // Update visual state of tab bar buttons
  document.querySelectorAll('.m-tab[data-mobile-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mobileTab === tab);
  });
  // Always scroll the persistent chat history to the latest turn after swap
  setTimeout(() => {
    const histEl = document.getElementById('chat-history');
    if (histEl) histEl.scrollTop = histEl.scrollHeight;
  }, 50);
}
function wireMobileTabBar() {
  document.querySelectorAll('.m-tab[data-mobile-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      setMobileTab(btn.dataset.mobileTab);
      closeMobileDrawer();
    });
  });
}

/* Mobile chat collapse — chat-expanded body class controls whether the
 * Coach chat panel is visible (expanded) or replaced by a floating
 * Coach button (collapsed). State persists in localStorage so the user's
 * preference sticks. Default on first install: expanded so they see the
 * morning greeting; once they collapse it, stays collapsed. */
const STORAGE_CHAT_OPEN_KEY = 'realcal_chat_open';

function isChatExpanded() {
  try {
    const v = localStorage.getItem(STORAGE_CHAT_OPEN_KEY);
    if (v === null) return true; // default open on first load
    return v === '1';
  } catch (e) { return true; }
}
function setChatExpanded(open) {
  try { localStorage.setItem(STORAGE_CHAT_OPEN_KEY, open ? '1' : '0'); } catch (e) {}
  applyChatExpanded(open);
}
function applyChatExpanded(open) {
  document.body.classList.toggle('chat-expanded', !!open);
  // When opening, scroll chat history to bottom so latest is visible
  if (open) {
    setTimeout(() => {
      const histEl = document.getElementById('chat-history');
      if (histEl) histEl.scrollTop = histEl.scrollHeight;
      const inp = document.getElementById('chat-input');
      if (inp) inp.focus();
    }, 200);
  }
}
function wireChatCollapseToggle() {
  // FAB is a single element in index.html; collapse button is rendered inside
  // the chat strip and re-rendered every time the app re-renders, so we need
  // to use event delegation for it.
  const fab = document.getElementById('chat-fab');
  if (fab) fab.addEventListener('click', () => setChatExpanded(true));
  // Delegate the collapse button click to body since the chat strip re-renders
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#chat-collapse-btn');
    if (btn) setChatExpanded(false);
  });
}

/* Chat history toggle — by default we only show the most recent turn so the
 * conversation doesn't dominate the view. The user can expand to see the
 * full session's history. Preference persists across reloads.
 *
 * Distinct from the chat-strip collapse above (which hides the whole strip
 * behind the FAB on mobile). This one only collapses the *history*; the
 * input + most recent reply are always visible. */
const STORAGE_CHAT_HISTORY_KEY = 'realcal_chat_history_expanded';

function isChatHistoryExpanded() {
  try {
    return localStorage.getItem(STORAGE_CHAT_HISTORY_KEY) === '1';
  } catch (e) { return false; }
}
function setChatHistoryExpanded(expanded) {
  try { localStorage.setItem(STORAGE_CHAT_HISTORY_KEY, expanded ? '1' : '0'); } catch (e) {}
  navigate(currentView);
}

/* PWA install prompt — fires a custom banner once the user has used the app
 * a bit, suggesting they install to home screen. Two paths:
 *  - Android Chrome (and similar): captures the beforeinstallprompt event
 *    and shows a "Install Calorie Correct" banner with one-tap install.
 *  - iOS Safari (no install API): shows a banner with manual instructions
 *    ("Tap Share → Add to Home Screen").
 * Dismissible. Stays dismissed for 30 days. Doesn't show on desktop. */
const STORAGE_INSTALL_DISMISS_KEY = 'realcal_install_dismissed';
const INSTALL_DISMISS_DAYS = 30;
const INSTALL_PROMPT_MIN_MEALS = 3;
let deferredInstallPrompt = null;

function isIosSafari() {
  const ua = navigator.userAgent || '';
  const isIos = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

function isInstalledPwa() {
  // True if app is launched as installed PWA (standalone display mode)
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true; // iOS-specific
}

function shouldShowInstallPrompt() {
  if (isInstalledPwa()) return false;
  if (window.innerWidth >= 900) return false; // desktop — skip
  // Respect dismissal
  try {
    const dismissedAt = parseInt(localStorage.getItem(STORAGE_INSTALL_DISMISS_KEY) || '0');
    if (dismissedAt) {
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < INSTALL_DISMISS_DAYS) return false;
    }
  } catch (e) {}
  // Wait until the user has logged at least N meals — enough engagement to suggest installing
  const mealCount = (state && state.meals) ? state.meals.length : 0;
  if (mealCount < INSTALL_PROMPT_MIN_MEALS) return false;
  return true;
}

function showInstallBanner(opts) {
  // opts: { native: true } means we have a deferredPrompt to trigger
  // opts: { ios: true } means iOS — show manual instructions
  const native = opts && opts.native;
  const ios = opts && opts.ios;
  // Don't show twice
  if (document.getElementById('install-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.className = 'install-banner';
  banner.innerHTML = `
    <div class="install-banner-icon">
      <img src="mobile-icon.png" alt="" width="40" height="40" />
    </div>
    <div class="install-banner-text">
      <div class="install-banner-title">Install Calorie Correct</div>
      <div class="install-banner-sub">${ios
        ? "Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install."
        : "One tap to add Cal to your home screen."}</div>
    </div>
    ${native ? '<button class="install-banner-cta" id="install-banner-cta">Install</button>' : ''}
    <button class="install-banner-dismiss" id="install-banner-dismiss" aria-label="Dismiss">×</button>
  `;
  document.body.appendChild(banner);

  // Animate in
  setTimeout(() => banner.classList.add('show'), 10);

  // Wire buttons
  const dismissBtn = document.getElementById('install-banner-dismiss');
  if (dismissBtn) dismissBtn.addEventListener('click', () => {
    try { localStorage.setItem(STORAGE_INSTALL_DISMISS_KEY, String(Date.now())); } catch (e) {}
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
  });

  const ctaBtn = document.getElementById('install-banner-cta');
  if (ctaBtn) ctaBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    // Whether they accept or not, dismiss the banner
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
    if (result && result.outcome !== 'accepted') {
      // Persist dismissal so we don't pester
      try { localStorage.setItem(STORAGE_INSTALL_DISMISS_KEY, String(Date.now())); } catch (e) {}
    }
  });
}

function setupInstallPrompt() {
  // Capture the install prompt event when browser fires it
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // prevent the default mini-infobar
    deferredInstallPrompt = e;
    if (shouldShowInstallPrompt()) {
      showInstallBanner({ native: true });
    }
  });

  // iOS Safari has no beforeinstallprompt — show manual instructions instead
  // after the user has hit the engagement threshold
  if (isIosSafari()) {
    // Wait until the app has settled (user has data, has logged some meals)
    setTimeout(() => {
      if (shouldShowInstallPrompt()) {
        showInstallBanner({ ios: true });
      }
    }, 2000);
  }
}

/* Hamburger menu — opens/closes the slide-in drawer (mobile only) */
function openMobileDrawer() {
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (backdrop) backdrop.classList.add('open');
}
function closeMobileDrawer() {
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}
function wireHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('mobile-drawer-close');
  if (btn) btn.addEventListener('click', openMobileDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      // Close only when tapping the backdrop itself, not the drawer panel
      if (e.target === backdrop) closeMobileDrawer();
    });
  }
  // ESC closes the drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileDrawer();
  });
}
const TODAY_OVERRIDE = null; // production: use real today's date

let state = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    }
  } catch (e) { console.warn('Failed to load state', e); }
  return null; // first launch — onboarding will populate
}

function makeBlankState() {
  return {
    user: {
      name: 'You', sex: 'F', age: 35, heightInches: 65,
      startWeight: 180, goalWeight: 160,
      startDate: todayISO(),
      activityLevel: 'light',
      trackerAccuracy: 0.70,
      foodAccuracy: 0.85,
      targetLossRate: 1.0,
      lastGreetingDate: null,
    },
    weights: [], meals: [], exercises: [], dayNotes: {}, recipes: [], water: [],
    onboarded: false,
  };
}

function restoreFromBackup() {
  const backup = localStorage.getItem(STORAGE_BACKUP_KEY);
  if (!backup) return false;
  try {
    state = migrateState(JSON.parse(backup));
    localStorage.setItem(STORAGE_KEY, backup);
    clearChatHistory();
    return true;
  } catch (e) {
    return false;
  }
}

// Forward-compat: ensure new fields exist on old saved state
function migrateState(s) {
  if (!s.exercises) s.exercises = [];
  if (!s.user.activityLevel) s.user.activityLevel = 'light';
  if (s.user.trackerAccuracy == null) s.user.trackerAccuracy = 0.70;
  if (s.user.foodAccuracy == null) s.user.foodAccuracy = 0.85;
  if (s.user.targetLossRate == null) s.user.targetLossRate = 1.0; // lb/week
  if (s.user.lastGreetingDate === undefined) s.user.lastGreetingDate = null;
  if (!s.dayNotes) s.dayNotes = {}; // map of dateISO → note text
  if (!Array.isArray(s.water)) s.water = []; // water log: array of { id, date, time, oz }
  // Recipes were previously called "savedMeals" — migrate forward.
  if (!Array.isArray(s.recipes)) {
    s.recipes = Array.isArray(s.savedMeals) ? s.savedMeals : [];
  }
  delete s.savedMeals;
  // Upgrade legacy recipe item shape (just {name, calories}) to include macros
  // + portion so newly-logged-from-recipe meals have the same shape as Claude
  // meal logs. Old recipes will still work; macros default to 0.
  s.recipes = s.recipes.map(r => ({
    id: r.id,
    name: r.name,
    createdAt: r.createdAt || todayISO(),
    updatedAt: r.updatedAt || r.createdAt || todayISO(),
    items: (r.items || []).map(i => ({
      name: i.name || 'item',
      portion: i.portion || '',
      calories: parseInt(i.calories) || 0,
      protein_g: parseFloat(i.protein_g) || 0,
      carbs_g: parseFloat(i.carbs_g) || 0,
      fat_g: parseFloat(i.fat_g) || 0,
      fiber_g: parseFloat(i.fiber_g) || 0,
    })),
  }));
  return s;
}

function saveState() {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    // Auto-backup so corruption is recoverable
    localStorage.setItem(STORAGE_BACKUP_KEY, json);
    localStorage.setItem(STORAGE_BACKUP_TIME_KEY, new Date().toISOString());
  } catch (e) { console.warn('Failed to save state', e); }
}

function resetToDemoData() {
  state = generateDemoData();
  saveState();
  clearChatHistory();
}

function resetToBlank(profile) {
  state = {
    user: {
      name: profile.name || 'You',
      sex: profile.sex || 'F',
      age: profile.age || 35,
      heightInches: profile.heightInches || 65,
      startWeight: profile.startWeight,
      goalWeight: profile.goalWeight,
      startDate: todayISO(),
      activityLevel: 'light',
      trackerAccuracy: 0.70,
      foodAccuracy: 0.85,
      targetLossRate: 1.0,
      lastGreetingDate: null,
    },
    weights: [{ date: todayISO(), weight: profile.startWeight }],
    meals: [],
    exercises: [],
    dayNotes: {},
    recipes: [],
    water: [],
    onboarded: true,
  };
  saveState();
}

function generateDemoData() {
  const startISO = '2026-04-01';
  const endISO = '2026-05-03'; // demo period — fixed regardless of real today
  const startDate = new Date(startISO);
  const endDate = new Date(endISO);
  const days = Math.round((endDate - startDate) / 86400000);

  const startW = 191.6;
  const endW = 187.4;

  // Weights with realistic noise
  const weights = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    const trendW = startW + (endW - startW) * (i / days);
    // Noise: composed of weekly cycle + random small bumps
    const noise = Math.sin(i * 0.9) * 0.6 + Math.sin(i * 0.31) * 0.4 + ((i * 17) % 7 - 3) * 0.15;
    const w = Math.round((trendW + noise) * 10) / 10;
    weights.push({ date: formatDateISO(date), weight: w });
  }

  // Meals — generate a varied 32-day history
  const mealTemplates = {
    breakfast: [
      { time: '7:20', text: 'Greek yogurt with berries' },
      { time: '7:45', text: 'oatmeal and a banana' },
      { time: '8:00', text: 'scrambled eggs and toast' },
      { time: '7:30', text: 'bagel with cream cheese' },
      { time: '8:15', text: 'cereal with milk' },
      { time: '7:00', text: 'protein bar and coffee' },
    ],
    lunch: [
      { time: '12:30', text: 'turkey sandwich and an apple' },
      { time: '13:00', text: 'chicken caesar salad' },
      { time: '12:45', text: 'leftovers - pasta with chicken' },
      { time: '12:15', text: 'PB&J and chips' },
      { time: '13:15', text: 'ham sandwich, carrots, diet coke' },
      { time: '12:00', text: 'soup and a small salad' },
      { time: '13:30', text: 'burrito bowl with chicken' },
    ],
    dinner: [
      { time: '18:30', text: 'grilled chicken, rice, broccoli' },
      { time: '19:00', text: 'salmon, sweet potato, salad' },
      { time: '18:45', text: 'spaghetti with ground beef' },
      { time: '19:15', text: 'tacos with chicken' },
      { time: '19:30', text: 'cheeseburger and fries' },
      { time: '18:15', text: 'stir fry with chicken and rice' },
      { time: '20:00', text: 'pizza, two slices, side salad' },
    ],
    snack: [
      { time: '10:30', text: 'apple' },
      { time: '15:30', text: 'almonds' },
      { time: '15:00', text: 'greek yogurt' },
      { time: '21:00', text: 'cookie' },
      { time: '16:00', text: 'cheese and crackers' },
    ],
  };

  const meals = [];
  let mid = 1;
  for (let i = 0; i <= days; i++) {
    const date = formatDateISO(new Date(startDate.getTime() + i * 86400000));
    // Pick breakfast, lunch, dinner each day; sometimes a snack
    const dayHash = (i * 31 + 7) % mealTemplates.breakfast.length;
    const lunchIdx = (i * 17 + 3) % mealTemplates.lunch.length;
    const dinnerIdx = (i * 13 + 5) % mealTemplates.dinner.length;

    const slots = [
      { type: 'breakfast', tpl: mealTemplates.breakfast[dayHash] },
      { type: 'lunch', tpl: mealTemplates.lunch[lunchIdx] },
      { type: 'dinner', tpl: mealTemplates.dinner[dinnerIdx] },
    ];
    // Snack ~60% of days
    if (i % 5 !== 0) {
      slots.push({ type: 'snack', tpl: mealTemplates.snack[i % mealTemplates.snack.length] });
    }

    for (const slot of slots) {
      const items = parseMealText(slot.tpl.text);
      const totalCal = items.reduce((s, x) => s + x.calories, 0);
      meals.push({
        id: mid++,
        date,
        time: slot.tpl.time,
        mealType: slot.type,
        raw: slot.tpl.text,
        items,
        totalCal,
        source: 'ai',
      });
    }
  }

  // For "today" (May 3), only show breakfast + a snack so user has something to log
  const todayMeals = meals.filter(m => m.date === endISO);
  const trimmedMeals = meals.filter(m => m.date !== endISO);
  for (const m of todayMeals) {
    if (m.mealType === 'breakfast' || m.mealType === 'snack') {
      trimmedMeals.push(m);
    }
  }

  return {
    user: {
      name: 'Average Joe',
      sex: 'M',
      age: 38,
      heightInches: 70, // 5'10", roughly average for a US adult male
      startWeight: startW,
      goalWeight: 175,
      startDate: startISO,
      activityLevel: 'light',
      trackerAccuracy: 0.70,
      foodAccuracy: 0.85,
      targetLossRate: 1.0,
      lastGreetingDate: null,
    },
    weights,
    meals: trimmedMeals,
    exercises: [],
    dayNotes: {},
    onboarded: true,
    isDemo: true,
  };
}

/* ===================================================
   DATE UTILITIES
   =================================================== */
function todayISO() {
  if (TODAY_OVERRIDE) return TODAY_OVERRIDE;
  const d = new Date();
  return formatDateISO(d);
}

/* True if `s` looks like a real YYYY-MM-DD date that Date can parse. Used
 * to validate date fields Coach sends so a malformed string falls back to today. */
function isValidISODate(s) {
  if (typeof s !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(s + 'T00:00:00');
  return !isNaN(t);
}

function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISODate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a, b) {
  const da = typeof a === 'string' ? parseISODate(a) : a;
  const db = typeof b === 'string' ? parseISODate(b) : b;
  return Math.round((db - da) / 86400000);
}

function formatHumanDate(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatShortDate(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime12(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'p' : 'a';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')}${ampm}`;
}

/* ===================================================
   MATH — calibration & TDEE
   =================================================== */
function mifflinStJeor(user, weightLb) {
  const wKg = weightLb * 0.4536;
  const hCm = user.heightInches * 2.54;
  if (user.sex === 'M' || user.sex === 'male') {
    return 10 * wKg + 6.25 * hCm - 5 * user.age + 5;
  }
  return 10 * wKg + 6.25 * hCm - 5 * user.age - 161;
}

function getCurrentWeight(s) {
  if (!s.weights.length) return s.user.startWeight;
  return s.weights[s.weights.length - 1].weight;
}

function getExercisesForDate(s, date) {
  return (s.exercises || [])
    .filter(e => e.date === date)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}

function getDailyExerciseBurn(s, date) {
  return (s.exercises || [])
    .filter(e => e.date === date)
    .reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
}

function getWeeklyExerciseBurn(s, fromDate, toDate) {
  return (s.exercises || [])
    .filter(e => e.date >= fromDate && e.date <= toDate)
    .reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
}

function getAverageDailyExerciseBurn(s, fromISO, toISO) {
  const days = daysBetween(fromISO, toISO) + 1;
  if (days <= 0) return 0;
  const total = (s.exercises || [])
    .filter(e => e.date >= fromISO && e.date <= toISO)
    .reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  return total / days;
}

// Solve for the tracker_accuracy that would make predicted-loss match actual-loss.
// Method: hold intake as truth; attribute the calibration gap entirely to over-counted burn.
// Returns null if not enough data or burn isn't tracked.
function getSuggestedTrackerAccuracy(s) {
  if (!s.weights.length || !(s.exercises || []).length) return null;
  const startISO = s.weights[0].date;
  const endISO = s.weights[s.weights.length - 1].date;
  const days = daysBetween(startISO, endISO);
  if (days < 7) return null;

  const startW = s.weights[0].weight;
  const endW = smoothedRecentWeight(s);
  const actualLoss = startW - endW;
  if (actualLoss < 0.3) return null; // can't solve below noise

  const bmr = mifflinStJeor(s.user, endW);
  const restingTDEE = bmr * 1.2; // sedentary baseline since burn is explicit

  // Walk all days, sum intake and raw burn (and count days with both)
  let totalIntake = 0;
  let totalRawBurn = 0;
  let nDays = 0;
  for (let i = 0; i <= days; i++) {
    const dateISO = formatDateISO(new Date(parseISODate(startISO).getTime() + i * 86400000));
    const intake = getDailyCalories(s, dateISO);
    const burn = getDailyExerciseBurn(s, dateISO);
    if (intake < 100) continue;
    totalIntake += intake;
    totalRawBurn += burn;
    nDays++;
  }
  if (nDays < 7 || totalRawBurn === 0) return null;

  const avgIntake = totalIntake / nDays;
  const avgRawBurn = totalRawBurn / nDays;
  const actualDailyDeficit = (actualLoss * 3500) / days; // positive = deficit

  // Solve: restingTDEE + avgRawBurn * acc - avgIntake = actualDailyDeficit
  // → acc = (actualDailyDeficit + avgIntake - restingTDEE) / avgRawBurn
  const numerator = actualDailyDeficit + avgIntake - restingTDEE;
  if (avgRawBurn === 0) return null;
  let acc = numerator / avgRawBurn;
  // Clamp to reasonable range
  acc = Math.max(0.20, Math.min(1.00, acc));
  return Math.round(acc * 100) / 100; // round to 2 decimals
}

function getDailyCalories(s, date) {
  return s.meals
    .filter(m => m.date === date)
    .reduce((sum, m) => sum + m.totalCal, 0);
}

function getMealsForDate(s, date) {
  return s.meals
    .filter(m => m.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/* Water log entries for a given date, sorted by time. */
function getWaterForDate(s, date) {
  return (s.water || [])
    .filter(w => w.date === date)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}

/* Sum total water (oz) logged for a date. */
function getDailyWater(s, date) {
  return getWaterForDate(s, date).reduce((sum, w) => sum + (parseInt(w.oz) || 0), 0);
}

/* Sum macros across all meals on a date. Items may have protein_g/carbs_g/fat_g
 * (added by Claude in Phase 2; existing items have only calories). Returns
 * { protein, carbs, fat } in grams, summed across items that have those fields. */
function getDailyMacros(s, date) {
  const meals = getMealsForDate(s, date);
  let protein = 0, carbs = 0, fat = 0, fiber = 0;
  for (const m of meals) {
    for (const item of (m.items || [])) {
      if (item.protein_g != null) protein += parseFloat(item.protein_g) || 0;
      if (item.carbs_g != null) carbs += parseFloat(item.carbs_g) || 0;
      if (item.fat_g != null) fat += parseFloat(item.fat_g) || 0;
      if (item.fiber_g != null) fiber += parseFloat(item.fiber_g) || 0;
    }
  }
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: Math.round(fiber),
  };
}

/* Returns all entries for a date as a chronologically sorted array.
 * Each entry has shape: { kind, time, ...fields }
 * Used by the Diary view to render meals + activity + weight + water + notes
 * in a single time-sorted stream. */
function getDayEntries(s, date) {
  const entries = [];
  for (const m of getMealsForDate(s, date)) {
    entries.push({ kind: 'meal', time: m.time, data: m });
  }
  for (const e of getExercisesForDate(s, date)) {
    entries.push({ kind: 'exercise', time: e.time || '12:00', data: e });
  }
  const w = s.weights.find(x => x.date === date);
  if (w) entries.push({ kind: 'weight', time: w.time || '07:00', data: w });
  for (const wat of getWaterForDate(s, date)) {
    entries.push({ kind: 'water', time: wat.time || '12:00', data: wat });
  }
  entries.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  return entries;
}

/* Recent foods — most-frequently-logged item names from the last 30 days,
 * sorted by frequency desc, then by recency desc. Used to populate the
 * one-tap chip strip on Today. */
function getRecentFoods(s, limit) {
  const lim = limit || 8;
  const cutoff = new Date(Date.now() - 30 * 86400000);
  const cutoffISO = formatDateISO(cutoff);
  const counts = new Map(); // key (lowercased name) -> { name, count, lastCal, lastDate }
  for (const meal of s.meals) {
    if (meal.date < cutoffISO) continue;
    if (!Array.isArray(meal.items)) continue;
    for (const item of meal.items) {
      if (!item || !item.name) continue;
      const key = String(item.name).toLowerCase().trim();
      if (!key) continue;
      const cal = parseInt(item.calories) || 0;
      if (cal <= 0) continue; // skip zero-cal entries (data noise)
      const existing = counts.get(key);
      if (!existing) {
        counts.set(key, { name: item.name, count: 1, lastCal: cal, lastDate: meal.date });
      } else {
        existing.count += 1;
        if (meal.date >= existing.lastDate) {
          existing.lastDate = meal.date;
          existing.lastCal = cal;
        }
      }
    }
  }
  const all = Array.from(counts.values());
  all.sort((a, b) => b.count - a.count || b.lastDate.localeCompare(a.lastDate));
  return all.slice(0, lim);
}

/* Search FOOD_DB for foods whose name or aliases match the query.
 * Used by the search-as-you-type dropdown on Today.
 * Scores matches: prefix on alias > prefix on name > contained in alias > contained in name.
 * Returns up to `limit` results. */
function searchFoodDb(query, limit) {
  const lim = limit || 6;
  const q = String(query || '').toLowerCase().trim();
  if (q.length < 2) return [];
  const results = [];
  for (const f of FOOD_DB) {
    let score = 0;
    const nameLower = f.name.toLowerCase();
    if (nameLower.startsWith(q)) score = 100;
    else if (nameLower.includes(q)) score = 50;
    for (const a of (f.aliases || [])) {
      const aLower = String(a).toLowerCase();
      if (aLower === q) score = Math.max(score, 110); // exact alias = best
      else if (aLower.startsWith(q)) score = Math.max(score, 90);
      else if (aLower.includes(q)) score = Math.max(score, 40);
    }
    if (score > 0) results.push({ name: f.name, cal: f.cal, score });
  }
  results.sort((a, b) => b.score - a.score || a.name.length - b.name.length);
  return results.slice(0, lim);
}

function getAverageDailyCalories(s, fromISO, toISO) {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  const days = daysBetween(fromISO, toISO) + 1;
  if (days <= 0) return 0;
  let total = 0;
  for (let i = 0; i < days; i++) {
    const d = formatDateISO(new Date(from.getTime() + i * 86400000));
    total += getDailyCalories(s, d);
  }
  return total / days;
}

function getCalibration(s) {
  const w = s.weights;
  if (w.length < 7) return { ready: false };

  const startISO = w[0].date;
  const endISO = w[w.length - 1].date;
  const days = daysBetween(startISO, endISO);
  if (days < 6) return { ready: false };

  const startW = w[0].weight;
  const endW = smoothedRecentWeight(s);
  const actualLoss = startW - endW;

  const avgLogged = getAverageDailyCalories(s, startISO, endISO);
  if (avgLogged < 100) return { ready: false };

  // === PER-DAY CALIBRATION ===
  // Walk every day in the period. For each day with intake data, compute
  // expected deficit using THAT day's intake and THAT day's exercise burn.
  // Sum these to get the total predicted weight change in lbs.
  const bmr = mifflinStJeor(s.user, endW);
  const startDate = parseISODate(startISO);
  const endDate = parseISODate(endISO);
  const totalDays = daysBetween(startISO, endISO) + 1;

  // Detect whether exercise is tracked anywhere in the period
  let exerciseTracked = false;
  let totalIntakeOnLoggedDays = 0;
  let totalBurnOnLoggedDays = 0;
  let totalPredictedDeficit = 0;
  let daysWithIntake = 0;

  // Choose baseline: with exercise tracked → sedentary BMR (since EAT is explicit)
  //                  without exercise tracked → BMR × activity_mult (absorbs typical EAT)
  // We decide AFTER the loop, but pre-check existence:
  const totalLoggedBurn = (s.exercises || [])
    .filter(e => e.date >= startISO && e.date <= endISO)
    .reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  exerciseTracked = totalLoggedBurn > 0;
  const restingMult = exerciseTracked ? 1.2 : getActivityMultiplier(s.user.activityLevel);
  const baselineRestingTDEE = bmr * restingMult;
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;

  for (let i = 0; i < totalDays; i++) {
    const dateISO = formatDateISO(new Date(startDate.getTime() + i * 86400000));
    const dailyIntake = getDailyCalories(s, dateISO);
    const dailyBurnRaw = exerciseTracked ? getDailyExerciseBurn(s, dateISO) : 0;
    const dailyBurn = dailyBurnRaw * trackerAcc; // apply user's tracker discount
    if (dailyIntake < 100) continue; // skip days without intake data
    const dailyTDEE = baselineRestingTDEE + dailyBurn;
    const dailyDeficit = dailyTDEE - dailyIntake; // positive = deficit
    totalPredictedDeficit += dailyDeficit;
    totalIntakeOnLoggedDays += dailyIntake;
    totalBurnOnLoggedDays += dailyBurn;
    daysWithIntake++;
  }

  if (daysWithIntake < 3) return { ready: false };

  const predictedLoss = totalPredictedDeficit / 3500;
  const avgIntakePerDay = totalIntakeOnLoggedDays / daysWithIntake;
  const avgBurnPerDay = totalBurnOnLoggedDays / daysWithIntake;

  // Tracking gap: ratio of predicted-loss to actual-loss
  // factor > 1: tracking shows MORE deficit than reality (under-logged intake or over-logged burn)
  // factor < 1: tracking shows LESS deficit than reality
  let calibrationFactor = 1;
  if (predictedLoss > 0.5 && actualLoss > 0.3) {
    calibrationFactor = predictedLoss / actualLoss;
    calibrationFactor = Math.max(0.5, Math.min(4.0, calibrationFactor));
  }

  // "Real intake" — what you'd be eating if logged_intake reflected reality
  const realIntake = avgIntakePerDay * calibrationFactor;
  // Real total TDEE backed out from the weight trend
  const realTDEE = realIntake + (actualLoss * 3500 / days);

  // Tracking accuracy: 1.0 = perfectly aligned with reality
  const trackingAccuracy = predictedLoss > 0.5
    ? Math.max(0, Math.min(1, actualLoss / predictedLoss))
    : null;

  // Suggested daily intake target — aim for the user's chosen loss rate (lb/week)
  // 1 lb ≈ 3500 cal, so 1 lb/wk = 500 cal/day deficit
  const targetRate = s.user.targetLossRate != null ? s.user.targetLossRate : 1.0;
  const targetDeficit = (targetRate * 3500) / 7; // cal/day
  const atGoal = (s.user.startWeight - getCurrentWeight(s)) >= (s.user.startWeight - s.user.goalWeight) - 0.5;
  const effectiveDeficit = atGoal ? 0 : targetDeficit; // maintenance once at goal
  const dailyTarget = Math.round(((realTDEE - effectiveDeficit) / calibrationFactor) / 50) * 50;
  const dailyTargetClamped = Math.max(1200, Math.min(3500, dailyTarget));

  return {
    ready: true,
    days,
    daysWithIntake,
    actualLoss,
    predictedLoss,
    avgLogged: Math.round(avgIntakePerDay),
    avgBurn: Math.round(avgBurnPerDay),
    exerciseTracked,
    baselineTDEE: Math.round(baselineRestingTDEE + avgBurnPerDay),
    calibrationFactor,
    trackingAccuracy,
    realTDEE: Math.round(realTDEE / 10) * 10,
    realIntake: Math.round(realIntake / 10) * 10,
    dailyTarget: dailyTargetClamped,
    underLogPct: Math.round((calibrationFactor - 1) * 100),
  };
}

/* Compute the user-facing logging accuracy %.
 * Returns { value, status, days } where status is 'observed' (from weight trend
 * after calibration is ready) or 'estimated' (from tracker × food multipliers
 * before enough data accrues). Designed so foodAccuracy slots in cleanly when
 * we add it — for now foodAccuracy defaults to 1.0 if not present. */
function getOverallAccuracy(s) {
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  const foodAcc = s.user.foodAccuracy != null ? s.user.foodAccuracy : 1.0;
  const cal = getCalibration(s);
  if (cal.ready && cal.trackingAccuracy != null) {
    return {
      value: Math.round(cal.trackingAccuracy * 100),
      status: 'observed',
      days: cal.days,
    };
  }
  return {
    value: Math.round(trackerAcc * foodAcc * 100),
    status: 'estimated',
    days: 0,
  };
}

function smoothedRecentWeight(s) {
  // 7-day trailing average to reduce daily noise
  const recent = s.weights.slice(-7);
  if (!recent.length) return s.user.startWeight;
  return recent.reduce((sum, w) => sum + w.weight, 0) / recent.length;
}

function getDailyTarget(s) {
  const cal = getCalibration(s);
  if (cal.ready) return cal.dailyTarget;
  // Fallback before calibration: aim for the user's chosen rate against baseline TDEE
  const baseTDEE = mifflinStJeor(s.user, getCurrentWeight(s)) * getActivityMultiplier(s.user.activityLevel);
  const targetRate = s.user.targetLossRate != null ? s.user.targetLossRate : 1.0;
  const targetDeficit = (targetRate * 3500) / 7;
  return Math.round((baseTDEE - targetDeficit) / 50) * 50;
}

/* ===================================================
   CYCLE 1 — METRICS, STATUS, RANGES
   =================================================== */

// Filter weights/meals to a date range. range: 7|30|90|null (null = all)
function getDataInRange(s, days) {
  if (!days) return { weights: s.weights, meals: s.meals };
  if (!s.weights.length) return { weights: [], meals: [] };
  const lastISO = s.weights[s.weights.length - 1].date;
  const cutoff = new Date(parseISODate(lastISO).getTime() - (days - 1) * 86400000);
  const cutoffISO = formatDateISO(cutoff);
  return {
    weights: s.weights.filter(w => w.date >= cutoffISO),
    meals: s.meals.filter(m => m.date >= cutoffISO),
  };
}

// 7-day weight loss rate in lb/wk based on linear regression of recent weights
function get7dRate(s) {
  const recent = s.weights.slice(-14); // use 14 days for stability, scale to 7
  if (recent.length < 4) return null;
  const xs = recent.map((_, i) => i);
  const ys = recent.map(w => w.weight);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sx2 = xs.reduce((acc, x) => acc + x * x, 0);
  const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  return -slope * 7; // lbs lost per week (positive = losing)
}

// Goal progress: % of way from start to goal
function getGoalProgress(s) {
  const start = s.user.startWeight;
  const goal = s.user.goalWeight;
  const current = getCurrentWeight(s);
  const totalToLose = start - goal;
  if (Math.abs(totalToLose) < 0.5) {
    return { pct: 100, lost: 0, toGo: 0, totalToLose: 0 };
  }
  const lost = start - current;
  const pct = Math.max(0, Math.min(100, (lost / totalToLose) * 100));
  const toGo = Math.max(0, totalToLose - lost);
  return { pct, lost, toGo, totalToLose, start, goal, current };
}

// 7-day average daily intake
function get7dAvgIntake(s) {
  if (!s.weights.length) return null;
  const lastISO = s.weights[s.weights.length - 1].date;
  let total = 0;
  let days = 0;
  for (let i = 0; i < 7; i++) {
    const d = formatDateISO(new Date(parseISODate(lastISO).getTime() - i * 86400000));
    const cal = getDailyCalories(s, d);
    if (cal > 0) { total += cal; days++; }
  }
  return days > 0 ? Math.round(total / days) : null;
}

// Status helpers — return 'good' | 'warn' | 'bad' | 'spike'
function rateStatus(rate) {
  if (rate == null) return '';
  if (rate >= 0.5 && rate <= 2.5) return 'good';   // healthy loss range
  if (rate >= 0 && rate < 0.5) return 'warn';      // very slow / flat
  if (rate < 0) return 'bad';                      // gaining
  if (rate > 2.5) return 'warn';                   // too fast
  return '';
}

function intakeStatus(intake, target) {
  if (intake == null || !target) return '';
  if (intake <= target) return 'good';
  if (intake <= target + 200) return 'warn';
  if (intake >= target * 1.8) return 'spike';
  return 'bad';
}

// === Cycle 4 helpers ===

// Goal projection: weeks until goal at current rate, or null if not progressing
function getGoalProjectionInfo(s) {
  const rate = get7dRate(s); // lb/week, positive = losing
  if (rate == null || rate < 0.1) return null; // not losing, no projection
  const current = getCurrentWeight(s);
  const goal = s.user.goalWeight;
  const lbsToGo = current - goal;
  if (lbsToGo < 0.5) return { atGoal: true };
  const weeksOut = Math.ceil(lbsToGo / rate);
  if (weeksOut > 520) return null; // > 10 years; suppress as not useful
  const projDate = new Date();
  projDate.setDate(projDate.getDate() + weeksOut * 7);
  return {
    rate,
    lbsToGo,
    weeksOut,
    projDate,
    projDateStr: projDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

// Plateau detection: weight trend over last 21 days flat? (±0.35 lb/week)
function getPlateauStatus(s) {
  if (s.weights.length < 14) return null;
  const recent = s.weights.slice(-21);
  if (recent.length < 14) return null;
  const xs = recent.map((_, i) => i);
  const ys = recent.map(w => w.weight);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sx2 = xs.reduce((acc, x) => acc + x * x, 0);
  const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  const ratePerWk = -slope * 7;
  const isPlateau = Math.abs(ratePerWk) < 0.35;
  if (!isPlateau) return null;
  // Count how many days back the plateau extends
  let daysFlat = recent.length;
  return { ratePerWk, daysFlat };
}

// Day-of-week patterns: weekday avg vs weekend avg over last 30 days
function getWeekdayPatterns(s) {
  if (!s.weights.length) return null;
  const lastISO = s.weights[s.weights.length - 1].date;
  const lastDate = parseISODate(lastISO);
  let weekdayTotal = 0, weekdayCount = 0;
  let weekendTotal = 0, weekendCount = 0;
  const dayBuckets = [[], [], [], [], [], [], []]; // Sun..Sat
  for (let i = 0; i < 30; i++) {
    const d = new Date(lastDate.getTime() - i * 86400000);
    const dateISO = formatDateISO(d);
    const cal = getDailyCalories(s, dateISO);
    if (cal < 100) continue;
    const dow = d.getDay();
    dayBuckets[dow].push(cal);
    if (dow === 0 || dow === 6) {
      weekendTotal += cal;
      weekendCount++;
    } else {
      weekdayTotal += cal;
      weekdayCount++;
    }
  }
  if (weekdayCount < 3 || weekendCount < 1) return null;
  const weekdayAvg = Math.round(weekdayTotal / weekdayCount);
  const weekendAvg = Math.round(weekendTotal / weekendCount);
  const weekendBumpPct = weekdayAvg > 0 ? Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100) : 0;
  // Per-day-of-week averages for the small bar chart
  const dayAverages = dayBuckets.map(bucket =>
    bucket.length ? Math.round(bucket.reduce((s, v) => s + v, 0) / bucket.length) : null
  );
  return { weekdayAvg, weekendAvg, weekendBumpPct, dayAverages };
}

// Period comparison: compute metrics for two consecutive N-day windows
function getPeriodComparison(s, days) {
  if (!s.weights.length) return null;
  const lastISO = s.weights[s.weights.length - 1].date;
  const lastDate = parseISODate(lastISO);
  const recentEnd = lastDate;
  const recentStart = new Date(lastDate.getTime() - (days - 1) * 86400000);
  const priorEnd = new Date(recentStart.getTime() - 86400000);
  const priorStart = new Date(priorEnd.getTime() - (days - 1) * 86400000);

  const measure = (startD, endD) => {
    const startISO = formatDateISO(startD);
    const endISO = formatDateISO(endD);
    let totalIntake = 0, totalBurn = 0, daysIntake = 0;
    const totalDays = Math.round((endD - startD) / 86400000) + 1;
    for (let i = 0; i < totalDays; i++) {
      const d = formatDateISO(new Date(startD.getTime() + i * 86400000));
      const intake = getDailyCalories(s, d);
      const burn = getDailyExerciseBurn(s, d);
      if (intake > 100) { totalIntake += intake; daysIntake++; }
      totalBurn += burn;
    }
    const startW = nearestWeight(s, startISO);
    const endW = nearestWeight(s, endISO);
    return {
      startISO, endISO,
      avgIntake: daysIntake > 0 ? Math.round(totalIntake / daysIntake) : 0,
      avgBurn: Math.round(totalBurn / totalDays),
      weightDelta: startW - endW, // positive = lost
      daysLogged: daysIntake,
      totalDays,
    };
  };

  const recent = measure(recentStart, recentEnd);
  const prior = measure(priorStart, priorEnd);

  // Only return if we have meaningful data in both periods
  if (recent.daysLogged < 3 || prior.daysLogged < 3) return null;
  return { recent, prior, days };
}

// Consistency: % days with intake logged in last 30
function getConsistencyMetric(s) {
  if (!s.weights.length) return null;
  const lastISO = s.weights[s.weights.length - 1].date;
  const lastDate = parseISODate(lastISO);
  let logged = 0;
  for (let i = 0; i < 30; i++) {
    const d = formatDateISO(new Date(lastDate.getTime() - i * 86400000));
    if (getDailyCalories(s, d) > 100) logged++;
  }
  return { logged, total: 30, pct: Math.round((logged / 30) * 100) };
}

// Adherence over last N days
function getAdherenceMetrics(s) {
  if (!s.weights.length) return null;
  const lastISO = s.weights[s.weights.length - 1].date;
  const target = getDailyTarget(s);
  const spikeThreshold = target * 1.8;

  // Last 14 days adherence
  const last14 = [];
  for (let i = 0; i < 14; i++) {
    const d = formatDateISO(new Date(parseISODate(lastISO).getTime() - i * 86400000));
    const cal = getDailyCalories(s, d);
    last14.push({ date: d, cal });
  }
  const logged14 = last14.filter(d => d.cal > 0);
  const onTarget14 = logged14.filter(d => d.cal <= target).length;
  const onTargetPct = logged14.length ? Math.round((onTarget14 / logged14.length) * 100) : 0;

  // Spike days in last 30
  let spikeDays = 0;
  let daysSinceSpike = 0;
  let foundSpike = false;
  for (let i = 0; i < 30; i++) {
    const d = formatDateISO(new Date(parseISODate(lastISO).getTime() - i * 86400000));
    const cal = getDailyCalories(s, d);
    if (cal >= spikeThreshold) spikeDays++;
  }
  // Days since most recent spike (count from latest backwards)
  for (let i = 0; i < s.meals.length + 60; i++) {
    const d = formatDateISO(new Date(parseISODate(lastISO).getTime() - i * 86400000));
    const cal = getDailyCalories(s, d);
    if (cal >= spikeThreshold) { foundSpike = true; break; }
    daysSinceSpike++;
  }
  if (!foundSpike) daysSinceSpike = Math.min(daysSinceSpike, s.weights.length);

  // Last 7d weight delta (raw, not regression)
  const last7Weights = s.weights.slice(-7);
  const last7Loss = last7Weights.length >= 2
    ? last7Weights[0].weight - last7Weights[last7Weights.length - 1].weight
    : 0;

  return {
    onTargetPct,
    onTargetDays: onTarget14,
    totalLogged: logged14.length,
    spikeDays,
    daysSinceSpike,
    last7Loss,
    target,
    spikeThreshold,
  };
}

/* ===================================================
   FOOD MATCHER (mock AI parsing)
   Splits input into segments, matches each against
   FOOD_DB by alias, applies quantity if present.
   =================================================== */
function parseMealText(input) {
  const cleaned = input.toLowerCase()
    .replace(/[.\(\)]/g, '')
    .replace(/&/g, ' and ');
  // Split by commas and "and" and "+"
  const segments = cleaned.split(/,| and |\+/).map(s => s.trim()).filter(Boolean);
  const items = [];
  for (let seg of segments) {
    const item = matchSegment(seg);
    if (item) items.push(item);
  }
  // If nothing matched, return a placeholder
  if (!items.length && input.trim()) {
    items.push({ name: input.trim().slice(0, 50), calories: 250, source: 'estimated' });
  }
  return items;
}

function matchSegment(seg) {
  // Extract leading quantity if present (e.g., "2 eggs", "two slices of bread")
  let qty = 1;
  const numMatch = seg.match(/^(\d+(?:\.\d+)?)\s+/);
  if (numMatch) {
    qty = parseFloat(numMatch[1]);
    seg = seg.slice(numMatch[0].length);
  } else {
    const wordMatch = seg.match(/^(a|an|one|two|three|four|five|six|half|couple of|handful of)\s+/);
    if (wordMatch) {
      const wordMap = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, 'couple of': 2, 'handful of': 1 };
      qty = wordMap[wordMatch[1]] || 1;
      seg = seg.slice(wordMatch[0].length);
    }
  }

  // Size modifiers
  let sizeMod = 1;
  const sizeMatch = seg.match(/^(small|medium|large|big|huge|tiny|small|small bowl of|big bowl of|bowl of|slice of|piece of|cup of|glass of)\s+/);
  if (sizeMatch) {
    const sizeMap = { small: 0.7, medium: 1, large: 1.4, big: 1.4, huge: 1.8, tiny: 0.5 };
    if (sizeMap[sizeMatch[1]]) sizeMod = sizeMap[sizeMatch[1]];
    // For "slice of", "bowl of" etc, keep modifier 1 but strip prefix
    seg = seg.slice(sizeMatch[0].length);
  }

  // Try to match
  for (const food of FOOD_DB) {
    for (const alias of food.aliases) {
      if (seg === alias || seg.startsWith(alias + ' ') || seg.endsWith(' ' + alias) || seg.includes(' ' + alias + ' ') || seg === alias.replace(/s$/, '') + 's') {
        return {
          name: food.name,
          calories: Math.round(food.cal * qty * sizeMod),
          qty,
          source: 'matched',
        };
      }
    }
  }
  // Looser match: contains alias
  for (const food of FOOD_DB) {
    for (const alias of food.aliases) {
      if (alias.length >= 4 && seg.includes(alias)) {
        return {
          name: food.name,
          calories: Math.round(food.cal * qty * sizeMod),
          qty,
          source: 'matched',
        };
      }
    }
  }
  // No match — give an estimate
  return {
    name: seg.charAt(0).toUpperCase() + seg.slice(1, 40),
    calories: 200,
    qty,
    source: 'estimated',
  };
}

/* ===================================================
   COACH (canned responses)
   =================================================== */
const COACH_RESPONSES = [
  {
    keywords: ['wedding', 'party', 'event', 'birthday'],
    response: `<p>Don't bank calories all week — it usually backfires.</p><p>Eat normally Mon–Fri at your usual target. The day of: light breakfast, normal lunch focused on protein, skip morning drinks. Then enjoy dinner.</p><p>One day above target won't move the scale. Your weekly average will. You'll be fine.</p>`,
  },
  {
    keywords: ['drink', 'alcohol', 'wine', 'beer', 'cocktail'],
    response: `<p>Pick one drink type and stick with it — wine or one cocktail.</p><p>A glass of wine is ~125 cal. A margarita is ~250. The bigger trap is reduced inhibition around food, not the alcohol calories themselves.</p>`,
  },
  {
    keywords: ['plateau', 'stalled', 'not losing', 'stuck'],
    response: `<p>First, check if it's actually a plateau. A "plateau" of less than 2 weeks is just normal weight noise — water, hormones, sodium.</p><p>If it's been 3+ weeks of no change with consistent logging, your real intake has likely crept up to match your TDEE. The Reality Check screen will show you the gap.</p><p>Easiest fix: drop your daily target by 100–150 cal. Don't slash it; small adjustments compound.</p>`,
  },
  {
    keywords: ['exercise', 'workout', 'cardio', 'run', 'gym', 'walk'],
    response: `<p>Log it. Calorie Correct factors logged exercise into your weekly calibration alongside intake — the gap between your logged data and your real weight change reveals where your tracking is off, in either direction.</p><p>That said: most fitness trackers overestimate burn by 30–50%. The conservative defaults in our exercise log try to land closer to reality. If you have heart-rate-based estimates from a Garmin or Polar, those are usually closer than wrist-based watches.</p><p>The honest framing: exercise helps both directly (extra calorie burn) and indirectly (better metabolic health, appetite regulation, mood). The scale benefits from both.</p>`,
  },
  {
    keywords: ['cheat', 'cheat day', 'cheat meal', 'splurge'],
    response: `<p>"Cheat" implies guilt, and guilt isn't a useful tool here. Some days you eat more. That's normal.</p><p>If a high-cal day is followed by a normal week, you'll lose weight on average. The math doesn't care about any single meal.</p><p>What hurts is when "I cheated" turns into "screw it, I'll start over Monday" — that's where weeks of progress evaporate.</p>`,
  },
  {
    keywords: ['hungry', 'starving', 'cravings', 'craving'],
    response: `<p>Hunger isn't a sign you're doing it wrong — it's a sign there's a deficit. Some hunger is the price of weight loss.</p><p>That said, two practical levers: more protein (keeps you full longer) and more volume foods like vegetables, popcorn, fruit (lots of food for few calories).</p><p>If you're chronically miserable, your deficit might be too aggressive. We can adjust your target.</p>`,
  },
  {
    keywords: ['weigh', 'weight fluctuat', 'gained overnight', 'up 3 lb', 'up 4 lb', 'up 2 lb'],
    response: `<p>Daily weight swings of 2–4 lbs are normal and have nothing to do with fat. Sodium, water retention, hormonal cycles, glycogen, what time you weighed — all of it noise.</p><p>That's why we look at the smoothed trend, not any single day. Trust the line, ignore the dots.</p>`,
  },
  {
    keywords: ['macro', 'protein', 'carb', 'fat'],
    response: `<p>For weight loss specifically, calories matter most. Macros matter for how you <em>feel</em> while losing.</p><p>The one I'd pay attention to: protein. Aim for roughly 0.7–1g per pound of goal weight. It keeps you full and protects muscle while you lose fat.</p><p>Beyond that, eat what you enjoy in your calorie budget. There's no magic ratio.</p>`,
  },
  {
    keywords: ['restaurant', 'eating out', 'menu', 'order'],
    response: `<p>A few decent rules of thumb at restaurants:</p><p>Pick a protein-forward main (grilled chicken, fish, steak). Skip bread baskets and chips before the meal — that's where 400 invisible calories hide. Get dressing on the side.</p><p>Estimate your meal at ~30% higher than you'd think. Restaurants use way more oil than you do at home.</p>`,
  },
  {
    keywords: ['scale', 'smart scale', 'which scale'],
    response: `<p>Any consistent scale works. The popular options that sync to phones are Withings, Renpho, and Eufy — all under $50. They auto-record so you're not doing manual entry.</p><p>The single most important thing: weigh at the same time every day, ideally first thing in the morning after the bathroom and before eating or drinking.</p>`,
  },
];

const COACH_FALLBACK = `<p>Good question. I'm a prototype right now and only have canned answers — real Claude integration comes when we wire up the backend.</p><p>If you ask about plateaus, cravings, exercise, weight fluctuations, restaurants, or upcoming events, I'll do better.</p>`;

function getCoachResponse(question) {
  const q = question.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const r of COACH_RESPONSES) {
    let score = 0;
    for (const kw of r.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) { bestScore = score; best = r; }
  }
  return best ? best.response : COACH_FALLBACK;
}

/* ===================================================
   INSIGHT GENERATION
   =================================================== */
function generateWeeklyInsight(s) {
  const today = todayISO();
  const todayDate = parseISODate(today);
  const endDate = new Date(todayDate.getTime() - 86400000);
  const startDate = new Date(endDate.getTime() - 6 * 86400000);
  const startISO = formatDateISO(startDate);
  const endISO = formatDateISO(endDate);

  const dailyCals = [];
  let daysLogged = 0;
  for (let i = 0; i < 7; i++) {
    const d = formatDateISO(new Date(startDate.getTime() + i * 86400000));
    const c = getDailyCalories(s, d);
    dailyCals.push({ date: d, cal: c });
    if (c > 100) daysLogged++;
  }
  const totalCal = dailyCals.reduce((sum, x) => sum + x.cal, 0);
  const avgCal = daysLogged > 0 ? Math.round(totalCal / Math.max(daysLogged, 1)) : 0;

  if (daysLogged < 3) {
    return {
      title: daysLogged === 0 ? 'No logging yet this week.' : 'Building your first insight.',
      dateRange: `${formatShortDate(startISO).toUpperCase()} – ${formatShortDate(endISO).toUpperCase()}`,
      body: `<p>Once you've got <strong>3+ days of logged intake</strong> in a week, we'll generate a real Sunday-style insight here — what your trend says, where the math is off, what to consider doing differently.</p><p>Right now: ${daysLogged} of 7 days logged. Keep going.</p>`,
      stats: { weightDelta: 0, avgCal: 0, daysLogged },
      thin: true,
    };
  }

  const weightAt = (iso) => {
    const w = s.weights.find(w => w.date === iso);
    if (w) return w.weight;
    const target = parseISODate(iso).getTime();
    const result = s.weights.reduce((nearest, w) => {
      const dist = Math.abs(parseISODate(w.date).getTime() - target);
      return (!nearest || dist < nearest.dist) ? { weight: w.weight, dist } : nearest;
    }, null);
    return result ? result.weight : s.user.startWeight;
  };
  const startWeekW = weightAt(startISO);
  const endWeekW = weightAt(endISO);
  const weightDelta = startWeekW - endWeekW;

  const lossText = weightDelta > 0.1
    ? `down <strong>${weightDelta.toFixed(1)} lbs</strong>`
    : weightDelta < -0.1
      ? `up <strong>${Math.abs(weightDelta).toFixed(1)} lbs</strong>`
      : 'essentially flat';

  let body = `<p>You logged an average of <strong>${avgCal} cal/day</strong> this week and you're ${lossText}. `;
  if (weightDelta > 0.4) {
    body += `The math checks out — you're moving in the right direction at a healthy pace.</p>`;
  } else if (weightDelta > 0) {
    body += `Small loss, but moving the right way.</p>`;
  } else if (weightDelta > -0.5) {
    body += `Slight uptick, but well within normal weekly noise.</p>`;
  } else {
    body += `Trend is up this week.</p>`;
  }
  body += `<p><strong>Recommendation:</strong> ${weightDelta > 0.4 ? 'keep going.' : weightDelta > -0.4 ? 'stay the course; give it another week.' : 'consider lowering target by 100–150 cal.'}</p>`;

  return {
    title: 'Your week, honestly.',
    dateRange: `${formatShortDate(startISO).toUpperCase()} – ${formatShortDate(endISO).toUpperCase()}`,
    body,
    stats: { weightDelta: -weightDelta, avgCal, daysLogged },
  };
}

function nearestWeight(s, iso) {
  if (!s.weights.length) return s.user.startWeight;
  const target = parseISODate(iso).getTime();
  const result = s.weights.reduce((nearest, w) => {
    const dist = Math.abs(parseISODate(w.date).getTime() - target);
    return (!nearest || dist < nearest.dist) ? { weight: w.weight, dist } : nearest;
  }, null);
  return result ? result.weight : s.user.startWeight;
}

function smoothSeries(data, window) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(data.length, i + Math.ceil(window / 2));
    const slice = data.slice(start, end);
    result.push(slice.reduce((s, v) => s + v, 0) / slice.length);
  }
  return result;
}

function guessMealType(hour) {
  if (hour < 10) return 'breakfast';
  if (hour < 14) return 'lunch';
  if (hour < 17) return 'snack';
  if (hour < 21) return 'dinner';
  return 'snack';
}

function escapeAttr(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/* ===================================================
   ICONS
   =================================================== */
const ICON = {
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
  send: '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
};

/* ===================================================
   ROUTER & UNDO
   =================================================== */
let currentView = 'diary';

/* Coach chat history — array of turns within the current day. Each turn is
 * { id, user, coach, kind, greeting?, pending? }. BACKLOG locks in
 * "within a day" persistence: on a new day, history clears.
 * Persisted to localStorage; restored on init. When Claude API lands, the
 * same array becomes the conversation context window. */
let chatHistory = [];
let chatRefocusOnNextRender = false; // set true after submit/chip click so focus returns

/* Persistence — chat history lives in its own localStorage key (separate from
 * app state) because it's transient UX state. Stored as { date, turns } so we
 * can drop yesterday's history on first load of a new day. When Claude API is
 * wired up, the same array becomes the conversation context window. */
function loadChatHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_CHAT_KEY);
    if (!raw) return [];
    const obj = JSON.parse(raw);
    // Backward-compat: old single-turn format
    if (obj && obj.user !== undefined && !obj.turns) {
      return [obj];
    }
    if (!obj || !obj.turns) return [];
    if (obj.date !== todayISO()) return []; // new day — drop yesterday's chat
    // Drop any pending turns left over from a closed/crashed session.
    // The greeting will retry on next load if its lastGreetingDate is still stale.
    return obj.turns.filter(t => !t.pending);
  } catch (e) {
    return [];
  }
}
function saveChatHistory() {
  try {
    if (chatHistory.length === 0) {
      localStorage.removeItem(STORAGE_CHAT_KEY);
    } else {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify({ date: todayISO(), turns: chatHistory }));
    }
  } catch (e) { /* localStorage full or disabled — fail silently */ }
}
function addChatTurn(turn) {
  // Assign a stable id so we can later resolve a pending turn
  turn.id = turn.id || Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  chatHistory.push(turn);
  saveChatHistory();
  return turn.id;
}
function resolveChatTurn(id, coach, kind) {
  const idx = chatHistory.findIndex(t => t.id === id);
  if (idx < 0) return;
  chatHistory[idx].coach = coach;
  chatHistory[idx].kind = kind || chatHistory[idx].kind;
  chatHistory[idx].pending = false;
  saveChatHistory();
}
function clearChatHistory() {
  chatHistory = [];
  saveChatHistory();
}
/* Most recent turn — used by tests + helpers that look at the latest exchange */
function lastChatTurn() {
  return chatHistory.length ? chatHistory[chatHistory.length - 1] : null;
}
/* Diary view's currently-shown date. Persists across navigation within a session
 * but resets to today on page reload. Use getSelectedDate() to read it (lazy
 * default to today if not initialized). */
let selectedDate = null;
function getSelectedDate() {
  if (!selectedDate) selectedDate = todayISO();
  return selectedDate;
}
function setSelectedDate(iso) {
  selectedDate = iso;
}
function shiftSelectedDate(deltaDays) {
  const d = parseISODate(getSelectedDate());
  d.setDate(d.getDate() + deltaDays);
  selectedDate = formatDateISO(d);
}
/* Human-friendly label for the selected date.
 * Today / Yesterday / Tomorrow / "Last Thursday" (within ~6 days back) /
 * full date for anything older. */
function getSelectedDateLabel() {
  const sel = getSelectedDate();
  const today = todayISO();
  if (sel === today) return 'Today';
  const todayD = parseISODate(today);
  const selD = parseISODate(sel);
  const diff = Math.round((selD - todayD) / 86400000);
  if (diff === -1) return 'Yesterday';
  if (diff === 1) return 'Tomorrow';
  if (diff >= -6 && diff < 0) {
    return 'Last ' + selD.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return selD.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
const VIEW_RENDERERS = {};

/* Single-view app — no more tab navigation. navigate() exists as a compat
 * shim for legacy callers; it just re-renders the whole app. */
function navigate(view) {
  const prevScroll = window.scrollY;
  currentView = view || 'app';
  renderApp();
  window.scrollTo(0, prevScroll);
}

let lastAction = null;
function recordAction(action) { lastAction = action; }
function performUndo() {
  if (!lastAction) return;
  const a = lastAction;
  if (a.type === 'create-meal') state.meals = state.meals.filter(m => m.id !== a.meal.id);
  else if (a.type === 'delete-meal') { state.meals.push(a.meal); state.meals.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time)); }
  else if (a.type === 'edit-meal') { const idx = state.meals.findIndex(m => m.id === a.meal.id); if (idx >= 0) state.meals[idx] = a.before; }
  else if (a.type === 'create-weight') state.weights = state.weights.filter(w => w.date !== a.weight.date);
  else if (a.type === 'delete-weight') { state.weights.push(a.weight); state.weights.sort((x, y) => x.date.localeCompare(y.date)); }
  else if (a.type === 'edit-weight') { const idx = state.weights.findIndex(w => w.date === a.weight.date); if (idx >= 0) state.weights[idx] = a.before; }
  else if (a.type === 'create-exercise') state.exercises = state.exercises.filter(e => e.id !== a.exercise.id);
  else if (a.type === 'delete-exercise') { state.exercises.push(a.exercise); state.exercises.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time)); }
  else if (a.type === 'edit-exercise') { const idx = state.exercises.findIndex(e => e.id === a.exercise.id); if (idx >= 0) state.exercises[idx] = a.before; }
  lastAction = null;
  saveState();
  toast('Undone.');
  navigate(currentView);
}

/* ===================================================
   TOAST
   =================================================== */
function toast(msg, opts) {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.pointerEvents = 'auto';
  t.textContent = msg;
  if (opts && opts.undo && lastAction) {
    const btn = document.createElement('button');
    btn.className = 'toast-undo';
    btn.textContent = 'Undo';
    btn.addEventListener('click', () => { performUndo(); t.remove(); });
    t.appendChild(btn);
    setTimeout(() => t.remove(), 6000);
  } else {
    setTimeout(() => t.remove(), 3000);
  }
  container.appendChild(t);
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
  // Reset modal width modifier so the next modal that opens uses the default
  const m = document.getElementById('modal');
  if (m) m.className = 'modal';
}

/* ===================================================
   VIEW: HOME — Phase 3 design (locally-generated briefing
   + unified input + Today snapshot in right sidebar)
   The unified input wires to the existing parser for now;
   Phase 2 swaps in the Claude backend.
   =================================================== */

/* Generate a brand-voiced morning briefing from local data.
 * No Claude required — uses calibration, recent trend, and
 * yesterday's logging as data inputs. Honest, encouraging, brief. */
function generateDailyBriefing(s) {
  const today = todayISO();
  const yISO = getDayBeforeISO(today);
  const yMeals = s.meals.filter(m => m.date === yISO);
  const yIntake = yMeals.reduce((sum, m) => sum + m.totalCal, 0);
  const yBurnRaw = (s.exercises || []).filter(e => e.date === yISO).reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  const yBurn = Math.round(yBurnRaw * trackerAcc);
  const yNet = yIntake - yBurn;
  const target = getDailyTarget(s);
  const rate7 = get7dRate(s);
  const cal = getCalibration(s);
  const currentW = getCurrentWeight(s);
  const startW = s.user.startWeight;
  const totalLoss = startW - currentW;
  const consistency = getConsistencyMetric(s);

  // Headline: time-of-day greeting + light status reading
  const h = new Date().getHours();
  let timeGreeting;
  if (h < 12) timeGreeting = 'Good morning';
  else if (h < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  let body = '';
  let lead = '';

  // Lead with the most useful data point
  if (rate7 != null && rate7 >= 0.5 && rate7 <= 2.0) {
    lead = `You're trending down ${rate7.toFixed(2)} lb/wk. Healthy pace.`;
  } else if (rate7 != null && rate7 < 0.5 && rate7 > -0.3) {
    lead = `Your trend is flat right now. Normal — most weight loss happens in stair-step patterns.`;
  } else if (rate7 != null && rate7 < 0) {
    lead = `Your 7-day trend is up ${Math.abs(rate7).toFixed(2)} lb. Could be water, sodium, hormones — give it a few more days before reading anything into it.`;
  } else if (rate7 != null && rate7 > 2.0) {
    lead = `You're losing fast right now (${rate7.toFixed(2)} lb/wk). That's sustainable for a couple weeks but watch for fatigue.`;
  } else if (s.weights && s.weights.length < 4) {
    lead = `Welcome back. Once you've logged 4+ weights we'll have a real trend to read.`;
  } else {
    lead = `Welcome back.`;
  }

  // Body: yesterday's data
  if (yIntake > 100) {
    const vsTarget = yNet - target;
    if (Math.abs(vsTarget) < 100) {
      body = `Yesterday landed at ${yNet.toLocaleString()} cal — basically on target.`;
    } else if (vsTarget < 0) {
      body = `Yesterday came in ${Math.abs(vsTarget).toLocaleString()} cal under target. The math liked that.`;
    } else if (vsTarget < 400) {
      body = `Yesterday was ${vsTarget.toLocaleString()} cal over target. Not a problem — your weekly average is what moves the scale.`;
    } else {
      body = `Yesterday ran ${vsTarget.toLocaleString()} cal over target. One day doesn't change the trend; what you do this week does.`;
    }
  } else if (yMeals.length === 0) {
    body = `Yesterday wasn't logged. No judgment — pick it back up today.`;
  }

  // Optional: consistency callout
  let extra = '';
  if (consistency && consistency.pct >= 80) {
    extra = `You've logged ${consistency.logged} of the last ${consistency.total} days — that consistency is doing the work.`;
  } else if (consistency && consistency.pct >= 50 && consistency.pct < 80) {
    extra = `${consistency.logged} of the last ${consistency.total} days logged. Steady is what calibration runs on.`;
  }

  // Suggestion: one practical thing
  let suggestion = '';
  if (cal.ready && cal.calibrationFactor > 1.15) {
    suggestion = `Your logs predict more loss than your scale shows. The math has adjusted your target — no action needed unless you want tighter tracking.`;
  } else if (totalLoss > 0 && rate7 != null && rate7 > 0.3) {
    suggestion = `Keep doing what you're doing.`;
  } else if (rate7 != null && rate7 < 0) {
    suggestion = `If your trend stays up for another week, we'll look at adjusting your daily target.`;
  } else {
    suggestion = `Log what you eat, weigh in tomorrow morning, and we'll keep watching the trend.`;
  }

  return {
    greeting: `${timeGreeting}, ${s.user.name}.`,
    lead,
    body,
    extra,
    suggestion,
  };
}

/* ===================================================
   COACH CHAT — placeholder response generator until
   the real Claude backend lands in the next phase.
   =================================================== */

/* Generate a Coach response for a successful meal log.
 * Pulls in actual data context (cals, macros, remaining, target) and
 * varies phrasing slightly so it doesn't feel canned. */
function coachLogResponse(meal, dayDate) {
  const target = getDailyTarget(state);
  const consumed = getDailyCalories(state, dayDate);
  const remaining = target - consumed;
  const burnRaw = getDailyExerciseBurn(state, dayDate);
  const trackerAcc = state.user.trackerAccuracy != null ? state.user.trackerAccuracy : 1.0;
  const burnAdj = Math.round(burnRaw * trackerAcc);
  const dayNet = consumed - burnAdj;
  const itemsList = meal.items.map(i => i.name).join(', ');

  // Pick a varied opener — feels less robotic
  const openers = [
    `Logged ${meal.totalCal} cal.`,
    `Got it — ${meal.totalCal} cal.`,
    `Done. ${meal.totalCal} cal in.`,
    `${itemsList} — ${meal.totalCal} cal logged.`,
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  // Status callout based on remaining
  let status;
  if (remaining > 400) {
    status = `You've got <strong>${remaining.toLocaleString()} cal</strong> left for the day.`;
  } else if (remaining > 0) {
    status = `<strong>${remaining.toLocaleString()} cal</strong> left — keep dinner on the lighter side.`;
  } else if (remaining > -300) {
    status = `That puts you ${Math.abs(remaining)} cal over target. Not a problem; one day doesn't move the trend.`;
  } else {
    status = `You're ${Math.abs(remaining).toLocaleString()} over today. The week's average is what matters — see how tomorrow goes.`;
  }

  return `${opener} ${status}`;
}

/* Local fallback for the daily greeting — used when the Worker is unreachable
 * or before a Claude greeting is available. Same shape/voice as Claude
 * generates, but template-driven instead of contextual.
 *
 * For brand-new users (fewer than 4 weights logged), returns a welcoming
 * Day-1 message. For returning users, uses the standard briefing data. */
function coachDailyGreetingLocal(s) {
  const b = generateDailyBriefing(s);
  const weightCount = (s.weights || []).length;
  const mealCount = (s.meals || []).length;

  // Day 1 / very-new user: welcome + what-to-do, not analysis
  if (weightCount <= 1 && mealCount === 0) {
    return `${b.greeting} Welcome to Calorie Correct. Tell me what you ate — "turkey sandwich and an apple" — or weigh in to start your trend. Once you've logged a few days I'll start showing you how your real numbers compare to what your logs say.`;
  }
  if (weightCount < 4) {
    return `${b.greeting} You're a few days in. Keep logging meals and weighing in — once we have about a week of data I'll be able to read your trend and start calibrating the math to your body.`;
  }

  const target = getDailyTarget(s);
  const consumed = getDailyCalories(s, todayISO());
  const remaining = target - consumed;
  let openLine;
  if (consumed < 50) {
    openLine = `${b.greeting} ${b.lead}`;
  } else if (remaining > 200) {
    openLine = `${b.greeting} You've got <strong>${remaining.toLocaleString()} cal</strong> left to play with today.`;
  } else if (remaining > 0) {
    openLine = `${b.greeting} <strong>${remaining.toLocaleString()} cal</strong> left for the day.`;
  } else {
    openLine = `${b.greeting} You're at target for today already.`;
  }
  const parts = [openLine];
  if (b.body) parts.push(b.body);
  if (b.extra) parts.push(b.extra);
  parts.push(b.suggestion);
  return parts.join(' ');
}

/* Async — call the Worker to generate today's greeting via Claude.
 * Returns greeting text or null on failure. */
async function coachDailyGreetingRemote(s) {
  if (!WORKER_URL) return null;
  try {
    const h = new Date().getHours();
    const timeOfDay = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
    const response = await fetch(WORKER_URL + '/api/greeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userContext: buildUserContext(s),
        timeOfDay,
      }),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!data.greeting) throw new Error('Empty greeting');
    return data.greeting;
  } catch (e) {
    return null;
  }
}

/* Add a proactive Coach greeting as the first turn of the day.
 * Adds a pending bubble immediately (typing indicator), then async-resolves
 * with Claude's greeting. Falls back to the local template if the Worker
 * is unreachable. Persists state.user.lastGreetingDate so the greeting only
 * fires once per day. Skips if any turn already exists today. */
function seedDailyGreetingIfNeeded() {
  const today = todayISO();
  if (state.user.lastGreetingDate === today) return;
  if (chatHistory.length > 0) return; // user already has a conversation today

  // Add the pending bubble synchronously so the user sees Coach "typing"
  const turnId = addChatTurn({
    user: '',
    coach: '',
    kind: 'coach',
    greeting: true,
    pending: true,
  });

  // Mark the day immediately so we don't double-fire if the user reloads quickly.
  // If the API call fails, we still don't retry today — the local template will
  // resolve the pending bubble below, and tomorrow's greeting fires normally.
  state.user.lastGreetingDate = today;
  saveState();

  // Async resolve — call Worker, fall back to local template on any failure
  (async () => {
    const remote = await coachDailyGreetingRemote(state);
    const text = remote || coachDailyGreetingLocal(state);
    resolveChatTurn(turnId, text, 'coach');
    navigate(currentView);
  })();
}

/* Build a compact user-context snapshot the Worker passes to Claude in the
 * system prompt. Keep it short — token cost grows fast otherwise. */
/* Apply one Coach-issued edit or delete operation against state. Returns a
 * descriptor of what happened ({kind, label}) for building the toast/reply,
 * or null if the op was malformed or the target couldn't be found. Caller is
 * responsible for saveState() afterwards.
 *
 * Supported ops:
 *   { action: 'delete', target_type: 'meal'|'exercise', target_id }
 *   { action: 'update', target_type: 'meal'|'exercise', target_id, changes: {...} }
 *
 * Coach is instructed to only emit ids that appear in today's userContext, so
 * a missing target generally means the user already deleted/edited it from
 * the UI between turns. We log a no-op rather than erroring. */
function applyCoachOperation(op) {
  if (!op || !op.action || !op.target_type || op.target_id == null) return null;
  const id = op.target_id;
  if (op.action === 'delete') {
    if (op.target_type === 'meal') {
      const meal = state.meals.find(m => m.id === id);
      if (!meal) return null;
      state.meals = state.meals.filter(m => m.id !== id);
      recordAction({ type: 'delete-meal', meal });
      const label = (meal.items && meal.items[0] && meal.items[0].name) || 'meal';
      return { kind: 'delete-meal', label };
    }
    if (op.target_type === 'exercise') {
      const ex = state.exercises.find(e => e.id === id);
      if (!ex) return null;
      state.exercises = state.exercises.filter(e => e.id !== id);
      recordAction({ type: 'delete-exercise', exercise: ex });
      return { kind: 'delete-exercise', label: ex.typeName || 'activity' };
    }
    return null;
  }
  if (op.action === 'update') {
    const ch = op.changes || {};
    if (op.target_type === 'meal') {
      const idx = state.meals.findIndex(m => m.id === id);
      if (idx < 0) return null;
      const before = JSON.parse(JSON.stringify(state.meals[idx]));
      const meal = state.meals[idx];
      if (typeof ch.total_calories === 'number' && ch.total_calories >= 0) {
        const newTotal = Math.round(ch.total_calories);
        meal.totalCal = newTotal;
        // For single-item meals, keep the item in sync with the new total.
        // For multi-item, leave items alone — totalCal is the source of truth.
        if (Array.isArray(meal.items) && meal.items.length === 1) {
          meal.items[0].calories = newTotal;
        }
      }
      if (typeof ch.time === 'string' && /^\d{1,2}:\d{2}$/.test(ch.time)) {
        meal.time = ch.time.length === 4 ? '0' + ch.time : ch.time;
      }
      if (typeof ch.meal_type === 'string') meal.mealType = ch.meal_type;
      recordAction({ type: 'edit-meal', meal, before });
      return { kind: 'edit-meal', label: (meal.items && meal.items[0] && meal.items[0].name) || 'meal' };
    }
    if (op.target_type === 'exercise') {
      const idx = state.exercises.findIndex(e => e.id === id);
      if (idx < 0) return null;
      const before = JSON.parse(JSON.stringify(state.exercises[idx]));
      const ex = state.exercises[idx];
      if (typeof ch.duration_min === 'number' && ch.duration_min >= 0) {
        ex.duration = Math.round(ch.duration_min);
      }
      if (typeof ch.calories_burned === 'number' && ch.calories_burned >= 0) {
        ex.caloriesBurned = Math.round(ch.calories_burned);
      }
      if (typeof ch.type === 'string') {
        const t = getExerciseTypeById(ch.type);
        ex.type = t.id;
        ex.typeName = t.name;
        ex.typeEmoji = t.emoji;
      }
      if (typeof ch.note === 'string') ex.note = ch.note;
      recordAction({ type: 'edit-exercise', exercise: ex, before });
      return { kind: 'edit-exercise', label: ex.typeName || 'activity' };
    }
    return null;
  }
  return null;
}

function buildUserContext(s) {
  const cal = getCalibration(s);
  const currentW = getCurrentWeight(s);
  const totalLoss = s.user.startWeight - currentW;
  const rate7 = get7dRate(s);
  const target = getDailyTarget(s);
  const today = todayISO();
  const todayIntake = getDailyCalories(s, today);

  // Compact item shape used inside todayMeals / yesterdayMeals so Coach can
  // copy meals faithfully ("today I had the same as yesterday") without
  // having to re-estimate macros from a description string.
  const compactItem = (i) => ({
    name: i.name || 'item',
    portion: i.portion || '',
    calories: parseInt(i.calories) || 0,
    protein_g: Math.round((parseFloat(i.protein_g) || 0) * 10) / 10,
    carbs_g:   Math.round((parseFloat(i.carbs_g)   || 0) * 10) / 10,
    fat_g:     Math.round((parseFloat(i.fat_g)     || 0) * 10) / 10,
    fiber_g:   Math.round((parseFloat(i.fiber_g)   || 0) * 10) / 10,
  });
  const buildMealsFor = (date) => (s.meals || [])
    .filter(m => m.date === date)
    .map(m => ({
      id: m.id,
      time: m.time || '',
      mealType: m.mealType || 'unknown',
      description: (m.items && m.items.length)
        ? m.items.map(i => i.name).filter(Boolean).join(', ').slice(0, 100)
        : (m.raw || 'meal'),
      totalCal: m.totalCal != null ? m.totalCal : (m.items || []).reduce((sum, x) => sum + (parseInt(x.calories) || 0), 0),
      items: (m.items || []).map(compactItem),
    }));
  const buildExercisesFor = (date) => (s.exercises || [])
    .filter(e => e.date === date)
    .map(e => ({
      id: e.id,
      time: e.time || '',
      type: e.type || 'other',
      typeName: e.typeName || '',
      duration: e.duration || 0,
      caloriesBurned: e.caloriesBurned || 0,
      note: e.note || '',
    }));
  const todayMeals = buildMealsFor(today);
  const todayExercises = buildExercisesFor(today);
  // Yesterday's meals + exercises so Coach can reference and copy from them
  // ("today I ate the same as yesterday"). Same compact item shape — full
  // macros included so copies are faithful.
  const yesterdayISO = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  const yesterdayMeals = buildMealsFor(yesterdayISO);
  const yesterdayExercises = buildExercisesFor(yesterdayISO);
  const todayBurnCalRaw = todayExercises.reduce((sum, x) => sum + (x.caloriesBurned || 0), 0);
  // The app's UI shows burn AFTER applying the user's trackerAccuracy multiplier
  // (a personal "discount" — fitness trackers chronically over-report). Coach
  // needs the displayed number too, otherwise it looks like the math is wrong
  // when a user asks "why is my burn so low?".
  const trackerAccDecimal = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  const todayBurnCalDisplayed = Math.round(todayBurnCalRaw * trackerAccDecimal);

  // User's saved recipes — Coach uses these to recognize "log my morning
  // smoothie" and to update existing recipes by name.
  const recipes = (s.recipes || []).map(r => ({
    id: r.id,
    name: r.name,
    totalCal: (r.items || []).reduce((sum, x) => sum + (parseInt(x.calories) || 0), 0),
    ingredients: (r.items || []).map(i => i.name).filter(Boolean).join(', ').slice(0, 120),
  }));

  // Today's macros summed across all logged meals — Coach can answer
  // "how's my protein?" without needing to introspect every meal entry.
  const todayMacros = { protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const m of (s.meals || [])) {
    if (m.date !== today) continue;
    for (const i of (m.items || [])) {
      todayMacros.protein += parseFloat(i.protein_g) || 0;
      todayMacros.carbs   += parseFloat(i.carbs_g)   || 0;
      todayMacros.fat     += parseFloat(i.fat_g)     || 0;
      todayMacros.fiber   += parseFloat(i.fiber_g)   || 0;
    }
  }
  Object.keys(todayMacros).forEach(k => { todayMacros[k] = Math.round(todayMacros[k]); });

  // Today's water intake (oz) so Coach can answer "how much water have I had?"
  const todayWaterOz = (s.water || [])
    .filter(w => w.date === today)
    .reduce((sum, w) => sum + (parseInt(w.oz) || 0), 0);

  // TDEE estimate for today: BMR × activity multiplier + tracker-discounted
  // exercise burn. Today's net deficit = TDEE − intake (positive means deficit).
  const bmr = Math.round(mifflinStJeor(s.user, currentW));
  const activityMult = getActivityMultiplier(s.user.activityLevel || 'light');
  const todayTDEE = Math.round(bmr * activityMult + todayBurnCalDisplayed);
  const todayNetDeficit = todayIntake > 0 ? Math.round(todayTDEE - todayIntake) : null;

  // Projected goal date — only meaningful if user is actively losing.
  // Uses observed 7-day rate (rate7), not target rate.
  let projectedGoalDate = null;
  let weeksToGoal = null;
  const lbsToGo = Math.round((currentW - s.user.goalWeight) * 10) / 10;
  if (rate7 != null && rate7 > 0.1 && lbsToGo > 0) {
    weeksToGoal = Math.round((lbsToGo / rate7) * 10) / 10;
    const dt = new Date(Date.now() + weeksToGoal * 7 * 86400000);
    projectedGoalDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  return {
    name: s.user.name,
    sex: s.user.sex,
    age: s.user.age,
    heightInches: s.user.heightInches,
    startWeight: s.user.startWeight,
    currentWeight: Math.round(currentW * 10) / 10,
    goalWeight: s.user.goalWeight,
    lbsToGoal: lbsToGo,
    totalLossLb: Math.round(totalLoss * 10) / 10,
    rate7DayLbPerWk: rate7 != null ? Math.round(rate7 * 100) / 100 : null,
    targetLossRateLbPerWk: s.user.targetLossRate,
    activityLevel: s.user.activityLevel || 'light',
    bmrCal: bmr,
    today,
    yesterday: yesterdayISO,
    dailyTargetCal: target,
    todayIntakeCal: todayIntake,
    todayBurnCalRaw,
    todayBurnCalDisplayed,
    todayTDEE,
    todayNetDeficit,
    todayMacros,
    todayWaterOz,
    todayMeals,
    todayExercises,
    yesterdayMeals,
    yesterdayExercises,
    recipes,
    weeksToGoal,
    projectedGoalDate,
    daysOfData: (s.weights || []).length,
    calibrationReady: !!cal.ready,
    observedAccuracyPct: (cal.ready && cal.trackingAccuracy != null) ? Math.round(cal.trackingAccuracy * 100) : null,
    trackerAccuracyPct: Math.round((s.user.trackerAccuracy || 0.7) * 100),
    foodAccuracyPct: Math.round((s.user.foodAccuracy || 0.85) * 100),
  };
}

/* Convert our chatHistory (array of { user, coach, kind, greeting, pending })
 * into the Anthropic messages format ([{ role: 'user'|'assistant', content }]).
 * Skips greetings (no user message), pending turns, and the most recent turn
 * if it's the one we're currently submitting. */
function chatHistoryForApi(excludeTurnId) {
  const messages = [];
  for (const t of chatHistory) {
    if (t.id === excludeTurnId) continue;
    if (t.pending) continue;
    if (t.user) messages.push({ role: 'user', content: t.user });
    if (t.coach) messages.push({ role: 'assistant', content: stripHtml(t.coach) });
  }
  return messages;
}

/* Strip the small amount of HTML we put in coach responses (mainly <strong>)
 * so it doesn't pollute the model's context. */
function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

/* Async — call the Worker for a structured Coach response.
 * Returns { intent, confidence, summary, items } or null on failure.
 * The caller decides what to do based on intent. */
async function coachRespondRemote(text, excludeTurnId) {
  if (!WORKER_URL) return null;
  try {
    const response = await fetch(WORKER_URL + '/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: chatHistoryForApi(excludeTurnId),
        userContext: buildUserContext(state),
      }),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!data || !data.intent) throw new Error('Bad response shape');
    return data;
  } catch (e) {
    return null;
  }
}

/* Generate a Coach response for input that didn't parse as a meal.
 * Local fallback used when the Worker is unreachable. */
function coachQuestionResponse(text) {
  // Try the existing canned coach matcher first
  const cannedHtml = getCoachResponse(text);
  if (cannedHtml && !cannedHtml.includes("I'm a prototype")) {
    // We have a real canned answer — strip <p> tags and use the text
    const stripped = cannedHtml.replace(/<p>/g, '').replace(/<\/p>/g, ' ').replace(/<[^>]+>/g, '').trim();
    return stripped;
  }
  // No canned match — friendly placeholder
  return `I hear you. Real conversation is coming in the next update — for now I can log meals if you describe them ("turkey sandwich and an apple") and answer questions about plateaus, exercise, restaurants, weight fluctuations, drinks, cravings, and weekly weigh-ins.`;
}

/* Render the persistent chat surface (input + last response bubble).
 * Used at the top of Diary and Results. */
function renderChatStrip(opts) {
  const placeholder = opts && opts.placeholder ? opts.placeholder : "What's on your mind?";
  const showHint = !(opts && opts.showHint === false);
  const big = !!(opts && opts.big);
  const recent = (opts && opts.showChips !== false) ? getRecentFoods(state, 5) : [];
  const hintText = "Try: \"turkey sandwich and an apple\", \"how am I doing this week?\", or \"why did I gain 2 lbs?\"";
  // History is collapsed by default — show only the last turn. If a turn is
  // pending (Coach is thinking), keep it visible too. The user can expand to
  // see the full session's history. Preference persists.
  const expandedHistory = isChatHistoryExpanded();
  const totalTurns = chatHistory.length;
  const visibleTurns = expandedHistory ? chatHistory : chatHistory.slice(-1);
  const hiddenCount = totalTurns - visibleTurns.length;

  const renderTurn = (t, coachOnly) => {
    const userBubble = (coachOnly || t.greeting || !t.user) ? '' : `
      <div class="chat-turn-user">
        <span class="chat-turn-label">You</span>
        <span class="chat-turn-text">${escapeAttr(t.user)}</span>
      </div>`;
    const coachContent = t.pending
      ? `<span class="chat-typing"><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span></span>`
      : t.coach;
    const coachBubble = `
      <div class="chat-turn-coach chat-turn-${t.kind || 'coach'}${t.greeting ? ' chat-turn-greeting' : ''}${t.pending ? ' chat-turn-pending' : ''}">
        <span class="chat-turn-label">Cal</span>
        <span class="chat-turn-text">${coachContent}</span>
      </div>`;
    return `<div class="chat-turn">${userBubble}${coachBubble}</div>`;
  };

  // When collapsed, only show Coach's reply (no "You" bubble) — the user's
  // text is still in the input field above and isn't useful as context once
  // they've already seen Coach's response.
  const turnsHtml = visibleTurns.map(t => renderTurn(t, !expandedHistory)).join('');

  // Show toggle whenever there's more than one turn in the session, regardless
  // of current expanded state — so collapsed users can expand, and expanded
  // users can re-collapse.
  const toggleHtml = totalTurns > 1
    ? `<button class="chat-history-toggle" id="chat-history-toggle">
        ${expandedHistory
          ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg> Hide earlier messages`
          : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg> Show ${hiddenCount} earlier message${hiddenCount === 1 ? '' : 's'}`}
      </button>`
    : '';

  return `
    <div class="chat-strip${big ? ' chat-strip-big' : ''}">
      <button class="chat-collapse-btn" id="chat-collapse-btn" aria-label="Close chat">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
      </button>
      ${turnsHtml ? `<div class="chat-history" id="chat-history">${toggleHtml}${turnsHtml}</div>` : ''}

      <div class="home-input-card chat-input-card">
        <div class="home-input-wrap">
          <input class="home-input" id="chat-input" placeholder="${placeholder}" autocomplete="off" />
          <button class="ai-input-btn" id="chat-mic-btn" title="Voice input" aria-label="Voice input">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <button class="ai-input-btn" id="chat-photo-btn" title="Log meal from photo" aria-label="Log meal from photo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <input type="file" id="chat-photo-input" accept="image/*" capture="environment" style="display: none;" />
          <button class="btn btn-primary home-input-send" id="chat-send">Send</button>
        </div>

        ${showHint ? `<div class="chat-hint">${hintText}</div>` : ''}

        ${renderRecipesRow()}

        ${recent.length > 0 ? `<div class="home-chips">
          <span class="home-chips-label">Quick:</span>
          ${recent.map((f, i) => `<button class="recent-chip home-chip" data-recent-idx="${i}">
            <span class="recent-chip-name">${escapeAttr(f.name)}</span>
            <span class="recent-chip-cal">${f.lastCal}</span>
          </button>`).join('')}
        </div>` : ''}
      </div>
    </div>
  `;
}

/* Wire chat input + chips. Called after each view that includes renderChatStrip(). */
/* Voice input via Web Speech API. Click mic → start listening → speech
 * transcribes into the chat input. Click again (or stop talking) to commit.
 * The transcript drops into the input field; user reviews before sending so
 * voice mistakes don't silently log a wrong meal. */
let speechRecognition = null;       // active recognition instance, if any
let speechActiveButton = null;      // the mic button currently in the listening state

function wireMicButton(inputEl) {
  const micBtn = document.getElementById('chat-mic-btn');
  if (!micBtn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    // Browser doesn't support speech recognition (mainly Firefox). Hide the button.
    micBtn.style.display = 'none';
    return;
  }

  micBtn.addEventListener('click', () => {
    // If we're already listening, stop.
    if (speechRecognition) {
      try { speechRecognition.stop(); } catch (e) { /* no-op */ }
      return;
    }
    startSpeechRecognition(SR, micBtn, inputEl);
  });
}

function startSpeechRecognition(SR, micBtn, inputEl) {
  const recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = true;     // show partial transcript while user speaks
  recognition.continuous = false;        // single utterance per click
  recognition.maxAlternatives = 1;

  // Snapshot the current input so we can append rather than overwrite
  const baseValue = inputEl.value;
  let finalText = '';

  micBtn.classList.add('listening');
  speechRecognition = recognition;
  speechActiveButton = micBtn;

  recognition.addEventListener('result', (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) {
        finalText += r[0].transcript;
      } else {
        interim += r[0].transcript;
      }
    }
    // Live update: show what's heard so far in the input field
    const combined = (finalText + interim).trim();
    inputEl.value = baseValue ? `${baseValue} ${combined}` : combined;
  });

  recognition.addEventListener('error', (e) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      toast('Microphone permission denied. Allow mic access in your browser to use voice.');
    } else if (e.error === 'no-speech') {
      // User clicked but didn't say anything — silent fail
    } else {
      toast(`Voice input error: ${e.error}`);
    }
  });

  recognition.addEventListener('end', () => {
    micBtn.classList.remove('listening');
    speechRecognition = null;
    speechActiveButton = null;
    // Focus the input so user can verify and send
    inputEl.focus();
  });

  try {
    recognition.start();
  } catch (e) {
    // Already-started or other state error — clean up
    micBtn.classList.remove('listening');
    speechRecognition = null;
    speechActiveButton = null;
  }
}

/* Compress an image File to a base64 data URL with max edge 1024px @ JPEG 0.85.
 * Keeps photo upload payloads small (~100-300KB typical) and well under any
 * Worker / API request size limits. Returns { dataUrl, mediaType } or rejects. */
function compressImage(file, maxEdge = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image.'));
      img.onload = () => {
        const ratio = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        // Always output JPEG — smaller than PNG for photos
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl, mediaType: 'image/jpeg' });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* Wire the camera button. Click → file picker → compress → send to Worker.
 * Same chat-bubble pattern as text/voice: pending bubble while processing,
 * resolves to a meal log (with macros) or an ambiguous-question response. */
function wirePhotoButton() {
  const photoBtn = document.getElementById('chat-photo-btn');
  const fileInput = document.getElementById('chat-photo-input');
  if (!photoBtn || !fileInput) return;

  photoBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    fileInput.value = ''; // reset so the same file can be picked again
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('That file is not an image.');
      return;
    }

    photoBtn.classList.add('loading');

    // Add a pending turn so the user sees the typing indicator immediately
    const turnId = addChatTurn({
      user: '📷 Photo',
      coach: '',
      kind: 'coach',
      pending: true,
    });
    navigate(currentView);

    try {
      const { dataUrl, mediaType } = await compressImage(file);
      const remote = await parseMealPhotoRemote(dataUrl, mediaType);

      if (remote && remote.intent === 'meal' && remote.confidence >= 0.5 && Array.isArray(remote.items) && remote.items.length > 0) {
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const items = remote.items.map(it => ({
          name: it.name || 'item',
          portion: it.portion || '',
          calories: parseInt(it.calories) || 0,
          protein_g: parseFloat(it.protein_g) || 0,
          carbs_g: parseFloat(it.carbs_g) || 0,
          fat_g: parseFloat(it.fat_g) || 0,
          fiber_g: parseFloat(it.fiber_g) || 0,
          source: 'claude-vision',
        }));
        const totalCal = items.reduce((s, x) => s + x.calories, 0);
        const meal = {
          id: Date.now(),
          date: getSelectedDate(),
          time,
          mealType: guessMealType(now.getHours()),
          raw: 'photo',
          items,
          totalCal,
          source: 'claude-vision',
        };
        state.meals.push(meal);
        recordAction({ type: 'create-meal', meal });
        saveState();
        resolveChatTurn(turnId, remote.summary || coachLogResponse(meal, getSelectedDate()), 'log');
      } else if (remote && remote.summary) {
        resolveChatTurn(turnId, remote.summary, 'coach');
      } else {
        resolveChatTurn(turnId, "I couldn't quite read that photo. Try a different angle, or just describe the meal in chat.", 'error');
      }
    } catch (err) {
      resolveChatTurn(turnId, "Photo upload failed. Try again, or describe the meal in chat.", 'error');
    } finally {
      photoBtn.classList.remove('loading');
      navigate(currentView);
    }
  });
}

/* Async — POST a photo to the Worker for parsing. Returns the structured
 * response or null on failure. */
async function parseMealPhotoRemote(dataUrl, mediaType) {
  if (!WORKER_URL) return null;
  try {
    const response = await fetch(WORKER_URL + '/api/parse-meal-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: dataUrl,
        imageType: mediaType,
        userContext: buildUserContext(state),
      }),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!data || !data.intent) throw new Error('Bad response shape');
    return data;
  } catch (e) {
    return null;
  }
}

function wireChatStrip() {
  const inp = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  if (!inp || !sendBtn) return;

  // Voice input — wire the mic button if the browser supports Web Speech API.
  // Hide it on browsers that don't (mainly Firefox).
  wireMicButton(inp);

  // Photo input — file picker + compress + Worker call
  wirePhotoButton();

  // Recipe chips + manage button live in the chat input card too.
  wireRecipesRow();

  // Chat history toggle — show/hide all earlier turns
  const histToggle = document.getElementById('chat-history-toggle');
  if (histToggle) histToggle.addEventListener('click', () => setChatHistoryExpanded(!isChatHistoryExpanded()));

  const submit = () => {
    const text = inp.value.trim();
    if (!text) return;

    // Push the user message immediately with a pending Coach bubble so the
    // typing indicator shows. After ~400ms we resolve to the actual response.
    // (When Claude API lands, replace the setTimeout with a real fetch — same shape.)
    let turnId;
    try {
      turnId = addChatTurn({ user: text, coach: '', kind: 'coach', pending: true });
    } catch (e) {
      // Should never happen, but surface as an error bubble if it does
      turnId = addChatTurn({ user: text, coach: 'Something went wrong. Try again?', kind: 'error', pending: false });
      inp.value = '';
      chatRefocusOnNextRender = true;
      navigate(currentView);
      return;
    }

    inp.value = '';
    chatRefocusOnNextRender = true;
    navigate(currentView);

    // Always send to Claude; the Worker returns structured intent + items.
    // For meal intent: create a meal entry with full macros from Claude.
    // For question intent: just show the reply.
    // If Worker fails, fall back to the local food-database parser as last resort.
    (async () => {
      try {
        const remote = await coachRespondRemote(text, turnId);

        if (remote && remote.intent === 'meal' && remote.confidence >= 0.6 && Array.isArray(remote.items) && remote.items.length > 0) {
          // Meal log via Claude — items have macros + fiber. Coach may
          // optionally include a date (e.g. when user said "yesterday's lunch");
          // we honor that date if it's a valid ISO, else fall back to today.
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const dateForLog = isValidISODate(remote.date) ? remote.date : getSelectedDate();
          const items = remote.items.map(it => ({
            name: it.name || 'item',
            portion: it.portion || '',
            calories: parseInt(it.calories) || 0,
            protein_g: parseFloat(it.protein_g) || 0,
            carbs_g: parseFloat(it.carbs_g) || 0,
            fat_g: parseFloat(it.fat_g) || 0,
            fiber_g: parseFloat(it.fiber_g) || 0,
            source: 'claude',
          }));
          const totalCal = items.reduce((s, x) => s + x.calories, 0);
          const meal = {
            id: Date.now(),
            date: dateForLog,
            time,
            mealType: guessMealType(now.getHours()),
            raw: text,
            items,
            totalCal,
            source: 'claude',
          };
          state.meals.push(meal);
          state.meals.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
          recordAction({ type: 'create-meal', meal });
          saveState();
          // Use Claude's summary as Coach's reply (already brand-aligned)
          resolveChatTurn(turnId, remote.summary || coachLogResponse(meal, dateForLog), 'log');
        } else if (remote && remote.intent === 'exercise' && remote.confidence >= 0.6 && Array.isArray(remote.exercises) && remote.exercises.length > 0) {
          // Exercise log via Claude — one or more activities. Each can carry
          // its own optional date (Coach: "I ran yesterday and walked today").
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const defaultDate = isValidISODate(remote.date) ? remote.date : getSelectedDate();
          const baseId = Date.now();
          const created = [];
          remote.exercises.forEach((ex, idx) => {
            const typeRec = getExerciseTypeById(ex.type);
            const exercise = {
              id: baseId + idx,
              date: isValidISODate(ex.date) ? ex.date : defaultDate,
              time,
              type: typeRec.id,
              typeName: typeRec.name,
              typeEmoji: typeRec.emoji,
              duration: parseInt(ex.duration_min) || 0,
              caloriesBurned: parseInt(ex.calories_burned) || 0,
              note: (ex.note && ex.note.trim()) || ex.name || '',
              source: 'claude',
            };
            state.exercises.push(exercise);
            recordAction({ type: 'create-exercise', exercise });
            created.push(exercise);
          });
          state.exercises.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
          saveState();
          resolveChatTurn(turnId, remote.summary || `Logged ${created.length} activit${created.length === 1 ? 'y' : 'ies'}.`, 'log');
        } else if (remote && remote.intent === 'weigh_in' && remote.confidence >= 0.6 && Array.isArray(remote.operations) && remote.operations.length > 0) {
          // Coach is logging a weight — single weight per date, replacing if
          // there's already one. Coach can include a date (e.g. "184 yesterday morning").
          const applied = [];
          for (const op of remote.operations) {
            if (op.action !== 'weigh_in') continue;
            const w = parseFloat(op.weight);
            if (isNaN(w) || w < 50 || w > 600) continue;
            const date = isValidISODate(op.date) ? op.date : todayISO();
            const existingIdx = state.weights.findIndex(x => x.date === date);
            if (existingIdx >= 0) {
              const before = { ...state.weights[existingIdx] };
              state.weights[existingIdx].weight = w;
              recordAction({ type: 'edit-weight', weight: { date, weight: w }, before });
            } else {
              const entry = { date, weight: w };
              state.weights.push(entry);
              recordAction({ type: 'create-weight', weight: entry });
            }
            applied.push({ date, weight: w });
          }
          if (applied.length > 0) {
            state.weights.sort((a, b) => a.date.localeCompare(b.date));
            saveState();
            const last = applied[applied.length - 1];
            toast(`Weight logged: ${last.weight.toFixed(1)} lb`, { undo: true });
            resolveChatTurn(turnId, remote.summary || `Logged ${last.weight.toFixed(1)} lb for ${last.date}.`, 'log');
          } else {
            resolveChatTurn(turnId, remote.summary || "I didn't get a usable weight from that — try \"184.2 lbs this morning\".", 'coach');
          }
        } else if (remote && remote.intent === 'log_water' && remote.confidence >= 0.6 && Array.isArray(remote.operations) && remote.operations.length > 0) {
          // Water log — additive (multiple entries per day are fine).
          if (!Array.isArray(state.water)) state.water = [];
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          let totalOz = 0;
          for (const op of remote.operations) {
            if (op.action !== 'log_water') continue;
            const oz = parseInt(op.ounces);
            if (isNaN(oz) || oz <= 0 || oz > 500) continue;
            const date = isValidISODate(op.date) ? op.date : todayISO();
            const entry = { id: Date.now() + Math.floor(Math.random() * 1000), date, time, oz };
            state.water.push(entry);
            totalOz += oz;
          }
          if (totalOz > 0) {
            saveState();
            toast(`+${totalOz} oz water`);
            resolveChatTurn(turnId, remote.summary || `Logged ${totalOz} oz of water.`, 'log');
          } else {
            resolveChatTurn(turnId, remote.summary || "I didn't catch how much water — try \"32 oz\" or \"a 16 oz bottle\".", 'coach');
          }
        } else if (remote && remote.intent === 'log_recipe' && remote.confidence >= 0.6 && Array.isArray(remote.operations) && remote.operations.length > 0) {
          // Coach matched the user's request to one or more existing recipes — log each.
          const logged = [];
          for (const op of remote.operations) {
            if (op.action !== 'log_recipe') continue;
            const meal = logRecipeById(parseInt(op.recipe_id), { silent: true });
            if (meal) logged.push(meal);
          }
          if (logged.length > 0) {
            const total = logged.reduce((s, m) => s + m.totalCal, 0);
            toast(`Logged ${logged.length} recipe${logged.length === 1 ? '' : 's'} (${total} cal)`, { undo: true });
            resolveChatTurn(turnId, remote.summary || `Logged your recipe (${total} cal).`, 'log');
          } else {
            resolveChatTurn(turnId, remote.summary || "I couldn't find that recipe — has it been deleted?", 'coach');
          }
        } else if (remote && remote.intent === 'save_recipe' && remote.confidence >= 0.6 && Array.isArray(remote.operations) && remote.operations.length > 0) {
          // Coach is creating a recipe — either from a logged meal (source_meal_id)
          // or from scratch (items array). Either path produces a normalized recipe.
          const created = [];
          for (const op of remote.operations) {
            if (op.action !== 'save_recipe') continue;
            const name = (op.name || '').trim();
            if (!name) continue;
            let items = [];
            if (op.source_meal_id != null) {
              const meal = state.meals.find(m => m.id === parseInt(op.source_meal_id));
              if (meal && Array.isArray(meal.items)) items = meal.items.map(i => ({
                name: i.name || 'item',
                portion: i.portion || '',
                calories: parseInt(i.calories) || 0,
                protein_g: parseFloat(i.protein_g) || 0,
                carbs_g: parseFloat(i.carbs_g) || 0,
                fat_g: parseFloat(i.fat_g) || 0,
                fiber_g: parseFloat(i.fiber_g) || 0,
              }));
            } else if (Array.isArray(op.items)) {
              items = op.items.map(i => ({
                name: i.name || 'item',
                portion: i.portion || '',
                calories: parseInt(i.calories) || 0,
                protein_g: parseFloat(i.protein_g) || 0,
                carbs_g: parseFloat(i.carbs_g) || 0,
                fat_g: parseFloat(i.fat_g) || 0,
                fiber_g: parseFloat(i.fiber_g) || 0,
              }));
            }
            if (items.length === 0) continue;
            if (!Array.isArray(state.recipes)) state.recipes = [];
            // If a recipe with this exact name already exists, replace it. Coach's
            // "update my morning smoothie to use 250g yogurt" lands here.
            const existingIdx = state.recipes.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
            const recipe = {
              id: existingIdx >= 0 ? state.recipes[existingIdx].id : Date.now(),
              name,
              items,
              createdAt: existingIdx >= 0 ? state.recipes[existingIdx].createdAt : todayISO(),
              updatedAt: todayISO(),
            };
            if (existingIdx >= 0) state.recipes[existingIdx] = recipe;
            else state.recipes.push(recipe);
            created.push(recipe);
          }
          if (created.length > 0) {
            saveState();
            const noun = created.length === 1 ? `"${created[0].name}"` : `${created.length} recipes`;
            toast(`Saved recipe ${noun}`);
            resolveChatTurn(turnId, remote.summary || `Saved ${noun}.`, 'log');
          } else {
            resolveChatTurn(turnId, remote.summary || "I couldn't build that recipe — try giving me the ingredients.", 'coach');
          }
        } else if (remote && (remote.intent === 'delete' || remote.intent === 'edit') && remote.confidence >= 0.6 && Array.isArray(remote.operations) && remote.operations.length > 0) {
          // Coach edit/delete — apply each operation against today's log and
          // surface an undo toast so the user can roll back if Coach got it wrong.
          const applied = [];
          for (const op of remote.operations) {
            const result = applyCoachOperation(op);
            if (result) applied.push(result);
          }
          if (applied.length > 0) {
            saveState();
            // Single undo toast for the whole batch (lastAction reflects the most recent op).
            const noun = applied.length === 1 ? applied[0].label : `${applied.length} entries`;
            const verb = remote.intent === 'delete' ? 'Deleted' : 'Updated';
            toast(`${verb} ${noun}`, { undo: true });
            resolveChatTurn(turnId, remote.summary || `${verb} ${noun}.`, 'log');
          } else {
            // Coach proposed an op but no targets matched — probably stale ids.
            // Show the summary so user knows what Coach thought it was doing.
            resolveChatTurn(turnId, remote.summary || "I couldn't find that entry to change. It may have already been removed.", 'coach');
          }
        } else if (remote && remote.summary) {
          // Question or ambiguous — show Claude's reply
          resolveChatTurn(turnId, remote.summary, 'coach');
        } else {
          // Worker failed entirely — fall back to local parser
          const items = parseMealText(text);
          const hasMatch = items.some(it => it.source === 'matched');
          if (hasMatch) {
            const now = new Date();
            const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const totalCal = items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
            const meal = {
              id: Date.now(),
              date: getSelectedDate(),
              time,
              mealType: guessMealType(now.getHours()),
              raw: text,
              items,
              totalCal,
              source: 'local',
            };
            state.meals.push(meal);
            recordAction({ type: 'create-meal', meal });
            saveState();
            resolveChatTurn(turnId, coachLogResponse(meal, getSelectedDate()), 'log');
          } else {
            resolveChatTurn(turnId, coachQuestionResponse(text), 'coach');
          }
        }
      } catch (e) {
        resolveChatTurn(turnId, "Sorry — something went wrong on my end. Try again in a moment?", 'error');
      }
      navigate(currentView);
    })();
  };

  sendBtn.addEventListener('click', submit);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  // After a submit/chip click, the view re-renders and this function runs again.
  // Restore focus to the new input element so the user can keep typing without re-clicking.
  if (chatRefocusOnNextRender) {
    chatRefocusOnNextRender = false;
    // setTimeout ensures focus happens after the DOM is fully painted
    setTimeout(() => { inp.focus(); }, 0);
  }

  // Auto-scroll the chat history to the bottom so the latest turn is in view.
  const histEl = document.getElementById('chat-history');
  if (histEl) histEl.scrollTop = histEl.scrollHeight;

  document.querySelectorAll('.home-chip[data-recent-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.recentIdx);
      const recent = getRecentFoods(state, 5);
      const food = recent[idx];
      if (!food) return;
      // Build a synthetic meal for the chip click and reuse the coach response
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const meal = {
        id: Date.now(),
        date: getSelectedDate(),
        time,
        mealType: guessMealType(now.getHours()),
        raw: food.name,
        items: [{ name: food.name, calories: food.lastCal, source: 'recent' }],
        totalCal: food.lastCal,
        source: 'recent',
      };
      state.meals.push(meal);
      recordAction({ type: 'create-meal', meal });
      saveState();
      const turnId = addChatTurn({ user: food.name, coach: '', kind: 'log', pending: true });
      chatRefocusOnNextRender = true;
      navigate(currentView);
      setTimeout(() => {
        resolveChatTurn(turnId, coachLogResponse(meal, getSelectedDate()), 'log');
        navigate(currentView);
      }, 320);
    });
  });
}

/* Render the whole app — center column (Coach + Results) + right panel
 * (today's log + macros + diary stream). Single renderer; no more tab nav. */
function renderApp() {
  const centerC = document.getElementById('view-container');
  const rightC = document.getElementById('right-panel-content');
  if (!centerC || !rightC) return;

  const date = getSelectedDate();
  const today = todayISO();
  const isToday = date === today;
  const target = getDailyTarget(state);
  const consumed = getDailyCalories(state, date);
  const trackerAcc = state.user.trackerAccuracy != null ? state.user.trackerAccuracy : 1.0;
  const burnRaw = getDailyExerciseBurn(state, date);
  const burnAdj = Math.round(burnRaw * trackerAcc);
  const dayNet = consumed - burnAdj;
  const macros = getDailyMacros(state, date);
  const water = getDailyWater(state, date);
  const dayEntries = getDayEntries(state, date);

  const cal = getCalibration(state);
  const startW = state.user.startWeight;
  const currentW = getCurrentWeight(state);
  const totalLoss = startW - currentW;
  const days = state.weights.length > 1 ? daysBetween(state.weights[0].date, state.weights[state.weights.length - 1].date) : 0;
  const progress = getGoalProgress(state);

  // Coach-first: seed proactive greeting once per day
  if (isToday) seedDailyGreetingIfNeeded();

  // ============ CENTER: Coach chat (mobile tab: coach) + Results (mobile tab: results) ============
  // On desktop, both render as one column. On mobile, each is wrapped with a
  // data-mobile-tab so CSS can show only the active tab.
  centerC.innerHTML = `
    <div data-mobile-tab="coach">
      ${renderChatStrip({
        placeholder: "Tell Cal what you ate, or ask anything…",
        big: true,
      })}
    </div>

    <div data-mobile-tab="results">
      <div class="view-header">
        <div class="view-eyebrow">Results</div>
        <div class="trend-headline">
          <div class="trend-bignum ${totalLoss < 0 ? 'gain' : ''}">${totalLoss >= 0 ? '−' : '+'}${Math.abs(totalLoss).toFixed(1)} lbs</div>
          <div class="trend-bignum-label">${days > 0 ? `since you started, ${days} days ago` : 'starting line'}</div>
        </div>
      </div>

      ${renderProgressCard(progress)}

      ${renderAccuracyCard(state)}

      <div class="chart-card">
        <div class="date-range-row">
          <div class="bar-chart-legend">
            <span><span class="swatch" style="background:var(--primary)"></span>Daily</span>
            <span><span class="swatch" style="background:var(--primary-dark)"></span>7-day average</span>
            <span><span class="swatch" style="background:var(--muted-soft)"></span>Goal</span>
          </div>
          <div class="date-range-tabs" id="progress-range-tabs">
            <button class="date-range-tab ${progressRange === 7 ? 'active' : ''}" data-range="7">7D</button>
            <button class="date-range-tab ${progressRange === 30 ? 'active' : ''}" data-range="30">30D</button>
            <button class="date-range-tab ${progressRange === 90 ? 'active' : ''}" data-range="90">90D</button>
            <button class="date-range-tab ${progressRange === 0 ? 'active' : ''}" data-range="0">ALL</button>
          </div>
        </div>
        <div class="chart-canvas-wrap"><canvas id="progress-chart"></canvas></div>
      </div>
    </div>
  `;

  // ============ RIGHT: date nav + today panel + diary stream (mobile tab: diary) ============
  rightC.innerHTML = `
    <div data-mobile-tab="diary">
      <div class="diary-nav diary-nav-compact">
        <button class="diary-nav-btn" id="diary-prev" title="Previous day">‹</button>
        <div class="diary-nav-center">
          <div class="diary-nav-label">${getSelectedDateLabel()}</div>
          <div class="diary-nav-date">${formatHumanDate(date)}</div>
        </div>
        <button class="diary-nav-btn" id="diary-next" title="Next day">›</button>
        <button class="diary-nav-btn diary-nav-cal" id="diary-cal" title="Pick a date">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <input type="date" id="diary-cal-input" class="diary-cal-input" value="${date}" />
        ${!isToday ? `<button class="diary-nav-today" id="diary-today">Today</button>` : ''}
      </div>

      ${renderDailyTotalsBlock(consumed, burnAdj, dayNet, target, macros, water)}

      <div class="rp-diary">
        <div class="rp-section-head">${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}</div>
        <div class="diary-stream">
          ${dayEntries.length ? dayEntries.map(renderDiaryEntry).join('') : `<div class="diary-empty">Nothing logged ${isToday ? 'yet today' : 'this day'}.</div>`}
        </div>
      </div>
    </div>
  `;

  // Wire date navigation (right panel)
  document.getElementById('diary-prev').addEventListener('click', () => { shiftSelectedDate(-1); renderApp(); });
  document.getElementById('diary-next').addEventListener('click', () => { shiftSelectedDate(1); renderApp(); });
  const calBtn = document.getElementById('diary-cal');
  const calInput = document.getElementById('diary-cal-input');
  if (calBtn && calInput) {
    calBtn.addEventListener('click', () => calInput.showPicker ? calInput.showPicker() : calInput.click());
    calInput.addEventListener('change', (e) => { if (e.target.value) { setSelectedDate(e.target.value); renderApp(); } });
  }
  const todayBtn = document.getElementById('diary-today');
  if (todayBtn) todayBtn.addEventListener('click', () => { setSelectedDate(today); renderApp(); });

  // Diary entry edit handlers (right panel)
  rightC.querySelectorAll('[data-meal-id]').forEach(el => el.addEventListener('click', () => openMealEdit(parseInt(el.dataset.mealId))));
  rightC.querySelectorAll('[data-exercise-id]').forEach(el => el.addEventListener('click', () => openExerciseEdit(parseInt(el.dataset.exerciseId))));
  rightC.querySelectorAll('[data-weight-date]').forEach(el => el.addEventListener('click', () => openWeightEdit(el.dataset.weightDate)));
  rightC.querySelectorAll('[data-water-id]').forEach(el => el.addEventListener('click', () => openWaterEdit(parseInt(el.dataset.waterId))));

  // Wire center column interactions
  centerC.querySelectorAll('[data-range]').forEach(btn => btn.addEventListener('click', (e) => { progressRange = parseInt(e.currentTarget.dataset.range); renderApp(); }));
  wireAccuracyCard();
  wireChatStrip();

  // Render the trend chart (after DOM is in)
  setTimeout(() => { renderProgressChart(state, cal, progressRange); }, 10);
}

/* Legacy alias — older code calls VIEW_RENDERERS.diary; keep for compat. */
VIEW_RENDERERS.diary = function () { renderApp(); };

/* Add a water entry to the selected date. Used by the quick-add chips. */
function addWaterEntry(oz) {
  if (!Array.isArray(state.water)) state.water = [];
  const date = getSelectedDate();
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const entry = { id: Date.now(), date, time, oz: parseInt(oz) || 0 };
  state.water.push(entry);
  saveState();
  toast(`+${oz} oz water`);
  navigate(currentView);
}

/* Modal: log a custom water amount. */
function openWaterAdd() {
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">Log water</div><div class="modal-sub">${formatHumanDate(getSelectedDate())}</div>
    <div class="form-row"><div class="form-label">Amount (oz)</div><input class="form-input" type="number" id="water-add-oz" value="16" min="1" max="200" step="1" autofocus /></div>
    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button><button class="btn btn-primary btn-block" id="water-add-save">Log it</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  setTimeout(() => { const el = document.getElementById('water-add-oz'); if (el) el.focus(); }, 50);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  const save = () => {
    const v = parseInt(document.getElementById('water-add-oz').value);
    if (isNaN(v) || v < 1 || v > 200) return toast('Amount must be 1-200 oz');
    closeModal();
    addWaterEntry(v);
  };
  document.getElementById('water-add-save').addEventListener('click', save);
  document.getElementById('water-add-oz').addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); });
}

/* Modal: edit / delete a water entry. */
function openWaterEdit(id) {
  const w = (state.water || []).find(x => x.id === id);
  if (!w) return;
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">Edit water</div><div class="modal-sub">${formatHumanDate(w.date)} at ${formatTime12(w.time || '12:00')}</div>
    <div class="form-row"><div class="form-label">Amount (oz)</div><input class="form-input" type="number" id="water-edit-oz" value="${w.oz}" min="1" max="200" step="1" /></div>
    <div class="modal-actions modal-actions-3"><button class="btn btn-danger" id="water-edit-delete">Delete</button><button class="btn btn-secondary" id="modal-cancel">Cancel</button><button class="btn btn-primary" id="water-edit-save">Save</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('water-edit-delete').addEventListener('click', () => {
    if (!confirm('Delete this water entry?')) return;
    state.water = state.water.filter(x => x.id !== id);
    saveState(); closeModal(); toast('Water entry deleted'); navigate(currentView);
  });
  document.getElementById('water-edit-save').addEventListener('click', () => {
    const v = parseInt(document.getElementById('water-edit-oz').value);
    if (isNaN(v) || v < 1 || v > 200) return toast('Amount must be 1-200 oz');
    const idx = state.water.findIndex(x => x.id === id);
    if (idx >= 0) state.water[idx].oz = v;
    saveState(); closeModal(); toast('Water entry updated'); navigate(currentView);
  });
}

/* Render one entry in the diary stream. Different shapes per kind. */
function renderDiaryEntry(entry) {
  const t = formatTime12(entry.time || '12:00');
  if (entry.kind === 'meal') {
    const m = entry.data;
    const itemNames = m.items.map(i => i.name).join(', ');
    // Sum macros across items in this meal (where present)
    let p = 0, c = 0, f = 0, hasMacros = false;
    for (const it of m.items) {
      if (it.protein_g != null) { p += parseFloat(it.protein_g) || 0; hasMacros = true; }
      if (it.carbs_g != null)   { c += parseFloat(it.carbs_g) || 0;   hasMacros = true; }
      if (it.fat_g != null)     { f += parseFloat(it.fat_g) || 0;     hasMacros = true; }
    }
    const macroLine = hasMacros ? `<div class="diary-entry-meta">P ${Math.round(p)} · C ${Math.round(c)} · F ${Math.round(f)}</div>` : '';
    return `<div class="diary-entry diary-entry-meal clickable" data-meal-id="${m.id}">
      <div class="diary-entry-time">${t}</div>
      <div class="diary-entry-body">
        <div class="diary-entry-name">${escapeAttr(itemNames)}</div>
        ${macroLine}
      </div>
      <div class="diary-entry-cal">${m.totalCal} <span class="cal-unit">cal</span></div>
    </div>`;
  }
  if (entry.kind === 'exercise') {
    const e = entry.data;
    const detail = e.duration > 0 ? `${e.duration} min` : 'tracker daily total';
    return `<div class="diary-entry diary-entry-exercise clickable" data-exercise-id="${e.id}">
      <div class="diary-entry-time">${t}</div>
      <div class="diary-entry-body">
        <div class="diary-entry-name">${e.typeEmoji || '💪'} ${escapeAttr(e.typeName || e.type)} · ${detail}</div>
        ${e.note ? `<div class="diary-entry-meta">${escapeAttr(e.note)}</div>` : ''}
      </div>
      <div class="diary-entry-cal diary-entry-burn">−${e.caloriesBurned} <span class="cal-unit">cal</span></div>
    </div>`;
  }
  if (entry.kind === 'weight') {
    const w = entry.data;
    return `<div class="diary-entry diary-entry-weight clickable" data-weight-date="${w.date}">
      <div class="diary-entry-time">${t}</div>
      <div class="diary-entry-body">
        <div class="diary-entry-name">Weighed in · <strong>${w.weight.toFixed(1)} lb</strong></div>
      </div>
      <div class="diary-entry-cal diary-entry-water">weight</div>
    </div>`;
  }
  if (entry.kind === 'water') {
    const w = entry.data;
    return `<div class="diary-entry diary-entry-water clickable" data-water-id="${w.id}">
      <div class="diary-entry-time">${t}</div>
      <div class="diary-entry-body">
        <div class="diary-entry-name diary-entry-water-name">${w.oz} oz water</div>
      </div>
      <div class="diary-entry-cal diary-entry-water">water</div>
    </div>`;
  }
  if (entry.kind === 'note') {
    const n = entry.data;
    return `<div class="diary-entry diary-entry-note">
      <div class="diary-entry-time">${t}</div>
      <div class="diary-entry-body">
        <div class="diary-entry-name diary-entry-note-text">Note · ${escapeAttr(n.text)}</div>
      </div>
      <div class="diary-entry-cal diary-entry-water">note</div>
    </div>`;
  }
  return '';
}

/* Daily totals block — shown at the bottom of the diary stream.
 * Calories in / burned / net / target, plus macros + water totals. */
function renderDailyTotalsBlock(consumed, burned, net, target, macros, waterOz) {
  const hasIntake = consumed > 0;
  const remaining = target - consumed;
  const remainingLabel = remaining >= 0 ? 'Remaining' : 'Over target';
  const remainingValue = Math.abs(remaining);
  const proteinCal = macros.protein * 4;
  const carbCal = macros.carbs * 4;
  const fatCal = macros.fat * 9;
  const macroCalTotal = proteinCal + carbCal + fatCal;
  const hasMacros = macroCalTotal > 0;
  const proteinPct = hasMacros ? Math.round((proteinCal / macroCalTotal) * 100) : 0;
  const carbPct = hasMacros ? Math.round((carbCal / macroCalTotal) * 100) : 0;
  const fatPct = hasMacros ? 100 - proteinPct - carbPct : 0;
  const fiber = (macros.fiber != null) ? macros.fiber : 0;

  return `<div class="today-panel">
    <div class="today-panel-head">
      <span class="today-panel-eyebrow">Today</span>
    </div>

    <div class="today-headline">
      <div class="today-headline-cell">
        <div class="today-bignum">${hasIntake ? consumed.toLocaleString() : '—'}</div>
        <div class="today-bignum-label">Calories in</div>
      </div>
      <div class="today-headline-divider"></div>
      <div class="today-headline-cell">
        <div class="today-bignum ${remaining < 0 ? 'today-bignum-over' : 'today-bignum-accent'}">${hasIntake ? remainingValue.toLocaleString() : target.toLocaleString()}</div>
        <div class="today-bignum-label">${hasIntake ? remainingLabel : 'Daily target'}</div>
      </div>
    </div>

    ${hasMacros ? `
    <div class="today-macro-bar-wrap">
      <div class="today-macro-bar">
        <div class="today-macro-bar-seg today-macro-bar-protein" style="width:${proteinPct}%"></div>
        <div class="today-macro-bar-seg today-macro-bar-carbs" style="width:${carbPct}%"></div>
        <div class="today-macro-bar-seg today-macro-bar-fat" style="width:${fatPct}%"></div>
      </div>
      <div class="today-macro-legend">
        <span><span class="today-macro-dot today-macro-dot-protein"></span>Protein ${proteinPct}%</span>
        <span><span class="today-macro-dot today-macro-dot-carbs"></span>Carbs ${carbPct}%</span>
        <span><span class="today-macro-dot today-macro-dot-fat"></span>Fat ${fatPct}%</span>
      </div>
    </div>
    ` : ''}

    <div class="today-metrics">
      <div class="today-metric">
        <div class="today-metric-label">Protein</div>
        <div class="today-metric-value">${hasMacros ? macros.protein : '—'}<span class="today-metric-unit">${hasMacros ? 'g' : ''}</span></div>
      </div>
      <div class="today-metric">
        <div class="today-metric-label">Carbs</div>
        <div class="today-metric-value">${hasMacros ? macros.carbs : '—'}<span class="today-metric-unit">${hasMacros ? 'g' : ''}</span></div>
      </div>
      <div class="today-metric">
        <div class="today-metric-label">Fat</div>
        <div class="today-metric-value">${hasMacros ? macros.fat : '—'}<span class="today-metric-unit">${hasMacros ? 'g' : ''}</span></div>
      </div>
      <div class="today-metric">
        <div class="today-metric-label">Fiber</div>
        <div class="today-metric-value">${fiber > 0 ? fiber : '—'}<span class="today-metric-unit">${fiber > 0 ? 'g' : ''}</span></div>
      </div>
      <div class="today-metric">
        <div class="today-metric-label">Water</div>
        <div class="today-metric-value">${waterOz > 0 ? waterOz : '—'}<span class="today-metric-unit">${waterOz > 0 ? 'oz' : ''}</span></div>
      </div>
    </div>

    ${hasIntake || burned > 0 ? `
    <div class="today-footer">
      <span class="today-footer-burn">${burned > 0 ? '−' + burned.toLocaleString() + ' burned' : 'No exercise logged'}</span>
      <span class="today-footer-net">net ${hasIntake ? net.toLocaleString() : '0'} cal</span>
    </div>
    ` : ''}
  </div>`;
}

/* Quick-add water buttons (8 / 16 / 32 oz) shown inline in the logger area. */
function renderWaterQuickAdd() {
  return `<div class="water-quick-add">
    <span class="water-quick-label">Water:</span>
    <button class="water-chip" data-water-add="8">8 oz</button>
    <button class="water-chip" data-water-add="12">12 oz</button>
    <button class="water-chip" data-water-add="16">16 oz</button>
    <button class="water-chip" data-water-add="32">32 oz</button>
  </div>`;
}

function wireWaterQuickAdd() {
  document.querySelectorAll('[data-water-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const oz = parseInt(btn.dataset.waterAdd);
      addWaterEntry(oz);
    });
  });
}

function renderProgressCard(progress) {
  if (progress.totalToLose < 0.5) return '';
  const proj = getGoalProjectionInfo(state);
  const targetRate = state.user.targetLossRate != null ? state.user.targetLossRate : 1.0;
  let targetProj = null;
  if (targetRate > 0 && progress.toGo > 0.5) {
    const targetWeeks = Math.ceil(progress.toGo / targetRate);
    if (targetWeeks <= 520) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + targetWeeks * 7);
      targetProj = { weeks: targetWeeks, dateStr: targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
    }
  }
  let gapMsg = '';
  if (proj && !proj.atGoal && targetProj && targetRate > 0) {
    const weekGap = proj.weeksOut - targetProj.weeks;
    if (weekGap > 4) gapMsg = `You're <strong>${weekGap} weeks behind</strong> your target pace.`;
    else if (weekGap < -4) gapMsg = `You're <strong>${Math.abs(weekGap)} weeks ahead</strong> of your target pace.`;
    else gapMsg = `You're <strong>on pace</strong> with your target rate.`;
  }
  return `<div class="progress-card">
    <div class="progress-header">
      <div><div class="progress-title">Progress to goal · ${progress.goal.toFixed(0)} lb</div><div class="progress-detail">${progress.current.toFixed(1)} lb today · started at ${progress.start.toFixed(1)} lb</div></div>
      <div class="progress-value"><span class="pct">${progress.pct.toFixed(0)}%</span></div>
    </div>
    <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${progress.pct}%"></div></div>
    <div class="progress-meta"><span>${progress.lost.toFixed(1)} lb lost</span><span>${progress.toGo.toFixed(1)} lb to go</span></div>
    ${proj && proj.atGoal ? `<div class="projection-line"><strong>You're at goal weight.</strong></div>` : `
    <div class="projection-line">
      ${proj ? `<strong>Current pace</strong> · ${proj.rate.toFixed(2)} lb/wk → <span class="proj-emph">${proj.projDateStr}</span> (${proj.weeksOut} wk)` : `<strong>Current pace</strong> · need a downward trend to project — keep logging`}
      ${targetProj ? `<br><strong>Target pace</strong> · ${targetRate.toFixed(2)} lb/wk → <span class="proj-emph">${targetProj.dateStr}</span> (${targetProj.weeks} wk)` : targetRate === 0 ? `<br><strong>Target pace</strong> · maintenance mode (no deficit)` : ''}
      ${gapMsg ? `<br><em style="color: var(--muted);">${gapMsg}</em>` : ''}
    </div>`}
  </div>`;
}

/* Logging accuracy + calibration card — sits below the progress card on Results.
 * Headline % at the top, then two sliders for the underlying multipliers
 * (calories out — tracker, calories in — food logging). Each slider has
 * anchor labels. The headline updates live as the user drags. The "what the
 * math sees" block at the bottom shows the calibration numbers (predicted vs
 * actual loss, real intake/TDEE, daily target). */
function renderAccuracyCard(s) {
  const acc = getOverallAccuracy(s);
  const cal = getCalibration(s);
  const trackerPct = Math.round((s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 0.70) * 100);
  const foodPct = Math.round((s.user.foodAccuracy != null ? s.user.foodAccuracy : 0.85) * 100);
  const estimatePct = Math.round((trackerPct * foodPct) / 100);

  let copy;
  if (acc.status === 'observed') {
    if (acc.value >= 90) {
      copy = `Tight match between your logs and your scale. The math barely needs to adjust.`;
    } else if (acc.value >= 70) {
      copy = `About <strong>${100 - acc.value}%</strong> of the deficit your logs claim isn't reaching reality — typical gap. The math compensates automatically.`;
    } else if (acc.value >= 40) {
      copy = `<strong>${100 - acc.value}%</strong> of your logged deficit isn't reaching reality. Could be unlogged bites, restaurant guesses, or tracker overcount. None of it requires action — calibration absorbs it.`;
    } else {
      copy = `Your scale and your logs are far apart right now. We'll keep recalibrating; no need to log differently.`;
    }
  } else {
    copy = `Estimate based on your slider settings below. We'll switch to your actual weight trend after about 14 days of logging.`;
  }

  const observedNote = acc.status === 'observed' && Math.abs(acc.value - estimatePct) >= 5
    ? `<div class="accuracy-meta">Your sliders estimate ${estimatePct}%; your scale shows ${acc.value}%.</div>`
    : '';

  return `<div class="accuracy-card">
    <div class="accuracy-head">
      <span class="accuracy-eyebrow">Logging accuracy</span>
      <span class="accuracy-status accuracy-status-${acc.status}">${acc.status === 'observed' ? `Observed · ${acc.days} days` : 'Estimated'}</span>
    </div>

    <div class="accuracy-number" id="accuracy-headline">${acc.value}<span class="accuracy-pct">%</span></div>
    <div class="accuracy-copy">${copy}</div>
    ${observedNote}

    <div class="accuracy-sliders">
      <div class="accuracy-slider-row">
        <div class="accuracy-slider-head">
          <span class="accuracy-slider-label">Calories out — tracker</span>
          <span class="accuracy-slider-value" id="acc-tracker-val">${trackerPct}%</span>
        </div>
        <input type="range" min="30" max="100" step="5" value="${trackerPct}" id="acc-tracker-slider" class="accuracy-slider" />
        <div class="accuracy-slider-anchors">
          <span>None / gym machine</span>
          <span>Wrist tracker</span>
          <span>Chest strap</span>
        </div>
      </div>

      <div class="accuracy-slider-row">
        <div class="accuracy-slider-head">
          <span class="accuracy-slider-label">Calories in — food logging</span>
          <span class="accuracy-slider-value" id="acc-food-val">${foodPct}%</span>
        </div>
        <input type="range" min="60" max="100" step="5" value="${foodPct}" id="acc-food-slider" class="accuracy-slider" />
        <div class="accuracy-slider-anchors">
          <span>Eat out a lot</span>
          <span>Mostly home</span>
          <span>Weighed portions</span>
        </div>
      </div>
    </div>

    ${renderCalibrationMath(s, cal)}
  </div>`;
}

/* The "what the math sees" block at the bottom of the accuracy card.
 * When calibration is ready, shows predicted vs actual loss, real intake/TDEE,
 * and the current daily target. When not ready (under 7 days of data), shows a
 * brief building-data message. */
function renderCalibrationMath(s, cal) {
  if (!cal.ready) {
    const initialTarget = getDailyTarget(s);
    return `<div class="accuracy-math accuracy-math-building">
      <div class="accuracy-math-eyebrow">What the math sees</div>
      <div class="accuracy-math-row"><span class="accuracy-math-label">Daily target</span><span class="accuracy-math-value">${initialTarget.toLocaleString()}<span class="accuracy-math-unit">cal</span></span></div>
      <div class="accuracy-math-note">Once you've logged 7+ days of weight + meals, we'll show predicted vs actual and recalibrate this number weekly.</div>
    </div>`;
  }
  const predicted = Math.max(0, cal.predictedLoss);
  const actual = Math.max(0, cal.actualLoss);
  return `<div class="accuracy-math">
    <div class="accuracy-math-eyebrow">What the math sees</div>
    <div class="accuracy-math-grid">
      <div class="accuracy-math-row"><span class="accuracy-math-label">Predicted from logs</span><span class="accuracy-math-value">${predicted.toFixed(1)}<span class="accuracy-math-unit">lb</span></span></div>
      <div class="accuracy-math-row"><span class="accuracy-math-label">On the scale</span><span class="accuracy-math-value">${actual.toFixed(1)}<span class="accuracy-math-unit">lb</span></span></div>
      <div class="accuracy-math-row"><span class="accuracy-math-label">Real intake</span><span class="accuracy-math-value">${cal.realIntake.toLocaleString()}<span class="accuracy-math-unit">cal/day</span></span></div>
      <div class="accuracy-math-row"><span class="accuracy-math-label">Real TDEE</span><span class="accuracy-math-value">${cal.realTDEE.toLocaleString()}<span class="accuracy-math-unit">cal/day</span></span></div>
      <div class="accuracy-math-row accuracy-math-row-target"><span class="accuracy-math-label">Daily target</span><span class="accuracy-math-value">${cal.dailyTarget.toLocaleString()}<span class="accuracy-math-unit">cal/day</span></span></div>
    </div>
    <div class="accuracy-math-note">Calibrated weekly from your weight trend. Move the sliders above and the math doesn't change — your scale is the ground truth either way.</div>
  </div>`;
}

/* Wire up the two accuracy sliders. Live-updates the headline number
 * as the user drags. Persists on release (change event), but re-renders
 * the whole card on commit so the copy and observed-note refresh. */
function wireAccuracyCard() {
  const tSlider = document.getElementById('acc-tracker-slider');
  const fSlider = document.getElementById('acc-food-slider');
  const tVal = document.getElementById('acc-tracker-val');
  const fVal = document.getElementById('acc-food-val');
  const headline = document.getElementById('accuracy-headline');
  if (!tSlider || !fSlider) return;

  const recompute = () => {
    const t = parseInt(tSlider.value);
    const f = parseInt(fSlider.value);
    if (tVal) tVal.textContent = t + '%';
    if (fVal) fVal.textContent = f + '%';
    // Live headline only updates when in estimated mode; observed mode shows the truth-grounded value
    const cal = getCalibration(state);
    if (!(cal.ready && cal.trackingAccuracy != null) && headline) {
      const combined = Math.round((t * f) / 100);
      headline.innerHTML = `${combined}<span class="accuracy-pct">%</span>`;
    }
  };

  tSlider.addEventListener('input', recompute);
  fSlider.addEventListener('input', recompute);

  tSlider.addEventListener('change', () => {
    state.user.trackerAccuracy = parseInt(tSlider.value) / 100;
    saveState();
    navigate(currentView); // re-render to refresh copy + observed note
  });
  fSlider.addEventListener('change', () => {
    state.user.foodAccuracy = parseInt(fSlider.value) / 100;
    saveState();
    navigate(currentView);
  });
}

function renderPlateauBanner(s) {
  const p = getPlateauStatus(s);
  if (!p) return '';
  return `<div class="plateau-banner">
    <div class="plateau-eyebrow">PATTERN · LAST ${p.daysFlat} DAYS</div>
    <div class="plateau-body">Your weight trend has been essentially flat (<strong>${p.ratePerWk >= 0 ? '+' : '−'}${Math.abs(p.ratePerWk).toFixed(2)} lb/wk</strong>) for the last ${p.daysFlat} days. This is normal and doesn't mean anything is broken.<br><br><strong>If you want to start losing again, two paths:</strong> tighten your tracking, or lower your daily target by 100–150 cal.</div>
  </div>`;
}

function renderRecentFoodsStrip() {
  const recent = getRecentFoods(state, 8);
  if (recent.length === 0) return '';
  return `<div class="recent-foods-strip">
    <div class="recent-foods-label">RECENT</div>
    <div class="recent-foods-chips">
      ${recent.map((f, i) => `
        <button class="recent-chip" data-recent-idx="${i}" title="${escapeAttr(f.name)} · ${f.lastCal} cal · logged ${f.count}×">
          <span class="recent-chip-name">${escapeAttr(f.name)}</span>
          <span class="recent-chip-cal">${f.lastCal}</span>
        </button>
      `).join('')}
    </div>
  </div>`;
}

function logRecentFood(idx) {
  const recent = getRecentFoods(state, 8);
  const food = recent[idx];
  if (!food) return;
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const meal = {
    id: Date.now(),
    date: getSelectedDate(),
    time,
    mealType: guessMealType(now.getHours()),
    raw: food.name,
    items: [{ name: food.name, calories: food.lastCal, source: 'recent' }],
    totalCal: food.lastCal,
    source: 'recent',
  };
  state.meals.push(meal);
  recordAction({ type: 'create-meal', meal });
  saveState();
  toast(`Logged ${food.name} (${food.lastCal} cal)`, { undo: true });
  navigate('diary');
}

function wireRecentFoodsStrip() {
  document.querySelectorAll('[data-recent-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      logRecentFood(parseInt(btn.dataset.recentIdx));
    });
  });
}

/* "Same as yesterday" — shows if today is empty and yesterday has data.
 * Copies all of yesterday's meals (with new IDs but original times) and
 * exercises to today's date. Useful for routine days. */
function getDayBeforeISO(dateISO) {
  const d = parseISODate(dateISO);
  const y = new Date(d.getTime() - 86400000);
  return formatDateISO(y);
}

function getCopyYesterdaySummary() {
  // "Yesterday" relative to currently-selected date
  const yISO = getDayBeforeISO(getSelectedDate());
  const meals = state.meals.filter(m => m.date === yISO);
  const exercises = (state.exercises || []).filter(e => e.date === yISO);
  if (meals.length === 0 && exercises.length === 0) return null;
  const totalCal = meals.reduce((s, m) => s + m.totalCal, 0);
  const totalBurn = exercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
  return { meals, exercises, totalCal, totalBurn };
}

function renderCopyYesterdayCard() {
  // Only show when the SELECTED day has no meals yet
  const selDate = getSelectedDate();
  const dayMeals = state.meals.filter(m => m.date === selDate);
  if (dayMeals.length > 0) return '';
  const summary = getCopyYesterdaySummary();
  if (!summary) return '';
  const itemBits = [];
  if (summary.meals.length) itemBits.push(`${summary.meals.length} ${summary.meals.length === 1 ? 'meal' : 'meals'} (${summary.totalCal} cal)`);
  if (summary.exercises.length) itemBits.push(`${summary.exercises.length} ${summary.exercises.length === 1 ? 'workout' : 'workouts'}`);
  return `<button class="copy-yesterday-btn" id="copy-yesterday-btn">
    <span class="copy-yesterday-icon">↻</span>
    <span class="copy-yesterday-body">
      <span class="copy-yesterday-title">Same as yesterday</span>
      <span class="copy-yesterday-detail">${itemBits.join(' · ')}</span>
    </span>
  </button>`;
}

function copyYesterdayToToday() {
  const summary = getCopyYesterdaySummary();
  if (!summary) return;
  const targetDate = getSelectedDate();
  // Confirm to avoid surprise
  if (!confirm(`Copy ${summary.meals.length} meals and ${summary.exercises.length} workouts from the day before to ${targetDate === todayISO() ? 'today' : targetDate}?`)) return;
  let baseId = Date.now();
  const newMeals = summary.meals.map(m => ({
    ...m,
    id: ++baseId,
    date: targetDate,
    items: m.items.map(i => ({ ...i })),
    source: 'copied',
  }));
  const newExercises = summary.exercises.map(e => ({
    ...e,
    id: ++baseId,
    date: targetDate,
  }));
  state.meals.push(...newMeals);
  state.exercises = (state.exercises || []).concat(newExercises);
  saveState();
  toast(`Copied ${newMeals.length} meals and ${newExercises.length} workouts from the day before.`);
  navigate('diary');
}

function wireCopyYesterdayBtn() {
  const btn = document.getElementById('copy-yesterday-btn');
  if (btn) btn.addEventListener('click', copyYesterdayToToday);
}

/* ============================================================
   RECIPES — user-defined ingredient lists they can re-log with one tap.
   Examples: "Morning smoothie", "Greek yogurt bowl", "My usual lunch."
   Created via Coach chat or the recipes manager modal.
   ============================================================ */

function recipeTotalCal(r) {
  return (r.items || []).reduce((sum, x) => sum + (parseInt(x.calories) || 0), 0);
}

/* Sum macros across a recipe's ingredients. Returns {protein, carbs, fat, fiber}. */
function recipeMacros(r) {
  const out = { protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const i of (r.items || [])) {
    out.protein += parseFloat(i.protein_g) || 0;
    out.carbs   += parseFloat(i.carbs_g)   || 0;
    out.fat     += parseFloat(i.fat_g)     || 0;
    out.fiber   += parseFloat(i.fiber_g)   || 0;
  }
  return out;
}

/* Render the recipes row that lives inside the chat input card, just above
 * the "Quick:" recents. Chips log on tap; the gear icon opens the manager. */
function renderRecipesRow() {
  const recipes = (state.recipes || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  const chips = recipes.map(r => {
    const total = recipeTotalCal(r);
    const ingredients = (r.items || []).map(i => i.name).filter(Boolean).join(', ');
    return `<button class="recipe-chip home-chip" data-recipe-id="${r.id}" title="${escapeAttr(ingredients)}">
      <span class="recipe-chip-name">${escapeAttr(r.name)}</span>
      <span class="recipe-chip-cal">${total}</span>
    </button>`;
  }).join('');

  const manageBtn = `<button class="recipes-manage-btn home-chip" id="recipes-manage-btn" title="Manage recipes" aria-label="Manage recipes">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  </button>`;

  if (recipes.length === 0) {
    return `<div class="home-chips recipes-row">
      <span class="home-chips-label">Recipes:</span>
      <button class="recipes-empty-cta home-chip" id="recipes-manage-btn">+ Add a recipe</button>
    </div>`;
  }

  return `<div class="home-chips recipes-row">
    <span class="home-chips-label">Recipes:</span>
    ${chips}
    ${manageBtn}
  </div>`;
}

/* Apply a recipe by id: clones its ingredients into a fresh meal entry on
 * the selected date. Used by chip taps, by Coach "log my X" intents, and
 * shows up in the day's log immediately. Returns the created meal or null. */
function logRecipeById(recipeId, opts = {}) {
  const recipe = (state.recipes || []).find(r => r.id === recipeId);
  if (!recipe) return null;
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const items = (recipe.items || []).map(i => ({
    name: i.name || 'item',
    portion: i.portion || '',
    calories: parseInt(i.calories) || 0,
    protein_g: parseFloat(i.protein_g) || 0,
    carbs_g: parseFloat(i.carbs_g) || 0,
    fat_g: parseFloat(i.fat_g) || 0,
    fiber_g: parseFloat(i.fiber_g) || 0,
    source: 'recipe',
  }));
  const totalCal = items.reduce((s, x) => s + x.calories, 0);
  const meal = {
    id: Date.now(),
    date: getSelectedDate(),
    time,
    mealType: guessMealType(now.getHours()),
    raw: recipe.name,
    items,
    totalCal,
    source: 'recipe',
    recipeId: recipe.id,
  };
  state.meals.push(meal);
  recordAction({ type: 'create-meal', meal });
  saveState();
  if (!opts.silent) {
    toast(`Logged ${recipe.name} (${totalCal} cal)`, { undo: true });
    navigate(currentView);
  }
  return meal;
}

/* Wire chip clicks + the manage button. Called whenever the chat strip rerenders. */
function wireRecipesRow() {
  document.querySelectorAll('[data-recipe-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      logRecipeById(parseInt(btn.dataset.recipeId));
    });
  });
  const manageBtn = document.getElementById('recipes-manage-btn');
  if (manageBtn) manageBtn.addEventListener('click', openRecipesModal);
}

/* Recipes manager — list of all saved recipes with edit/delete + new-recipe.
 * Opens from the + button in the chat strip's recipes row. */
function openRecipesModal() {
  const modal = document.getElementById('modal');
  const recipes = (state.recipes || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  modal.className = 'modal modal-wide';
  modal.innerHTML = `<div class="modal-h">Recipes</div>
    <div class="modal-sub">Reusable ingredient lists you can log with one tap. Cal can also log them: "log my morning smoothie".</div>

    <div class="recipes-list">
      ${recipes.length === 0
        ? `<div class="recipes-empty">No recipes yet. Tap "New recipe" below, or in chat say "save this as my morning smoothie" right after logging something.</div>`
        : recipes.map(r => {
            const total = recipeTotalCal(r);
            const m = recipeMacros(r);
            const ingredients = (r.items || []).map(i => i.name).filter(Boolean).join(', ');
            return `<div class="recipe-row" data-recipe-row-id="${r.id}">
              <div class="recipe-row-main">
                <div class="recipe-row-head">
                  <div class="recipe-row-name">${escapeAttr(r.name)}</div>
                  <div class="recipe-row-cal">${total} <span class="cal-unit">cal</span></div>
                </div>
                <div class="recipe-row-ingredients">${escapeAttr(ingredients) || '<em>no ingredients</em>'}</div>
                <div class="recipe-row-macros">P ${Math.round(m.protein)}g · C ${Math.round(m.carbs)}g · F ${Math.round(m.fat)}g · Fb ${Math.round(m.fiber)}g</div>
              </div>
              <div class="recipe-row-actions">
                <button class="btn btn-secondary btn-sm" data-recipe-log="${r.id}" title="Log this recipe today">Log</button>
                <button class="btn btn-secondary btn-sm" data-recipe-edit="${r.id}" title="Edit recipe">Edit</button>
              </div>
            </div>`;
          }).join('')}
    </div>

    <div class="modal-actions">
      <button class="btn btn-secondary btn-block" id="modal-cancel">Close</button>
      <button class="btn btn-primary btn-block" id="recipes-new-btn">New recipe</button>
    </div>`;
  document.getElementById('modal-backdrop').classList.add('open');

  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('recipes-new-btn').addEventListener('click', () => {
    closeModal();
    setTimeout(() => openRecipeEditModal(null), 120);
  });
  document.querySelectorAll('[data-recipe-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.recipeEdit);
      closeModal();
      setTimeout(() => openRecipeEditModal(id), 120);
    });
  });
  document.querySelectorAll('[data-recipe-log]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.recipeLog);
      closeModal();
      logRecipeById(id);
    });
  });
}

/* Recipe edit modal — name + ingredient rows. Pass null to create a new
 * recipe; pass a recipe id to edit an existing one. Each ingredient row has
 * name, portion, calories, and macros. Items can be added or removed. */
function openRecipeEditModal(recipeId) {
  const modal = document.getElementById('modal');
  const isNew = recipeId == null;
  const draft = isNew
    ? { id: Date.now(), name: '', items: [], createdAt: todayISO(), updatedAt: todayISO() }
    : JSON.parse(JSON.stringify((state.recipes || []).find(r => r.id === recipeId) || { id: Date.now(), name: '', items: [] }));

  if (draft.items.length === 0 && isNew) {
    // Seed one empty row so users see the format
    draft.items.push({ name: '', portion: '', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 });
  }

  function rowHtml(idx, item) {
    return `<div class="recipe-edit-row" data-row-idx="${idx}">
      <div class="recipe-edit-row-head">
        <input class="recipe-edit-input recipe-edit-name" data-field="name" value="${escapeAttr(item.name || '')}" placeholder="Ingredient" />
        <button class="recipe-edit-remove" data-remove-idx="${idx}" aria-label="Remove">×</button>
      </div>
      <div class="recipe-edit-row-grid">
        <div class="recipe-edit-cell">
          <label>Portion</label>
          <input class="recipe-edit-input" data-field="portion" value="${escapeAttr(item.portion || '')}" placeholder="200g" />
        </div>
        <div class="recipe-edit-cell">
          <label>Cal</label>
          <input class="recipe-edit-input" type="number" data-field="calories" value="${item.calories || 0}" min="0" />
        </div>
        <div class="recipe-edit-cell">
          <label>P</label>
          <input class="recipe-edit-input" type="number" data-field="protein_g" value="${item.protein_g || 0}" min="0" />
        </div>
        <div class="recipe-edit-cell">
          <label>C</label>
          <input class="recipe-edit-input" type="number" data-field="carbs_g" value="${item.carbs_g || 0}" min="0" />
        </div>
        <div class="recipe-edit-cell">
          <label>F</label>
          <input class="recipe-edit-input" type="number" data-field="fat_g" value="${item.fat_g || 0}" min="0" />
        </div>
        <div class="recipe-edit-cell">
          <label>Fb</label>
          <input class="recipe-edit-input" type="number" data-field="fiber_g" value="${item.fiber_g || 0}" min="0" />
        </div>
      </div>
    </div>`;
  }

  function renderModal() {
    const total = draft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
    modal.className = 'modal modal-wide';
    modal.innerHTML = `<div class="modal-h">${isNew ? 'New recipe' : 'Edit recipe'}</div>
      <div class="modal-sub">Add each ingredient with its portion and macros. Tip: ask Cal in chat to add a recipe and it will fill in the macros for you.</div>

      <div class="recipe-edit-section">
        <label class="recipe-edit-label">Recipe name</label>
        <input class="recipe-edit-input recipe-edit-fullname" id="recipe-edit-name" value="${escapeAttr(draft.name)}" placeholder="e.g. Morning smoothie" />
      </div>

      <div class="recipe-edit-section">
        <div class="recipe-edit-section-head">
          <label class="recipe-edit-label">Ingredients</label>
          <div class="recipe-edit-total">${total} cal total</div>
        </div>
        <div id="recipe-edit-items">
          ${draft.items.map((item, idx) => rowHtml(idx, item)).join('')}
        </div>
        <button class="btn btn-secondary btn-sm recipe-edit-add" id="recipe-add-row">+ Add ingredient</button>
      </div>

      <div class="modal-actions">
        ${isNew ? '' : '<button class="btn btn-secondary btn-block recipe-edit-delete" id="recipe-delete-btn">Delete recipe</button>'}
        <button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary btn-block" id="recipe-save-btn">${isNew ? 'Create recipe' : 'Save changes'}</button>
      </div>`;
    wireModal();
  }

  function syncDraftFromInputs() {
    draft.name = (document.getElementById('recipe-edit-name').value || '').trim();
    document.querySelectorAll('.recipe-edit-row').forEach(row => {
      const idx = parseInt(row.dataset.rowIdx);
      if (!draft.items[idx]) return;
      row.querySelectorAll('[data-field]').forEach(input => {
        const f = input.dataset.field;
        if (f === 'name' || f === 'portion') {
          draft.items[idx][f] = (input.value || '').trim();
        } else {
          draft.items[idx][f] = parseFloat(input.value) || 0;
        }
      });
    });
  }

  function wireModal() {
    document.getElementById('modal-cancel').addEventListener('click', () => {
      closeModal();
      setTimeout(openRecipesModal, 120);
    });
    document.getElementById('recipe-add-row').addEventListener('click', () => {
      syncDraftFromInputs();
      draft.items.push({ name: '', portion: '', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 });
      renderModal();
    });
    document.querySelectorAll('[data-remove-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncDraftFromInputs();
        const idx = parseInt(btn.dataset.removeIdx);
        draft.items.splice(idx, 1);
        renderModal();
      });
    });
    // Live total update on cal change
    document.querySelectorAll('[data-field="calories"]').forEach(input => {
      input.addEventListener('input', () => {
        syncDraftFromInputs();
        const total = draft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
        const totalEl = document.querySelector('.recipe-edit-total');
        if (totalEl) totalEl.textContent = `${total} cal total`;
      });
    });
    const delBtn = document.getElementById('recipe-delete-btn');
    if (delBtn) delBtn.addEventListener('click', () => {
      if (!confirm(`Delete recipe "${draft.name}"? This can't be undone.`)) return;
      state.recipes = (state.recipes || []).filter(r => r.id !== draft.id);
      saveState();
      closeModal();
      toast(`Deleted "${draft.name}"`);
      setTimeout(openRecipesModal, 120);
      navigate(currentView);
    });
    document.getElementById('recipe-save-btn').addEventListener('click', () => {
      syncDraftFromInputs();
      if (!draft.name) { toast('Give the recipe a name first'); return; }
      // Strip empty ingredient rows
      draft.items = draft.items.filter(i => i.name);
      if (draft.items.length === 0) { toast('Add at least one ingredient'); return; }
      draft.updatedAt = todayISO();
      if (!Array.isArray(state.recipes)) state.recipes = [];
      const existingIdx = state.recipes.findIndex(r => r.id === draft.id);
      if (existingIdx >= 0) {
        state.recipes[existingIdx] = draft;
      } else {
        draft.createdAt = draft.createdAt || todayISO();
        state.recipes.push(draft);
      }
      saveState();
      closeModal();
      toast(isNew ? `Recipe "${draft.name}" created` : `Recipe "${draft.name}" updated`);
      setTimeout(openRecipesModal, 120);
      navigate(currentView);
    });
  }

  document.getElementById('modal-backdrop').classList.add('open');
  renderModal();
}

/* ===== Legacy aliases — the old log view still references these in describe-mode. ===== */
function renderSavedMealsStrip() { return ''; /* deprecated — recipes row in chat takes its place */ }
function wireSavedMealsStrip()   { /* no-op for legacy callers */ }
function saveDraftAsSavedMeal() {
  // Old local-parser path — pre-Coach. Convert the local draft into a recipe.
  if (!todayParseDraft || !todayParseDraft.items.length) return;
  const defaultName = todayParseDraft.text ? todayParseDraft.text.slice(0, 40) : 'My recipe';
  const name = window.prompt('Name this recipe (e.g. "My breakfast"):', defaultName);
  if (!name || !name.trim()) return;
  const trimmed = name.trim().slice(0, 60);
  if (!Array.isArray(state.recipes)) state.recipes = [];
  state.recipes.push({
    id: Date.now(),
    name: trimmed,
    items: todayParseDraft.items.map(i => ({
      name: i.name, portion: '',
      calories: parseInt(i.calories) || 0,
      protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0,
    })),
    createdAt: todayISO(),
    updatedAt: todayISO(),
  });
  saveState();
  toast(`Saved "${trimmed}" as a recipe.`);
}

/* Log a single food (from the search dropdown). Same shape as logRecentFood,
 * but takes name and cal directly. */
function logFoodFromSearch(name, cal) {
  if (!name || !cal) return;
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const meal = {
    id: Date.now(),
    date: getSelectedDate(),
    time,
    mealType: guessMealType(now.getHours()),
    raw: name,
    items: [{ name, calories: cal, source: 'search' }],
    totalCal: cal,
    source: 'search',
  };
  state.meals.push(meal);
  recordAction({ type: 'create-meal', meal });
  saveState();
  toast(`Logged ${name} (${cal} cal)`, { undo: true });
  navigate('diary');
}

function renderTodayLogger() {
  const showParseResult = todayLogTab === 'describe' && todayParseDraft;
  return `<div class="today-logger">
    <div class="today-logger-header">
      <div class="section-h" style="margin: 0;">Log a meal</div>
      <div class="log-mode-tabs">
        <button class="log-mode-tab ${todayLogTab === 'describe' ? 'active' : ''}" data-today-tab="describe">Describe</button>
        <button class="log-mode-tab ${todayLogTab === 'numeric' ? 'active' : ''}" data-today-tab="numeric">Quick number</button>
      </div>
    </div>
    ${renderCopyYesterdayCard()}
    ${renderRecentFoodsStrip()}
    ${renderSavedMealsStrip()}
    ${todayLogTab === 'describe' ? `
      <div class="today-log-input-wrap">
        <div style="display: flex; gap: 6px; align-items: center;">
          <input class="input" id="today-log-input" placeholder="e.g. turkey sandwich and an apple" autocomplete="off" ${showParseResult ? 'disabled' : ''} />
          <button class="ai-input-btn" disabled title="Voice logging — coming soon with Claude AI" aria-label="Voice (coming soon)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <button class="ai-input-btn" disabled title="Photo logging — coming soon with Claude AI" aria-label="Photo (coming soon)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <button class="btn btn-primary btn-sm" id="today-parse-btn" ${showParseResult ? 'disabled' : ''}>Parse</button>
        </div>
        <div class="food-search-dropdown" id="today-search-dropdown" hidden></div>
      </div>
      ${showParseResult ? renderTodayParseDraft() : ''}
    ` : `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <input class="input" type="number" id="today-numeric-cal" placeholder="cal" min="0" max="10000" />
        <select class="form-select" id="today-numeric-mealtype" style="padding: 11px 14px;">
          <option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="snack">Snack</option><option value="dinner" selected>Dinner</option><option value="imported">Other</option>
        </select>
      </div>
      <input class="input" type="text" id="today-numeric-label" placeholder="Label (optional)" style="margin-bottom: 10px;" />
      <button class="btn btn-primary btn-block btn-sm" id="today-numeric-save">Log it</button>
    `}
  </div>`;
}

function renderTodayParseDraft() {
  const total = todayParseDraft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
  return `<div class="parsed-result" style="margin-top: 14px;">
    <div class="parsed-header">
      <span class="ai-pill">AI</span><span class="parsed-label">Parsed:</span>
      <select class="form-select" id="today-parse-mealtype" style="margin-left: auto; padding: 6px 12px; font-size: 12px; max-width: 130px;">
        <option value="breakfast" ${todayParseDraft.mealType === 'breakfast' ? 'selected' : ''}>Breakfast</option>
        <option value="lunch" ${todayParseDraft.mealType === 'lunch' ? 'selected' : ''}>Lunch</option>
        <option value="snack" ${todayParseDraft.mealType === 'snack' ? 'selected' : ''}>Snack</option>
        <option value="dinner" ${todayParseDraft.mealType === 'dinner' ? 'selected' : ''}>Dinner</option>
      </select>
    </div>
    ${todayParseDraft.items.map((it, idx) => `
      <div class="parsed-item">
        <div><div class="parsed-item-name">${it.name}</div><div class="parsed-item-detail">${it.source === 'matched' ? (it.qty > 1 ? 'qty ' + it.qty : 'matched') : 'estimate — please verify'}</div></div>
        <div class="parsed-item-cal"><input type="number" data-today-idx="${idx}" value="${it.calories}" min="0" max="5000" /></div>
        <div class="parsed-item-remove" data-today-remove="${idx}">×</div>
      </div>
    `).join('')}
    <div class="parsed-total"><div class="parsed-total-label">Total</div><div class="parsed-total-cal" id="today-parse-total">${total} cal</div></div>
    <div class="parsed-actions">
      <button class="btn btn-primary btn-block" id="today-parse-save">Save</button>
      <button class="btn btn-secondary" id="today-parse-saveas" title="Save as a reusable meal">★ Save as meal</button>
      <button class="btn btn-secondary" id="today-parse-cancel">Cancel</button>
    </div>
  </div>`;
}

function wireTodayLogger() {
  wireRecentFoodsStrip();
  wireSavedMealsStrip();
  wireCopyYesterdayBtn();
  document.querySelectorAll('[data-today-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => { todayLogTab = e.currentTarget.dataset.todayTab; todayParseDraft = null; navigate(currentView); });
  });
  if (todayLogTab === 'describe') {
    if (!todayParseDraft) {
      const inp = document.getElementById('today-log-input');
      const btn = document.getElementById('today-parse-btn');
      const dropdown = document.getElementById('today-search-dropdown');
      let activeResults = [];
      let activeIndex = -1;

      const renderDropdown = () => {
        if (!activeResults.length) {
          dropdown.hidden = true;
          dropdown.innerHTML = '';
          return;
        }
        dropdown.hidden = false;
        dropdown.innerHTML = activeResults.map((r, i) => `
          <button class="food-search-item ${i === activeIndex ? 'active' : ''}" data-search-idx="${i}">
            <span class="food-search-name">${escapeAttr(r.name)}</span>
            <span class="food-search-cal">${r.cal} cal</span>
          </button>
        `).join('');
        dropdown.querySelectorAll('[data-search-idx]').forEach(el => {
          el.addEventListener('mousedown', (e) => { e.preventDefault(); }); // keep input focused
          el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.searchIdx);
            const food = activeResults[idx];
            if (!food) return;
            logFoodFromSearch(food.name, food.cal);
          });
        });
      };

      const handleSearch = () => {
        const q = inp.value.trim();
        activeResults = searchFoodDb(q, 6);
        activeIndex = -1;
        renderDropdown();
      };

      const handleParse = () => {
        const text = inp.value.trim(); if (!text) return;
        const items = parseMealText(text); if (!items.length) return;
        const now = new Date();
        todayParseDraft = { text, items, mealType: guessMealType(now.getHours()) };
        navigate(currentView);
      };

      btn.addEventListener('click', handleParse);
      inp.addEventListener('input', handleSearch);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (!activeResults.length) return;
          activeIndex = (activeIndex + 1) % activeResults.length;
          renderDropdown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (!activeResults.length) return;
          activeIndex = (activeIndex - 1 + activeResults.length) % activeResults.length;
          renderDropdown();
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && activeResults[activeIndex]) {
            const food = activeResults[activeIndex];
            logFoodFromSearch(food.name, food.cal);
          } else {
            handleParse();
          }
        } else if (e.key === 'Escape') {
          activeResults = [];
          activeIndex = -1;
          renderDropdown();
        }
      });
      // Hide dropdown on focus loss (with a tiny delay so click handlers can fire first)
      inp.addEventListener('blur', () => {
        setTimeout(() => { activeResults = []; activeIndex = -1; renderDropdown(); }, 150);
      });
    } else {
      document.querySelectorAll('input[data-today-idx]').forEach(input => {
        input.addEventListener('input', (e) => {
          const i = parseInt(e.target.dataset.todayIdx);
          todayParseDraft.items[i].calories = parseInt(e.target.value) || 0;
          const newTotal = todayParseDraft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
          document.getElementById('today-parse-total').textContent = newTotal + ' cal';
        });
      });
      document.querySelectorAll('[data-today-remove]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const i = parseInt(e.currentTarget.dataset.todayRemove);
          todayParseDraft.items.splice(i, 1);
          if (todayParseDraft.items.length === 0) todayParseDraft = null;
          navigate(currentView);
        });
      });
      document.getElementById('today-parse-mealtype').addEventListener('change', (e) => { todayParseDraft.mealType = e.target.value; });
      document.getElementById('today-parse-save').addEventListener('click', saveTodayParse);
      const saveAsBtn = document.getElementById('today-parse-saveas');
      if (saveAsBtn) saveAsBtn.addEventListener('click', saveDraftAsSavedMeal);
      document.getElementById('today-parse-cancel').addEventListener('click', () => { todayParseDraft = null; navigate(currentView); });
    }
  } else {
    const handleSave = () => {
      const cal = parseInt(document.getElementById('today-numeric-cal').value);
      if (isNaN(cal) || cal <= 0 || cal > 10000) return toast('Enter calories between 1 and 10,000');
      const mealType = document.getElementById('today-numeric-mealtype').value;
      const label = document.getElementById('today-numeric-label').value.trim() || `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} (manual)`;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const meal = { id: Date.now(), date: getSelectedDate(), time, mealType, raw: label, items: [{ name: label, calories: cal, source: 'manual' }], totalCal: cal, source: 'manual' };
      state.meals.push(meal);
      recordAction({ type: 'create-meal', meal });
      saveState();
      toast(`Logged ${cal} cal`, { undo: true });
      navigate('diary');
    };
    document.getElementById('today-numeric-save').addEventListener('click', handleSave);
    document.getElementById('today-numeric-cal').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSave(); });
  }
}

function saveTodayParse() {
  if (!todayParseDraft || !todayParseDraft.items.length) return;
  const totalCal = todayParseDraft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const meal = { id: Date.now(), date: getSelectedDate(), time, mealType: todayParseDraft.mealType, raw: todayParseDraft.text, items: todayParseDraft.items, totalCal, source: 'ai' };
  state.meals.push(meal);
  recordAction({ type: 'create-meal', meal });
  saveState();
  todayParseDraft = null;
  toast(`Logged ${totalCal} cal to ${meal.mealType}`, { undo: true });
  navigate('diary');
}

/* ===================================================
   VIEW: PROGRESS — simplified combined trend + calibration
   Five sections: weight headline, chart, goal progress,
   calibration insight, weight log.
   Deliberately leaves out: bar charts, weekday patterns,
   compare periods, adherence cards, insight archive.
   The brand premise is *honest calibration*, not stat density.
   =================================================== */
let progressRange = 90;

/* Legacy alias — older code calls VIEW_RENDERERS.results; keep for compat. */
VIEW_RENDERERS.results = function () { renderApp(); };

/* Simplified trend chart — daily dots, 7-day average, goal line. No
 * "predicted from logging" overlay (was visually busy, low signal). */
function renderProgressChart(s, cal, range) {
  const canvas = document.getElementById('progress-chart');
  if (!canvas) return;
  if (trendChart) trendChart.destroy();
  const allWeights = s.weights;
  const visibleWeights = range > 0 ? allWeights.slice(-range) : allWeights;
  if (visibleWeights.length === 0) return;
  const labels = visibleWeights.map(w => formatShortDate(w.date));
  const rawData = visibleWeights.map(w => w.weight);
  const smoothedFull = smoothSeries(allWeights.map(w => w.weight), 7);
  const startIdx = allWeights.length - visibleWeights.length;
  const smoothedData = smoothedFull.slice(startIdx);
  const goalW = s.user.goalWeight;
  const goalData = visibleWeights.map(() => goalW);
  const yValues = [...rawData, ...smoothedData.filter(v => v != null)];
  const yMin = Math.min(...yValues, goalW) - 2;
  const yMax = Math.max(...yValues, goalW) + 2;
  trendChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Daily', data: rawData, borderColor: 'rgba(118, 155, 108, 0.30)', pointBackgroundColor: '#769B6C', pointRadius: 2.5, borderWidth: 1.2, fill: false, order: 3 },
      { label: '7-day avg', data: smoothedData, borderColor: '#446957', backgroundColor: 'rgba(68, 105, 87, 0.05)', borderWidth: 3, tension: 0.3, pointRadius: 0, fill: true, order: 1 },
      { label: 'Goal', data: goalData, borderColor: 'rgba(138, 130, 120, 0.6)', borderWidth: 1.5, borderDash: [2, 4], pointRadius: 0, fill: false, order: 4 },
    ]},
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2C2826', padding: 12, cornerRadius: 8, callbacks: { title: (items) => { if (!items.length) return ''; const w = visibleWeights[items[0].dataIndex]; return new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }, label: (ctx) => ctx.parsed.y == null ? null : `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} lb` } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8A8278', font: { size: 10 }, maxTicksLimit: 10 }, border: { display: false } }, y: { min: yMin, max: yMax, grid: { color: '#F4EEE3' }, ticks: { color: '#8A8278', font: { size: 10, family: 'Iowan Old Style, Georgia, serif' } }, border: { display: false }, title: { display: true, text: 'lb', color: '#8A8278', font: { size: 11 } } } }
    },
  });
}

/* ===================================================
   VIEW: TREND  (legacy, not navigated to — kept until cleanup)
   =================================================== */
let trendChart = null, caloriesBarChart = null, exerciseBarChart = null;
let trendRange = 90, weightLogShowAll = false;

function renderCalibrationCopy(cal, currentW, actualLoss) {
  const predictedLoss = Math.max(0, cal.predictedLoss);
  const ex = cal.exerciseTracked;
  const sources = ex ? "under-counted intake or over-counted exercise burn" : "under-counted intake — restaurant portions, oils, small bites";
  if (cal.calibrationFactor > 1.05) {
    return `Your logged ${ex ? 'net intake' : 'intake'} says you should be down <strong>${predictedLoss.toFixed(1)} lbs</strong>. You're at <strong>${actualLoss.toFixed(1)} lbs</strong>. That's a <strong>${cal.underLogPct}% gap</strong>. The gap is some mix of: ${sources}.<br><br><strong>Two ways to close it:</strong><br>• <strong>Tighten your tracking</strong> this week.<br>• <strong>Adjust your target</strong> — we've moved your daily intake target to <strong>${cal.dailyTarget.toLocaleString()} cal</strong>.`;
  } else if (cal.calibrationFactor < 0.95) {
    return `Your logged predicted <strong>${predictedLoss.toFixed(1)} lbs</strong> but you're at <strong>${actualLoss.toFixed(1)} lbs</strong>. You're losing faster than the math says. We've raised your target to <strong>${cal.dailyTarget.toLocaleString()} cal/day</strong>.`;
  }
  return `Your logged predicted <strong>${predictedLoss.toFixed(1)} lbs</strong>. You're at <strong>${actualLoss.toFixed(1)} lbs</strong>. The math is dialed in. Daily target: <strong>${cal.dailyTarget.toLocaleString()} cal/day</strong>.`;
}

function renderTrendChart(s, cal, range) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  if (trendChart) trendChart.destroy();
  const allWeights = s.weights;
  const visibleWeights = range > 0 ? allWeights.slice(-range) : allWeights;
  if (visibleWeights.length === 0) return;
  const labels = visibleWeights.map(w => formatShortDate(w.date));
  const rawData = visibleWeights.map(w => w.weight);
  const smoothedFull = smoothSeries(allWeights.map(w => w.weight), 7);
  const startIdx = allWeights.length - visibleWeights.length;
  const smoothedData = smoothedFull.slice(startIdx);
  const startW = s.user.startWeight;
  const bmr = mifflinStJeor(s.user, startW);
  const exerciseTracked = (s.exercises || []).some(e => e.date >= allWeights[0].date && e.date <= allWeights[allWeights.length - 1].date);
  const restingMult = exerciseTracked ? 1.2 : getActivityMultiplier(s.user.activityLevel);
  const baselineRestingTDEE = bmr * restingMult;
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  const fullStart = parseISODate(allWeights[0].date);
  const fullEnd = parseISODate(allWeights[allWeights.length - 1].date);
  const totalDays = Math.round((fullEnd - fullStart) / 86400000) + 1;
  const predictedByDate = {};
  let cumWeight = startW;
  predictedByDate[allWeights[0].date] = Math.round(startW * 10) / 10;
  for (let i = 1; i < totalDays; i++) {
    const dateISO = formatDateISO(new Date(fullStart.getTime() + i * 86400000));
    const dailyIntake = getDailyCalories(s, dateISO);
    const dailyBurn = exerciseTracked ? getDailyExerciseBurn(s, dateISO) * trackerAcc : 0;
    if (dailyIntake >= 100) cumWeight -= ((baselineRestingTDEE + dailyBurn) - dailyIntake) / 3500;
    predictedByDate[dateISO] = Math.round(cumWeight * 10) / 10;
  }
  const predictedData = visibleWeights.map(w => predictedByDate[w.date] != null ? predictedByDate[w.date] : null);
  const goalW = s.user.goalWeight;
  const goalData = visibleWeights.map(() => goalW);
  const yValues = [...rawData, ...smoothedData.filter(v => v != null), ...predictedData.filter(v => v != null)];
  const yMin = Math.min(...yValues, goalW) - 2;
  const yMax = Math.max(...yValues, goalW) + 2;
  trendChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Daily', data: rawData, borderColor: 'rgba(118, 155, 108, 0.30)', pointBackgroundColor: '#769B6C', pointRadius: 2.5, borderWidth: 1.2, fill: false, order: 3 },
      { label: '7-day avg', data: smoothedData, borderColor: '#446957', backgroundColor: 'rgba(68, 105, 87, 0.05)', borderWidth: 3, tension: 0.3, pointRadius: 0, fill: true, order: 1 },
      { label: 'Predicted from logging', data: predictedData, borderColor: '#B8855E', borderWidth: 2, borderDash: [6, 4], pointRadius: 0, fill: false, order: 2 },
      { label: 'Goal', data: goalData, borderColor: 'rgba(138, 130, 120, 0.6)', borderWidth: 1.5, borderDash: [2, 4], pointRadius: 0, fill: false, order: 4 },
    ]},
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2C2826', padding: 12, cornerRadius: 8, callbacks: { title: (items) => { if (!items.length) return ''; const w = visibleWeights[items[0].dataIndex]; return new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }, label: (ctx) => ctx.parsed.y == null ? null : `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} lb` } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8A8278', font: { size: 10 }, maxTicksLimit: 10 }, border: { display: false } }, y: { min: yMin, max: yMax, grid: { color: '#F4EEE3' }, ticks: { color: '#8A8278', font: { size: 10, family: 'Iowan Old Style, Georgia, serif' } }, border: { display: false }, title: { display: true, text: 'lb', color: '#8A8278', font: { size: 11 } } } }
    },
  });
}

function renderCalorieBarCard(s) {
  return `<div class="bar-chart-card">
    <div class="bar-chart-header">
      <div><div class="bar-chart-title">Calories logged</div><div style="font-size:11.5px; color:var(--muted); margin-top:4px;">Target zone shaded · bars colored by status</div></div>
      <div class="bar-chart-legend"><span><span class="swatch" style="background:var(--status-good)"></span>Under</span><span><span class="swatch" style="background:var(--status-warn)"></span>Close</span><span><span class="swatch" style="background:var(--status-bad)"></span>Over</span><span><span class="swatch" style="background:var(--status-spike)"></span>Spike</span></div>
    </div>
    <div class="bar-chart-canvas-wrap"><canvas id="calories-bar-chart"></canvas></div>
  </div>`;
}

function renderCalorieBarChart(s, adherence, range) {
  const canvas = document.getElementById('calories-bar-chart');
  if (!canvas) return;
  if (caloriesBarChart) caloriesBarChart.destroy();
  const target = adherence ? adherence.target : getDailyTarget(s);
  const spikeThreshold = target * 1.8;
  const endDate = s.weights.length ? parseISODate(s.weights[s.weights.length - 1].date) : parseISODate(todayISO());
  let nDays = range === 7 ? 7 : range === 30 ? 30 : range === 90 ? 90 : (s.weights.length ? Math.max(1, daysBetween(s.weights[0].date, s.weights[s.weights.length - 1].date) + 1) : 30);
  const labels = [], data = [], colors = [];
  for (let i = nDays - 1; i >= 0; i--) {
    const d = formatDateISO(new Date(endDate.getTime() - i * 86400000));
    const cal = getDailyCalories(s, d);
    labels.push(formatShortDate(d));
    data.push(cal > 0 ? cal : null);
    if (cal === 0) colors.push('#ECE5D8');
    else if (cal >= spikeThreshold) colors.push('#8B3F37');
    else if (cal > target + 200) colors.push('#B65D4F');
    else if (cal > target) colors.push('#C9885A');
    else colors.push('#769B6C');
  }
  const targetCeiling = labels.map(() => target);
  const targetFloor = labels.map(() => target * 0.85);
  caloriesBarChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets: [
      { type: 'line', label: 'Target ceiling', data: targetCeiling, borderColor: 'rgba(92, 122, 107, 0.5)', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, fill: false, order: 0 },
      { type: 'line', label: 'Target floor', data: targetFloor, borderColor: 'rgba(92, 122, 107, 0.4)', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, fill: '-1', backgroundColor: 'rgba(92, 122, 107, 0.10)', order: 0 },
      { label: 'Calories', data, backgroundColor: colors, borderRadius: 4, order: 1, barPercentage: 0.8, categoryPercentage: 0.95 },
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.datasetIndex !== 2 ? null : (ctx.parsed.y == null ? 'No data' : `${ctx.parsed.y.toLocaleString()} cal`) } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8A8278', font: { size: 10 }, maxTicksLimit: 12 }, border: { display: false } }, y: { beginAtZero: true, grid: { color: '#F4EEE3' }, ticks: { color: '#8A8278', font: { size: 10 } }, border: { display: false }, title: { display: true, text: 'kcal', color: '#8A8278' } } }
    },
  });
}

function renderExerciseBarCard(s) {
  const anyExercise = (s.exercises || []).length > 0;
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  return `<div class="bar-chart-card">
    <div class="bar-chart-header">
      <div><div class="bar-chart-title">Exercise burn logged</div><div style="font-size:11.5px; color:var(--muted); margin-top:4px;">${anyExercise ? 'Daily totals · raw values shown' : 'Log activity on Today to start building this view'}</div></div>
      ${anyExercise ? `<div class="bar-chart-legend"><span><span class="swatch" style="background:var(--accent)"></span>Daily burn (raw)</span><span><span class="swatch" style="background:var(--accent-soft); border: 1px solid var(--accent);"></span>After ${Math.round(trackerAcc * 100)}%</span></div>` : ''}
    </div>
    <div class="bar-chart-canvas-wrap">${anyExercise ? '<canvas id="exercise-bar-chart"></canvas>' : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:14px;">No exercise logged yet.</div>'}</div>
  </div>`;
}

function renderExerciseBarChart(s, range) {
  const canvas = document.getElementById('exercise-bar-chart');
  if (!canvas) return;
  if (exerciseBarChart) exerciseBarChart.destroy();
  if (!(s.exercises || []).length) return;
  const trackerAcc = s.user.trackerAccuracy != null ? s.user.trackerAccuracy : 1.0;
  const endDate = s.weights.length ? parseISODate(s.weights[s.weights.length - 1].date) : parseISODate(todayISO());
  let nDays = range === 7 ? 7 : range === 30 ? 30 : range === 90 ? 90 : (s.weights.length ? Math.max(1, daysBetween(s.weights[0].date, s.weights[s.weights.length - 1].date) + 1) : 30);
  const labels = [], dataRaw = [], dataAdjusted = [];
  for (let i = nDays - 1; i >= 0; i--) {
    const d = formatDateISO(new Date(endDate.getTime() - i * 86400000));
    const burn = getDailyExerciseBurn(s, d);
    labels.push(formatShortDate(d));
    dataRaw.push(burn > 0 ? burn : null);
    dataAdjusted.push(burn > 0 ? Math.round(burn * trackerAcc) : null);
  }
  exerciseBarChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets: [
      { label: 'Burn (raw)', data: dataRaw, backgroundColor: 'rgba(184, 133, 94, 0.35)', borderColor: 'rgba(184, 133, 94, 0.7)', borderWidth: 1, borderRadius: 4, barPercentage: 0.8, categoryPercentage: 0.95, order: 2 },
      { label: `After ${Math.round(trackerAcc * 100)}%`, data: dataAdjusted, backgroundColor: '#B8855E', borderRadius: 4, barPercentage: 0.4, categoryPercentage: 0.95, order: 1 },
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.parsed.y == null ? null : `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} cal` } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#8A8278', font: { size: 10 }, maxTicksLimit: 12 }, border: { display: false } }, y: { beginAtZero: true, grid: { color: '#F4EEE3' }, ticks: { color: '#8A8278', font: { size: 10 } }, border: { display: false }, title: { display: true, text: 'kcal', color: '#8A8278' } } }
    },
  });
}

function renderWeightLogCard(s) {
  if (!s.weights.length) return '';
  const sorted = [...s.weights].sort((a, b) => b.date.localeCompare(a.date));
  const visible = weightLogShowAll ? sorted : sorted.slice(0, 14);
  const showToggle = sorted.length > 14;
  const rows = visible.map((w) => {
    const next = sorted[sorted.indexOf(w) + 1];
    const delta = next ? w.weight - next.weight : null;
    return { date: w.date, weight: w.weight, delta, intake: getDailyCalories(s, w.date), burn: getDailyExerciseBurn(s, w.date) };
  });
  return `<div class="weight-log-card">
    <div class="weight-log-header"><div class="weight-log-title">Day log · ${visible.length} of ${sorted.length}</div>${showToggle ? `<button class="weight-log-toggle" id="weight-log-toggle">${weightLogShowAll ? 'Show recent only' : 'Show all'}</button>` : ''}</div>
    <table class="weight-log-table">
      <thead><tr><th>Date</th><th class="right">Weight (lb)</th><th class="right">Δ</th><th class="right">Intake</th><th class="right">Burn</th></tr></thead>
      <tbody>${rows.map(r => {
        const dCls = r.delta == null ? '' : (r.delta < 0 ? 'down' : (r.delta > 0 ? 'up' : ''));
        const dTxt = r.delta == null ? '—' : (r.delta >= 0 ? '+' : '−') + Math.abs(r.delta).toFixed(1);
        const hasNote = !!(s.dayNotes && s.dayNotes[r.date]);
        return `<tr class="clickable" data-weight-date="${r.date}"><td>${formatShortDate(r.date)}${hasNote ? ' <span style="color: var(--accent); font-size: 11px; margin-left: 4px;">●</span>' : ''}</td><td class="right">${r.weight.toFixed(1)}</td><td class="right"><span class="delta ${dCls}">${dTxt}</span></td><td class="right" style="${r.intake > 0 ? '' : 'color: var(--muted-soft);'}">${r.intake > 0 ? r.intake.toLocaleString() : '—'}</td><td class="right" style="${r.burn > 0 ? '' : 'color: var(--muted-soft);'}">${r.burn > 0 ? r.burn.toLocaleString() : '—'}</td></tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}

function renderAdherenceCards(a) {
  if (!a || a.totalLogged < 5) {
    return `<div class="bar-chart-card" style="text-align: center;"><div class="bar-chart-title">Adherence snapshot</div><div style="font-size: 13px; color: var(--muted); margin-top: 12px;">${(!a || a.totalLogged === 0) ? 'No intake logged in the last 14 days yet.' : `${a.totalLogged} of 14 days logged.`} We'll show adherence stats once you've logged at least 5 days.</div></div>`;
  }
  const adhClass = a.onTargetPct >= 70 ? 'good' : (a.onTargetPct >= 40 ? 'warn' : 'bad');
  const spikeClass = a.spikeDays === 0 ? 'good' : (a.spikeDays <= 2 ? 'warn' : 'bad');
  const streakClass = a.daysSinceSpike >= 7 ? 'good' : (a.daysSinceSpike >= 3 ? 'warn' : 'bad');
  const lossClass = a.last7Loss >= 0.5 ? 'good' : (a.last7Loss >= 0 ? 'warn' : 'bad');
  const consistency = getConsistencyMetric(state);
  const consClass = consistency && consistency.pct >= 80 ? 'good' : (consistency && consistency.pct >= 50 ? 'warn' : 'bad');
  return `<div class="stat-row">
    <div class="stat-card ${adhClass}"><div class="stat-label">Days Under Target (14d)</div><div class="stat-value">${a.onTargetPct}<span class="unit">%</span></div><div class="stat-detail">${a.onTargetDays} of ${a.totalLogged} logged days</div></div>
    <div class="stat-card ${spikeClass}"><div class="stat-label">Spike Days (30d)</div><div class="stat-value">${a.spikeDays}</div><div class="stat-detail">${a.spikeThreshold.toLocaleString()}+ cal — these are the leak</div></div>
    <div class="stat-card ${streakClass}"><div class="stat-label">Days Since Last Spike</div><div class="stat-value">${a.daysSinceSpike}</div><div class="stat-detail">in-control days</div></div>
    <div class="stat-card ${lossClass}"><div class="stat-label">Last 7d Weight Δ</div><div class="stat-value">${a.last7Loss >= 0 ? '−' : '+'}${Math.abs(a.last7Loss).toFixed(1)}<span class="unit">lb</span></div><div class="stat-detail">raw, not regression-smoothed</div></div>
    ${consistency ? `<div class="stat-card ${consClass}"><div class="stat-label">Logging Consistency</div><div class="stat-value">${consistency.pct}<span class="unit">%</span></div><div class="stat-detail">${consistency.logged} of ${consistency.total} days in last 30</div></div>` : ''}
  </div>`;
}

function renderComparePeriodsCard(s) {
  const cmp = getPeriodComparison(s, 30);
  if (!cmp) return '';
  const r = cmp.recent, p = cmp.prior;
  const fmtDelta = (d, unit, invert) => {
    const sign = d > 0 ? '+' : (d < 0 ? '−' : '');
    const abs = Math.abs(d);
    const cls = (invert ? d < 0 : d > 0) ? 'good' : (d === 0 ? '' : 'bad');
    const color = cls === 'good' ? 'var(--status-good)' : cls === 'bad' ? 'var(--status-bad)' : 'var(--muted)';
    return `<span style="color: ${color}; font-weight: 700;">${sign}${typeof abs === 'number' && abs % 1 !== 0 ? abs.toFixed(1) : abs}${unit ? ' ' + unit : ''}</span>`;
  };
  return `<div class="weekday-card">
    <div class="weekday-headline">Last 30 days vs the 30 before that.</div>
    <div class="weekday-sub">${formatShortDate(r.startISO)} – ${formatShortDate(r.endISO)} compared to ${formatShortDate(p.startISO)} – ${formatShortDate(p.endISO)}</div>
    <table class="weight-log-table" style="margin-top: 10px;">
      <thead><tr><th>Metric</th><th class="right">Recent 30</th><th class="right">Previous 30</th><th class="right">Δ</th></tr></thead>
      <tbody>
        <tr><td>Weight loss</td><td class="right">${r.weightDelta >= 0 ? '−' : '+'}${Math.abs(r.weightDelta).toFixed(1)} lb</td><td class="right">${p.weightDelta >= 0 ? '−' : '+'}${Math.abs(p.weightDelta).toFixed(1)} lb</td><td class="right">${fmtDelta(r.weightDelta - p.weightDelta, 'lb')}</td></tr>
        <tr><td>Avg intake</td><td class="right">${r.avgIntake.toLocaleString()} cal</td><td class="right">${p.avgIntake.toLocaleString()} cal</td><td class="right">${fmtDelta(r.avgIntake - p.avgIntake, 'cal', true)}</td></tr>
        <tr><td>Avg exercise burn</td><td class="right">${r.avgBurn.toLocaleString()} cal</td><td class="right">${p.avgBurn.toLocaleString()} cal</td><td class="right">${fmtDelta(r.avgBurn - p.avgBurn, 'cal')}</td></tr>
        <tr><td>Days logged</td><td class="right">${r.daysLogged} of ${r.totalDays}</td><td class="right">${p.daysLogged} of ${p.totalDays}</td><td class="right">${fmtDelta(r.daysLogged - p.daysLogged, 'days')}</td></tr>
      </tbody>
    </table>
  </div>`;
}

function renderWeekdayPatternCard(s) {
  const p = getWeekdayPatterns(s);
  if (!p) return '';
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const maxAvg = Math.max(...p.dayAverages.filter(v => v != null), 1);
  let headlineText = p.weekendBumpPct > 15 ? `Your weekends run <em>${p.weekendBumpPct}% higher</em> than your weekdays.` : p.weekendBumpPct < -15 ? `Your weekdays run <em>${Math.abs(p.weekendBumpPct)}% higher</em> than your weekends.` : `Your weekday and weekend intake are <em>roughly the same</em>.`;
  return `<div class="weekday-card">
    <div class="weekday-headline">${headlineText}</div>
    <div class="weekday-sub">Weekday avg: <strong>${p.weekdayAvg.toLocaleString()}</strong> cal · Weekend avg: <strong>${p.weekendAvg.toLocaleString()}</strong> cal · last 30 days</div>
    <div class="weekday-bars">${p.dayAverages.map((avg, i) => { const isWeekend = i === 0 || i === 6; const heightPct = avg != null ? Math.round((avg / maxAvg) * 100) : 0; return `<div class="weekday-bar-wrap"><div class="weekday-bar-track"><div class="weekday-bar-fill ${avg == null ? 'empty' : (isWeekend ? 'weekend' : '')}" style="height: ${heightPct}%"></div></div><div class="weekday-bar-label">${dayLabels[i]}</div><div class="weekday-bar-value">${avg != null ? avg.toLocaleString() : '—'}</div></div>`; }).join('')}</div>
  </div>`;
}

function renderInsightArchive(s) {
  const today = parseISODate(todayISO());
  const userStart = s.weights.length ? parseISODate(s.weights[0].date) : today;
  const weeks = [];
  for (let w = 1; w <= 3; w++) {
    const end = new Date(today.getTime() - (1 + w * 7) * 86400000);
    const start = new Date(end.getTime() - 6 * 86400000);
    if (end < userStart) continue;
    const startISO = formatDateISO(start), endISO = formatDateISO(end);
    weeks.push({ start: startISO, end: endISO, delta: nearestWeight(s, startISO) - nearestWeight(s, endISO) });
  }
  if (weeks.length === 0) return `<div style="font-size: 13px; color: var(--muted); padding: 16px 0;">No earlier weeks to show yet.</div>`;
  return weeks.map(w => `<div class="archive-item"><div><div class="archive-week">${formatShortDate(w.start)} – ${formatShortDate(w.end)}</div><div class="archive-loss">${w.delta > 0 ? 'Down ' + w.delta.toFixed(1) + ' lbs' : w.delta < 0 ? 'Up ' + Math.abs(w.delta).toFixed(1) + ' lbs' : 'Flat'}</div></div><div class="archive-arrow">${ICON.arrow}</div></div>`).join('');
}

/* ===================================================
   VIEW: COACH (placeholder until backend)
   =================================================== */

/* ===================================================
   MODALS
   =================================================== */
function openMealEdit(mealId) {
  const meal = state.meals.find(m => m.id === mealId);
  if (!meal) return;
  const draft = JSON.parse(JSON.stringify(meal));
  const modal = document.getElementById('modal');
  const renderModal = () => {
    const total = draft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
    modal.innerHTML = `<div class="modal-h">Edit meal</div><div class="modal-sub">Logged ${formatHumanDate(draft.date)}</div>
      <div class="form-row form-row-2"><div><div class="form-label">Meal type</div><select class="form-select" id="edit-mealtype"><option value="breakfast" ${draft.mealType === 'breakfast' ? 'selected' : ''}>Breakfast</option><option value="lunch" ${draft.mealType === 'lunch' ? 'selected' : ''}>Lunch</option><option value="snack" ${draft.mealType === 'snack' ? 'selected' : ''}>Snack</option><option value="dinner" ${draft.mealType === 'dinner' ? 'selected' : ''}>Dinner</option><option value="imported" ${draft.mealType === 'imported' ? 'selected' : ''}>Imported</option></select></div><div><div class="form-label">Time</div><input class="form-input" type="time" id="edit-time" value="${draft.time}" /></div></div>
      <div class="form-row"><div class="form-label">Date</div><input class="form-input" type="date" id="edit-date" value="${draft.date}" /></div>
      <div class="form-row"><div class="form-label">Items</div><div class="edit-items-list">${draft.items.map((it, i) => `<div class="edit-item-row"><input type="text" data-idx="${i}" data-field="name" value="${escapeAttr(it.name)}" /><input type="number" data-idx="${i}" data-field="calories" class="cal-input" value="${it.calories}" min="0" /><button class="edit-item-remove" data-remove="${i}">×</button></div>`).join('')}</div><button class="edit-add-item-btn" id="edit-add-item">+ Add item</button></div>
      <div class="edit-total-row"><div class="edit-total-label">Total</div><div class="edit-total-value">${total} cal</div></div>
      <div class="modal-actions modal-actions-3"><button class="btn btn-danger" id="edit-delete">Delete</button><button class="btn btn-secondary" id="modal-cancel">Cancel</button><button class="btn btn-primary" id="edit-save">Save</button></div>`;
    modal.querySelectorAll('input[data-idx]').forEach(input => input.addEventListener('input', (e) => { const i = parseInt(e.target.dataset.idx); const f = e.target.dataset.field; if (f === 'calories') draft.items[i].calories = parseInt(e.target.value) || 0; else draft.items[i][f] = e.target.value; if (f === 'calories') renderModal(); }));
    modal.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', (e) => { draft.items.splice(parseInt(e.currentTarget.dataset.remove), 1); renderModal(); }));
    document.getElementById('edit-add-item').addEventListener('click', () => { draft.items.push({ name: 'New item', calories: 100, source: 'manual' }); renderModal(); });
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('edit-delete').addEventListener('click', () => { if (!confirm('Delete this meal?')) return; const before = state.meals.find(m => m.id === mealId); state.meals = state.meals.filter(m => m.id !== mealId); recordAction({ type: 'delete-meal', meal: before }); saveState(); closeModal(); toast('Meal deleted', { undo: true }); navigate(currentView); });
    document.getElementById('edit-save').addEventListener('click', () => {
      const before = JSON.parse(JSON.stringify(state.meals.find(m => m.id === mealId)));
      draft.mealType = document.getElementById('edit-mealtype').value;
      draft.time = document.getElementById('edit-time').value;
      draft.date = document.getElementById('edit-date').value;
      draft.totalCal = draft.items.reduce((s, x) => s + (parseInt(x.calories) || 0), 0);
      const idx = state.meals.findIndex(m => m.id === mealId);
      if (idx >= 0) state.meals[idx] = draft;
      state.meals.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
      recordAction({ type: 'edit-meal', meal: draft, before });
      saveState(); closeModal(); toast('Meal updated', { undo: true }); navigate(currentView);
    });
  };
  renderModal();
  document.getElementById('modal-backdrop').classList.add('open');
}

function openWeightEdit(date) {
  const w = state.weights.find(w => w.date === date);
  if (!w) return;
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">Edit weigh-in</div><div class="modal-sub">${formatHumanDate(date)}</div>
    <div class="weight-input-big"><input type="number" id="weight-edit-input" value="${w.weight.toFixed(1)}" step="0.1" min="50" max="500" /><span class="unit">lbs</span></div>
    <div class="form-row" style="margin-top: 16px;"><div class="form-label">Date</div><input class="form-input" type="date" id="weight-edit-date" value="${date}" /></div>
    <div class="modal-actions modal-actions-3"><button class="btn btn-danger" id="weight-edit-delete">Delete</button><button class="btn btn-secondary" id="modal-cancel">Cancel</button><button class="btn btn-primary" id="weight-edit-save">Save</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  setTimeout(() => document.getElementById('weight-edit-input').focus(), 50);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('weight-edit-delete').addEventListener('click', () => { if (!confirm('Delete this weight entry?')) return; const before = state.weights.find(x => x.date === date); state.weights = state.weights.filter(x => x.date !== date); recordAction({ type: 'delete-weight', weight: before }); saveState(); closeModal(); toast('Weight deleted', { undo: true }); navigate(currentView); });
  document.getElementById('weight-edit-save').addEventListener('click', () => {
    const newW = parseFloat(document.getElementById('weight-edit-input').value);
    const newDate = document.getElementById('weight-edit-date').value;
    if (isNaN(newW) || newW < 50 || newW > 500) return alert('Weight must be 50–500 lb');
    const before = { ...state.weights.find(x => x.date === date) };
    state.weights = state.weights.filter(x => x.date !== date);
    state.weights.push({ date: newDate, weight: newW });
    state.weights.sort((a, b) => a.date.localeCompare(b.date));
    recordAction({ type: 'edit-weight', weight: { date: newDate, weight: newW }, before });
    saveState(); closeModal(); toast('Weight updated', { undo: true }); navigate(currentView);
  });
}

function openExerciseEdit(exId) {
  const ex = (state.exercises || []).find(e => e.id === exId);
  if (!ex) return;
  const draft = { ...ex };
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">Edit activity</div><div class="modal-sub">Logged ${formatHumanDate(draft.date)}</div>
    <div class="form-row"><div class="form-label">Activity</div><select class="form-select" id="ex-edit-type">${EXERCISE_TYPES.map(t => `<option value="${t.id}" ${draft.type === t.id ? 'selected' : ''}>${t.emoji} ${t.name}</option>`).join('')}</select></div>
    <div class="form-row form-row-2"><div><div class="form-label">Date</div><input class="form-input" type="date" id="ex-edit-date" value="${draft.date}" /></div><div><div class="form-label">Time</div><input class="form-input" type="time" id="ex-edit-time" value="${draft.time}" /></div></div>
    <div class="form-row form-row-2"><div><div class="form-label">Duration (min)</div><input class="form-input" type="number" id="ex-edit-duration" value="${draft.duration}" min="0" max="600" /></div><div><div class="form-label">Calories burned</div><input class="form-input" type="number" id="ex-edit-calories" value="${draft.caloriesBurned}" min="0" max="3000" /></div></div>
    <div class="form-row"><div class="form-label">Note</div><input class="form-input" type="text" id="ex-edit-note" value="${escapeAttr(draft.note || '')}" placeholder="Optional" /></div>
    <div class="modal-actions modal-actions-3"><button class="btn btn-danger" id="ex-edit-delete">Delete</button><button class="btn btn-secondary" id="modal-cancel">Cancel</button><button class="btn btn-primary" id="ex-edit-save">Save</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('ex-edit-delete').addEventListener('click', () => { if (!confirm('Delete this activity?')) return; const before = state.exercises.find(e => e.id === exId); state.exercises = state.exercises.filter(e => e.id !== exId); recordAction({ type: 'delete-exercise', exercise: before }); saveState(); closeModal(); toast('Activity deleted', { undo: true }); navigate(currentView); });
  document.getElementById('ex-edit-save').addEventListener('click', () => {
    const before = JSON.parse(JSON.stringify(state.exercises.find(e => e.id === exId)));
    const newType = document.getElementById('ex-edit-type').value;
    const newT = getExerciseTypeById(newType);
    const updated = { ...draft, type: newType, typeName: newT.name, typeEmoji: newT.emoji, date: document.getElementById('ex-edit-date').value, time: document.getElementById('ex-edit-time').value, duration: parseInt(document.getElementById('ex-edit-duration').value) || draft.duration, caloriesBurned: parseInt(document.getElementById('ex-edit-calories').value) || 0, note: document.getElementById('ex-edit-note').value.trim() };
    const idx = state.exercises.findIndex(e => e.id === exId);
    if (idx >= 0) state.exercises[idx] = updated;
    state.exercises.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
    recordAction({ type: 'edit-exercise', exercise: updated, before });
    saveState(); closeModal(); toast('Activity updated', { undo: true }); navigate(currentView);
  });
}

function openExerciseAdd() {
  // Preset tiles shown first — most-common activities. Order chosen to match common
  // logging frequency. "Other" reveals the full activity dropdown.
  const PRESETS = [
    { id: 'walking',  name: 'Walk',     emoji: '🚶' },
    { id: 'running',  name: 'Run',      emoji: '🏃' },
    { id: 'strength', name: 'Lift',     emoji: '🏋️' },
    { id: 'cycling',  name: 'Bike',     emoji: '🚴' },
    { id: 'other',    name: 'Other…',   emoji: '➕' },
  ];
  let selectedTypeId = 'walking';
  let userOverride = false; // user manually edited the calorie field
  let showFullSelector = false; // toggled when "Other..." is tapped

  const modal = document.getElementById('modal');

  const render = () => {
    const t = getExerciseTypeById(selectedTypeId);
    const defaultDur = 30;
    const defaultCal = estimateExerciseCalories(selectedTypeId, defaultDur, getCurrentWeight(state));
    modal.innerHTML = `<div class="modal-h">Log activity</div>
      <div class="modal-sub">Logged exercise feeds into your weekly calibration. Estimates are conservative — most trackers overestimate by 30%.</div>
      <div class="exercise-preset-grid">
        ${PRESETS.map(p => `<button class="exercise-preset-tile ${selectedTypeId === p.id || (p.id === 'other' && showFullSelector) ? 'active' : ''}" data-preset="${p.id}">
          <div class="exercise-preset-emoji">${p.emoji}</div>
          <div class="exercise-preset-name">${p.name}</div>
        </button>`).join('')}
      </div>
      ${showFullSelector ? `
        <div class="form-row"><div class="form-label">Activity</div><select class="form-select" id="addex-type">${EXERCISE_TYPES.map(et => `<option value="${et.id}" ${selectedTypeId === et.id ? 'selected' : ''}>${et.emoji} ${et.name}</option>`).join('')}</select></div>
      ` : ''}
      <div class="form-row form-row-2">
        <div><div class="form-label">Duration (min)</div><input class="form-input" type="number" id="addex-duration" value="${defaultDur}" min="1" max="600" autofocus /></div>
        <div><div class="form-label">Calories burned</div><input class="form-input" type="number" id="addex-calories" value="${defaultCal}" min="0" max="3000" /></div>
      </div>
      <div class="form-row"><div class="form-label">Note</div><input class="form-input" type="text" id="addex-note" placeholder="Optional" /></div>
      <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button><button class="btn btn-primary btn-block" id="addex-save">Log ${t.name.toLowerCase()}</button></div>`;

    document.getElementById('modal-backdrop').classList.add('open');

    // Wire preset tiles
    document.querySelectorAll('[data-preset]').forEach(el => {
      el.addEventListener('click', () => {
        const p = el.dataset.preset;
        if (p === 'other') {
          showFullSelector = true;
          // Default to a non-walking type so the dropdown is meaningful
          if (['walking', 'running', 'cycling', 'strength'].includes(selectedTypeId)) {
            selectedTypeId = 'hiit';
          }
        } else {
          showFullSelector = false;
          selectedTypeId = p;
        }
        userOverride = false;
        render();
      });
    });

    // Wire dropdown if visible
    const typeEl = document.getElementById('addex-type');
    if (typeEl) {
      typeEl.addEventListener('change', (e) => {
        selectedTypeId = e.target.value;
        userOverride = false;
        // Don't full re-render — just update the calorie field below
        const durEl = document.getElementById('addex-duration');
        const calEl = document.getElementById('addex-calories');
        if (durEl && calEl) {
          calEl.value = estimateExerciseCalories(selectedTypeId, parseInt(durEl.value) || 0, getCurrentWeight(state));
        }
      });
    }

    const durEl = document.getElementById('addex-duration');
    const calEl = document.getElementById('addex-calories');
    durEl.addEventListener('input', () => {
      if (userOverride) return;
      calEl.value = estimateExerciseCalories(selectedTypeId, parseInt(durEl.value) || 0, getCurrentWeight(state));
    });
    calEl.addEventListener('input', () => { userOverride = true; });

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('addex-save').addEventListener('click', () => {
      const dur = parseInt(durEl.value), cal = parseInt(calEl.value);
      const note = document.getElementById('addex-note').value.trim();
      if (isNaN(dur) || dur < 1 || dur > 600) return toast('Duration 1-600 min');
      if (isNaN(cal) || cal < 0 || cal > 3000) return toast('Calories 0-3000');
      const t2 = getExerciseTypeById(selectedTypeId);
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const exercise = { id: Date.now(), date: getSelectedDate(), time, type: selectedTypeId, typeName: t2.name, typeEmoji: t2.emoji, duration: dur, caloriesBurned: cal, note, source: 'manual' };
      state.exercises.push(exercise);
      recordAction({ type: 'create-exercise', exercise });
      saveState(); closeModal(); toast(`Logged ${t2.name} · ${dur} min · ${cal} cal`, { undo: true }); navigate('diary');
    });
  };

  render();
}

function openDayDetail(date) {
  const w = state.weights.find(x => x.date === date);
  const dayMeals = getMealsForDate(state, date);
  const dayExercises = getExercisesForDate(state, date);
  const totalIntake = dayMeals.reduce((s, m) => s + m.totalCal, 0);
  const totalRawBurn = dayExercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
  const dayWeight = w ? w.weight : getCurrentWeight(state);
  const bmr = mifflinStJeor(state.user, dayWeight);
  const trackerAcc = state.user.trackerAccuracy != null ? state.user.trackerAccuracy : 1.0;
  const adjustedBurn = totalRawBurn * trackerAcc;
  const dayTDEE = bmr * 1.2 + adjustedBurn;
  const netDeficit = dayTDEE - totalIntake;
  const netSign = netDeficit >= 0 ? '−' : '+';
  const modal = document.getElementById('modal');
  modal.className = 'modal modal-wide';
  modal.innerHTML = `<div class="modal-h">${formatHumanDate(date)}</div><div class="modal-sub">Everything logged for this day. Click any item to edit.</div>
    <div class="day-detail-stats">
      <div class="day-detail-stat ${w ? 'editable' : 'muted'}" ${w ? 'id="dd-weight-edit"' : ''}><div class="day-detail-stat-label">Weight</div><div class="day-detail-stat-value">${w ? w.weight.toFixed(1) : '—'}</div></div>
      <div class="day-detail-stat ${totalIntake === 0 ? 'muted' : ''}"><div class="day-detail-stat-label">Intake</div><div class="day-detail-stat-value">${totalIntake > 0 ? totalIntake.toLocaleString() : '—'}</div></div>
      <div class="day-detail-stat ${totalRawBurn === 0 ? 'muted' : ''}"><div class="day-detail-stat-label">Burn (raw)</div><div class="day-detail-stat-value">${totalRawBurn > 0 ? totalRawBurn.toLocaleString() : '—'}</div></div>
      <div class="day-detail-stat ${(totalIntake === 0 && totalRawBurn === 0) ? 'muted' : ''}"><div class="day-detail-stat-label">Net deficit</div><div class="day-detail-stat-value">${(totalIntake > 0 || totalRawBurn > 0) ? netSign + Math.abs(Math.round(netDeficit)).toLocaleString() : '—'}</div></div>
    </div>
    <div class="day-detail-section"><div class="day-detail-section-h">Meals (${dayMeals.length})</div>${dayMeals.length ? `<div class="meal-list">${dayMeals.map(m => `<div class="meal-item clickable" data-dd-meal-id="${m.id}"><div class="meal-time">${formatTime12(m.time)}</div><div class="meal-body"><div class="meal-name">${m.items.map(i => i.name).join(', ')}</div><div class="meal-detail">${m.mealType}</div></div><div class="meal-cal">${m.totalCal}</div></div>`).join('')}</div>` : '<div class="day-detail-empty">No meals logged.</div>'}</div>
    <div class="day-detail-section"><div class="day-detail-section-h">Activity (${dayExercises.length})</div>${dayExercises.length ? dayExercises.map(e => `<div class="exercise-item clickable" data-dd-exercise-id="${e.id}"><div class="exercise-emoji">${e.typeEmoji || '💪'}</div><div class="exercise-body"><div class="exercise-name">${e.typeName || e.type}</div><div class="exercise-detail">${e.duration > 0 ? formatTime12(e.time) + ' · ' + e.duration + ' min' : 'tracker daily total'}${e.note ? ' · ' + e.note : ''}</div></div><div class="exercise-burn">+${e.caloriesBurned}</div></div>`).join('') : '<div class="day-detail-empty">No activity logged.</div>'}</div>
    <div class="day-detail-section"><div class="day-detail-section-h">Note</div><textarea class="form-input" id="dd-note" placeholder="Add context for this day" style="min-height: 70px;">${escapeAttr(state.dayNotes[date] || '')}</textarea></div>
    <div style="font-size: 11.5px; color: var(--muted); font-style: italic; padding-top: 8px; border-top: 1px solid var(--border-soft);">Day TDEE ≈ ${Math.round(dayTDEE).toLocaleString()} cal</div>
    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Close</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  const noteEl = document.getElementById('dd-note');
  document.getElementById('modal-cancel').addEventListener('click', () => {
    if (noteEl) { const v = noteEl.value.trim(); if (v) state.dayNotes[date] = v; else delete state.dayNotes[date]; saveState(); }
    closeModal(); modal.className = 'modal'; navigate(currentView);
  });
  const wEdit = document.getElementById('dd-weight-edit');
  if (wEdit) wEdit.addEventListener('click', () => { modal.className = 'modal'; openWeightEdit(date); });
  modal.querySelectorAll('[data-dd-meal-id]').forEach(el => el.addEventListener('click', () => { modal.className = 'modal'; openMealEdit(parseInt(el.dataset.ddMealId)); }));
  modal.querySelectorAll('[data-dd-exercise-id]').forEach(el => el.addEventListener('click', () => { modal.className = 'modal'; openExerciseEdit(parseInt(el.dataset.ddExerciseId)); }));
}

/* Feedback modal — collects a short note from the user and opens their email
 * client with a prefilled message to feedback@caloriecorrect.com. We deliberately
 * use a mailto handoff (rather than POSTing somewhere) so during alpha there's
 * zero server infra needed for feedback and replies happen in normal email. */
function openFeedbackModal() {
  const modal = document.getElementById('modal');
  const ua = navigator.userAgent || 'unknown';
  const screenInfo = `${window.innerWidth}x${window.innerHeight}`;
  const installed = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  modal.className = 'modal';
  modal.innerHTML = `<div class="modal-h">Send feedback</div>
    <div class="modal-sub">Bug, idea, complaint, kind word — all welcome. Goes straight to Seth.</div>
    <textarea id="feedback-text" class="feedback-textarea" placeholder="What's on your mind?" rows="6"></textarea>
    <label class="feedback-meta-toggle">
      <input type="checkbox" id="feedback-include-context" checked />
      <span>Include browser + screen info to help debug</span>
    </label>
    <div class="modal-actions">
      <button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary btn-block" id="modal-send">Open email</button>
    </div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  setTimeout(() => document.getElementById('feedback-text').focus(), 50);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-send').addEventListener('click', () => {
    const text = (document.getElementById('feedback-text').value || '').trim();
    const includeContext = document.getElementById('feedback-include-context').checked;
    if (!text) { toast('Add a quick note first'); return; }
    const subject = 'Calorie Correct feedback';
    let body = text;
    if (includeContext) {
      body += `\n\n---\nDebug info (auto-included)\nBrowser: ${ua}\nScreen: ${screenInfo}\nInstalled PWA: ${installed ? 'yes' : 'no'}\nDate: ${new Date().toISOString()}`;
    }
    const href = `mailto:hi@caloriecorrect.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    closeModal();
    toast('Thanks — opening your email');
  });
}

function openWeighIn() {
  const today = todayISO();
  const existing = state.weights.find(w => w.date === today);
  const startVal = existing ? existing.weight : getCurrentWeight(state);
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">${existing ? 'Update' : 'Log'} today's weight</div><div class="modal-sub">First thing in the morning — that's the most consistent reading.</div>
    <div class="weight-input-big"><input type="number" id="weight-input" value="${startVal.toFixed(1)}" step="0.1" min="50" max="500" /><span class="unit">lbs</span></div>
    <div style="text-align: center; font-size: 12px; color: var(--muted); margin-top: 4px;">${formatHumanDate(today)}</div>
    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button><button class="btn btn-primary btn-block" id="modal-save">Save</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  setTimeout(() => document.getElementById('weight-input').focus(), 50);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click', saveWeight);
  document.getElementById('weight-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveWeight(); });
}

function saveWeight() {
  const val = parseFloat(document.getElementById('weight-input').value);
  if (isNaN(val) || val < 50 || val > 500) { toast('Enter a weight between 50 and 500'); return; }
  const today = todayISO();
  const existingIdx = state.weights.findIndex(w => w.date === today);
  let action;
  if (existingIdx >= 0) {
    const before = { ...state.weights[existingIdx] };
    state.weights[existingIdx].weight = val;
    action = { type: 'edit-weight', weight: { date: today, weight: val }, before };
  } else {
    const w = { date: today, weight: val };
    state.weights.push(w);
    action = { type: 'create-weight', weight: w };
  }
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  recordAction(action);
  saveState();
  closeModal();
  toast(`Weight logged: ${val.toFixed(1)} lbs`, { undo: true });
  navigate(currentView);
}

function openSettings() {
  const modal = document.getElementById('modal');
  const exp = getLastExportInfo();
  const bak = getBackupInfo();
  const rate = state.user.targetLossRate != null ? state.user.targetLossRate : 1.0;
  const ratePct = Math.round(rate * 100);
  const rateLabel = rate === 0 ? 'Maintenance' : rate < 0.6 ? 'Gentle' : rate < 1.2 ? 'Standard' : rate < 1.7 ? 'Aggressive' : 'Very aggressive';
  const exportNote = exp.never ? 'Never exported.' : `Last export: ${exp.days} day${exp.days !== 1 ? 's' : ''} ago`;
  const exportClass = exp.never || exp.overdue ? 'settings-meta-warn' : '';
  const heightFt = Math.floor(state.user.heightInches / 12);
  const heightIn = state.user.heightInches % 12;
  const sexText = state.user.sex === 'F' ? 'female' : 'male';
  const recipes = state.recipes || [];

  modal.className = 'modal modal-wide';
  modal.innerHTML = `<div class="modal-h">Settings</div>
    <div class="modal-sub">${state.isDemo ? 'Currently using demo data.' : 'Using your own data.'}</div>

    <div class="settings-section">
      <div class="settings-section-eyebrow">Profile</div>

      <div class="settings-item-static">
        <div class="settings-item-label">${escapeAttr(state.user.name)}</div>
        <div class="settings-item-meta">${sexText} · ${state.user.age} · ${heightFt}'${heightIn}"</div>
      </div>

      <div class="settings-item">
        <div class="settings-item-label">Activity level</div>
        <select class="settings-select" id="settings-activity">${ACTIVITY_LEVELS.map(a => `<option value="${a.id}" ${(state.user.activityLevel || 'light') === a.id ? 'selected' : ''}>${a.name}</option>`).join('')}</select>
      </div>

      <div class="settings-item">
        <div class="settings-item-label">Goal weight</div>
        <div class="settings-item-control-group">
          <input type="number" class="settings-input" id="settings-goal" value="${state.user.goalWeight}" min="50" max="500" step="0.5" />
          <span class="settings-item-unit">lb</span>
          <button class="btn btn-secondary btn-sm" id="settings-save-goal">Update</button>
        </div>
      </div>

      <div class="settings-item-stack">
        <div class="settings-item-head">
          <div class="settings-item-label">Target loss rate</div>
          <div class="settings-item-value" id="settings-rate-val">${rate.toFixed(2)}<span class="settings-item-unit">lb/wk</span></div>
        </div>
        <input type="range" class="settings-slider" id="settings-rate" min="0" max="200" step="25" value="${ratePct}" />
        <div class="settings-item-anchors">
          <span>Maintenance</span>
          <span class="settings-item-anchor-active" id="settings-rate-label">${rateLabel}</span>
          <span>2.0 lb/wk</span>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-eyebrow">Your data</div>

      <div class="settings-item">
        <div>
          <div class="settings-item-label">Recipes · ${recipes.length}</div>
          <div class="settings-item-detail">Reusable ingredient lists you can log with one tap.</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="settings-recipes-btn">Manage</button>
      </div>

      <div class="settings-item-stack">
        <div class="settings-item-head">
          <div class="settings-item-label">Export your data</div>
          <div class="settings-item-meta ${exportClass}">${exportNote}</div>
        </div>
        <div class="settings-action-row">
          <button class="btn btn-secondary btn-sm" id="export-json-btn">JSON</button>
          <button class="btn btn-secondary btn-sm" id="export-csv-btn">CSV</button>
        </div>
      </div>

      <div class="settings-item">
        <div>
          <div class="settings-item-label">Restore from auto-backup</div>
          <div class="settings-item-detail">${bak ? `Last backup: ${bak}.` : 'No auto-backup yet.'}</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="restore-backup-btn" ${!bak ? 'disabled' : ''}>Restore</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-eyebrow">Reset</div>

      <div class="settings-item">
        <div>
          <div class="settings-item-label">Reset to demo data</div>
          <div class="settings-item-detail">Loads Average Joe's example.</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="reset-demo-btn">Reset</button>
      </div>

      <div class="settings-item">
        <div>
          <div class="settings-item-label">Start fresh</div>
          <div class="settings-item-detail">Clears all data, runs onboarding.</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="start-fresh-btn">Start fresh</button>
      </div>

      <div class="settings-item">
        <div>
          <div class="settings-item-label">Import from CSV</div>
          <div class="settings-item-detail">Upload daily weights and calories from a spreadsheet.</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="import-csv-btn">Import</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-eyebrow">About</div>
      <div class="settings-about-links">
        <a href="/privacy.html" target="_blank" rel="noopener">Privacy policy</a>
        <span class="settings-about-sep">·</span>
        <a href="/terms.html" target="_blank" rel="noopener">Terms of service</a>
        <span class="settings-about-sep">·</span>
        <a href="#" id="settings-feedback-link">Send feedback</a>
      </div>
    </div>

    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Close</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  const feedbackLink = document.getElementById('settings-feedback-link');
  if (feedbackLink) feedbackLink.addEventListener('click', (e) => { e.preventDefault(); closeModal(); setTimeout(openFeedbackModal, 120); });
  document.getElementById('reset-demo-btn').addEventListener('click', () => { if (!confirm('Reset to demo data?')) return; resetToDemoData(); closeModal(); toast('Demo data restored'); navigate('diary'); });
  document.getElementById('start-fresh-btn').addEventListener('click', () => { if (!confirm('Clear all data and start fresh?')) return; closeModal(); startOnboarding(); });
  document.getElementById('import-csv-btn').addEventListener('click', () => { closeModal(); setTimeout(openCsvImportModal, 120); });
  document.getElementById('settings-activity').addEventListener('change', (e) => { state.user.activityLevel = e.target.value; saveState(); toast(`Activity level updated`); });
  document.getElementById('export-json-btn').addEventListener('click', () => exportData('json'));
  document.getElementById('export-csv-btn').addEventListener('click', () => exportData('csv'));
  const restoreBtn = document.getElementById('restore-backup-btn');
  if (restoreBtn) restoreBtn.addEventListener('click', () => { if (!confirm('Restore from auto-backup?')) return; if (restoreFromBackup()) { closeModal(); toast('Restored from backup'); navigate('diary'); } else toast('No backup found'); });
  const rateSlider = document.getElementById('settings-rate');
  if (rateSlider) {
    const rateLabelFor = (r) => r === 0 ? 'Maintenance' : r < 0.6 ? 'Gentle' : r < 1.2 ? 'Standard' : r < 1.7 ? 'Aggressive' : 'Very aggressive';
    rateSlider.addEventListener('input', (e) => {
      const r = parseInt(e.target.value) / 100;
      document.getElementById('settings-rate-val').innerHTML = `${r.toFixed(2)}<span class="settings-item-unit">lb/wk</span>`;
      const lbl = document.getElementById('settings-rate-label');
      if (lbl) lbl.textContent = rateLabelFor(r);
    });
    rateSlider.addEventListener('change', (e) => { state.user.targetLossRate = parseInt(e.target.value) / 100; saveState(); toast(`Target rate: ${state.user.targetLossRate.toFixed(2)} lb/wk`); });
  }
  document.getElementById('settings-save-goal').addEventListener('click', () => { const v = parseFloat(document.getElementById('settings-goal').value); if (isNaN(v) || v < 50 || v > 500) return toast('Goal weight 50-500 lb'); state.user.goalWeight = v; saveState(); closeModal(); toast(`Goal weight: ${v} lb`); navigate(currentView); });
  const recipesBtn = document.getElementById('settings-recipes-btn');
  if (recipesBtn) recipesBtn.addEventListener('click', () => {
    closeModal();
    setTimeout(openRecipesModal, 120);
  });
}

function exportData(format) {
  let blob, filename;
  if (format === 'json') {
    blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    filename = `calorie-correct-${todayISO()}.json`;
  } else {
    const dates = new Set();
    state.weights.forEach(w => dates.add(w.date));
    state.meals.forEach(m => dates.add(m.date));
    (state.exercises || []).forEach(e => dates.add(e.date));
    const sortedDates = Array.from(dates).sort();
    const lines = ['date,weight_lb,intake_cal,exercise_burn_cal,net_intake_cal'];
    for (const d of sortedDates) {
      const w = state.weights.find(x => x.date === d);
      const intake = getDailyCalories(state, d);
      const burn = getDailyExerciseBurn(state, d);
      const net = intake - burn;
      lines.push([d, w ? w.weight : '', intake || '', burn || '', net !== 0 ? net : ''].join(','));
    }
    blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    filename = `calorie-correct-${todayISO()}.csv`;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
  localStorage.setItem(STORAGE_LAST_EXPORT_KEY, new Date().toISOString());
  toast(`Exported ${filename}`);
}

function getLastExportInfo() {
  const ts = localStorage.getItem(STORAGE_LAST_EXPORT_KEY);
  if (!ts) return { never: true };
  const days = Math.floor((Date.now() - new Date(ts).getTime()) / 86400000);
  return { days, overdue: days >= 7 };
}

function getBackupInfo() {
  const ts = localStorage.getItem(STORAGE_BACKUP_TIME_KEY);
  if (!ts) return null;
  const age = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(age / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) !== 1 ? 's' : ''} ago`;
}

/* ===================================================
   IMPORT — Seth's HEALTH spreadsheet
   =================================================== */
const SETH_SPREADSHEET_DATA = [
  ['2026-02-09', 270.9, 1791, 3448], ['2026-02-10', 268.5, 1731, 2838], ['2026-02-11', 267.8, 1836, 3651],
  ['2026-02-12', 267.2, 2004, 2822], ['2026-02-13', 268.7, 1778, 2892], ['2026-02-14', 267.4, 1761, 2962],
  ['2026-02-15', 268.0, 2417, 3914], ['2026-02-16', 268.3, 2005, 4381], ['2026-02-17', 268.3, 1499, 4140],
  ['2026-02-18', 266.1, 1506, 3882], ['2026-02-19', 266.8, 1644, 4197], ['2026-02-20', 266.1, 2833, 2890],
  ['2026-02-21', 268.5, 1620, 3321], ['2026-02-22', 266.5, 1975, 2240], ['2026-02-23', 266.5, 1743, 2177],
  ['2026-02-24', 266.1, 1653, 3165], ['2026-02-25', 265.0, 2394, 1443], ['2026-02-26', 263.4, 1767, 2712],
  ['2026-02-27', 262.7, 2946, 1048], ['2026-02-28', 267.8, 1166, 1428], ['2026-03-01', 265.4, 2345, 880],
  ['2026-03-02', 266.0, 1593, 1436], ['2026-03-03', 264.9, 1658, 1518], ['2026-03-04', 263.4, 1702, 1617],
  ['2026-03-05', 264.9, 2596, 895], ['2026-03-06', 266.3, 2805, 1719], ['2026-03-07', 264.3, 1805, 953],
  ['2026-03-08', 264.3, 1767, 100], ['2026-03-09', 262.5, 1394, 190], ['2026-03-10', 261.2, 2614, 995],
  ['2026-03-11', 261.9, 2280, 1004], ['2026-03-12', 262.5, 2250, 1132], ['2026-03-13', 265.6, 2727, 1027],
  ['2026-03-14', 264.7, 2670, 948], ['2026-03-15', 266.8, 2596, 1632], ['2026-03-16', 264.9, 2267, 1498],
  ['2026-03-17', 269.1, 2000, 685], ['2026-03-18', 264.8, 2126, 800], ['2026-03-19', 262.7, 2377, 300],
  ['2026-03-20', 264.4, 2111, 500], ['2026-03-21', 266.7, 1869, 400], ['2026-03-22', 265.6, 2216, 1000],
  ['2026-03-23', 264.7, 2579, 472], ['2026-03-24', 265.6, 2090, 1033], ['2026-03-25', 264.7, 2216, 1129],
  ['2026-03-26', 263.8, 1868, 1802], ['2026-03-27', 262.5, 1903, 1287], ['2026-03-28', 261.9, 1945, 958],
  ['2026-03-29', 260.8, 1708, 200], ['2026-03-30', 261.0, 2206, 2578], ['2026-03-31', 261.6, 1841, 511],
  ['2026-04-01', 261.6, 2345, 2244], ['2026-04-02', 260.8, 3694, 904], ['2026-04-03', 261.6, 2466, 500],
  ['2026-04-04', 261.0, 2705, 2639], ['2026-04-05', 260.3, 2215, 1184], ['2026-04-06', 258.6, 5782, 283],
  ['2026-04-07', 264.7, 2273, 200], ['2026-04-08', 265.6, 2254, 1081], ['2026-04-09', 263.2, 2114, 1050],
  ['2026-04-10', 263.4, 2280, 640], ['2026-04-11', 261.4, 3019, 4041], ['2026-04-12', 262.1, 6702, 1205],
  ['2026-04-13', 266.9, 2275, 1282], ['2026-04-14', 265.6, 2506, 1761], ['2026-04-15', 264.9, 6315, 3065],
  ['2026-04-16', 269.6, 2212, 1075], ['2026-04-17', 265.6, 1582, 270], ['2026-04-18', 264.3, 2861, 1814],
  ['2026-04-19', 263.6, 2011, 1747], ['2026-04-20', 263.8, 1936, 616], ['2026-04-21', 263.0, 2066, 1554],
  ['2026-04-22', 263.0, 2141, 685], ['2026-04-23', 263.4, 6104, 940], ['2026-04-24', 264.7, 6500, 940],
  ['2026-04-25', 267.6, 5639, 940], ['2026-04-26', 266.5, 1904, 254], ['2026-04-27', 264.1, 2340, 800],
  ['2026-04-28', 266.5, 1967, 500], ['2026-04-29', 265.6, 2292, 600], ['2026-04-30', 265.8, 2292, 600],
  ['2026-05-01', 268.0, 6589, 600], ['2026-05-02', 268.0, 6589, 600],
];

/* =====================================================
   CSV IMPORT — generic spreadsheet upload
   =====================================================
   Lets users bulk-import historical data from a CSV they've kept elsewhere
   (Google Sheets, Excel, MyFitnessPal export, etc.). Expected columns:
     date, weight, calories_in, calories_out
   Header row required. Column names are matched case-insensitively against a
   small set of aliases so common exports work without renaming. Empty cells
   are fine — partial rows still import what they have.
   Two import modes:
     replace — wipes existing weights/meals/exercises, imports the CSV
     merge   — keeps existing data, adds CSV rows; dates that already have
               meal or exercise entries are not overwritten (weights are) */

const CSV_HEADER_ALIASES = {
  date:          ['date', 'day', 'when'],
  weight:        ['weight', 'weight_lb', 'weight_lbs', 'lbs', 'lb', 'morning_weight'],
  calories_in:   ['calories_in', 'caloriesin', 'calories', 'intake', 'in', 'kcal_in', 'eaten', 'consumed'],
  calories_out:  ['calories_out', 'caloriesout', 'burn', 'burned', 'out', 'kcal_out', 'exercise', 'exercise_calories', 'tracker', 'tdee_actual'],
};

function downloadCsvTemplate() {
  const today = todayISO();
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().slice(0,10);
  const csv = `date,weight,calories_in,calories_out\n${dayBefore},185.4,2100,420\n${yest},185.1,1850,510\n${today},184.8,,380\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calorie-correct-template.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

/* Tiny CSV parser — handles quoted fields and embedded commas. Doesn't
 * support multi-line cells (rare in spreadsheets people hand-edit). */
function parseCsvText(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return { rows: [], error: 'File is empty.' };
  const sep = lines[0].includes('\t') && !lines[0].includes(',') ? '\t' : ',';
  const splitRow = (line) => {
    const cells = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cur += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === sep) { cells.push(cur); cur = ''; }
        else { cur += ch; }
      }
    }
    cells.push(cur);
    return cells.map(c => c.trim());
  };
  const headerCells = splitRow(lines[0]).map(h => h.toLowerCase().replace(/[\s\-]+/g, '_'));
  const colIndex = {};
  for (const [field, aliases] of Object.entries(CSV_HEADER_ALIASES)) {
    for (let i = 0; i < headerCells.length; i++) {
      if (aliases.includes(headerCells[i])) { colIndex[field] = i; break; }
    }
  }
  if (colIndex.date == null) {
    return { rows: [], error: 'No "date" column found. First row must be headers including a date column.' };
  }
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitRow(lines[i]);
    const rawDate = (cells[colIndex.date] || '').trim();
    const date = parseFlexibleDate(rawDate);
    if (!date) continue; // skip rows without a parseable date
    const weight = colIndex.weight != null ? parseFloat(cells[colIndex.weight]) : NaN;
    const calIn  = colIndex.calories_in != null ? parseFloat(cells[colIndex.calories_in]) : NaN;
    const calOut = colIndex.calories_out != null ? parseFloat(cells[colIndex.calories_out]) : NaN;
    rows.push({
      date,
      weight: !isNaN(weight) && weight > 0 ? weight : null,
      caloriesIn:  !isNaN(calIn)  && calIn  >= 0 ? Math.round(calIn)  : null,
      caloriesOut: !isNaN(calOut) && calOut >= 0 ? Math.round(calOut) : null,
    });
  }
  return { rows, error: null };
}

/* Accept YYYY-MM-DD, MM/DD/YYYY, M/D/YY, or anything Date.parse handles.
 * Returns ISO date string or null. */
function parseFlexibleDate(s) {
  if (!s) return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return s;
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (us) {
    let [, m, d, y] = us;
    if (y.length === 2) y = (parseInt(y) > 50 ? '19' : '20') + y;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const t = Date.parse(s);
  if (!isNaN(t)) {
    const dt = new Date(t);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }
  return null;
}

function applyCsvImport(rows, mode) {
  // mode: 'replace' or 'merge'
  if (mode === 'replace') {
    state.weights = [];
    state.meals = [];
    state.exercises = [];
  }
  let mealId = (state.meals.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1;
  let exId   = (state.exercises.reduce((m, x) => Math.max(m, x.id || 0), 0) || 1000000) + 1;
  let weightsAdded = 0, mealsAdded = 0, exercisesAdded = 0, weightsSkipped = 0, mealsSkipped = 0, exercisesSkipped = 0;
  for (const r of rows) {
    if (r.weight != null) {
      const existingIdx = state.weights.findIndex(w => w.date === r.date);
      if (existingIdx >= 0) {
        state.weights[existingIdx].weight = r.weight;
      } else {
        state.weights.push({ date: r.date, weight: r.weight });
        weightsAdded++;
      }
    }
    if (r.caloriesIn != null) {
      const hasMeal = state.meals.some(m => m.date === r.date);
      if (hasMeal && mode === 'merge') { mealsSkipped++; }
      else {
        state.meals.push({
          id: mealId++, date: r.date, time: '12:00', mealType: 'imported',
          raw: 'Daily total (CSV import)',
          items: [{ name: 'Daily total', calories: r.caloriesIn, source: 'imported' }],
          totalCal: r.caloriesIn, source: 'imported',
        });
        mealsAdded++;
      }
    }
    if (r.caloriesOut != null && r.caloriesOut > 0) {
      const hasEx = state.exercises.some(e => e.date === r.date);
      if (hasEx && mode === 'merge') { exercisesSkipped++; }
      else {
        state.exercises.push({
          id: exId++, date: r.date, time: '17:00', type: 'other',
          typeName: 'Daily activity (imported)', typeEmoji: '⌚',
          duration: 0, caloriesBurned: r.caloriesOut,
          note: 'Imported from CSV', source: 'imported',
        });
        exercisesAdded++;
      }
    }
  }
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  state.meals.sort((a, b) => a.date.localeCompare(b.date));
  state.exercises.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
  return { weightsAdded, mealsAdded, exercisesAdded, weightsSkipped, mealsSkipped, exercisesSkipped };
}

function openCsvImportModal() {
  const modal = document.getElementById('modal');
  let parsedRows = null; // populated after a file is chosen and parsed
  modal.className = 'modal modal-wide';
  modal.innerHTML = `<div class="modal-h">Import from CSV</div>
    <div class="modal-sub">Bulk-upload past weights and daily calorie totals from a spreadsheet.</div>

    <div class="csv-import-info">
      <div class="csv-import-info-title">Expected columns</div>
      <div class="csv-import-info-cols"><code>date</code> · <code>weight</code> · <code>calories_in</code> · <code>calories_out</code></div>
      <div class="csv-import-info-meta">First row = headers. Date format: <code>YYYY-MM-DD</code> or <code>MM/DD/YYYY</code>. Empty cells are fine. Common header names like "intake", "burn", "lbs" are recognized automatically.</div>
      <button class="btn btn-link csv-template-link" id="csv-template-btn" type="button">Download a starter template</button>
    </div>

    <input type="file" id="csv-file-input" accept=".csv,.tsv,text/csv,text/tab-separated-values" style="display:none;" />
    <button class="btn btn-secondary btn-block" id="csv-pick-btn">Choose CSV file…</button>
    <div id="csv-preview" class="csv-preview"></div>

    <div class="csv-import-mode" id="csv-import-mode" style="display:none;">
      <label class="csv-mode-option">
        <input type="radio" name="csv-mode" value="replace" />
        <div>
          <div class="csv-mode-title">Replace all data</div>
          <div class="csv-mode-detail">Wipes existing weights, meals, and exercises and uses only the CSV.</div>
        </div>
      </label>
      <label class="csv-mode-option">
        <input type="radio" name="csv-mode" value="merge" checked />
        <div>
          <div class="csv-mode-title">Merge with existing data</div>
          <div class="csv-mode-detail">Adds new rows. Dates that already have meals or exercise are kept as-is; weights get updated.</div>
        </div>
      </label>
    </div>

    <div class="modal-actions">
      <button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary btn-block" id="csv-import-btn" disabled>Import</button>
    </div>`;
  document.getElementById('modal-backdrop').classList.add('open');

  const fileInput = document.getElementById('csv-file-input');
  const pickBtn = document.getElementById('csv-pick-btn');
  const preview = document.getElementById('csv-preview');
  const modeBox = document.getElementById('csv-import-mode');
  const importBtn = document.getElementById('csv-import-btn');
  const templateBtn = document.getElementById('csv-template-btn');

  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  templateBtn.addEventListener('click', downloadCsvTemplate);
  pickBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    pickBtn.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const result = parseCsvText(text);
      if (result.error) {
        preview.style.display = 'block';
        preview.innerHTML = `<div class="csv-preview-error">${escapeAttr(result.error)}</div>`;
        modeBox.style.display = 'none';
        importBtn.disabled = true;
        parsedRows = null;
        return;
      }
      parsedRows = result.rows;
      const nWeights = parsedRows.filter(r => r.weight != null).length;
      const nIn = parsedRows.filter(r => r.caloriesIn != null).length;
      const nOut = parsedRows.filter(r => r.caloriesOut != null).length;
      const dates = parsedRows.map(r => r.date).sort();
      const dateRange = dates.length ? `${dates[0]} → ${dates[dates.length - 1]}` : '—';
      preview.style.display = 'block';
      preview.innerHTML = parsedRows.length === 0
        ? `<div class="csv-preview-error">No valid rows found. Make sure each row has a date.</div>`
        : `<div class="csv-preview-stats">
            <div><strong>${parsedRows.length}</strong> rows · <strong>${dateRange}</strong></div>
            <div class="csv-preview-meta">${nWeights} weights · ${nIn} daily intake · ${nOut} daily exercise</div>
          </div>`;
      modeBox.style.display = parsedRows.length > 0 ? 'flex' : 'none';
      importBtn.disabled = parsedRows.length === 0;
    };
    reader.onerror = () => {
      preview.style.display = 'block';
      preview.innerHTML = `<div class="csv-preview-error">Couldn't read that file. Make sure it's a CSV.</div>`;
      importBtn.disabled = true;
    };
    reader.readAsText(file);
  });

  importBtn.addEventListener('click', () => {
    if (!parsedRows || parsedRows.length === 0) return;
    const mode = (document.querySelector('input[name="csv-mode"]:checked') || {}).value || 'merge';
    if (mode === 'replace' && !confirm(`Replace all existing data with these ${parsedRows.length} rows? This can't be undone.`)) return;
    const summary = applyCsvImport(parsedRows, mode);
    closeModal();
    const parts = [];
    if (summary.weightsAdded) parts.push(`${summary.weightsAdded} weights`);
    if (summary.mealsAdded) parts.push(`${summary.mealsAdded} intake`);
    if (summary.exercisesAdded) parts.push(`${summary.exercisesAdded} exercise`);
    const skipped = summary.mealsSkipped + summary.exercisesSkipped;
    const msg = parts.length ? `Imported: ${parts.join(', ')}` : 'Nothing new imported';
    toast(skipped > 0 ? `${msg} · ${skipped} kept existing` : msg);
    navigate('diary');
  });
}

function importSethSpreadsheet() {
  const newState = {
    user: { name: 'Seth', sex: 'M', age: 40, heightInches: 69, startWeight: 270.9, goalWeight: 220, startDate: '2026-02-09', scalePref: 'manual', activityLevel: 'sedentary', trackerAccuracy: 1.0, targetLossRate: 1.0 },
    weights: [], meals: [], exercises: [], dayNotes: {}, onboarded: true, isDemo: false, importedFrom: 'spreadsheet',
  };
  let mealId = 1, exId = 1000000;
  for (const [date, weight, intake, burn] of SETH_SPREADSHEET_DATA) {
    if (weight) newState.weights.push({ date, weight });
    if (intake) newState.meals.push({ id: mealId++, date, time: '12:00', mealType: 'imported', raw: 'Daily total', items: [{ name: 'Daily total', calories: intake, source: 'imported' }], totalCal: intake, source: 'imported' });
    if (burn && burn > 0) newState.exercises.push({ id: exId++, date, time: '17:00', type: 'other', typeName: 'Daily activity (Fitbit)', typeEmoji: '⌚', duration: 0, caloriesBurned: burn, note: 'Imported from Fitbit OUT', source: 'imported' });
  }
  state = newState;
  saveState();
  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
  clearChatHistory();
  closeModal();
  toast(`Imported ${newState.weights.length} weights, ${newState.meals.length} days intake, ${newState.exercises.length} days exercise.`);
  navigate('diary');
}

/* ===================================================
   ONBOARDING
   =================================================== */
const OB_STEPS = ['welcome', 'weight', 'basics', 'scale', 'plan', 'expectations', 'done'];
const TRACKER_SOURCES = [
  { id: 'none', name: "I don't use one", accuracy: 1.00 },
  { id: 'fitbit', name: 'Fitbit', accuracy: 0.55 },
  { id: 'apple', name: 'Apple Watch', accuracy: 0.75 },
  { id: 'garmin', name: 'Garmin', accuracy: 0.85 },
  { id: 'hrstrap', name: 'Chest-strap HR', accuracy: 0.90 },
  { id: 'gym', name: 'Gym machine', accuracy: 0.55 },
  { id: 'other', name: 'Other / not sure', accuracy: 0.70 },
];

let obState = null;

function defaultObState() {
  return { step: 0, data: { name: '', startWeight: 190, goalWeight: 160, sex: 'F', age: 35, heightFt: 5, heightIn: 6, scalePref: 'smart', activityLevel: 'light', targetLossRate: 1.0, trackerAccuracy: 0.70, foodAccuracy: 0.85 } };
}

function startOnboarding() {
  obState = defaultObState();
  renderOnboarding();
}

function renderOnboarding() {
  let overlay = document.getElementById('onboarding-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.className = 'onboarding-fullscreen';
    document.body.appendChild(overlay);
  }
  const stepName = OB_STEPS[obState.step];
  overlay.innerHTML = `<div class="ob-topbar"><img class="brand-logo ob-logo" src="cc-logo.png" alt="Calorie Correct" /><div class="brand-tag ob-tag">Accurate Tracking. Balanced Living.</div></div><div class="ob-content">${stepName !== 'welcome' && stepName !== 'done' ? renderObProgress() : ''}${renderObStep(stepName)}</div>`;
  wireObStep(stepName);
}

function renderObProgress() {
  const realIdx = obState.step - 1;
  return `<div class="ob-progress">${[0,1,2,3,4].map(i => `<div class="ob-dot ${i < realIdx ? 'done' : i === realIdx ? 'current' : ''}"></div>`).join('')}</div>`;
}

function renderObStep(stepName) {
  const d = obState.data;
  switch (stepName) {
    case 'welcome':
      return `<div class="ob-step"><div class="ob-welcome-mark">Welcome.</div><div class="ob-welcome-tagline">Let's get your numbers set up.</div><div class="ob-welcome-sub">Takes about 90 seconds. No account. Your data stays on your device.</div><div class="ob-buttons"><button class="ob-btn-primary" id="ob-next">Get started</button></div></div>`;
    case 'weight':
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 1 OF 5</div><div class="ob-h1">Where you are, where you want to be.</div><div class="ob-sub">No judgment. Just numbers we'll work with.</div>
        <div class="ob-weight-card"><div class="ob-weight-label">Current weight</div><div class="ob-weight-row"><input type="number" class="ob-weight-input" id="ob-current-weight" value="${d.startWeight}" min="50" max="500" step="0.1" /><span class="ob-weight-unit">lbs</span></div></div>
        <div class="ob-weight-card goal"><div class="ob-weight-label">Goal weight</div><div class="ob-weight-row"><input type="number" class="ob-weight-input" id="ob-goal-weight" value="${d.goalWeight}" min="50" max="500" step="0.1" /><span class="ob-weight-unit">lbs</span></div><div class="ob-delta" id="ob-delta">${formatGoalDelta(d.startWeight, d.goalWeight)}</div></div>
        <div class="ob-buttons"><button class="ob-btn-secondary" id="ob-prev">Back</button><button class="ob-btn-primary" id="ob-next">Continue</button></div></div>`;
    case 'basics':
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 2 OF 5</div><div class="ob-h1">A few basics for the math.</div><div class="ob-sub">Initial estimate. Calibration improves over time.</div>
        <div class="ob-basics-grid"><div class="ob-field"><div class="ob-field-label">Sex</div><select class="ob-select" id="ob-sex"><option value="F" ${d.sex === 'F' ? 'selected' : ''}>Female</option><option value="M" ${d.sex === 'M' ? 'selected' : ''}>Male</option></select></div><div class="ob-field"><div class="ob-field-label">Age</div><input type="number" class="ob-input" id="ob-age" value="${d.age}" min="18" max="100" /></div></div>
        <div class="ob-field"><div class="ob-field-label">Height</div><div class="ob-height-row"><div class="ob-height-field"><input type="number" class="ob-input" id="ob-height-ft" value="${d.heightFt}" min="3" max="8" /></div><div class="ob-height-unit">ft</div><div class="ob-height-field"><input type="number" class="ob-input" id="ob-height-in" value="${d.heightIn}" min="0" max="11" /></div><div class="ob-height-unit">in</div></div></div>
        <div class="ob-field" style="margin-top: 12px;"><div class="ob-field-label">Activity level</div><select class="ob-select" id="ob-activity" style="font-size: 16px; padding: 4px 0;">${ACTIVITY_LEVELS.map(a => `<option value="${a.id}" ${(d.activityLevel || 'light') === a.id ? 'selected' : ''}>${a.name} — ${a.detail}</option>`).join('')}</select></div>
        <div class="ob-buttons"><button class="ob-btn-secondary" id="ob-prev">Back</button><button class="ob-btn-primary" id="ob-next">Continue</button></div></div>`;
    case 'scale':
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 3 OF 5</div><div class="ob-h1">How will you weigh in?</div><div class="ob-sub">Weight is our ground truth.</div>
        <button class="ob-option ${d.scalePref === 'smart' ? 'selected' : ''}" data-scale="smart"><div class="ob-radio"><div class="ob-radio-inner"></div></div><div><div class="ob-option-h">I have a smart scale</div><div class="ob-option-body">Withings, Renpho, Apple Health, Fitbit.</div></div></button>
        <button class="ob-option ${d.scalePref === 'manual' ? 'selected' : ''}" data-scale="manual"><div class="ob-radio"><div class="ob-radio-inner"></div></div><div><div class="ob-option-h">I'll weigh in manually</div><div class="ob-option-body">Regular bathroom scale.</div></div></button>
        <button class="ob-option ${d.scalePref === 'none' ? 'selected' : ''}" data-scale="none"><div class="ob-radio"><div class="ob-radio-inner"></div></div><div><div class="ob-option-h">I don't have a scale yet</div><div class="ob-option-body">No problem.</div></div></button>
        <div class="ob-buttons"><button class="ob-btn-secondary" id="ob-prev">Back</button><button class="ob-btn-primary" id="ob-next">Continue</button></div></div>`;
    case 'plan':
      const rate = d.targetLossRate != null ? d.targetLossRate : 1.0;
      const ratePct = Math.round(rate * 100);
      const rateLabel = rate === 0 ? 'Maintenance' : rate < 0.6 ? 'Gentle' : rate < 1.2 ? 'Standard' : rate < 1.7 ? 'Aggressive' : 'Very aggressive';
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 4 OF 5</div><div class="ob-h1">Your loss plan.</div><div class="ob-sub">How fast you want to lose. You can adjust this anytime.</div>
        <div class="ob-field"><div class="ob-field-label">Target loss rate</div><div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;"><input type="range" id="ob-rate" min="0" max="200" step="25" value="${ratePct}" style="flex: 1;" /><div style="font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--primary-dark); min-width: 130px; text-align: right;" id="ob-rate-val">${rate.toFixed(2)} <span style="font-size: 12px; color: var(--muted); font-family: var(--sans); font-weight: 600;">lb/wk</span></div></div><div style="margin-top: 8px; font-size: 12px; color: var(--muted); display: flex; justify-content: space-between;"><span>Maintenance</span><span style="color: var(--primary-dark); font-weight: 700;" id="ob-rate-label">${rateLabel}</span><span>2.0 lb/wk</span></div></div>
        <div class="ob-buttons"><button class="ob-btn-secondary" id="ob-prev">Back</button><button class="ob-btn-primary" id="ob-next">Continue</button></div></div>`;
    case 'expectations':
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 5 OF 5 · WHAT TO EXPECT</div><div class="ob-h1">Calorie Correct works on weeks, not days.</div><div class="ob-sub">A few weeks before the math is meaningful.</div>
        <div class="ob-timeline">
          <div class="ob-timeline-item"><div class="ob-timeline-week">Week 1</div><div class="ob-timeline-body"><div class="ob-timeline-title">Get used to logging.</div><div class="ob-timeline-desc">Don't worry about being perfect.</div></div></div>
          <div class="ob-timeline-item"><div class="ob-timeline-week">Week 2</div><div class="ob-timeline-body"><div class="ob-timeline-title">First calibration.</div><div class="ob-timeline-desc">Your first Sunday insight.</div></div></div>
          <div class="ob-timeline-item"><div class="ob-timeline-week">Weeks 3–4</div><div class="ob-timeline-body"><div class="ob-timeline-title">Your numbers dial in.</div><div class="ob-timeline-desc">Daily target adjusts to actual metabolism.</div></div></div>
          <div class="ob-timeline-item"><div class="ob-timeline-week">Beyond</div><div class="ob-timeline-body"><div class="ob-timeline-title">Steady, honest progress.</div><div class="ob-timeline-desc">No drama, no gimmicks.</div></div></div>
        </div>
        <div class="ob-quote">"The scale will lie to you daily and tell you the truth weekly. We work on the truth."</div>
        <div class="ob-buttons"><button class="ob-btn-secondary" id="ob-prev">Back</button><button class="ob-btn-primary" id="ob-next">I'm in</button></div></div>`;
    case 'done':
      const totalH = d.heightFt * 12 + d.heightIn;
      const tempUser = { sex: d.sex, age: d.age, heightInches: totalH };
      const initTDEE = Math.round(mifflinStJeor(tempUser, d.startWeight) * getActivityMultiplier(d.activityLevel || 'light'));
      const targetDeficit = ((d.targetLossRate || 1.0) * 3500) / 7;
      const initTarget = Math.round((initTDEE - targetDeficit) / 50) * 50;
      const firstCal = new Date();
      firstCal.setDate(firstCal.getDate() + 14);
      return `<div class="ob-step"><div class="ob-check"><svg viewBox="0 0 24 24"><polyline points="5 13 10 18 20 7"/></svg></div><div class="ob-h1">You're ready.</div><div class="ob-sub">Here's what we've got.</div>
        <div class="ob-summary">
          <div class="ob-summary-row"><span class="lbl">Starting weight</span><span class="val">${d.startWeight} lb</span></div>
          <div class="ob-summary-row"><span class="lbl">Goal weight</span><span class="val">${d.goalWeight} lb</span></div>
          <div class="ob-summary-row"><span class="lbl">Starting target</span><span class="val">${initTarget.toLocaleString()} cal/day</span></div>
          <div class="ob-summary-row"><span class="lbl">First calibration</span><span class="val">~${firstCal.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
        </div>
        <div class="ob-buttons"><button class="ob-btn-primary" id="ob-finish">Open Calorie Correct</button></div></div>`;
  }
  return '';
}

function wireObStep(stepName) {
  const nextBtn = document.getElementById('ob-next');
  const prevBtn = document.getElementById('ob-prev');
  const finishBtn = document.getElementById('ob-finish');
  if (nextBtn) nextBtn.addEventListener('click', obNext);
  if (prevBtn) prevBtn.addEventListener('click', obPrev);
  if (finishBtn) finishBtn.addEventListener('click', completeOnboarding);
  if (stepName === 'weight') {
    const cw = document.getElementById('ob-current-weight');
    const gw = document.getElementById('ob-goal-weight');
    const updateDelta = () => { const c = parseFloat(cw.value), g = parseFloat(gw.value); if (!isNaN(c) && !isNaN(g)) document.getElementById('ob-delta').textContent = formatGoalDelta(c, g); };
    cw.addEventListener('input', updateDelta);
    gw.addEventListener('input', updateDelta);
  }
  if (stepName === 'scale') {
    document.querySelectorAll('[data-scale]').forEach(btn => btn.addEventListener('click', (e) => { obState.data.scalePref = e.currentTarget.dataset.scale; renderOnboarding(); }));
  }
  if (stepName === 'plan') {
    const slider = document.getElementById('ob-rate');
    const val = document.getElementById('ob-rate-val');
    const lbl = document.getElementById('ob-rate-label');
    const labelFor = (r) => r === 0 ? 'Maintenance' : r < 0.6 ? 'Gentle' : r < 1.2 ? 'Standard' : r < 1.7 ? 'Aggressive' : 'Very aggressive';
    slider.addEventListener('input', (e) => { const r = parseInt(e.target.value) / 100; val.innerHTML = `${r.toFixed(2)} <span style="font-size: 12px; color: var(--muted); font-family: var(--sans); font-weight: 600;">lb/wk</span>`; lbl.textContent = labelFor(r); });
  }
  document.addEventListener('keydown', obKeyHandler);
}

function obKeyHandler(e) {
  if (!document.getElementById('onboarding-overlay')) { document.removeEventListener('keydown', obKeyHandler); return; }
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    const nextBtn = document.getElementById('ob-next') || document.getElementById('ob-finish');
    if (nextBtn) { e.preventDefault(); nextBtn.click(); }
  }
}

function obNext() {
  const stepName = OB_STEPS[obState.step];
  if (stepName === 'weight') {
    const cw = parseFloat(document.getElementById('ob-current-weight').value);
    const gw = parseFloat(document.getElementById('ob-goal-weight').value);
    if (isNaN(cw) || cw < 50 || cw > 500) return alert('Current weight 50–500 lb');
    if (isNaN(gw) || gw < 50 || gw > 500) return alert('Goal weight 50–500 lb');
    obState.data.startWeight = cw;
    obState.data.goalWeight = gw;
  }
  if (stepName === 'basics') {
    obState.data.sex = document.getElementById('ob-sex').value;
    obState.data.age = parseInt(document.getElementById('ob-age').value) || 35;
    obState.data.heightFt = parseInt(document.getElementById('ob-height-ft').value) || 5;
    obState.data.heightIn = parseInt(document.getElementById('ob-height-in').value) || 6;
    const aEl = document.getElementById('ob-activity');
    if (aEl) obState.data.activityLevel = aEl.value;
  }
  if (stepName === 'plan') {
    const sl = document.getElementById('ob-rate');
    if (sl) obState.data.targetLossRate = parseInt(sl.value) / 100;
  }
  if (obState.step < OB_STEPS.length - 1) { obState.step++; renderOnboarding(); }
}

function obPrev() {
  if (obState.step > 0) { obState.step--; renderOnboarding(); }
}

function formatGoalDelta(startW, goalW) {
  const delta = startW - goalW;
  if (Math.abs(delta) < 0.5) return 'Maintain mode';
  const lbsToGo = Math.abs(delta).toFixed(1);
  const direction = delta > 0 ? 'to lose' : 'to gain';
  const weeks = Math.round(Math.abs(delta) / 0.9);
  const months = Math.round(weeks / 4.3);
  const timeText = months >= 2 ? `~${months} months` : `~${weeks} weeks`;
  return `${lbsToGo} lbs ${direction} · ${timeText} at a healthy pace`;
}

function completeOnboarding() {
  const d = obState.data;
  const today = formatDateISO(new Date());
  state = {
    user: { name: d.name || 'You', sex: d.sex, age: d.age, heightInches: d.heightFt * 12 + d.heightIn, startWeight: d.startWeight, goalWeight: d.goalWeight, startDate: today, scalePref: d.scalePref, activityLevel: d.activityLevel || 'light', trackerAccuracy: d.trackerAccuracy != null ? d.trackerAccuracy : 0.70, foodAccuracy: d.foodAccuracy != null ? d.foodAccuracy : 0.85, targetLossRate: d.targetLossRate != null ? d.targetLossRate : 1.0 },
    weights: [{ date: today, weight: d.startWeight }],
    meals: [], exercises: [], dayNotes: {}, recipes: [], water: [], onboarded: true, isDemo: false,
  };
  saveState();
  clearChatHistory();
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.remove();
  document.removeEventListener('keydown', obKeyHandler);
  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
  toast('Welcome to Calorie Correct.');
  navigate('diary');
}

/* ===================================================
   INIT
   =================================================== */
function init() {
  state = loadState();
  chatHistory = loadChatHistory(); // restore today's chat across reloads

  // Register service worker so the app is installable as a PWA. Only in
  // production (https). Service worker handles offline asset caching;
  // API calls always pass through to network.
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/app/service-worker.js').catch(() => {
      // SW registration failed — not fatal, app still works
    });
  }

  document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.view)));
  document.getElementById('weighin-btn').addEventListener('click', openWeighIn);
  document.getElementById('profile-btn').addEventListener('click', openSettings);

  // Mobile nav — hamburger opens drawer, drawer tabs swap content
  wireMobileTabBar();
  wireHamburger();
  applyMobileTab(getMobileTab());

  // Mobile chat — collapse/expand via FAB and × button
  wireChatCollapseToggle();
  applyChatExpanded(isChatExpanded());

  // PWA install prompt — fires once user has used the app a bit
  setupInstallPrompt();

  document.getElementById('modal-backdrop').addEventListener('click', (e) => { if (e.target.id === 'modal-backdrop') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  if (!state) {
    state = makeBlankState();
    document.getElementById('user-name').textContent = state.user.name;
    document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
    navigate('diary');
    startOnboarding();
    return;
  }

  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
  navigate('diary');

  const params = new URLSearchParams(window.location.search);
  if (params.get('onboard') === '1') {
    if (state.isDemo) startOnboarding();
    else toast(`Already set up. Go to Settings → Start fresh to redo this.`);
    if (window.history.replaceState) window.history.replaceState({}, '', window.location.pathname);
  }
}

document.addEventListener('DOMContentLoaded', init);

})();
