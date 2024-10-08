import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../db/firebase";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

export const fetchData = async (username, password) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userFound = false;
  const result = querySnapshot.docs.map((doc) => {
    let obj = {};
    if (doc.data().username === username && doc.data().password === password) {
      userFound = true;
    }
    obj[doc.data().username] = doc.id;
    return obj;
  });
  let obj = {};
  for (let i of result) {
    obj = { ...obj, ...i };
  }

  return [userFound, obj];
};

export const addData = async (username, password) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      username,
      password,
      books: [],
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export async function addBook(userId, book) {
  const userDocRef = doc(db, "users", userId);

  try {
    await updateDoc(userDocRef, {
      books: arrayUnion(book),
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

export async function removeBook(userId, book) {
  const userDocRef = doc(db, "users", userId);

  try {
    await updateDoc(userDocRef, {
      books: arrayRemove(book),
    });
    console.log("Document removed successfully!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

export const fetchBooks = async (username) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let ans = [];
  querySnapshot.docs.forEach((doc) => {
    if (doc.data().username === username) {
      ans = [...doc.data().books];
    }
  });

  return ans;
};
