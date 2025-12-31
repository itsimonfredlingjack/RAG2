import MainLayout from './components/layout/MainLayout';
import Sidebar from './components/feature/Sidebar';
import ChatInterface from './components/feature/ChatInterface';
import HolographicAvatar from './components/feature/HolographicAvatar';
import GlassCard from './components/ui/GlassCard';
import NeuralBackground from './components/layout/NeuralBackground';

export default function App() {
    return (
        <>
            <NeuralBackground />
            <MainLayout
                sidebar={<Sidebar />}
                chat={<ChatInterface />}
                avatar={
                    <GlassCard style={{ height: '100%', padding: '0', overflow: 'hidden', border: '1px solid var(--neon-orange)', boxShadow: 'var(--neon-shadow)' }}>
                        <HolographicAvatar />
                    </GlassCard>
                }
            />
        </>
    );
}
