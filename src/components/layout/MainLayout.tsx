import React from 'react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    chat: React.ReactNode;
    avatar: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, chat, avatar }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 15%) 1fr minmax(320px, 20%)',
                gridTemplateRows: '1fr',
                gap: '24px',
                width: '100vw',
                height: '100dvh',
                padding: '32px',
                boxSizing: 'border-box',
                background: 'transparent',
                position: 'relative',
                zIndex: 10
            }}
        >
            {/* Sidebar Column */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ height: '100%', minHeight: 0 }}
            >
                {sidebar}
            </motion.div>

            {/* Chat Column */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ height: '100%', minHeight: 0 }}
            >
                {chat}
            </motion.div>

            {/* Avatar Column */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ height: '100%', minHeight: 0 }}
            >
                {avatar}
            </motion.div>
        </motion.div>
    );
};

export default MainLayout;
