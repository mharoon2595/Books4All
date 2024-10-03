import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  increment,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../db/firebase";

export const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "booksNo"));

  const result = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  let obj = result.reduce((acc, { name, number, id }) => {
    acc[name] = [number, id];
    return acc;
  }, {});
  return obj;
};

// export const checkDB = async (title) => {
//   const querySnapshot = await getDocs(collection(db, "booksNo"));
//   let ans = false;
//   querySnapshot.docs.forEach((doc) => {
//     if (doc.data().name === title) {
//       ans = true;
//     }
//   });
//   return ans;
// };

// export const fetchCount = async (title) => {
//   const querySnapshot = await getDocs(collection(db, "booksNo"));
//   let count;
//   querySnapshot.docs.forEach((doc) => {
//     if (doc.data().name === title) {
//       count = doc.data().number;
//     }
//   });
//   return count;
// };

export const setAvailability = async (bookTitles) => {
  const availabilityMap = {};
  const batchSize = 30;
  const batches = Math.ceil(bookTitles.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const batchTitles = bookTitles.slice(i * batchSize, (i + 1) * batchSize);
    const q = query(
      collection(db, "booksNo"),
      where("name", "in", batchTitles)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      availabilityMap[doc.data().name] = doc.data().number;
    });
  }

  const batch = writeBatch(db);
  const missingBooks = [];

  for (let book of bookTitles) {
    if (!availabilityMap[book]) {
      let rand = Math.ceil(Math.random() * 50);
      const newDocRef = doc(collection(db, "booksNo"));
      batch.set(newDocRef, { name: book, number: rand });
      availabilityMap[book] = rand;
      missingBooks.push(book);
    }
  }

  if (missingBooks.length > 0) {
    await batch.commit();
    console.log(`Added ${missingBooks.length} new books to the database.`);
  }

  return availabilityMap;
};

export const addData = async (name, number) => {
  try {
    const docRef = await addDoc(collection(db, "booksNo"), {
      name,
      number,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export async function updateCount(userId) {
  const userDocRef = doc(db, "booksNo", userId);

  try {
    await updateDoc(userDocRef, {
      number: increment(-1),
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

export async function increaseCount(userId) {
  const userDocRef = doc(db, "booksNo", userId);

  try {
    await updateDoc(userDocRef, {
      number: increment(1),
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
