#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

with open("proyectos_arquitectura.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Loaded {len(data)} projects")
