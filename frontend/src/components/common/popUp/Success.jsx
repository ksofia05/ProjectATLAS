import toast from 'react-hot-toast';

const Exitoso=(mensaje)=> {
toast.success(mensaje, {
    className: 'rounded-md bg-red-500 text-white',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
}
export default Exitoso;