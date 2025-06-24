const mongoose = require("mongoose");
const Question = require("../models/Question");
require("dotenv").config();

const initialQuestions = [
  // Science Questions
  {
    category: "Science",
    question: "What is the chemical symbol for gold?",
    answers: ["Au", "Ag", "Fe", "Cu"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What is the speed of light in vacuum?",
    answers: ["299,792,458 m/s", "150,000,000 m/s", "343 m/s", "1,125 ft/s"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the largest organ in the human body?",
    answers: ["Heart", "Liver", "Brain", "Skin"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What gas makes up about 78% of Earth's atmosphere?",
    answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the hardest natural substance on Earth?",
    answers: ["Gold", "Iron", "Diamond", "Quartz"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "How many bones are in an adult human body?",
    answers: ["196", "206", "216", "226"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the chemical formula for water?",
    answers: ["H2O", "CO2", "NaCl", "C6H12O6"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Science",
    question: "What type of animal is a Komodo dragon?",
    answers: ["Snake", "Lizard", "Crocodile", "Dinosaur"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Science",
    question: "What is the study of earthquakes called?",
    answers: ["Geology", "Meteorology", "Seismology", "Astronomy"],
    correct: 2,
    difficulty: "hard"
  },

  // History Questions
  {
    category: "History",
    question: "In which year did World War II end?",
    answers: ["1944", "1945", "1946", "1947"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "History",
    question: "Who was the first person to walk on the moon?",
    answers: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "History",
    question: "Which ancient wonder of the world was located in Alexandria?",
    answers: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Hanging Gardens", "Temple of Artemis"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "History",
    question: "The Berlin Wall fell in which year?",
    answers: ["1987", "1988", "1989", "1990"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who painted the ceiling of the Sistine Chapel?",
    answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Which empire was ruled by Julius Caesar?",
    answers: ["Greek Empire", "Roman Empire", "Byzantine Empire", "Ottoman Empire"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "History",
    question: "The French Revolution began in which year?",
    answers: ["1789", "1799", "1779", "1809"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "History",
    question: "Who wrote the Communist Manifesto?",
    answers: ["Vladimir Lenin", "Karl Marx", "Friedrich Engels", "Both Marx and Engels"],
    correct: 3,
    difficulty: "hard"
  },
  {
    category: "History",
    question: "Which battle is considered the turning point of World War II in the Pacific?",
    answers: ["Pearl Harbor", "Midway", "Iwo Jima", "Guadalcanal"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "History",
    question: "The Magna Carta was signed in which year?",
    answers: ["1205", "1215", "1225", "1235"],
    correct: 1,
    difficulty: "hard"
  },

  // Geography Questions
  {
    category: "Geography",
    question: "What is the capital of Australia?",
    answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "Which is the longest river in the world?",
    answers: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "Mount Everest is located in which mountain range?",
    answers: ["Andes", "Alps", "Himalayas", "Rockies"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "Which country has the most time zones?",
    answers: ["Russia", "United States", "China", "Canada"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "What is the smallest country in the world?",
    answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "Which desert is the largest in the world?",
    answers: ["Sahara", "Gobi", "Antarctica", "Arabian"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "The Great Barrier Reef is located off the coast of which country?",
    answers: ["New Zealand", "Australia", "Philippines", "Indonesia"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Geography",
    question: "Which strait separates Europe and Africa?",
    answers: ["Bering Strait", "Strait of Gibraltar", "Strait of Hormuz", "Bosphorus"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Geography",
    question: "Lake Baikal, the world's deepest lake, is located in which country?",
    answers: ["Mongolia", "China", "Russia", "Kazakhstan"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Geography",
    question: "Which African country is completely surrounded by South Africa?",
    answers: ["Lesotho", "Swaziland", "Botswana", "Namibia"],
    correct: 0,
    difficulty: "hard"
  },

  // Literature Questions
  {
    category: "Literature",
    question: "Who wrote 'Pride and Prejudice'?",
    answers: ["Charlotte Brontë", "Emily Dickinson", "Virginia Woolf", "Jane Austen"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who said 'I think, therefore I am'?",
    answers: ["Socrates", "Plato", "René Descartes", "Aristotle"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Which Shakespeare play features the characters Romeo and Juliet?",
    answers: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who wrote '1984'?",
    answers: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "What is the first book in the Harry Potter series?",
    answers: ["Chamber of Secrets", "Philosopher's Stone", "Prisoner of Azkaban", "Goblet of Fire"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who wrote 'To Kill a Mockingbird'?",
    answers: ["Harper Lee", "Toni Morrison", "Maya Angelou", "Zora Neale Hurston"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "In which language was 'Don Quixote' originally written?",
    answers: ["Portuguese", "Italian", "Spanish", "French"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Who wrote 'The Great Gatsby'?",
    answers: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Which epic poem tells the story of Odysseus?",
    answers: ["The Iliad", "The Odyssey", "The Aeneid", "Beowulf"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Who wrote 'One Hundred Years of Solitude'?",
    answers: ["Isabel Allende", "Gabriel García Márquez", "Mario Vargas Llosa", "Pablo Neruda"],
    correct: 1,
    difficulty: "hard"
  },

  // Mathematics Questions
  {
    category: "Mathematics",
    question: "What is the value of π (pi) to two decimal places?",
    answers: ["3.14", "3.15", "3.16", "3.13"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Mathematics",
    question: "What is 12 × 12?",
    answers: ["144", "124", "154", "134"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Mathematics",
    question: "What is the square root of 64?",
    answers: ["6", "7", "8", "9"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Mathematics",
    question: "What is the next prime number after 7?",
    answers: ["9", "10", "11", "12"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Mathematics",
    question: "What is 15% of 200?",
    answers: ["25", "30", "35", "40"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Mathematics",
    question: "In a right triangle, what is the longest side called?",
    answers: ["Adjacent", "Opposite", "Hypotenuse", "Base"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Mathematics",
    question: "What is the sum of angles in a triangle?",
    answers: ["90°", "180°", "270°", "360°"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Mathematics",
    question: "What is the derivative of x²?",
    answers: ["x", "2x", "x²", "2x²"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Mathematics",
    question: "What is the Fibonacci sequence starting number?",
    answers: ["0, 1", "1, 1", "1, 2", "0, 2"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Mathematics",
    question: "What does 'e' represent in mathematics?",
    answers: ["Energy", "Euler's number", "Equation", "Exponent"],
    correct: 1,
    difficulty: "hard"
  },

  // Sports Questions
  {
    category: "Sports",
    question: "How many players are on a basketball team on the court at one time?",
    answers: ["4", "5", "6", "7"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "Which sport is known as 'the beautiful game'?",
    answers: ["Basketball", "Tennis", "Football/Soccer", "Baseball"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "How often are the Summer Olympics held?",
    answers: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "In which sport would you perform a slam dunk?",
    answers: ["Volleyball", "Basketball", "Tennis", "Baseball"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "What is the maximum score possible in ten-pin bowling?",
    answers: ["200", "250", "300", "350"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "Which country has won the most FIFA World Cups?",
    answers: ["Germany", "Argentina", "Brazil", "Italy"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "In golf, what is one stroke under par called?",
    answers: ["Eagle", "Birdie", "Bogey", "Albatross"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "Which tennis tournament is played on clay courts?",
    answers: ["Wimbledon", "US Open", "French Open", "Australian Open"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Sports",
    question: "How many rings are on the Olympic flag?",
    answers: ["4", "5", "6", "7"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Sports",
    question: "In which sport is the Stanley Cup awarded?",
    answers: ["Basketball", "Football", "Ice Hockey", "Baseball"],
    correct: 2,
    difficulty: "medium"
  },

  // Technology Questions
  {
    category: "Technology",
    question: "What does 'HTTP' stand for?",
    answers: ["High Tech Transfer Protocol", "Hypertext Transfer Protocol", "Home Tool Transfer Protocol", "Hyperlink Text Transfer Protocol"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "Who founded Microsoft?",
    answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'AI' stand for?",
    answers: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Interface"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "Which company developed the iPhone?",
    answers: ["Samsung", "Google", "Apple", "Microsoft"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What does 'URL' stand for?",
    answers: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Locator"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "Which programming language is known for its use in web development?",
    answers: ["C++", "Java", "JavaScript", "Python"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "What does 'CPU' stand for?",
    answers: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "Which company owns YouTube?",
    answers: ["Facebook", "Microsoft", "Google", "Amazon"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Technology",
    question: "What is the main function of RAM in a computer?",
    answers: ["Storage", "Processing", "Memory", "Networking"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Technology",
    question: "Which protocol is used for secure web browsing?",
    answers: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correct: 1,
    difficulty: "medium"
  },

  // Art Questions
  {
    category: "Art",
    question: "Who painted 'The Starry Night'?",
    answers: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Claude Monet"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "Which artist cut off his own ear?",
    answers: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Henri Matisse"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "What type of art is Auguste Rodin famous for?",
    answers: ["Painting", "Sculpture", "Photography", "Architecture"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Which museum houses the Mona Lisa?",
    answers: ["British Museum", "Metropolitan Museum", "Louvre", "Uffizi"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "What art movement was Pablo Picasso associated with?",
    answers: ["Impressionism", "Cubism", "Surrealism", "Expressionism"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Who painted 'The Persistence of Memory' (melting clocks)?",
    answers: ["René Magritte", "Salvador Dalí", "Max Ernst", "Joan Miró"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "What is the art technique of creating images using small dots of color?",
    answers: ["Impressionism", "Pointillism", "Cubism", "Fauvism"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Art",
    question: "Which Italian city is famous for its Renaissance art?",
    answers: ["Rome", "Venice", "Florence", "Milan"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Who painted 'Guernica'?",
    answers: ["Pablo Picasso", "Joan Miró", "Salvador Dalí", "Francisco Goya"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "What does 'chiaroscuro' refer to in art?",
    answers: ["Color mixing", "Light and shadow", "Perspective", "Texture"],
    correct: 1,
    difficulty: "hard"
  },

  // Music Questions
  {
    category: "Music",
    question: "How many strings does a standard guitar have?",
    answers: ["4", "5", "6", "7"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Which composer wrote 'The Four Seasons'?",
    answers: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What is the highest female singing voice called?",
    answers: ["Alto", "Soprano", "Mezzo-soprano", "Contralto"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "How many keys are on a standard piano?",
    answers: ["76", "82", "88", "92"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Which instrument did Yo-Yo Ma famously play?",
    answers: ["Violin", "Piano", "Cello", "Viola"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What does 'forte' mean in music?",
    answers: ["Soft", "Loud", "Fast", "Slow"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Which band released the album 'Abbey Road'?",
    answers: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Pink Floyd"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "How many movements are typically in a classical symphony?",
    answers: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Music",
    question: "What is the lowest male singing voice called?",
    answers: ["Tenor", "Baritone", "Bass", "Counter-tenor"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Which note is the 'open' string for the highest pitch string on a guitar?",
    answers: ["E", "B", "G", "D"],
    correct: 0,
    difficulty: "hard"
  },

  // Food Questions
  {
    category: "Food",
    question: "What spice is derived from the Crocus flower?",
    answers: ["Cinnamon", "Saffron", "Turmeric", "Paprika"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "Which country is famous for inventing pizza?",
    answers: ["France", "Spain", "Italy", "Greece"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Food",
    question: "What is the main ingredient in guacamole?",
    answers: ["Tomato", "Avocado", "Onion", "Lime"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Food",
    question: "Which type of pastry is used to make profiteroles?",
    answers: ["Puff pastry", "Choux pastry", "Shortcrust pastry", "Filo pastry"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "What is the most expensive spice in the world by weight?",
    answers: ["Vanilla", "Cardamom", "Saffron", "Black truffle"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "Which fruit is known as the 'king of fruits' in Southeast Asia?",
    answers: ["Mango", "Durian", "Jackfruit", "Rambutan"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "What type of alcohol is used in a Mojito?",
    answers: ["Vodka", "Gin", "Rum", "Tequila"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "Which country did French fries actually originate from?",
    answers: ["France", "Belgium", "Germany", "Netherlands"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "What is the main protein in eggs?",
    answers: ["Casein", "Albumin", "Gluten", "Keratin"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "Which herb is traditionally used in pesto?",
    answers: ["Parsley", "Cilantro", "Basil", "Oregano"],
    correct: 2,
    difficulty: "easy"
  },

  // Politics Questions
  {
    category: "Politics",
    question: "How many years does a U.S. President serve in one term?",
    answers: ["2 years", "4 years", "6 years", "8 years"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Politics",
    question: "Which document begins with 'We the People'?",
    answers: ["Declaration of Independence", "U.S. Constitution", "Bill of Rights", "Articles of Confederation"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Politics",
    question: "What is the minimum age to serve as U.S. President?",
    answers: ["30", "35", "40", "45"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Politics",
    question: "How many members are in the U.S. House of Representatives?",
    answers: ["100", "435", "50", "535"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Politics",
    question: "Which amendment gave women the right to vote?",
    answers: ["15th", "17th", "19th", "21st"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Politics",
    question: "Who was the first President of the United States?",
    answers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin", "George Washington"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Politics",
    question: "What is the electoral college?",
    answers: ["A university", "A voting system", "A political party", "A government building"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Politics",
    question: "How many justices serve on the U.S. Supreme Court?",
    answers: ["7", "9", "11", "12"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Politics",
    question: "Which branch of government interprets laws?",
    answers: ["Executive", "Legislative", "Judicial", "Administrative"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Politics",
    question: "What is the length of a U.S. Senator's term?",
    answers: ["2 years", "4 years", "6 years", "8 years"],
    correct: 2,
    difficulty: "medium"
  },

  // Nature Questions
  {
    category: "Nature",
    question: "What is the largest mammal in the world?",
    answers: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Nature",
    question: "Which gas do plants absorb from the atmosphere?",
    answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Nature",
    question: "What is the fastest land animal?",
    answers: ["Lion", "Cheetah", "Leopard", "Tiger"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Nature",
    question: "How many chambers does a human heart have?",
    answers: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Nature",
    question: "Which tree produces acorns?",
    answers: ["Pine", "Maple", "Oak", "Birch"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Nature",
    question: "What is the study of birds called?",
    answers: ["Entomology", "Ornithology", "Ichthyology", "Herpetology"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Nature",
    question: "Which planet is known as the 'Morning Star'?",
    answers: ["Mars", "Venus", "Mercury", "Jupiter"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Nature",
    question: "What type of animal is a Komodo dragon?",
    answers: ["Snake", "Lizard", "Crocodile", "Turtle"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Nature",
    question: "How many legs does a spider have?",
    answers: ["6", "8", "10", "12"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Nature",
    question: "What is the process by which plants make food?",
    answers: ["Respiration", "Digestion", "Photosynthesis", "Metabolism"],
    correct: 2,
    difficulty: "medium"
  },

  // Movies Questions
  {
    category: "Movies",
    question: "Which movie won the Academy Award for Best Picture in 1994?",
    answers: ["Forrest Gump", "The Lion King", "Pulp Fiction", "The Shawshank Redemption"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "Movies",
    question: "Who directed the movie 'Jaws'?",
    answers: ["George Lucas", "Steven Spielberg", "Martin Scorsese", "Francis Ford Coppola"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Movies",
    question: "Which actor played the Joker in 'The Dark Knight'?",
    answers: ["Jack Nicholson", "Joaquin Phoenix", "Heath Ledger", "Jared Leto"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Movies",
    question: "What is the highest-grossing film of all time (as of 2024)?",
    answers: ["Titanic", "Avatar", "Avengers: Endgame", "Avatar: The Way of Water"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Movies",
    question: "Which film series features the character Katniss Everdeen?",
    answers: ["Divergent", "The Hunger Games", "Maze Runner", "Percy Jackson"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Movies",
    question: "Who composed the music for 'Star Wars'?",
    answers: ["Hans Zimmer", "John Williams", "Danny Elfman", "James Horner"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Movies",
    question: "Which movie features the line 'May the Force be with you'?",
    answers: ["Star Trek", "Star Wars", "Guardians of the Galaxy", "Blade Runner"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Movies",
    question: "Which film won the first Academy Award for Best Animated Feature?",
    answers: ["Monsters, Inc.", "Shrek", "Ice Age", "Finding Nemo"],
    Adding the remaining categories (Misc, Movies, Literature, Art, Music and Food) and the count-per-category route for debugging.answers: ["Monsters, Inc.", "Shrek", "Ice Age", "Finding Nemo"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Movies",
    question: "Who played Neo in 'The Matrix'?",
    answers: ["Brad Pitt", "Keanu Reeves", "Tom Cruise", "Will Smith"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Movies",
    question: "Which director is known for films like 'Pulp Fiction' and 'Kill Bill'?",
    answers: ["Quentin Tarantino", "Martin Scorsese", "Christopher Nolan", "David Fincher"],
    correct: 0,
    difficulty: "medium"
  },

  // Literature Questions
  {
    category: "Literature",
    question: "Who wrote 'Pride and Prejudice'?",
    answers: ["Charlotte Brontë", "Emily Dickinson", "Virginia Woolf", "Jane Austen"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who said 'I think, therefore I am'?",
    answers: ["Socrates", "Plato", "René Descartes", "Aristotle"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Which Shakespeare play features the characters Romeo and Juliet?",
    answers: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who wrote '1984'?",
    answers: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "What is the first book in the Harry Potter series?",
    answers: ["Chamber of Secrets", "Philosopher's Stone", "Prisoner of Azkaban", "Goblet of Fire"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Literature",
    question: "Who wrote 'To Kill a Mockingbird'?",
    answers: ["Harper Lee", "Toni Morrison", "Maya Angelou", "Zora Neale Hurston"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "In which language was 'Don Quixote' originally written?",
    answers: ["Portuguese", "Italian", "Spanish", "French"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Who wrote 'The Great Gatsby'?",
    answers: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Which epic poem tells the story of Odysseus?",
    answers: ["The Iliad", "The Odyssey", "The Aeneid", "Beowulf"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Literature",
    question: "Who wrote 'One Hundred Years of Solitude'?",
    answers: ["Isabel Allende", "Gabriel García Márquez", "Mario Vargas Llosa", "Pablo Neruda"],
    correct: 1,
    difficulty: "hard"
  },

   // Art Questions
   {
    category: "Art",
    question: "Who painted 'The Starry Night'?",
    answers: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Claude Monet"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "Which artist cut off his own ear?",
    answers: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Henri Matisse"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "What type of art is Auguste Rodin famous for?",
    answers: ["Painting", "Sculpture", "Photography", "Architecture"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Which museum houses the Mona Lisa?",
    answers: ["British Museum", "Metropolitan Museum", "Louvre", "Uffizi"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Art",
    question: "What art movement was Pablo Picasso associated with?",
    answers: ["Impressionism", "Cubism", "Surrealism", "Expressionism"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Who painted 'The Persistence of Memory' (melting clocks)?",
    answers: ["René Magritte", "Salvador Dalí", "Max Ernst", "Joan Miró"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "What is the art technique of creating images using small dots of color?",
    answers: ["Impressionism", "Pointillism", "Cubism", "Fauvism"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Art",
    question: "Which Italian city is famous for its Renaissance art?",
    answers: ["Rome", "Venice", "Florence", "Milan"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "Who painted 'Guernica'?",
    answers: ["Pablo Picasso", "Joan Miró", "Salvador Dalí", "Francisco Goya"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Art",
    question: "What does 'chiaroscuro' refer to in art?",
    answers: ["Color mixing", "Light and shadow", "Perspective", "Texture"],
    correct: 1,
    difficulty: "hard"
  },

   // Music Questions
   {
    category: "Music",
    question: "How many strings does a standard guitar have?",
    answers: ["4", "5", "6", "7"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Which composer wrote 'The Four Seasons'?",
    answers: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What is the highest female singing voice called?",
    answers: ["Alto", "Soprano", "Mezzo-soprano", "Contralto"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "How many keys are on a standard piano?",
    answers: ["76", "82", "88", "92"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Which instrument did Yo-Yo Ma famously play?",
    answers: ["Violin", "Piano", "Cello", "Viola"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "What does 'forte' mean in music?",
    answers: ["Soft", "Loud", "Fast", "Slow"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "Which band released the album 'Abbey Road'?",
    answers: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Pink Floyd"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Music",
    question: "How many movements are typically in a classical symphony?",
    answers: ["2", "3", "4", "5"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Music",
    question: "What is the lowest male singing voice called?",
    answers: ["Tenor", "Baritone", "Bass", "Counter-tenor"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Music",
    question: "Which note is the 'open' string for the highest pitch string on a guitar?",
    answers: ["E", "B", "G", "D"],
    correct: 0,
    difficulty: "hard"
  },

   // Food Questions
   {
    category: "Food",
    question: "What spice is derived from the Crocus flower?",
    answers: ["Cinnamon", "Saffron", "Turmeric", "Paprika"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "Which country is famous for inventing pizza?",
    answers: ["France", "Spain", "Italy", "Greece"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Food",
    question: "What is the main ingredient in guacamole?",
    answers: ["Tomato", "Avocado", "Onion", "Lime"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Food",
    question: "Which type of pastry is used to make profiteroles?",
    answers: ["Puff pastry", "Choux pastry", "Shortcrust pastry", "Filo pastry"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "What is the most expensive spice in the world by weight?",
    answers: ["Vanilla", "Cardamom", "Saffron", "Black truffle"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "Which fruit is known as the 'king of fruits' in Southeast Asia?",
    answers: ["Mango", "Durian", "Jackfruit", "Rambutan"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "What type of alcohol is used in a Mojito?",
    answers: ["Vodka", "Gin", "Rum", "Tequila"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "Which country did French fries actually originate from?",
    answers: ["France", "Belgium", "Germany", "Netherlands"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food",
    question: "What is the main protein in eggs?",
    answers: ["Casein", "Albumin", "Gluten", "Keratin"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Food",
    question: "Which herb is traditionally used in pesto?",
    answers: ["Parsley", "Cilantro", "Basil", "Oregano"],
    correct: 2,
    difficulty: "easy"
  },

   // Misc Questions
   {
    category: "Misc",
    question: "What is the capital of Canada?",
    answers: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the symbol for the element Iron?",
    answers: ["Ir", "Fe", "Io", "In"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the smallest planet in our solar system?",
    answers: ["Mars", "Mercury", "Venus", "Earth"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the chemical symbol for silver?",
    answers: ["Ag", "Si", "Au", "Ar"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "How many continents are there on Earth?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the capital of Japan?",
    answers: ["Seoul", "Beijing", "Tokyo", "Shanghai"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the currency of the United Kingdom?",
    answers: ["Euro", "Dollar", "Pound", "Yen"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the population of India?",
    answers: ["1.1 billion", "1.2 billion", "1.3 billion", "1.4 billion"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Misc",
    question: "What is the highest mountain in the world?",
    answers: ["K2", "Kilimanjaro", "Mount Everest", "Kangchenjunga"],
    correct: 2,
    difficulty: "easy"
  },
];

async function seedQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("🧹 Cleared existing questions");

    // Insert new questions
    await Question.insertMany(initialQuestions);
    console.log(`✅ Inserted ${initialQuestions.length} questions`);

    // Show stats
    const stats = await Question.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log("\n📊 Questions by category:");
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} questions`);
    });

    console.log(`\n🎯 Total: ${initialQuestions.length} questions across ${stats.length} categories`);
    
    // Verify we have exactly 10 questions per category
    const targetCategories = 12;
    const questionsPerCategory = 10;
    const expectedTotal = targetCategories * questionsPerCategory;
    
    console.log(`\n📋 Quality Check:`);
    console.log(`Expected: ${expectedTotal} questions (${questionsPerCategory} per category)`);
    console.log(`Actual: ${initialQuestions.length} questions`);
    
    const categoriesWithWrongCount = stats.filter(stat => stat.count !== questionsPerCategory);
    if (categoriesWithWrongCount.length > 0) {
      console.log(`⚠️ Categories with incorrect count:`);
      categoriesWithWrongCount.forEach(cat => {
        console.log(`  - ${cat._id}: ${cat.count} questions (should be ${questionsPerCategory})`);
      });
    } else {
      console.log(`✅ Perfect! All ${stats.length} categories have exactly ${questionsPerCategory} questions each`);
    }
    
    if (initialQuestions.length === expectedTotal) {
      console.log(`🎉 Database is ready with ${expectedTotal} questions for production use!`);
    } else {
      console.log(`❌ Total count mismatch. Please review question data.`);
    }

  } catch (error) {
    console.error("❌ Error seeding questions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the seeding function
seedQuestions();

const express = require('express');
const app = express();
const port = 3000;

app.get('/api/questions/count-per-category', async (req, res) => {
    const result = await Question.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json(result);
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});