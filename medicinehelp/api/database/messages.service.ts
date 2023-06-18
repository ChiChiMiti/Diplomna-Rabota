import { Message } from "@/models/message";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

const db = getFirestore();

export const createMessage = (data: Omit<Message, "id">) => {
  return addDoc(collection(db, `requests/${data.requestId}/messages`), data);
};

export const getMessages = async (requestId: string) => {
  const snapshot = await getDocs(
    query(
      collection(db, `requests/${requestId}/messages`),
      orderBy("createdAt")
    )
  );

  return <Message[]>snapshot.docs.flatMap((d) => ({
    ...(d.data() as Message),
    appointment: (d.data().createdAt as Timestamp).toDate(),
    id: d.id,
  }));
};
