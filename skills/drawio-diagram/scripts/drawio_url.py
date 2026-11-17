#!/usr/bin/env python3
"""Build a draw.io link for a diagram read from stdin and open it in the browser.

Usage: drawio_url.py mermaid|xml|csv [--no-open] < diagram.txt
Prints the URL. The URL embeds compressed data, so never retype it by hand.
"""

import base64
import json
import subprocess
import sys
import zlib
from urllib.parse import quote


def drawio_url(diagram_type: str, code: str) -> str:
    compressor = zlib.compressobj(9, zlib.DEFLATED, -15)
    raw = compressor.compress(quote(code, safe="").encode("utf-8")) + compressor.flush()
    payload = json.dumps({"type": diagram_type, "compressed": True, "data": base64.b64encode(raw).decode()})

    return f"https://app.diagrams.net/?pv=0&grid=0#create={quote(payload, safe='')}"


def _decode(url: str) -> str:
    payload = json.loads(__import__("urllib.parse").parse.unquote(url.split("#create=", 1)[1]))
    raw = zlib.decompress(base64.b64decode(payload["data"]), -15)

    return __import__("urllib.parse").parse.unquote(raw.decode("utf-8"))


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in {"mermaid", "xml", "csv"}:
        sys.exit(__doc__)
    source = sys.stdin.read()
    url = drawio_url(sys.argv[1], source)
    assert _decode(url) == source, "round-trip failed"
    print(url)
    if "--no-open" not in sys.argv:
        subprocess.run(["open", url], check=False)
