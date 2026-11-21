const u=(id,w=900)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=82'

export const demoCatalogue={
  fashion:{
    brand:'FORME STUDIO',tag:'THE DECEMBER WARDROBE',subtitle:'Clothes for the moments you remember.',
    accent:'#a31c31',bg:'#f5ece5',hero:u('photo-1539109136881-3be0616acf4b',1400),
    second:u('photo-1515886657613-9f3515b0c78f',1400),
    promise:'Contemporary pieces, thoughtful cuts and the freedom to wear them your way.',
    categories:['All','Dresses','Tops','Outerwear','Accessories'],
    products:[
      {name:'Sculpted Midi Dress',category:'Dresses',price:42000,img:u('photo-1539109136881-3be0616acf4b'),desc:'A sharp silhouette for the whole season.'},
      {name:'Winter Mood Jacket',category:'Outerwear',price:55000,img:u('photo-1515886657613-9f3515b0c78f'),desc:'An oversized layer with personality.'},
      {name:'Sunset Muse Set',category:'Tops',price:37000,img:u('photo-1496747611176-843222e1e57c'),desc:'Easy, editorial and beautifully considered.'},
      {name:'After Hours Look',category:'Dresses',price:48000,img:u('photo-1503342217505-b0a15ec3261c'),desc:'For every December invitation.'},
      {name:'The City Layer',category:'Outerwear',price:39000,img:u('photo-1574201635302-388dd92a4c3f'),desc:'A wardrobe staple with a twist.'},
      {name:'Studio Essentials',category:'Accessories',price:24000,img:u('photo-1483985988355-763728e1935b'),desc:'Small details, big impact.'},
    ]
  },
  food:{
    brand:'SUNDAY TABLE',tag:'FESTIVE MENU · MADE WITH LOVE',subtitle:'The good food is coming.',
    accent:'#b62b28',bg:'#fff3e5',hero:u('photo-1504674900247-0877df9cc836',1400),
    second:u('photo-1569718212165-3a8278d5f624',1400),
    promise:'Beautifully prepared party trays, signature dishes and sweet things for sharing.',
    categories:['All','Party Trays','Rice & Mains','Desserts','Small Chops'],
    products:[
      {name:'December Feast Tray',category:'Party Trays',price:38000,img:u('photo-1504674900247-0877df9cc836'),desc:'A crowd-pleasing table, delivered.'},
      {name:'Golden Rice Bowl',category:'Rice & Mains',price:9000,img:u('photo-1569718212165-3a8278d5f624'),desc:'Richly seasoned and made fresh.'},
      {name:'Celebration Cake',category:'Desserts',price:25000,img:u('photo-1578985545062-69928b1d9587'),desc:'A beautiful sweet ending.'},
      {name:'Sweet Little Box',category:'Desserts',price:14500,img:u('photo-1551024506-0bccd828d307'),desc:'Treats made for gifting.'},
      {name:'Saturday Special',category:'Rice & Mains',price:13500,img:u('photo-1547592180-85f173990554'),desc:'Fresh ingredients in every bite.'},
      {name:'The Party Starter',category:'Small Chops',price:18000,img:u('photo-1546069901-ba9599a7e63c'),desc:'Small bites, big celebrations.'},
    ]
  },
  gifts:{
    brand:'THE GIFT DEPT.',tag:'THE JOY OF GIVING',subtitle:'Beautiful gifts, thoughtfully presented.',
    accent:'#326e5c',bg:'#eee7d7',hero:u('photo-1549465220-1a8b9238cd48',1400),second:u('photo-1513201099705-a9746e1e201f',1400),
    promise:'Gift boxes and hampers for people who deserve the extra thought.',
    categories:['All','Hampers','Corporate','Gift Boxes'],
    products:[
      {name:'The Classic Hamper',category:'Hampers',price:42000,img:u('photo-1549465220-1a8b9238cd48')},
      {name:'Little Luxury Box',category:'Gift Boxes',price:18000,img:u('photo-1513201099705-a9746e1e201f')},
      {name:'Office Thank You',category:'Corporate',price:75000,img:u('photo-1607344645866-009c320b63e0')},
    ]
  },
  beauty:{
    brand:'MUSE BEAUTY',tag:'THE BEAUTY EDIT',subtitle:'A little shine for your December plans.',
    accent:'#aa5f66',bg:'#f7e4e4',hero:u('photo-1524504388940-b1c1722653e1',1400),second:u('photo-1512290923902-8a9f81dc236c',1400),
    promise:'Hair, beauty and soft glamour for every celebration.',
    categories:['All','Hair','Makeup','Skin'],
    products:[
      {name:'Glam Makeup Session',category:'Makeup',price:32000,img:u('photo-1524504388940-b1c1722653e1')},
      {name:'Wig Installation',category:'Hair',price:28000,img:u('photo-1512290923902-8a9f81dc236c')},
      {name:'Holiday Glow',category:'Skin',price:22000,img:u('photo-1596755389378-c31d21fd1273')},
    ]
  },
  events:{
    brand:'ATELIER EVENTS',tag:'EVERY MOMENT COUNTS',subtitle:'The season is worth celebrating.',
    accent:'#7c374b',bg:'#eee1df',hero:u('photo-1511795409834-ef04bbd61622',1400),second:u('photo-1519741497674-611481863552',1400),
    promise:'Creative production, beautiful spaces and memories worth keeping.',
    categories:['All','Celebrations','Photography','Decor'],
    products:[
      {name:'The Intimate Edit',category:'Celebrations',price:160000,img:u('photo-1511795409834-ef04bbd61622')},
      {name:'Portrait Session',category:'Photography',price:85000,img:u('photo-1519741497674-611481863552')},
      {name:'Event Styling',category:'Decor',price:120000,img:u('photo-1507504031003-b417219a0fde')},
    ]
  },
  accessories:{
    brand:'OBJECTS OF DESIRE',tag:'DETAILS WITH CHARACTER',subtitle:'The finishing touch is everything.',
    accent:'#7d4e35',bg:'#eee5da',hero:u('photo-1523275335684-37898b6baf30',1400),second:u('photo-1548036328-c9fa89d128fa',1400),
    promise:'Bags, jewellery and timeless little objects worth keeping.',
    categories:['All','Bags','Watches','Jewellery'],
    products:[
      {name:'The Everyday Tote',category:'Bags',price:45000,img:u('photo-1548036328-c9fa89d128fa')},
      {name:'Everyday Timepiece',category:'Watches',price:36000,img:u('photo-1523275335684-37898b6baf30')},
      {name:'Gold Details',category:'Jewellery',price:24000,img:u('photo-1515562141207-7a88fb7ce338')},
    ]
  },
  hospitality:{
    brand:'STAY SUNDAY',tag:'YOUR SEASON, YOUR SPACE',subtitle:'Stay a little longer.',
    accent:'#275967',bg:'#e0e9e7',hero:u('photo-1600607687939-ce8a6c25118c',1400),second:u('photo-1600566753190-17f0baa2a6c3',1400),
    promise:'Thoughtful spaces, welcoming interiors and city stays made easy.',
    categories:['All','Apartments','Experiences'],
    products:[
      {name:'The City Suite',category:'Apartments',price:85000,img:u('photo-1600607687939-ce8a6c25118c')},
      {name:'The Weekend Loft',category:'Apartments',price:120000,img:u('photo-1600566753190-17f0baa2a6c3')},
      {name:'Sunday Experience',category:'Experiences',price:45000,img:u('photo-1600607687920-4e2a09cf159d')},
    ]
  },
}
