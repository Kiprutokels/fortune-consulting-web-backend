import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateNavigation = async (req, res) => {
  try {
    const { navItems, dropdownData } = req.body;

    if (!navItems || !Array.isArray(navItems)) {
      return res.status(400).json({ message: 'Invalid navItems data' });
    }

    await prisma.$transaction(async (tx) => {
      // Update nav items
      for (const item of navItems) {
        const navItemData = {
          name: item.name,
          key: item.key,
          href: item.href || null,
          position: item.position,
          hasDropdown: item.hasDropdown,
          isActive: item.isActive
        };

        await tx.navItem.upsert({
          where: { key: item.key },
          update: navItemData,
          create: navItemData
        });
      }

      // Update dropdown data
      if (dropdownData && typeof dropdownData === 'object') {
        for (const [key, data] of Object.entries(dropdownData)) {
          const navItem = await tx.navItem.findUnique({
            where: { key }
          });

          if (navItem && data && typeof data === 'object') {
            // Check if dropdown exists
            const existingDropdown = await tx.dropdownData.findUnique({
              where: { navItemId: navItem.id }
            });

            let dropdown;
            if (existingDropdown) {
              // Update existing dropdown
              dropdown = await tx.dropdownData.update({
                where: { id: existingDropdown.id },
                data: { title: data.title || 'Dropdown Title' }
              });

              // Delete existing dropdown items
              await tx.dropdownItem.deleteMany({
                where: { dropdownDataId: existingDropdown.id }
              });
            } else {
              // Create new dropdown
              dropdown = await tx.dropdownData.create({
                data: {
                  navItemId: navItem.id,
                  title: data.title || 'Dropdown Title'
                }
              });
            }

            // Add dropdown items
            if (data.items && Array.isArray(data.items)) {
              for (const [index, item] of data.items.entries()) {
                await tx.dropdownItem.create({
                  data: {
                    name: item.name,
                    href: item.href,
                    description: item.description || '',
                    features: Array.isArray(item.features) ? item.features : [],
                    position: index + 1,
                    isActive: item.isActive !== false,
                    dropdownDataId: dropdown.id
                  }
                });
              }
            }
          }
        }
      }
    });

    res.json({ message: 'Navigation updated successfully' });
  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { primaryColor, accentColor, logoUrl, companyName } = req.body;

    if (!primaryColor || !accentColor) {
      return res.status(400).json({ message: 'Primary and accent colors are required' });
    }

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (!hexColorRegex.test(primaryColor) || !hexColorRegex.test(accentColor)) {
      return res.status(400).json({ message: 'Invalid color format. Use hex format (#RRGGBB)' });
    }

    await prisma.themeConfig.updateMany({
      where: { isActive: true },
      data: {
        primaryColor,
        accentColor,
        logoUrl: logoUrl || null,
        companyName: companyName || 'Fortune Technologies'
      }
    });

    res.json({ message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateHeroDashboards = async (req, res) => {
  try {
    const { dashboards } = req.body;

    if (!dashboards || !Array.isArray(dashboards)) {
      return res.status(400).json({ message: 'Invalid dashboards data' });
    }

    await prisma.$transaction(async (tx) => {
      // Delete existing dashboards
      await tx.heroDashboard.deleteMany({});
      
      // Create new dashboards
      for (const [index, dashboard] of dashboards.entries()) {
        await tx.heroDashboard.create({
          data: {
            title: dashboard.title,
            description: dashboard.description,
            stats: dashboard.stats || [],
            features: dashboard.features || [],
            position: index + 1,
            isActive: true
          }
        });
      }
    });

    res.json({ message: 'Hero dashboards updated successfully' });
  } catch (error) {
    console.error('Update hero dashboards error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
