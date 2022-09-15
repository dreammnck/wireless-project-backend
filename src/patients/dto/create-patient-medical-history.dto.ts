import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientMedicalHistoryDto {
  @IsString()
  @IsNotEmpty()
  medicalHistory: string;
}
