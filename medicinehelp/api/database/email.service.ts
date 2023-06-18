import { Email } from "@/models";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const createEmail = (data: Email) => {
  return addDoc(collection(db, "mails"), data);
};
