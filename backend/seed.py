import os
import sys
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

def future(offset_days: int, hour: int = 10) -> str:
    dt = datetime.now(timezone.utc) + timedelta(days=offset_days)
    dt = dt.replace(hour=hour, minute=0, second=0, microsecond=0)
    return dt.isoformat().replace("+00:00", "Z")

SEED_MEETS = [
    {
        "name": "Dublin Cars & Coffee — Point Village",
        "description": "Sunday morning cars & coffee at The Point Village car park, Dublin Docklands. Coffee vans on site, family friendly, all makes welcome.",
        "date": future(3, 9), "location_name": "The Point Village, Dublin",
        "address": "Point Square, North Wall Quay, Dublin 1, D01 H104",
        "lat": 53.3475, "lon": -6.2312, "category": "CarsCoffee", "fuel_type": "Petrol",
        "family_friendly": True, "featured": True, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "Cork Cars & Coffee — Ballincollig Park",
        "description": "Monthly Cork gathering in the main Ballincollig Regional Park layout. Coffee truck on site from 09:30. German, JDM, and EV cars welcome.",
        "date": future(10, 10), "location_name": "Ballincollig Regional Park",
        "address": "Innishmore, Ballincollig, Co. Cork, P31 KP94",
        "lat": 51.8867, "lon": -8.5940, "category": "CarsCoffee", "fuel_type": "Petrol",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "Mondello Park Trackday — Full Circuit",
        "description": "Official trackday on the full 3.5 km international loop circuit. Separate novice, intermediate, and advanced speed slots.",
        "date": future(14, 9), "location_name": "Mondello Park Circuit",
        "address": "Mondello Park, Caragh, Naas, Co. Kildare, W91 EF88",
        "lat": 53.2571, "lon": -6.7386, "category": "Track", "fuel_type": "Petrol",
        "family_friendly": False, "featured": True, "status": "ACTIVE", "price": "€199"
    },
    {
        "name": "Galway Cars & Coffee — Salthill Prom",
        "description": "Salthill promenade meet with an Atlantic backdrop. Park up along the coast and grab a hot beverage from local vendors.",
        "date": future(17, 11), "location_name": "Salthill Promenade",
        "address": "Salthill Promenade, Salthill, Galway, H91 CX03",
        "lat": 53.2586, "lon": -9.0729, "category": "CarsCoffee", "fuel_type": "Petrol",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "Limerick Cars & Coffee — UL Campus",
        "description": "University of Limerick campus static car meet. Strict rules to respect neighbours. Great turnout of performance builds expected.",
        "date": future(9, 10), "location_name": "University of Limerick",
        "address": "University of Limerick, Castletroy, Co. Limerick, V94 T9PX",
        "lat": 52.6739, "lon": -8.5721, "category": "CarsCoffee", "fuel_type": "Petrol",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "Dundalk Cars & Coffee — DKIT Layout",
        "description": "Border region monthly static gathering. Northern and Southern registration plates equally welcome to park up.",
        "date": future(6, 10), "location_name": "Dundalk Institute of Technology",
        "address": "Dundalk Institute of Technology, Dublin Rd, Dundalk, Co. Louth, A91 K584",
        "lat": 54.0016, "lon": -6.3968, "category": "CarsCoffee", "fuel_type": "Petrol",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "Mondello Open Evening — Novice Slots",
        "description": "Introductory evening track layout access tailored strictly for trackday beginners. Full safety briefings and control tips on pit lane.",
        "date": future(4, 18), "location_name": "Mondello Park Circuit",
        "address": "Mondello Park, Caragh, Naas, Co. Kildare, W91 EF88",
        "lat": 53.2571, "lon": -6.7386, "category": "Track", "fuel_type": "Petrol",
        "family_friendly": False, "featured": False, "status": "ACTIVE", "price": "€95"
    },
    {
        "name": "Irish EV Performance Track Session",
        "description": "Dedicated quiet track session for high-torque electric vehicles. Test instant acceleration limits safely away from roads.",
        "date": future(21, 10), "location_name": "Mondello Park Circuit",
        "address": "Mondello Park, Caragh, Naas, Co. Kildare, W91 EF88",
        "lat": 53.2571, "lon": -6.7386, "category": "Track", "fuel_type": "EV",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "€120"
    },
    {
        "name": "JDM Ireland — Portlaoise Gathering",
        "description": "Japanese Domestic Market night car meet. Modified stance tuners, retro performance cars, and import car crews assembly.",
        "date": future(2, 20), "location_name": "Plaza Car Park, Portlaoise",
        "address": "Portlaoise Plaza, Midway, Abbeyleix Rd, Portlaoise, Co. Laois, R32 YW20",
        "lat": 53.0142, "lon": -7.3194, "category": "Modified", "fuel_type": "Petrol",
        "family_friendly": False, "featured": True, "status": "ACTIVE", "price": "Free"
    },
    {
        "name": "RDS Classic Motor Exposition",
        "description": "Premium heritage vehicle assembly and restoration show. Highlighting pristine vintage vehicles across Ireland.",
        "date": future(28, 11), "location_name": "RDS Main Hall, Dublin",
        "address": "Royal Dublin Society, Merrion Rd, Dublin 4, D04 AK83",
        "lat": 53.3262, "lon": -6.2281, "category": "Classic", "fuel_type": "Petrol",
        "family_friendly": True, "featured": False, "status": "ACTIVE", "price": "€15"
    },
    {
        "name": "Watergrasshill Drift Dynamic Assembly",
        "description": "Pro-am competitive drifting showcase matches. Speed clipping zones and twin battle track run demonstrations live.",
        "date": future(5, 12), "location_name": "Watergrasshill Arena, Cork",
        "address": "Watergrasshill Track, Lyre, Watergrasshill, Co. Cork, T56 KH67",
        "lat": 52.0125, "lon": -8.3241, "category": "Drift", "fuel_type": "Petrol",
        "family_friendly": False, "featured": False, "status": "ACTIVE", "price": "€20"
    },
    {
        "name": "Wild Atlantic Way EV Charity Cruise",
        "description": "Scenic silent cruise mapping out regional coastal lines. Raising winter health awareness group donation funds.",
        "date": future(12, 10), "location_name": "Salthill Base, Galway",
        "address": "Salthill Car Park Base, Galway, H91 CX03",
        "lat": 53.2586, "lon": -9.0729, "category": "Charity", "fuel_type": "EV",
        "family_friendly": True, "featured": True, "status": "ACTIVE", "price": "Donation"
    }
]

def main():
    mongo_url = os.environ.get("MONGO_URI", "mongodb://mongo:27017/crystalmeets")
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=2000)
        db = client.get_default_database()
        collection = db["meets"]
        inserted = 0
        for meet in SEED_MEETS:
            if not collection.find_one({"name": meet["name"]}):
                collection.insert_one(meet)
                inserted += 1
        print(f"✓ Success! Seeded {inserted} new Irish car meets into database.")
    except Exception as e:
        print(f"✕ Seed failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
