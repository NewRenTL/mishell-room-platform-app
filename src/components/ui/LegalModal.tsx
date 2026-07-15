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
    date: 'Agosto 2026',
    sections: [
      {
        heading: '1. Objeto',
        body: 'MishellRoom es una plataforma digital intermediaria que conecta a propietarias o administradores autorizados de departamentos con inquilinas interesadas en alquilar habitaciones por periodos semanales, con posibilidad de continuidad por varias semanas o meses. Todas las solicitudes, aceptaciones, pagos y comunicaciones vinculadas al alquiler deben realizarse dentro de MishellRoom.',
      },
      {
        heading: '2. Aceptación',
        body: 'Al registrarte, acceder o usar MishellRoom, aceptas estos Términos de Servicio, la Política de Privacidad, la Política de Pagos, la Política contra la Discriminación y las demás políticas publicadas en la app o web.',
      },
      {
        heading: '3. Rol de MishellRoom',
        body: 'MishellRoom actúa como intermediaria tecnológica para facilitar publicaciones, validación de identidad, contacto entre usuarios, gestión operativa y registro de pagos dentro de la plataforma. MishellRoom no es propietaria de las habitaciones, no alquila ni subarrienda inmuebles directamente y no reemplaza a la propietaria o administradora autorizada en la relación contractual de alquiler o subarrendamiento.',
      },
      {
        heading: '4. Usuarias y capacidad legal',
        body: 'Pueden usar MishellRoom únicamente personas mayores de 18 años de edad con capacidad legal para contratar. Las usuarias podrán registrarse como inquilinas o como propietarias o administradoras autorizadas, y deberán completar el proceso de validación que solicite la plataforma.',
      },
      {
        heading: '5. Verificación de identidad',
        body: 'MishellRoom podrá solicitar documento de identidad, fotografía del documento, número de celular, correo electrónico y cualquier otra información razonable para verificar la identidad de las usuarias, prevenir fraudes y reforzar la seguridad de la comunidad. La información entregada debe ser veraz, completa y actualizada.',
      },
      {
        heading: '6. Publicación de habitaciones',
        body: 'La propietaria o administradora autorizada es responsable de publicar información real, clara y suficiente sobre la habitación ofrecida, incluyendo precio semanal, ubicación, condiciones de uso, servicios incluidos, reglas de convivencia, disponibilidad y fotografías reales. Quien publique una habitación declara que cuenta con facultad legal para alquilarla o subarrendarla.',
      },
      {
        heading: '7. Autorización para subarrendar',
        body: 'La administradora o arrendataria ofrece una habitación en subarrendamiento. En Perú, el subarrendamiento está permitido siempre y cuando se declaren ante la Sunat los debidos impuestos, por lo que la Administradora puede mostrar evidencia razonable de dichos impuestos cuando corresponda.',
      },
      {
        heading: '8. Solicitud, aceptación y contrato',
        body: 'Cuando una inquilina solicita una habitación y la propietaria o administradora autorizada la acepta dentro de MishellRoom, ambas partes celebran un acuerdo de alquiler o subarrendamiento sobre una habitación por periodos semanales. La continuidad por semanas adicionales o meses dependerá del pago semanal oportuno y del cumplimiento de las condiciones aceptadas en la plataforma.',
      },
      {
        heading: '9. Pagos',
        body: 'El pago del alquiler será semanal y por adelantado, según las condiciones informadas en cada publicación. Todo pago relacionado con el alquiler deberá realizarse dentro de MishellRoom, y está prohibido acordar pagos o cierres por fuera de la plataforma para evitar controles, comisiones o registros internos.',
      },
      {
        heading: '10. Plazo de gracia por falta de pago',
        body: 'Si la inquilina no realiza el pago correspondiente al inicio de una nueva semana, podrá aplicarse un plazo de gracia de 24 o 48 horas, según la configuración de MishellRoom o las condiciones informadas en la publicación. Vencido ese plazo sin pago efectivo, la propietaria o administradora autorizada podrá dar por terminado el alquiler semanal conforme al contrato aplicable y a las reglas de la plataforma.',
      },
      {
        heading: '11. Sin garantía',
        body: 'Por el momento, MishellRoom no maneja depósito de garantía. La obligación económica principal de la inquilina es pagar por adelantado la semana correspondiente, y la continuidad del alojamiento dependerá del cumplimiento de los pagos sucesivos acordados.',
      },
      {
        heading: '12. Responsabilidades de la propietaria o administradora',
        body: 'La propietaria o administradora autorizada es responsable por la veracidad del anuncio, por entregar la habitación en condiciones adecuadas de uso y habitabilidad, y por informar con claridad las reglas internas del inmueble.',
      },
      {
        heading: '13. Responsabilidades de la inquilina',
        body: 'La inquilina es responsable de usar la habitación y las áreas permitidas de manera adecuada, respetar las reglas del inmueble, pagar puntualmente cada semana y no causar daños, disturbios o usos contrarios a la ley. El incumplimiento podrá generar cancelación de la permanencia, suspensión de la cuenta y otras medidas previstas en la plataforma o en el contrato aplicable.',
      },
      {
        heading: '14. Conducta prohibida',
        body: 'Está prohibido publicar información falsa, suplantar identidad, discriminar, acosar, manipular pagos, cerrar acuerdos por fuera de MishellRoom, utilizar la app para fines ilícitos o vulnerar los sistemas de seguridad de la plataforma. MishellRoom podrá suspender anuncios, pagos o cuentas cuando detecte riesgos de fraude, incumplimientos o conductas abusivas.',
      },
      {
        heading: '15. Protección de datos',
        body: 'MishellRoom tratará los datos personales conforme a su Política de Privacidad y a la Ley de Protección de Datos Personales del Perú (Ley N.° 29733).',
      },
      {
        heading: '16. Reclamos',
        body: 'MishellRoom contará con canales de atención para consultas, quejas y reclamos. Además, como plataforma digital de comercio electrónico, deberá mantener un Libro de Reclamaciones virtual visible y accesible dentro de la app o web, conforme a la normativa peruana vigente.',
      },
      {
        heading: '17. Cambios en los términos',
        body: 'MishellRoom podrá actualizar estos Términos por razones legales, operativas o de seguridad. Los cambios relevantes serán informados antes de su entrada en vigencia mediante la app, la web o el correo registrado por la usuaria.',
      },
      {
        heading: '18. Ley aplicable',
        body: 'Estos Términos se rigen por las leyes de la República del Perú. Cualquier controversia será atendida conforme a la normativa peruana aplicable y a los mecanismos de atención al consumidor que correspondan.',
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
