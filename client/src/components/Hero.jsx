import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section style={{ padding: '80px 0', textAlign: 'center', background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))' }}>
            <div className="container">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.02em' }}
                >
                    Elite Grooming for the <br /> Modern Individual.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}
                >
                    Book your next haircut or beard trim with our master barbers. 
                    Premium service in a minimalist atmosphere.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <a href="#booking" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: '1.1rem' }}>
                        Book Appointment
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
