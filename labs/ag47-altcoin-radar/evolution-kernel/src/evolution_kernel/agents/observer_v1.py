import os
import json
import datetime
import platform
import subprocess
import re

def get_git_state(target_dir):
    try:
        branch = subprocess.check_output(["git", "branch", "--show-current"], cwd=target_dir, stderr=subprocess.STDOUT).decode().strip()
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=target_dir, stderr=subprocess.STDOUT).decode().strip()
        return branch, bool(status)
    except Exception:
        return "unknown", False

def detect_dependencies(target_dir):
    deps = []
    
    # Python requirements
    req_path = os.path.join(target_dir, 'requirements.txt')
    if os.path.exists(req_path):
        with open(req_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    # simple parsing
                    parts = re.split(r'==|>=|<=', line)
                    name = parts[0].strip()
                    version = parts[1].strip() if len(parts) > 1 else "unknown"
                    if name:
                        deps.append({"name": name, "version": version, "source": "requirements.txt"})

    # Node package.json
    pkg_path = os.path.join(target_dir, 'package.json')
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
                for name, version in all_deps.items():
                    deps.append({"name": name, "version": version, "source": "package.json"})
        except:
            pass

    return deps

def extract_insights(target_dir):
    loc = 0
    total_files = 0
    dirs = set()
    key_files = []
    
    ext_counts = {}
    
    for root, _, files in os.walk(target_dir):
        if '.git' in root or '.evolution' in root or '__pycache__' in root or 'node_modules' in root:
            continue
            
        rel_root = os.path.relpath(root, target_dir)
        if rel_root != '.':
            top_dir = rel_root.split(os.sep)[0]
            dirs.add(top_dir)
            
        for f in files:
            ext = os.path.splitext(f)[1]
            ext_counts[ext] = ext_counts.get(ext, 0) + 1
            
            if f.endswith(('.py', '.js', '.ts', '.md', '.json', '.txt', '.toml')):
                total_files += 1
                file_path = os.path.join(root, f)
                rel_path = os.path.relpath(file_path, target_dir)
                if rel_root == '.':
                    key_files.append(rel_path)
                try:
                    with open(file_path, 'r', encoding='utf-8') as fp:
                        loc += len(fp.readlines())
                except:
                    pass

    # Basic language detection
    language = "unknown"
    if ext_counts.get('.py', 0) > ext_counts.get('.js', 0) and ext_counts.get('.py', 0) > ext_counts.get('.ts', 0):
        language = "Python"
    elif ext_counts.get('.ts', 0) > ext_counts.get('.js', 0):
        language = "TypeScript"
    elif ext_counts.get('.js', 0) > 0:
        language = "JavaScript"

    # Architecture Signals
    arch_patterns = []
    if 'apps' in dirs and 'packages' in dirs:
        arch_patterns.append("monorepo")
    if 'services' in dirs:
        arch_patterns.append("service-oriented")
    if 'src' in dirs:
        arch_patterns.append("src-layout")

    # Frameworks
    frameworks = []
    deps = detect_dependencies(target_dir)
    dep_names = [d['name'].lower() for d in deps]
    
    if "fastapi" in dep_names: frameworks.append("FastAPI")
    if "flask" in dep_names: frameworks.append("Flask")
    if "django" in dep_names: frameworks.append("Django")
    if "react" in dep_names: frameworks.append("React")
    if "next" in dep_names: frameworks.append("Next.js")
    if "express" in dep_names: frameworks.append("Express")

    # Tests Discovery
    test_frameworks = []
    if "pytest" in dep_names: test_frameworks.append("pytest")
    if "jest" in dep_names: test_frameworks.append("jest")
    
    has_tests_folder = any(d in ['tests', '__tests__', 'spec'] for d in dirs)
    if has_tests_folder and not test_frameworks:
        test_frameworks.append("unknown-test-framework")

    # Risks
    risks = []
    if not has_tests_folder:
        risks.append({"type": "missing_tests", "severity": "medium"})
    if not deps:
        risks.append({"type": "no_dependency_manifest_detected", "severity": "low"})

    return {
        "loc": loc,
        "total_files": total_files,
        "directories": list(dirs),
        "key_files": key_files,
        "language": language,
        "arch_patterns": arch_patterns,
        "deps": deps,
        "frameworks": frameworks,
        "test_frameworks": test_frameworks,
        "risks": risks
    }

def run_observer(target_dir):
    project_id = os.path.basename(os.path.abspath(target_dir))
    timestamp = datetime.datetime.now(datetime.UTC).isoformat().replace("+00:00", "Z")
    
    git_branch, git_dirty = get_git_state(target_dir)
    insights = extract_insights(target_dir)
    
    snapshot = {
        "$schema": "../../schemas/core/system-snapshot.schema.json",
        "project_id": project_id,
        "timestamp": timestamp,
        "environment": {
            "os": platform.system(),
            "language": insights['language'],
            "frameworks": insights['frameworks']
        },
        "architecture": {
            "directories": insights['directories'],
            "key_files": insights['key_files'],
            "architecture_patterns": insights['arch_patterns']
        },
        "dependencies": insights['deps'],
        "test_frameworks": insights['test_frameworks'],
        "risks": insights['risks'],
        "state": {
            "git_branch": git_branch,
            "dirty": git_dirty
        },
        "metrics": {
            "total_files": insights['total_files'],
            "lines_of_code": insights['loc']
        }
    }
    
    out_dir = os.path.join(target_dir, ".evolution", "runtime", "active-task")
    os.makedirs(out_dir, exist_ok=True)
    
    out_path = os.path.join(out_dir, "01_system_snapshot.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(snapshot, f, indent=2)
        
    print(f"Observer v1 completed. Snapshot generated at {out_path}")
    print(json.dumps(snapshot, indent=2))

if __name__ == '__main__':
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    run_observer(target)
