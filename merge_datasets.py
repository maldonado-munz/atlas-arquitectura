#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Merges existing proyectos_arquitectura.json with Arica, Tarapacá, and Antofagasta datasets."""
import json

with open("proyectos_arquitectura.json", "r", encoding="utf-8") as f:
    orig = json.load(f)

with open("data_arica_100.json", "r", encoding="utf-8") as f:
    arica = json.load(f)

with open("data_tarapaca_100.json", "r", encoding="utf-8") as f:
    tarapaca = json.load(f)

with open("data_antofagasta_100.json", "r", encoding="utf-8") as f:
    antofagasta = json.load(f)

merged_dict = {}

# Load original
for p in orig:
    merged_dict[p["id"]] = p

# Merge Arica, Tarapacá, Antofagasta
for batch in [arica, tarapaca, antofagasta]:
    for p in batch:
        merged_dict[p["id"]] = p

merged_list = list(merged_dict.values())
print(f"Total merged projects: {len(merged_list)}")

with open("proyectos_arquitectura.json", "w", encoding="utf-8") as f:
    json.dump(merged_list, f, ensure_ascii=False, indent=2)

print("Saved to proyectos_arquitectura.json successfully!")
