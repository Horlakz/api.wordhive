import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL =
      'https://api.paystack.co/transaction';
    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`;
    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';
  }

  async initialize(data: {
    email: string;
    amount: number;
    reference: string;
    callback_url: string;
  }) {
    const { amount } = data;

    try {
      const response = await this.httpService.axiosRef.post(`/initialize`, {
        ...data,
        amount: amount * 100,
      });

      return response?.data;
    } catch (e) {
      throw new BadRequestException(e.response.data.message || e.message);
    }
  }

  async verify(reference: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `/verify/${reference}`,
      );
      return response?.data;
    } catch (e) {
      throw new BadRequestException(e.response.data.message || e.message);
    }
  }
}
