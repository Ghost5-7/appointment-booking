const prisma = require('../config/prisma');

const getBarbers = async (req, res) => {
    try {
        const barbers = await prisma.user.findMany({ 
            where: { role: 'barber' },
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(barbers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBarberProfile = async (req, res) => {
    try {
        const barber = await prisma.barber.findUnique({ 
            where: { userId: parseInt(req.params.id) },
            include: { user: { select: { id: true, name: true, email: true } } }
        });
        if (!barber) return res.status(404).json({ message: 'Barber profile not found' });
        res.json(barber);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBarberAvailability = async (req, res) => {
    try {
        const { workingHours, specialties } = req.body;
        const uId = parseInt(req.user.id);

        const barber = await prisma.barber.upsert({
            where: { userId: uId },
            update: {
                workingHours: workingHours || undefined,
                specialties: specialties || undefined,
            },
            create: {
                userId: uId,
                workingHours: workingHours || [],
                specialties: specialties || [],
            }
        });

        res.json(barber);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBarbers, getBarberProfile, updateBarberAvailability };
