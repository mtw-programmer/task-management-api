import { IsArray, IsOptional, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ minLength: 1, maxLength: 50 })
  @IsString()
  @Length(1, 50)
  title: string;

  @ApiProperty({ minLength: 1, maxLength: 2000 })
  @IsString()
  @IsOptional()
  @Length(1, 2000)
  details?: string;
  
  @ApiProperty({
    type: [Number],
    description: 'Array of tag IDs'
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true, message: 'All elements must be tag IDs' })
  tags?: number[];
}