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
import { Request } from "../../models";

const db = getFirestore();

export const createRequest = (data: Omit<Request, "id">) => {
  return addDoc(collection(db, "requests"), data);
};

export const getRequests = async () => {
  const snapshot = await getDocs(
    query(collection(db, "requests"), orderBy("appointment"))
  );

  return <Request[]>snapshot.docs.flatMap((d) => ({
    ...d.data(),
    appointment: (d.data().appointment as Timestamp).toDate(),
    id: d.id,
  }));
};

export const deleteRequest = (id: string) => {
  return deleteDoc(doc(db, `requests/${id}`));
};

export const getRequestsByPatientId = async (patientId: string) => {
  const snapshot = await getDocs(
    query(collection(db, "requests"), where("patientId", "==", patientId))
  );

  return <Request[]>snapshot.docs.flatMap((d) => ({
    ...d.data(),
    appointment: (d.data().appointment as Timestamp).toDate(),
    id: d.id,
  }));
};

export const updateRequest = async (data: Request) => {
  const ref = doc(db, `requests/${data.id}`);

  return setDoc(ref, data, {
    merge: true,
  });
};
