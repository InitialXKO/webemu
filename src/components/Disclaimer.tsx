import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  onClose: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-400 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-400" /> Disclaimer
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="mb-4 text-gray-300">
          This Web MAME Frontend is designed for use with legally obtained ROM files only. 
          Users are responsible for ensuring they have the right to use any ROMs they upload or play.
          We do not provide or endorse the use of copyrighted ROM files without permission.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;