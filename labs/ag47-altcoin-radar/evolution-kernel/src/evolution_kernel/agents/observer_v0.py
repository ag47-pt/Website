import os
import json
import datetime
import platform
import subprocess

def get_git_state(target_dir):
    try:
        branch = subprocess.check_output(["git", "branch", "--show-current"], cwd=target_dir, stderr=subprocess.STDOUT).decode().strip()
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=target_dir, stderr=subprocess.STDOUT).decode().strip()
        return branch, bool(status)
    except Exception:
        return "unknown", False

def count_loc(target_dir):
    loc = 0
    total_files = 0
    dirs = set()
    key_files = []
    
    for root, _, files in os.walk(target_dir):
        # exclude common hidden dirs
        if '.git' in root or '.evolution' in root or '__pycache__' in root:
            continue
            
        rel_root = os.path.relpath(root, target_dir)
        if rel_root != '.':
            top_dir = rel_root.split(os.sep)[0]
            dirs.add(top_dir)
            
        for f in files:
            if f.endswith(('.py', '.js', '.ts', '.md', '.json')):
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
                    
    return loc, total_files, list(dirs), key_files

def run_observer(target_dir):
    project_id = os.path.basename(os.path.abspath(target_dir))
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    
    loc, total_files, directories, key_files = count_loc(target_dir)
    git_branch, git_dirty = get_git_state(target_dir)
    
    snapshot = {
        "$schema": "../../schemas/core/system-snapshot.schema.json",
        "project_id": project_id,
        "timestamp": timestamp,
        "environment": {
            "os": platform.system(),
            "language": "python" if any(f.endswith('.py') for f in key_files) else "unknown",
            "frameworks": []
        },
        "architecture": {
            "directories": directories,
            "key_files": key_files
        },
        "state": {
            "git_branch": git_branch,
            "dirty": git_dirty
        },
        "metrics": {
            "total_files": total_files,
            "lines_of_code": loc
        }
    }
    
    out_dir = os.path.join(target_dir, ".evolution", "runtime", "active-task")
    os.makedirs(out_dir, exist_ok=True)
    
    out_path = os.path.join(out_dir, "01_system_snapshot.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(snapshot, f, indent=2)
        
    print(f"Observer v0 completed. Snapshot generated at {out_path}")
    print(json.dumps(snapshot, indent=2))

if __name__ == '__main__':
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    run_observer(target)
