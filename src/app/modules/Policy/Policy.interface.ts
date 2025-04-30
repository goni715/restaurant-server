
export type TPolicyType = "privacy-policy" | "about-us" |  "terms-condition";

export interface IPolicy {
  type: TPolicyType;
  content: string;
};

