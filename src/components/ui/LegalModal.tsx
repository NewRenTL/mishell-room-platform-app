import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LEGAL_CONTENT = {
  terms: {
    title: 'Términos de Servicio',
    sections: [
      {
        heading: '1. Aceptación de los términos',
        body: 'Al acceder y utilizar Mishell Room aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.',
      },
      {
        heading: '2. Descripción del servicio',
        body: 'Mishell Room es una plataforma digital que conecta a propietarios de habitaciones (socios) con personas que buscan alojamiento (inquilinos). Actuamos como intermediarios y no somos parte de los contratos de arrendamiento entre las partes.',
      },
      {
        heading: '3. Registro y cuenta',
        body: 'Para usar el servicio debes crear una cuenta con información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña o PIN y de todas las actividades que ocurran bajo tu cuenta.',
      },
      {
        heading: '4. Pagos y tarifas',
        body: 'Los pagos se realizan directamente entre inquilinos y propietarios según los términos acordados en cada reserva. Mishell Room puede cobrar comisiones por el uso de la plataforma, las cuales serán comunicadas de forma transparente antes de completar cualquier transacción.',
      },
      {
        heading: '5. Conducta del usuario',
        body: 'Te comprometes a usar la plataforma únicamente para fines legales y de manera que no infrinja los derechos de terceros. Queda prohibido el uso fraudulento, la publicación de información falsa o cualquier actividad que perjudique a otros usuarios.',
      },
      {
        heading: '6. Limitación de responsabilidad',
        body: 'Mishell Room no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del servicio. Nuestra responsabilidad máxima no excederá el importe pagado por el usuario en los últimos 3 meses.',
      },
      {
        heading: '7. Modificaciones',
        body: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en la plataforma. El uso continuado del servicio tras la publicación implica la aceptación de los nuevos términos.',
      },
      {
        heading: '8. Contacto',
        body: 'Para cualquier consulta sobre estos términos puedes contactarnos a través del chat de soporte dentro de la aplicación o escribirnos a soporte@mishellroom.com.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    sections: [
      {
        heading: '1. Información que recopilamos',
        body: 'Recopilamos información que nos proporcionas al crear tu cuenta (nombre, correo, DNI, teléfono), datos de uso de la plataforma y, en caso de registro con DNI, una fotografía del documento de identidad.',
      },
      {
        heading: '2. Uso de la información',
        body: 'Utilizamos tu información para: gestionar tu cuenta y reservas, procesar pagos, enviarte notificaciones del servicio, mejorar la plataforma y cumplir con obligaciones legales.',
      },
      {
        heading: '3. Compartición de datos',
        body: 'No vendemos tus datos personales a terceros. Compartimos información únicamente con las partes necesarias para la prestación del servicio (propietarios con inquilinos para coordinar reservas) y con proveedores de servicios bajo acuerdos de confidencialidad.',
      },
      {
        heading: '4. Almacenamiento y seguridad',
        body: 'Tus datos se almacenan en servidores seguros con cifrado en tránsito y en reposo. Las contraseñas y PINs se almacenan siempre en formato encriptado y nunca en texto plano.',
      },
      {
        heading: '5. Tus derechos',
        body: 'Tienes derecho a acceder, rectificar o eliminar tu información personal en cualquier momento. Para ejercer estos derechos contacta a nuestro equipo de soporte. Atenderemos tu solicitud en un plazo máximo de 30 días.',
      },
      {
        heading: '6. Cookies',
        body: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del servicio y personalizar el contenido. Puedes controlar las cookies desde la configuración de tu navegador.',
      },
      {
        heading: '7. Menores de edad',
        body: 'Nuestro servicio no está dirigido a menores de 18 años. No recopilamos conscientemente datos de menores. Si detectamos que un usuario es menor de edad, eliminaremos su cuenta y datos de forma inmediata.',
      },
      {
        heading: '8. Contacto',
        body: 'Para consultas sobre privacidad escríbenos a privacidad@mishellroom.com o usa el chat de soporte dentro de la aplicación.',
      },
    ],
  },
};

export type LegalType = 'terms' | 'privacy' | null;

export function LegalModal({ type, onClose }: { type: LegalType; onClose: () => void }) {
  const content = type ? LEGAL_CONTENT[type] : null;

  return (
    <AnimatePresence>
      {type && content && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ maxHeight: '82dvh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-ink-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100 shrink-0">
              <h2 className="text-base font-bold text-ink-900">{content.title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {content.sections.map((s) => (
                <div key={s.heading}>
                  <p className="text-sm font-semibold text-ink-900 mb-1">{s.heading}</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
              <p className="text-xs text-ink-400 text-center pb-2">
                Última actualización: enero 2025
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
