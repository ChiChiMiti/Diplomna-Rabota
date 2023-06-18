import { User } from "@/models";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const db = getFirestore();

export const createUser = async (email: string, id: string) => {
  const ref = doc(db, "users", id);

  return setDoc(ref, {
    email,
    createdAt: new Date(),
    id,
    role: "patient",
  });
};

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return <User[]>snapshot.docs.flatMap((d) => ({
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp).toDate(),
    id: d.id,
  }));
};

export const getUserById = async (id: string) => {
  const snapshot = await getDoc(doc(db, `users/${id}`));

  return <User>{ ...snapshot.data(), id: snapshot.id };
};

export const updateUser = async (data: Partial<User>) => {
  const ref = doc(db, `users/${data.id}`);

  return setDoc(ref, data, {
    merge: true,
  });
};