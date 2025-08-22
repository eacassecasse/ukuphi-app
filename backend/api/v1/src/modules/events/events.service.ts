import { prismaClient } from '@lib/prisma/client';
import { 
  CountableCollection,
  Page, 
  PaginatedData 
} from '@lib/pagination/pagination.types';
import { BasePaginatedService } from '@lib/pagination/base-paginated.service';
import { Event } from '@prisma/client';

export class EventService extends BasePaginatedService<Event> {
  protected getCollection(additionalWhere?: any): CountableCollection {
    return {
      count: async (params) => {
        const combinedWhere = { ...params.where, ...additionalWhere };
        return prismaClient.event.count({
          where: combinedWhere,
          skip: params.skip,
          take: params.take
        });
      }
    };
  }

  protected getEntityName(): string {
    return 'Event';
  }

  protected async findMany(params: {
    skip: number;
    take: number;
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
  }): Promise<Event[]> {
    return prismaClient.event.findMany(params);
  }

  protected async count(params: {
    where?: any;
    skip?: number;
    take?: number;
  }): Promise<number> {
    return prismaClient.event.count(params);
  }

  async getEvents(page: Page): Promise<PaginatedData<Event>> {
    return this.getPaginatedData(page, {
      orderBy: { date: 'asc' },
      include: {
        venue: true,
        category: true
      }
    });
  }

  async getEventsByOrganizer(
    organizerId: string,
    page: Page
  ): Promise<PaginatedData<Event>> {
    return this.getPaginatedData(page, {
      where: { organizerId },
      orderBy: { date: 'asc' }
    });
  }

}