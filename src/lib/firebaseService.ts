import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, auth, storage, handleFirestoreError, OperationType } from "./firebase";

// Collection Constant
const COLLECTION_NAME = "products";

// Fully compatible type interface satisfying both the user requested structure and frontend components
export interface ProductDocument {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  category: "hot-selling" | "new-brands" | "famous";
  segment?: "hot" | "new" | "famous"; // UI fallback field
  badge?: string; // UI fallback field
  stock: number;
  feature: string;
  imageUrl: string;
  image?: string; // UI fallback field
  description?: string; // UI fallback field
  createdAt?: Timestamp | Date | any;
}

// ---------------------------------------------------------
// 9. ERROR HANDLING & NETWORK DETECTOR
// ---------------------------------------------------------

/**
 * Checks if the system browser environment has active internet connectivity
 */
export function isBrowserOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/**
 * Registers a callback for changes in native internet connectivity state
 */
export function registerNetworkStateListener(callback: (online: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

// ---------------------------------------------------------
// 3. CRUD FUNCTIONS (TypeScript / JavaScript Module)
// ---------------------------------------------------------

/**
 * Fills helper values into the model object so that it remains completely compatible
 * across the vintage UI segments & new strict collection layouts.
 */
function fillCompatibilityFields(data: any): any {
  const result = { ...data };
  
  // Set alternative images
  if (result.imageUrl && !result.image) {
    result.image = result.imageUrl;
  }
  if (result.image && !result.imageUrl) {
    result.imageUrl = result.image;
  }
  
  // Set category/segment mapping
  if (result.category && !result.segment) {
    if (result.category === "hot-selling") result.segment = "hot";
    else if (result.category === "new-brands") result.segment = "new";
    else if (result.category === "famous") result.segment = "famous";
  }
  if (result.segment && !result.category) {
    if (result.segment === "hot") result.category = "hot-selling";
    else if (result.segment === "new") result.category = "new-brands";
    else if (result.segment === "famous") result.category = "famous";
  }

  // Supply default badges
  if (!result.badge) {
    if (result.category === "hot-selling") result.badge = "Hot Selling";
    else if (result.category === "new-brands") result.badge = "New Arrival";
    else result.badge = "Famous";
  }

  // Fallback description
  if (!result.description) {
    result.description = `Premium tire profile configured for high grip and safety under high heat-cycle Pakistani road asphalt conditions.`;
  }

  // Type coercions
  if (result.price !== undefined) result.price = Number(result.price);
  if (result.stock !== undefined) result.stock = Number(result.stock);

  return result;
}

/**
 * Adds a new product document to Firestore 'products' collection
 */
export async function addProduct(productData: Omit<ProductDocument, "id">): Promise<string> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to add product. You are currently offline.");
  }
  const payload = fillCompatibilityFields(productData);
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...payload,
      createdAt: serverTimestamp()
    });
    // Set ID on document itself
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    throw error;
  }
}

/**
 * Fetches all products with real-time snapshot support optionally, or via one-shot call
 */
export async function getAllProducts(isRetry: boolean = false): Promise<ProductDocument[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const results: ProductDocument[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push(fillCompatibilityFields({ ...data, id: doc.id }) as ProductDocument);
    });
    
    // Check and trigger auto-seeding if collection returns empty
    if (results.length === 0 && !isRetry) {
      console.log("Empty 'products' collection found. Seeding with 12 defaults.");
      await seedDefaultProducts();
      return await getAllProducts(true);
    }
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    throw error;
  }
}

/**
 * Updates an existing product document
 */
export async function updateProduct(productId: string, updatedData: Partial<ProductDocument>): Promise<void> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to update product. You are currently offline.");
  }
  const payload = fillCompatibilityFields(updatedData);
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${productId}`);
    throw error;
  }
}

/**
 * Deletes a product from the database
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to delete product. You are currently offline.");
  }
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${productId}`);
    throw error;
  }
}

/**
 * Increases or decreases all prices in the inventory database by a given percentage.
 * Example: bulkUpdatePrices(10) increases all rates by 10%, while bulkUpdatePrices(-5) cuts them by 5%.
 */
export async function bulkUpdatePrices(percentage: number): Promise<void> {
  if (!isBrowserOnline()) {
    throw new Error("No network connectivity. Bulk operations are disabled.");
  }
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    let count = 0;

    querySnapshot.forEach((document) => {
      const data = document.data() as ProductDocument;
      const originalPrice = Number(data.price) || 0;
      const multiplier = 1 + (percentage / 100);
      const newPrice = Math.round(originalPrice * multiplier);
      
      batch.update(doc(db, COLLECTION_NAME, document.id), { price: newPrice });
      count++;
    });

    if (count > 0) {
      await batch.commit();
      console.log(`Successfully completed bulk price update on ${count} products.`);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/bulkUpdate`);
    throw error;
  }
}

/**
 * Returns products with stock levels strictly below the threshold value
 */
export async function getLowStockProducts(threshold: number = 5): Promise<ProductDocument[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("stock", "<", threshold));
    const querySnapshot = await getDocs(q);
    const results: ProductDocument[] = [];
    querySnapshot.forEach((doc) => {
      results.push(fillCompatibilityFields({ ...doc.data(), id: doc.id }));
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    throw error;
  }
}

/**
 * Searches the collection for products with matching names or manufacturer brands
 */
export async function searchProducts(searchQuery: string): Promise<ProductDocument[]> {
  // Firestore does not natively support multi-field partial matching easily in client SDK,
  // so we fetch all and apply high-performance filter locally to ensure maximum reliability and speed.
  try {
    const all = await getAllProducts();
    const queryLower = searchQuery.toLowerCase().trim();
    if (!queryLower) return all;
    
    return all.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.brand.toLowerCase().includes(queryLower) ||
      p.size.toLowerCase().includes(queryLower)
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Filter products specifically by database category classification
 */
export async function filterByCategory(category: "hot-selling" | "new-brands" | "famous"): Promise<ProductDocument[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const results: ProductDocument[] = [];
    querySnapshot.forEach((doc) => {
      results.push(fillCompatibilityFields({ ...doc.data(), id: doc.id }));
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    throw error;
  }
}

// ---------------------------------------------------------
// 4. AUTHENTICATION FUNCTIONS
// ---------------------------------------------------------

/**
 * Authenticates an administrator using standard email and password
 */
export async function loginAdmin(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login attempt failed:", error);
    throw new Error(error.message || "Invalid authentication credentials.");
  }
}

/**
 * Standard security signout for administrators
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Signout failed.");
  }
}

/**
 * Attaches a state change listener tracking authentications
 */
export function checkAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

/**
 * Utility to register fresh admin personnel accounts
 */
export async function createAdminUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create administrator user.");
  }
}

// ---------------------------------------------------------
// 5. STORAGE FUNCTIONS
// ---------------------------------------------------------

/**
 * Uploads a tire image binary file to the Firebase Storage bucket
 */
export async function uploadProductImage(file: File, productName: string): Promise<string> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to upload image. Network is currently offline.");
  }
  try {
    const cleanName = productName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const timestamp = Date.now();
    const storageRef = ref(storage, `product-images/${cleanName}_${timestamp}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error: any) {
    console.error("Storage image upload failure:", error);
    throw new Error(error.message || "Failed to store product asset image.");
  }
}

/**
 * Deletes standard file objects from the Firebase storage bucket using their download addresses
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to deleted image. Offline mode.");
  }
  try {
    // Extract file reference path from firebase download URI
    const decodedUrl = decodeURIComponent(imageUrl);
    const relativePathStart = decodedUrl.indexOf("/o/") + 3;
    const relativePathEnd = decodedUrl.indexOf("?alt=");
    
    if (relativePathStart > 2 && relativePathEnd > relativePathStart) {
      const filePath = decodedUrl.substring(relativePathStart, relativePathEnd);
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }
  } catch (error: any) {
    console.warn("Storage item cleanup ignored (possibly using an external image link):", error.message);
  }
}

// ---------------------------------------------------------
// 7. SEED DATA FUNCTION
// ---------------------------------------------------------

// Exhaustive real Pakistan market default dataset encompassing exactly 12 products
export const DEFAULT_TIR_PRODUCTS_SEED: Omit<ProductDocument, "id">[] = [
  // --- HOT SELLING ---
  {
    name: "Autogrip F107 Comfort Grip",
    brand: "Autogrip",
    size: "185/65R14",
    price: 12500,
    category: "hot-selling",
    stock: 15,
    feature: "All-season wet grip & stability - 185/65R14",
    imageUrl: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Designed for premium everyday passenger cars. Delivers superior compound performance in all seasons with low road noise levels. Size: 185/65R14."
  },
  {
    name: "Autogrip SUV A606 Rugged",
    brand: "Autogrip",
    size: "235/60R18",
    price: 22000,
    category: "hot-selling",
    stock: 4, // low stock flag
    feature: "Off-road rugged tread design - 235/60R18",
    imageUrl: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Aggressive tread blocks and heavy-duty compound for SUVs. Provides high durability on rugged tracks, gravel, and highway driving alike. Size: 235/60R18."
  },
  {
    name: "General Tire Grabber AT3",
    brand: "General Tire",
    size: "265/65R17",
    price: 28500,
    category: "hot-selling",
    stock: 8,
    feature: "All-terrain robust capability - 265/65R17",
    imageUrl: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Developed to meet the needs of SUV, pick-up truck and off-road vehicle drivers who want high command and high-traction performance. Size: 265/65R17."
  },
  {
    name: "Bridgestone Turanza T005",
    brand: "Bridgestone",
    size: "205/55R16",
    price: 21000,
    category: "hot-selling",
    stock: 12,
    feature: "Premium comfort & low noise rating - 205/55R16",
    imageUrl: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Flagship luxury touring tire providing superior control in wet and dry conditions, with fuel efficiency optimization. Size: 205/55R16."
  },

  // --- NEW BRANDS / NEW ARRIVALS ---
  {
    name: "Michelin Pilot Sport 5",
    brand: "Michelin",
    size: "225/45R17",
    price: 35000,
    category: "new-brands",
    stock: 3, // low stock flag
    feature: "Ultra-high performance & control - 225/45R17",
    imageUrl: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Live each driving moment to the fullest. Dynamic response technology ensures high precision handling and short braking distances. Size: 225/45R17."
  },
  {
    name: "Pirelli Cinturato P7 Eco",
    brand: "Pirelli",
    size: "205/60R16",
    price: 24500,
    category: "new-brands",
    stock: 7,
    feature: "Eco-friendly, low rolling resistance - 205/60R16",
    imageUrl: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Green performance luxury tire developed for modern cars. High safety levels, low fuel consumption, and eco-friendly raw materials. Size: 205/60R16."
  },
  {
    name: "Yokohama Geolandar CV G058",
    brand: "Yokohama",
    size: "215/70R16",
    price: 26000,
    category: "new-brands",
    stock: 9,
    feature: "Crossover/SUV quiet touring - 215/70R16",
    imageUrl: "/src/assets/images/suv_tire_1781509472580.jpg",
    description: "Formidable wet grip with advanced CV silica compound. Designed to deliver confident handling and long wear life for modern crossovers. Size: 215/70R16."
  },
  {
    name: "Continental PremiumContact 7",
    brand: "Continental",
    size: "195/55R15",
    price: 19500,
    category: "new-brands",
    stock: 14,
    feature: "Outstanding safety & wet braking - 195/55R15",
    imageUrl: "/src/assets/images/comfort_tire_1781509452553.jpg",
    description: "Experience absolute driving comfort and peace of mind. Outstanding safety on wet roads and superior wet braking efficiency. Size: 195/55R15."
  },

  // --- BESTSELLING GLOBAL / FAMOUS Products ---
  {
    name: "Dunlop Sport Maxx RT2",
    brand: "Dunlop",
    size: "225/40R18",
    price: 32000,
    category: "famous",
    stock: 2, // low stock flag
    feature: "Ultra-high performance sport traction - 225/40R18",
    imageUrl: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Champion grip and braking performance. Motorsport-derived compound offers supreme steering precision and curve cornering. Size: 225/40R18."
  },
  {
    name: "Goodyear Eagle F1 Asymmetric 6",
    brand: "Goodyear",
    size: "235/35R19",
    price: 42000,
    category: "famous",
    stock: 11,
    feature: "Max grip, sports performance - 235/35R19",
    imageUrl: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Ready for anything. Adaptable contact patch ensures extreme asphalt feedback. Excellent performance in both wet and dry tracks. Size: 235/35R19."
  },
  {
    name: "Hankook Ventus S1 evo3 Elite",
    brand: "Hankook",
    size: "225/40R18",
    price: 30000,
    category: "famous",
    stock: 6,
    feature: "Luxury sports OE high response rating - 225/40R18",
    imageUrl: "/src/assets/images/sport_tire_1781509490802.jpg",
    description: "Original Equipment (OE) for BMW, Audi, and Mercedes. Highlights high response speed, high durability, and lower rolling noise. Size: 225/40R18."
  },
  {
    name: "Autogrip Winter Grip W609 Extreme",
    brand: "Autogrip",
    size: "195/65R15",
    price: 14000,
    category: "famous",
    stock: 5,
    feature: "Extreme snow & water grip traction - 195/65R15",
    imageUrl: "/src/assets/images/winter_tire_1781509513584.jpg",
    description: "Heavy-siped tread design that grips perfectly during heavy rain, wet mud, and cold winter situations. Ensures reliable road security. Size: 195/65R15."
  }
];

/**
 * Checks if the products collection is empty and fills it with 12 premium tyres if needed
 */
export async function seedDefaultProducts(): Promise<void> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("Database 'products' collection is already populated. Seeding aborted.");
      return;
    }

    console.log("Initiating premium 12 product configurations cloud seed operation.");
    
    // Batch write to optimize bandwidth
    const batch = writeBatch(db);
    
    for (let i = 0; i < DEFAULT_TIR_PRODUCTS_SEED.length; i++) {
      const item = DEFAULT_TIR_PRODUCTS_SEED[i];
      const cleanBrand = item.brand.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const customId = `seed-${cleanBrand}-${i + 1}`;
      const payload = fillCompatibilityFields({
        ...item,
        id: customId,
        createdAt: new Date()
      });
      
      const docRef = doc(db, COLLECTION_NAME, customId);
      batch.set(docRef, payload);
    }
    
    await batch.commit();
    console.log("Database seeded successfully with exactly 12 default tires!");
  } catch (error) {
    console.error("Failure while running cloud seeding:", error);
  }
}

// ---------------------------------------------------------
// 8. REAL-TIME LISTENERS
// ---------------------------------------------------------

/**
 * Sets up a live listener on the main collections. Realizes reactive UI state
 * updates on item modifications.
 */
export function onProductsSnapshot(callback: (products: ProductDocument[]) => void): () => void {
  const q = query(collection(db, COLLECTION_NAME));
  
  return onSnapshot(q, (snapshot) => {
    const results: ProductDocument[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      results.push(fillCompatibilityFields({ ...data, id: doc.id }) as ProductDocument);
    });
    callback(results);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
}

// ---------------------------------------------------------
// 10. EXPORT / IMPORT FUNCTIONS
// ---------------------------------------------------------

/**
 * Downloads the complete active database catalog as a structured JSON file instantly from the browser
 */
export async function exportToJSON(): Promise<void> {
  try {
    const allProducts = await getAllProducts();
    const dataString = JSON.stringify(allProducts, null, 2);
    
    // Trigger localized file download in client runtime
    const blob = new Blob([dataString], { type: "application/json" });
    const fileAnchor = document.createElement("a");
    fileAnchor.href = URL.createObjectURL(blob);
    fileAnchor.download = `haider_brothers_products_backup_${Date.now()}.json`;
    document.body.appendChild(fileAnchor);
    fileAnchor.click();
    document.body.removeChild(fileAnchor);
  } catch (error) {
    console.error("Export file creation error: ", error);
    alert("Export operation encountered failures. Check network status.");
  }
}

/**
 * Uploads a user supplied JSON backup file, checks for duplicates, and uploads novel configurations
 */
export async function importFromJSON(jsonFile: File): Promise<{ imported: number; duplicates: number }> {
  if (!isBrowserOnline()) {
    throw new Error("Unable to import product index while offline.");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result;
        if (typeof fileContent !== "string") {
          throw new Error("Invalid file readings.");
        }
        
        const parsedData = JSON.parse(fileContent);
        const productsToImport: any[] = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        // Fetch existing configurations to handle duplicate prevention by names and size matching
        const existingProducts = await getAllProducts();
        
        let importCount = 0;
        let duplicateCount = 0;
        
        const batch = writeBatch(db);
        
        for (const item of productsToImport) {
          // Normalize names & sizes check for solid uniqueness check
          const isDuplicate = existingProducts.some(ep => 
            ep.name.toLowerCase().trim() === item.name?.toLowerCase().trim() &&
            ep.size.toLowerCase().trim() === item.size?.toLowerCase().trim()
          );

          if (isDuplicate) {
            duplicateCount++;
            continue;
          }

          const uniqueId = item.id || `imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const payload = fillCompatibilityFields({
            ...item,
            id: uniqueId,
            createdAt: new Date()
          });

          const docRef = doc(db, COLLECTION_NAME, uniqueId);
          batch.set(docRef, payload);
          importCount++;
        }

        if (importCount > 0) {
          await batch.commit();
        }

        resolve({ imported: importCount, duplicates: duplicateCount });
      } catch (error: any) {
        console.error("Failed to parse or save backup file:", error);
        reject(new Error(error.message || "Invalid JSON or database security rules violation during upload."));
      }
    };
    reader.onerror = () => reject(new Error("File read error."));
    reader.readAsText(jsonFile);
  });
}

// ---------------------------------------------------------
// 11. VISITOR TRACKING & TRAFFIC METRICS
// ---------------------------------------------------------

function getOrCreateSessionId(): string {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return "session-fallback";
  }
  let sid = window.sessionStorage.getItem("hb_visitor_sid");
  if (!sid) {
    sid = "sid-" + Math.random().toString(36).substring(2, 15) + "-" + Date.now();
    window.sessionStorage.setItem("hb_visitor_sid", sid);
  }
  return sid;
}

/**
 * Logs a standard visitor page view event into the Firestore visitors collection
 */
export async function logVisitorInfo(pagePath: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const sessionId = getOrCreateSessionId();
    const userAgent = window.navigator.userAgent || "Unknown UA";
    const language = window.navigator.language || "en";
    
    // Quick OS signature parsing
    let platform = "Other / Web";
    const ua = userAgent.toLowerCase();
    if (ua.includes("windows")) platform = "Windows";
    else if (ua.includes("macintosh") || ua.includes("mac os")) platform = "macOS";
    else if (ua.includes("android")) platform = "Android";
    else if (ua.includes("iphone") || ua.includes("ipad")) platform = "iOS";
    else if (ua.includes("linux")) platform = "Linux";

    // Build unique document key
    const customId = `vis-${sessionId.substring(4, 16)}-${Date.now()}`;
    const docRef = doc(db, "visitors", customId);
    
    await setDoc(docRef, {
      sessionId,
      userAgent: userAgent.substring(0, 500),
      platform,
      language,
      pagePath,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    // Fail silently so analytics tracking never disrupts primary showroom client flow
    console.warn("Analytics logging bypassed:", error);
  }
}

export interface VisitorRecord {
  id: string;
  sessionId: string;
  userAgent: string;
  platform: string;
  language: string;
  pagePath: string;
  timestamp: any;
}

/**
 * Retrieves the sequential log of website visitation reports
 */
export async function getVisitorLogs(): Promise<VisitorRecord[]> {
  try {
    const q = query(collection(db, "visitors"));
    const querySnapshot = await getDocs(q);
    const results: VisitorRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        sessionId: data.sessionId || "",
        userAgent: data.userAgent || "",
        platform: data.platform || "",
        language: data.language || "",
        pagePath: data.pagePath || "",
        timestamp: data.timestamp
      });
    });
    
    // Order chronologically by descending timestamp order
    results.sort((a, b) => {
      const tA = a.timestamp?.seconds || 0;
      const tB = b.timestamp?.seconds || 0;
      return tB - tA;
    });
    
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "visitors");
    throw error;
  }
}

/**
 * Adds a new email address to the newsletter subscribers list in Firestore.
 */
export async function subscribeNewsletter(email: string): Promise<void> {
  const collectionName = "subscribers";
  if (!isBrowserOnline()) {
    throw new Error("Unable to subscribe. You are currently offline.");
  }
  
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please present a valid email format.");
  }

  try {
    // Build a secure document ID based on the email (replaces special characters) matching the rules regex limit.
    const customId = `sub-${cleanEmail.replace(/[^a-zA-Z0-9_-]/g, "_")}`.substring(0, 128);
    const docRef = doc(db, collectionName, customId);
    
    await setDoc(docRef, {
      email: cleanEmail,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
    throw error;
  }
}


