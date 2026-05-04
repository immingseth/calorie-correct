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
      trackerAccuracy: 1.0,
      targetLossRate: 1.0,
    },
    weights: [], meals: [], exercises: [], dayNotes: {},
    onboarded: false,
  };
}

function restoreFromBackup() {
  const backup = localStorage.getItem(STORAGE_BACKUP_KEY);
  if (!backup) return false;
  try {
    state = migrateState(JSON.parse(backup));
    localStorage.setItem(STORAGE_KEY, backup);
    return true;
  } catch (e) {
    return false;
  }
}

// Forward-compat: ensure new fields exist on old saved state
function migrateState(s) {
  if (!s.exercises) s.exercises = [];
  if (!s.user.activityLevel) s.user.activityLevel = 'light';
  if (s.user.trackerAccuracy == null) s.user.trackerAccuracy = 1.0;
  if (s.user.targetLossRate == null) s.user.targetLossRate = 1.0; // lb/week
  if (!s.dayNotes) s.dayNotes = {}; // map of dateISO → note text
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
      trackerAccuracy: 1.0,
      targetLossRate: 1.0,
    },
    weights: [{ date: todayISO(), weight: profile.startWeight }],
    meals: [],
    exercises: [],
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
      name: 'Sarah',
      sex: 'F',
      age: 38,
      heightInches: 65,
      startWeight: startW,
      goalWeight: 155,
      startDate: startISO,
      activityLevel: 'light',
      trackerAccuracy: 1.0,
      targetLossRate: 1.0,
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
let currentView = 'today';
const VIEW_RENDERERS = {};

function navigate(view) {
  const isSameView = view === currentView;
  const prevScroll = isSameView ? window.scrollY : 0;
  currentView = view;
  document.querySelectorAll('[data-view]').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  const container = document.getElementById('view-container');
  container.innerHTML = '';
  const renderer = VIEW_RENDERERS[view];
  if (renderer) renderer(container);
  if (isSameView) window.scrollTo(0, prevScroll); else window.scrollTo(0, 0);
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
}

/* ===================================================
   VIEW: TODAY
   =================================================== */
let todayLogTab = 'describe';
let todayParseDraft = null;

VIEW_RENDERERS.today = function (c) {
  const today = todayISO();
  const target = getDailyTarget(state);
  const consumed = getDailyCalories(state, today);
  const remaining = target - consumed;
  const pct = Math.max(0, Math.min(1, consumed / target));
  const meals = getMealsForDate(state, today);
  const currentW = getCurrentWeight(state);
  const startW = state.user.startWeight;
  const totalLoss = startW - currentW;
  const cal = getCalibration(state);
  const rate7 = get7dRate(state);
  const progress = getGoalProgress(state);
  const rateStat = rateStatus(rate7);
  const todaysBurnRaw = getDailyExerciseBurn(state, today);
  const trackerAcc = state.user.trackerAccuracy != null ? state.user.trackerAccuracy : 1.0;
  const todaysBurnAdj = Math.round(todaysBurnRaw * trackerAcc);
  const todaysNet = consumed - todaysBurnAdj;
  const netVsTarget = todaysNet - target;
  const netStat = consumed === 0 ? '' : netVsTarget <= 0 ? 'good' : netVsTarget < 200 ? 'warn' : 'bad';
  const circumference = 2 * Math.PI * 90;

  c.innerHTML = `
    <div class="view-header">
      <div class="view-eyebrow">${formatHumanDate(today).toUpperCase()}</div>
      <div class="view-title">Good morning, ${state.user.name}.</div>
    </div>
    <div class="stat-row">
      <div class="stat-card dark">
        <div class="stat-label">Current Weight</div>
        <div class="stat-value">${currentW.toFixed(1)}<span class="unit">lb</span></div>
        <div class="stat-detail">${state.weights.length > 1 ? formatHumanDate(state.weights[state.weights.length - 1].date) : 'starting line'}</div>
      </div>
      <div class="stat-card ${totalLoss > 0 ? 'good' : ''}">
        <div class="stat-label">Total Change</div>
        <div class="stat-value">${totalLoss >= 0 ? '−' : '+'}${Math.abs(totalLoss).toFixed(1)}<span class="unit">lb</span></div>
        <div class="stat-detail">${state.weights.length > 1 ? `over ${daysBetween(state.weights[0].date, state.weights[state.weights.length - 1].date)} days` : 'no data yet'}</div>
      </div>
      <div class="stat-card ${rateStat}">
        <div class="stat-label">7-Day Rate</div>
        <div class="stat-value">${rate7 == null ? '—' : (rate7 >= 0 ? '−' : '+') + Math.abs(rate7).toFixed(2)}<span class="unit">lb/wk</span></div>
        <div class="stat-detail">${rate7 == null ? 'need 4+ weight entries' : 'target: 0.5–2 lb/wk loss'}</div>
      </div>
      <div class="stat-card ${netStat}">
        <div class="stat-label">Net Today</div>
        <div class="stat-value">${consumed === 0 ? '—' : todaysNet.toLocaleString()}<span class="unit">cal</span></div>
        <div class="stat-detail">${consumed === 0 ? 'no intake logged yet' : todaysBurnAdj > 0 ? `${consumed.toLocaleString()} in − ${todaysBurnAdj.toLocaleString()} burned · target ${target.toLocaleString()}` : `target ${target.toLocaleString()} · log activity to see net`}</div>
      </div>
    </div>
    ${renderProgressCard(progress)}
    ${renderPlateauBanner(state)}
    <div class="today-grid">
      <div>
        <div class="ring-card">
          <div class="ring-svg-wrap">
            <svg class="ring-svg" viewBox="0 0 200 200">
              <circle class="ring-bg" cx="100" cy="100" r="90"/>
              <circle class="ring-fg" cx="100" cy="100" r="90" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - pct)}"/>
            </svg>
            <div class="ring-center">
              <div class="ring-num">${remaining > 0 ? remaining.toLocaleString() : 0}</div>
              <div class="ring-label">${remaining >= 0 ? 'CAL LEFT' : 'OVER BY ' + Math.abs(remaining)}</div>
            </div>
          </div>
          <div class="ring-budget"><strong>${consumed.toLocaleString()}</strong> of <strong>${target.toLocaleString()}</strong> logged today</div>
          <div class="ring-target-meta">Target ${cal.ready ? 'calibrated to your trend' : 'using starting estimate'}</div>
          ${todaysBurnRaw > 0 ? `<div class="ring-exercise-line">+${todaysBurnRaw} cal burned today · ${getExercisesForDate(state, today).length} ${getExercisesForDate(state, today).length === 1 ? 'activity' : 'activities'}</div>` : ''}
        </div>
      </div>
      <div>
        <div class="card">
          <div class="section-h">Today's meals</div>
          <div class="meal-list">
            ${meals.length ? meals.map(m => `
              <div class="meal-item clickable" data-meal-id="${m.id}">
                <div class="meal-time">${formatTime12(m.time)}</div>
                <div class="meal-body">
                  <div class="meal-name">${m.items.map(i => i.name).join(', ')}</div>
                  <div class="meal-detail">${m.mealType} · ${m.source === 'ai' ? 'parsed from text' : m.source}</div>
                </div>
                <div class="meal-cal">${m.totalCal}</div>
              </div>
            `).join('') : '<div style="text-align: center; padding: 20px 0; color: var(--muted); font-size: 14px;">Nothing logged yet today.</div>'}
          </div>
          ${renderTodayLogger()}
        </div>
        ${(() => {
          const todaysExercises = getExercisesForDate(state, today);
          if (todaysExercises.length === 0) {
            return `<div class="activity-card"><div class="section-h">Today's activity</div><div class="meal-empty" id="add-exercise-shortcut"><span>+ Log activity</span></div></div>`;
          }
          return `<div class="activity-card"><div class="section-h">Today's activity</div>${todaysExercises.map(e => `
            <div class="exercise-item clickable" data-exercise-id="${e.id}">
              <div class="exercise-emoji">${e.typeEmoji || '💪'}</div>
              <div class="exercise-body">
                <div class="exercise-name">${e.typeName || e.type}</div>
                <div class="exercise-detail">${e.duration > 0 ? formatTime12(e.time) + ' · ' + e.duration + ' min' : 'tracker daily total'}${e.note ? ' · ' + e.note : ''}</div>
              </div>
              <div class="exercise-burn">+${e.caloriesBurned}</div>
            </div>`).join('')}<div class="meal-empty" id="add-exercise-shortcut" style="margin-top: 8px;"><span>+ Log activity</span></div></div>`;
        })()}
      </div>
    </div>`;

  c.querySelectorAll('[data-meal-id]').forEach(el => el.addEventListener('click', () => openMealEdit(parseInt(el.dataset.mealId))));
  c.querySelectorAll('[data-exercise-id]').forEach(el => el.addEventListener('click', () => openExerciseEdit(parseInt(el.dataset.exerciseId))));
  const addEx = document.getElementById('add-exercise-shortcut');
  if (addEx) addEx.addEventListener('click', () => openExerciseAdd());
  wireTodayLogger();
};

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

function renderPlateauBanner(s) {
  const p = getPlateauStatus(s);
  if (!p) return '';
  return `<div class="plateau-banner">
    <div class="plateau-eyebrow">PATTERN · LAST ${p.daysFlat} DAYS</div>
    <div class="plateau-body">Your weight trend has been essentially flat (<strong>${p.ratePerWk >= 0 ? '+' : '−'}${Math.abs(p.ratePerWk).toFixed(2)} lb/wk</strong>) for the last ${p.daysFlat} days. This is normal and doesn't mean anything is broken.<br><br><strong>If you want to start losing again, two paths:</strong> tighten your tracking, or lower your daily target by 100–150 cal.</div>
  </div>`;
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
    ${todayLogTab === 'describe' ? `
      <div style="display: flex; gap: 8px;">
        <input class="input" id="today-log-input" placeholder="e.g. turkey sandwich and an apple" ${showParseResult ? 'disabled' : ''} />
        <button class="btn btn-primary btn-sm" id="today-parse-btn" ${showParseResult ? 'disabled' : ''}>Parse</button>
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
    <div class="parsed-actions"><button class="btn btn-primary btn-block" id="today-parse-save">Save</button><button class="btn btn-secondary" id="today-parse-cancel">Cancel</button></div>
  </div>`;
}

function wireTodayLogger() {
  document.querySelectorAll('[data-today-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => { todayLogTab = e.currentTarget.dataset.todayTab; todayParseDraft = null; navigate(currentView); });
  });
  if (todayLogTab === 'describe') {
    if (!todayParseDraft) {
      const inp = document.getElementById('today-log-input');
      const btn = document.getElementById('today-parse-btn');
      const handleParse = () => {
        const text = inp.value.trim(); if (!text) return;
        const items = parseMealText(text); if (!items.length) return;
        const now = new Date();
        todayParseDraft = { text, items, mealType: guessMealType(now.getHours()) };
        navigate(currentView);
      };
      btn.addEventListener('click', handleParse);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleParse(); });
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
      const meal = { id: Date.now(), date: todayISO(), time, mealType, raw: label, items: [{ name: label, calories: cal, source: 'manual' }], totalCal: cal, source: 'manual' };
      state.meals.push(meal);
      recordAction({ type: 'create-meal', meal });
      saveState();
      toast(`Logged ${cal} cal`, { undo: true });
      navigate('today');
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
  const meal = { id: Date.now(), date: todayISO(), time, mealType: todayParseDraft.mealType, raw: todayParseDraft.text, items: todayParseDraft.items, totalCal, source: 'ai' };
  state.meals.push(meal);
  recordAction({ type: 'create-meal', meal });
  saveState();
  todayParseDraft = null;
  toast(`Logged ${totalCal} cal to ${meal.mealType}`, { undo: true });
  navigate('today');
}

/* ===================================================
   VIEW: TREND
   =================================================== */
let trendChart = null, caloriesBarChart = null, exerciseBarChart = null;
let trendRange = 90, weightLogShowAll = false;

VIEW_RENDERERS.trend = function (c) {
  const cal = getCalibration(state);
  const startW = state.user.startWeight;
  const currentW = getCurrentWeight(state);
  const totalLoss = startW - currentW;
  const days = state.weights.length > 1 ? daysBetween(state.weights[0].date, state.weights[state.weights.length - 1].date) : 0;
  const progress = getGoalProgress(state);

  c.innerHTML = `
    <div class="view-header">
      <div class="view-eyebrow">YOUR TREND</div>
      <div class="trend-headline">
        <div class="trend-bignum ${totalLoss < 0 ? 'gain' : ''}">${totalLoss >= 0 ? '−' : '+'}${Math.abs(totalLoss).toFixed(1)} lbs</div>
        <div class="trend-bignum-label">since you started, ${days} days ago</div>
      </div>
    </div>
    ${renderProgressCard(progress)}
    ${renderPlateauBanner(state)}
    <div class="chart-card">
      <div class="date-range-row">
        <div class="bar-chart-legend">
          <span><span class="swatch" style="background:var(--primary)"></span>Daily</span>
          <span><span class="swatch" style="background:var(--primary-dark)"></span>7-day average</span>
          <span><span class="swatch" style="background:var(--accent)"></span>Predicted from logging</span>
          <span><span class="swatch" style="background:var(--muted-soft)"></span>Goal</span>
        </div>
        <div class="date-range-tabs" id="trend-range-tabs">
          <button class="date-range-tab ${trendRange === 7 ? 'active' : ''}" data-range="7">7D</button>
          <button class="date-range-tab ${trendRange === 30 ? 'active' : ''}" data-range="30">30D</button>
          <button class="date-range-tab ${trendRange === 90 ? 'active' : ''}" data-range="90">90D</button>
          <button class="date-range-tab ${trendRange === 0 ? 'active' : ''}" data-range="0">ALL</button>
        </div>
      </div>
      <div class="chart-canvas-wrap"><canvas id="trend-chart"></canvas></div>
    </div>
    ${renderCalorieBarCard(state)}
    ${renderExerciseBarCard(state)}
    ${cal.ready ? `
      <div class="calibration-card">
        <div class="calibration-eyebrow">CALIBRATION</div>
        <div class="calibration-body">${renderCalibrationCopy(cal, currentW, totalLoss)}</div>
        <div class="calibration-footer">Nothing to fix. We just calibrate every Sunday. <a href="#" id="methodology-link" style="color: var(--primary); font-style: normal; text-decoration: underline; font-weight: 600;">How this is calculated →</a></div>
      </div>
      <div class="tdee-row">
        <div class="tdee-stat"><div class="num">${(totalLoss / Math.max(1, days/7)).toFixed(2)}</div><div class="lbl">Avg loss / wk (lb)</div></div>
        <div class="tdee-stat"><div class="num">${cal.realTDEE.toLocaleString()}</div><div class="lbl">Real TDEE${cal.exerciseTracked ? ' · with exercise' : ''}</div></div>
        <div class="tdee-stat"><div class="num">${cal.dailyTarget.toLocaleString()}</div><div class="lbl">Daily target</div></div>
        <div class="tdee-stat"><div class="num">${cal.trackingAccuracy != null ? Math.round(cal.trackingAccuracy * 100) + '%' : '—'}</div><div class="lbl">Tracking accuracy</div></div>
      </div>
    ` : `<div class="calibration-card"><div class="calibration-eyebrow">CALIBRATION · BUILDING DATA</div><div class="calibration-body">We need at least 7 days of weight + meal data to start calibrating. Keep logging.</div></div>`}
    ${renderWeightLogCard(state)}`;

  c.querySelectorAll('[data-range]').forEach(btn => btn.addEventListener('click', (e) => { trendRange = parseInt(e.currentTarget.dataset.range); navigate(currentView); }));
  c.querySelectorAll('[data-weight-date]').forEach(row => row.addEventListener('click', () => openDayDetail(row.dataset.weightDate)));
  const methLink = document.getElementById('methodology-link');
  if (methLink) methLink.addEventListener('click', (e) => { e.preventDefault(); navigate('methodology'); });
  const toggleBtn = document.getElementById('weight-log-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', () => { weightLogShowAll = !weightLogShowAll; navigate(currentView); });

  setTimeout(() => {
    renderTrendChart(state, cal, trendRange);
    renderCalorieBarChart(state, getAdherenceMetrics(state), trendRange);
    renderExerciseBarChart(state, trendRange);
  }, 10);
};

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
      { label: 'Daily', data: rawData, borderColor: 'rgba(92, 122, 107, 0.30)', pointBackgroundColor: '#5C7A6B', pointRadius: 2.5, borderWidth: 1.2, fill: false, order: 3 },
      { label: '7-day avg', data: smoothedData, borderColor: '#4A6354', backgroundColor: 'rgba(74, 99, 84, 0.05)', borderWidth: 3, tension: 0.3, pointRadius: 0, fill: true, order: 1 },
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
    else colors.push('#5C7A6B');
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

/* ===================================================
   VIEW: INSIGHTS
   =================================================== */
VIEW_RENDERERS.insights = function (c) {
  const insight = generateWeeklyInsight(state);
  const adherence = getAdherenceMetrics(state);
  c.innerHTML = `
    <div class="view-header">
      <div class="view-eyebrow">INSIGHTS · WEEKLY · ${insight.dateRange}</div>
      <div class="view-title">${insight.title}</div>
      <div class="view-sub">${insight.thin ? 'Building your weekly view — log a few more days.' : 'Generated Sunday morning. Reading time: about a minute.'}</div>
    </div>
    <div class="insight-card-lg">
      <div class="insight-prose">${insight.body}</div>
      ${!insight.thin ? `<div class="insight-divider"></div><div class="insight-stat-row"><div class="tdee-stat"><div class="num">${insight.stats.weightDelta >= 0 ? '+' : '−'}${Math.abs(insight.stats.weightDelta).toFixed(1)}</div><div class="lbl">Weight Δ (lb)</div></div><div class="tdee-stat"><div class="num">${insight.stats.avgCal.toLocaleString()}</div><div class="lbl">Avg cal/day</div></div><div class="tdee-stat"><div class="num">${insight.stats.daysLogged}/7</div><div class="lbl">Days logged</div></div></div>` : ''}
    </div>
    ${adherence ? renderAdherenceCards(adherence) : ''}
    ${renderComparePeriodsCard(state)}
    ${renderWeekdayPatternCard(state)}
    <div class="insight-archive"><div class="section-h">Earlier weeks</div>${renderInsightArchive(state)}</div>`;
};

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
VIEW_RENDERERS.coach = function (c) {
  c.innerHTML = `
    <div class="view-header">
      <div class="view-eyebrow">COACH</div>
      <div class="view-title">Ask anything.</div>
      <div class="view-sub">Plain talk about weight loss, plateaus, social events, restaurants, the math behind your numbers.</div>
    </div>
    <div class="insight-card-lg" style="text-align: center; padding: 56px 40px;">
      <div style="width: 72px; height: 72px; background: var(--primary-soft); color: var(--primary-dark); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 30px; font-weight: 700; margin-bottom: 24px;">CC</div>
      <div style="font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; margin-bottom: 14px;">Coach is coming online soon.</div>
      <div style="font-size: 15px; color: var(--muted); line-height: 1.6; max-width: 480px; margin: 0 auto 24px;">The coach will be powered by Claude — the same AI that built this app — and will know your data, your trend, your calibration, and your goal.</div>
      <div style="font-size: 13.5px; color: var(--muted); line-height: 1.6; max-width: 460px; margin: 0 auto; font-style: italic;">Coming with the backend phase. For now, your weekly Sunday Insight on the Insights tab covers most of what a coach would tell you.</div>
    </div>`;
};

/* ===================================================
   VIEW: METHODOLOGY
   =================================================== */
VIEW_RENDERERS.methodology = function (c) {
  c.innerHTML = `
    <div class="view-header">
      <div class="view-eyebrow">METHODOLOGY</div>
      <div class="view-title">How the math works.</div>
      <div class="view-sub">Calorie Correct uses your weight trend to back-calculate what your tracking is actually doing. Here's the math, in plain language.</div>
    </div>
    <div class="insight-card-lg">
      <div class="insight-prose">
        <h3 style="font-family: var(--serif); font-size: 22px; color: var(--primary-dark); margin-bottom: 12px;">The core idea</h3>
        <p>Energy balance is settled physics. The hard part is getting accurate numbers. Most apps trust your logging blindly. Calorie Correct treats your <strong>actual weight change</strong> as ground truth and uses it to figure out what your real intake and metabolism must be.</p>
        <div class="insight-divider"></div>
        <h3 style="font-family: var(--serif); font-size: 22px; color: var(--primary-dark); margin-bottom: 12px;">The calibration loop</h3>
        <p>For each day: <strong>predicted_deficit</strong> = (BMR × 1.2) + (logged_burn × tracker_accuracy) − logged_intake. Sum daily deficits ÷ 3,500 = predicted weight loss. Compare to actual loss → tracking gap.</p>
        <div class="insight-divider"></div>
        <h3 style="font-family: var(--serif); font-size: 22px; color: var(--primary-dark); margin-bottom: 12px;">Real TDEE</h3>
        <p>Real TDEE = real_intake + (actual_loss × 3,500 ÷ days). Textbook BMR is off by 10-15% for any given person. Real TDEE comes from your actual data.</p>
        <div class="insight-divider"></div>
        <h3 style="font-family: var(--serif); font-size: 22px; color: var(--primary-dark); margin-bottom: 12px;">Tracker accuracy multiplier</h3>
        <p>Trackers overestimate. Apply a haircut: chest-strap HR ~85-95%, Apple Watch ~70-80%, Fitbit ~50-70%, gym machines ~50-70%. After 14 days, we'll suggest a value based on your data.</p>
        <div class="insight-divider"></div>
        <h3 style="font-family: var(--serif); font-size: 22px; color: var(--primary-dark); margin-bottom: 12px;">Honest limitations</h3>
        <p>Combined tracking error — can't separate intake under-counting from burn over-counting. Most users have some of each. Weight has noise — daily fluctuations of 2-4 lbs are normal. Need ~2 weeks of data before math is useful.</p>
      </div>
    </div>`;
};

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
  const draft = { type: 'walking', duration: 30, caloriesBurned: estimateExerciseCalories('walking', 30, getCurrentWeight(state)) };
  let userOverride = false;
  const modal = document.getElementById('modal');
  modal.innerHTML = `<div class="modal-h">Log activity</div><div class="modal-sub">Logged exercise feeds into your weekly calibration.</div>
    <div class="form-row"><div class="form-label">Activity</div><select class="form-select" id="addex-type">${EXERCISE_TYPES.map(t => `<option value="${t.id}" ${draft.type === t.id ? 'selected' : ''}>${t.emoji} ${t.name}</option>`).join('')}</select></div>
    <div class="form-row form-row-2"><div><div class="form-label">Duration (min)</div><input class="form-input" type="number" id="addex-duration" value="${draft.duration}" min="1" max="600" /></div><div><div class="form-label">Calories burned</div><input class="form-input" type="number" id="addex-calories" value="${draft.caloriesBurned}" min="0" max="3000" /></div></div>
    <div class="form-row"><div class="form-label">Note</div><input class="form-input" type="text" id="addex-note" placeholder="Optional" /></div>
    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button><button class="btn btn-primary btn-block" id="addex-save">Log activity</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  const typeEl = document.getElementById('addex-type'), durEl = document.getElementById('addex-duration'), calEl = document.getElementById('addex-calories');
  const recompute = () => { if (userOverride) return; calEl.value = estimateExerciseCalories(typeEl.value, parseInt(durEl.value) || 0, getCurrentWeight(state)); };
  typeEl.addEventListener('change', recompute);
  durEl.addEventListener('input', recompute);
  calEl.addEventListener('input', () => { userOverride = true; });
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('addex-save').addEventListener('click', () => {
    const typeId = typeEl.value, dur = parseInt(durEl.value), cal = parseInt(calEl.value);
    const note = document.getElementById('addex-note').value.trim();
    if (isNaN(dur) || dur < 1 || dur > 600) return toast('Duration 1-600 min');
    if (isNaN(cal) || cal < 0 || cal > 3000) return toast('Calories 0-3000');
    const t = getExerciseTypeById(typeId);
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const exercise = { id: Date.now(), date: todayISO(), time, type: typeId, typeName: t.name, typeEmoji: t.emoji, duration: dur, caloriesBurned: cal, note, source: 'manual' };
    state.exercises.push(exercise);
    recordAction({ type: 'create-exercise', exercise });
    saveState(); closeModal(); toast(`Logged ${t.name} · ${dur} min · ${cal} cal`, { undo: true }); navigate('today');
  });
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
  const acc = state.user.trackerAccuracy != null ? state.user.trackerAccuracy : 1.0;
  const accPct = Math.round(acc * 100);
  const suggested = getSuggestedTrackerAccuracy(state);
  const rate = state.user.targetLossRate != null ? state.user.targetLossRate : 1.0;
  const ratePct = Math.round(rate * 100);
  const exportNote = exp.never ? 'Never exported. Back up now.' : `Last export: ${exp.days} day${exp.days !== 1 ? 's' : ''} ago${exp.overdue ? ' — time to back up' : ''}`;
  const exportColor = exp.never || exp.overdue ? 'var(--danger)' : 'var(--muted)';
  modal.innerHTML = `<div class="modal-h">Settings</div><div class="modal-sub">${state.isDemo ? 'Currently using demo data.' : 'Using your own data.'}</div>
    <div>
      <div class="settings-row"><div><div class="settings-row-label">Reset to demo data</div><div class="settings-row-detail">Loads Sarah's example.</div></div><button class="btn btn-secondary btn-sm" id="reset-demo-btn">Reset</button></div>
      <div class="settings-row"><div><div class="settings-row-label">Start fresh</div><div class="settings-row-detail">Clears all data, runs onboarding.</div></div><button class="btn btn-secondary btn-sm" id="start-fresh-btn">Start fresh</button></div>
      <div class="settings-row"><div><div class="settings-row-label">Import Seth's spreadsheet</div><div class="settings-row-detail">Loads 84 days of HEALTH data.</div></div><button class="btn btn-secondary btn-sm" id="import-seth-btn">Import</button></div>
      <div class="settings-row"><div><div class="settings-row-label">User profile</div><div class="settings-row-detail">${state.user.name}, ${state.user.sex === 'F' ? 'female' : 'male'}, ${state.user.age}, ${Math.floor(state.user.heightInches/12)}'${state.user.heightInches%12}"</div></div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Activity level</div><div class="settings-row-detail">If you log exercise daily, set to Sedentary.</div><select class="form-select" id="settings-activity" style="margin-top: 10px; max-width: 320px;">${ACTIVITY_LEVELS.map(a => `<option value="${a.id}" ${(state.user.activityLevel || 'light') === a.id ? 'selected' : ''}>${a.name} — ${a.detail}</option>`).join('')}</select></div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Tracker accuracy</div><div class="settings-row-detail">Most fitness trackers overestimate. Apply a haircut.</div><div style="display: flex; gap: 12px; align-items: center; margin-top: 14px;"><input type="range" id="settings-tracker-acc" min="30" max="100" step="5" value="${accPct}" style="flex: 1;" /><div style="font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--primary-dark); min-width: 60px; text-align: right;" id="settings-tracker-acc-val">${accPct}%</div></div>${suggested != null && Math.abs(suggested - acc) > 0.05 ? `<div style="margin-top: 12px; padding: 12px 14px; background: var(--accent-soft); border-radius: 8px; font-size: 12.5px; color: var(--warning-text);">Suggested: <strong>${Math.round(suggested * 100)}%</strong> would match reality. <button class="btn btn-sm btn-primary" id="apply-suggested-acc" style="margin-left: 8px; padding: 4px 12px; font-size: 11px;">Apply</button></div>` : ''}</div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Goal weight</div><div class="settings-row-detail">Currently ${state.user.goalWeight} lb.</div><div style="display: flex; gap: 8px; margin-top: 10px;"><input type="number" class="form-input" id="settings-goal" value="${state.user.goalWeight}" min="50" max="500" step="0.5" style="max-width: 140px;" /><button class="btn btn-secondary btn-sm" id="settings-save-goal">Update</button></div></div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Target loss rate</div><div class="settings-row-detail">0 = maintenance.</div><div style="display: flex; gap: 12px; align-items: center; margin-top: 14px;"><input type="range" id="settings-rate" min="0" max="200" step="25" value="${ratePct}" style="flex: 1;" /><div style="font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--primary-dark); min-width: 130px; text-align: right;" id="settings-rate-val">${rate.toFixed(2)} <span style="font-size: 12px; color: var(--muted); font-family: var(--sans); font-weight: 600;">lb/wk</span></div></div></div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Export your data</div><div class="settings-row-detail">JSON keeps everything; CSV for spreadsheets.</div><div style="font-size: 12px; color: ${exportColor}; font-weight: 700; margin-top: 8px;">${exportNote}</div><div style="display: flex; gap: 8px; margin-top: 10px;"><button class="btn btn-secondary btn-sm" id="export-json-btn">Export JSON</button><button class="btn btn-secondary btn-sm" id="export-csv-btn">Export CSV</button></div></div></div>
      <div class="settings-row"><div style="flex:1;"><div class="settings-row-label">Restore from auto-backup</div><div class="settings-row-detail">${bak ? `Auto-backup last saved ${bak}.` : 'No auto-backup yet.'}</div><button class="btn btn-secondary btn-sm" id="restore-backup-btn" style="margin-top: 10px;" ${!bak ? 'disabled' : ''}>Restore</button></div></div>
      <div class="settings-row"><div><div class="settings-row-label">Methodology</div><div class="settings-row-detail">How the calibration math works.</div></div><button class="btn btn-secondary btn-sm" id="open-methodology-btn">Read</button></div>
    </div>
    <div class="modal-actions"><button class="btn btn-secondary btn-block" id="modal-cancel">Close</button></div>`;
  document.getElementById('modal-backdrop').classList.add('open');
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('reset-demo-btn').addEventListener('click', () => { if (!confirm('Reset to demo data?')) return; resetToDemoData(); closeModal(); toast('Demo data restored'); navigate('today'); });
  document.getElementById('start-fresh-btn').addEventListener('click', () => { if (!confirm('Clear all data and start fresh?')) return; closeModal(); startOnboarding(); });
  document.getElementById('import-seth-btn').addEventListener('click', () => { if (!confirm("Replace data with Seth's spreadsheet?")) return; importSethSpreadsheet(); });
  document.getElementById('settings-activity').addEventListener('change', (e) => { state.user.activityLevel = e.target.value; saveState(); toast(`Activity level updated`); });
  const accSlider = document.getElementById('settings-tracker-acc');
  if (accSlider) {
    accSlider.addEventListener('input', (e) => { document.getElementById('settings-tracker-acc-val').textContent = e.target.value + '%'; });
    accSlider.addEventListener('change', (e) => { state.user.trackerAccuracy = parseInt(e.target.value) / 100; saveState(); toast(`Tracker accuracy: ${e.target.value}%`); });
  }
  const applyBtn = document.getElementById('apply-suggested-acc');
  if (applyBtn) applyBtn.addEventListener('click', () => { const sug = getSuggestedTrackerAccuracy(state); if (sug == null) return; state.user.trackerAccuracy = sug; saveState(); closeModal(); toast(`Tracker accuracy: ${Math.round(sug * 100)}%`); navigate(currentView); });
  document.getElementById('export-json-btn').addEventListener('click', () => exportData('json'));
  document.getElementById('export-csv-btn').addEventListener('click', () => exportData('csv'));
  const restoreBtn = document.getElementById('restore-backup-btn');
  if (restoreBtn) restoreBtn.addEventListener('click', () => { if (!confirm('Restore from auto-backup?')) return; if (restoreFromBackup()) { closeModal(); toast('Restored from backup'); navigate('today'); } else toast('No backup found'); });
  document.getElementById('open-methodology-btn').addEventListener('click', () => { closeModal(); navigate('methodology'); });
  const rateSlider = document.getElementById('settings-rate');
  if (rateSlider) {
    rateSlider.addEventListener('input', (e) => { const r = parseInt(e.target.value) / 100; document.getElementById('settings-rate-val').innerHTML = `${r.toFixed(2)} <span style="font-size: 12px; color: var(--muted); font-family: var(--sans); font-weight: 600;">lb/wk</span>`; });
    rateSlider.addEventListener('change', (e) => { state.user.targetLossRate = parseInt(e.target.value) / 100; saveState(); toast(`Target rate: ${state.user.targetLossRate.toFixed(2)} lb/wk`); });
  }
  document.getElementById('settings-save-goal').addEventListener('click', () => { const v = parseFloat(document.getElementById('settings-goal').value); if (isNaN(v) || v < 50 || v > 500) return toast('Goal weight 50-500 lb'); state.user.goalWeight = v; saveState(); closeModal(); toast(`Goal weight: ${v} lb`); navigate(currentView); });
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
  closeModal();
  toast(`Imported ${newState.weights.length} weights, ${newState.meals.length} days intake, ${newState.exercises.length} days exercise.`);
  navigate('trend');
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
  return { step: 0, data: { name: '', startWeight: 190, goalWeight: 160, sex: 'F', age: 35, heightFt: 5, heightIn: 6, scalePref: 'smart', activityLevel: 'light', targetLossRate: 1.0, trackerSource: 'none', trackerAccuracy: 1.0 } };
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
  overlay.innerHTML = `<div class="ob-topbar"><div class="brand-name">Calorie<span class="brand-sep">·</span>Correct</div></div><div class="ob-content">${stepName !== 'welcome' && stepName !== 'done' ? renderObProgress() : ''}${renderObStep(stepName)}</div>`;
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
      return `<div class="ob-step left"><div class="ob-eyebrow">STEP 4 OF 5</div><div class="ob-h1">Your loss plan.</div><div class="ob-sub">How fast you want to lose, and what tracker (if any) reports your exercise burn.</div>
        <div class="ob-field"><div class="ob-field-label">Target loss rate</div><div style="display: flex; gap: 12px; align-items: center; margin-top: 6px;"><input type="range" id="ob-rate" min="0" max="200" step="25" value="${ratePct}" style="flex: 1;" /><div style="font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--primary-dark); min-width: 130px; text-align: right;" id="ob-rate-val">${rate.toFixed(2)} <span style="font-size: 12px; color: var(--muted); font-family: var(--sans); font-weight: 600;">lb/wk</span></div></div><div style="margin-top: 8px; font-size: 12px; color: var(--muted); display: flex; justify-content: space-between;"><span>Maintenance</span><span style="color: var(--primary-dark); font-weight: 700;" id="ob-rate-label">${rateLabel}</span><span>2.0 lb/wk</span></div></div>
        <div class="ob-field" style="margin-top: 12px;"><div class="ob-field-label">Fitness tracker</div><select class="ob-select" id="ob-tracker-source" style="font-size: 16px; padding: 4px 0;">${TRACKER_SOURCES.map(t => `<option value="${t.id}" ${(d.trackerSource || 'none') === t.id ? 'selected' : ''}>${t.name}${t.id !== 'none' ? ` — ~${Math.round(t.accuracy * 100)}% default` : ''}</option>`).join('')}</select></div>
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
    document.getElementById('ob-tracker-source').addEventListener('change', (e) => { obState.data.trackerSource = e.target.value; const found = TRACKER_SOURCES.find(t => t.id === e.target.value); obState.data.trackerAccuracy = found ? found.accuracy : 1.0; });
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
    const ts = document.getElementById('ob-tracker-source');
    if (ts) {
      obState.data.trackerSource = ts.value;
      const found = TRACKER_SOURCES.find(t => t.id === ts.value);
      obState.data.trackerAccuracy = found ? found.accuracy : 1.0;
    }
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
    user: { name: d.name || 'You', sex: d.sex, age: d.age, heightInches: d.heightFt * 12 + d.heightIn, startWeight: d.startWeight, goalWeight: d.goalWeight, startDate: today, scalePref: d.scalePref, activityLevel: d.activityLevel || 'light', trackerAccuracy: d.trackerAccuracy != null ? d.trackerAccuracy : 1.0, targetLossRate: d.targetLossRate != null ? d.targetLossRate : 1.0, trackerSource: d.trackerSource || 'none' },
    weights: [{ date: today, weight: d.startWeight }],
    meals: [], exercises: [], dayNotes: {}, onboarded: true, isDemo: false,
  };
  saveState();
  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) overlay.remove();
  document.removeEventListener('keydown', obKeyHandler);
  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
  toast('Welcome to Calorie Correct.');
  navigate('today');
}

/* ===================================================
   INIT
   =================================================== */
function init() {
  state = loadState();
  document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.view)));
  document.getElementById('weighin-btn').addEventListener('click', openWeighIn);
  document.getElementById('profile-btn').addEventListener('click', openSettings);
  document.getElementById('modal-backdrop').addEventListener('click', (e) => { if (e.target.id === 'modal-backdrop') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  if (!state) {
    state = makeBlankState();
    document.getElementById('user-name').textContent = state.user.name;
    document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
    navigate('today');
    startOnboarding();
    return;
  }

  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
  navigate('today');

  const params = new URLSearchParams(window.location.search);
  if (params.get('onboard') === '1') {
    if (state.isDemo) startOnboarding();
    else toast(`Already set up. Go to Settings → Start fresh to redo this.`);
    if (window.history.replaceState) window.history.replaceState({}, '', window.location.pathname);
  }
}

document.addEventListener('DOMContentLoaded', init);

})();
