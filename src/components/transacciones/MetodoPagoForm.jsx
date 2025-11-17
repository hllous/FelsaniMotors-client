import { useState } from "react";

const MetodoPagoForm = ({ onMetodoPagoChange }) => {
    const [metodoPagoData, setMetodoPagoData] = useState({
        metodoPago: "Visa",
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: ""
    });

    const [errores, setErrores] = useState({
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: ""
    });

    // Algoritmo de Luhn para validar numero de tarjeta, verifica que sea correcto
    
    const validarLuhn = (numero) => {
        const digits = numero.replace(/\s/g, '').split('').map(Number);
        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    // Formateo numero de tarjeta, agregar espacios cada 4 digitos
    const formatearNumeroTarjeta = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const match = cleaned.match(/.{1,4}/g);
        return match ? match.join(' ') : '';
    };

    // Validar formato de fecha
    const validarFecha = (fecha) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(fecha)) return false;

        const [mes, anio] = fecha.split('/');
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth() + 1;
        const anioActual = fechaActual.getFullYear() % 100;

        const anioNum = parseInt(anio);
        const mesNum = parseInt(mes);

        if (anioNum < anioActual) return false;
        if (anioNum === anioActual && mesNum < mesActual) return false;

        return true;
    };

    // Formatear fecha
    const formatearFecha = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        let newErrores = { ...errores };

        // Validaciones
        if (name === "numeroTarjeta") {

            // Solo permitir numeros
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 16) {
                newValue = formatearNumeroTarjeta(cleaned);
                
                // Validar con Luhn si tiene 16 digitos
                if (cleaned.length === 16) {
                    if (!validarLuhn(cleaned)) {

                        newErrores.numeroTarjeta = "Número de tarjeta inválido";
                    } else {

                        newErrores.numeroTarjeta = ""
                    }

                } else if (cleaned.length > 0 && cleaned.length < 16) {

                    newErrores.numeroTarjeta = "Debe tener 16 dígitos"
                } else {

                    newErrores.numeroTarjeta = ""
                }

            } else {
                return
            }
        }

        if (name === "fechaCaducidad") {
            // Formatear fecha

            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 4) {
                newValue = formatearFecha(cleaned);
                
                if (newValue.length === 5) {
                    if (!validarFecha(newValue)) {

                        newErrores.fechaCaducidad = "Fecha inválida o vencida"
                    } else {

                        newErrores.fechaCaducidad = ""
                    }
                } else if (newValue.length > 0) {

                    newErrores.fechaCaducidad = "Formato: MM/AA"
                } else {

                    newErrores.fechaCaducidad = ""
                }

            } else {
                return
            }
        }

        if (name === "codigoSeguridad") {
            
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 4) {
                newValue = cleaned;
                if (cleaned.length >= 3 && cleaned.length <= 4) {
                    newErrores.codigoSeguridad = "";
                } else if (cleaned.length > 0) {
                    newErrores.codigoSeguridad = "Debe tener 3 o 4 dígitos";
                } else {
                    newErrores.codigoSeguridad = "";
                }
            } else {
                return;
            }
        }

        setErrores(newErrores);
        
        const newData = {
            ...metodoPagoData,
            [name]: newValue
        };
        setMetodoPagoData(newData);
        
        if (onMetodoPagoChange) {
            onMetodoPagoChange(newData);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Método de Pago</h3>
            <div className="space-y-5">
                <div>
                    <label htmlFor="metodoPago" className="block text-base font-semibold text-gray-700 mb-2">
                        Selecciona tu tarjeta
                    </label>
                    <select
                        id="metodoPago"
                        name="metodoPago"
                        value={metodoPagoData.metodoPago}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors cursor-pointer"
                    >
                        <option value="Visa">💳 Visa</option>
                        <option value="MasterCard">💳 MasterCard</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="numeroTarjeta" className="block text-base font-semibold text-gray-700 mb-2">
                        Número de Tarjeta <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numeroTarjeta"
                        name="numeroTarjeta"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={metodoPagoData.numeroTarjeta}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errores.numeroTarjeta 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                        }`}
                        maxLength="19"
                        required
                    />
                    {errores.numeroTarjeta && (
                        <p className="text-red-500 text-sm mt-1">{errores.numeroTarjeta}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fechaCaducidad" className="block text-base font-semibold text-gray-700 mb-2">
                            Vencimiento <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fechaCaducidad"
                            name="fechaCaducidad"
                            type="text"
                            placeholder="MM/AA"
                            value={metodoPagoData.fechaCaducidad}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                errores.fechaCaducidad 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                            }`}
                            maxLength="5"
                            required
                        />
                        {errores.fechaCaducidad && (
                            <p className="text-red-500 text-sm mt-1">{errores.fechaCaducidad}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="codigoSeguridad" className="block text-base font-semibold text-gray-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="codigoSeguridad"
                            name="codigoSeguridad"
                            type="text"
                            placeholder="123"
                            value={metodoPagoData.codigoSeguridad}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                errores.codigoSeguridad 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                            }`}
                            maxLength="4"
                            required
                        />
                        {errores.codigoSeguridad && (
                            <p className="text-red-500 text-sm mt-1">{errores.codigoSeguridad}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetodoPagoForm;