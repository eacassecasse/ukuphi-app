import { db } from "../lib/prisma";
import BusinessError, { NotFoundError } from "../models/errors";

export class OrganizerService {
  static async findCustomers(id: string) {
    const customers = await db.user.findMany({
      where: {
        payments: {
          some: {
            ticket: {
              event: {
                organizerId: id,
              },
            },
          },
        },
      },
      include: {
        payments: {
          where: {
            ticket: {
              event: {
                organizerId: id,
              },
            },
          },
        },
      },
    });

    if (!customers) {
      throw new NotFoundError("No customer found");
    }

    return customers;
  }
}
