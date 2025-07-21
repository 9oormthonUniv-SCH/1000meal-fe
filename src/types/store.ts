export interface Store {
  id: string;
  name: string;
  menu: string[];
  remain: number;
  address: string;
  phone: string;
  hours: string;
  position: {
    lat: number;
    lng: number;
  };
  weeklyMenu: string[][];
}