import { prisma } from '@lib/prisma/client';
import { 
  CountableCollection,
  Page, 
  PaginatedData 
} from '@lib/pagination/pagination.types';
import { 
  queryParameters,
  getNextPage,
} from '@lib/pagination/pagination.utils';
import { Event } from '@prisma/client';

export class EventService {
  private readonly eventCollection: CountableCollection = {
    count: async (params) => {
      return prisma.event.count({
        where: params.where,
        skip: params.skip,
        take: params.take
      });
    }
  };

  async getEvents(page: Page): Promise<PaginatedData<Event>> {
    const query = queryParameters({ page });
    
    const events = await prisma.event.findMany({
      ...query,
      orderBy: { date: 'asc' },
      include: {
        venue: true,
        category: true
      }
    });

    const nextPage = await getNextPage({
      currentPage: page,
      collection: this.eventCollection
    });

    return { 
      data: events, 
      nextPage 
    };
  }

  async getEventsByOrganizer(
    organizerId: string,
    page: Page
  ): Promise<PaginatedData<Event>> {
    const { where, ...query } = queryParameters({ page });
    
    const events = await prisma.event.findMany({
      ...query,
      where: { ...where, organizerId },
      orderBy: { date: 'asc' }
    });

    const nextPage = await getNextPage({
      currentPage: page,
      collection: {
        count: async (params) => {
          return prisma.event.count({
            where: { ...params.where, organizerId },
            skip: params.skip,
            take: params.take
          });
        }
      }
    });

    return { 
      data: events, 
      nextPage 
    };
  }

  private omitShard<T extends { shard?: number }>(event: T): Omit<T, 'shard'> {
    const { shard: _, ...rest } = event;
    return rest;
  }
}