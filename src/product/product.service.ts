import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/types/product';
import { Model } from 'mongoose';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { User } from 'src/types/user';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('owner');
  }
  async findByOwner(userId: string): Promise<Product[]> {
    return await this.productModel.find({ owner: userId }).populate('owner');
  }
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('owner');
    if(!product){
      throw new HttpException("prodct  does not exist", HttpStatus.NO_CONTENT)
    }
    return product.populate('owner');
  }
  async create(productDto: CreateProductDTO, user: User): Promise<Product> {
    const product = await this.productModel.create({
      ...productDto,
      owner: user,
    });
    await product.save();
    return product.populate('owner');
  }
  async update(
    id: string,
    productDto: UpdateProductDTO,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id);
    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'You do not own the product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return product.populate('owner');
  }
  async delete(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'You do not own the product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return product.populate('owner');
  }
}
