import { FastifyRequest } from 'fastify';
import { EventService } from '@modules/events/events.service';
import { 
  getPaginationFromRequest,
  nextLink
} from '@lib/pagination/pagination.utils';
import { 
  Page,
  PaginatedData,
  PaginatedResponse
} from '@lib/pagination/pagination.types';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  async getEvents(request: FastifyRequest) {
    const page = getPaginationFromRequest(request);
    const { data, nextPage } = await this.eventService.getEvents(page);
    
    return this.formatPaginatedResponse(data, nextPage, request);
  }

  async getEventsByOrganizer(
    request: FastifyRequest<{ Params: { organizerId: string } }>
  ) {
    const page = getPaginationFromRequest(request);
    const { data, nextPage } = await this.eventService.getEventsByOrganizer(
      request.params.organizerId,
      page
    );
    
    return this.formatPaginatedResponse(data, nextPage, request);
  }

  private formatPaginatedResponse<T>(
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
}