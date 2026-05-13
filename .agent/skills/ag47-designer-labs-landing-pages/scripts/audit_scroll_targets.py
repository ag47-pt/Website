import os
import re
import sys

def audit_scroll_patterns(directory):
    print("🚀 Starting Ag47 Scroll Offset & Target Audit...")
    
    # Pattern to check for the global offset in RestagLayout
    layout_pattern = re.compile(r'const\s+offset\s*=\s*50;')
    # Pattern to check if sections have enough padding or scroll-margin
    padding_pattern = re.compile(r'id=["\'].*?["\'].*?className=["\'].*?pt-12.*?["\']')
    
    issues = 0
    
    for root, dirs, files in os.walk(directory):
        if "node_modules" in root or ".next" in root:
            continue
            
        for file in files:
            if file.endswith("Layout.tsx"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "scrollToSection" in content and not layout_pattern.search(content):
                        print(f"⚠️  [CRITICAL] {file}: Layout uses a non-standard scroll offset. Expected 50px.")
                        issues += 1
            
            if file.endswith("Client.tsx") or (file.endswith("page.tsx") and "labs" in root):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Check for sections with IDs but no pt-12 or scroll-mt
                    sections = re.findall(r'<section\s+id=["\'](.*?)["\']', content)
                    for section in sections:
                        if section != "hero" and not "pt-12" in content and not "scroll-mt" in content:
                            print(f"⚠️  [WARNING] {file}: Section '{section}' might have insufficient top spacing for navigation targets.")
                            issues += 1

    if issues == 0:
        print("✅ Audit Complete: All scroll patterns are compliant with Labs Blueprint v2.5.")
    else:
        print(f"❌ Audit Complete: {issues} potential alignment issues found.")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    audit_scroll_patterns(target_dir)
