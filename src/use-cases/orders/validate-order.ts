import { prisma } from "@/lib/prisma";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { OrderStatus } from "@prisma/client";
import { addDays } from "date-fns";

interface ValidateOrderUseCaseRequest {
  orderId: string;
  storeId: string;
}

type ValidationResult =
  | {
      expired: true;
      orderId: string;
      expiresAt: Date;
    }
  | {
      expired: false;
      orderId: string;
      status: OrderStatus;
      pointsEarned: number;
      expiresAt: Date;
    };

const ORDER_EXPIRATION_DAYS = 30;

export class ValidateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({ orderId, storeId }: ValidateOrderUseCaseRequest) {
    const result = await prisma.$transaction<ValidationResult>(async (tx) => {
      const order = await this.ordersRepository.findByIdWithTx(tx, orderId);

      if (!order) {
        throw new Error("Pedido não encontrado.");
      }

      if (order.storeId !== storeId) {
        throw new Error("Sem permissão para validar este pedido.");
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new Error("Pedido já processado.");
      }

      /*
       * O pedido expira exatamente
       * 30 dias após a criação.
       */
      const expiresAt = addDays(order.createdAt, ORDER_EXPIRATION_DAYS);

      const now = new Date();

      /*
       * Não lançamos erro aqui dentro,
       * pois isso desfaria a atualização
       * para EXPIRED.
       */
      if (now.getTime() >= expiresAt.getTime()) {
        await this.ordersRepository.updateStatusWithTx(
          tx,
          order.id,
          OrderStatus.EXPIRED,
        );

        return {
          expired: true,
          orderId: order.id,
          expiresAt,
        };
      }

      /*
       * Atualização atômica para impedir
       * duas validações simultâneas.
       */
      const updated = await tx.order.updateMany({
        where: {
          id: order.id,
          status: OrderStatus.PENDING,
        },

        data: {
          status: OrderStatus.VALIDATED,
          validatedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        throw new Error("Pedido já validado por outro operador.");
      }

      /*
       * Atualiza estoque.
       */
      for (const item of order.items) {
        if (!item.product?.id) {
          throw new Error("Produto do pedido não encontrado.");
        }

        await this.productsRepository.updateStockWithTx(
          tx,
          item.product.id,
          Number(item.quantity),
        );
      }

      /*
       * Regra:
       * 1 ponto a cada R$ 10 pagos.
       */
      const totalAmount = Number(order.totalAmount ?? 0);

      const discountApplied = Number(order.discountApplied ?? 0);

      const valorPago = Math.max(totalAmount - discountApplied, 0);

      const pointsEarned = Math.floor(valorPago / 10);

      if (pointsEarned > 0) {
        let wallet = await tx.storePointsWallet.findUnique({
          where: {
            userId_storeId: {
              userId: order.userId,

              storeId: order.storeId,
            },
          },
        });

        if (!wallet) {
          wallet = await tx.storePointsWallet.create({
            data: {
              userId: order.userId,

              storeId: order.storeId,

              balance: 0,
              earned: 0,
            },
          });
        }

        /*
         * Impede duplicação de pontos
         * caso exista restrição única
         * para orderId.
         */
        await tx.storePointsTransaction.create({
          data: {
            userId: order.userId,

            storeId: order.storeId,

            orderId: order.id,

            type: "EARN",

            points: pointsEarned,

            note: "Pontos gerados por validação de pedido",

            storePointsWalletId: wallet.id,
          },
        });

        await tx.storePointsWallet.update({
          where: {
            userId_storeId: {
              userId: order.userId,

              storeId: order.storeId,
            },
          },

          data: {
            balance: {
              increment: pointsEarned,
            },

            earned: {
              increment: pointsEarned,
            },
          },
        });
      }

      return {
        expired: false,
        orderId: order.id,
        status: OrderStatus.VALIDATED,
        pointsEarned,
        expiresAt,
      };
    });

    /*
     * O erro é lançado depois que a
     * transação foi concluída.
     *
     * Dessa forma, o status EXPIRED
     * permanece salvo.
     */
    if (result.expired) {
      throw new Error("O prazo de 30 dias para validar este pedido expirou.");
    }

    return {
      orderId: result.orderId,
      status: result.status,
      pointsEarned: result.pointsEarned,
      expiresAt: result.expiresAt,
    };
  }
}
