export interface ILocationMessage {
  timestamp: number;
  sender: string;
  message: {
    lat: number;
    lng: number;
  };
  nonce: number;
}

export interface ILocationChat {
  timestamp: number;
  sender: string;
}
