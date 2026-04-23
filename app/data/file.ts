export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

export const cars: Car[] = [
  {
    id: 1,
    brand: "BMW",
    model: "320d",
    year: 2018,
    price: 18500,
    image: "/bmw.jpg",
  },
  {
    id: 2,
    brand: "Mercedes",
    model: "C200",
    year: 2017,
    price: 17500,
    image: "/mercedes.jpg",
  },
  {
    id: 3,
    brand: "Audi",
    model: "A4",
    year: 2019,
    price: 19500,
    image: "/audi.jpg",
  },
];
