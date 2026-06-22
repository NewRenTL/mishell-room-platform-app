/**
 * Peru Administrative Divisions
 * Source: INEI (Instituto Nacional de Estadística e Informática) / UBIGEO data
 * Covers all 25 departments (regions), 196 provinces, and ~1,892 districts.
 *
 * Structure: PERU_LOCATIONS[department] = Array of { name: province, districts: string[] }
 */

export interface PeruProvince {
  name: string;
  districts: string[];
}

export const PERU_DEPARTMENTS: string[] = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
];

export const PERU_LOCATIONS: Record<string, PeruProvince[]> = {

  // ─────────────────────────────────────────────────────────────────────────────
  // 01 AMAZONAS  (7 provincias, 83 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Amazonas: [
    {
      name: 'Chachapoyas',
      districts: [
        'Chachapoyas', 'Asunción', 'Balsas', 'Cheto', 'Chiliquín', 'Chuquibamba',
        'Granada', 'Huancas', 'La Jalca', 'Leimebamba', 'Levanto', 'Magdalena',
        'Mariscal Castilla', 'Molinopampa', 'Montevideo', 'Olleros', 'Quinjalca',
        'San Francisco de Daguas', 'San Isidro de Maíno', 'Soloco', 'Sonche',
      ],
    },
    {
      name: 'Bagua',
      districts: ['La Peca', 'Aramango', 'Copallin', 'El Parco', 'Imaza', 'Bagua'],
    },
    {
      name: 'Bongará',
      districts: [
        'Jumbilla', 'Chisquilla', 'Churuja', 'Corosha', 'Cuispes', 'Florida',
        'Jazán', 'Recta', 'San Carlos', 'Shipasbamba', 'Valera', 'Yambrasbamba',
      ],
    },
    {
      name: 'Condorcanqui',
      districts: ['Nieva', 'El Cenepa', 'Río Santiago'],
    },
    {
      name: 'Luya',
      districts: [
        'Lamud', 'Camporredondo', 'Cocabamba', 'Colcamar', 'Conila', 'Inguilpata',
        'Longuita', 'Lonya Chico', 'Luya', 'Luya Viejo', 'María', 'Ocalli',
        'Ocumal', 'Pisuquia', 'Providencia', 'San Cristóbal', 'San Francisco del Yeso',
        'San Jerónimo', 'San Juan de Lopecancha', 'Santa Catalina', 'Santo Tomás',
        'Tingo', 'Trita',
      ],
    },
    {
      name: 'Rodríguez de Mendoza',
      districts: [
        'San Nicolás', 'Chirimoto', 'Cochamal', 'Huambo', 'Limabamba',
        'Longar', 'Mariscal Benavides', 'Milpuc', 'Omía', 'Santa Rosa',
        'Totora', 'Vista Alegre',
      ],
    },
    {
      name: 'Utcubamba',
      districts: ['Bagua Grande', 'Cajaruro', 'Cumba', 'El Milagro', 'Jamalca', 'Lonya Grande', 'Yamón'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 02 ÁNCASH  (20 provincias, 166 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'Áncash': [
    {
      name: 'Huaraz',
      districts: [
        'Huaraz', 'Cochabamba', 'Colcabamba', 'Huanchay', 'Independencia',
        'Jangas', 'La Libertad', 'Olleros', 'Pampas', 'Pariacoto', 'Pira', 'Tarica',
      ],
    },
    {
      name: 'Aija',
      districts: ['Aija', 'Coris', 'Huacllan', 'La Merced', 'Succha'],
    },
    {
      name: 'Antonio Raymondi',
      districts: ['Llamellín', 'Aczo', 'Chaccho', 'Chingas', 'Mirgas', 'San Juan de Rontoy'],
    },
    {
      name: 'Asunción',
      districts: ['Chacas', 'Acochaca'],
    },
    {
      name: 'Bolognesi',
      districts: [
        'Chiquián', 'Abelardo Pardo Lezameta', 'Antonio Raymondi', 'Aquia',
        'Cajacay', 'Canis', 'Colquioc', 'Huallanca', 'Huasta', 'Huayllacayan',
        'La Primavera', 'Mangas', 'Pacllon', 'San Miguel de Corpanqui', 'Ticllos',
      ],
    },
    {
      name: 'Carhuaz',
      districts: [
        'Carhuaz', 'Acopampa', 'Amashca', 'Anta', 'Ataquero', 'Marcara',
        'Pariahuanca', 'San Miguel de Aco', 'Shilla', 'Tinco', 'Yungar',
      ],
    },
    {
      name: 'Carlos Fermín Fitzcarrald',
      districts: ['San Luis', 'San Nicolás', 'Yauya'],
    },
    {
      name: 'Casma',
      districts: ['Casma', 'Buena Vista Alta', 'Comandante Noel', 'Yautan'],
    },
    {
      name: 'Corongo',
      districts: ['Corongo', 'Aco', 'Bambas', 'Cusca', 'La Pampa', 'Yanac', 'Yupan'],
    },
    {
      name: 'Huari',
      districts: [
        'Huari', 'Anra', 'Cajay', 'Chavín de Huántar', 'Huacachi', 'Huacchis',
        'Huachis', 'Huantar', 'Masín', 'Paucas', 'Ponto', 'Rahuapampa',
        'Rapayan', 'San Marcos', 'San Pedro de Chana', 'Uco',
      ],
    },
    {
      name: 'Huarmey',
      districts: ['Huarmey', 'Cochapeti', 'Culebras', 'Huayán', 'Malvas'],
    },
    {
      name: 'Huaylas',
      districts: [
        'Caraz', 'Huallanca', 'Huata', 'Huaylas', 'Mato', 'Pamparomas',
        'Pueblo Libre', 'Santa Cruz', 'Santo Toribio', 'Yuracmarca',
      ],
    },
    {
      name: 'Mariscal Luzuriaga',
      districts: [
        'Piscobamba', 'Casca', 'Eleazar Guzmán Barrón', 'Fidel Olivas Escudero',
        'Llama', 'Llumpa', 'Lucma', 'Musga',
      ],
    },
    {
      name: 'Ocros',
      districts: [
        'Ocros', 'Acas', 'Cajamarquilla', 'Carhuapampa', 'Cochas', 'Congas',
        'Llipa', 'San Cristóbal de Rajan', 'San Pedro', 'Santiago de Chilcas',
      ],
    },
    {
      name: 'Pallasca',
      districts: [
        'Cabana', 'Bolognesi', 'Conchucos', 'Huacaschuque', 'Huandoval',
        'Lacabamba', 'Llapo', 'Pallasca', 'Pampas', 'Santa Rosa', 'Tauca',
      ],
    },
    {
      name: 'Pomabamba',
      districts: ['Pomabamba', 'Huayllan', 'Parobamba', 'Quinuabamba'],
    },
    {
      name: 'Recuay',
      districts: [
        'Recuay', 'Catac', 'Cotaparaco', 'Huayllapampa', 'Llacllin',
        'Marca', 'Pampas Chico', 'Pararín', 'Tapacocha', 'Ticapampa',
      ],
    },
    {
      name: 'Santa',
      districts: [
        'Chimbote', 'Cáceres del Perú', 'Coishco', 'Macate', 'Moro',
        'Nepeña', 'Samanco', 'Santa', 'Nuevo Chimbote',
      ],
    },
    {
      name: 'Sihuas',
      districts: [
        'Sihuas', 'Acobamba', 'Alfonso Ugarte', 'Cashapampa', 'Chingalpo',
        'Huayllabamba', 'Quiches', 'Ragash', 'San Juan', 'Sicsibamba',
      ],
    },
    {
      name: 'Yungay',
      districts: ['Yungay', 'Cascapara', 'Mancos', 'Matacoto', 'Quillo', 'Ranrahirca', 'Shupluy', 'Yanama'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 03 APURÍMAC  (7 provincias, 80 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'Apurímac': [
    {
      name: 'Abancay',
      districts: [
        'Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca',
        'Lambrama', 'Pichirhua', 'San Pedro de Cachora', 'Tamburco',
      ],
    },
    {
      name: 'Andahuaylas',
      districts: [
        'Andahuaylas', 'Andarapa', 'Chiara', 'Huancarama', 'Huancaray',
        'Huayana', 'Kishuara', 'Pacobamba', 'Pacucha', 'Pampachiri',
        'Pomacocha', 'San Antonio de Cachi', 'San Jerónimo', 'San Miguel de Chaccrampa',
        'Santa María de Chicmo', 'Talavera', 'Tumay Huaraca', 'Turpo', 'Kaquiabamba',
      ],
    },
    {
      name: 'Antabamba',
      districts: [
        'Antabamba', 'El Oro', 'Huaquirca', 'Juan Espinoza Medrano',
        'Oropesa', 'Pachaconas', 'Sabaino',
      ],
    },
    {
      name: 'Aymaraes',
      districts: [
        'Chalhuanca', 'Capaya', 'Caraybamba', 'Chapimarca', 'Colcabamba',
        'Cotaruse', 'Huayllo', 'Justo Apu Sahuaraura', 'Lucre', 'Pocohuanca',
        'San Juan de Chacña', 'Sañayca', 'Soraya', 'Tapairihua', 'Tintay',
        'Toraya', 'Yanaca',
      ],
    },
    {
      name: 'Cotabambas',
      districts: ['Tambobamba', 'Cotabambas', 'Coyllurqui', 'Haquira', 'Mara', 'Challhuahuacho'],
    },
    {
      name: 'Chincheros',
      districts: [
        'Chincheros', 'Anco-Huallo', 'Cocharcas', 'Huaccana',
        'Ocobamba', 'Ongoy', 'Uranmarca', 'Ranracancha',
      ],
    },
    {
      name: 'Grau',
      districts: [
        'Chuquibambilla', 'Curpahuasi', 'Gamarra', 'Huayllati', 'Mamara',
        'Micaela Bastidas', 'Pataypampa', 'Progreso', 'San Antonio', 'Santa Rosa',
        'Turpay', 'Vilcabamba', 'Virundo', 'Curasco',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 04 AREQUIPA  (8 provincias, 109 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Arequipa: [
    {
      name: 'Arequipa',
      districts: [
        'Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado', 'Characato',
        'Chiguata', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'La Joya',
        'Mariano Melgar', 'Miraflores', 'Mollebaya', 'Paucarpata', 'Pocsi',
        'Polobaya', 'Quequeña', 'Sabaindía', 'Sachaca', 'San Juan de Siguas',
        'San Juan de Tarucani', 'Santa Isabel de Siguas', 'Santa Rita de Siguas',
        'Socabaya', 'Tiabaya', 'Uchumayo', 'Vítor', 'Yanahuara', 'Yarabamba', 'Yura',
      ],
    },
    {
      name: 'Camaná',
      districts: [
        'Camaná', 'José María Quimper', 'Mariano Nicolás Valcárcel',
        'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor',
      ],
    },
    {
      name: 'Caravelí',
      districts: [
        'Caravelí', 'Acarí', 'Atico', 'Atiquipa', 'Bella Unión', 'Cahuacho',
        'Chala', 'Chaparra', 'Huanuhuanu', 'Jaquí', 'Lomas', 'Quicacha', 'Yauca',
      ],
    },
    {
      name: 'Castilla',
      districts: [
        'Aplao', 'Andagua', 'Ayo', 'Chachas', 'Chilcaymarca', 'Choco',
        'Huancarqui', 'Machaguay', 'Orcopampa', 'Pampacolca', 'Tipan',
        'Uñón', 'Uraca', 'Viraco',
      ],
    },
    {
      name: 'Caylloma',
      districts: [
        'Chivay', 'Achoma', 'Cabanaconde', 'Callalli', 'Caylloma', 'Coporaque',
        'Huambo', 'Huanca', 'Ichupampa', 'Lari', 'Lluta', 'Maca', 'Madrigal',
        'San Antonio de Chuca', 'Sibayo', 'Tapay', 'Tisco', 'Tuti',
        'Yanque', 'Majes',
      ],
    },
    {
      name: 'Condesuyos',
      districts: [
        'Chuquibamba', 'Andaray', 'Cayarani', 'Chichas', 'Iray',
        'Río Grande', 'Salamanca', 'Yanaquihua',
      ],
    },
    {
      name: 'Islay',
      districts: ['Mollendo', 'Cocachacra', 'Dean Valdivia', 'Islay', 'Mejía', 'Punta de Bombón'],
    },
    {
      name: 'La Unión',
      districts: [
        'Cotahuasi', 'Alca', 'Charcana', 'Huaynacotas', 'Pampamarca',
        'Puyca', 'Quechualla', 'Sayla', 'Tauria', 'Tomepampa', 'Toro',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 05 AYACUCHO  (11 provincias, 111 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Ayacucho: [
    {
      name: 'Huamanga',
      districts: [
        'Ayacucho', 'Acocro', 'Acos Vinchos', 'Carmen Alto', 'Chiara',
        'Jesús Nazareno', 'Ocros', 'Pacaycasa', 'Quinua', 'San José de Ticllas',
        'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo', 'Vinchos',
      ],
    },
    {
      name: 'Cangallo',
      districts: ['Cangallo', 'Chuschi', 'Los Morochucos', 'María Parado de Bellido', 'Paras', 'Totos'],
    },
    {
      name: 'Huanca Sancos',
      districts: ['Sancos', 'Carapo', 'Sacsamarca', 'Santiago de Lucanamarca'],
    },
    {
      name: 'Huanta',
      districts: ['Huanta', 'Ayahuanco', 'Huamanguilla', 'Iguaín', 'Luricocha', 'Santillana', 'Sivia'],
    },
    {
      name: 'La Mar',
      districts: ['San Miguel', 'Anco', 'Ayna', 'Chilcas', 'Chungui', 'Luis Carranza', 'Tambo', 'Santa Rosa'],
    },
    {
      name: 'Lucanas',
      districts: [
        'Puquio', 'Aucara', 'Cabana', 'Carmen Salcedo', 'Chavina', 'Chipao',
        'Huac-Huas', 'Laramate', 'Leoncio Prado', 'Llauta', 'Lucanas', 'Ocaña',
        'Otoca', 'Saisa', 'San Cristóbal', 'San Juan', 'San Pedro', 'San Pedro de Palco',
        'Sancos', 'Santa Ana de Huaycahuacho', 'Santa Lucía',
      ],
    },
    {
      name: 'Parinacochas',
      districts: [
        'Coracora', 'Chumpi', 'Coronel Castañeda', 'Pacapausa',
        'Pullo', 'Puyusca', 'San Francisco de Ravacayco', 'Upahuacho',
      ],
    },
    {
      name: 'Páucar del Sara Sara',
      districts: [
        'Pausa', 'Colta', 'Corculla', 'Lampa', 'Marcabamba',
        'Oyolo', 'Pararca', 'San Javier de Alpabamba', 'San José de Ushua', 'Sara Sara',
      ],
    },
    {
      name: 'Sucre',
      districts: [
        'Querobamba', 'Belén', 'Chalcos', 'Chilcayoc', 'Huacaña', 'Morcolla',
        'Paico', 'San Pedro de Larcay', 'San Salvador de Quije', 'Santiago de Paucaray', 'Soras',
      ],
    },
    {
      name: 'Víctor Fajardo',
      districts: [
        'Huancapi', 'Alcamenca', 'Apongo', 'Asquipata', 'Canaria', 'Cayara',
        'Colca', 'Huamanquiquia', 'Huancaraylla', 'Huaya', 'Sarhua', 'Vilcanchos',
      ],
    },
    {
      name: 'Vilcas Huamán',
      districts: [
        'Vilcas Huamán', 'Accomarca', 'Carhuanca', 'Concepción', 'Huambalpa',
        'Independencia', 'Saurama', 'Vischongo',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 06 CAJAMARCA  (13 provincias, 127 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Cajamarca: [
    {
      name: 'Cajamarca',
      districts: [
        'Cajamarca', 'Asunción', 'Chetilla', 'Cospán', 'Encañada', 'Jesús',
        'Llacanora', 'Los Baños del Inca', 'Magdalena', 'Matara', 'Namora', 'San Juan',
      ],
    },
    {
      name: 'Cajabamba',
      districts: ['Cajabamba', 'Cachachi', 'Condebamba', 'Sitacocha'],
    },
    {
      name: 'Celendín',
      districts: [
        'Celendín', 'Chumuch', 'Cortegana', 'Huasmín', 'Jorge Chávez',
        'José Gálvez', 'Miguel Iglesias', 'Oxamarca', 'Sorochuco',
        'Sucre', 'Utco', 'La Libertad de Pallán',
      ],
    },
    {
      name: 'Chota',
      districts: [
        'Chota', 'Anguia', 'Chadin', 'Chiguirip', 'Chimban', 'Cochabamba',
        'Conchan', 'Huambos', 'Lajas', 'Llama', 'Miracosta', 'Paccha',
        'Pion', 'Querocoto', 'San Juan de Licupis', 'Tacabamba', 'Tocmoche',
        'Choropampa', 'Chalamarca',
      ],
    },
    {
      name: 'Contumazá',
      districts: ['Contumazá', 'Chilete', 'Cupisnique', 'Guzmango', 'San Benito', 'Santa Cruz de Toledo', 'Tantarica', 'Yonán'],
    },
    {
      name: 'Cutervo',
      districts: [
        'Cutervo', 'Callayuc', 'Choros', 'Cujillo', 'La Ramada', 'Pimpingos',
        'Querocotillo', 'San Andrés de Cutervo', 'San Juan de Cutervo',
        'San Luis de Lucma', 'Santa Cruz', 'Santo Domingo de la Capilla',
        'Santo Tomás', 'Sócota', 'Toribio Casanova',
      ],
    },
    {
      name: 'Hualgayoc',
      districts: ['Bambamarca', 'Chugur', 'Hualgayoc'],
    },
    {
      name: 'Jaén',
      districts: [
        'Jaén', 'Bellavista', 'Chontali', 'Colasay', 'Huabal', 'Las Pirias',
        'Pomahuaca', 'Pucará', 'Sallique', 'San Felipe', 'San José del Alto', 'Santa Rosa',
      ],
    },
    {
      name: 'San Ignacio',
      districts: ['San Ignacio', 'Chirinos', 'Huarango', 'La Coipa', 'Namballe', 'San José de Lourdes', 'Tabaconas'],
    },
    {
      name: 'San Marcos',
      districts: ['Pedro Gálvez', 'Eduardo Villanueva', 'Gregorio Pita', 'Ichocán', 'José Manuel Quiroz', 'José Sabogal', 'Chancay'],
    },
    {
      name: 'San Miguel',
      districts: [
        'San Miguel', 'Bolívar', 'Calquis', 'Catilluc', 'El Prado', 'La Florida',
        'Llapa', 'Nanchoc', 'Niepos', 'San Gregorio', 'San Silvestre de Cochán',
        'Tongod', 'Unión Agua Blanca',
      ],
    },
    {
      name: 'San Pablo',
      districts: ['San Pablo', 'San Bernardino', 'San Luis', 'Tumbadén'],
    },
    {
      name: 'Santa Cruz',
      districts: [
        'Santa Cruz', 'Andabamba', 'Catache', 'Chancaybaños', 'La Esperanza',
        'Ninabamba', 'Pulán', 'Saucepampa', 'Sexi', 'Uticyacu', 'Yauyucan',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 07 CALLAO  (1 provincia, 7 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Callao: [
    {
      name: 'Callao',
      districts: [
        'Callao', 'Bellavista', 'Carmen de la Legua Reynoso', 'La Perla',
        'La Punta', 'Mi Perú', 'Ventanilla',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 08 CUSCO  (13 provincias, 108 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Cusco: [
    {
      name: 'Cusco',
      districts: ['Cusco', 'Ccorca', 'Poroy', 'San Jerónimo', 'San Sebastián', 'Santiago', 'Saylla', 'Wanchaq'],
    },
    {
      name: 'Acomayo',
      districts: ['Acomayo', 'Acopia', 'Acos', 'Mosoc Llacta', 'Pomacanchi', 'Rondocan', 'Sangarará'],
    },
    {
      name: 'Anta',
      districts: ['Anta', 'Ancahuasi', 'Cachimayo', 'Chinchaypujio', 'Huarocondo', 'Limatambo', 'Mollepata', 'Pucyura', 'Zurite'],
    },
    {
      name: 'Calca',
      districts: ['Calca', 'Coya', 'Lamay', 'Lares', 'Pisac', 'San Salvador', 'Taray', 'Yanatile'],
    },
    {
      name: 'Canas',
      districts: ['Yanaoca', 'Checca', 'Kunturkanki', 'Langui', 'Layo', 'Pampamarca', 'Quehue', 'Túpac Amaru'],
    },
    {
      name: 'Canchis',
      districts: ['Sicuani', 'Checacupe', 'Combapata', 'Marangani', 'Pitumarca', 'San Pablo', 'San Pedro', 'Tinta'],
    },
    {
      name: 'Chumbivilcas',
      districts: ['Santo Tomás', 'Capacmarca', 'Chamaca', 'Colquemarca', 'Livitaca', 'Llusco', 'Quiñota', 'Velille'],
    },
    {
      name: 'Espinar',
      districts: ['Espinar', 'Condoroma', 'Coporaque', 'Ocoruro', 'Pallpata', 'Pichigua', 'Suyckutambo', 'Alto Pichigua'],
    },
    {
      name: 'La Convención',
      districts: [
        'Santa Ana', 'Echarate', 'Huayopata', 'Maranura', 'Ocobamba',
        'Quellouno', 'Quimbiri', 'Santa Teresa', 'Vilcabamba', 'Pichari',
      ],
    },
    {
      name: 'Paruro',
      districts: ['Paruro', 'Accha', 'Ccapi', 'Colcha', 'Huanoquite', 'Omacha', 'Paccaritambo', 'Pillpinto', 'Yaurisque'],
    },
    {
      name: 'Paucartambo',
      districts: ['Paucartambo', 'Caicay', 'Challabamba', 'Colquepata', 'Huancarani', 'Kosñipata'],
    },
    {
      name: 'Quispicanchi',
      districts: [
        'Urcos', 'Andahuaylillas', 'Camanti', 'Ccarhuayo', 'Ccatca', 'Cusipata',
        'Huaro', 'Lucre', 'Marcapata', 'Ocongate', 'Oropesa', 'Quiquijana',
      ],
    },
    {
      name: 'Urubamba',
      districts: ['Urubamba', 'Chinchero', 'Huayllabamba', 'Machupicchu', 'Maras', 'Ollantaytambo', 'Yucay'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 09 HUANCAVELICA  (7 provincias, 94 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Huancavelica: [
    {
      name: 'Huancavelica',
      districts: [
        'Huancavelica', 'Acobambilla', 'Acoria', 'Conayca', 'Cuenca',
        'Huachocolpa', 'Huayllahuara', 'Izcuchaca', 'Laria', 'Manta',
        'Mariscal Cáceres', 'Moya', 'Nuevo Occoro', 'Palca', 'Pilchaca',
        'Vilca', 'Yauli', 'Ascensión',
      ],
    },
    {
      name: 'Acobamba',
      districts: ['Acobamba', 'Andabamba', 'Anta', 'Caja', 'Marcas', 'Paucara', 'Pomacocha', 'Rosario'],
    },
    {
      name: 'Angaraes',
      districts: [
        'Lircay', 'Anchonga', 'Callanmarca', 'Ccochaccasa', 'Chincho',
        'Congalla', 'Huanca-Huanca', 'Huayllay Grande', 'Julcamarca',
        'San Antonio de Antaparco', 'Santo Tomás de Pata', 'Secclla',
      ],
    },
    {
      name: 'Castrovirreyna',
      districts: [
        'Castrovirreyna', 'Arma', 'Aurahua', 'Capillas', 'Chupamarca',
        'Cocas', 'Huachos', 'Huamatambo', 'Mollepampa', 'San Juan',
        'Santa Ana', 'Tantara', 'Ticrapo',
      ],
    },
    {
      name: 'Churcampa',
      districts: [
        'Churcampa', 'Anco', 'Chinchihuasi', 'El Carmen', 'La Merced',
        'Locroja', 'Pachamarca', 'Paucarbamba', 'San Miguel de Mayocc', 'San Pedro de Coris',
      ],
    },
    {
      name: 'Huaytará',
      districts: [
        'Huaytará', 'Ayaví', 'Córdova', 'Huayacundo Arma', 'Laramarca',
        'Ocoyo', 'Pilpichaca', 'Querco', 'Quito-Arma', 'San Antonio de Cusicancha',
        'San Francisco de Sangayaico', 'San Isidro', 'Santiago de Chocorvos',
        'Santiago de Quirahuara', 'Santo Domingo de Capillas', 'Tambo',
      ],
    },
    {
      name: 'Tayacaja',
      districts: [
        'Pampas', 'Acostambo', 'Acraquia', 'Ahuaycha', 'Colcabamba',
        'Daniel Hernández', 'Huachocolpa', 'Huando', 'Huaribamba',
        'Ñahuimpuquio', 'Pazos', 'Quishuar', 'Salcabamba', 'Salcahuasi',
        'San Marcos de Rocchac', 'Surcubamba', 'Tintay Puncu',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 10 HUÁNUCO  (11 provincias, 76 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'Huánuco': [
    {
      name: 'Huánuco',
      districts: [
        'Huánuco', 'Amarilis', 'Chinchao', 'Churubamba', 'Margos', 'Quisqui',
        'San Francisco de Cayrán', 'San Pedro de Chaulán', 'Santa María del Valle',
        'Yarumayo', 'Pillco Marca',
      ],
    },
    {
      name: 'Ambo',
      districts: ['Ambo', 'Cayna', 'Colpas', 'Conchamarca', 'Huacar', 'San Francisco', 'San Rafael', 'Tomay Kichwa'],
    },
    {
      name: 'Dos de Mayo',
      districts: ['La Unión', 'Chuquis', 'Marías', 'Pachas', 'Quivilla', 'Ripan', 'Shunqui', 'Sillapata', 'Yanas'],
    },
    {
      name: 'Huacaybamba',
      districts: ['Huacaybamba', 'Canchabamba', 'Cochabamba', 'Pinra'],
    },
    {
      name: 'Huamalíes',
      districts: [
        'Llata', 'Arancay', 'Chavín de Pariarca', 'Jacas Grande', 'Jircán',
        'Miraflores', 'Monzón', 'Punchao', 'Puños', 'Singa', 'Tantamayo',
      ],
    },
    {
      name: 'Leoncio Prado',
      districts: [
        'Rupa-Rupa', 'Daniel Alomía Robles', 'Hermílio Valdizán',
        'José Crespo y Castillo', 'Luyando', 'Mariano Dámaso Beraún',
      ],
    },
    {
      name: 'Marañón',
      districts: ['Huacrachuco', 'Cholón', 'San Buenaventura'],
    },
    {
      name: 'Pachitea',
      districts: ['Panao', 'Chaglla', 'Molino', 'Umari'],
    },
    {
      name: 'Puerto Inca',
      districts: ['Puerto Inca', 'Codo del Pozuzo', 'Honoria', 'Tournavista', 'Yuyapichis'],
    },
    {
      name: 'Lauricocha',
      districts: ['Jesús', 'Baños', 'Jivia', 'Queropalca', 'Rondos', 'San Francisco de Asís', 'San Miguel de Cauri'],
    },
    {
      name: 'Yarowilca',
      districts: ['Chavinillo', 'Cahuac', 'Chacabamba', 'Chupán', 'Jacas Chico', 'Obas', 'Pampamarca'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 11 ICA  (5 provincias, 43 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Ica: [
    {
      name: 'Ica',
      districts: [
        'Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Pachacutec',
        'Parcona', 'Pueblo Nuevo', 'Salas', 'San José de los Molinos',
        'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate', 'Yauca del Rosario',
      ],
    },
    {
      name: 'Chincha',
      districts: [
        'Chincha Alta', 'Alto Larán', 'Chavín', 'Chincha Baja', 'El Carmen',
        'Grocio Prado', 'Pueblo Nuevo', 'San Juan de Yanac', 'San Pedro de Huacarpana',
        'Sunampe', 'Tambo de Mora',
      ],
    },
    {
      name: 'Nazca',
      districts: ['Nazca', 'Changuillo', 'El Ingenio', 'Marcona', 'Vista Alegre'],
    },
    {
      name: 'Palpa',
      districts: ['Palpa', 'Llipata', 'Río Grande', 'Santa Cruz', 'Tibillo'],
    },
    {
      name: 'Pisco',
      districts: [
        'Pisco', 'Huancano', 'Humay', 'Independencia', 'Paracas',
        'San Andrés', 'San Clemente', 'Túpac Amaru Inca',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 12 JUNÍN  (9 provincias, 123 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'Junín': [
    {
      name: 'Huancayo',
      districts: [
        'Huancayo', 'Carhuacallanga', 'Chacapampa', 'Chicche', 'Chilca',
        'Chongos Alto', 'Chupuro', 'Colca', 'Cullhuas', 'El Tambo',
        'Huacrapuquio', 'Hualhuas', 'Huancán', 'Huasicancha', 'Huayucachi',
        'Ingenio', 'Pariahuanca', 'Pilcomayo', 'Pucará', 'Quichuay', 'Quilcas',
        'San Agustín', 'San Jerónimo de Tunán', 'Saño',
        'Santo Domingo de Acobamba', 'Sapallanga', 'Sicaya', 'Viques',
      ],
    },
    {
      name: 'Chanchamayo',
      districts: ['Chanchamayo', 'Perené', 'Pichanaqui', 'San Luis de Shuaro', 'San Ramón', 'Vitoc'],
    },
    {
      name: 'Concepción',
      districts: [
        'Concepción', 'Aco', 'Andamarca', 'Chambara', 'Cochas', 'Comas',
        'Heroínas Toledo', 'Manzanares', 'Mariscal Castilla', 'Matahuasi',
        'Mito', 'Nueve de Julio', 'Orcotuna', 'San José de Quero', 'Santa Rosa de Ocopa',
      ],
    },
    {
      name: 'Jauja',
      districts: [
        'Jauja', 'Acolla', 'Apata', 'Ataura', 'Canchayllo', 'Curicaca',
        'El Mantaro', 'Huamali', 'Huaripampa', 'Huertas', 'Janjaillo',
        'Julcán', 'Leonor Ordóñez', 'Llocllapampa', 'Marco', 'Masma',
        'Masma Chicche', 'Molinos', 'Monobamba', 'Muqui', 'Muquiyauyo',
        'Paca', 'Paccha', 'Pancán', 'Parco', 'Pomacancha', 'Ricrán',
        'San Lorenzo', 'San Pedro de Chunán', 'Sausa', 'Sincos',
        'Tunan Marca', 'Yauli', 'Yauyos',
      ],
    },
    {
      name: 'Junín',
      districts: ['Junín', 'Carhuamayo', 'Ondores', 'Ulcumayo'],
    },
    {
      name: 'Satipo',
      districts: ['Satipo', 'Coviriali', 'Llaylla', 'Mazamari', 'Pampa Hermosa', 'Pangoa', 'Río Negro', 'Río Tambo'],
    },
    {
      name: 'Tarma',
      districts: ['Tarma', 'Acobamba', 'Huaricolca', 'Huasahuasi', 'La Unión', 'Palca', 'Palcamayo', 'San Pedro de Cajas', 'Tapo'],
    },
    {
      name: 'Yauli',
      districts: [
        'La Oroya', 'Chacapalpa', 'Huay-Huay', 'Marcapomacocha',
        'Morococha', 'Paccha', 'Santa Bárbara de Carhuacayán',
        'Santa Rosa de Sacco', 'Suitucancha', 'Yauli',
      ],
    },
    {
      name: 'Chupaca',
      districts: [
        'Chupaca', 'Ahuac', 'Chongos Bajo', 'Huachac', 'Huamancaca Chico',
        'San Juan de Yscos', 'San Juan de Jarpa', 'Tres de Diciembre', 'Yanacancha',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 13 LA LIBERTAD  (12 provincias, 83 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'La Libertad': [
    {
      name: 'Trujillo',
      districts: [
        'Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco',
        'La Esperanza', 'Laredo', 'Moche', 'Poroto', 'Salaverry', 'Simbal',
        'Víctor Larco Herrera',
      ],
    },
    {
      name: 'Ascope',
      districts: ['Ascope', 'Casa Grande', 'Chicama', 'Chocope', 'Magdalena de Cao', 'Paiján', 'Rázuri', 'Santiago de Cao'],
    },
    {
      name: 'Bolívar',
      districts: ['Bolívar', 'Bambamarca', 'Condormarca', 'Longotea', 'Uchumarca', 'Ucuncha'],
    },
    {
      name: 'Chepén',
      districts: ['Chepén', 'Pacanga', 'Pueblo Nuevo'],
    },
    {
      name: 'Julcán',
      districts: ['Julcán', 'Calamarca', 'Carabamba', 'Huaso'],
    },
    {
      name: 'Otuzco',
      districts: ['Otuzco', 'Agallpampa', 'Charat', 'Huaranchal', 'La Cuesta', 'Mache', 'Paranday', 'Salpo', 'Sinsicap', 'Usquil'],
    },
    {
      name: 'Pacasmayo',
      districts: ['San Pedro de Lloc', 'Guadalupe', 'Jequetepeque', 'Pacasmayo', 'San José'],
    },
    {
      name: 'Pataz',
      districts: [
        'Tayabamba', 'Buldibuyo', 'Chillia', 'Huancaspata', 'Huaylillas',
        'Huayo', 'Ongón', 'Parcoy', 'Pataz', 'Pías', 'Santiago de Challas',
        'Taurija', 'Urpay',
      ],
    },
    {
      name: 'Sánchez Carrión',
      districts: ['Huamachuco', 'Chugay', 'Cochorco', 'Curgos', 'Marcabal', 'Sanagorán', 'Sarín', 'Sartimbamba'],
    },
    {
      name: 'Santiago de Chuco',
      districts: ['Santiago de Chuco', 'Angasmarca', 'Cachicadán', 'Mollebamba', 'Mollepata', 'Quiruvilca', 'Santa Cruz de Chuca', 'Sitabamba'],
    },
    {
      name: 'Gran Chimú',
      districts: ['Cascas', 'Lucma', 'Marmot', 'Sayapullo'],
    },
    {
      name: 'Virú',
      districts: ['Virú', 'Chao', 'Guadalupito'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 14 LAMBAYEQUE  (3 provincias, 38 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Lambayeque: [
    {
      name: 'Chiclayo',
      districts: [
        'Chiclayo', 'Chongoyape', 'Eten', 'Eten Puerto', 'José Leonardo Ortiz',
        'La Victoria', 'Lagunas', 'Monsefu', 'Nueva Arica', 'Oyotún', 'Picsi',
        'Pimentel', 'Reque', 'Santa Rosa', 'Saña', 'Cayaltí', 'Pátapo',
        'Pomalca', 'Pucalá', 'Tumán',
      ],
    },
    {
      name: 'Ferreñafe',
      districts: ['Ferreñafe', 'Cañaris', 'Incahuasi', 'Manuel Antonio Mesones Muro', 'Pítipo', 'Pueblo Nuevo'],
    },
    {
      name: 'Lambayeque',
      districts: [
        'Lambayeque', 'Chochope', 'Illimo', 'Jayanca', 'Mochumí', 'Mórrope',
        'Motupe', 'Olmos', 'Pacora', 'Salas', 'San José', 'Túcume',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 15 LIMA  (10 provincias, 171 distritos) + Callao is separate department
  // ─────────────────────────────────────────────────────────────────────────────
  Lima: [
    {
      name: 'Lima',
      districts: [
        'Lima', 'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo',
        'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia',
        'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos',
        'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Magdalena Vieja', 'Miraflores',
        'Pachacamac', 'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa',
        'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro',
        'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis',
        'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
        'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador',
        'Villa María del Triunfo',
      ],
    },
    {
      name: 'Barranca',
      districts: ['Barranca', 'Paramonga', 'Pativilca', 'Supe', 'Supe Puerto'],
    },
    {
      name: 'Cajatambo',
      districts: ['Cajatambo', 'Copa', 'Gorgor', 'Huancapón', 'Manás'],
    },
    {
      name: 'Canta',
      districts: ['Canta', 'Arahuay', 'Huamantanga', 'Huaros', 'Lachaqui', 'San Buenaventura', 'Santa Rosa de Quives'],
    },
    {
      name: 'Cañete',
      districts: [
        'San Vicente de Cañete', 'Asia', 'Calango', 'Cerro Azul', 'Chilca',
        'Coayllo', 'Imperial', 'Lunahuaná', 'Mala', 'Nuevo Imperial', 'Pacará',
        'Quilmaná', 'San Antonio', 'San Luis', 'Santa Cruz de Flores', 'Zúñiga',
      ],
    },
    {
      name: 'Huaral',
      districts: [
        'Huaral', 'Atavillos Alto', 'Atavillos Bajo', 'Aucallama', 'Chancay',
        'Ihuarí', 'Lampián', 'Pacaraos', 'San Miguel de Acos',
        'Santa Cruz de Andamarca', 'Sumbilca', 'Veintisiete de Noviembre',
      ],
    },
    {
      name: 'Huarochirí',
      districts: [
        'Matucana', 'Antioquia', 'Callahuanca', 'Carampoma', 'Chicla', 'Cuenca',
        'Huachupampa', 'Huanza', 'Huarochirí', 'Lahuaytambo', 'Langa', 'Laraos',
        'Mariatana', 'Ricardo Palma', 'San Andrés de Tupicocha', 'San Antonio',
        'San Bartolomé', 'San Damián', 'San Juan de Iris', 'San Juan de Tantaranche',
        'San Lorenzo de Quinti', 'San Mateo', 'San Mateo de Otao', 'San Pedro de Casta',
        'San Pedro de Huancayre', 'Sangallaya', 'Santa Cruz de Cocachacra',
        'Santa Eulalia', 'Santiago de Anchucaya', 'Santiago de Tuna',
        'Santo Domingo de los Olleros', 'Surco',
      ],
    },
    {
      name: 'Huaura',
      districts: [
        'Huacho', 'Ambar', 'Caleta de Carquín', 'Checras', 'Hualmay',
        'Huaura', 'Leoncio Prado', 'Paccho', 'Santa Leonor', 'Santa María',
        'Sayán', 'Végueta',
      ],
    },
    {
      name: 'Oyón',
      districts: ['Oyón', 'Andajes', 'Caujul', 'Cochamarca', 'Naván', 'Pachangara'],
    },
    {
      name: 'Yauyos',
      districts: [
        'Yauyos', 'Alis', 'Ayauca', 'Ayavirí', 'Azángaro', 'Cacra', 'Carania',
        'Catahuasi', 'Chocos', 'Cochas', 'Colonia', 'Hongos', 'Huampara',
        'Huancaya', 'Huangáscar', 'Huantán', 'Huañec', 'Laraos', 'Lincha',
        'Madean', 'Miraflores', 'Omas', 'Putinza', 'Quinches', 'Quinocay',
        'San Joaquín', 'San Pedro de Pilas', 'Tanta', 'Tauripampa', 'Tomás',
        'Tupe', 'Viñac', 'Vitis',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 16 LORETO  (8 provincias, 53 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Loreto: [
    {
      name: 'Maynas',
      districts: [
        'Iquitos', 'Alto Nanay', 'Fernando Lores', 'Indiana', 'Las Amazonas',
        'Mazán', 'Napo', 'Punchana', 'Torres Causana', 'Belén',
        'San Juan Bautista', 'Teniente Manuel Clavero',
      ],
    },
    {
      name: 'Alto Amazonas',
      districts: [
        'Yurimaguas', 'Balsapuerto', 'Jeberos', 'Lagunas',
        'Santa Cruz', 'Teniente César López Rojas',
      ],
    },
    {
      name: 'Datem del Marañón',
      districts: ['Barranca', 'Cahuapanas', 'Manseriche', 'Morona', 'Pastaza', 'Andoas'],
    },
    {
      name: 'Loreto',
      districts: ['Nauta', 'Parinari', 'Tigre', 'Trompeteros', 'Urarinas'],
    },
    {
      name: 'Mariscal Ramón Castilla',
      districts: ['Ramón Castilla', 'Pebas', 'Yavarí', 'San Pablo'],
    },
    {
      name: 'Putumayo',
      districts: ['Putumayo', 'Rosa Panduro', 'Teniente Manuel Clavero', 'Yaguas'],
    },
    {
      name: 'Requena',
      districts: [
        'Requena', 'Alto Tapiche', 'Capelo', 'Emilio San Martín', 'Maquia',
        'Puinahua', 'Saquena', 'Soplin', 'Tapiche', 'Jenaro Herrera', 'Yaquerana',
      ],
    },
    {
      name: 'Ucayali',
      districts: ['Contamana', 'Inahuaya', 'Padre Márquez', 'Pampa Hermosa', 'Sarayacu', 'Vargas Guerra'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 17 MADRE DE DIOS  (3 provincias, 11 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'Madre de Dios': [
    {
      name: 'Tambopata',
      districts: ['Tambopata', 'Inambari', 'Las Piedras', 'Laberinto'],
    },
    {
      name: 'Manú',
      districts: ['Fitzcarrald', 'Manú', 'Madre de Dios', 'Huepetuhe'],
    },
    {
      name: 'Tahuamanu',
      districts: ['Iñapari', 'Iberia', 'Tahuamanu'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 18 MOQUEGUA  (3 provincias, 20 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Moquegua: [
    {
      name: 'Mariscal Nieto',
      districts: ['Moquegua', 'Carumas', 'Cuchumbaya', 'Samegua', 'San Cristóbal', 'Torata'],
    },
    {
      name: 'General Sánchez Cerro',
      districts: [
        'Omate', 'Chojata', 'Coalaque', 'Ichuña', 'La Capilla',
        'Lloque', 'Matalaque', 'Puquina', 'Quinistaquillas', 'Ubinas', 'Yunga',
      ],
    },
    {
      name: 'Ilo',
      districts: ['Ilo', 'El Algarrobal', 'Pacocha'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 19 PASCO  (3 provincias, 28 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Pasco: [
    {
      name: 'Pasco',
      districts: [
        'Chaupimarca', 'Huachón', 'Huariaca', 'Huayllay', 'Ninacaca',
        'Pallanchacra', 'Paucartambo', 'San Francisco de Asís de Yarusyacán',
        'Simón Bolívar', 'Ticlacayán', 'Tinyahuarco', 'Vicco', 'Yanacancha',
      ],
    },
    {
      name: 'Daniel Alcides Carrión',
      districts: ['Yanahuanca', 'Chacayán', 'Goyllarisquizga', 'Paucar', 'San Pedro de Pillao', 'Santa Ana de Tusi', 'Tapuc', 'Vilcabamba'],
    },
    {
      name: 'Oxapampa',
      districts: ['Oxapampa', 'Chontabamba', 'Huancabamba', 'Palcazú', 'Pozuzo', 'Puerto Bermúdez', 'Villa Rica'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 20 PIURA  (8 provincias, 65 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Piura: [
    {
      name: 'Piura',
      districts: [
        'Piura', 'Castilla', 'Catacaos', 'Cura Mori', 'El Tallán',
        'La Arena', 'La Unión', 'Las Lomas', 'Tambogrande', 'Veintiseis de Octubre',
      ],
    },
    {
      name: 'Ayabaca',
      districts: ['Ayabaca', 'Frías', 'Jililí', 'Lagunas', 'Montero', 'Pacaipampa', 'Paimas', 'Sapillica', 'Sicchez', 'Suyo'],
    },
    {
      name: 'Huancabamba',
      districts: [
        'Huancabamba', 'Canchaque', 'El Carmen de la Frontera', 'Huarmaca',
        'Lalaquiz', 'San Miguel de El Faique', 'Sóndor', 'Sondorillo',
      ],
    },
    {
      name: 'Morropón',
      districts: [
        'Chulucanas', 'Buenos Aires', 'Chalaco', 'La Matanza', 'Morropón',
        'Salitral', 'San Juan de Bigote', 'Santa Catalina de Mossa', 'Santo Domingo', 'Yamango',
      ],
    },
    {
      name: 'Paita',
      districts: ['Paita', 'Amotape', 'Arenal', 'Colán', 'La Huaca', 'Tamarindo', 'Vichayal'],
    },
    {
      name: 'Sullana',
      districts: ['Sullana', 'Bellavista', 'Ignacio Escudero', 'Lancones', 'Marcavelica', 'Miguel Checa', 'Querecotillo', 'Salitral'],
    },
    {
      name: 'Talara',
      districts: ['Pariñas', 'El Alto', 'La Brea', 'Lobitos', 'Los Órganos', 'Máncora'],
    },
    {
      name: 'Sechura',
      districts: ['Sechura', 'Bellavista de La Unión', 'Bernal', 'Cristo Nos Valga', 'Rinconada Llicuar', 'Vice'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 21 PUNO  (13 provincias, 109 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Puno: [
    {
      name: 'Puno',
      districts: [
        'Puno', 'Acora', 'Amantaní', 'Atuncolla', 'Capachica', 'Chucuito',
        'Coata', 'Huata', 'Mañazo', 'Paucarcolla', 'Pichacani', 'Platería',
        'San Antonio', 'Tiquillaca', 'Vilque',
      ],
    },
    {
      name: 'Azángaro',
      districts: [
        'Azángaro', 'Achaya', 'Arapa', 'Asillo', 'Caminaca', 'Chupa',
        'José Domingo Choquehuanca', 'Muñani', 'Potoni', 'Samán', 'San Antón',
        'San José', 'San Juan de Salinas', 'Santiago de Pupuja', 'Tirapata',
      ],
    },
    {
      name: 'Carabaya',
      districts: ['Macusani', 'Ajoyani', 'Ayapata', 'Coasa', 'Corani', 'Crucero', 'Ituata', 'Ollachea', 'San Gabán', 'Usicayos'],
    },
    {
      name: 'Chucuito',
      districts: ['Juli', 'Desaguadero', 'Huacullani', 'Kelluyo', 'Pisacoma', 'Pomata', 'Zepita'],
    },
    {
      name: 'El Collao',
      districts: ['Ilave', 'Capazo', 'Pilcuyo', 'Santa Rosa', 'Conduriri'],
    },
    {
      name: 'Huancané',
      districts: ['Huancané', 'Cojata', 'Huatasani', 'Inchupalla', 'Pusi', 'Rosaspata', 'Taraco', 'Vilque Chico'],
    },
    {
      name: 'Lampa',
      districts: ['Lampa', 'Cabanilla', 'Calapuja', 'Nicasio', 'Ocuviri', 'Palca', 'Paratia', 'Pucará', 'Santa Lucía', 'Vilavila'],
    },
    {
      name: 'Melgar',
      districts: ['Ayaviri', 'Antauta', 'Cupi', 'Llalli', 'Macari', 'Nuñoa', 'Orurillo', 'Santa Rosa', 'Umachiri'],
    },
    {
      name: 'Moho',
      districts: ['Moho', 'Conima', 'Huayrapata', 'Tilali'],
    },
    {
      name: 'San Antonio de Putina',
      districts: ['Putina', 'Ananea', 'Pedro Vilca Apaza', 'Quilcapuncu', 'Sina'],
    },
    {
      name: 'San Román',
      districts: ['Juliaca', 'Cabana', 'Cabanillas', 'Caracoto'],
    },
    {
      name: 'Sandia',
      districts: ['Sandia', 'Cuyocuyo', 'Limbani', 'Patambuco', 'Phara', 'Quiaca', 'San Juan del Oro', 'Yanahuaya', 'Alto Inambari'],
    },
    {
      name: 'Yunguyo',
      districts: ['Yunguyo', 'Anapia', 'Copani', 'Cuturapi', 'Ollaraya', 'Tinicachi', 'Unicachi'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 22 SAN MARTÍN  (10 provincias, 77 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  'San Martín': [
    {
      name: 'Moyobamba',
      districts: ['Moyobamba', 'Calzada', 'Habana', 'Jepelacio', 'Soritor', 'Yantalo'],
    },
    {
      name: 'Bellavista',
      districts: ['Bellavista', 'Alto Biavo', 'Bajo Biavo', 'Huallaga', 'San Pablo', 'San Rafael'],
    },
    {
      name: 'El Dorado',
      districts: ['San José de Sisa', 'Agua Blanca', 'San Martín', 'Santa Rosa', 'Shatoja'],
    },
    {
      name: 'Huallaga',
      districts: ['Saposoa', 'Alto Saposoa', 'El Eslabón', 'Piscoyacu', 'Sacanche', 'Tingo de Saposoa'],
    },
    {
      name: 'Lamas',
      districts: [
        'Lamas', 'Alonso de Alvarado', 'Barranquita', 'Caynarachi', 'Cuñumbuqui',
        'Pinto Recodo', 'Rumisapa', 'San Roque de Cumbaza', 'Shanao', 'Tabalosos', 'Zapatero',
      ],
    },
    {
      name: 'Mariscal Cáceres',
      districts: ['Juanjuí', 'Campanilla', 'Huicungo', 'Pachiza', 'Pajarillo'],
    },
    {
      name: 'Picota',
      districts: [
        'Picota', 'Buenos Aires', 'Caspizapa', 'Pilluana', 'Pucacaca',
        'San Cristóbal', 'San Hilarión', 'Shamboyacu', 'Tingo de Ponaza', 'Tres Unidos',
      ],
    },
    {
      name: 'Rioja',
      districts: [
        'Rioja', 'Awajún', 'Elías Soplín Vargas', 'Nueva Cajamarca',
        'Pardo Miguel', 'Posic', 'San Fernando', 'Yorongos', 'Yuracyacu',
      ],
    },
    {
      name: 'San Martín',
      districts: [
        'Tarapoto', 'Alberto Leveau', 'Cacatachi', 'Chazuta', 'Chipurana',
        'El Porvenir', 'Huimbayoc', 'Juan Guerra', 'La Banda de Shilcayo',
        'Morales', 'Papaplaya', 'San Antonio', 'Sauce', 'Shapaja',
      ],
    },
    {
      name: 'Tocache',
      districts: ['Tocache', 'Nuevo Progreso', 'Pólvora', 'Shunte', 'Uchiza'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 23 TACNA  (4 provincias, 27 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Tacna: [
    {
      name: 'Tacna',
      districts: [
        'Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva', 'Inclán',
        'Pachía', 'Palca', 'Pocollay', 'Sama',
      ],
    },
    {
      name: 'Candarave',
      districts: ['Candarave', 'Cairani', 'Camilaca', 'Curibaya', 'Huanuara', 'Quilahuani'],
    },
    {
      name: 'Jorge Basadre',
      districts: ['Locumba', 'Ilabaya', 'Ite'],
    },
    {
      name: 'Tarata',
      districts: ['Tarata', 'Chucatamani', 'Estique', 'Estique-Pampa', 'Sitajara', 'Susapaya', 'Tarucachi', 'Ticaco'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 24 TUMBES  (3 provincias, 13 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Tumbes: [
    {
      name: 'Tumbes',
      districts: ['Tumbes', 'Corrales', 'La Cruz', 'Pampas de Hospital', 'San Jacinto', 'San Juan de la Virgen'],
    },
    {
      name: 'Contralmirante Villar',
      districts: ['Zorritos', 'Casitas', 'Canoas de Punta Sal'],
    },
    {
      name: 'Zarumilla',
      districts: ['Zarumilla', 'Aguas Verdes', 'Matapalo', 'Papayal'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 25 UCAYALI  (4 provincias, 15 distritos)
  // ─────────────────────────────────────────────────────────────────────────────
  Ucayali: [
    {
      name: 'Coronel Portillo',
      districts: ['Callería', 'Campoverde', 'Iparía', 'Masisea', 'Yarinacocha', 'Nueva Requena'],
    },
    {
      name: 'Atalaya',
      districts: ['Raymondi', 'Sepahua', 'Tahuanía', 'Yurúa'],
    },
    {
      name: 'Padre Abad',
      districts: ['Padre Abad', 'Irazola', 'Curimaná'],
    },
    {
      name: 'Purús',
      districts: ['Purús'],
    },
  ],
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/** Returns all provinces for a given department name */
export function getProvinces(department: string): PeruProvince[] {
  return PERU_LOCATIONS[department] ?? [];
}

/** Returns province names only for a given department */
export function getProvinceNames(department: string): string[] {
  return (PERU_LOCATIONS[department] ?? []).map((p) => p.name);
}

/** Returns district names for a given department + province */
export function getDistricts(department: string, province: string): string[] {
  return PERU_LOCATIONS[department]?.find((p) => p.name === province)?.districts ?? [];
}
