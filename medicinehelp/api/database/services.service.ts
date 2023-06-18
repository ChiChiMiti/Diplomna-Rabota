import { Service, Locale } from "@/models";
import {
  doc,
  getFirestore,
  setDoc,
  deleteField,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

const db = getFirestore();

export const getServices = async (locale: Locale) => {
  const snapshot = await getDocs(collection(db, "services"));

  return <Service[]>snapshot.docs.flatMap((d) => {
    const data = d.data() as Service;

    return {
      ...d.data(),
      title: locale === "bg" ? data.bgTitle : data.enTitle,
      description: locale === "bg" ? data.bgDescription : data.enDescription,
      id: d.id,
    };
  });
};

export const updateService = async (data: Partial<Service>) => {
  const ref = doc(db, `services/${data.id}`);

  return setDoc(ref, data, {
    merge: true,
  });
};

export const deleteService = async (serviceId: string) => {
  const ref = doc(db, `services/${serviceId}`);

  return deleteDoc(ref);
};
