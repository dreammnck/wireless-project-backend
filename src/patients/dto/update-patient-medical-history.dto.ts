import { IsNotEmpty } from "class-validator";

export class UpdatePatientMedicalHistoryDto {

  @IsNotEmpty()
  id: number;
  
  medicalHistory: string;
}
