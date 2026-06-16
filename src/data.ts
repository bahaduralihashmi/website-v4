export interface TireProduct {
  id: string;
  name: string;
  brand: string;
  size: string;
  feature: string;
  price: number;
  badge: string;
  segment: 'hot' | 'new' | 'famous';
  image: string;
  description: string;
  stock?: number;
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  initials: string;
}

export const BUSINESS_INFO = {
  name: "Haider Brothers Traders",
  rating: 4.8,
  reviewsCount: 5,
  phone: "+92 302 4594403",
  phoneRaw: "+923024594403",
  whatsappUrl: "https://wa.me/923024594403",
  address: "36-C-1, Maulana Shaukat Ali Road, Block C-1 Faisal Town, Lahore, Punjab 54700, Pakistan",
  locationCode: "F8G5+H9, Lahore",
  hours: "Open 24 hours (24/7)",
  mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.1385474320295!2d74.30589377519962!3d31.476454149202534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919030037af462f%3A0xc479c225327c71d6!2sHaider%20Brothers%20Traders!5e0!3m2!1sen!2spk!4v1718500000000!5m2!1sen!2spk"
};

export const BRANDS = [
  { name: "Autogrip", hasDirectAccent: true },
  { name: "Michelin", hasDirectAccent: false },
  { name: "Bridgestone", hasDirectAccent: false },
  { name: "Pirelli", hasDirectAccent: false },
  { name: "Goodyear", hasDirectAccent: false },
  { name: "Dunlop", hasDirectAccent: false },
  { name: "General Tire", hasDirectAccent: false },
  { name: "Continental", hasDirectAccent: false },
  { name: "Yokohama", hasDirectAccent: false },
  { name: "Hankook", hasDirectAccent: false }
];

export const REVIEWS: Review[] = [
  {
    name: "gitsitmarketing",
    rating: 5,
    text: "Excellent service and quality of tires. My experience was good.",
    date: "1 month ago",
    initials: "GM"
  },
  {
    name: "M Bilal",
    rating: 5,
    text: "My experience was great with haider brother traders. They provided me good service and high quality product.",
    date: "2 months ago",
    initials: "MB"
  },
  {
    name: "Muhammad Ramzan",
    rating: 5,
    text: "Great quality and service.",
    date: "3 months ago",
    initials: "MR"
  },
  {
    name: "Zain Ul Abideen",
    rating: 4.5,
    text: "Very reliable place for 24/7 emergencies. Broke down late at night, and they fixed my alignment and tires quickly.",
    date: "4 months ago",
    initials: "ZA"
  },
  {
    name: "Ahmad Raza",
    rating: 5,
    text: "Genuine products at reasonable wholesale-level rates in Lahore. Highly recommended!",
    date: "5 months ago",
    initials: "AR"
  }
];

export const TIRE_PRODUCTS: TireProduct[] = [
  // --- HOT SELLING (9 products) ---
  {
    id: "hot-1",
    name: "Autogrip F107 Comfort",
    brand: "Autogrip",
    size: "185/65R14",
    feature: "All-season wet stability & 185/65R14 smooth ride",
    price: 12500,
    badge: "Hot Selling",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Budget-friendly comfort tyre optimized for classic sedan and hatchback daily driving. Low rolling noise, enhanced tread compound, and great drainage to prevent aquaplaning in Lahore's heavy monsoon seasons. Highly compatible with Corolla and older Civic variants."
  },
  {
    id: "hot-2",
    name: "Dunlop SP Touring T1",
    brand: "Dunlop",
    size: "175/65R15",
    feature: "Extra-durable rubber & premium fuel saver - 175/65R15",
    price: 14800,
    badge: "Best Seller",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Highly stable and optimized touring compound engineered to withstand rough tarmac, heatwaves, and long mileage. Outstanding choice for Toyota Yaris, Honda City, and Suzuki Swift owners in Pakistan who value long-lasting performance and maximum fuel economy."
  },
  {
    id: "hot-3",
    name: "Yokohama BluEarth-Es ES32",
    brand: "Yokohama",
    size: "195/65R15",
    feature: "Premium silica compound & low noise - 195/65R15",
    price: 21500,
    badge: "Premium Hot",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Premium JDM quiet tire with state-of-the-art nanocomposite silica compound. Delivers superior wet/dry road grip, luxurious shock-absorption over Lahore potholes, and unmatched stability at high speeds for modern Honda Civic, Toyota Corolla, and luxury hybrid vehicles."
  },
  {
    id: "hot-4",
    name: "General Tire Euro Glide",
    brand: "General Tire",
    size: "165/70R14",
    feature: "Locally optimized rugged tread - 165/70R14",
    price: 9800,
    badge: "Budget King",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Genuine local heavy-duty tire manufactured explicitly for Pakistani hot climates and uneven street grids. Strong side casing provides extreme puncture protection that is loved by Suzuki Cultus, Wagon R, and JDM imported hatchback drivers in Punjab."
  },
  {
    id: "hot-5",
    name: "Bridgestone Ecopia EP150",
    brand: "Bridgestone",
    size: "185/65R15",
    feature: "Ultra eco-friendly, fuel-efficiency design - 185/65R15",
    price: 18200,
    badge: "Hot Selling",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Advanced low-rolling technology reduces carbon footprint while saving up to 6% in fuel fuel-consumption on daily commutes. Solid wet braking performance makes this Ecopia series a prime product for Toyota Yaris, Honda City, and Suzuki Swift."
  },
  {
    id: "hot-6",
    name: "Mirage MR-162 Utility",
    brand: "General Tire", // Classifying Mirage as premium general import or general tier
    size: "145/80R13",
    feature: "Affordable Alto spec, long durability - 145/80R13",
    price: 8300,
    badge: "Alto Spec",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Extremely affordable imported tire featuring deep treads and extra-thick sidewalls designed to survive bad terrain. Specifically matches the highly popular Suzuki Alto, Daihatsu Mira, and generic 660cc imported Japanese kei cars in Lahore."
  },
  {
    id: "hot-7",
    name: "Dunlop ECO EC201 Eco-Drive",
    brand: "Dunlop",
    size: "145/80R13",
    feature: "Premium Alto comfort & safety grip - 145/80R13",
    price: 10500,
    badge: "Alto Premium",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "The ultimate premium radial upgrade for the Suzuki Alto and Wagon R community. Features ultra-quiet rolling technology, outstanding grip on dry asphalt, and superior control under emergency braking at tight city crossings."
  },
  {
    id: "hot-8",
    name: "Yokohama Advan dB V552",
    brand: "Yokohama",
    size: "215/55R17",
    feature: "Extreme noise reduction & supreme cushion - 215/55R17",
    price: 38000,
    badge: "Ultra Luxury",
    segment: "hot",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Incredibly quiet premium tyre designed for executive luxury. Uses Yokohama's signature chemical compound to cancel asphalt resonance. Provides a cloud-like ride for Honda Civic Oriel/RS, Toyota Corolla Altis Grande, and imported Honda Vezel models."
  },
  {
    id: "hot-9",
    name: "Michelin Primacy 4 Premium",
    brand: "Michelin",
    size: "215/60R16",
    feature: "World-class quiet touring & wet defense - 215/60R16",
    price: 44500,
    badge: "Elite Safety",
    segment: "hot",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Industry-standard for safety and comfort. Even after extensive mileage, its patented tire pattern drains water with consistent grip. Excellent match for high-profile luxury sedans like Honda Accord, Toyota Camry, and customized JDM vehicles."
  },
  
  // --- NEW BRANDS & ARRIVALS (8 products) ---
  {
    id: "new-1",
    name: "Autogrip SUV A606 Sport",
    brand: "Autogrip",
    size: "235/60R18",
    feature: "Rugged road tracking & heavy SUV compound - 235/60R18",
    price: 22000,
    badge: "New Arrival",
    segment: "new",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Rugged block styling and dual steel belts for midsize crossovers. Delivers long tread life, off-road traction, and stable high-speed tracking on Ring Road Lahore. Excellent fit for KIA Sportage, Hyundai Tucson, and Proton X70."
  },
  {
    id: "new-2",
    name: "Yokohama Geolandar A/T G015",
    brand: "Yokohama",
    size: "265/65R17",
    feature: "Extreme double-shield all-terrain - 265/65R17",
    price: 46000,
    badge: "New Arrival",
    segment: "new",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Designed for full-sized off-road SUVs. Offers severe snow-rated traction blocks and triple-polymer compound to resist extreme cuts/chipping on rough gravel and inter-city routes. Ideal for Toyota Hilux Revo, Toyota Fortuner, and Prado owners."
  },
  {
    id: "new-3",
    name: "Bridgestone Dueler H/P Sport",
    brand: "Bridgestone",
    size: "225/55R18",
    feature: "High-horsepower highway response - 225/55R18",
    price: 39500,
    badge: "Premium SUV",
    segment: "new",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Outstanding summer tire built to extract extreme cornering response and stable wet traction for premium crossover profiles. Perfect OEM spec for KIA Sportage, Hyundai Tucson, and MG HS sport package upgrades."
  },
  {
    id: "new-4",
    name: "Michelin Pilot Sport 5 Precision",
    brand: "Michelin",
    size: "225/45R17",
    feature: "Max sport handling & quick track response - 225/45R17",
    price: 35000,
    badge: "New Arrival",
    segment: "new",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Experience incredible luxury precise control. Features Dynamic Response technology for high cornering precision and immediate dry track response. Perfect premium upgrade for modern luxury sedans and modified sports custom vehicles."
  },
  {
    id: "new-5",
    name: "Continental PremiumContact 7 Pro",
    brand: "Continental",
    size: "195/55R15",
    feature: "Adaptive contact patch & top handling - 195/55R15",
    price: 19500,
    badge: "German Tech",
    segment: "new",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Adaptive tread design matches itself dynamically to wet or dry conditions for steady, confident braking. Brings elite European safety limits, low vibration, and precise handling to local JDM imports and sport sedans."
  },
  {
    id: "new-6",
    name: "General Tire Grabber AT3",
    brand: "General Tire",
    size: "265/65R17",
    feature: "All-terrain dual action traction - 265/65R17",
    price: 28500,
    badge: "New Arrival",
    segment: "new",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "High-traction all-terrain tyre with aggressive self-cleaning blocks. Developed specifically for SUV and pickup truck enthusiasts looking for tough off-road capability combined with stable highway dynamics inside Pakistan."
  },
  {
    id: "new-7",
    name: "Pirelli Cinturato P7 Verde",
    brand: "Pirelli",
    size: "205/60R16",
    feature: "Eco-impact compound & silent highway ride - 205/60R16",
    price: 24500,
    badge: "Italian Craft",
    segment: "new",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "High-end touring tire featuring hybrid polymer materials. Reduced tire weight and rolling resistance lead to immense fuel consumption cuts and lower road vibrations. Universally fits Honda Civic, Toyota Corolla, and imported JDM hatchbacks."
  },
  {
    id: "new-8",
    name: "Autogrip EcoSaver Radial",
    brand: "Autogrip",
    size: "165/65R14",
    feature: "Fuel conscious hatchback radial - 165/65R14",
    price: 11200,
    badge: "New Arrival",
    segment: "new",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Optimized radial tire designed with a robust eco-compound that evenly distributes vehicle weight. Extremely budget-friendly, delivering a quieter ride and reliable long treadwear for Suzuki Wagon R and imported Japanese JDM hatchbacks."
  },

  // --- BESTSELLING GLOBAL / FAMOUS (8 products) ---
  {
    id: "fam-1",
    name: "Dunlop Grandtrek AT20 Premium",
    brand: "Dunlop",
    size: "265/60R18",
    feature: "4x4 executive tire & heavy highway duty - 265/60R18",
    price: 48000,
    badge: "Famous",
    segment: "famous",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Wholesale-level standard luxury SUV highway tire. Combines quiet road manners with high structural integrity capable of carrying extreme loads. Highly popular for premium Toyota Fortuner, Land Cruiser Prado, and high-end 4x4 trucks."
  },
  {
    id: "fam-2",
    name: "General Tire Euro Star Radial",
    brand: "General Tire",
    size: "175/70R13",
    feature: "Classic local design, unbeatable cost - 175/70R13",
    price: 8900,
    badge: "Famous Classic",
    segment: "famous",
    image: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "The most famous local tire model of Pakistan. Engineered specifically to survive deep potholes and scorching heat. Highly cost-effective and dependable daily workhorse for Suzuki Mehran, Cultus, Wagon R, and small commercial taxis in Lahore."
  },
  {
    id: "fam-3",
    name: "Yokohama Geolandar CV G058",
    brand: "Yokohama",
    size: "215/70R16",
    feature: "Grand crossover luxury silent touring - 215/70R16",
    price: 26000,
    badge: "Famous",
    segment: "famous",
    image: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Engineered specifically to transform midsize crossover rides. Provides supreme dry/wet braking safety with Yokohama's proprietary micro-silica compound to drastically reduce interior cabin vibrations and low frequency hums. Fits Toyota RAV4, Kia Sportage base, and Tucson imports."
  },
  {
    id: "fam-4",
    name: "Pirelli P Zero High Performance",
    brand: "Pirelli",
    size: "245/40R19",
    feature: "Precision sports tracking & F1 DNA - 245/40R19",
    price: 58000,
    badge: "Elite Track",
    segment: "famous",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Legendary sports tire built using genuine Formula 1 racetrack heritage materials. Implements severe cornering stiffeners and specialized compound ratios for incredible braking under extreme speed. Ideal for Mercedes C-Class, E-Class, Audi A6, and sports cars."
  },
  {
    id: "fam-5",
    name: "Dunlop Sport Maxx RT2 Premium",
    brand: "Dunlop",
    size: "225/40R18",
    feature: "Motorsport grip & short braking - 225/40R18",
    price: 32000,
    badge: "Famous Sport",
    segment: "famous",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Bridges the gap between street driving and track-level responsiveness. Dual compound notches adapt dynamically to high cornering heat to preserve high traction limits. Excellent choice for custom Civic upgrades, Audi A3, and Mercedes models."
  },
  {
    id: "fam-6",
    name: "Goodyear Eagle F1 Asymmetric 6",
    brand: "Goodyear",
    size: "235/35R19",
    feature: "Asphalt adaptation & high force braking - 235/35R19",
    price: 42000,
    badge: "Famous",
    segment: "famous",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Highly adaptive contact profile reacts instantly to rapid weight shifts. Patented carbon black compounds offer outstanding asphalt feedback and top-level wet braking metrics. Perfectly matches premium sports packages and high-performance sedans."
  },
  {
    id: "fam-7",
    name: "Hankook Ventus S1 evo3 Elite",
    brand: "Hankook",
    size: "225/40R18",
    feature: "OE-grade precise tracking - 225/40R18",
    price: 30000,
    badge: "Famous",
    segment: "famous",
    image: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Original Equipment (OE) selected by Audi, BMW, and Mercedes-Benz. Employs advanced aramid reinforcement belts to prevent tread expansion, maximizing speed stability and minimizing road vibration noise. Elite high-speed passenger car tire."
  },
  {
    id: "fam-8",
    name: "Autogrip Winter Grip W609 Radial",
    brand: "Autogrip",
    size: "195/65R15",
    feature: "Snow/mud traction & deep siped wet protection",
    price: 14000,
    badge: "Famous",
    segment: "famous",
    image: "/src/assets/images/winter_tire_1781509513584.jpg",
    description: "Featuring deep self-cleaning channels and microscopic sipes, this model delivers superior road traction during wet rainy days and heavy sludge. Highly recommended for winters and mountainous tourism in Murree, Swat, or Gilgit. Matches Corolla/Civic sizing."
  }
];
