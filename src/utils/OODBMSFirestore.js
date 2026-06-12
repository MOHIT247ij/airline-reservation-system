// src/utils/OODBMSFirestore.js

// Import required Firestore functions
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * 🧠 OODBMSFirestore Class
 * A small helper/wrapper to interact with Firestore
 * like an Object-Oriented Database (OODBMS).
 *
 * ✅ It allows storing and retrieving complete JS objects (with nested objects/arrays)
 * instead of rows and tables like in RDBMS.
 */
export class OODBMSFirestore {
  constructor(config) {
    // Each organization or app can pass its Firestore collection config here.
    this.config = config;
  }

  /**
   * 🧹 sanitizeData(obj)
   * This helper function cleans the object before saving:
   * - Removes undefined values
   * - Removes NaN numbers
   * - Recursively cleans nested objects and arrays
   * This is needed because Firestore doesn’t allow invalid data types.
   */
  sanitizeData(obj) {
    if (Array.isArray(obj)) {
      // If it's an array → clean each item and remove undefined ones
      return obj
        .map((item) => this.sanitizeData(item))
        .filter((item) => item !== undefined);
    } else if (obj && typeof obj === "object") {
      // If it's an object → clean each key/value
      const cleanObj = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanValue = this.sanitizeData(value);
        if (
          cleanValue !== undefined &&
          !(typeof cleanValue === "number" && isNaN(cleanValue))
        ) {
          cleanObj[key] = cleanValue;
        }
      }
      return cleanObj;
    } else if (obj === undefined) {
      // Remove undefined values entirely
      return undefined;
    }
    // Base case → return value as-is
    return obj;
  }

  /**
   * 💾 save(collectionName, id, object)
   * Stores or updates a document with a custom ID.
   * (Like an "upsert" → update if exists, insert if not.)
   */
  async save(collectionName, id, object) {
    const docRef = doc(db, collectionName, String(id));

    // Clean invalid fields before saving
    const cleanObject = this.sanitizeData(object);

    // Save to Firestore (merge:true means it won’t overwrite existing fields)
    await setDoc(docRef, cleanObject, { merge: true });
    return { id: String(id) }; // Return the ID for reference
  }

  /**
   * ✨ create(collectionName, object)
   * Adds a new object with an auto-generated Firestore ID.
   */
  async create(collectionName, object) {
    const colRef = collection(db, collectionName);
    const cleanObject = this.sanitizeData(object);
    const docRef = await addDoc(colRef, cleanObject);
    return { id: docRef.id }; // Return generated ID
  }

  /**
   * 📋 getAll(collectionName)
   * Fetches all documents from a collection and returns them as an array.
   */
  async getAll(collectionName) {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /**
   * 🔍 getById(collectionName, id)
   * Fetches a single document by ID.
   * Returns null if it doesn’t exist.
   */
  async getById(collectionName, id) {
    const docRef = doc(db, collectionName, String(id));
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }

  /**
   * 🗑️ delete(collectionName, id)
   * Deletes a document by its ID.
   */
  async delete(collectionName, id) {
    await deleteDoc(doc(db, collectionName, String(id)));
    return { id: String(id), deleted: true };
  }

  /**
   * 🎯 queryByField(collectionName, field, op, value)
   * Performs a Firestore query, e.g.:
   * queryByField("doctors", "age", ">", 40)
   * Returns all matching documents.
   */
  async queryByField(collectionName, field, op, value) {
    const q = query(collection(db, collectionName), where(field, op, value));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
