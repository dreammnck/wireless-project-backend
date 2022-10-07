import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientInfusionHistoryDto {

  @IsNumber()
  @IsNotEmpty()
  dropRate: number;
}
