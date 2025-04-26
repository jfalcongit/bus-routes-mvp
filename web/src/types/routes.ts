export interface Stop {
  name: string;
  lat: number;
  lng: number;
}

export interface Trip {
  departureTime: string;
  arrivalTime: string;
}

export interface Route {
  id: string;
  fare: number;
  capacity: number;
  stops: Stop[];
  trips: Trip[];
}
