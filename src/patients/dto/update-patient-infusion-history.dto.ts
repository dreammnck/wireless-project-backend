import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePatientInfusionHistoryDto {
  @IsNotEmpty()
  id: number;

  @IsNumber()
  dropRate: number;
}
