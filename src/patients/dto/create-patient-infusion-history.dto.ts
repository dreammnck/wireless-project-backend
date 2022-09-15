import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientInfusionHistoryDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsNumber()
  @IsNotEmpty()
  dropRate: number;
}
