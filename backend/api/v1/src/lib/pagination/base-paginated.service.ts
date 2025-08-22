import { 
  CountableCollection, 
  Page, 
  PaginatedData 
} from '@lib/pagination/pagination.types';
import { 
  queryParameters, 
  getNextPage 
} from '@lib/pagination/pagination.utils';

export abstract class BasePaginatedService<T> {
  protected abstract getCollection(additionalWhere?: any): CountableCollection;
  protected abstract getEntityName(): string;

  /**
   * Generic paginated query method
   */
  protected async getPaginatedData(
    page: Page,
    options: {
      where?: any;
      orderBy?: any;
      include?: any;
      select?: any;
    } = {}
  ): Promise<PaginatedData<T>> {
    const query = queryParameters({ page });
    const { where: pageWhere, ...restQuery } = query;
    
    // Merge pagination where clause with additional filters
    const combinedWhere = { 
      ...pageWhere, 
      ...options.where 
    };

    // Get the data
    const data = await this.findMany({
      ...restQuery,
      where: combinedWhere,
      orderBy: options.orderBy,
      include: options.include,
      select: options.select
    });

    // Get next page info
    const collection = this.getCollection(options.where);
    const nextPage = await getNextPage({
      currentPage: page,
      collection
    });

    return { data, nextPage };
  }

  /**
   * Abstract method that each service must implement for their specific entity
   */
  protected abstract findMany(params: {
    skip: number;
    take: number;
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
  }): Promise<T[]>;

  /**
   * Helper method to create a collection for custom where clauses
   */
  protected createCustomCollection(baseWhere: any = {}): CountableCollection {
    return {
      count: async (params) => {
        const combinedWhere = { ...params.where, ...baseWhere };
        return this.count({
          where: combinedWhere,
          skip: params.skip,
          take: params.take
        });
      }
    };
  }

  /**
   * Abstract count method that each service must implement
   */
  protected abstract count(params: {
    where?: any;
    skip?: number;
    take?: number;
  }): Promise<number>;
}
