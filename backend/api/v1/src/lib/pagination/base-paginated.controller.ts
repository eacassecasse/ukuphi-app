import { FastifyRequest } from 'fastify';
import { 
  getPaginationFromRequest,
  nextLink
} from '@lib/pagination/pagination.utils';
import { 
  Page,
  PaginatedData,
  PaginatedResponse
} from '@lib/pagination/pagination.types';

export abstract class BasePaginatedController {
  /**
   * Formats paginated data into the standard API response format
   */
  protected formatPaginatedResponse<T>(
    data: T[],
    nextPage: Page | undefined,
    request: FastifyRequest
  ): PaginatedResponse<T> {
    return {
      data,
      links: {
        next: nextLink({ nextPage, request })
      }
    };
  }

  /**
   * Extracts pagination parameters from request
   */
  protected getPagination(request: FastifyRequest): Page {
    return getPaginationFromRequest(request);
  }

  /**
   * Helper method to handle paginated responses consistently
   */
  protected async handlePaginatedRequest<T>(
    request: FastifyRequest,
    serviceMethod: (page: Page) => Promise<PaginatedData<T>>
  ): Promise<PaginatedResponse<T>> {
    const page = this.getPagination(request);
    const { data, nextPage } = await serviceMethod(page);
    return this.formatPaginatedResponse(data, nextPage, request);
  }
}
