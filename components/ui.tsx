'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      />
    </div>
  );
}

export function EmptyState({ 
  icon = '📊', 
  title = 'No data', 
  description,
  actionLabel,
  actionHref
}: {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {description && <p className="text-zinc-400 mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          {actionLabel}
        </a>
      )}
    </motion.div>
  );
}
