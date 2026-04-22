const prisma = require('../config/prisma');
const { startOfDay, format, parse, addMinutes } = require('date-fns');

const bookAppointment = async (req, res) => {
    try {
        const { barberId, service, date, timeSlot } = req.body;
        
        const bId = parseInt(barberId);
        const cId = parseInt(req.user.id);

        const existingAppointment = await prisma.appointment.findFirst({ 
            where: {
                barberId: bId,
                date: startOfDay(new Date(date)),
                timeSlot,
                status: { not: 'cancelled' }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This slot is already booked.' });
        }

        const appointment = await prisma.appointment.create({
            data: {
                customerId: cId,
                barberId: bId,
                service,
                date: startOfDay(new Date(date)),
                timeSlot
            }
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { barberId, date } = req.query;
        const bId = parseInt(barberId);
        const requestedDate = new Date(date);
        const dayOfWeek = format(requestedDate, 'EEEE');

        const barber = await prisma.barber.findUnique({ 
            where: { userId: bId } 
        });
        if (!barber) return res.status(404).json({ message: 'Barber not found.' });

        const daySchedule = barber.workingHours.find(h => h.day === dayOfWeek && !h.isOff);
        if (!daySchedule) return res.json([]);

        const existingAppointments = await prisma.appointment.findMany({
            where: {
                barberId: bId,
                date: startOfDay(requestedDate),
                status: { not: 'cancelled' }
            }
        });

        const bookedSlots = existingAppointments.map(a => a.timeSlot);
        
        const slots = [];
        let current = parse(daySchedule.start, 'HH:mm', requestedDate);
        const end = parse(daySchedule.end, 'HH:mm', requestedDate);

        while (current < end) {
            const slotStr = format(current, 'HH:mm');
            if (!bookedSlots.includes(slotStr)) {
                slots.push(slotStr);
            }
            current = addMinutes(current, 30);
        }

        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({ 
            where: { customerId: parseInt(req.user.id) },
            include: { barber: { select: { id: true, name: true } } }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBarberSchedule = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({ 
            where: { barberId: parseInt(req.user.id) },
            include: { customer: { select: { id: true, name: true } } }
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookAppointment, getAvailableSlots, getUserAppointments, getBarberSchedule };
