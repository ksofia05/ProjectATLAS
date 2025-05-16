import toast from 'react-hot-toast';

const Error = (mensaje) => {
  toast.error(mensaje, {
    className: 'rounded-md bg-red-500 text-white',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export default Error;