import { IsEmail } from 'class-validator';

export class LinkCoupleDto {
  @IsEmail()
  partnerEmail!: string;
}
