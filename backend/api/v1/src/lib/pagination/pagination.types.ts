export interface PaginationParameters {
  page?: number;
  shard?: number;
}

export interface CountableCollection {
  count(parameters: {
    skip: number;
    take: number;
    where: { shard: number };
  }): Promise<number>;
}

export interface Page {
  num: number;
  size: number;
  shard?: number;
}

export interface PaginatedData<T> {
  data: T[];
  nextPage?: Page;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { next?: string };
}
