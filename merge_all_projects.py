#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Merger script to integrate all Chilean architectural projects into proyectos_arquitectura.json."""

import json
import re
from data_period_1 import period_1
from data_period_2 import period_2
from data_period_3 import period_3
from data_period_4 import period_4
from data_period_5 import period_5
from data_period_6 import period_6

all_new_periods = period_1 + period_2 + period_3 + period_4 + period_5 + period_6
print(f"Total projects defined across 6 periods: {len(all_new_periods)}")

with open("proyectos_arquitectura.json", "r", encoding="utf-8") as f:
    existing_db = json.load(f)

print(f"Existing projects in DB: {len(existing_db)}")

def normalize_text(t):
    t = t.lower()
    for src, dst in [("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"), ("ñ", "n"), ("ü", "u")]:
        t = t.replace(src, dst)
    return re.sub(r'[^a-z0-9]', '', t)

# Index existing projects by ID and normalized name
existing_by_id = {p["id"]: p for p in existing_db}
existing_by_norm_name = {normalize_text(p["nombre_proyecto"]): p for p in existing_db}

added_count = 0
updated_count = 0

for new_p in all_new_periods:
    norm_name = normalize_text(new_p["nombre_proyecto"])
    matched = None

    if new_p["id"] in existing_by_id:
        matched = existing_by_id[new_p["id"]]
    elif norm_name in existing_by_norm_name:
        matched = existing_by_norm_name[norm_name]
    else:
        # Check partial matching
        for k, v in existing_by_norm_name.items():
            if (norm_name in k or k in norm_name) and len(norm_name) > 6 and len(k) > 6:
                matched = v
                break

    if matched:
        # Update fields cleanly
        for key, val in new_p.items():
            if val is not None and val != "":
                matched[key] = val
        # Ensure photography fallback is preserved if existing had a photo
        updated_count += 1
    else:
        existing_db.append(new_p)
        existing_by_id[new_p["id"]] = new_p
        existing_by_norm_name[norm_name] = new_p
        added_count += 1

print(f"Merge summary: {added_count} added, {updated_count} updated. Total now: {len(existing_db)}")

with open("proyectos_arquitectura.json", "w", encoding="utf-8") as f:
    json.dump(existing_db, f, ensure_ascii=False, indent=2)

print("Saved updated proyectos_arquitectura.json successfully.")
