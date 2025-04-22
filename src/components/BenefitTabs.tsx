import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Clock, FileText } from 'lucide-react';

interface TabContent {
  bienestar: React.ReactNode;
  productividad: React.ReactNode;
  durabilidad: React.ReactNode;
  especificaciones: React.ReactNode;
}

interface BenefitTabsProps {
  content: TabContent;
  className?: string;
}

type TabType = 'bienestar' | 'productividad' | 'durabilidad' | 'especificaciones';

const BenefitTabs: React.FC<BenefitTabsProps> = ({ content, className = '' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('bienestar');

  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      id: 'bienestar', 
      label: 'Bienestar', 
      icon: <Heart className="h-5 w-5" />,
      color: 'text-[#C87D55]' // Terracotta
    },
    { 
      id: 'productividad', 
      label: 'Productividad', 
      icon: <Brain className="h-5 w-5" />,
      color: 'text-[#7D9D8C]' // Sage
    },
    { 
      id: 'durabilidad', 
      label: 'Durabilidad', 
      icon: <Clock className="h-5 w-5" />,
      color: 'text-teal' // Teal
    },
    { 
      id: 'especificaciones', 
      label: 'Especificaciones', 
      icon: <FileText className="h-5 w-5" />,
      color: 'text-gray-600' // Gray
    }
  ];

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className={`mt-8 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center py-3 px-4 font-heading font-medium text-sm sm:text-base transition-colors relative ${
              activeTab === tab.id
                ? `${tab.color} font-semibold`
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.color.replace('text-', 'bg-')}`}
                layoutId="activeTabIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg"
          >
            {content[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BenefitTabs;
