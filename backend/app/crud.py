def predict_category(description: str) -> str:
    text = description.lower().strip()

    category_keywords = {
        "Road Issues": ["pothole", "road damage", "damaged road", "crack"],
        "Waste Management": ["garbage", "trash", "dump", "dustbin"],
        "Drainage & Sewage": ["drain", "sewage", "overflow", "blocked"],
        "Electrical Issues": ["streetlight", "electricity", "wire", "power", "current"],
        "Water Supply": ["water leak", "pipeline", "no water"],
        "Traffic Issues": ["traffic", "signal", "parking"],
        "Public Safety": ["dog", "unsafe", "danger", "accident"],
    }

    for category, keywords in category_keywords.items():
        if any(word in text for word in keywords):
            return category

    return "Other"


def map_department(category: str) -> str:
    mapping = {
        "Road Issues": "Roads Department",
        "Waste Management": "Sanitation Department",
        "Drainage & Sewage": "Drainage Department",
        "Electrical Issues": "Electrical Department",
        "Water Supply": "Water Works Department",
        "Traffic Issues": "Traffic Police",
        "Public Safety": "Municipal Administration",
        "Other": "General Administration",
    }

    return mapping.get(category, "General Administration")


def map_zone(address: str) -> str:
    if not address:
        return "Outside Hyderabad / Unknown"

    text = address.lower().strip()

    zone_keywords = {
        "Central Hyderabad": ["abids", "himayat nagar", "himayatnagar", "nampally"],
        "North Hyderabad": ["musheerabad", "prakasham nagar", "punjagutta"],
        "East Hyderabad": ["amberpet", "habsiguda", "jamia osmania", "tarnaka"],
        "Secunderabad": ["begumpet", "bolarum", "jeedimetla", "marredpally", "sanathnagar", "trimulgherry"],
        "South Hyderabad": ["afzal gunj", "dilsukhnagar", "keshavagiri", "lal darwaza", "ntr nagar", "umda bazar"],
        "West Hyderabad": ["banjara hills", "hitech city", "jubilee hills", "langar house", "mehdipatnam"],
    }

    for zone, keywords in zone_keywords.items():
        if any(keyword in text for keyword in keywords):
            return zone

    return "Outside Hyderabad / Unknown"