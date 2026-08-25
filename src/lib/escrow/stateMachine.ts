import { Order, OrderStatus, Transaction } from '@/types';

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED', 'DISPUTED'],
  PREPARING: ['IN_TRANSIT', 'CANCELLED', 'DISPUTED'],
  IN_TRANSIT: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['COMPLETED', 'DISPUTED'],
  COMPLETED: [], // État final
  DISPUTED: ['COMPLETED', 'REFUNDED'], // Sortie d'arbitrage
  CANCELLED: [], // État final
  REFUNDED: []  // État final
};

export class EscrowStateMachine {
  /**
   * Vérifie si une transition d'état est autorisée
   */
  static canTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
    const allowed = VALID_TRANSITIONS[currentStatus];
    return !!allowed && allowed.includes(targetStatus);
  }

  /**
   * Effectue la transition et applique les règles de sécurité financière
   */
  static applyTransition(
    order: Order,
    nextStatus: OrderStatus,
    reason?: string
  ): {
    updatedOrder: Order;
    generatedTransaction?: Partial<Transaction>;
    notification: { recipient: 'BUYER' | 'SELLER' | 'BOTH'; message: string };
  } {
    if (!this.canTransition(order.status, nextStatus)) {
      throw new Error(`Transition illégale : Impossible de passer de ${order.status} à ${nextStatus}`);
    }

    const now = new Date().toISOString();
    const updatedOrder: Order = {
      ...order,
      status: nextStatus,
    };

    let generatedTransaction: Partial<Transaction> | undefined;
    let notification = {
      recipient: 'BOTH' as 'BUYER' | 'SELLER' | 'BOTH',
      message: `La commande ${order.orderNumber} est passée à l'état ${nextStatus}.`
    };

    switch (nextStatus) {
      case 'PAID':
        updatedOrder.paidAt = now;
        generatedTransaction = {
          orderId: order.id,
          type: 'ESCROW_DEPOSIT',
          amount: order.totalAmount,
          currency: order.currency,
          status: 'SUCCESS',
          idempotencyKey: `escrow_dep_${order.id}_${Date.now()}`
        };
        notification = {
          recipient: 'SELLER',
          message: `🎉 Commande payée ! ${order.totalAmount} ${order.currency} sont séquestrés en toute sécurité. Vous pouvez préparer le colis.`
        };
        break;

      case 'PREPARING':
        updatedOrder.preparingAt = now;
        notification = {
          recipient: 'BUYER',
          message: `📦 Le vendeur prépare votre colis pour la commande ${order.orderNumber}.`
        };
        break;

      case 'IN_TRANSIT':
        updatedOrder.inTransitAt = now;
        notification = {
          recipient: 'BUYER',
          message: `🚚 Votre commande ${order.orderNumber} est en cours d'acheminement / prête au retrait.`
        };
        break;

      case 'DELIVERED':
        updatedOrder.deliveredAt = now;
        // Fixe la libération automatique sous 48 heures
        const autoReleaseDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        updatedOrder.autoReleaseAt = autoReleaseDate.toISOString();
        notification = {
          recipient: 'BUYER',
          message: `📍 Colis livré ! Avez-vous bien reçu votre article ? Vous avez 48h pour confirmer ou signaler un problème.`
        };
        break;

      case 'COMPLETED':
        updatedOrder.completedAt = now;
        updatedOrder.autoReleaseAt = undefined;
        // Déblocage des fonds vers le compte vendeur (net de commission)
        const payoutAmount = order.totalAmount - order.platformFee;
        generatedTransaction = {
          orderId: order.id,
          type: 'PAYOUT_SELLER',
          amount: payoutAmount,
          feeAmount: order.platformFee,
          currency: order.currency,
          status: 'SUCCESS',
          idempotencyKey: `payout_seller_${order.id}_${Date.now()}`
        };
        notification = {
          recipient: 'SELLER',
          message: `💰 Fonds débloqués ! ${payoutAmount} ${order.currency} ont été transférés sur votre compte Mobile Money.`
        };
        break;

      case 'DISPUTED':
        updatedOrder.disputedAt = now;
        // GEL STRICT : Annule le compte à rebours de libération automatique
        updatedOrder.autoReleaseAt = undefined;
        notification = {
          recipient: 'BOTH',
          message: `⚠️ Un litige a été ouvert pour la commande ${order.orderNumber}. Les fonds sont gelés pendant l'examen par l'équipe Zarén.`
        };
        break;

      case 'REFUNDED':
        updatedOrder.autoReleaseAt = undefined;
        generatedTransaction = {
          orderId: order.id,
          type: 'REFUND_BUYER',
          amount: order.totalAmount,
          currency: order.currency,
          status: 'SUCCESS',
          idempotencyKey: `refund_buyer_${order.id}_${Date.now()}`
        };
        notification = {
          recipient: 'BUYER',
          message: `💳 Remboursement effectué : ${order.totalAmount} ${order.currency} vous ont été restitués.`
        };
        break;

      case 'CANCELLED':
        updatedOrder.cancelledAt = now;
        updatedOrder.autoReleaseAt = undefined;
        notification = {
          recipient: 'BOTH',
          message: `La commande ${order.orderNumber} a été annulée.`
        };
        break;
    }

    return { updatedOrder, generatedTransaction, notification };
  }
}
