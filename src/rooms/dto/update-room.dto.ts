import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdatedRoomDto {
  @IsBoolean()
  @IsNotEmpty()
  isTrigger: boolean;
}
