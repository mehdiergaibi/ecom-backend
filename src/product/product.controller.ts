import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { SellerGuard } from 'src/guards/seller.guard';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from 'src/types/user';
import { Product } from 'src/types/product';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async listAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get('/mine')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async listMine(@User() user: UserDocument): Promise<Product[]> {
    const { id } = user;
    return await this.productService.findByOwner(id);
  }

  @Get('/seller/:id')
  async listBySeller(@Param('id') id: string): Promise<Product[]> {
    return await this.productService.findByOwner(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async create(
    @Body() productDto: CreateProductDTO,
    @User() user: UserDocument,
  ): Promise<Product> {
    return await this.productService.create(productDto, user);
  }

  @Get(':id')
  async read(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async update(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDTO,
    @User() user: UserDocument,
  ): Promise<Product> {
    const { id: userId } = user;
    return await this.productService.update(id, productDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async delete(
    @Param('id') id: string,
    @User() user: UserDocument,
  ): Promise<Product> {
    const { id: userId } = user;

    return await this.productService.delete(id, userId);
  }
}
