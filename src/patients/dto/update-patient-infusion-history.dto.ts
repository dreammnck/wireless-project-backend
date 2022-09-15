import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePatientInfusionHistoryDto {
  @IsNotEmpty()
  id: number;

  @IsNumber()
  dropRate: number;

  @IsString()
  serialNumber: string;
}
