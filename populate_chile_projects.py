#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import uuid

with open("proyectos_arquitectura.json", "r", encoding="utf-8") as f:
    current_data = json.load(f)

print(f"Loaded {len(current_data)} existing projects.")
