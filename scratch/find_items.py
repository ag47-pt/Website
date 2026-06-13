import re

path_html = r"C:\Users\moise\.gemini\antigravity-ide\brain\a322ada4-ac2c-4e64-9525-c020c6993690\.system_generated\steps\119\content.md"

with open(path_html, "r", encoding="utf-8") as f:
    html_content = f.read()

# Let's search for "brunch" and print matches of names, prices and descriptions following it
# We can find all matches of name, price, description in the file and print them all
matches = re.finditer(r'\\\"name\\\"\:([^,]+)\,\\\"price\\\"\:([^,]+)\,\\\"description\\\"\:([^,]+)', html_content)
all_items = []
for m in matches:
    name = m.group(1).strip('\\"')
    price = m.group(2).strip('\\"')
    desc = m.group(3).strip('\\"')
    all_items.append((name, price, desc))

print("Total items found:", len(all_items))
print("--- Food Items (after item 30) ---")
for idx, (name, price, desc) in enumerate(all_items):
    if idx >= 30:
        print(f"{idx}: {name} ({price}): {desc}")
