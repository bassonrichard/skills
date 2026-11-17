#!/usr/bin/env python3
"""Fetch public App Store customer reviews as JSON lines (stdlib only).

  appstore_reviews.py --search "meal planner"            # find app ids
  appstore_reviews.py 1079999103 --country us --pages 3  # ~50 reviews per page, max 10

Each line: {"source", "app_id", "country", "review_id", "rating", "title", "text", "url"}.
Reviews have no per-review permalink: cite the app URL plus the review id.
"""
import argparse, json, sys, time, urllib.parse, urllib.request


def get(url):
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.load(r)


p = argparse.ArgumentParser()
p.add_argument("app_id", nargs="?")
p.add_argument("--search")
p.add_argument("--country", default="us")
p.add_argument("--pages", type=int, default=2)
a = p.parse_args()

if a.search:
    q = urllib.parse.urlencode({"term": a.search, "entity": "software", "country": a.country, "limit": 10})
    for r in get(f"https://itunes.apple.com/search?{q}")["results"]:
        print(r["trackId"], r.get("userRatingCount", 0), r["trackName"], sep="\t")
    sys.exit()
if not a.app_id:
    p.error("give an app id or --search")

for page in range(1, min(a.pages, 10) + 1):
    feed = get(f"https://itunes.apple.com/{a.country}/rss/customerreviews/page={page}/id={a.app_id}/sortby=mostrecent/json")["feed"]
    entries = feed.get("entry", [])
    if isinstance(entries, dict):  # a single review comes back as an object, not a list
        entries = [entries]
    if not entries:
        break
    for e in entries:
        print(json.dumps({
            "source": "app-store", "app_id": a.app_id, "country": a.country,
            "review_id": e["id"]["label"], "rating": int(e["im:rating"]["label"]),
            "title": e["title"]["label"], "text": e["content"]["label"],
            "url": f"https://apps.apple.com/{a.country}/app/id{a.app_id}?see-all=reviews",
        }, ensure_ascii=False))
    time.sleep(1)  # be polite; this is a shared public feed
