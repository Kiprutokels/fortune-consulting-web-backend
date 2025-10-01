import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNavigation = async (req, res) => {
  try {
    const [navItems, themeConfig, heroDashboards] = await Promise.all([
      prisma.navItem.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
        include: {
          dropdowns: {
            include: {
              items: {
                where: { isActive: true },
                orderBy: { position: 'asc' }
              }
            }
          }
        }
      }),
      prisma.themeConfig.findFirst({
        where: { isActive: true }
      }),
      prisma.heroDashboard.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      })
    ]);

    // Transform data for frontend
    const dropdownData = {};
    navItems.forEach(item => {
      if (item.dropdowns.length > 0) {
        const dropdown = item.dropdowns[0];
        dropdownData[item.key] = {
          title: dropdown.title,
          items: dropdown.items
        };
      }
    });

    res.json({
      navItems: navItems.map(({ dropdowns, ...item }) => item),
      dropdownData,
      themeConfig,
      heroDashboards
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
