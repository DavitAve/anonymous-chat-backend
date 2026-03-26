export type User = {
  userId: string;
  age: string;
  gender: string;
  partnerAges: string[];
  partnerGender: string;
};

export type Message = {
  text: string;
  senderId: string;
};
