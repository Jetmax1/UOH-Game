import fs from 'fs';
import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };

const sectionOffsets = {
  main: { originX: 0, originY: 0, width: 1700, height: 1350 },
  east: { originX: 1700, originY: 0, width: 2400, height: 1600 },
  west: { originX: -1400, originY: 1350, width: 1400, height: 1200 },
  south: { originX: 0, originY: 1350, width: 2000, height: 1900 },
  amphi_valley: { originX: 1600, originY: 1350, width: 1600, height: 1200 },
  checkdam_buffer: { originX: 400, originY: 1000, width: 1400, height: 1000 }
};

// Aliases lookup table for real-world campus vernacular
const customAliases = {
  1: ["Checkdam", "UoH Check Dam", "South Lake Dam"],
  2: ["BioNEST", "ASPIRE Incubation Center", "Life Sciences Incubator"],
  3: ["SLS", "School of Life Sciences", "Manjula Lab", "Biology Complex"],
  4: ["Botanical Nursery", "SLS Greenhouse", "Flora Research Nursery"],
  5: ["CIS", "Centre for Integrated Studies", "Integrated Masters Building"],
  6: ["CIS Study Lounge", "South Reading Room", "Student Study Hall"],
  7: ["Nano Center", "Nanotech Lab", "Centre for Nanotechnology"],
  8: ["ISH Central", "International Hostel", "Foreign Students Dorm"],
  9: ["South Canteen", "South Complex", "Shopping Complex South"],
  10: ["TIH", "Tagore House", "International Scholars House"],
  11: ["MH-J", "Hostel J", "Men's Hostel J"],
  12: ["MH-I", "Hostel I", "Men's Hostel I"],
  13: ["MHK", "MHK Dorm", "Moulana Abul Kalam Azad Hostel"],
  14: ["LH-8", "Hostel 8", "Ladies Hostel 8"],
  15: ["LH-10", "Hostel 10", "Ladies Hostel 10"],
  16: ["Volleyball Ground", "South Sports Court"],
  17: ["Globbo Boulder", "Granite Wonder", "Spherical Rock"],
  18: ["Chinna Gudi", "Checkdam Temple", "Hillock Temple"],
  19: ["Old Tamarind Tree", "Heritage Tree", "Checkdam Tamarind"],
  20: ["Amphitheatre Lake", "Amphi Pond", "South Lake 2"],
  21: ["Open Air Theatre", "Amphi", "UoH Amphitheatre"],
  22: ["Hidden Lake", "Sanctuary Lake", "Valley Lake"],
  23: ["Horticulture Farm", "East Nursery", "Plant Nursery"],
  24: ["Cherry Boulder", "East Rock 1", "Cherry Hill Monolith"],
  25: ["Aquarium Monolith", "East Rock 2", "Cave Rock"],
  26: ["Buffalo Pond", "Main Campus Lake", "North Lake"],
  27: ["Masoom's Rock", "Balancing Rock", "Protected Monolith", "Mushroom Cap Rock"],
  28: ["Peacock Lake", "Mor Sarovar", "East Campus Lake"],
  29: ["Auroya Dam", "North Check Dam", "Auroya Reservoir"],
  30: ["Indoor Stadium", "University Gym", "Fitness Center"],
  31: ["SBI UoH", "State Bank ATM", "Campus Bank"],
  32: ["MH-C", "Hostel C", "Men's Hostel C"],
  33: ["North Complex", "North Canteen", "Xerox & Stationery Complex"],
  34: ["MH-H", "Hostel H", "Men's Hostel H"],
  35: ["MH-D", "Hostel D", "Men's Hostel D"],
  36: ["Administration Block", "Admin Quad", "Registrar Office", "Vice Chancellor Building"],
  37: ["Admissions", "Academic Section", "Counseling Cell"],
  38: ["Health Centre", "Campus Clinic", "Medical Center"],
  39: ["Chai Kiosk", "East Snack Corner", "Tea Point"],
  40: ["CABB", "Bovine Research Center", "Dairy Science Unit"],
  41: ["Small Gate", "HCU Small Gate Security", "East Entry Gate"],
  42: ["Karthik Xerox", "Sim & Print Shop", "Telecom Store"],
  43: ["Music Department", "Performing Arts Music Wing", "Sangeet Bhavan"],
  44: ["CV Raman Hall", "Physics Auditorium", "Science Hall"],
  45: ["SCIS", "Computer Science Dept", "Informatics Block", "AI & ML Labs"],
  46: ["SRK Lecture Halls", "Silver Jubilee LHC", "Radhakrishnan Halls"],
  47: ["DST Auditorium", "Phule Hall", "Savitribai Auditorium"],
  48: ["Social Sciences", "SSS Complex", "Humanities & Social Sciences Wing"],
  49: ["CIL", "Electronics Block", "Instrumentation Lab", "Central Instruments"],
  50: ["CNCS", "Cognitive Sciences", "Neural Theory Lab", "Computational Neuroscience"],
  51: ["IGM Library", "Central Library", "Indira Gandhi Memorial Library", "UoH Library"],
  52: ["Humanities School", "Languages Complex", "Literature Wing"],
  53: ["Sanskrit Dept", "Computational Linguistics Sanskrit", "Sanskrit Studies"],
  54: ["Theatre Studio", "Performing Arts Wing", "SN School Theatre"],
  55: ["Media Lab", "Broadcast Studio", "Bol Hyderabad Radio", "Communication Dept"],
  56: ["SN School", "Sarojini Naidu School", "Arts & Communication Main"],
  57: ["VC Camp", "Vice Chancellor Office Annex"],
  58: ["VC Lodge", "Vice Chancellor Residence", "VC Bungalow"],
  59: ["Sukoon", "Sukoon Tea & Maggi", "East Student Canteen"],
  60: ["NRC Canteen", "UGC Canteen", "Science Canteen"],
  61: ["Chemistry Annex", "School of Chemistry", "Chemical Sciences Block"],
  62: ["CR Rao Institute", "AIMSCS", "CR Rao Advanced Math & Cryptography"],
  63: ["Tennis Arena", "UoH Tennis Courts", "Lawn Tennis"],
  64: ["LH-1", "Hostel 1", "Ladies Hostel 1"],
  65: ["LH-2", "Hostel 2", "Ladies Hostel 2"],
  66: ["LH-3", "Hostel 3", "LH-3 Dining Mess"],
  67: ["LH-4", "Hostel 4", "Ladies Hostel 4"],
  68: ["MH-M", "Hostel M", "Men's Hostel M"],
  69: ["Laundry Center", "Campus Dhobi", "Dhobi Ghat & Press"],
  70: ["Faculty Quarters", "East Residences", "Professors Enclave"],
  71: ["East Gate", "East Security Boom Barrier", "East Checkpoint"],
  72: ["Guest House", "Silver Jubilee Guest House", "VIP Transit House"],
  73: ["Workshop", "Engineering Workshop", "Central Mechanical Shop"],
  74: ["Post Office", "India Post UoH", "Campus Post"],
  75: ["IDC Gate", "Gate 3", "West Security Gate 3"],
  76: ["IDC", "Interdisciplinary Center", "West Research Block"],
  77: ["Campus School", "Kendriya Vidyalaya / UoH Model School"],
  78: ["Sajon Ray", "West Kirana", "West Campus Groceries"],
  79: ["LH-9", "Hostel 9", "Ladies Hostel 9"],
  80: ["LH-7", "Hostel 7", "Ladies Hostel 7"],
  81: ["MH-L", "Hostel L", "Men's Hostel L"],
  82: ["Faculty A", "South Faculty Quarters", "Type A Residences"],
  83: ["South Gate", "Main South Entrance", "Gachibowli South Gate"],
  84: ["SIP", "Study India Program", "International Exchange Center"],
  85: ["Convocation Pavilion", "Central Rotunda", "Floral Arena"],
  86: ["Main Entrance Monument", "UoH Stone Memorial", "Campus Pillar Monument"],
  87: ["Shooting Range", "SATG Range", "Athletics Target Ground"],
  88: ["RV Panchajanya", "Panchajanya Towers", "Kondapur Highrise Enclave"],
  89: ["Sai Temple", "Campus Sai Baba Mandir", "Sri Sai Baba Temple"],
  90: ["IIL", "Indian Immunologicals", "Immunology Research Unit"],
  91: ["Water Tank", "Overhead Tower", "Campus Water Reservoir"],
  92: ["Balayogi Stadium", "GMC Balayogi Athletics", "Athletic Track Colosseum"],
  93: ["Gachibowli Aquatics", "Indoor Arena", "Olympic Swimming Stadium"],
  94: ["Football Ground", "Sports Turf Field", "Synthetic Soccer Turf"],
  95: ["Sports Parking", "Stadium Visitor Parking", "Gachibowli Parking Area"]
};

// Generate canonical slug from name
function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const enrichedLocations = locations.map(loc => {
  const sec = sectionOffsets[loc.section] || { originX: 0, originY: 0 };
  const worldX = sec.originX + loc.x;
  const worldY = sec.originY + loc.y;

  const aliases = customAliases[loc.id] || [loc.shortName, loc.name];
  const canonicalId = makeSlug(loc.shortName || loc.name);

  return {
    id: loc.id,
    canonicalId,
    name: loc.name,
    shortName: loc.shortName || loc.name,
    aliases,
    section: loc.section,
    zone: loc.zone || 'central',
    category: loc.category,
    x: loc.x,
    y: loc.y,
    worldPosition: {
      x: worldX,
      y: worldY
    },
    width: loc.width,
    height: loc.height,
    points: loc.points || 50,
    description: loc.description,
    trivia: loc.trivia,
    interactive: !!(loc.hasInterior || loc.isNightCanteen || loc.isTemple || loc.isSCIS || loc.isBalayogi || loc.isGachibowliStadium),
    discoverable: true,
    hasInterior: !!loc.hasInterior,
    ...(loc.interiorType ? { interiorType: loc.interiorType } : {}),
    ...(loc.isNightCanteen ? { isNightCanteen: true } : {}),
    ...(loc.isTemple ? { isTemple: true } : {}),
    ...(loc.isMajorWonder ? { isMajorWonder: true } : {}),
    ...(loc.isMonument ? { isMonument: true } : {}),
    ...(loc.isShootingRange ? { isShootingRange: true } : {}),
    ...(loc.isRVPanchajanya ? { isRVPanchajanya: true } : {}),
    ...(loc.isSaiBabaTemple ? { isSaiBabaTemple: true } : {}),
    ...(loc.isWaterTank ? { isWaterTank: true } : {}),
    ...(loc.isBalayogi ? { isBalayogi: true } : {}),
    ...(loc.isGachibowliStadium ? { isGachibowliStadium: true } : {}),
    ...(loc.isFootballField ? { isFootballField: true } : {}),
    ...(loc.isParkingArea ? { isParkingArea: true } : {}),
    ...(loc.isCentralDome ? { isCentralDome: true } : {}),
    ...(loc.isGate ? { isGate: true } : {})
  };
});

fs.writeFileSync('src/data/locations.json', JSON.stringify(enrichedLocations, null, 2), 'utf8');
console.log(`Successfully enriched ${enrichedLocations.length} locations in src/data/locations.json!`);
