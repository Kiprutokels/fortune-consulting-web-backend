import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@fortune.com' },
    update: {},
    create: {
      email: 'admin@fortune.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });

  // Create theme config
  const themeConfig = await prisma.themeConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#3b82f6',
      accentColor: '#f97316',
      companyName: 'Fortune Technologies',
      isActive: true
    }
  });

  // Create navigation items
  const navItems = [
    {
      name: 'What we offer',
      key: 'what-we-offer',
      position: 1,
      hasDropdown: true
    },
    {
      name: 'Who we serve',
      key: 'who-we-serve',
      position: 2,
      hasDropdown: true
    },
    {
      name: 'Why Paywell',
      key: 'why-paywell',
      position: 3,
      hasDropdown: true
    },
    {
      name: 'Careers',
      key: 'careers',
      href: '/careers',
      position: 4,
      hasDropdown: false
    },
    {
      name: 'About',
      key: 'about',
      href: '/about',
      position: 5,
      hasDropdown: false
    }
  ];

  for (const item of navItems) {
    const navItem = await prisma.navItem.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });

    if (item.hasDropdown && item.key === 'what-we-offer') {
      const dropdownData = await prisma.dropdownData.create({
        data: {
          navItemId: navItem.id,
          title: 'What We Offer'
        }
      });

      const dropdownItems = [
        {
          name: 'Payroll Management',
          href: '/services/payroll',
          description: 'Streamline your payroll process with our comprehensive PayWell Plus system.',
          features: ['Automated Calculations', 'KRA Tax Compliance', 'NSSF & NHIF Integration'],
          position: 1
        },
        {
          name: 'Recruitment Services',
          href: '/services/recruitment',
          description: 'Professional recruitment and headhunting services for local and international companies.',
          features: ['Executive Search', 'Bulk Recruitment', 'Skills Assessment'],
          position: 2
        }
      ];

      for (const dropItem of dropdownItems) {
        await prisma.dropdownItem.create({
          data: {
            ...dropItem,
            dropdownDataId: dropdownData.id
          }
        });
      }
    }
  }

  // Create hero dashboard slides
  const heroDashboards = [
    {
      title: 'HR Dashboard',
      description: 'Complete overview of your HR operations',
      stats: [
        { label: 'Active Employees', value: '2,847', color: 'primary' },
        { label: 'Payroll Accuracy', value: '98.2%', color: 'accent' }
      ],
      features: ['Payroll Processing', 'Time Tracking', 'Benefits Management'],
      position: 1
    },
    {
      title: 'Analytics Dashboard',
      description: 'Data-driven insights for better decisions',
      stats: [
        { label: 'Reports Generated', value: '1,234', color: 'primary' },
        { label: 'Data Accuracy', value: '99.8%', color: 'accent' }
      ],
      features: ['Real-time Analytics', 'Custom Reports', 'Trend Analysis'],
      position: 2
    }
  ];

  for (const dashboard of heroDashboards) {
    await prisma.heroDashboard.create({
      data: dashboard
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
