import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const ToolCard: React.FC<CardProps> = ({ title, description, icon: Icon, onClick, variant = 'primary' }) => {
  const colors = {
    primary: 'from-brand-primary/20 to-brand-primary/5 border-brand-primary/20 hover:border-brand-primary/50',
    secondary: 'from-brand-secondary/20 to-brand-secondary/5 border-brand-secondary/20 hover:border-brand-secondary/50',
    accent: 'from-brand-accent/20 to-brand-accent/5 border-brand-accent/20 hover:border-brand-accent/50',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-start p-6 rounded-2xl border bg-gradient-to-br ${colors[variant]} text-left transition-all duration-300 group w-full`}
    >
      <div className={`p-3 rounded-xl bg-white/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </motion.button>
  );
};
