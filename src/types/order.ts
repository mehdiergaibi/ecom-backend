import { Document } from 'mongoose';
import { User } from './user';
import { Product } from './product';

interface Products {
  product: Product;
  quantity: number;
}

export interface Order extends Document { // Documet has a lot of functions
  owner: User;
  totalPrice: number;
  products: Products[];
  craeted: Date;
}
