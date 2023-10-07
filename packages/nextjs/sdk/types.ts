export interface ILocationMessagePayload {
  lat: number;
  lng: number;
  senderPublicKey: string;
  senderAddress: string;
}

export interface ILocationMessage {
  timestamp: number;
  sender: string;
  message: ILocationMessagePayload;
  nonce: number;
}

export interface ILocationChat {
  timestamp: number;
  sender: string;
}
