export enum ServiceType {
  INJECTIONS_BG = "Инжекции",
  CANNULA_BG = "Абокати и венозни вливания",
  BLOOD_DRAW_BG = "Домашно посещение за вземане на кръв, секрети и даване на урина за лабораторни изследвания",
  CATHETER_BG = "Катетър",
  ELECTROCARDIOGRAM_BG = "ЕКГ",
  GENERAL_CONDITION_BG = "Домашно посещение за проследяване на общото състояние",
}

export enum ServiceType {
  INJECTIONS_EN = "INJECTIONS",
  CANNULA_EN = "ABOCATES AND INTRAVENOUS INFUSIONS",
  BLOOD_DRAW_EN = "Home visit to collect blood, secretions and give urine for laboratory tests",
  CATHETER_EN = "Catheter",
  ELECTROCARDIOGRAM_EN = "EKG",
  GENERAL_CONDITION_EN = "Home visit to follow up on general condition",
}

export type Service = {
  id: string;
  title: ServiceType;
  description: string;
  bgTitle: ServiceType;
  enTitle: ServiceType;
  bgDescription: string;
  enDescription: string;
};

const injectionsImages = [
  "/injections1.png",
  "/injections2.png",
  "/injections3.jpg",
  "/injections4.png",
  "/injections5.png",
  "/injections6.png",
];

const bloodDrawImages = [
  "/blood_draw1.png",
  "/blood_draw2.png",
  "/blood_draw3.png",
];

const cannulaImages = [
  "/cannula1.png",
  "/cannula2.png",
  "/cannula3.jpg",
  "/cannula4.png",
];

const catheterImages = ["/catheter1.png", "/catheter2.png"];

const electrocardiogramImages = [
  "/electrocardiogram1.png",
  "/electrocardiogram2.png",
  "/electrocardiogram3.png",
  "/electrocardiogram4.png",
];

const generalConditionImages = [
  "/general_condition1.png",
  "/general_condition2.png",
  "/general_condition3.png",
  "/general_condition4.png",
  "/general_condition5.png",
  "/general_condition6.png",
];

export const associateServiceWithImages = (type: ServiceType) =>
  ({
    [ServiceType.INJECTIONS_BG]: injectionsImages,
    [ServiceType.INJECTIONS_EN]: injectionsImages,
    [ServiceType.BLOOD_DRAW_BG]: bloodDrawImages,
    [ServiceType.BLOOD_DRAW_EN]: bloodDrawImages,
    [ServiceType.CANNULA_BG]: cannulaImages,
    [ServiceType.CANNULA_EN]: cannulaImages,
    [ServiceType.CATHETER_BG]: catheterImages,
    [ServiceType.CATHETER_EN]: catheterImages,
    [ServiceType.ELECTROCARDIOGRAM_BG]: electrocardiogramImages,
    [ServiceType.ELECTROCARDIOGRAM_EN]: electrocardiogramImages,
    [ServiceType.GENERAL_CONDITION_BG]: generalConditionImages,
    [ServiceType.GENERAL_CONDITION_EN]: generalConditionImages,
  }[type]);
