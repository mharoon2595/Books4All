import React from "react";
import { collection, getDocs, addDoc, increment } from "firebase/firestore";
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

export const addData = async (name, author, genre, number) => {
  try {
    const docRef = await addDoc(collection(db, "booksNo"), {
      name,
      author,
      genre,
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
