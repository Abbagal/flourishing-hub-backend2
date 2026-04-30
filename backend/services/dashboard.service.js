import { prisma } from "../database/prisma.js";

const eventCalendarItem = (event) => ({
  id: event.id,
  title: event.title,
  type: event.type,
  status: event.status,
  venue: event.venue,
  startAt: event.startAt,
  endAt: event.endAt
});

export const getStudentDashboard = async (userId) => {
  const [user, registrations, completedProgress, pendingModules, openEvents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    }),
    prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            modules: true
          }
        }
      },
      orderBy: {
        registeredAt: "desc"
      }
    }),
    prisma.moduleProgress.findMany({
      where: {
        studentProfile: {
          userId
        },
        completedAt: {
          not: null
        }
      },
      include: {
        module: {
          include: {
            event: true
          }
        }
      },
      orderBy: {
        completedAt: "desc"
      }
    }),
    prisma.eventModule.findMany({
      where: {
        startAt: {
          gte: new Date()
        },
        event: {
          registrations: {
            some: {
              userId
            }
          }
        }
      },
      include: {
        event: true
      },
      orderBy: {
        startAt: "asc"
      }
    }),
    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        startAt: {
          gte: new Date()
        }
      },
      include: {
        modules: true,
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        startAt: "asc"
      },
      take: 20
    })
  ]);

  const registeredEvents = registrations.map((entry) => entry.event);
  const calendarEntries = registeredEvents
    .map(eventCalendarItem)
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime());

  const activityLogs = [
    ...completedProgress.map((entry) => ({
      type: "MODULE_COMPLETED",
      title: entry.module.title,
      eventTitle: entry.module.event.title,
      at: entry.completedAt,
      marksObtained: entry.marksObtained
    })),
    ...registrations.map((entry) => ({
      type: "EVENT_REGISTRATION",
      title: entry.event.title,
      at: entry.registeredAt,
      status: entry.status
    }))
  ].sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime());

  return {
    basicInfo: user,
    activeCourseProgress: {
      completedModules: completedProgress,
      totalModules: completedProgress.length + pendingModules.length
    },
    pendingModules,
    openEvents,
    registeredEvents: registrations,
    pastRecords: registrations.filter((entry) => ["ATTENDED", "NO_SHOW"].includes(entry.status)),
    schedule: pendingModules,
    calendar: {
      upcoming: calendarEntries.filter((entry) => entry.startAt >= new Date()),
      past: calendarEntries.filter((entry) => entry.startAt < new Date())
    },
    activityLogs
  };
};

export const getStaffDashboard = async (userId) => {
  const [user, upcomingEvents, assignedEvents, availabilityResponses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { instructorProfile: true, studentProfile: true }
    }),
    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        startAt: {
          gte: new Date()
        }
      },
      include: {
        assignments: {
          where: {
            userId
          }
        },
        availabilityResponses: {
          where: {
            userId
          }
        },
        _count: {
          select: {
            registrations: true,
            attendances: true
          }
        }
      },
      orderBy: {
        startAt: "asc"
      },
      take: 20
    }),
    prisma.event.findMany({
      where: {
        assignments: {
          some: {
            userId
          }
        }
      },
      include: {
        _count: {
          select: {
            registrations: true,
            attendances: true
          }
        }
      },
      orderBy: {
        startAt: "asc"
      }
    }),
    prisma.eventAvailability.findMany({
      where: { userId },
      include: {
        event: true
      },
      orderBy: {
        respondedAt: "desc"
      }
    })
  ]);

  return {
    basicInfo: user,
    upcomingEvents,
    assignedEvents,
    availabilityResponses,
    schedule: upcomingEvents,
    currentStatus: {
      totalAssignedEvents: assignedEvents.length,
      totalAvailabilityResponses: availabilityResponses.length
    }
  };
};

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalEvents,
    totalRegistrations,
    pendingCheckIns,
    activeVolunteers,
    eventsByType,
    engagementByDepartment,
    feedbackStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.eventRegistration.count(),
    prisma.eventCheckIn.count({
      where: {
        status: "PENDING"
      }
    }),
    prisma.eventStaffAssignment.count({
      where: {
        role: "VOLUNTEER"
      }
    }),
    prisma.event.groupBy({
      by: ["type"],
      _count: {
        _all: true
      }
    }),
    prisma.studentProfile.groupBy({
      by: ["department"],
      _count: {
        _all: true
      }
    }),
    prisma.feedback.aggregate({
      _avg: {
        eventRating: true,
        instructorRating: true
      },
      _count: {
        _all: true
      }
    })
  ]);

  return {
    totals: {
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingCheckIns,
      activeVolunteers
    },
    eventsByType,
    engagementByDepartment,
    feedbackStats
  };
};
