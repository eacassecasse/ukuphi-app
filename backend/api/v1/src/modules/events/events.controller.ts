import { FastifyRequest } from 'fastify';
import { EventService } from '@modules/events/events.service';
import { BasePaginatedController } from '@lib/pagination/base-paginated.controller';

export class EventController extends BasePaginatedController {
  constructor(private readonly eventService: EventService) {
    super();
  }

  async getEvents(request: FastifyRequest) {
    return this.handlePaginatedRequest(
      request,
      (page) => this.eventService.getEvents(page)
    );
  }

  async getEventsByOrganizer(
    request: FastifyRequest<{ Params: { organizerId: string } }>
  ) {
    return this.handlePaginatedRequest(
      request,
      (page) => this.eventService.getEventsByOrganizer(
        request.params.organizerId,
        page
      )
    );
  }
}