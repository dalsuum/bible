#!/usr/bin/env python3
import spacy
import json

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Sample Verse
verse = "Samson killed 1000 Philistines with the jawbone of a donkey."
doc = nlp(verse)

# Extract Entities
entities = {"people": [], "places": [], "actions": [], "numbers": [], "tools": []}

for token in doc:
    if token.ent_type_ == "PERSON":
        entities["people"].append(token.text)
    elif token.pos_ == "VERB":
        entities["actions"].append(token.text)
    elif token.ent_type_ == "CARDINAL":
        entities["numbers"].append(token.text)

# Example: Detect "tools" based on dependency parsing
for chunk in doc.noun_chunks:
    if "jawbone" in chunk.text or "staff" in chunk.text:
        entities["tools"].append(chunk.text)

print(json.dumps(entities, indent=2))