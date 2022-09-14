import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePatientInfusionHistoryDto {
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  isCompleted: boolean;
}
