import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Section {
  heading: string;
  body: string;
  items?: string[];
}

const LEGAL_CONTENT: Record<string, { title: string; date: string; sections: Section[] }> = {
  terms: {
    title: 'Términos de Servicio',
    date: 'Enero 2025',
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
        body: 'Para cualquier consulta sobre estos términos puedes contactarnos a través del chat de soporte dentro de la aplicación o escribirnos a contacto@mishellroom.com.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    date: 'Agosto 2026',
    sections: [
      {
        heading: '1. Identidad del responsable',
        body: 'MishellRoom es responsable del tratamiento de los datos personales recopilados a través de su aplicación y canales vinculados al servicio. Para consultas sobre privacidad o para ejercer derechos relacionados con datos personales, los usuarios pueden escribir a contacto@mishellroom.com.',
      },
      {
        heading: '2. Alcance',
        body: 'Esta Política de Privacidad explica cómo MishellRoom recopila, usa, almacena, protege y, cuando corresponde, comparte datos personales de personas que interactúan con la plataforma. Esta política ha sido elaborada para el mercado peruano y se rige por la Ley N.° 29733, su reglamento y demás normas aplicables.',
      },
      {
        heading: '3. Rol de MishellRoom',
        body: 'MishellRoom es una plataforma digital intermediaria que conecta a inquilinas con propietarios o administradores autorizados que publican habitaciones en alquiler o subarrendamiento. MishellRoom no alquila ni subarrienda inmuebles directamente, ni reemplaza al propietario o administrador en la relación contractual principal de alojamiento.',
      },
      {
        heading: '4. Datos personales que recopilamos',
        body: 'MishellRoom podrá recopilar los siguientes datos personales:',
        items: [
          'Nombres y apellidos.',
          'DNI o Carné de Extranjería.',
          'Fotografía del documento de identidad.',
          'Número de teléfono.',
          'Correo electrónico.',
          'Registros de contacto con soporte.',
          'Historial de comunicaciones entre el usuario y MishellRoom.',
          'Información básica vinculada a pagos, operaciones y reclamos.',
        ],
      },
      {
        heading: '5. Finalidades del tratamiento',
        body: 'MishellRoom trata datos personales para:',
        items: [
          'Crear y administrar cuentas dentro de la plataforma.',
          'Verificar manualmente la identidad de usuarias y anunciantes.',
          'Validar, cuando corresponda, la legitimidad del propietario o administrador autorizado que publica una habitación.',
          'Prevenir fraude, suplantación de identidad y uso indebido del servicio.',
          'Gestionar comunicaciones operativas y atención al usuario.',
          'Procesar y registrar pagos relacionados con el servicio de alquiler.',
          'Atender consultas, incidencias, reclamos y requerimientos legales.',
          'Cumplir obligaciones legales y regulatorias aplicables en el Perú.',
        ],
      },
      {
        heading: '6. Verificación de identidad',
        body: 'MishellRoom podrá solicitar la imagen del documento de identidad para realizar una validación manual de identidad. Una vez concluida la validación, la imagen del documento será eliminada, salvo que exista una obligación legal, un incidente de seguridad, una investigación por fraude o un reclamo que justifique su conservación temporal por el tiempo estrictamente necesario.',
      },
      {
        heading: '7. Base del tratamiento',
        body: 'MishellRoom trata los datos personales porque son necesarios para prestar el servicio solicitado por el usuario, cumplir obligaciones legales, reforzar la seguridad de la plataforma y prevenir fraude. Cuando corresponda, MishellRoom solicitará el consentimiento del titular de los datos, especialmente para finalidades no indispensables para la operación principal del servicio del alquiler.',
      },
      {
        heading: '8. Conservación de los datos',
        body: 'MishellRoom conservará los datos personales solo durante el tiempo necesario para cumplir la finalidad para la que fueron recopilados. De forma referencial:',
        items: [
          'Datos de cuenta: mientras la cuenta esté activa y hasta 2 años después de su cierre.',
          'Documento de identidad: solo durante el proceso de verificación manual; luego será eliminado, salvo fraude, reclamo o exigencia legal.',
          'Datos de pagos y operaciones: por el tiempo necesario para sustento contractual, control interno y cumplimiento contable, tributario o legal aplicable.',
          'Datos de reclamos: por al menos 2 años desde su registro.',
        ],
      },
      {
        heading: '9. Compartición de datos',
        body: 'MishellRoom podrá compartir datos personales únicamente cuando sea necesario para operar la plataforma, por ejemplo con proveedores tecnológicos, servicios de hosting, infraestructura, base de datos, soporte técnico, pasarelas de pago, entidades bancarias o autoridades competentes cuando exista obligación legal. También podrá compartir con el propietario o administrador autorizado solo los datos necesarios para concretar el proceso de alquiler o subarrendamiento, respetando el principio de minimización de datos.',
      },
      {
        heading: '10. Seguridad',
        body: 'MishellRoom adoptará medidas razonables de seguridad técnicas, organizativas y administrativas para proteger los datos personales frente a pérdida, acceso no autorizado, uso indebido, alteración o divulgación no autorizada. La Autoridad Nacional de Protección de Datos Personales es la entidad encargada de supervisar el cumplimiento de estas obligaciones en el Perú.',
      },
      {
        heading: '11. Derechos del titular',
        body: 'La persona titular de los datos puede ejercer sus derechos ARCO (acceso, rectificación, cancelación y oposición) conforme a la normativa peruana. MishellRoom atenderá estas solicitudes a través del correo contacto@mishellroom.com, dentro de los plazos y condiciones establecidos por la ley.',
      },
      {
        heading: '12. Comunicaciones',
        body: 'MishellRoom podrá enviar comunicaciones necesarias para el funcionamiento del servicio, como validaciones, alertas de seguridad, mensajes operativos, pagos, soporte y reclamos. MishellRoom no realizará marketing masivo general por el momento; si implementa acciones promocionales en el futuro, lo hará conforme a la normativa aplicable.',
      },
      {
        heading: '13. Menores de edad',
        body: 'MishellRoom está dirigida únicamente a personas mayores de 18 años de edad con capacidad legal para contratar. No está diseñada para menores de edad ni busca recopilar intencionalmente sus datos personales.',
      },
      {
        heading: '14. Cambios a esta política',
        body: 'MishellRoom podrá modificar esta Política de Privacidad para adaptarla a cambios legales, operativos o tecnológicos. Cuando los cambios sean relevantes, serán informados por medios razonables dentro de la plataforma o mediante el correo registrado por el usuario.',
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
            className="fixed bottom-0 left-0 right-0 max-w-107.5 mx-auto bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ maxHeight: '85dvh' }}
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
                  {s.items && (
                    <ul className="mt-1.5 flex flex-col gap-1 pl-1">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink-600 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <p className="text-xs text-ink-400 text-center pb-2">
                Última actualización: {content.date}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
