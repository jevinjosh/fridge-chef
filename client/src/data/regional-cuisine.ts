export interface Dish {
  name: string;
  emoji: string;
}

export interface SubRegion {
  name: string;
  emoji: string;
  dishes: Dish[];
}

export interface Region {
  name: string;
  emoji: string;
  description: string;
  subRegions: SubRegion[];
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  description: string;
  regions: Region[];
}

export const countries: Country[] = [
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    description: "A land of diverse flavors, spices, and culinary traditions",
    regions: [
      {
        name: "North India",
        emoji: "🏔️",
        description: "Rich gravies, tandoor cooking, aromatic breads",
        subRegions: [
          {
            name: "Punjab",
            emoji: "🌾",
            dishes: [
              { name: "Butter Chicken", emoji: "🍗" },
              { name: "Sarson Ka Saag", emoji: "🥬" },
              { name: "Makki Di Roti", emoji: "🫓" },
              { name: "Dal Makhani", emoji: "🫘" },
              { name: "Amritsari Fish", emoji: "🐟" },
            ],
          },
          {
            name: "Uttar Pradesh",
            emoji: "🕌",
            dishes: [
              { name: "Biryani", emoji: "🍚" },
              { name: "Kebab", emoji: "🥩" },
              { name: "Kachori", emoji: "🫓" },
              { name: "Petha", emoji: "🍬" },
              { name: "Bedai", emoji: "🥐" },
            ],
          },
          {
            name: "Rajasthan",
            emoji: "🏜️",
            dishes: [
              { name: "Dal Baati Churma", emoji: "🫓" },
              { name: "Laal Maas", emoji: "🍖" },
              { name: "Ghevar", emoji: "🎂" },
              { name: "Ker Sangri", emoji: "🥗" },
              { name: "Gatte Ki Sabzi", emoji: "🍛" },
            ],
          },
          {
            name: "Delhi",
            emoji: "🏙️",
            dishes: [
              { name: "Chole Bhature", emoji: "🫘" },
              { name: "Parathas", emoji: "🫓" },
              { name: "Dahi Puri", emoji: "🥙" },
              { name: "Aloo Tikki", emoji: "🥔" },
              { name: "Nihari", emoji: "🍲" },
            ],
          },
        ],
      },
      {
        name: "South India",
        emoji: "🌴",
        description: "Rice-based dishes, coconut-infused curries, fermented delights",
        subRegions: [
          {
            name: "Tamil Nadu",
            emoji: "🏛️",
            dishes: [
              { name: "Biryani", emoji: "🍚" },
              { name: "Masala Dosa", emoji: "🫓" },
              { name: "Idli", emoji: "⚪" },
              { name: "Chettinad Chicken Curry", emoji: "🍗" },
              { name: "Pongal", emoji: "🍚" },
              { name: "Rasam", emoji: "🫙" },
            ],
          },
          {
            name: "Kerala",
            emoji: "🌿",
            dishes: [
              { name: "Fish Curry", emoji: "🐟" },
              { name: "Appam", emoji: "🥞" },
              { name: "Puttu", emoji: "🍥" },
              { name: "Kerala Prawn Curry", emoji: "🦐" },
              { name: "Beef Fry", emoji: "🥩" },
            ],
          },
          {
            name: "Karnataka",
            emoji: "🌺",
            dishes: [
              { name: "Bisi Bele Bath", emoji: "🍲" },
              { name: "Mysore Masala Dosa", emoji: "🫓" },
              { name: "Ragi Mudde", emoji: "🥣" },
              { name: "Udupi Sambar", emoji: "🍛" },
              { name: "Coorg Pork Curry", emoji: "🐖" },
            ],
          },
          {
            name: "Andhra Pradesh",
            emoji: "🌶️",
            dishes: [
              { name: "Hyderabadi Biryani", emoji: "🍚" },
              { name: "Gongura Mutton", emoji: "🍖" },
              { name: "Pesarattu", emoji: "🥞" },
              { name: "Pulihora", emoji: "🍚" },
              { name: "Chicken 65", emoji: "🍗" },
            ],
          },
        ],
      },
      {
        name: "East India",
        emoji: "🌊",
        description: "Mustard-infused seafood, sweet rosogollas, light flavors",
        subRegions: [
          {
            name: "West Bengal",
            emoji: "🐟",
            dishes: [
              { name: "Macher Jhol", emoji: "🐟" },
              { name: "Rasgulla", emoji: "🍡" },
              { name: "Kathi Roll", emoji: "🌯" },
              { name: "Kosha Mangsho", emoji: "🍖" },
              { name: "Mishti Doi", emoji: "🍮" },
            ],
          },
          {
            name: "Odisha",
            emoji: "🏯",
            dishes: [
              { name: "Dalma", emoji: "🫘" },
              { name: "Chhena Poda", emoji: "🍰" },
              { name: "Pakhala Bhata", emoji: "🍚" },
              { name: "Machha Besara", emoji: "🐟" },
            ],
          },
          {
            name: "Assam",
            emoji: "🍵",
            dishes: [
              { name: "Masor Tenga", emoji: "🐟" },
              { name: "Pithas", emoji: "🥞" },
              { name: "Duck Curry", emoji: "🦆" },
            ],
          },
        ],
      },
      {
        name: "West India",
        emoji: "🌊",
        description: "Coastal seafood, vegetarian specialties, street food paradise",
        subRegions: [
          {
            name: "Maharashtra",
            emoji: "🏙️",
            dishes: [
              { name: "Vada Pav", emoji: "🍔" },
              { name: "Pav Bhaji", emoji: "🍛" },
              { name: "Puran Poli", emoji: "🫓" },
              { name: "Misal Pav", emoji: "🌶️" },
              { name: "Kolhapuri Chicken", emoji: "🍗" },
            ],
          },
          {
            name: "Goa",
            emoji: "🏖️",
            dishes: [
              { name: "Goan Fish Curry", emoji: "🐟" },
              { name: "Prawn Balchao", emoji: "🦐" },
              { name: "Bebinca", emoji: "🎂" },
              { name: "Vindaloo", emoji: "🍖" },
              { name: "Xacuti", emoji: "🍗" },
            ],
          },
          {
            name: "Gujarat",
            emoji: "🎨",
            dishes: [
              { name: "Dhokla", emoji: "🟡" },
              { name: "Thepla", emoji: "🫓" },
              { name: "Undhiyu", emoji: "🥗" },
              { name: "Fafda", emoji: "🟡" },
              { name: "Khandvi", emoji: "🫔" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    description: "The birthplace of pasta, pizza, and timeless culinary traditions",
    regions: [
      {
        name: "Northern Italy",
        emoji: "🏔️",
        description: "Risotto, polenta, butter-based sauces",
        subRegions: [
          {
            name: "Lombardy (Milan)",
            emoji: "🏙️",
            dishes: [
              { name: "Risotto alla Milanese", emoji: "🍚" },
              { name: "Osso Buco", emoji: "🍖" },
              { name: "Cotoletta alla Milanese", emoji: "🥩" },
              { name: "Panettone", emoji: "🎂" },
            ],
          },
          {
            name: "Veneto (Venice)",
            emoji: "⛵",
            dishes: [
              { name: "Risotto", emoji: "🍚" },
              { name: "Venetian Liver", emoji: "🥩" },
              { name: "Tiramisu", emoji: "☕" },
              { name: "Baccalà Mantecato", emoji: "🐟" },
            ],
          },
          {
            name: "Tuscany",
            emoji: "🌻",
            dishes: [
              { name: "Bistecca Fiorentina", emoji: "🥩" },
              { name: "Ribollita", emoji: "🍲" },
              { name: "Pappardelle al Cinghiale", emoji: "🍝" },
              { name: "Cantuccini", emoji: "🍪" },
            ],
          },
        ],
      },
      {
        name: "Central Italy",
        emoji: "🏛️",
        description: "Rome's classic pasta dishes and cured meats",
        subRegions: [
          {
            name: "Rome (Lazio)",
            emoji: "🏛️",
            dishes: [
              { name: "Pasta Carbonara", emoji: "🍝" },
              { name: "Cacio e Pepe", emoji: "🍝" },
              { name: "Amatriciana", emoji: "🍝" },
              { name: "Supplì", emoji: "🍱" },
              { name: "Saltimbocca", emoji: "🥩" },
            ],
          },
          {
            name: "Umbria",
            emoji: "🌲",
            dishes: [
              { name: "Truffles", emoji: "🍄" },
              { name: "Torta al Testo", emoji: "🫓" },
              { name: "Strangozzi", emoji: "🍝" },
            ],
          },
        ],
      },
      {
        name: "Southern Italy",
        emoji: "☀️",
        description: "Pizza, seafood, tomato-based sauces",
        subRegions: [
          {
            name: "Naples (Campania)",
            emoji: "🍕",
            dishes: [
              { name: "Neapolitan Pizza", emoji: "🍕" },
              { name: "Spaghetti alle Vongole", emoji: "🍝" },
              { name: "Gnocchi alla Sorrentina", emoji: "🍝" },
              { name: "Sfogliatella", emoji: "🥐" },
              { name: "Babà", emoji: "🍰" },
            ],
          },
          {
            name: "Sicily",
            emoji: "🏝️",
            dishes: [
              { name: "Arancini", emoji: "🍱" },
              { name: "Pasta alla Norma", emoji: "🍝" },
              { name: "Caponata", emoji: "🍆" },
              { name: "Cannoli", emoji: "🥐" },
              { name: "Swordfish Steak", emoji: "🐟" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    description: "Precision, umami, and centuries of refined culinary artistry",
    regions: [
      {
        name: "Kanto (Tokyo)",
        emoji: "🗼",
        description: "The heart of modern Japanese cuisine",
        subRegions: [
          {
            name: "Tokyo",
            emoji: "🏙️",
            dishes: [
              { name: "Sushi", emoji: "🍣" },
              { name: "Ramen", emoji: "🍜" },
              { name: "Tempura", emoji: "🍤" },
              { name: "Yakitori", emoji: "🍢" },
              { name: "Tonkatsu", emoji: "🥩" },
            ],
          },
        ],
      },
      {
        name: "Kansai (Osaka & Kyoto)",
        emoji: "⛩️",
        description: "Japan's kitchen with bold flavors and history",
        subRegions: [
          {
            name: "Osaka",
            emoji: "🎡",
            dishes: [
              { name: "Takoyaki", emoji: "🐙" },
              { name: "Okonomiyaki", emoji: "🥞" },
              { name: "Kushikatsu", emoji: "🍢" },
              { name: "Negiyaki", emoji: "🥞" },
            ],
          },
          {
            name: "Kyoto",
            emoji: "🏯",
            dishes: [
              { name: "Kaiseki", emoji: "🍱" },
              { name: "Tofu Cuisine", emoji: "⬜" },
              { name: "Nishin Soba", emoji: "🍜" },
              { name: "Yatsuhashi", emoji: "🍡" },
            ],
          },
        ],
      },
      {
        name: "Hokkaido (North)",
        emoji: "❄️",
        description: "Dairy, seafood, and hearty winter dishes",
        subRegions: [
          {
            name: "Sapporo",
            emoji: "🦀",
            dishes: [
              { name: "Miso Ramen", emoji: "🍜" },
              { name: "Crab Dishes", emoji: "🦀" },
              { name: "Salmon Sashimi", emoji: "🐟" },
              { name: "Jingisukan", emoji: "🐑" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    description: "Ancient traditions blended with vibrant chiles and bold flavors",
    regions: [
      {
        name: "Northern Mexico",
        emoji: "🏜️",
        description: "Beef, flour tortillas, and border-style dishes",
        subRegions: [
          {
            name: "Sonora",
            emoji: "🌵",
            dishes: [
              { name: "Carne Asada Tacos", emoji: "🌮" },
              { name: "Beef Burrito", emoji: "🌯" },
              { name: "Machaca", emoji: "🥩" },
            ],
          },
          {
            name: "Nuevo León",
            emoji: "🔥",
            dishes: [
              { name: "Cabrito al Pastor", emoji: "🐐" },
              { name: "Arrachera", emoji: "🥩" },
              { name: "Frijoles Charros", emoji: "🫘" },
            ],
          },
        ],
      },
      {
        name: "Central Mexico",
        emoji: "🏙️",
        description: "Street food, rich sauces, and mole",
        subRegions: [
          {
            name: "Mexico City",
            emoji: "🌆",
            dishes: [
              { name: "Tacos al Pastor", emoji: "🌮" },
              { name: "Tlayudas", emoji: "🫓" },
              { name: "Enchiladas", emoji: "🌯" },
              { name: "Pozole", emoji: "🍲" },
              { name: "Tamales", emoji: "🫔" },
            ],
          },
          {
            name: "Oaxaca",
            emoji: "🌶️",
            dishes: [
              { name: "Mole Negro", emoji: "🍫" },
              { name: "Tlayuda", emoji: "🫓" },
              { name: "Chapulines", emoji: "🦗" },
              { name: "Memelas", emoji: "🫓" },
            ],
          },
        ],
      },
      {
        name: "Southern Mexico",
        emoji: "🌊",
        description: "Seafood, complex moles, and Mayan heritage",
        subRegions: [
          {
            name: "Yucatan",
            emoji: "🏛️",
            dishes: [
              { name: "Cochinita Pibil", emoji: "🐖" },
              { name: "Sopa de Lima", emoji: "🍜" },
              { name: "Panuchos", emoji: "🫓" },
              { name: "Poc Chuc", emoji: "🥩" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    description: "Eight great culinary traditions spanning thousands of years",
    regions: [
      {
        name: "Northern China",
        emoji: "🏔️",
        description: "Wheat-based dishes, dumplings, and roasted meats",
        subRegions: [
          {
            name: "Beijing",
            emoji: "🏯",
            dishes: [
              { name: "Peking Duck", emoji: "🦆" },
              { name: "Jiaozi (Dumplings)", emoji: "🥟" },
              { name: "Zhajiangmian", emoji: "🍜" },
              { name: "Hot Pot", emoji: "🍲" },
            ],
          },
          {
            name: "Shandong",
            emoji: "🐟",
            dishes: [
              { name: "Braised Carp", emoji: "🐟" },
              { name: "Sweet & Sour Pork", emoji: "🍖" },
              { name: "Scallion Pancakes", emoji: "🥞" },
            ],
          },
        ],
      },
      {
        name: "Southern China",
        emoji: "🌊",
        description: "Dim sum, seafood, and Cantonese delicacy",
        subRegions: [
          {
            name: "Guangdong (Canton)",
            emoji: "🦐",
            dishes: [
              { name: "Dim Sum", emoji: "🥟" },
              { name: "Char Siu Bao", emoji: "🥐" },
              { name: "Wonton Soup", emoji: "🍜" },
              { name: "Roast Goose", emoji: "🦆" },
            ],
          },
        ],
      },
      {
        name: "Western China",
        emoji: "🌶️",
        description: "Fiery Sichuan peppercorns and numbing spices",
        subRegions: [
          {
            name: "Sichuan",
            emoji: "🔥",
            dishes: [
              { name: "Mapo Tofu", emoji: "🟥" },
              { name: "Kung Pao Chicken", emoji: "🍗" },
              { name: "Dan Dan Noodles", emoji: "🍜" },
              { name: "Hot Pot", emoji: "🍲" },
              { name: "Twice Cooked Pork", emoji: "🐖" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    description: "The pinnacle of culinary sophistication and artistry",
    regions: [
      {
        name: "Île-de-France (Paris)",
        emoji: "🗼",
        description: "Fine dining, pastries, and classic French cuisine",
        subRegions: [
          {
            name: "Paris",
            emoji: "🥐",
            dishes: [
              { name: "French Onion Soup", emoji: "🧅" },
              { name: "Croissant", emoji: "🥐" },
              { name: "Crème Brûlée", emoji: "🍮" },
              { name: "Duck Confit", emoji: "🦆" },
              { name: "Soufflé", emoji: "🍮" },
            ],
          },
        ],
      },
      {
        name: "Provence",
        emoji: "🌿",
        description: "Mediterranean herbs, olive oil, and sunshine",
        subRegions: [
          {
            name: "Marseille",
            emoji: "🌊",
            dishes: [
              { name: "Bouillabaisse", emoji: "🐟" },
              { name: "Ratatouille", emoji: "🫑" },
              { name: "Socca", emoji: "🥞" },
            ],
          },
        ],
      },
      {
        name: "Normandy & Brittany",
        emoji: "🧀",
        description: "Cream, butter, cider, and fresh seafood",
        subRegions: [
          {
            name: "Normandy",
            emoji: "🐄",
            dishes: [
              { name: "Sole Normande", emoji: "🐟" },
              { name: "Tarte Tatin", emoji: "🍎" },
              { name: "Camembert Cheese", emoji: "🧀" },
              { name: "Crepes", emoji: "🥞" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    description: "A melting pot of global flavors across diverse regions",
    regions: [
      {
        name: "Southern USA",
        emoji: "🎸",
        description: "BBQ, soul food, and comfort classics",
        subRegions: [
          {
            name: "Texas",
            emoji: "🤠",
            dishes: [
              { name: "Texas BBQ Beef Brisket", emoji: "🥩" },
              { name: "Chili con Carne", emoji: "🌶️" },
              { name: "Chicken Fried Steak", emoji: "🥩" },
              { name: "Breakfast Tacos", emoji: "🌮" },
            ],
          },
          {
            name: "Louisiana",
            emoji: "🎷",
            dishes: [
              { name: "Gumbo", emoji: "🍲" },
              { name: "Jambalaya", emoji: "🍚" },
              { name: "Beignets", emoji: "🍩" },
              { name: "Po' Boy", emoji: "🥖" },
            ],
          },
        ],
      },
      {
        name: "Northeast USA",
        emoji: "🦞",
        description: "Seafood, clam chowder, and NYC street food",
        subRegions: [
          {
            name: "New England",
            emoji: "⛵",
            dishes: [
              { name: "Clam Chowder", emoji: "🦪" },
              { name: "Lobster Roll", emoji: "🦞" },
              { name: "Boston Baked Beans", emoji: "🫘" },
            ],
          },
          {
            name: "New York City",
            emoji: "🗽",
            dishes: [
              { name: "New York Style Pizza", emoji: "🍕" },
              { name: "NY Cheesecake", emoji: "🍰" },
              { name: "Pastrami Sandwich", emoji: "🥪" },
              { name: "Bagel with Lox", emoji: "🥯" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    description: "A symphony of sweet, sour, salty, and spicy",
    regions: [
      {
        name: "Central Thailand",
        emoji: "🏯",
        description: "Royal cuisine and Bangkok's vibrant street food",
        subRegions: [
          {
            name: "Bangkok",
            emoji: "🌆",
            dishes: [
              { name: "Pad Thai", emoji: "🍜" },
              { name: "Green Curry", emoji: "🍛" },
              { name: "Tom Yum Soup", emoji: "🍲" },
              { name: "Mango Sticky Rice", emoji: "🥭" },
              { name: "Massaman Curry", emoji: "🍛" },
            ],
          },
        ],
      },
      {
        name: "Northern Thailand",
        emoji: "🌿",
        description: "Milder, herb-driven dishes influenced by Burmese cuisine",
        subRegions: [
          {
            name: "Chiang Mai",
            emoji: "🏔️",
            dishes: [
              { name: "Khao Soi", emoji: "🍜" },
              { name: "Sai Ua (Sausage)", emoji: "🌭" },
              { name: "Larb", emoji: "🥗" },
              { name: "Nam Prik Ong", emoji: "🌶️" },
            ],
          },
        ],
      },
      {
        name: "Southern Thailand",
        emoji: "🏝️",
        description: "Intense spices, coconut, and fresh seafood",
        subRegions: [
          {
            name: "Phuket",
            emoji: "🌴",
            dishes: [
              { name: "Gaeng Tai Pla", emoji: "🐟" },
              { name: "Yellow Curry", emoji: "🍛" },
              { name: "Seafood Satay", emoji: "🍢" },
            ],
          },
        ],
      },
    ],
  },
];
