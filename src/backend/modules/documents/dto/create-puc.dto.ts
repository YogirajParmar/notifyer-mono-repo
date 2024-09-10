import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreatePUCDto {
  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;
}
