require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seed = async () => {
    try {
        console.log('Starting seeding...');

        // Clear existing data (optional)
        await prisma.appointment.deleteMany();
        await prisma.barber.deleteMany();
        await prisma.user.deleteMany({ where: { email: 'john@example.com' } });

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create a barber user
        const barberUser = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'barber'
            }
        });

        // Create barber profile
        await prisma.barber.create({
            data: {
                userId: barberUser.id,
                bio: 'Master Barber with 10 years experience.',
                specialties: ['Haircut', 'Beard trim'],
                workingHours: [
                    { day: 'Monday', start: '09:00', end: '17:00', isOff: false },
                    { day: 'Tuesday', start: '09:00', end: '17:00', isOff: false },
                    { day: 'Wednesday', start: '09:00', end: '17:00', isOff: false },
                    { day: 'Thursday', start: '09:00', end: '17:00', isOff: false },
                    { day: 'Friday', start: '09:00', end: '17:00', isOff: false },
                    { day: 'Saturday', start: '10:00', end: '14:00', isOff: false },
                    { day: 'Sunday', isOff: true }
                ]
            }
        });

        console.log('Database seeded successfully!');
        console.log('Barber Login: john@example.com / password123');
        await prisma.$disconnect();
    } catch (error) {
        console.error('Seeding error:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seed();
