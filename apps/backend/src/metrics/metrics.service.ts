import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaryData() {
    try {
      const totalUsers = await this.prisma.user.count();
      const bookmarkedBlogs = await this.prisma.bookmark.count();
      const totalBlogViews = await this.prisma.blog.aggregate({
        _sum: {
          views: true,
        },
      });

      const currentEngagementRate =
        totalUsers > 0
          ? ((totalBlogViews._sum.views || 0) + (bookmarkedBlogs || 0)) /
            totalUsers
          : 0;

      return [
        {
          title: 'Total Users',
          value: totalUsers.toLocaleString(),
          icon: 'Users',
          color: 'blue',
        },
        {
          title: 'Bookmarked Blog Posts',
          value: bookmarkedBlogs.toLocaleString(),
          icon: 'BookOpen',
          color: 'green',
        },
        {
          title: 'Engagement Rate',
          value: `${currentEngagementRate.toFixed(2)}%`,
          icon: 'Target',
          color: 'yellow',
        },
      ];
    } catch (error) {
      throw new InternalServerErrorException('Error fetching summary data');
    }
  }

  async getUserDistributionData() {
    try {
      const maleUsers = await this.prisma.user.count({
        where: { gender: 'male' },
      });
      const femaleUsers = await this.prisma.user.count({
        where: { gender: 'female' },
      });
      const userRoles = await this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      });

      const rolesDistribution = userRoles.map((role) => ({
        name: role.role,
        value: role._count.role,
      }));

      return {
        genders: [
          { name: 'Male', value: maleUsers },
          { name: 'Female', value: femaleUsers },
        ],
        roles: rolesDistribution,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user distribution data',
      );
    }
  }
  async getRecentActivityData() {
    try {
      const activities = await this.prisma.userActivity.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      const recentActivityData = activities.map((activity) => {
        let icon = '';
        let text = '';

        // Determine the icon and text based on the activity details
        if (activity.activity.toLowerCase().includes('user')) {
          icon = 'UserPlus';
          text = `${activity.activity}`;
        } else if (activity.activity.toLowerCase().includes('event')) {
          icon = 'Calendar';
          text = `${activity.activity}`;
        } else if (activity.activity.toLowerCase().includes('blog')) {
          if (activity.activity.toLowerCase().includes('published')) {
            icon = 'MessageCircle';
            text = `${activity.activity}`;
          } else if (activity.activity.toLowerCase().includes('bookmarked')) {
            icon = 'BookOpen';
            text = `${activity.activity}`;
          }
        } else {
          icon = 'Activity';
          text = `${activity.activity}`;
        }

        return {
          icon,
          text,
          time: this.formatTime(activity.createdAt),
          type: activity.activity,
        };
      });

      return recentActivityData;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching recent activity data',
      );
    }
  }

  async getActivityOverviewData() {
    try {
      const currentDate = new Date();
      const months = Array.from({ length: 7 }, (_, i) => {
        const monthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
        );
        return {
          month: monthDate.getMonth(),
          year: monthDate.getFullYear(),
          users: 0,
          events: 0,
          blogPosts: 0,
          name: monthDate.toLocaleString('default', { month: 'short' }), // Short month name
          fullName: monthDate.toLocaleString('default', { month: 'long' }), // Full month name
        };
      }).reverse(); // Reverse to have the most recent month first

      // Get user counts by month
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ); // Last day of the current month

      const userCounts = await this.prisma.user.groupBy({
        by: ['createdAt'],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      });

      userCounts.forEach((user) => {
        const month = new Date(user.createdAt).getMonth();
        const year = new Date(user.createdAt).getFullYear();
        const monthIndex = months.findIndex(
          (m) => m.month === month && m.year === year,
        );
        if (monthIndex !== -1) {
          months[monthIndex].users += user._count.id;
        }
      });

      // Get event counts by month using raw query
      const eventCounts = await this.prisma.$queryRaw<MonthlyCount[]>`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS monthYear,
          COUNT(*) AS count
        FROM "Event"  -- Use double quotes for case sensitivity
        WHERE "createdAt" >= ${new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1)} 
          AND "createdAt" < ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)}
        GROUP BY monthYear
      `;
      eventCounts.forEach((event) => {
        const [year, month] = event.monthyear.split('-');
        const monthIndex = months.findIndex(
          (m) => m.year === parseInt(year) && m.month === parseInt(month) - 1,
        );
        if (monthIndex !== -1) {
          months[monthIndex].events += Number(event.count);
        }
      });

      // Get blog counts by month using raw query
      const blogCounts = await this.prisma.$queryRaw<MonthlyCount[]>`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS monthYear,
          COUNT(*) AS count
        FROM "Blog"  -- Use double quotes for case sensitivity
        WHERE "createdAt" >= ${new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1)} 
          AND "createdAt" < ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)}
        GROUP BY monthYear
      `;

      blogCounts.forEach((blog) => {
        const [year, month] = blog.monthyear.split('-');
        const monthIndex = months.findIndex(
          (m) => m.year === parseInt(year) && m.month === parseInt(month) - 1,
        );
        if (monthIndex !== -1) {
          months[monthIndex].blogPosts += Number(blog.count);
        }
      });

      return months.map(
        ({ name, fullName, year, users, events, blogPosts }) => ({
          name,
          fullName,
          year: year.toString(),
          users,
          events,
          blogPosts,
        }),
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error fetching monthly activity data',
      );
    }
  }

  async getEngagementOverview() {
    try {
      const currentDate = new Date();
      const months = Array.from({ length: 7 }, (_, i) => {
        const monthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
        );
        return {
          month: monthDate.getMonth(),
          year: monthDate.getFullYear(),
          engagement: 0,
          name: monthDate.toLocaleString('default', { month: 'short' }), // Short month name
          fullName: monthDate.toLocaleString('default', { month: 'long' }), // Full month name
        };
      }).reverse(); // Reverse to have the most recent month first

      // Calculate engagement for each month
      for (const month of months) {
        const startOfMonth = new Date(month.year, month.month, 1);
        const endOfMonth = new Date(month.year, month.month + 1, 0); // Last day of the month

        const totalUsers = await this.prisma.user.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        });

        const bookmarkedBlogs = await this.prisma.bookmark.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        });

        const totalBlogViews = await this.prisma.blog.aggregate({
          _sum: {
            views: true,
          },
          where: {
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
        });

        const currentEngagementRate =
          totalUsers > 0
            ? ((totalBlogViews._sum.views || 0) + (bookmarkedBlogs || 0)) /
              totalUsers
            : 0;

        month.engagement = currentEngagementRate; // Store engagement rate for the month
      }

      return months.map(({ name, fullName, year, engagement }) => ({
        name,
        fullName,
        year: year.toString(),
        engagement,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching monthly engagement data',
      );
    }
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  }
}

interface MonthlyCount {
  monthyear: string; // e.g., "2023-01"
  count: number; // Number of events or blogs
}
