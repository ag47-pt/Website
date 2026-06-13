import os
import sys
import re

def patch_skill(file_path, section_name, new_content):
    if not os.path.exists(file_path):
        return f"Error: {file_path} not found."
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter and body
    parts = re.split(r'^---$', content, flags=re.MULTILINE)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        is_skill = True
    else:
        frontmatter = ""
        body = content
        is_skill = False

    # Look for section header
    header_pattern = rf"##\s+{re.escape(section_name)}.*?(?=##|\Z)"
    if re.search(header_pattern, body, re.DOTALL):
        # Update existing section
        new_body = re.sub(header_pattern, f"## {section_name}\n{new_content}\n\n", body, flags=re.DOTALL)
    else:
        # Append as new section
        new_body = body.rstrip() + f"\n\n## {section_name}\n{new_content}\n"

    # Rebuild file
    if is_skill:
        final_content = f"---\n{frontmatter}\n---\n{new_body}"
    else:
        final_content = new_body
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    return f"Successfully patched {section_name} in {file_path}"

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python skill_patcher.py <file_path> <section_name> <new_content>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    section_name = sys.argv[2]
    new_content = sys.argv[3]
    
    print(patch_skill(file_path, section_name, new_content))
