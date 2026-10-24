#!/usr/bin/env python3
"""Erzeugt die Offline-Dateiliste fuer die Android-App (Bilder/Texturen von Wikimedia + eigene Dateien)."""
import os, re, sys
from urllib.parse import quote

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p):
    try:
        return open(os.path.join(R, p), encoding="utf-8").read()
    except Exception:
        return ""
def q(n):
    return quote(n, safe="()_.,-%'!~*$&+=:@/")
out = []
# eigene Dateien
pub = os.path.join(R, "public")
out.append("/sternenhimmel.html")
for f in sorted(os.listdir(pub)):
    if re.match(r"sky-.*\.js$", f) or f == "kepler-data.json":
        out.append("/" + f)
for d in ("sky-art", "sky-data", "sky-audio"):
    for root, _, files in os.walk(os.path.join(pub, d)):
        for f in sorted(files):
            out.append("/" + os.path.relpath(os.path.join(root, f), pub).replace(os.sep, "/"))
FP = "https://commons.wikimedia.org/wiki/Special:FilePath/"
def add_fp(text, rx, width):
    for m in re.finditer(rx, text):
        out.append(f"{FP}{q(m.group(1))}?width={width}")
add_fp(rd("src/app/universum/page.tsx"), r'commonsFile\("([^"]+)"\)', 800)
sol = rd("src/data/solarSystem.ts")
add_fp(sol, r'commonsFile\("([^"]+)"\)', 700)
add_fp(sol, r'\{ file: "([^"]+)"', 400)
add_fp(rd("src/components/universe/SpaceCalculators.tsx"), r'\bcm\("([^"]+)"\)', 240)
sc = rd("src/components/universe/SizeComparison.tsx")
base = "https://upload.wikimedia.org/wikipedia/commons/"
for m in re.finditer(r'\btex: "([^"]+)"', sc):
    out.append(base + m.group(1))
for m in re.finditer(r'photo: \["([^"]+)"', sc):
    out.append(base + m.group(1))
for m in re.finditer(r'"(https://upload\.wikimedia\.org/[^"]+)"', rd("src/components/universe/SolarSystem3D.tsx")):
    out.append(m.group(1))
seen = set(); res = []
for x in out:
    if x not in seen:
        seen.add(x); res.append(x)
sys.stdout.write("\n".join(res) + "\n")
