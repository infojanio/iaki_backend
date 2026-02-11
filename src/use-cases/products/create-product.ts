import { Product } from "@prisma/client";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { SubCategoriesRepository } from "@/repositories/prisma/Iprisma/subcategories-repository";

interface CreateProductUseCaseRequest {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  image?: string | null;
  cashbackPercentage: number;
  status: boolean;
  storeId: string;
  subcategoryId: string;
}

interface CreateProductUseCaseResponse {
  product: Product;
}

export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
    private subcategoriesRepository: SubCategoriesRepository,
  ) {}

  async execute({
    id,
    name,
    description,
    price,
    quantity,
    image,
    cashbackPercentage,
    status,
    storeId,
    subcategoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    // Verifica se a loja existe

    console.log("storeId recebido:", storeId);
    const storeExists = await this.storesRepository.findById(storeId);
    if (!storeExists) {
      console.log("storeExists:", storeExists);
      throw new Error("A loja com esse ID não existe!");
    }

    // Verifica se a subcategoria existe
    const subcategoryExists =
      await this.subcategoriesRepository.findById(subcategoryId);
    if (!subcategoryExists) {
      throw new Error("A subcategoria com esse ID não existe!");
    }

    // Cria o produto

    const product = await this.productsRepository.create({
      id,
      name,
      description,
      price,
      quantity,
      image,
      cashbackPercentage,
      status,
      storeId,
      subcategoryId,
      createdAt: new Date(),
    });

    console.log("products", product);
    return { product };
  }
}
