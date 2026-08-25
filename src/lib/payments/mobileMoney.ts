import { PaymentGateway } from '@/types';

export interface PaymentIntent {
  paymentId: string;
  orderId: string;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  checkoutUrl: string;
  qrCodeUrl?: string;
  deeplinkUrl?: string;
}

export class MobileMoneyService {
  /**
   * Initialise un paiement Mobile Money sécurisé
   */
  static async createPaymentIntent(
    orderId: string,
    gateway: PaymentGateway,
    amount: number,
    phone: string
  ): Promise<PaymentIntent> {
    const paymentId = `pay_${gateway.toLowerCase()}_${Date.now()}`;

    // Simulation d'intégration Wave / Orange / MTN avec deep links natifs
    let deeplinkUrl = '';
    let checkoutUrl = '';

    switch (gateway) {
      case 'WAVE':
        deeplinkUrl = `wave://pay?amount=${amount}&ref=${paymentId}`;
        checkoutUrl = `https://pay.wave.com/c/${paymentId}`;
        break;
      case 'ORANGE_MONEY':
        deeplinkUrl = `orange-money://pay?amount=${amount}&ref=${paymentId}`;
        checkoutUrl = `https://om.orange.ci/checkout/${paymentId}`;
        break;
      case 'MTN_MOMO':
        deeplinkUrl = `momo://pay?amount=${amount}&ref=${paymentId}`;
        checkoutUrl = `https://momo.mtn.ci/pay/${paymentId}`;
        break;
      default:
        checkoutUrl = `/checkout/process?id=${paymentId}`;
    }

    return {
      paymentId,
      orderId,
      gateway,
      amount,
      currency: 'XOF',
      checkoutUrl,
      deeplinkUrl,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(checkoutUrl)}`
    };
  }
}
