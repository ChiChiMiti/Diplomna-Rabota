import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { Question, Request } from "../../models";

const db = getFirestore();

export const createQuestion = (data: Omit<Question, "id">) => {
  return addDoc(collection(db, "questions"), data);
};

export const getQuestions = async () => {
  const snapshot = await getDocs(
    query(collection(db, "questions"), orderBy("createdAt", "desc"))
  );

  return <Question[]>snapshot.docs.flatMap((d) => ({
    ...(d.data() as Question),
    createdAt: (d.data().createdAt as Timestamp).toDate(),
    id: d.id,
  }));
};
