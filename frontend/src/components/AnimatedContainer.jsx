// import React from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';

// const AnimatedContainer = ({ children, keyProp = 'static' }) => {
//   // Variantes de animación
//   const containerVariants = {
//     hidden: { opacity: 0, scale: 1.1 }, // Estado inicial
//     visible: { opacity: 1, scale: 1 }, // Estado visible
//     exit: { opacity: 0, scale: 1.1 }, // Estado de salida
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={keyProp} // Clave dinámica o estática
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//         variants={containerVariants}
//         transition={{ duration: 0.5, ease: 'easeInOut' }}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default AnimatedContainer;