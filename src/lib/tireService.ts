// Bridge file forwarding products data queries to our clean Firebase Service
import { TireProduct } from "../data";
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  ProductDocument,
  DEFAULT_TIR_PRODUCTS_SEED
} from "./firebaseService";
import { 
  collection, 
  getDocs, 
  addDoc 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

export interface CustomReview {
  id?: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  initials: string;
}

// Map compatibility fields from FirebaseService Product to TireProduct
function mapToTireProduct(p: ProductDocument): TireProduct {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    size: p.size,
    feature: p.feature,
    price: p.price,
    badge: p.badge || (p.category === "hot-selling" ? "Hot Selling" : p.category === "new-brands" ? "New Arrival" : "Famous"),
    segment: p.segment || (p.category === "hot-selling" ? "hot" : p.category === "new-brands" ? "new" : "famous"),
    image: p.image || p.imageUrl,
    description: p.description || `Premium quality tire from ${p.brand}.`
  };
}

// 1. Fetch Tyres from Firestore (migrated to the new 'products' collection)
export async function getTireProducts(): Promise<TireProduct[]> {
  try {
    const list = await getAllProducts();
    return list.map(mapToTireProduct);
  } catch (error) {
    console.warn("Could not load from Firestore 'products', falling back.", error);
    return SEED_TYRE_PRODUCTS;
  }
}

// 2. Add or Edit Tyre in Firestore (migrated to the new 'products' collection)
export async function saveTireProduct(tire: TireProduct): Promise<void> {
  const categoryMapped = tire.segment === "hot" ? "hot-selling" : tire.segment === "new" ? "new-brands" : "famous";
  
  const payload: Partial<ProductDocument> = {
    name: tire.name,
    brand: tire.brand,
    size: tire.size,
    feature: tire.feature,
    price: Number(tire.price),
    category: categoryMapped as any,
    segment: tire.segment,
    badge: tire.badge,
    imageUrl: tire.image,
    image: tire.image,
    stock: 10, // default stock allocation
    description: tire.description
  };

  try {
    // If tire ID starts with custom- or looks like a temp, we check if it is existing in firestore
    const existing = await getTireProducts();
    const match = existing.find(e => e.id === tire.id);
    
    if (match) {
      await updateProduct(tire.id, payload);
    } else {
      await addProduct({
        ...payload,
        name: tire.name,
        brand: tire.brand,
        size: tire.size,
        feature: tire.feature,
        price: Number(tire.price),
        category: categoryMapped as any,
        stock: 10,
        imageUrl: tire.image
      } as ProductDocument);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `products/${tire.id}`);
  }
}

// 3. Delete Tyre from Firestore 'products'
export async function deleteTireProduct(tireId: string): Promise<void> {
  try {
    await deleteProduct(tireId);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${tireId}`);
  }
}

// 4. Fetch Reviews from Firestore
export async function getReviews(): Promise<CustomReview[]> {
  const collectionName = "reviews";
  try {
    const list: CustomReview[] = [];
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as CustomReview);
    });
    return list;
  } catch (error) {
    console.warn("Could not retrieve custom reviews from Firestore.", error);
    return [];
  }
}

// 5. Add Review to Firestore
export async function addReview(review: Omit<CustomReview, "id">): Promise<string> {
  const collectionName = "reviews";
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      name: review.name,
      rating: Number(review.rating),
      text: review.text,
      date: review.date,
      initials: review.initials,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
    return "error";
  }
}

// Fallback local seed data
export const SEED_TYRE_PRODUCTS: TireProduct[] = DEFAULT_TIR_PRODUCTS_SEED.map((p, i) => ({
  id: `seed-${p.brand.toLowerCase()}-${i + 1}`,
  name: p.name,
  brand: p.brand,
  size: p.size,
  feature: p.feature,
  price: p.price,
  badge: p.category === "hot-selling" ? "Hot Selling" : p.category === "new-brands" ? "New Arrival" : "Famous",
  segment: p.category === "hot-selling" ? "hot" : p.category === "new-brands" ? "new" : "famous",
  image: p.imageUrl,
  description: p.description || ""
}));

// Pak-Specific Fitments specifications model structure
export interface CarFitment {
  make: string;
  model: string;
  variants: {
    name: string;
    recommendedSize: string;
    engine: string;
    pressure: string;
  }[];
}

export const PAK_CAR_FITMENTS: CarFitment[] = [
  {
    make: "Toyota",
    model: "Corolla",
    variants: [
      { name: "Altis Grande", recommendedSize: "195/65R15", engine: "1800cc", pressure: "32 PSI" },
      { name: "GLI / XLI", recommendedSize: "185/65R15", engine: "1300cc", pressure: "30 PSI" },
      { name: "Altis 1.6", recommendedSize: "195/65R15", engine: "1600cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Toyota",
    model: "Yaris",
    variants: [
      { name: "ATIV X CVT", recommendedSize: "185/60R15", engine: "1500cc", pressure: "32 PSI" },
      { name: "GLI MT / CVT", recommendedSize: "185/60R15", engine: "1300cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Toyota",
    model: "Fortuner",
    variants: [
      { name: "Sigma 4 Diesel", recommendedSize: "265/60R18", engine: "2800cc", pressure: "32 PSI" },
      { name: "2.7 G Petrol", recommendedSize: "265/65R17", engine: "2700cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Toyota",
    model: "Hilux Revo",
    variants: [
      { name: "Revo V", recommendedSize: "265/60R18", engine: "2800cc", pressure: "32 PSI" },
      { name: "Revo G / Single Cabin", recommendedSize: "265/65R17", engine: "2800cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Toyota",
    model: "Vitz",
    variants: [
      { name: "Hybrid / F", recommendedSize: "165/70R14", engine: "1000cc / 1500cc", pressure: "30 PSI" },
      { name: "Jewela / U", recommendedSize: "185/60R15", engine: "1300cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Honda",
    model: "Civic",
    variants: [
      { name: "Oriel", recommendedSize: "215/55R16", engine: "1800cc", pressure: "32 PSI" },
      { name: "RS Turbo", recommendedSize: "215/50R17", engine: "1500cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Honda",
    model: "City",
    variants: [
      { name: "1.5L Aspire", recommendedSize: "185/55R16", engine: "1500cc", pressure: "32 PSI" },
      { name: "1.2L i-VTEC", recommendedSize: "175/65R15", engine: "1200cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Honda",
    model: "BR-V",
    variants: [
      { name: "i-VTEC S", recommendedSize: "195/60R16", engine: "1500cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Suzuki",
    model: "Alto",
    variants: [
      { name: "VXL / AGS", recommendedSize: "145/80R13", engine: "660cc", pressure: "30 PSI" },
      { name: "VXR / VX", recommendedSize: "145/80R13", engine: "660cc", pressure: "28 PSI" }
    ]
  },
  {
    make: "Suzuki",
    model: "Cultus",
    variants: [
      { name: "VXL / AGS", recommendedSize: "165/70R14", engine: "1000cc", pressure: "30 PSI" },
      { name: "VXR", recommendedSize: "165/70R14", engine: "1000cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Suzuki",
    model: "Swift",
    variants: [
      { name: "GLX CVT", recommendedSize: "185/55R16", engine: "1200cc", pressure: "32 PSI" },
      { name: "GL MT / CVT", recommendedSize: "185/60R15", engine: "1200cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Suzuki",
    model: "Wagon R",
    variants: [
      { name: "VXL / AGS", recommendedSize: "145/80R13", engine: "1000cc", pressure: "30 PSI" },
      { name: "VXR", recommendedSize: "145/80R13", engine: "1000cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Suzuki",
    model: "Mehran",
    variants: [
      { name: "VXR / VX", recommendedSize: "145/70R12", engine: "800cc", pressure: "28 PSI" }
    ]
  },
  {
    make: "Kia",
    model: "Sportage",
    variants: [
      { name: "Alpha", recommendedSize: "225/55R18", engine: "2000cc", pressure: "34 PSI" },
      { name: "AWD / FWD", recommendedSize: "225/55R18", engine: "2000cc", pressure: "34 PSI" }
    ]
  },
  {
    make: "Kia",
    model: "Picanto",
    variants: [
      { name: "Automatic 1.0", recommendedSize: "165/60R14", engine: "1000cc", pressure: "30 PSI" },
      { name: "Manual 1.0", recommendedSize: "165/60R14", engine: "1000cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Kia",
    model: "Stonic",
    variants: [
      { name: "EX Plus", recommendedSize: "195/55R16", engine: "1400cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Hyundai",
    model: "Tucson",
    variants: [
      { name: "GLS Sport", recommendedSize: "225/55R18", engine: "2000cc", pressure: "33 PSI" },
      { name: "Ultimate", recommendedSize: "225/55R18", engine: "2000cc", pressure: "33 PSI" }
    ]
  },
  {
    make: "Hyundai",
    model: "Elantra",
    variants: [
      { name: "GLS 2.0", recommendedSize: "205/55R16", engine: "2000cc", pressure: "32 PSI" },
      { name: "GL 1.6", recommendedSize: "205/55R16", engine: "1600cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Hyundai",
    model: "Sonata",
    variants: [
      { name: "Sonata 2.5L", recommendedSize: "235/45R18", engine: "2500cc", pressure: "32 PSI" },
      { name: "Sonata 2.0L", recommendedSize: "215/55R17", engine: "2000cc", pressure: "32 PSI" }
    ]
  },
  {
    make: "Changan",
    model: "Alsvin",
    variants: [
      { name: "Lumiere 1.5", recommendedSize: "185/55R15", engine: "1500cc", pressure: "32 PSI" },
      { name: "Comfort 1.3 / 1.5", recommendedSize: "185/55R15", engine: "1300cc / 1500cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "Changan",
    model: "Oshan X7",
    variants: [
      { name: "FutureSense", recommendedSize: "225/55R19", engine: "1500cc Turbo", pressure: "34 PSI" },
      { name: "Comfort", recommendedSize: "225/55R19", engine: "1500cc Turbo", pressure: "34 PSI" }
    ]
  },
  {
    make: "MG",
    model: "HS",
    variants: [
      { name: "Essence / Trophy", recommendedSize: "235/50R18", engine: "1500cc Turbo", pressure: "32 PSI" }
    ]
  },
  {
    make: "Haval",
    model: "H6",
    variants: [
      { name: "HEV (Hybrid)", recommendedSize: "225/55R19", engine: "1500cc HEV", pressure: "33 PSI" },
      { name: "1.5T / 2.0T AWD", recommendedSize: "225/55R19", engine: "1500cc / 2000cc", pressure: "33 PSI" }
    ]
  },
  {
    make: "Haval",
    model: "Jolion",
    variants: [
      { name: "High Grade", recommendedSize: "225/55R18", engine: "1500cc Turbo", pressure: "32 PSI" }
    ]
  },
  {
    make: "Proton",
    model: "Saga",
    variants: [
      { name: "Ace A/T", recommendedSize: "185/55R15", engine: "1300cc", pressure: "32 PSI" },
      { name: "Standard M/T / A/T", recommendedSize: "185/60R14", engine: "1300cc", pressure: "30 PSI" }
    ]
  },
  {
    make: "DFSK",
    model: "Glory 580",
    variants: [
      { name: "Glory 580 Pro", recommendedSize: "225/60R17", engine: "1500cc Turbo", pressure: "32 PSI" }
    ]
  }
];

