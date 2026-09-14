import json
import re

# Canonical styles in chronological order
VALID_ESTILOS = [
    'Arquitectura Renacentista',
    'Arquitectura Manierista',
    'Arquitectura Barroca',
    'Arquitectura Neoclásica',
    'Historicismo',
    'Arquitectura del Hierro y Cristal',
    'Art Nouveau',
    'Art Déco',
    'Expresionismo',
    'Constructivismo',
    'Racionalismo',
    'Funcionalismo',
    'Estilo Internacional',
    'Organicismo',
    'Brutalismo',
    'Posmodernismo',
    'Deconstructivismo',
    'High-Tech',
    'Minimalismo',
    'Parametrismo'
]

# Canonical programs
VALID_PROGRAMAS = [
    'Vivienda',
    'Hospedaje',
    'Centros Médicos',
    'Educacional',
    'Comercial',
    'Cultural',
    'Institucional / Gubernamental',
    'Religioso',
    'Deportivo',
    'Infraestructura'
]

print("Script template ready")
