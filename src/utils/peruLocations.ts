export interface PeruProvince {
  name: string;
  districts: string[];
}

export const PERU_LOCATIONS: Record<string, PeruProvince[]> = {
  Lima: [
    {
      name: 'Lima',
      districts: [
        'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos',
        'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María',
        'La Molina', 'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurigancho',
        'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana',
        'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra',
        'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
        'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
        'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco',
        'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo',
      ],
    },
    {
      name: 'Callao',
      districts: [
        'Bellavista', 'Callao', 'Carmen de la Legua Reynoso', 'La Perla',
        'La Punta', 'Mi Perú', 'Ventanilla',
      ],
    },
    {
      name: 'Huarochirí',
      districts: ['Chaclacayo', 'Chosica', 'Matucana', 'Ricardo Palma', 'San Mateo'],
    },
    {
      name: 'Cañete',
      districts: ['Imperial', 'Mala', 'San Vicente de Cañete', 'Lurín'],
    },
  ],

  Arequipa: [
    {
      name: 'Arequipa',
      districts: [
        'Alto Selva Alegre', 'Arequipa', 'Bustamante y Rivero', 'Cayma',
        'Cerro Colorado', 'Characato', 'Hunter', 'Jacobo Hunter', 'La Joya',
        'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Sabandia',
        'Sachaca', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Yanahuara', 'Yura',
      ],
    },
    {
      name: 'Camaná',
      districts: ['Camaná', 'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor'],
    },
    {
      name: 'Islay',
      districts: ['Cocachacra', 'Dean Valdivia', 'Islay', 'Mejía', 'Mollendo', 'Punta de Bombón'],
    },
  ],

  Cusco: [
    {
      name: 'Cusco',
      districts: [
        'Ccorca', 'Cusco', 'Poroy', 'San Jerónimo', 'San Sebastián',
        'Santiago', 'Saylla', 'Wanchaq',
      ],
    },
    {
      name: 'Urubamba',
      districts: ['Chinchero', 'Huayllabamba', 'Machu Picchu', 'Maras', 'Ollantaytambo', 'Urubamba', 'Yucay'],
    },
    {
      name: 'Quispicanchi',
      districts: ['Andahuaylillas', 'Cusipata', 'Huaro', 'Lucre', 'Marcapata', 'Ocongate', 'Urcos'],
    },
    {
      name: 'Canchis',
      districts: ['Checacupe', 'Combapata', 'Marangani', 'Pitumarca', 'San Pablo', 'San Pedro', 'Sicuani', 'Tinta'],
    },
  ],

  Trujillo: [
    {
      name: 'Trujillo',
      districts: [
        'El Porvenir', 'Florencia de Mora', 'Huanchaco', 'La Esperanza',
        'Laredo', 'Moche', 'Poroto', 'Salaverry', 'Simbal', 'Trujillo',
        'Víctor Larco Herrera',
      ],
    },
    {
      name: 'Ascope',
      districts: ['Ascope', 'Casa Grande', 'Chocope', 'Magdalena de Cao', 'Paiján', 'Rázuri', 'Santiago de Cao', 'Chicama'],
    },
    {
      name: 'Virú',
      districts: ['Chao', 'Guadalupito', 'Virú'],
    },
  ],

  Piura: [
    {
      name: 'Piura',
      districts: [
        'Castilla', 'Catacaos', 'Cura Mori', 'El Tallan', 'La Arena',
        'La Unión', 'Las Lomas', 'Piura', 'Tambogrande', 'Veintiseis de Octubre',
      ],
    },
    {
      name: 'Sullana',
      districts: ['Bellavista', 'Ignacio Escudero', 'Lancones', 'Marcavelica', 'Miguel Checa', 'Querecotillo', 'Salitral', 'Sullana'],
    },
    {
      name: 'Paita',
      districts: ['Amotape', 'Arenal', 'Colan', 'La Huaca', 'Lobitos', 'Los Organos', 'Mancora', 'Paita', 'Tamarindo'],
    },
    {
      name: 'Talara',
      districts: ['El Alto', 'La Brea', 'Lobitos', 'Los Órganos', 'Máncora', 'Pariñas'],
    },
  ],

  Chiclayo: [
    {
      name: 'Chiclayo',
      districts: [
        'Cayaltí', 'Chiclayo', 'Chongoyape', 'Eten', 'Eten Puerto',
        'José Leonardo Ortiz', 'La Victoria', 'Lagunas', 'Monsefú',
        'Nueva Arica', 'Oyotún', 'Picsi', 'Pimentel', 'Pomalca',
        'Pucalá', 'Reque', 'Santa Rosa', 'Saña', 'Pátapo', 'Tumán',
      ],
    },
    {
      name: 'Ferreñafe',
      districts: ['Cañaris', 'Ferreñafe', 'Incahuasi', 'Manuel Antonio Mesones Muro', 'Pitipo', 'Pueblo Nuevo'],
    },
    {
      name: 'Lambayeque',
      districts: ['Chochope', 'Illimo', 'Jayanca', 'Lambayeque', 'Mochumí', 'Mórrope', 'Motupe', 'Olmos', 'Pacora', 'Salas', 'San José', 'Tucume'],
    },
  ],
};

export function getProvinces(city: string): PeruProvince[] {
  return PERU_LOCATIONS[city] ?? [];
}

export function getDistricts(city: string, province: string): string[] {
  return PERU_LOCATIONS[city]?.find((p) => p.name === province)?.districts ?? [];
}
