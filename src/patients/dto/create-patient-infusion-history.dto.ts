import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientInfusionHistoryDto {
  @IsString()
  @IsNotEmpty()
  doctor: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsNumber()
  @IsNotEmpty()
  dropRate: number;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
