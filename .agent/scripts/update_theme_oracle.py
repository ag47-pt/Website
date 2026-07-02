import re

filepath = 'c:/Users/moise/Desktop/Agencia47/DEV/DEVELOPING/SANDBOX/Ag47.pt/labs/oracle-trader-footboll/oracle-trader-panel.tsx'
content = open(filepath, 'r', encoding='utf-8').read()

# 1. Import useTheme
if "from '@/context/ThemeContext'" not in content:
    content = content.replace(
        "import { motion, AnimatePresence } from 'framer-motion';", 
        "import { motion, AnimatePresence } from 'framer-motion';\nimport { useTheme } from '@/context/ThemeContext';"
    )

# 2. Setup theme inside component
if "const { theme } = useTheme();" not in content:
    setup_code = """  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary || '#10b981';
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '16 185 129';
  };
  const primaryRgb = hexToRgb(primaryColor);
"""
    content = content.replace("export default function OracleTraderPanel() {\n", "export default function OracleTraderPanel() {\n" + setup_code)

# 3. Add to root div
if "--theme-primary-rgb" not in content:
    content = content.replace(
        """className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-emerald-500/30" style={{ '--accent': '#10b981' } as React.CSSProperties}""",
        """className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-[rgb(var(--theme-primary-rgb)_/_0.3)]" style={{ '--accent': primaryColor, '--theme-primary': primaryColor, '--theme-primary-rgb': primaryRgb } as React.CSSProperties}"""
    )

# 4. Regex replacements for Tailwind classes
content = re.sub(r'text-emerald-\d+', r'text-[color:var(--theme-primary)]', content)

def bg_op_replacer(m):
    op = float(m.group(1)) / 100
    return f"bg-[rgb(var(--theme-primary-rgb)_/_{op})]"
content = re.sub(r'bg-emerald-\d+/(\d+)', bg_op_replacer, content)
content = re.sub(r'bg-emerald-\d+(?!\/)', r'bg-[color:var(--theme-primary)]', content)

def border_op_replacer(m):
    op = float(m.group(1)) / 100
    return f"border-[rgb(var(--theme-primary-rgb)_/_{op})]"
content = re.sub(r'border-emerald-\d+/(\d+)', border_op_replacer, content)
content = re.sub(r'border-emerald-\d+(?!\/)', r'border-[color:var(--theme-primary)]', content)

def gradient_op_replacer(m):
    return f"{m.group(1)}-[rgb(var(--theme-primary-rgb)_/_{float(m.group(2)) / 100})]"
content = re.sub(r'(from|via|to)-emerald-\d+/(\d+)', gradient_op_replacer, content)
content = re.sub(r'(from|via|to)-emerald-\d+(?!\/)', r'\1-[color:var(--theme-primary)]', content)

content = re.sub(r'fill-emerald-\d+', r'fill-[color:var(--theme-primary)]', content)

def shadow_replacer(m):
    return f"shadow-[{m.group(1)}rgb(var(--theme-primary-rgb)_/_{m.group(2)})]"
content = re.sub(r'shadow-\[([a-zA-Z0-9_\-]+)rgba\(16,185,129,([0-9.]+)\)\]', shadow_replacer, content)
content = re.sub(r'rgba\(16,185,129,([0-9.]+)\)', r'rgb(var(--theme-primary-rgb) / \1)', content)

content = content.replace('#10b981', 'var(--theme-primary)')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
