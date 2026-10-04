import Swal from 'sweetalert2';

export const alertaExito = (mensaje) => {
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: mensaje,
        confirmButtonColor: '#6366f1',
        timer: 2000,
        showConfirmButton: false
    });
};

export const alertaError = (mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje || 'Ocurrió un error inesperado',
        confirmButtonColor: '#ef4444'
    });
};

export const confirmarAccion = async (titulo, texto) => {
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return resultado.isConfirmed;
};