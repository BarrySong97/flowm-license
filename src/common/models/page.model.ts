import { IsNumber, IsOptional } from 'class-validator';

export class PageSearch {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;
}

export interface PageResponse<T> {
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
  data: T[];
}
